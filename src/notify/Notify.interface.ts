import { Observable } from "rxjs";

/**
 * Interface for states that notify listeners of events.
 */
export interface INotify {
    /**
     * Listen for events.
     * @param type { string } The event name to listen for.
     * @returns { Observable<unknTown> } An observable that emits when the event is triggered.
     */
    listen<T = unknown>(type: string): Observable<T>;
}
