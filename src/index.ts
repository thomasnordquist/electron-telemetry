import { ElectronTelemetrySource, ElectronStorage } from './ElectronTelemetrySource'
import { HttpSink } from './sinks/http/HttpSink'
import { Telemetry } from './Telemetry';
import { ipcRenderer, ipcMain } from 'electron'
import { SimilarToError, ElectronEventSource } from './Model';
import { v4 } from 'uuid'

const TRACK_ERROR = 'telemetry/track/error'
const TRACK_EVENT = 'telemetry/track/event'

export const electronTelemetryFactory = (appId: string) => {
  let telemetryStorage = new ElectronStorage('data')
  let uuidStorage = new ElectronStorage('uuid')
  let uuid: string | undefined
  try {
    uuid = uuidStorage.load()
  } catch {
    // ignore
  }

  if (!uuid) {
    uuid = v4()
    try {
      uuidStorage.persist(uuid)
    } catch {
      // ignore
    }
  }

  const httpSink = HttpSink.withStoredEvents(telemetryStorage, appId, uuid)
  let telemetry = new Telemetry(new ElectronTelemetrySource(), httpSink)

  ipcMain.on(TRACK_ERROR, (event: any, error: SimilarToError) => {
    telemetry.trackError({...error, source: ElectronEventSource.renderer})
  })
  ipcMain.on(TRACK_EVENT, (event: any, name: string) => {
    telemetry.trackEvent(name)
  })

  return telemetry
}

declare var window: Window
class ElectronRendererTelemetry {
  public registerErrorHandler() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', function(event) { 
        ipcRenderer.send(TRACK_ERROR, { stack: event.error.stack, message: event.error.message })    
      })

      window.addEventListener('unhandledrejection', (event) => {
        ipcRenderer.send(TRACK_ERROR, { stack: event.reason.stack, message: event.reason.message })    
        console.warn(`WARNING: Unhandled promise rejection. Reason: ${event.reason}`, event)
      })
    }
  }

  trackError(error: Error) {
    ipcRenderer.send(TRACK_ERROR, { name: error.name, stack: error.stack, message: error.message })    
  }

  trackEvent(name: string) {
    ipcRenderer.send(TRACK_EVENT, name) 
  }
}

export const electronRendererTelementry = new ElectronRendererTelemetry()