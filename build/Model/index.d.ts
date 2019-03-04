export interface SystemInfo {
    arch?: string;
    platform?: string;
    release: string;
    package: string;
    packagePlatform: string;
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
export interface BuildInfo {
    platform: 'win' | 'linux' | 'mac';
    package: 'portable' | 'nsis' | 'appx' | 'AppImage' | 'snap' | 'dmg' | 'zip' | 'mas';
}
export interface TelemetrySource {
    systemInfo(): SystemInfo;
    appVersion(): string;
    onException(loggerCallback: (error: Error) => void): void;
    buildInfo: BuildInfo;
}
export interface Persistance {
    persist(data: string): void;
    load(): string | undefined;
}
