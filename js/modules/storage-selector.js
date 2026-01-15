/**
 * Storage Manager voor HondenDatabase Desktop Edition
 * Beheert zowel FileSystem als IndexedDB opslag
 */

class StorageManager {
    constructor() {
        this.storageType = 'auto'; // 'filesystem', 'indexeddb', 'auto'
        this.availableTypes = this.detectStorageTypes();
        this.currentStorage = null;
        this.migrationInProgress = false;
        this.dbReady = false;
        
        console.log('StorageManager geïnitialiseerd:', {
            available: this.availableTypes,
            preferred: this.storageType
        });
        
        // Luister naar database ready event
        window.addEventListener('database-ready', () => {
            console.log('Database ready event ontvangen in StorageManager');
            this.dbReady = true;
            
            // Als FileSystem actief is, migreer data
            if (this.currentStorage && this.currentStorage.type === 'filesystem') {
                this.migrateAllDataToFileSystem();
            }
        });
        
        // Controleer of database al klaar is
        if (window.db) {
            this.dbReady = true;
        }
    }
    
    detectStorageTypes() {
        const supportsFileSystem = 'showDirectoryPicker' in window;
        const supportsIndexedDB = 'indexedDB' in window;
        const supportsLocalStorage = 'localStorage' in window;
        
        console.log('Storage detectie:', {
            indexeddb: supportsIndexedDB,
            filesystem: supportsFileSystem,
            localStorage: supportsLocalStorage
        });
        
        return {
            filesystem: supportsFileSystem,
            indexeddb: supportsIndexedDB,
            localStorage: supportsLocalStorage
        };
    }
    
    async initialize(preferredType = 'auto') {
        try {
            // Laad configuratie
            const config = this.loadConfig();
            
            // Bepaal welk type te gebruiken
            let typeToUse = preferredType;
            if (preferredType === 'auto') {
                if (config.type && this.availableTypes[config.type]) {
                    typeToUse = config.type;
                } else {
                    typeToUse = this.availableTypes.filesystem ? 'filesystem' : 'indexeddb';
                }
            }
            
            console.log(`Initializing with storage type: ${typeToUse}`);
            
            // Initialize de gekozen opslag
            if (typeToUse === 'filesystem') {
                await this.initializeFileSystem(config);
            } else {
                await this.initializeIndexedDB(config);
            }
            
            console.log(`StorageManager geïnitialiseerd met: ${this.currentStorage.type}`);
            return this.currentStorage;
            
        } catch (error) {
            console.error('Initialisatie fout:', error);
            
            // Fallback naar IndexedDB
            if (preferredType !== 'indexeddb' && this.availableTypes.indexeddb) {
                console.log('Fallback naar IndexedDB...');
                return await this.initializeIndexedDB();
            }
            
            throw error;
        }
    }
    
    async initializeFileSystem(config) {
        console.log('Initializing FileSystem backend...');
        
        try {
            // Als er een opgeslagen pad is in config, probeer die te gebruiken
            if (config.selectedPath) {
                await this.initializeFileSystemWithPath(config);
                return;
            }
            
            // Anders vraag gebruiker om een map te selecteren
            const directoryHandle = await window.showDirectoryPicker({
                id: 'hondenDatabaseFolder',
                mode: 'readwrite',
                startIn: 'documents'
            });
            
            // Vraag toestemming om map te openen
            if ((await directoryHandle.queryPermission({ mode: 'readwrite' })) !== 'granted') {
                const permission = await directoryHandle.requestPermission({ mode: 'readwrite' });
                if (permission !== 'granted') {
                    throw new Error('Geen toestemming voor map toegang');
                }
            }
            
            // Maak app map aan
            const appDirectory = await directoryHandle.getDirectoryHandle('HondenDatabase_PWA', { create: true });
            
            this.currentStorage = {
                type: 'filesystem',
                directoryHandle: appDirectory,
                directoryName: directoryHandle.name,
                supportsTransactions: false,
                supportsQuery: false
            };
            
            console.log('Map geselecteerd:', directoryHandle.name);
            console.log('App map beschikbaar:', appDirectory);
            
            // Sla configuratie op
            this.saveConfig({
                type: 'filesystem',
                selectedPath: directoryHandle.name,
                appDirectory: 'HondenDatabase_PWA',
                lastSync: new Date().toISOString()
            });
            
            // Migreer bestaande data indien beschikbaar
            await this.migrateAllDataToFileSystem();
            
        } catch (error) {
            console.error('FileSystem init error:', error);
            throw error;
        }
    }
    
