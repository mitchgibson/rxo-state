import { describe, expect, it } from "vitest";
import { ObservableState } from "./ObservableState";

describe("ObservableState", () => {
    it("should be able to create an instance", () => {
        const state = new ObservableState({});

        expect(state).toBeDefined();
    });

    it("should be able to peek at the current state", () => {
        const state = new ObservableState({
            test: true,
        });

        expect(state.peek()).toEqual({
            test: true,
        });
    });

    it("should provide current value on first observe", () => {
        const state = new ObservableState(
            {
                test: true,
            },
            {
                toggle: (data) => data,
            }
        );

        state.observe().subscribe((data) => {
            expect(data).toEqual({
                test: true,
            });
        });
    });

    it("should be able to mutate the state", () => {
        const state = new ObservableState(
            {
                test: true,
            },
            {
                toggle: (data) => data,
            }
        );

        state.mutate({
            action: "toggle",
            data: {
                test: false,
            },
        });

        state.observe().subscribe((data) => {
            expect(data).toEqual({
                test: false,
            });
        });
    });

    it("should be able to add a mutation", () => {
        const state = new ObservableState({});

        state.addMutation({
            action: "test",
            mutator: (data) => data,
        });

        expect(state.peek()).toEqual({});
    });

    it("should be able to reset the state", () => {
        const state = new ObservableState({});

        state.addMutation({
            action: "test",
            mutator: (data) => data,
        });

        state.mutate({ action: "test", data: {
            test: true,
        } });

        expect(state.peek()).toEqual({
            test: true,
        });

        state.reset();

        expect(state.peek()).toEqual({});
    });

    it("should be able to listen to events", () => {
        const state = new ObservableState({});

        expect(state.listen("test")).toBeDefined();
    });

    it("should be able to emit events", () => {
        const state = new ObservableState({
            test: false
        });

        state.addMutation({
            action: "test",
            mutator: (data, emitter) => {
                emitter("loading", true);
                return data;
            }
        });

        state.listen("loading").subscribe((data) => {
            expect(data).toEqual(true);
        });

        state.mutate({
            action: "test",
            data: {
                test: true,
            }
        });
    });
});
