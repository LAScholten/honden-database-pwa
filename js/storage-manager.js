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
        this.pendingFileSystemInit = false;
        
        console.log('StorageManager geïnitialiseerd:', {
            available: this.availableTypes,
            preferred: this.storageType
        });
        
        // Laad configuratie direct
        this.config = this.loadConfig();
        console.log('Configuratie geladen:', this.config);
        
        // Stel huidige opslag in op basis van config
        this.setCurrentStorageFromConfig();
        
        // Luister naar database ready event
        window.addEventListener('database-ready', () => {
            console.log('Database ready event ontvangen in StorageManager');
            this.dbReady = true;
            
            // Als FileSystem actief is EN er zijn al bestanden, laad ze dan
            if (this.currentStorage && this.currentStorage.type === 'filesystem') {
                console.log('FileSystem actief, controleer of er data is om te laden...');
                // We laden data pas wanneer de gebruiker dat expliciet vraagt
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
    
    setCurrentStorageFromConfig() {
        if (this.config.type === 'filesystem') {
            console.log('FileSystem configuratie gevonden, maar wacht op user gesture...');
            this.currentStorage = {
                type: 'filesystem',
                directoryHandle: null,
                directoryName: this.config.selectedPath || 'Geselecteerd',
                supportsTransactions: false,
                supportsQuery: false,
                needsReinit: true // Markeer dat we opnieuw moeten initialiseren
            };
            this.pendingFileSystemInit = true;
        } else {
            // Default naar IndexedDB
            this.currentStorage = {
                type: 'indexeddb',
                supportsTransactions: true,
                supportsQuery: true
            };
            console.log('Huidige opslag ingesteld op IndexedDB');
        }
    }
    
    async initialize(preferredType = 'auto') {
        if (this.isInitializing) {
            console.log('Initialisatie al bezig...');
            return this.currentStorage;
        }
        
        this.isInitializing = true;
        
        try {
            console.log(`StorageManager.initialize() aangeroepen met type: ${preferredType}`);
            
            // Bepaal welk type te gebruiken
            let typeToUse = preferredType;
            if (preferredType === 'auto') {
                if (this.config.type && this.availableTypes[this.config.type]) {
                    typeToUse = this.config.type;
                } else {
                    typeToUse = this.availableTypes.filesystem ? 'filesystem' : 'indexeddb';
                }
            }
            
            console.log(`Initialiseren met opslagtype: ${typeToUse}`);
            
            // Initialize de gekozen opslag
            if (typeToUse === 'filesystem') {
                await this.initializeFileSystem();
            } else {
                this.initializeIndexedDB();
            }
            
            console.log(`StorageManager geïnitialiseerd met: ${this.currentStorage.type}`);
            
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
    
    async initializeFileSystem() {
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
            
            // Maak app map aan of open bestaande
            const appDirectory = await directoryHandle.getDirectoryHandle('HondenDatabase_PWA', { create: true });
            
            this.currentStorage = {
                type: 'filesystem',
                directoryHandle: appDirectory,
                directoryName: directoryHandle.name,
                supportsTransactions: false,
                supportsQuery: false,
                needsReinit: false
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
            
            // Controleer of er al data in de map staat
            const files = await this.listFiles();
            console.log(`Aantal bestanden in map: ${files.length}`);
            
            if (files.length > 0) {
                console.log('Er staan al bestanden in de map, laad deze in de database...');
                await this.loadFromFileSystemToDatabase();
            } else {
                console.log('Map is leeg, migreer bestaande data...');
                await this.migrateAllDataToFileSystem();
            }
            
            this.pendingFileSystemInit = false;
            
        } catch (error) {
            console.error('FileSystem init error:', error);
            throw error;
        }
    }
    
    initializeIndexedDB() {
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
        
        if (!this.dbReady || !window.db) {
            console.log('Database niet beschikbaar, kan niet migreren');
            return;
        }
        
        this.migrationInProgress = true;
        console.log('Start migratie van bestaande data naar FileSystem...');
        
        try {
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
                    console.log(`Hond opgeslagen: ${hond.stamboomnr}`);
                } else if (hond.id) {
                    const filename = this.createSafeFilename(`hond_${hond.id}`);
                    await this.save(filename, hond);
                    console.log(`Hond opgeslagen: ${hond.id}`);
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
                        console.log(`Foto's opgeslagen voor: ${stamboomnr}`);
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
                            console.log(`Privé info opgeslagen voor: ${prive.stamboomnr}`);
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
            
            if (window.uiHandler && window.uiHandler.showSuccess) {
                window.uiHandler.showSuccess(`${honden.length} honden gemigreerd naar FileSystem`);
            }
            
        } catch (error) {
            console.error('Fout tijdens migratie:', error);
            throw error;
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
            
            // Eerst alle honden laden
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
                        }
                    } catch (error) {
                        console.error(`Fout bij laden bestand ${file.name}:`, error);
                    }
                }
            }
            
            // Dan foto's en privé info
            for (const file of files) {
                if (file.type === 'file' && file.name.endsWith('.json')) {
                    const key = file.name.replace('.json', '');
                    
                    try {
                        const data = await this.load(key);
                        
                        if (!data) continue;
                        
                        // Bepaal type data en voeg toe aan database
                        if (key.startsWith('fotos_')) {
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
                    window.uiHandler.showSuccess(`${hondenGeladen} honden geladen uit map`);
                }
            }, 500);
            
        } catch (error) {
            console.error('Fout bij laden data uit FileSystem:', error);
            throw error;
        }
    }
    
    async loadHondToDatabase(hondData) {
        if (!window.db) return;
        
        try {
            // Clean hond data
            const cleanHondData = {};
            for (const [key, value] of Object.entries(hondData)) {
                if (value !== null && value !== undefined) {
                    cleanHondData[key] = value;
                }
            }
            
            // Verwijder eventuele bestaande ID's voor clean import
            if (cleanHondData.id) {
                delete cleanHondData.id;
            }
            
            // Controleer of hond al bestaat
            const existingHonden = await window.db.getHonden();
            
            // Zoek op stamboomnr
            let exists = false;
            if (cleanHondData.stamboomnr) {
                exists = existingHonden.some(h => h.stamboomnr === cleanHondData.stamboomnr);
            }
            
            if (!exists) {
                // Voeg nieuwe hond toe
                await window.db.voegHondToe(cleanHondData);
                console.log(`Hond toegevoegd: ${cleanHondData.stamboomnr || cleanHondData.naam || 'onbekend'}`);
            } else {
                // Update bestaande hond
                const existingHond = existingHonden.find(h => h.stamboomnr === cleanHondData.stamboomnr);
                
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
                    
                    // Verwijder ID voor clean import
                    if (cleanFoto.id) {
                        delete cleanFoto.id;
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
            // Clean prive data
            const cleanPrive = {};
            for (const [key, value] of Object.entries(priveData)) {
                if (value !== null && value !== undefined) {
                    cleanPrive[key] = value;
                }
            }
            
            await window.db.bewaarPriveInfo(cleanPrive);
            console.log(`Privé info geladen voor: ${cleanPrive.stamboomnr || 'onbekend'}`);
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
                return JSON.parse(configJson);
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
            this.config = fullConfig;
            
            console.log('Configuratie opgeslagen in localStorage:', fullConfig);
            
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
                usedSpace: 'unknown',
                needsReinit: false
            };
        }
        
        return {
            type: this.storageType,
            available: this.availableTypes,
            current: this.currentStorage.type,
            supportsFileSystem: this.availableTypes.filesystem,
            directoryName: this.currentStorage.directoryName || null,
            usedSpace: 'unknown',
            needsReinit: this.currentStorage.needsReinit || false
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
        
        if (!this.currentStorage.directoryHandle) {
            console.error('Geen directory handle beschikbaar voor FileSystem');
            throw new Error('FileSystem niet correct geïnitialiseerd');
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
        
        if (!this.currentStorage.directoryHandle) {
            console.error('Geen directory handle beschikbaar voor FileSystem');
            return null;
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