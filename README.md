# RXO

Observable state management using RxJs.

## Install

```bash
npm install rxo-state
```

## Usage

### Create a new state by extending RxoState abstract class

RxoState requires an initial state upon instantiation and an implementation for the `mutate` method.

```typescript
export class MyState extends RxoState<{test: boolean}> {
    constructor() {
        super({test: true})
    }

    mutate(mutation:Mutation<boolean>): void {
        if(mutation.action === 'change') {
            this.next(mutation.data);
            this.emit("some-event", mutation.data);     // optional event emission
        }
        ...
    }
}
```

### View current state value

```typescript
const value = state.peek();
```

### Observe changes to state

```typescript
const subscription = state.observe().subscribe((value) => {
    console.log(value);
});

subscription.unsubscribe();   // unsubscribe from subscription
```

### Mutate the state

```typescript
state.mutate({
    action: "change",
    data: {
        test: true
    }
});
```

### Listen for events emitted by mutators

```typescript
state.listen("some-event", (value) => {
    console.log(value);
});
```

### Emit an event from a mutator

Events can be emitted from the subclass of RxoState by call the `emit` method.

```typescript
this.emit("some-event", mutation.data);
```

### Reset the state to the initial value it was created with

> The `reset` method will always emit the `RXO_RESET` event with the initial state as its value.

```typescript
state.reset()
```
