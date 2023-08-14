/**
 * @name IMutate
 * @description Interface for mutable state classes
 */
export interface IMutate {
    /**
     * @name mutate
     * @description Triggers the state mutation
     * @param mutation { unknown }
     * @returns void
     */
    mutate(mutation?:unknown): void;
}
