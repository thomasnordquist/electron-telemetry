import { Message, Persistance, SimilarToError, CustomEvent } from '../../Model'
import { Sink } from '../Sink'
import config from '../../config'
import api from './Api'
import { v4 as uuid } from 'uuid'

export class HttpSink implements Sink {
  private transactions: Message[]
  private persistence: Persistance
  private appId: string
  private uuid: string

  private constructor(messages: Message[], persistence: Persistance, appId: string, uuid: string) {
    this.transactions = messages
    this.persistence = persistence
    this.appId = appId
    this.uuid = uuid
  }

  private getCurrentMessage(): Message {
    this.ensureMessageExists()
    const lastIndex = this.transactions.length-1
    return this.transactions[lastIndex]
  }

  private setCurrentMessage(message: Message): void {
    this.ensureMessageExists()
    const lastIndex = this.transactions.length-1
    this.transactions[lastIndex] = message
  }

  private ensureMessageExists() {
    if (this.transactions.length === 0) {
      this.createNewTransaction()
    }
  }

  private createNewTransaction() {
    this.transactions.push({})
  }

  public merge(message: Message) {
    if (this.getCurrentMessage().transactionId) {
      this.createNewTransaction()
      return
    }

    this.setCurrentMessage({
      ...this.getCurrentMessage(),
      ...message
    })
  }

  private hasData(): Boolean {
    try {
      // Todo, Object.keys().length should be faster
      return JSON.stringify(this.getCurrentMessage()) !== '{}'
    } catch {
      // Clear if it can't be serialized
      // Todo, maybe move to publish
      this.setCurrentMessage({})
    }

    return false
  }

  public trackCustomEvent(event: CustomEvent) {
    const message = this.getCurrentMessage()
    if (!message.customEvents) {
      message.customEvents = []
    }
    event.time = Date.now()

    message.customEvents.push(event)
  }

  public trackEvent(eventName: string) {
    const message = this.getCurrentMessage()
    if (!message.events) {
      message.events = {}
    }

    if (!Array.isArray(message.events[eventName])) {
      message.events[eventName] = []
    }

    message.events[eventName].push(Date.now())
  }

  public trackError(error: SimilarToError) {
    console.error(error)

    const message = this.getCurrentMessage()
    if (!Array.isArray(message.errors)) {
      message.errors = []
    }

    message.errors.push({
      time: Date.now(),
      message: error.message,
      name: error.name,
      stack: error.stack,
    })
    this.commit()
  }

  static withStoredEvents(persistence: Persistance, appId: string, uuid: string): HttpSink {
    try {
      const data = persistence.load()
      if (data) {
        let parsedJson = JSON.parse(data)
        if (!Array.isArray(parsedJson)) {
          parsedJson = []
        }
        return new HttpSink(parsedJson, persistence, appId, uuid)
      }
    } catch {
      // ignore io errors
    }
    return new HttpSink([], persistence, appId, uuid)
  }

  public async commit() {
    if (!this.hasData()) {
      return
    }

    this.merge({
      committed: Date.now(),
      uuid: this.uuid,
      transactionId: uuid(),
      protocol: 1,
    })
    this.store()

    this.transactions.forEach(transaction => {
      transaction.sent = Date.now()
    })

    try {
      await api.post(`${config.telemetryHost}/app/${this.appId}`, this.transactions)
      this.transactions = []
      this.store()
    } catch(error) {
      console.warn(error)
      // clean up
      this.transactions.forEach(transaction => {
        transaction.sent = undefined
      })
    }
  }

  public store() {
    try {
      this.persistence.persist(JSON.stringify(this.transactions))
    } catch {
      // ignore io errors
    }
  }
}
