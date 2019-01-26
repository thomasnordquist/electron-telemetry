/// <reference types="node" />
import { TelemetrySource, Persistance } from './Model';
export declare class ElectronTelemetrySource implements TelemetrySource {
    systemInfo(): {
        arch: string;
        platform: NodeJS.Platform;
        release: any;
    };
    appVersion(): string;
    onException(callback: (err: Error) => void): void;
}
export declare class ElectronStorage implements Persistance {
    private database;
    constructor(database: string);
    persist(data: string): void;
    load(): string | undefined;
    private path;
}
