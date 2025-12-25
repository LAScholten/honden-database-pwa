/**
 * IndexedDB Database Manager voor Hondendatabase
 * Beheert 3 gescheiden databases: Honden, Foto's, Privé Info
 */

class HondenDatabase {
    constructor() {
        this.dbName = 'HondenDatabase_v5'; // Versie verhoogd naar v5 voor kennelnaam
        this.version = 5; // Nieuwe versie voor kennelnaam
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
        // Store 1: Honden data
        if (!db.objectStoreNames.contains('honden')) {
            console.log('Creëer nieuwe honden store');
            const hondenStore = db.createObjectStore('honden', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            
            // Basis informatie
            hondenStore.createIndex('naam', 'naam', { unique: false });
            hondenStore.createIndex('kennelnaam', 'kennelnaam', { unique: false });
            hondenStore.createIndex('stamboomnr', 'stamboomnr', { unique: true });
            hondenStore.createIndex('ras', 'ras', { unique: false });
            hondenStore.createIndex('geslacht', 'geslacht', { unique: false });
            
            // Ouders
            hondenStore.createIndex('vader', 'vader', { unique: false });
            hondenStore.createIndex('vaderId', 'vaderId', { unique: false });
            hondenStore.createIndex('moeder', 'moeder', { unique: false });
            hondenStore.createIndex('moederId', 'moederId', { unique: false });
            
            // Datums
            hondenStore.createIndex('geboortedatum', 'geboortedatum', { unique: false });
            hondenStore.createIndex('overlijdensdatum', 'overlijdensdatum', { unique: false });
            
            // Gezondheidsinformatie
            hondenStore.createIndex('heupdysplasie', 'heupdysplasie', { unique: false });
            hondenStore.createIndex('elleboogdysplasie', 'elleboogdysplasie', { unique: false });
            hondenStore.createIndex('patella', 'patella', { unique: false });
            hondenStore.createIndex('ogen', 'ogen', { unique: false });
            hondenStore.createIndex('dandyWalker', 'dandyWalker', { unique: false });
            hondenStore.createIndex('schildklier', 'schildklier', { unique: false });
            
            // Locatie
            hondenStore.createIndex('land', 'land', { unique: false });
            hondenStore.createIndex('postcode', 'postcode', { unique: false });
            
            // Metadata
            hondenStore.createIndex('createdAt', 'createdAt', { unique: false });
            hondenStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        } else {
            // Upgrade van oude versies
            const transaction = event.target.transaction;
            const hondenStore = transaction.objectStore('honden');
            
            // Vervang de oude upgrade logica
            if (oldVersion < 5) {
                console.log('Upgrade honden store naar versie 5');
                
                // Voeg kennelnaam index toe als deze nog niet bestaat
                if (!hondenStore.indexNames.contains('kennelnaam')) {
                    try {
                        hondenStore.createIndex('kennelnaam', 'kennelnaam', { unique: false });
                        console.log('kennelnaam index toegevoegd');
                        
                        // Voeg kennelnaam veld toe aan bestaande records
                        const request = hondenStore.openCursor();
                        request.onsuccess = (e) => {
                            const cursor = e.target.result;
                            if (cursor) {
                                const hond = cursor.value;
                                // Voeg kennelnaam veld toe als het niet bestaat
                                if (hond.kennelnaam === undefined) {
                                    hond.kennelnaam = '';
                                    cursor.update(hond);
                                }
                                cursor.continue();
                            }
                        };
                    } catch (error) {
                        console.warn('Kon kennelnaam index niet toevoegen:', error);
                    }
                }
            }
            
            // Voor versie 4: voeg vaderId/moederId indexen toe
            if (oldVersion < 4) {
                console.log('Upgrade honden store naar versie 4');
                
                if (!hondenStore.indexNames.contains('vaderId')) {
                    try {
                        hondenStore.createIndex('vaderId', 'vaderId', { unique: false });
                        console.log('vaderId index toegevoegd');
                    } catch (error) {
                        console.warn('Kon vaderId index niet toevoegen:', error);
                    }
                }
                
                if (!hondenStore.indexNames.contains('moederId')) {
                    try {
                        hondenStore.createIndex('moederId', 'moederId', { unique: false });
                        console.log('moederId index toegevoegd');
                    } catch (error) {
                        console.warn('Kon moederId index niet toevoegen:', error);
                    }
                }
            }
        }
        
        // Store 2: Foto's
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
        
        const hondMetData = {
            // Basis informatie
            naam: hond.naam || '',
            kennelnaam: hond.kennelnaam || '',
            stamboomnr: hond.stamboomnr || '',
            ras: hond.ras || '',
            geslacht: hond.geslacht || '',
            
            // Ouders
            vader: hond.vader || '',
            vaderId: hond.vaderId || null,
            moeder: hond.moeder || '',
            moederId: hond.moederId || null,
            
            // Datums
            geboortedatum: hond.geboortedatum || '',
            overlijdensdatum: hond.overlijdensdatum || '',
            
            // Gezondheidsinformatie
            heupdysplasie: hond.heupdysplasie || '',
            elleboogdysplasie: hond.elleboogdysplasie || '',
            patella: hond.patella || '',
            ogen: hond.ogen || '',
            ogenVerklaring: hond.ogenVerklaring || '',
            dandyWalker: hond.dandyWalker || '',
            schildklier: hond.schildklier || '',
            schildklierVerklaring: hond.schildklierVerklaring || '',
            
            // Locatie
            land: hond.land || '',
            postcode: hond.postcode || '',
            
            // Opmerkingen
            opmerkingen: hond.opmerkingen || '',
            
            // Metadata
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

    // FIXED: Deze methode accepteert nu één object met ID erin
    async updateHond(hondData) {
        await this.init();
        
        if (!hondData || !hondData.id) {
            throw new Error('Hond ID is vereist voor update');
        }
        
        const hondId = Number(hondData.id);
        if (isNaN(hondId) || hondId <= 0) {
            throw new Error(`Ongeldig hond ID: ${hondData.id}`);
        }
        
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
                
                // Update alleen de velden die zijn meegegeven, behoud bestaande waarden
                const updatedHond = {
                    ...existingHond,
                    ...hondData,
                    id: hondId, // Zorg dat ID behouden blijft
                    updatedAt: new Date().toISOString(),
                    updatedBy: window.auth?.getCurrentUser()?.username || 'unknown'
                };
                
                // Verwijder undefined/null waarden voor oude velden
                Object.keys(updatedHond).forEach(key => {
                    if (updatedHond[key] === undefined) {
                        updatedHond[key] = existingHond[key] || '';
                    }
                });
                
                // Zorg ervoor dat alle nieuwe velden er zijn
                if (!updatedHond.kennelnaam && existingHond.kennelnaam === undefined) {
                    updatedHond.kennelnaam = '';
                }
                
                const putRequest = store.put(updatedHond);
                putRequest.onsuccess = () => {
                    console.log('Hond bijgewerkt:', hondId, updatedHond.naam);
                    resolve(updatedHond);
                };
                putRequest.onerror = (error) => {
                    console.error('Fout bij put request:', error);
                    reject(new Error(`Fout bij opslaan: ${putRequest.error?.message || 'Onbekende fout'}`));
                };
            };
            
            getRequest.onerror = (error) => {
                console.error('Fout bij get request:', error);
                reject(new Error(`Fout bij ophalen hond: ${getRequest.error?.message || 'Onbekende fout'}`));
            };
        });
    }

