import { Mutator } from "./Mutator.type";

/**
 * @name MutationConfiguration
 * @description Defines how to perform a mutation for an action
 * @param T The type of value returned by the mutator
 * @param U The type of value passed to the mutator, defaults to T
 */
export type MutationConfiguration<T, U = T> = {
    /**
     * @name action
     * @description The name of the action to perform
     */
    action: string;
    /**
     * @name mutator
     * @description The mutator function to perform the mutation
     */
    mutator: Mutator<T, U>;
}