/**
 * Interface for state classes that can be reset to their initial state.
 */
export interface IReset {
    /**
     * Reset the state to its initial value.
     * @returns void
     **/
    reset(): void;
}
