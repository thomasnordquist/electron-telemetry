import { Telemetry } from './Telemetry';
import { CustomEvent } from './Model';
export declare const electronTelemetryFactory: (appId: string) => Telemetry;
declare class ElectronRendererTelemetry {
    registerErrorHandler(): void;
    trackLanguage(): void;
    trackError(error: Error): void;
    trackCustomEvent(event: CustomEvent): void;
    trackEvent(name: string): void;
}
export declare const electronRendererTelementry: ElectronRendererTelemetry;
export {};
