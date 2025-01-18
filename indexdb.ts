export class IDB<T extends Record<string, any>> {
    private db: IDBDatabase;
    constructor() {}

    async initDb(dbName: string, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            // request.onupgradeneeded = (event) => {
            //     this.db = event.target.result;
            //     resolve(this.db);
            // };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async createTable(tableName: string, keyPath: string, autoIncrement = true):Promise<void> {
        return new Promise((resolve, reject) => {
            const objectStore = this.db.createObjectStore(tableName, { keyPath, autoIncrement });
            objectStore.createIndex(keyPath, keyPath, { unique: true });
            objectStore.transaction.oncomplete = (event) => {
                resolve();
            };
            objectStore.transaction.onerror = (event) => {
                reject(event);
            };
        });
    }

    async getAll<K extends T[string]>(tableName: string): Promise<K[]> {
        const table = await this.getTable(tableName, "readonly");
        return new Promise((resolve, reject) => {
            const request = table.getAll();
            request.onsuccess = (event) => {
                resolve(request.result);
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async addOne<K extends T[string]>(tableName: string, item: K): Promise<void> {
        const table = await this.getTable(tableName, "readwrite");
        return new Promise((resolve, reject) => {
            const request = table.add(item);
            request.onsuccess = (event) => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async deleteOne(tableName: string, id: number): Promise<void> {
        const table = await this.getTable(tableName, "readwrite");
        return new Promise((resolve, reject) => {
            const request = table.delete(id);
            request.onsuccess = (event) => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async updateOne<K extends T[string]>(tableName: string, updatedItem: K): Promise<void> {
        const table = await this.getTable(tableName, "readwrite");
        return new Promise((resolve, reject) => {
            const request = table.put(updatedItem);
            request.onsuccess = (event) => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    private async getTable(
        tableName,
        mode: "readonly" | "readwrite" | "versionchange" = "readonly"
    ) {
        const transaction = this.db.transaction(tableName, mode);
        const store = transaction.objectStore(tableName);
        return store;
    }
}

