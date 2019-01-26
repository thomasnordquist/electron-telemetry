import { Message, SimilarToError, CustomEvent } from '../Model';
export interface Sink {
    commit(): void;
    merge(message: Message): void;
    trackEvent(eventName: string): void;
    trackCustomEvent(event: CustomEvent): void;
    trackError(error: SimilarToError): void;
}
