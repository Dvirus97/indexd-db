import { Listener, ListenerFn } from "./listener";

type DbListenerArgs = {
  eventName: "get" | "add" | "update" | "delete";
} & Record<string, any>;

const indexedDbFactory = window.indexedDB; //|| window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

export class IDB<T extends Record<string, any>> {
  constructor(
    private dbName: string,
    private tableNames: (keyof T)[],
    private version: number
  ) {}

  private listener = new Listener<DbListenerArgs>();

  dbChanged(fn: ListenerFn<DbListenerArgs>) {
    this.listener.on("change", fn);
  }

  async db() {
    return await this.initDb();
  }

  async table<K extends keyof T>(name: K, mode?: IDBTransactionMode) {
    return await this._getTable(name, mode);
  }

  async getAll<K extends T[TName], TName extends keyof T>(
    tableName: TName
  ): Promise<K[]> {
    const table = await this._getTable(tableName.toString(), "readonly");
    return new Promise((resolve, reject) => {
      const request = table.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  async getOne<K extends T[TName], TName extends keyof T>(
    tableName: TName,
    id: number
  ): Promise<K> {
    const table = await this._getTable(tableName.toString(), "readonly");
    return new Promise((resolve, reject) => {
      const request = table.get(id);
      request.onsuccess = () => {
        this.listener.emit("change", {
          eventName: "get",
          item: request.result,
        });
        resolve(request.result);
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  async addOne<K extends T[TName], TName extends keyof T>(
    tableName: TName,
    item: K
  ): Promise<void> {
    const table = await this._getTable(tableName.toString(), "readwrite");
    return new Promise((resolve, reject) => {
      const request = table.add(item);
      request.onsuccess = () => {
        this.listener.emit("change", { eventName: "add", item: item });

        resolve();
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  async deleteOne<K extends keyof T>(tableName: K, id: number): Promise<void> {
    const table = await this._getTable(tableName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = table.delete(id);
      request.onsuccess = () => {
        this.listener.emit("change", { eventName: "delete", id: id });
        resolve();
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  async updateOne<K extends T[TName], TName extends keyof T>(
    tableName: TName,
    updatedItem: K
  ): Promise<void> {
    const table = await this._getTable(tableName.toString(), "readwrite");
    return new Promise((resolve, reject) => {
      const request = table.put(updatedItem);
      request.onsuccess = () => {
        this.listener.emit("change", {
          eventName: "update",
          id: updatedItem._id,
        });
        resolve();
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  async clearTable<K extends keyof T>(tableName: K): Promise<void> {
    const table = await this._getTable(tableName.toString(), "readwrite");
    return new Promise((resolve, reject) => {
      const request = table.clear();
      request.onsuccess = () => {
        this.listener.emit("change", {
          eventName: "delete",
          table: tableName.toString() + " clear",
        });
        resolve();
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  private async initDb() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDbFactory.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.tableNames.forEach((tableName) => {
          if (!db.objectStoreNames.contains(tableName.toString())) {
            const objectStore = db.createObjectStore(tableName.toString(), {
              keyPath: "_id",
              autoIncrement: true,
            });
            objectStore.createIndex("_id", "_id", { unique: true });
          }
        });
        for (let i = 0; i < db.objectStoreNames.length; i++) {
          const existTableName = db.objectStoreNames.item(i) as string;
          if (!this.tableNames.includes(existTableName)) {
            db.deleteObjectStore(existTableName);
          }
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  private async _getTable<K extends keyof T>(
    tableName: K,
    mode: IDBTransactionMode = "readonly"
  ) {
    const db = await this.initDb();
    const transaction = db.transaction(tableName.toString(), mode);
    const store = transaction.objectStore(tableName.toString());
    return store;
  }
}
