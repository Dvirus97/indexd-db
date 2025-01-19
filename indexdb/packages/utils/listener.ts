export type ListenerFn<TArgs> = (args: TArgs) => void;

export class Listener<TArgs> {
    private events: Record<string, {fn:ListenerFn<TArgs>, fnName?:string}[]> = {};

    on(event: string, listener: ListenerFn<TArgs>, fnName?:string) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push({fn:listener, fnName});
    }

    emit(event: string, args: TArgs) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach((listener) => {
            listener.fn(args);
        });
    }

    off(event: string, fnName:string) {
        if (!this.events[event]) {
            return;
        }
        this.events[event] = this.events[event].filter((l) => l.fnName != fnName);
    }
}
