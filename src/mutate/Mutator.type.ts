import { EventEmitter } from "..";

/**
 * Mutator function type
 */
export type Mutator<T, U = T> = (data: U, emitter: EventEmitter) => T;