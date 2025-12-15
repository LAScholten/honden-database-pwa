/**
 * IndexedDB Database Manager voor Hondendatabase
 * Beheert 3 gescheiden databases: Honden, Foto's, Privé Info
 */

class HondenDatabase {
    constructor() {
        this.dbName = 'HondenDatabase_v2';
        this.version = 2;
        this.db = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized && this.db) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = (event) => {
                console.error('Database fout:', event.target.error);
                reject(new Error(`Database initialisatie mislukt: ${event.target.error}`));
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.isInitialized = true;
                console.log('Database succesvol geïnitialiseerd');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                console.log('Database upgrade nodig naar versie:', this.version);
                const db = event.target.result;
                this.createStores(db);
            };
        });
    }

    createStores(db) {
        // Store 1: Honden data
        if (!db.objectStoreNames.contains('honden')) {
            console.log('Creëer honden store');
            const hondenStore = db.createObjectStore('honden', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            
            hondenStore.createIndex('naam', 'naam', { unique: false });
            hondenStore.createIndex('ras', 'ras', { unique: false });
            hondenStore.createIndex('chipnummer', 'chipnummer', { unique: true });
            hondenStore.createIndex('geboortedatum', 'geboortedatum', { unique: false });
            hondenStore.createIndex('geslacht', 'geslacht', { unique: false });
            hondenStore.createIndex('eigenaar', 'eigenaar', { unique: false });
            hondenStore.createIndex('createdAt', 'createdAt', { unique: false });
            hondenStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
        
        // Store 2: Foto's
        if (!db.objectStoreNames.contains('fotos')) {
            console.log('Creëer fotos store');
            const fotoStore = db.createObjectStore('fotos', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            
            fotoStore.createIndex('hondId', 'hondId', { unique: false });
            fotoStore.createIndex('datum', 'datum', { unique: false });
            fotoStore.createIndex('type', 'type', { unique: false });
            fotoStore.createIndex('isThumbnail', 'isThumbnail', { unique: false });
        }
        
        // Store 3: Privé informatie
        if (!db.objectStoreNames.contains('priveInfo')) {
            console.log('Creëer priveInfo store');
            const priveStore = db.createObjectStore('priveInfo', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            
            priveStore.createIndex('hondId', 'hondId', { unique: true });
            priveStore.createIndex('laatstGewijzigd', 'laatstGewijzigd', { unique: false });
        }
        
        console.log('Alle database stores zijn klaar');
    }

    // ========== CRUD OPERATIES VOOR HONDEN ==========

    async voegHondToe(hond) {
        await this.init();
        
        const hondMetData = {
            ...hond,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: auth.getCurrentUser()?.username || 'unknown'
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readwrite');
            const store = transaction.objectStore('honden');
            const request = store.add(hondMetData);
            
            request.onsuccess = () => {
                console.log('Hond toegevoegd met ID:', request.result);
                resolve(request.result);
            };
            
            request.onerror = () => {
                console.error('Fout bij toevoegen hond:', request.error);
                reject(request.error);
            };
        });
    }

    async getHonden() {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readonly');
            const store = transaction.objectStore('honden');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async zoekHonden(criteria) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readonly');
            const store = transaction.objectStore('honden');
            const results = [];
            
            const request = store.openCursor();
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const hond = cursor.value;
                    
                    let match = true;
                    for (const [key, value] of Object.entries(criteria)) {
                        if (value && hond[key]) {
                            if (typeof value === 'string') {
                                if (!hond[key].toLowerCase().includes(value.toLowerCase())) {
                                    match = false;
                                    break;
                                }
                            } else if (hond[key] !== value) {
                                match = false;
                                break;
                            }
                        }
                    }
                    
                    if (match) results.push(hond);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            
            request.onerror = () => reject(request.error);
        });
    }

    async updateHond(hondId, updateData) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readwrite');
            const store = transaction.objectStore('honden');
            const getRequest = store.get(hondId);
            
            getRequest.onsuccess = () => {
                const existingHond = getRequest.result;
                if (!existingHond) {
                    reject(new Error(`Hond met ID ${hondId} niet gevonden`));
                    return;
                }
                
                const updatedHond = {
                    ...existingHond,
                    ...updateData,
                    updatedAt: new Date().toISOString(),
                    updatedBy: auth.getCurrentUser()?.username || 'unknown'
                };
                
                const putRequest = store.put(updatedHond);
                putRequest.onsuccess = () => {
                    console.log('Hond bijgewerkt:', hondId);
                    resolve();
                };
                putRequest.onerror = () => reject(putRequest.error);
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async verwijderHond(hondId) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readwrite');
            const store = transaction.objectStore('honden');
            const request = store.delete(hondId);
            
            request.onsuccess = () => {
                console.log('Hond verwijderd:', hondId);
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }

    // ========== FOTO OPERATIES ==========

    async voegFotoToe(foto) {
        await this.init();
        
        const fotoMetData = {
            ...foto,
            uploadDatum: new Date().toISOString(),
            geuploadDoor: auth.getCurrentUser()?.username || 'unknown'
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['fotos'], 'readwrite');
            const store = transaction.objectStore('fotos');
            const request = store.add(fotoMetData);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getFotosVoorHond(hondId) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['fotos'], 'readonly');
            const store = transaction.objectStore('fotos');
            const index = store.index('hondId');
            const request = index.getAll(hondId);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async verwijderFoto(fotoId) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['fotos'], 'readwrite');
            const store = transaction.objectStore('fotos');
            const request = store.delete(fotoId);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // ========== PRIVÉ INFO OPERATIES ==========

    async bewaarPriveInfo(priveInfo) {
        await this.init();
        
        const infoMetData = {
            ...priveInfo,
            laatstGewijzigd: new Date().toISOString(),
            gewijzigdDoor: auth.getCurrentUser()?.username || 'unknown'
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['priveInfo'], 'readwrite');
            const store = transaction.objectStore('priveInfo');
            const index = store.index('hondId');
            
            const getRequest = index.get(infoMetData.hondId);
            
            getRequest.onsuccess = () => {
                const existingInfo = getRequest.result;
                
                if (existingInfo) {
                    infoMetData.id = existingInfo.id;
                    const putRequest = store.put(infoMetData);
                    putRequest.onsuccess = () => resolve(putRequest.result);
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    const addRequest = store.add(infoMetData);
                    addRequest.onsuccess = () => resolve(addRequest.result);
                    addRequest.onerror = () => reject(addRequest.error);
                }
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async getPriveInfoVoorHond(hondId) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['priveInfo'], 'readonly');
            const store = transaction.objectStore('priveInfo');
            const index = store.index('hondId');
            const request = index.get(hondId);
            
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    // ========== IMPORT/EXPORT OPERATIES ==========

    async exportData(type = 'all') {
        await this.init();
        
        const exportData = {
            metadata: {
                exportType: type,
                exportDatum: new Date().toISOString(),
                exportDoor: auth.getCurrentUser()?.username || 'unknown',
                versie: this.version,
                databaseNaam: this.dbName
            },
            honden: [],
            fotos: [],
            priveInfo: []
        };
        
        if (type === 'all' || type === 'honden') {
            exportData.honden = await this.getHonden();
        }
        
        if (type === 'all' || type === 'fotos') {
            exportData.fotos = await this.getAllFotos();
        }
        
        if (type === 'all' || type === 'prive') {
            exportData.priveInfo = await this.getAllPriveInfo();
        }
        
        console.log(`Export voltooid: ${exportData.honden.length} honden, ${exportData.fotos.length} foto's, ${exportData.priveInfo.length} privé records`);
        return exportData;
    }

    async importData(importData, overschrijven = false, opties = {}) {
        await this.init();
        
        const resultaat = {
            honden: { toegevoegd: 0, bijgewerkt: 0, overgeslagen: 0, fouten: 0 },
            fotos: { toegevoegd: 0, fouten: 0 },
            priveInfo: { toegevoegd: 0, bijgewerkt: 0, fouten: 0 },
            totaal: 0
        };
        
        if (importData.honden && Array.isArray(importData.honden)) {
            for (const hond of importData.honden) {
                try {
                    const bestaandeHonden = await this.getHonden();
                    const bestaandeHond = bestaandeHonden.find(h => h.chipnummer === hond.chipnummer);
                    
                    if (bestaandeHond) {
                        await this.updateHond(bestaandeHond.id, hond);
                        resultaat.honden.bijgewerkt++;
                    } else {
                        await this.voegHondToe(hond);
                        resultaat.honden.toegevoegd++;
                    }
                } catch (error) {
                    console.error('Fout bij importeren hond:', error);
                    resultaat.honden.fouten++;
                }
            }
        }
        
        if (importData.fotos && Array.isArray(importData.fotos)) {
            for (const foto of importData.fotos) {
                try {
                    const honden = await this.getHonden();
                    const hondBestaat = honden.some(h => h.id === foto.hondId);
                    
                    if (hondBestaat || opties.forceerFotos) {
                        await this.voegFotoToe(foto);
                        resultaat.fotos.toegevoegd++;
                    }
                } catch (error) {
                    console.error('Fout bij importeren foto:', error);
                    resultaat.fotos.fouten++;
                }
            }
        }
        
        if (importData.priveInfo && Array.isArray(importData.priveInfo)) {
            for (const info of importData.priveInfo) {
                try {
                    await this.bewaarPriveInfo(info);
                    resultaat.priveInfo.bijgewerkt++;
                } catch (error) {
                    console.error('Fout bij importeren privé info:', error);
                    resultaat.priveInfo.fouten++;
                }
            }
        }
        
        resultaat.totaal = 
            resultaat.honden.toegevoegd + resultaat.honden.bijgewerkt +
            resultaat.fotos.toegevoegd + resultaat.priveInfo.bijgewerkt;
        
        console.log('Import resultaat:', resultaat);
        return resultaat;
    }

    async wisAlleData() {
        await this.init();
        
        if (!auth.isAdmin()) {
            throw new Error('Alleen administrators mogen alle data wissen');
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden', 'fotos', 'priveInfo'], 'readwrite');
            
            transaction.objectStore('honden').clear();
            transaction.objectStore('fotos').clear();
            transaction.objectStore('priveInfo').clear();
            
            transaction.oncomplete = () => {
                console.log('Alle data gewist');
                resolve();
            };
            
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async getAllFotos() {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['fotos'], 'readonly');
            const store = transaction.objectStore('fotos');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllPriveInfo() {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['priveInfo'], 'readonly');
            const store = transaction.objectStore('priveInfo');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getStatistieken() {
        await this.init();
        
        const [honden, fotos, priveInfo] = await Promise.all([
            this.getHonden(),
            this.getAllFotos(),
            this.getAllPriveInfo()
        ]);
        
        return {
            totaalHonden: honden.length,
            totaalFotos: fotos.length,
            totaalPriveInfo: priveInfo.length,
            laatsteUpdate: honden.reduce((latest, hond) => {
                const hondDatum = new Date(hond.updatedAt || hond.createdAt);
                return hondDatum > latest ? hondDatum : latest;
            }, new Date(0)).toISOString(),
            databaseGrootte: await this.berekenDatabaseGrootte()
        };
    }

    async berekenDatabaseGrootte() {
        const [honden, fotos, priveInfo] = await Promise.all([
            this.getHonden(),
            this.getAllFotos(),
            this.getAllPriveInfo()
        ]);
        
        const avgHondSize = 500;
        const avgFotoSize = 50000;
        const avgPriveSize = 1000;
        
        const totalBytes = 
            (honden.length * avgHondSize) +
            (fotos.length * avgFotoSize) +
            (priveInfo.length * avgPriveSize);
        
        if (totalBytes < 1024) return totalBytes + ' B';
        if (totalBytes < 1048576) return (totalBytes / 1024).toFixed(1) + ' KB';
        return (totalBytes / 1048576).toFixed(1) + ' MB';
    }
}

const db = new HondenDatabase();