    async verwijderHond(hondId) {
        await this.init();
        
        const parsedId = Number(hondId);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new Error(`Ongeldig hond ID: ${hondId}`);
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readwrite');
            const store = transaction.objectStore('honden');
            const request = store.delete(parsedId);
            
            request.onsuccess = () => {
                console.log('Hond verwijderd:', parsedId);
                resolve();
            };
            request.onerror = (error) => {
                console.error('Fout bij verwijderen hond:', error);
                reject(new Error(`Fout bij verwijderen: ${request.error?.message || 'Onbekende fout'}`));
            };
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

    async getHondById(id) {
        await this.init();
        
        const parsedId = Number(id);
        if (isNaN(parsedId) || parsedId <= 0) {
            console.warn('Ongeldig ID opgevraagd:', id);
            return null;
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readonly');
            const store = transaction.objectStore('honden');
            const request = store.get(parsedId);
            
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = (error) => {
                console.error('Fout bij ophalen hond:', error);
                reject(new Error(`Fout bij ophalen: ${request.error?.message || 'Onbekende fout'}`));
            };
        });
    }

    // Nieuwe zoekmethodes voor kennelnaam
    async zoekOpKennelnaam(kennelnaam) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readonly');
            const store = transaction.objectStore('honden');
            const index = store.index('kennelnaam');
            
