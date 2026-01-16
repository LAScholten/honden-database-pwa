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
        this.isInitializing = false;
        
        console.log('StorageManager geïnitialiseerd:', {
            available: this.availableTypes,
            preferred: this.storageType
        });
        
        // LAAD DIRECT CONFIGURATIE en initialiseer
        this.loadConfigAndInitialize();
    }
    
    async loadConfigAndInitialize() {
        try {
            const config = this.loadConfig();
            console.log('Configuratie geladen:', config);
            
            // Als FileSystem was geselecteerd, herstel die
            if (config.type === 'filesystem') {
                console.log('FileSystem was eerder geselecteerd, herstellen...');
                // We zullen wachten op user gesture om de map te heropenen
                // Voor nu markeren we FileSystem als actief maar wachten op init
                this.currentStorage = {
                    type: 'filesystem',
                    directoryHandle: null,
                    directoryName: config.selectedPath || 'Niet beschikbaar',
                    supportsTransactions: false,
                    supportsQuery: false
                };
            } else if (config.type === 'indexeddb' || !config.type) {
                // Standaard naar IndexedDB
                this.initializeIndexedDB(config);
            }
        } catch (error) {
            console.error('Fout bij laden configuratie:', error);
            // Standaard naar IndexedDB
            this.initializeIndexedDB({});
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
        if (this.isInitializing) {
            console.log('Initialisatie al bezig...');
            return this.currentStorage;
        }
        
        this.isInitializing = true;
        
        try {
            console.log(`StorageManager.initialize() aangeroepen met type: ${preferredType}`);
            
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
            
            console.log(`Initialiseren met opslagtype: ${typeToUse}`);
            
            // Initialize de gekozen opslag
            if (typeToUse === 'filesystem') {
                await this.initializeFileSystem(config);
            } else {
                this.initializeIndexedDB(config);
            }
            
            console.log(`StorageManager geïnitialiseerd met: ${this.currentStorage.type}`);
            
            // Dispatch event voor andere modules
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('storage-manager-ready', {
                    detail: { storageManager: this }
                }));
            }, 100);
            
            return this.currentStorage;
            
        } catch (error) {
            console.error('Initialisatie fout:', error);
            
            // Fallback naar IndexedDB
            if (preferredType !== 'indexeddb' && this.availableTypes.indexeddb) {
                console.log('Fallback naar IndexedDB...');
                this.initializeIndexedDB();
            }
            
            throw error;
            
        } finally {
            this.isInitializing = false;
        }
    }
    
    async initializeFileSystem(config) {
        console.log('Initialiseren FileSystem backend...');
        
        try {
            // Vraag gebruiker om een map te selecteren
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
            
            console.log('FileSystem backend succesvol geïnitialiseerd');
            
            // Migreer bestaande data naar FileSystem
            await this.migrateAllDataToFileSystem();
            
            // Laad data terug in database (indien nodig)
            await this.loadFromFileSystemToDatabase();
            
        } catch (error) {
            console.error('FileSystem init error:', error);
            throw error;
        }
    }
    
    initializeIndexedDB(config) {
        console.log('Initialiseren IndexedDB backend...');
        
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
        console.log('Start migratie van bestaande data naar FileSystem...');
        
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
                    const filename = this.createSafeFilename(`hond_${hond.stamboomnr}`);
                    await this.save(filename, hond);
                } else if (hond.id) {
                    const filename = this.createSafeFilename(`hond_${hond.id}`);
                    await this.save(filename, hond);
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
                        const filename = this.createSafeFilename(`fotos_${stamboomnr}`);
                        await this.save(filename, hondFotos);
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
                            const filename = this.createSafeFilename(`prive_${prive.stamboomnr}`);
                            await this.save(filename, prive);
                        }
                    }
                } catch (priveError) {
                    console.log('Privé info migratie overslagen:', priveError);
                }
            }
            
            // 4. Maak backup van configuratie
            const backupConfig = {
                backupDate: new Date().toISOString(),
                hondenCount: honden.length,
                version: '1.0'
            };
            
            await this.save('backup_info', backupConfig);
            
            console.log('Data migratie naar FileSystem voltooid!');
            
        } catch (error) {
            console.error('Fout tijdens migratie:', error);
        }
    }
    
    async loadFromFileSystemToDatabase() {
        if (!this.currentStorage || this.currentStorage.type !== 'filesystem') {
            console.log('FileSystem niet actief, geen data te laden');
            return;
        }
        
        if (!window.db) {
            console.log('Database niet beschikbaar, kan data niet laden');
            
            // Wacht op database
            for (let i = 0; i < 50; i++) {
                if (window.db) {
                    console.log('Database nu beschikbaar');
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            if (!window.db) {
                console.error('Database niet beschikbaar na wachten');
                return;
            }
        }
        
        try {
            console.log('Laad data uit FileSystem naar database...');
            
            // Haal alle bestanden op uit de map
            const files = await this.listFiles();
            console.log(`Bestanden gevonden in map: ${files.length}`);
            
            let hondenGeladen = 0;
            let fotosGeladen = 0;
            let priveGeladen = 0;
            
            // Verwerk elk bestand
            for (const file of files) {
                if (file.type === 'file' && file.name.endsWith('.json')) {
                    const key = file.name.replace('.json', '');
                    
                    try {
                        const data = await this.load(key);
                        
                        if (!data) continue;
                        
                        // Bepaal type data en voeg toe aan database
                        if (key.startsWith('hond_')) {
                            await this.loadHondToDatabase(data);
                            hondenGeladen++;
                        } else if (key.startsWith('fotos_')) {
                            await this.loadFotosToDatabase(data);
                            fotosGeladen += Array.isArray(data) ? data.length : 1;
                        } else if (key.startsWith('prive_')) {
                            await this.loadPriveInfoToDatabase(data);
                            priveGeladen++;
                        }
                    } catch (error) {
                        console.error(`Fout bij laden bestand ${file.name}:`, error);
                    }
                }
            }
            
            console.log(`Data geladen uit FileSystem: ${hondenGeladen} honden, ${fotosGeladen} foto's, ${priveGeladen} privé records`);
            
            // Refresh de UI
            setTimeout(() => {
                if (window.refreshHondenLijst) {
                    window.refreshHondenLijst();
                }
                
                if (window.uiHandler && window.uiHandler.showSuccess && hondenGeladen > 0) {
                    window.uiHandler.showSuccess(`Data geladen uit map: ${hondenGeladen} honden`);
                }
            }, 500);
            
        } catch (error) {
            console.error('Fout bij laden data uit FileSystem:', error);
        }
    }
    
    async loadHondToDatabase(hondData) {
        if (!window.db) return;
        
        try {
            // Verwijder eventuele null/undefined waarden
            const cleanHondData = {};
            for (const [key, value] of Object.entries(hondData)) {
                if (value !== null && value !== undefined) {
                    cleanHondData[key] = value;
                }
            }
            
            // Controleer of hond al bestaat
            const existingHonden = await window.db.getHonden();
            
            // Zoek op stamboomnr of ID
            const exists = existingHonden.some(h => 
                (h.stamboomnr && cleanHondData.stamboomnr && h.stamboomnr === cleanHondData.stamboomnr) || 
                (cleanHondData.id && h.id === cleanHondData.id)
            );
            
            if (!exists) {
                // Voeg nieuwe hond toe
                await window.db.voegHondToe(cleanHondData);
                console.log(`Hond toegevoegd: ${cleanHondData.stamboomnr || cleanHondData.naam || 'onbekend'}`);
            } else {
                // Update bestaande hond
                const existingHond = existingHonden.find(h => 
                    (h.stamboomnr && cleanHondData.stamboomnr && h.stamboomnr === cleanHondData.stamboomnr) || 
                    (cleanHondData.id && h.id === cleanHondData.id)
                );
                
                if (existingHond) {
                    const updateData = { ...cleanHondData, id: existingHond.id };
                    await window.db.updateHond(updateData);
                    console.log(`Hond bijgewerkt: ${cleanHondData.stamboomnr || cleanHondData.naam || 'onbekend'}`);
                }
            }
        } catch (error) {
            console.error(`Fout bij laden hond:`, error);
        }
    }
    
    async loadFotosToDatabase(fotosData) {
        if (!window.db || typeof window.db.voegFotoToe !== 'function') return;
        
        try {
            const fotosArray = Array.isArray(fotosData) ? fotosData : [fotosData];
            
            for (const foto of fotosArray) {
                try {
                    // Clean foto data
                    const cleanFoto = {};
                    for (const [key, value] of Object.entries(foto)) {
                        if (value !== null && value !== undefined) {
                            cleanFoto[key] = value;
                        }
                    }
                    
                    await window.db.voegFotoToe(cleanFoto);
                    console.log(`Foto toegevoegd: ${cleanFoto.bestandsnaam || cleanFoto.filename || 'onbekend'}`);
                } catch (fotoError) {
                    console.error(`Fout bij laden foto:`, fotoError);
                }
            }
        } catch (error) {
            console.error('Fout bij laden foto\'s:', error);
        }
    }
    
    async loadPriveInfoToDatabase(priveData) {
        if (!window.db || typeof window.db.bewaarPriveInfo !== 'function') return;
        
        try {
            await window.db.bewaarPriveInfo(priveData);
            console.log(`Privé info geladen voor: ${priveData.stamboomnr || 'onbekend'}`);
        } catch (error) {
            console.error(`Fout bij laden privé info:`, error);
        }
    }
    
    createSafeFilename(baseName) {
        // Verwijder ongeldige karakters voor bestandsnamen
        let safeName = baseName.replace(/[<>:"/\\|?*]/g, '_');
        
        // Vervang spaties door underscores
        safeName = safeName.replace(/\s+/g, '_');
        
        // Zorg dat de naam niet te lang is
        if (safeName.length > 100) {
            safeName = safeName.substring(0, 100);
        }
        
        // Voeg .json extensie toe
        return `${safeName}.json`;
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
            
        } catch (error) {
            console.error('Fout bij opslaan configuratie:', error);
        }
    }
    
    getStorageInfo() {
        if (!this.currentStorage) {
            const config = this.loadConfig();
            return {
                type: this.storageType,
                available: this.availableTypes,
                current: config.type || 'none',
                supportsFileSystem: this.availableTypes.filesystem,
                directoryName: config.selectedPath || null,
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
        if (!this.currentStorage || this.currentStorage.type !== 'filesystem') {
            console.log('FileSystem niet actief, opslaan in localStorage');
            try {
                localStorage.setItem(`honden_${key}`, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error(`Fout bij opslaan in localStorage:`, error);
                throw error;
            }
        }
        
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const encoder = new TextEncoder();
            const dataArray = encoder.encode(jsonString);
            
            // Maak bestand aan in de app map
            const fileHandle = await this.currentStorage.directoryHandle.getFileHandle(`${key}.json`, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(dataArray);
            await writable.close();
            
            console.log(`Bestand opgeslagen in FileSystem: ${key}.json`);
            return true;
            
        } catch (error) {
            console.error(`Fout bij opslaan ${key} in FileSystem:`, error);
            throw error;
        }
    }
    
    async load(key) {
        if (!this.currentStorage || this.currentStorage.type !== 'filesystem') {
            console.log('FileSystem niet actief, laden uit localStorage');
            try {
                const data = localStorage.getItem(`honden_${key}`);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error(`Fout bij laden uit localStorage:`, error);
                return null;
            }
        }
        
        try {
            const fileHandle = await this.currentStorage.directoryHandle.getFileHandle(`${key}.json`);
            const file = await fileHandle.getFile();
            const text = await file.text();
            return JSON.parse(text);
            
        } catch (error) {
            console.error(`Fout bij laden ${key} uit FileSystem:`, error);
            return null;
        }
    }
    
    async listFiles() {
        if (!this.currentStorage || this.currentStorage.type !== 'filesystem' || !this.currentStorage.directoryHandle) {
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
            console.log('Geen opslag actief');
            return false;
        }
        
        if (this.currentStorage.type === 'filesystem') {
            try {
                await this.currentStorage.directoryHandle.removeEntry(`${key}.json`);
                console.log(`Bestand verwijderd uit FileSystem: ${key}.json`);
                return true;
            } catch (error) {
                console.error(`Fout bij verwijderen ${key} uit FileSystem:`, error);
                return false;
            }
        } else {
            // Voor localStorage
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