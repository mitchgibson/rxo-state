import { BehaviorSubject, Observable, Subject } from "rxjs";
import { IMutate, INotify, IReset, Mutation } from "..";
import { IState } from ".";

export const RXO_RESET_EVENT = "RXO_RESET";

export type RXO_EVENT = typeof RXO_RESET_EVENT;

/**
 * @name RxoState
 * @description An observable state class that can be mutated, reset, and listened to for events
 * @param {T} _initialState The initial state
 */
export abstract class RxoState<T = unknown> implements IState<T>, IMutate, IReset, INotify {
    private _initialState: T;
    private _subject$: BehaviorSubject<T>;
    private _listeners: Record<string, Subject<unknown>> = {};

    constructor(initialState: T) {
        this._initialState = initialState;
        this._subject$ = new BehaviorSubject<T>(this._initialState);
        this._subject$.next(this._initialState);
    }

    public peek(): T {
        return this._subject$.getValue();
    }

    public observe(): Observable<T> {
        return this._subject$.asObservable();
    }

    public abstract mutate(mutation: Mutation): void;

    public reset(): void {
        this.emit(RXO_RESET_EVENT, this._initialState);
        this._subject$.next(this._initialState);
    }

    public listen<V = unknown>(event: string): Observable<V> {
        if (!this._listeners[event]) {
            this._listeners[event] = new Subject<unknown>();
        }
        return this._listeners[event].asObservable() as Observable<V>;
    }

    protected next(data: T): void {
        this._subject$.next(data);
    }

    protected emit(event: string, data: unknown): void {
        if (!this._listeners[event]) {
            return;
        }

        this._listeners[event].next(data);
    }
}