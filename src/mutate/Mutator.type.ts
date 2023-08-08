/**
 * Mutator function type
 */
export type Mutator<T, U = T> = (data: U, emitter: (event: string, data?: unknown) => void) => T;