import { Message, SimilarToError } from '../Model'

export interface Sink {
    commit(): void
    merge(message: Message): void
    trackEvent(eventName: string): void
    trackError(error: SimilarToError): void
}