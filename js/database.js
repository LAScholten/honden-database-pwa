/**
 * IndexedDB Database Manager voor Hondendatabase
 * Beheert 3 gescheiden databases: Honden, Foto's, Privé Info
 */

class HondenDatabase {
    constructor() {
        this.dbName = 'HondenDatabase_v3'; // Versie verhoogd naar v3 voor nieuwe structuur
        this.version = 3; // Versie verhoogd voor schema wijzigingen
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
                this.createStores(db, event.oldVersion);
            };
        });
    }

    createStores(db, oldVersion) {
        // Verwijder oude stores als we upgraden van v2 naar v3
        if (oldVersion < 3) {
            try {
                if (db.objectStoreNames.contains('honden')) {
                    db.deleteObjectStore('honden');
                    console.log('Oude honden store verwijderd');
                }
                if (db.objectStoreNames.contains('fotos')) {
                    db.deleteObjectStore('fotos');
                    console.log('Oude fotos store verwijderd');
                }
                if (db.objectStoreNames.contains('priveInfo')) {
                    db.deleteObjectStore('priveInfo');
                    console.log('Oude priveInfo store verwijderd');
                }
            } catch (error) {
                console.log('Fout bij verwijderen oude stores:', error);
            }
        }
        
        // Store 1: Honden data met nieuwe velden structuur
        if (!db.objectStoreNames.contains('honden')) {
            console.log('Creëer nieuwe honden store met alle velden');
            const hondenStore = db.createObjectStore('honden', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            
            // Indices voor snelle zoekopdrachten
            hondenStore.createIndex('naam', 'naam', { unique: false });
            hondenStore.createIndex('stamboomnr', 'stamboomnr', { unique: true });
            hondenStore.createIndex('ras', 'ras', { unique: false });
            hondenStore.createIndex('geslacht', 'geslacht', { unique: false });
            hondenStore.createIndex('vader', 'vader', { unique: false });
            hondenStore.createIndex('moeder', 'moeder', { unique: false });
            hondenStore.createIndex('geboortedatum', 'geboortedatum', { unique: false });
            hondenStore.createIndex('overlijdensdatum', 'overlijdensdatum', { unique: false });
            hondenStore.createIndex('heupdysplasie', 'heupdysplasie', { unique: false });
            hondenStore.createIndex('elleboogdysplasie', 'elleboogdysplasie', { unique: false });
            hondenStore.createIndex('patella', 'patella', { unique: false });
            hondenStore.createIndex('ogen', 'ogen', { unique: false });
            hondenStore.createIndex('dandyWalker', 'dandyWalker', { unique: false });
            hondenStore.createIndex('schildklier', 'schildklier', { unique: false });
            hondenStore.createIndex('land', 'land', { unique: false });
            hondenStore.createIndex('postcode', 'postcode', { unique: false });
            hondenStore.createIndex('createdAt', 'createdAt', { unique: false });
            hondenStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
        
        // Store 2: Foto's (voor elke hond)
        if (!db.objectStoreNames.contains('fotos')) {
            console.log('Creëer fotos store');
            const fotoStore = db.createObjectStore('fotos', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            
            fotoStore.createIndex('stamboomnr', 'stamboomnr', { unique: false });
            fotoStore.createIndex('uploadedAt', 'uploadedAt', { unique: false });
            fotoStore.createIndex('filename', 'filename', { unique: false });
        }
        
        // Store 3: Privé informatie
        if (!db.objectStoreNames.contains('priveInfo')) {
            console.log('Creëer priveInfo store');
            const priveStore = db.createObjectStore('priveInfo', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            
            priveStore.createIndex('stamboomnr', 'stamboomnr', { unique: true });
            priveStore.createIndex('laatstGewijzigd', 'laatstGewijzigd', { unique: false });
        }
        
        console.log('Alle database stores zijn klaar');
    }

    // ========== CRUD OPERATIES VOOR HONDEN ==========

    async voegHondToe(hond) {
        await this.init();
        
        // Zorg dat alle velden aanwezig zijn met standaard waarden
        const hondMetData = {
            naam: hond.naam || '',
            stamboomnr: hond.stamboomnr || '',
            ras: hond.ras || '',
            geslacht: hond.geslacht || '',
            vader: hond.vader || '',
            moeder: hond.moeder || '',
            geboortedatum: hond.geboortedatum || '',
            overlijdensdatum: hond.overlijdensdatum || '',
            heupdysplasie: hond.heupdysplasie || '',
            elleboogdysplasie: hond.elleboogdysplasie || '',
            patella: hond.patella || '',
            ogen: hond.ogen || '',
            ogenVerklaring: hond.ogenVerklaring || '',
            dandyWalker: hond.dandyWalker || '',
            schildklier: hond.schildklier || '',
            schildklierVerklaring: hond.schildklierVerklaring || '',
            land: hond.land || '',
            postcode: hond.postcode || '',
            opmerkingen: hond.opmerkingen || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: window.auth?.getCurrentUser()?.username || 'unknown'
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
                        if (value && hond[key] !== undefined && hond[key] !== null) {
                            if (typeof value === 'string') {
                                // Zoeken op gedeeltelijke overeenkomst voor tekstvelden
                                if (!hond[key].toString().toLowerCase().includes(value.toLowerCase())) {
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
                    updatedBy: window.auth?.getCurrentUser()?.username || 'unknown'
                };
                
                // Zorg ervoor dat verplichte velden niet leeg zijn
                updatedHond.naam = updatedHond.naam || existingHond.naam;
                updatedHond.stamboomnr = updatedHond.stamboomnr || existingHond.stamboomnr;
                updatedHond.ras = updatedHond.ras || existingHond.ras;
                
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

    async getHondByStamboomnr(stamboomnr) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readonly');
            const store = transaction.objectStore('honden');
            const index = store.index('stamboomnr');
            const request = index.get(stamboomnr);
            
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    // ========== FOTO OPERATIES ==========

    async voegFotoToe(foto) {
        await this.init();
        
        const fotoMetData = {
            stamboomnr: foto.stamboomnr || '',
            data: foto.data || '',
            filename: foto.filename || 'onbekend.jpg',
            size: foto.size || 0,
            type: foto.type || 'image/jpeg',
            uploadedAt: new Date().toISOString(),
            geuploadDoor: window.auth?.getCurrentUser()?.username || 'unknown'
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['fotos'], 'readwrite');
            const store = transaction.objectStore('fotos');
            const request = store.add(fotoMetData);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getFotosVoorStamboomnr(stamboomnr) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['fotos'], 'readonly');
            const store = transaction.objectStore('fotos');
            const index = store.index('stamboomnr');
            const request = index.getAll(stamboomnr);
            
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
            gewijzigdDoor: window.auth?.getCurrentUser()?.username || 'unknown'
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['priveInfo'], 'readwrite');
            const store = transaction.objectStore('priveInfo');
            const index = store.index('stamboomnr');
            
            const getRequest = index.get(infoMetData.stamboomnr);
            
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

    async getPriveInfoVoorStamboomnr(stamboomnr) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['priveInfo'], 'readonly');
            const store = transaction.objectStore('priveInfo');
            const index = store.index('stamboomnr');
            const request = index.get(stamboomnr);
            
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
                exportDoor: window.auth?.getCurrentUser()?.username || 'unknown',
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
                    // Controleer of hond al bestaat op basis van stamboomnr
                    const bestaandeHond = await this.getHondByStamboomnr(hond.stamboomnr);
                    
                    if (bestaandeHond && overschrijven) {
                        await this.updateHond(bestaandeHond.id, hond);
                        resultaat.honden.bijgewerkt++;
                    } else if (!bestaandeHond) {
                        await this.voegHondToe(hond);
                        resultaat.honden.toegevoegd++;
                    } else {
                        resultaat.honden.overgeslagen++;
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
                    const hondBestaat = await this.getHondByStamboomnr(foto.stamboomnr);
                    
                    if (hondBestaat || opties.forceerFotos) {
                        await this.voegFotoToe(foto);
                        resultaat.fotos.toegevoegd++;
                    } else {
                        console.log(`Foto overgeslagen: Hond met stamboomnr ${foto.stamboomnr} niet gevonden`);
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
        
        if (!window.auth?.isAdmin?.()) {
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
        
        const avgHondSize = 1000; // Meer velden = grotere records
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

    // ========== BACKUP EN HERSTEL ==========

    async maakBackup() {
        const backupData = await this.exportData('all');
        const backupString = JSON.stringify(backupData, null, 2);
        const backupDatum = new Date().toISOString().replace(/[:.]/g, '-');
        const backupNaam = `honden-backup-${backupDatum}.json`;
        
        return {
            data: backupString,
            naam: backupNaam,
            datum: backupDatum,
            aantallen: {
                honden: backupData.honden.length,
                fotos: backupData.fotos.length,
                priveInfo: backupData.priveInfo.length
            }
        };
    }

    async herstelVanBackup(backupString) {
        try {
            const backupData = JSON.parse(backupString);
            
            if (!backupData.metadata || !backupData.honden) {
                throw new Error('Ongeldig backup formaat');
            }
            
            // Wis eerst alle bestaande data
            await this.wisAlleData();
            
            // Importeer de backup data
            const resultaat = await this.importData(backupData, true);
            
            console.log('Backup herstel voltooid:', resultaat);
            return resultaat;
            
        } catch (error) {
            console.error('Fout bij herstel van backup:', error);
            throw error;
        }
    }
}

const db = new HondenDatabase();