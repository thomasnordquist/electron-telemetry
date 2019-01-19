import { SimilarToError, TelemetrySource, ElectronEventSource } from './Model';
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
    setInterval(() => this.heartBeat(), 15 * 1000);
  }

  public trackEvent(name: string) {
    this.lastEvent = new Date();
    this.eventSink.trackEvent(name);
  }

  public trackError(error: SimilarToError) {
    this.eventSink.trackError(error);
  }

  private prepareSource() {
    this.source.onException((error: Error) => {
      this.eventSink.trackError({...error, source: ElectronEventSource.main});
    });
    this.eventSink.merge({
      system: this.source.systemInfo(),
      appVersion: this.source.appVersion(),
    });
  }

  private sayHello() {
    this.trackEvent(APP_STARTED);
    this.eventSink.commit();
  }

  private heartBeat() {
    this.eventSink.commit();
  }
}
