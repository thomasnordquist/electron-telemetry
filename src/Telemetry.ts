import { SimilarToError, TelemetrySource, ElectronEventSource, CustomEvent } from './Model';
import { Sink } from './sinks/Sink';
const APP_STARTED = 'APP_STARTED'

export class Telemetry {
  private lastEvent: Date;
  private eventSink: Sink;
  private source: TelemetrySource;

  constructor(source: TelemetrySource, eventSink: Sink) {
    this.source = source;
    this.eventSink = eventSink;
    this.lastEvent = new Date();
    this.prepareSource()
    this.sayHello()
    setInterval(() => this.heartBeat(), 120 * 1000);
  }

  public trackEvent(name: string) {
    this.lastEvent = new Date()
    this.eventSink.trackEvent(name)
  }

  public trackCustomEvent(event: CustomEvent) {
    this.eventSink.trackCustomEvent(event)
  }

  public trackError(error: SimilarToError) {
    this.eventSink.trackError(error);
  }

  private prepareSource() {
    this.source.onException((error: Error) => {
      this.eventSink.merge({
        system: this.source.systemInfo(),
        appVersion: this.source.appVersion(),
      });
      this.eventSink.trackError({stack: error.stack, message: error.message, name: error.name, source: ElectronEventSource.main});
    });
  }

  private sayHello() {
    this.trackEvent(APP_STARTED);
    this.eventSink.merge({
      system: this.source.systemInfo(),
      appVersion: this.source.appVersion(),
    });
    this.eventSink.commit();
  }

  private heartBeat() {
    this.eventSink.merge({ heartbeat: 1 })
    this.eventSink.commit();
  }
}
