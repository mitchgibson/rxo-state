import { Mutation } from "./Mutation.type";

/**
 * @name IMutate
 * @description Interface for mutable state classes
 */
export interface IMutate {
    /**
     * @name mutate
     * @description Triggers the state mutation
     * @param mutation { Mutation }
     * @returns void
     */
    mutate(mutation: Mutation): void;
}
