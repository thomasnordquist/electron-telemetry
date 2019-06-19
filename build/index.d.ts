import { Telemetry } from './Telemetry';
import { CustomEvent, BuildInfo } from './Model';
export declare const electronTelemetryFactory: (appId: string, buildInfo: BuildInfo) => Telemetry;
declare class ElectronRendererTelemetry {
    registerErrorHandler(): void;
    trackLanguage(): void;
    trackError(error: Error): void;
    trackCustomEvent(event: CustomEvent): void;
    trackEvent(name: string): void;
}
export declare const electronRendererTelemetry: ElectronRendererTelemetry;
export {};