            // Zoek naar exacte match of gedeeltelijke matches
            const request = index.getAll(kennelnaam);
            
            request.onsuccess = () => {
                const exactMatches = request.result;
                
                if (exactMatches.length > 0) {
                    resolve(exactMatches);
                } else {
                    // Zoek naar gedeeltelijke matches
                    const results = [];
                    const cursorRequest = store.openCursor();
                    
                    cursorRequest.onsuccess = (event) => {
                        const cursor = event.target.result;
                        if (cursor) {
                            const hond = cursor.value;
                            if (hond.kennelnaam && hond.kennelnaam.toLowerCase().includes(kennelnaam.toLowerCase())) {
                                results.push(hond);
                            }
                            cursor.continue();
                        } else {
                            resolve(results);
                        }
                    };
                    
                    cursorRequest.onerror = () => reject(cursorRequest.error);
                }
            };
            
            request.onerror = () => reject(request.error);
        });
    }

    async getHondenPerKennel() {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['honden'], 'readonly');
            const store = transaction.objectStore('honden');
            
            const kennelOverzicht = {};
            const request = store.openCursor();
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const hond = cursor.value;
                    const kennel = hond.kennelnaam || 'Geen kennel';
                    
                    if (!kennelOverzicht[kennel]) {
                        kennelOverzicht[kennel] = {
                            naam: kennel,
                            aantal: 0,
                            honden: []
                        };
                    }
                    
                    kennelOverzicht[kennel].aantal++;
                    kennelOverzicht[kennel].honden.push({
                        id: hond.id,
                        naam: hond.naam,
                        stamboomnr: hond.stamboomnr,
                        ras: hond.ras,
                        geslacht: hond.geslacht
                    });
                    
                    cursor.continue();
                } else {
                    // Converteer naar array en sorteer op aantal
                    const result = Object.values(kennelOverzicht)
                        .sort((a, b) => b.aantal - a.aantal);
                    resolve(result);
                }
            };
            
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
        
        const user = window.auth?.getCurrentUser();
        if (!user) {
            throw new Error('Gebruiker niet ingelogd');
        }
        
        if (user.permissions && !user.permissions.includes('private_full')) {
            throw new Error('Geen rechten om privé informatie op te slaan');
        }
        
        const infoMetData = {
            stamboomnr: priveInfo.stamboomnr || '',
            privateNotes: priveInfo.privateNotes || '',
            vertrouwelijk: true,
            laatstGewijzigd: new Date().toISOString(),
            gewijzigdDoor: user.username || 'unknown'
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
        
        const user = window.auth?.getCurrentUser();
        if (!user) {
            throw new Error('Gebruiker niet ingelogd');
        }
        
        if (user.permissions && user.permissions.includes('private_none')) {
            throw new Error('Geen toegang tot privé informatie');
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['priveInfo'], 'readonly');
            const store = transaction.objectStore('priveInfo');
            const index = store.index('stamboomnr');
            const request = index.get(stamboomnr);
            
            request.onsuccess = () => {
                const result = request.result;
                if (result && user.permissions && user.permissions.includes('private_view') && !user.permissions.includes('private_full')) {
                    resolve({
                        stamboomnr: result.stamboomnr,
                        laatstGewijzigd: result.laatstGewijzigd,
                        heeftPriveInfo: result.privateNotes ? true : false
                    });
                } else {
                    resolve(result || null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    // ========== IMPORT/EXPORT OPERATIES ==========

    async exportData(type = 'all') {
        await this.init();
        
        const user = window.auth?.getCurrentUser();
        if (!user || !user.permissions?.includes('private_full')) {
            throw new Error('Geen rechten om data te exporteren');
        }
        
        const exportData = {
            metadata: {
                exportType: type,
                exportDatum: new Date().toISOString(),
                exportDoor: user.username || 'unknown',
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
        
        const user = window.auth?.getCurrentUser();
        if (!user || !user.permissions?.includes('private_full')) {
            throw new Error('Geen rechten om data te importeren');
        }
        
        const resultaat = {
            honden: { toegevoegd: 0, bijgewerkt: 0, overgeslagen: 0, fouten: 0 },
            fotos: { toegevoegd: 0, fouten: 0 },
            priveInfo: { toegevoegd: 0, bijgewerkt: 0, fouten: 0 },
            totaal: 0
        };
        
        if (importData.honden && Array.isArray(importData.honden)) {
            for (const hond of importData.honden) {
                try {
                    // Zorg dat oudere imports ook kennelnaam hebben
                    if (hond.kennelnaam === undefined) {
                        hond.kennelnaam = '';
                    }
                    
                    const bestaandeHond = await this.getHondByStamboomnr(hond.stamboomnr);
                    
                    if (bestaandeHond && overschrijven) {
                        await this.updateHond({ ...hond, id: bestaandeHond.id });
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
                    const hondBestaat = await this.getHondByStamboomnr(info.stamboomnr);
                    if (hondBestaat) {
                        await this.bewaarPriveInfo(info);
                        resultaat.priveInfo.bijgewerkt++;
                    } else {
                        console.log(`Privé info overgeslagen: Hond met stamboomnr ${info.stamboomnr} niet gevonden`);
                        resultaat.priveInfo.fouten++;
                    }
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
        
        const user = window.auth?.getCurrentUser();
        if (!user || !user.isAdmin?.()) {
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
        
        const user = window.auth?.getCurrentUser();
        if (!user || !user.permissions?.includes('private_full')) {
            throw new Error('Geen rechten om alle privé informatie op te halen');
        }
        
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
        
        const [honden, fotos] = await Promise.all([
            this.getHonden(),
            this.getAllFotos()
        ]);
        
        let priveInfoCount = 0;
        try {
            if (window.auth?.getCurrentUser()?.permissions?.includes('private_full')) {
                const priveInfo = await this.getAllPriveInfo();
                priveInfoCount = priveInfo.length;
            }
        } catch (error) {
            console.log('Geen toegang tot privé info statistieken');
        }
        
        // Tel honden per kennel
        const kennelStats = {};
        honden.forEach(hond => {
            const kennel = hond.kennelnaam || 'Geen kennel';
            kennelStats[kennel] = (kennelStats[kennel] || 0) + 1;
        });
        
        return {
            totaalHonden: honden.length,
            totaalFotos: fotos.length,
            totaalPriveInfo: priveInfoCount,
            kennelStatistieken: {
                totaalKennels: Object.keys(kennelStats).length,
                hondenPerKennel: kennelStats
            },
            laatsteUpdate: honden.reduce((latest, hond) => {
                const hondDatum = new Date(hond.updatedAt || hond.createdAt);
                return hondDatum > latest ? hondDatum : latest;
            }, new Date(0)).toISOString(),
            databaseGrootte: await this.berekenDatabaseGrootte()
        };
    }

    async berekenDatabaseGrootte() {
        const [honden, fotos] = await Promise.all([
            this.getHonden(),
            this.getAllFotos()
        ]);
        
        let priveInfoCount = 0;
        try {
            if (window.auth?.getCurrentUser()?.permissions?.includes('private_full')) {
                const priveInfo = await this.getAllPriveInfo();
                priveInfoCount = priveInfo.length;
            }
        } catch (error) {
            // Geen toegang, gebruik standaard
        }
        
        const avgHondSize = 1500; // Iets groter door kennelnaam veld
        const avgFotoSize = 50000;
        const avgPriveSize = 1000;
        
        const totalBytes = 
            (honden.length * avgHondSize) +
            (fotos.length * avgFotoSize) +
            (priveInfoCount * avgPriveSize);
        
        if (totalBytes < 1024) return totalBytes + ' B';
        if (totalBytes < 1048576) return (totalBytes / 1024).toFixed(1) + ' KB';
        return (totalBytes / 1048576).toFixed(1) + ' MB';
    }

    // ========== BACKUP EN HERSTEL ==========

    async maakBackup() {
        const user = window.auth?.getCurrentUser();
        if (!user || !user.permissions?.includes('private_full')) {
            throw new Error('Geen rechten om backup te maken');
        }
        
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
        const user = window.auth?.getCurrentUser();
        if (!user || !user.isAdmin?.()) {
            throw new Error('Alleen administrators mogen backups herstellen');
        }
        
        try {
            const backupData = JSON.parse(backupString);
            
            if (!backupData.metadata || !backupData.honden) {
                throw new Error('Ongeldig backup formaat');
            }
            
            await this.wisAlleData();
            
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