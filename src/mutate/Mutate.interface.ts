import { Mutation } from "./Mutation.type";
import { MutationConfiguration } from "./MutationConfiguration.type";

/**
 * @name IMutate
 * @description Interface for mutable state classes
 */
export interface IMutate<T> {
    /**
     * @name mutate
     * @description Triggers the state mutation
     * @param mutation { Mutation }
     * @returns void
     */
    mutate(mutation: Mutation): void;
    /**
     * @name addMutation
     * @description Adds a mutation to the state
     * @param mutation { MutationConfiguration<T> }
     */
    addMutation(mutation: MutationConfiguration<T>): void;
}
