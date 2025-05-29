class Database {
    constructor() {
        this.dbName = 'SDNRaidDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                if (!db.objectStoreNames.contains('registrations')) {
                    const registrationStore = db.createObjectStore('registrations', { keyPath: 'id', autoIncrement: true });
                    registrationStore.createIndex('ign', 'ign', { unique: false });
                    registrationStore.createIndex('raidTime', 'raidTime', { unique: false });
                }

                if (!db.objectStoreNames.contains('raids')) {
                    const raidStore = db.createObjectStore('raids', { keyPath: 'id', autoIncrement: true });
                    raidStore.createIndex('teamName', 'teamName', { unique: false });
                    raidStore.createIndex('time', 'time', { unique: false });
                }

                if (!db.objectStoreNames.contains('auth')) {
                    db.createObjectStore('auth', { keyPath: 'id' });
                }
            };
        });
    }

    // Registration methods
    async addRegistration(registration) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['registrations'], 'readwrite');
            const store = transaction.objectStore('registrations');
            const request = store.add(registration);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getRegistrations() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['registrations'], 'readonly');
            const store = transaction.objectStore('registrations');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Raid methods
    async addRaid(raid) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['raids'], 'readwrite');
            const store = transaction.objectStore('raids');
            const request = store.add(raid);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateRaid(raid) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['raids'], 'readwrite');
            const store = transaction.objectStore('raids');
            const request = store.put(raid);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getRaids() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['raids'], 'readonly');
            const store = transaction.objectStore('raids');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Auth methods
    async setAuth(isAuthenticated) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['auth'], 'readwrite');
            const store = transaction.objectStore('auth');
            const request = store.put({ id: 'auth', isAuthenticated });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAuth() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['auth'], 'readonly');
            const store = transaction.objectStore('auth');
            const request = store.get('auth');

            request.onsuccess = () => resolve(request.result?.isAuthenticated || false);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteRaid(raidId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['raids'], 'readwrite');
            const store = transaction.objectStore('raids');
            const request = store.delete(parseInt(raidId));

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}

// Create a global instance
const db = new Database(); 