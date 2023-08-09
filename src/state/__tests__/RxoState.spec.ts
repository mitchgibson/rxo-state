import { describe, beforeEach, expect, it } from "vitest";
import { RXO_RESET_EVENT, RxoState } from "..";
import { Mutation } from "../../mutate";

const INITIAL_VALUE = "test";

class TestState extends RxoState<string> {
    constructor() {
        super(INITIAL_VALUE);
    }

    public mutate(mutation: Mutation<string>): void {
        if(mutation.action === "change") this.mutateChange(mutation.data);
    }

    private mutateChange(data: string): void {
        this.next(data);
        this.emit("change", data);
    }
}

describe("RxoState", () => {
    let state: TestState;

    beforeEach(() => {
        state = new TestState();
    });

    it("should hold initial state", () => {
        expect(state.peek()).toBe(INITIAL_VALUE);
    });

    it("should update state", () => {
        state.mutate({ action: "change", data: "test-change" });
        expect(state.peek()).toBe("test-change");
    });

    it("should emit an event", () => {
        const listener = state.listen("change");
        listener.subscribe((data) => {
            expect(data).toBe("test-event-emit");
        });
        state.mutate({ action: "change", data: "test-event-emit" });
    });

    it("should reset state", () => {
        state.mutate({ action: "change", data: "test-change" });
        state.reset();
        expect(state.peek()).toBe(INITIAL_VALUE);
    });

    it("should emit an event on reset", () => {
        const listener = state.listen(RXO_RESET_EVENT);
        listener.subscribe((data) => {
            expect(data).toBe(INITIAL_VALUE);
        });
        state.reset();
    });
});
