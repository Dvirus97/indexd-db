// src/state.ts
type Listener<T> = (state: T) => void;

export class State<T> {
  private listeners: Listener<T>[] = [];
  private _state: T;

  constructor(initialState: T) {
    this._state = initialState;
  }

  get state() {
    return this._state;
  }

  set state(newState: T) {
    this._state = newState;
    this.notify();
  }

  subscribe(listener: Listener<T>) {
    this.listeners.push(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this._state));
  }
}
