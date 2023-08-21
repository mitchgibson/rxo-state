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

    /**
     * Executes a function when the state changes and returns an unsubscribe function
     * @param func {Function} The function to execute when the state changes
     * @returns {Function} The unsubscribe function
     */
    signal(func: (value: T) => unknown): () => void;
}
