import { SimilarToError, TelemetrySource, CustomEvent } from './Model';
import { Sink } from './sinks/Sink';
export declare class Telemetry {
    private lastEvent;
    private eventSink;
    private source;
    constructor(source: TelemetrySource, eventSink: Sink);
    trackEvent(name: string): void;
    trackCustomEvent(event: CustomEvent): void;
    trackError(error: SimilarToError): void;
    private prepareSource;
    private sayHello;
    private heartBeat;
}
