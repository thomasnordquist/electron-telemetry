import { Message, Persistance, SimilarToError, CustomEvent } from '../../Model';
import { Sink } from '../Sink';
export declare class HttpSink implements Sink {
    private transactions;
    private persistence;
    private appId;
    private uuid;
    private constructor();
    private getCurrentMessage;
    private setCurrentMessage;
    private ensureMessageExists;
    private createNewTransaction;
    merge(message: Message): void;
    private hasData;
    trackCustomEvent(event: CustomEvent): void;
    trackEvent(eventName: string): void;
    trackError(error: SimilarToError): void;
    static withStoredEvents(persistence: Persistance, appId: string, uuid: string): HttpSink;
    commit(): Promise<void>;
    store(): void;
}
