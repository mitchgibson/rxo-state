import { Observable } from 'rxjs';

/**
 * Interface for state classes
 */
export interface IState<T> {
    /**
     * Returns the current state
     * @returns {T}
     */
    peek(): T
    /**
     * Returns an observable for current and future states
     * @returns {Observable<T>}
     */
    observe(): Observable<T>
}
