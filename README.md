# RXO

Observable state management using RxJs.

## Install

```bash
npm install rxo
```

## Usage

### Create a new ObservableState instance

ObservableState requires an initial state upon instantiation.

```typescript
const state = new ObservableState({ test: true });
```

Optionally, you can pass mutation actions in the constructor.

```typescript
const state = new ObservableState(
    { test: true },
    {
        action: "change",
        mutator: (data) => {
            data.test = false;
            return data;
        }
    }
);
```

You can also add mutators for mutation actions after instantiation.

```typescript
state.addMutation({
    action: "change",
    data: {
        test: false
    }
});
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

Events are emitted by mutators provided to the ObservableState object via `constructor` or `addMutator` method.

The event emitter is passed to the mutator as its second parameter. It can be called to fire an event.

```typescript
const state = new ObservableState(
    { test: true },
    {
        action: "change",
        mutator: (data, emitter) => {
            data.test = false;
            emitter("some-event", false);       // emits the event when mutator is executed
            return data;
        }
    }
);
```

### Reset the state to the initial value it was created with

```typescript
state.reset()
```
