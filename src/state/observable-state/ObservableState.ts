import { BehaviorSubject, Observable, Subject } from "rxjs";
import { IMutate, INotify, IReset, Mutation, MutationConfiguration, Mutator } from "../..";
import { IState } from "..";

/**
 * @name ObservableState
 * @description An observable state class that can be mutated, reset, and listened to for events
 */
export class ObservableState<T> implements IState<T>, IMutate<T>, IReset, INotify {
    private _subject$: BehaviorSubject<T>;
    private _listeners: Record<string, Subject<unknown>> = {};

    constructor(private _initialState: T, private _mutators: Record<string, Mutator<T>> = {}) {
        this._subject$ = new BehaviorSubject<T>(this._initialState);
        this._subject$.next(this._initialState);
    }

    public peek(): T {
        return this._subject$.getValue();
    }

    public observe(): Observable<T> {
        return this._subject$.asObservable();
    }

    public mutate(mutation: Mutation): void {
        const mutator = this._mutators[mutation.action];

        if(!mutator) {
            throw new Error(`No mutator found for action ${mutation.action}`);
        }

        this._subject$.next(
            mutator(
                mutation.data,
                (event: string, data: unknown) => this.emit(event, data)
            )
        );
    }

    public addMutation(mutation: MutationConfiguration<T>): void {
        this._mutators[mutation.action] = mutation.mutator;
    }

    public reset(): void {
        this._subject$.next(this._initialState);
    }

    public listen<V>(event: string): Observable<V> {
        if (!this._listeners[event]) {
            this._listeners[event] = new Subject<unknown>();
        }
        return this._listeners[event].asObservable() as Observable<V>;
    }

    protected emit(event: string, data: unknown): void {
        if (!this._listeners[event]) {
            return;
        }

        this._listeners[event].next(data);
    }
}