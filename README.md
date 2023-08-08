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
        mutator: (data, emitter) => {
            data.test = false;
            emitter("some-event", false);
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
