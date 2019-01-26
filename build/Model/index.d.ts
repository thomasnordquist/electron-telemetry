export interface SystemInfo {
    arch?: string;
    platform?: string;
    release: string;
}
export interface ErrorReport {
    time: number;
    name?: string;
    message?: string;
    stack?: string;
}
export declare enum ElectronEventSource {
    renderer = "renderer",
    main = "main"
}
export interface SimilarToError {
    name?: string;
    message?: string;
    stack?: string;
    source?: string;
}
export interface Message {
    protocol?: number;
    system?: SystemInfo;
    transactionId?: string;
    appVersion?: string;
    events?: {
        [s: string]: number[];
    };
    errors?: ErrorReport[];
    customEvents?: CustomEvent[];
    committed?: number;
    sent?: number;
    uuid?: string;
    heartbeat?: number;
}
export interface CustomEvent {
    name: string;
    payload: any;
    time?: number;
}
export interface TelemetrySource {
    systemInfo(): SystemInfo;
    appVersion(): string;
    onException(loggerCallback: (error: Error) => void): void;
}
export interface Persistance {
    persist(data: string): void;
    load(): string | undefined;
}