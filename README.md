# RXO-STATE

Observable state management using RxJs.

[API Documentation](https://mitchgibson.github.io/rxo-state/)

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

### Listen for the `RXO_RESET` event

```typescript
state.listen(RXO_RESET, (value) => {
    console.log(value);
});
```

### Listen for a custom event 

```typescript
state.listen("some-event", (value) => {
    console.log(value);
});
```

### Execute a function whenever state changes

```typescript
const subscription = state.signal((value => {
    console.log(value);
}));

subscription.unsubscribe();   // unsubscribe from subscription
```

### Update Angular signal on state change

```typescript
@Component({
    selector: 'app-root',
    template: `{{mySignal()}}`,
    ...
})

export class AppComponent implements OnInit, OnDestroy {
    public mySignal: signal(0);
    private subscription: Subscription;

    constructor(private state: MyRxoState) {}

    ngOnInit() {
        this.subscription = this.state.signal(signal.set);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
```
