export type ListenerFn<TArgs> = (args: TArgs) => void;

export class Listener<TArgs> {
    private events: Record<string, ListenerFn<TArgs>[]> = {};

    on(event: string, listener: ListenerFn<TArgs>) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event: string, args: TArgs) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach((listener) => {
            listener(args);
        });
    }

    off(event: string, listener: ListenerFn<TArgs>) {
        if (!this.events[event]) {
            return;
        }
        this.events[event] = this.events[event].filter((l) => l !== listener);
    }
}