    async initializeFileSystemWithPath(config) {
        console.log('Probeer opgeslagen map te openen...');
        
        try {
            // Huidige implementatie vereist nog steeds een user gesture
            // We kunnen de opgeslagen configuratie alleen gebruiken als referentie
            console.log('Config gevonden voor pad:', config.selectedPath);
            
            // Toon map picker met suggestie
            const directoryHandle = await window.showDirectoryPicker({
                id: 'hondenDatabaseFolder',
                mode: 'readwrite',
                startIn: 'documents'
            });
            
            // Controleer of dit dezelfde map is (op naam)
            if (directoryHandle.name === config.selectedPath) {
                console.log('Bestaande map herkend:', config.selectedPath);
                
                // Vraag toestemming
                if ((await directoryHandle.queryPermission({ mode: 'readwrite' })) !== 'granted') {
                    const permission = await directoryHandle.requestPermission({ mode: 'readwrite' });
                    if (permission !== 'granted') {
                        throw new Error('Geen toestemming voor map toegang');
                    }
                }
                
                // Open app map
                const appDirectory = await directoryHandle.getDirectoryHandle('HondenDatabase_PWA', { create: true });
                
                this.currentStorage = {
                    type: 'filesystem',
                    directoryHandle: appDirectory,
                    directoryName: directoryHandle.name,
                    supportsTransactions: false,
                    supportsQuery: false
                };
                
                console.log('FileSystem backend hersteld uit configuratie');
                return;
            }
            
            // Nieuwe map geselecteerd, maak app map aan
            const appDirectory = await directoryHandle.getDirectoryHandle('HondenDatabase_PWA', { create: true });
            
            this.currentStorage = {
                type: 'filesystem',
                directoryHandle: appDirectory,
                directoryName: directoryHandle.name,
                supportsTransactions: false,
                supportsQuery: false
            };
            
            // Update configuratie
            this.saveConfig({
                type: 'filesystem',
                selectedPath: directoryHandle.name,
                appDirectory: 'HondenDatabase_PWA',
                lastSync: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Kon opgeslagen map niet openen:', error);
            
            // Fallback: vraag gebruiker om nieuwe map
            console.log('Probeer nieuwe map te selecteren...');
            await this.initializeFileSystem({});
        }
    }
    
    async initializeIndexedDB(config) {
        console.log('Initializing IndexedDB backend...');
        
        try {
            // Sla configuratie op
            this.saveConfig({
                type: 'indexeddb',
                lastSync: new Date().toISOString()
            });
            
            this.currentStorage = {
                type: 'indexeddb',
                supportsTransactions: true,
                supportsQuery: true
            };
            
            console.log('IndexedDB backend ready');
            
        } catch (error) {
            console.error('IndexedDB init error:', error);
            throw error;
        }
    }
    
    async migrateAllDataToFileSystem() {
        if (this.migrationInProgress) {
            console.log('Migratie al bezig...');
            return;
        }
        
        this.migrationInProgress = true;
        console.log('Start migratie van alle bestaande data...');
        
        try {
            // Wacht op database indien nodig
            if (!window.db) {
                console.log('Database nog niet beschikbaar, wacht...');
                
                // Luister naar database ready event
                return new Promise((resolve) => {
                    const listener = () => {
                        console.log('Database beschikbaar voor migratie');
                        window.removeEventListener('database-ready', listener);
                        this.performMigration().then(resolve);
                    };
                    window.addEventListener('database-ready', listener);
                });
            }
            
            await this.performMigration();
            
        } catch (error) {
            console.error('Migratie fout:', error);
        } finally {
            this.migrationInProgress = false;
        }
    }
    
    async performMigration() {
        if (!window.db) {
            console.log('Geen database gevonden, niets te migreren');
            return;
        }
        
        try {
            console.log('Voer migratie uit...');
            
            // 1. Migreer honden
            const honden = await window.db.getHonden();
            console.log(`Migreer ${honden.length} honden...`);
            
            for (const hond of honden) {
                if (hond.stamboomnr) {
                    await this.save(`hond_${hond.stamboomnr}`, hond);
                } else if (hond.id) {
                    await this.save(`hond_${hond.id}`, hond);
                }
            }
            
            // 2. Migreer foto's (indien beschikbaar)
            if (typeof window.db.getAllFotos === 'function') {
                try {
                    const fotos = await window.db.getAllFotos();
                    console.log(`Migreer ${fotos.length} foto's...`);
                    
                    // Groepeer foto's per stamboomnr
                    const fotosPerHond = {};
                    fotos.forEach(foto => {
                        if (foto.stamboomnr) {
                            if (!fotosPerHond[foto.stamboomnr]) {
                                fotosPerHond[foto.stamboomnr] = [];
                            }
                            fotosPerHond[foto.stamboomnr].push(foto);
                        }
                    });
                    
                    // Sla gegroepeerde foto's op
                    for (const [stamboomnr, hondFotos] of Object.entries(fotosPerHond)) {
                        await this.save(`fotos_${stamboomnr}`, hondFotos);
                    }
                } catch (fotoError) {
                    console.log('Foto migratie overslagen:', fotoError);
                }
            }
            
            // 3. Migreer privé info (indien beschikbaar)
            if (typeof window.db.getAllPriveInfo === 'function') {
                try {
                    const priveInfo = await window.db.getAllPriveInfo();
                    console.log(`Migreer ${priveInfo.length} privé records...`);
                    
                    for (const prive of priveInfo) {
                        if (prive.stamboomnr) {
                            await this.save(`prive_${prive.stamboomnr}`, prive);
                        }
                    }
                } catch (priveError) {
                    console.log('Privé info migratie overslagen:', priveError);
                }
            }
            
            console.log('FileSystem backend ready, alle data gemigreerd');
            
        } catch (error) {
            console.error('Fout tijdens migratie:', error);
        }
    }
    
    loadConfig() {
        try {
            const configJson = localStorage.getItem('hondenDatabase_storageConfig');
            if (configJson) {
                const config = JSON.parse(configJson);
                console.log('Configuratie geladen uit localStorage:', config);
                return config;
            }
        } catch (error) {
            console.error('Fout bij laden configuratie:', error);
        }
        
        return {};
    }
    
    saveConfig(config) {
        try {
            const fullConfig = {
                ...this.loadConfig(),
                ...config,
                lastSync: new Date().toISOString()
            };
            
            localStorage.setItem('hondenDatabase_storageConfig', JSON.stringify(fullConfig));
            console.log('Configuratie opgeslagen in localStorage:', fullConfig);
            
            // Ook opslaan in FileSystem als die actief is
            if (this.currentStorage && this.currentStorage.type === 'filesystem') {
                this.save('config', fullConfig);
            }
            
        } catch (error) {
            console.error('Fout bij opslaan configuratie:', error);
        }
    }
    
    getStorageInfo() {
        if (!this.currentStorage) {
            return {
                type: this.storageType,
                available: this.availableTypes,
                current: 'none',
                supportsFileSystem: this.availableTypes.filesystem,
                directoryName: null,
                usedSpace: 'unknown'
            };
        }
        
        return {
            type: this.storageType,
            available: this.availableTypes,
            current: this.currentStorage.type,
            supportsFileSystem: this.availableTypes.filesystem,
            directoryName: this.currentStorage.directoryName || null,
            usedSpace: 'unknown'
        };
    }
    
    async save(key, data) {
        if (!this.currentStorage) {
            throw new Error('Geen opslag geïnitialiseerd');
        }
        
        if (this.currentStorage.type === 'filesystem') {
            return await this.saveToFileSystem(key, data);
        } else {
            return await this.saveToIndexedDB(key, data);
        }
    }
    
    async saveToFileSystem(key, data) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const encoder = new TextEncoder();
            const dataArray = encoder.encode(jsonString);
            
            // Maak bestand aan in de app map
            const fileHandle = await this.currentStorage.directoryHandle.getFileHandle(`${key}.json`, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(dataArray);
            await writable.close();
            
            console.log(`Bestand opgeslagen: ${key}.json`);
            return true;
            
        } catch (error) {
            console.error(`Fout bij opslaan ${key}:`, error);
            throw error;
        }
    }
    
    async saveToIndexedDB(key, data) {
        // Simpele localStorage fallback voor nu
        try {
            localStorage.setItem(`honden_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Fout bij opslaan in localStorage:`, error);
            throw error;
        }
    }
    
    async load(key) {
        if (!this.currentStorage) {
            throw new Error('Geen opslag geïnitialiseerd');
        }
        
        if (this.currentStorage.type === 'filesystem') {
            return await this.loadFromFileSystem(key);
        } else {
            return await this.loadFromIndexedDB(key);
        }
    }
    
    async loadFromFileSystem(key) {
        try {
            const fileHandle = await this.currentStorage.directoryHandle.getFileHandle(`${key}.json`);
            const file = await fileHandle.getFile();
            const text = await file.text();
            return JSON.parse(text);
            
        } catch (error) {
            console.error(`Fout bij laden ${key}:`, error);
            return null;
        }
    }
    
    async loadFromIndexedDB(key) {
        // Simpele localStorage fallback voor nu
        try {
            const data = localStorage.getItem(`honden_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Fout bij laden uit localStorage:`, error);
            return null;
        }
    }
    
    async listFiles() {
        if (!this.currentStorage || this.currentStorage.type !== 'filesystem') {
            return [];
        }
        
        try {
            const files = [];
            for await (const entry of this.currentStorage.directoryHandle.values()) {
                files.push({
                    name: entry.name,
                    kind: entry.kind,
                    type: entry.kind === 'file' ? 'file' : 'directory'
                });
            }
            return files;
        } catch (error) {
            console.error('Fout bij lijsten van bestanden:', error);
            return [];
        }
    }
    
    async delete(key) {
        if (!this.currentStorage) {
            throw new Error('Geen opslag geïnitialiseerd');
        }
        
        if (this.currentStorage.type === 'filesystem') {
            try {
                await this.currentStorage.directoryHandle.removeEntry(`${key}.json`);
                console.log(`Bestand verwijderd: ${key}.json`);
                return true;
            } catch (error) {
                console.error(`Fout bij verwijderen ${key}:`, error);
                return false;
            }
        } else {
            // Voor IndexedDB/localStorage
            localStorage.removeItem(`honden_${key}`);
            return true;
        }
    }
}

// Maak globale instance
const storageManager = new StorageManager();

// Voeg toe aan window object
window.storageManager = storageManager;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, storageManager };
}