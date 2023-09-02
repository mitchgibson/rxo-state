import { BehaviorSubject, Observable, Subject, map } from "rxjs";
import { IMutate, INotify, IReset } from "..";
import { IState } from ".";

export const RXO_RESET_EVENT = "RXO_RESET";

export type RXO_EVENT = typeof RXO_RESET_EVENT;

/**
 * @name RxoState
 * @description An observable state class that can be mutated, reset, and listened to for events
 * @param {T} _initialState The initial state
 */
export abstract class RxoState<T = unknown> implements IState<T>, IMutate, IReset, INotify {
    public value$: Observable<T>;
    private _initialState: T;
    private _subject$: BehaviorSubject<T>;
    private _listeners: Record<string, Subject<unknown>> = {};

    constructor(initialState: T) {
        this._initialState = initialState;
        this._subject$ = new BehaviorSubject<T>(this._initialState);
        this.value$ = this._subject$.asObservable();
    }

    /**
     * @description Returns the current state
     * @returns {T} The current state
     */
    public peek(): T {
        return this._subject$.getValue();
    }

    /**
     * @description Returns an observable of the current state
     * @returns 
     */
    public observe(): Observable<T> {
        return this._subject$.asObservable();
    }

    /**
     * @description Returns an observable of a property on the current state
     * @param path {string} The path to the property using dot notation
     * @returns {Observable<U>}
     */
    public observeProperty<U = any>(path:string): Observable<U> {
        const steps = path.split(".");
        return this._subject$.asObservable().pipe(
            map((state) => {
                try {
                    return steps.reduce((acc: any, step:string) => {
                        return acc[step];
                    }, state);
                } catch(e) {
                    return undefined;
                }
            })
        );
    }

    /**
     * @description Executes a function when the state changes and returns a function to unsubscribe
     * @param callback {(value: T) => any} The function to execute when the state changes 
     * @returns {Function} The unsubscribe function 
     */
    public signal(callback: (value: T) => any): () => void {
        const observable = this.observe().subscribe((value) => {
            callback(value);
        });
    
        return () => {
            observable.unsubscribe();
        };
      }

      /**
       * @description Mutates the state
       * @param args {...any} The mutation to be applied to the state 
       */
    public abstract mutate(...args:unknown[]): void;

    /**
     * @description Resets the state to its initial state provided upon instantiation
     */
    public reset(): void {
        this.emit(RXO_RESET_EVENT, this._initialState);
        this._subject$.next(this._initialState);
    }

    /**
     * @description Returns an observable that will emit when the provided event is triggered
     * @param event {string} The event to listen for
     * @returns 
     */
    public listen<V = unknown>(event: string): Observable<V> {
        if (!this._listeners[event]) {
            this._listeners[event] = new Subject<unknown>();
        }
        return this._listeners[event].asObservable() as Observable<V>;
    }

    /**
     * @private
     * @description Emits the next value
     * @param data {T} The next value to emit
     */
    protected next(data: T): void {
        this._subject$.next(data);
    }

    /**
     * @private
     * @description Emits an event
     * @param event {string} The event to emit
     * @param data {unknown} The data to emit with the event
     * @returns 
     */
    protected emit(event: string, data: unknown): void {
        if (!this._listeners[event]) {
            return;
        }

        this._listeners[event].next(data);
    }
}
