/**
 * @name Mutation
 * @description Describes the mutation action to perform and the data to perform it with.
 * @param T The type of data to perform the mutation with.
 */
export type Mutation<T = any> = {
    /**
     * @name action
     * @description The action to perform.
     */
    action: string;
    /**
     * @name data
     * @description The data to perform the action with.
     */
    data: T;
};
