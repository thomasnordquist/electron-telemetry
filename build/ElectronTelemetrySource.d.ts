import { TelemetrySource, Persistance, BuildInfo } from './Model';
export declare class ElectronTelemetrySource implements TelemetrySource {
    buildInfo: BuildInfo;
    constructor(buildInfo: BuildInfo);
    systemInfo(): {
        arch: string;
        platform: NodeJS.Platform;
        release: any;
        package: "portable" | "nsis" | "appx" | "AppImage" | "snap" | "dmg" | "zip" | "mas";
        packagePlatform: "linux" | "win" | "mac";
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
