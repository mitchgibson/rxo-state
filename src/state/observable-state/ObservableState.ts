import { BehaviorSubject, Observable, Subject } from "rxjs";
import { IMutate, INotify, IReset, Mutation, MutationConfiguration, Mutator } from "../..";
import { IState } from "..";

/**
 * @name ObservableState
 * @description An observable state class that can be mutated, reset, and listened to for events
 * @param {T} _initialState The initial state
 * @param {Record<string, Mutator<T>>} _mutators A record of mutators
 * @example const state = new ObservableState({ count: 0 }, {
 *    increment: (data, emit) => {
 *       emit("incremented", data);
 *       return { count: data.count + 1 };
 *    },
 *    decrement: (data, emit) => {
 *       emit("decremented", data);
 *       return { count: data.count - 1 };
 *    }
 * });
 * 
 * state.peek(); // { count: 0 }
 * 
 * state.listen("incremented").subscribe((data) => {
 *   console.log("Incremented", data);
 * });
 * 
 * state.observe().subscribe((data) => {
 *  console.log("Current state", data);
 * });
 * 
 * state.mutate({ action: "increment", { count: state.peek().count++ } });
 * 
 * state.peek(); // { count: 1 }
 * 
 * state.reset();
 * 
 * state.peek(); // { count: 0 }
 */
export class ObservableState<T> implements IState<T>, IMutate<T>, IReset, INotify {
    private _initialState: T;
    private _subject$: BehaviorSubject<T>;
    private _listeners: Record<string, Subject<unknown>> = {};
    private _mutators: Record<string, Mutator<T>> = {};

    constructor(initialState: T, mutators: Record<string, Mutator<T>> = {}) {
        this._initialState = initialState;
        this._subject$ = new BehaviorSubject<T>(this._initialState);
        this._subject$.next(this._initialState);
        this._mutators = mutators;
    }

    public peek(): T {
        return this._subject$.getValue();
    }

    public observe(): Observable<T> {
        return this._subject$.asObservable();
    }

    public mutate(mutation: Mutation): void {
        const mutator = this._mutators[mutation.action];

        if (!mutator) {
            throw new Error(`No mutator found for action ${mutation.action}`);
        }

        this._subject$.next(mutator(mutation.data, (event: string, data: unknown) => this.emit(event, data)));
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
