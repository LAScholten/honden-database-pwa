/**
 * Storage Manager voor HondenDatabase Desktop Edition
 * WERKEND MET AUTOMATISCH LADEN EN DUBBELE BESCHERMING
 */

class StorageManager {
    constructor() {
        this.storageType = 'auto';
        this.availableTypes = this.detectStorageTypes();
        this.currentStorage = null;
        this.migrationInProgress = false;
        this.dbReady = false;
        this.isInitializing = false;
        this.dataLoaded = false; // Voorkom herhaald laden
        
        console.log('StorageManager geïnitialiseerd:', this.availableTypes);
        
        this.config = this.loadConfig();
        this.setCurrentStorageFromConfig();
        
        if (window.db) {
            this.dbReady = true;
        } else {
            window.addEventListener('database-ready', () => {
                this.dbReady = true;
                console.log('Database ready in StorageManager');
            });
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
                needsReinit: true
            };
        } else {
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
            
            let typeToUse = preferredType;
            if (preferredType === 'auto') {
                typeToUse = this.config.type || (this.availableTypes.filesystem ? 'filesystem' : 'indexeddb');
            }
            
            console.log(`Initialiseren met opslagtype: ${typeToUse}`);
            
            let success = false;
            if (typeToUse === 'filesystem' && this.availableTypes.filesystem) {
                success = await this.initializeFileSystem();
                
                // AUTOMATISCH LADEN NA INIT
                if (success && !this.dataLoaded) {
                    console.log('Automatisch laden data uit FileSystem...');
                    setTimeout(() => {
                        this.loadFromFileSystemToDatabase().catch(e => 
                            console.log('Auto-load kon niet:', e.message)
                        );
                    }, 1000);
                }
            } else {
                success = this.initializeIndexedDB();
            }
            
            if (success) {
                console.log(`✅ StorageManager geïnitialiseerd met: ${this.currentStorage.type}`);
            }
            
            return this.currentStorage;
            
        } catch (error) {
            console.error('Initialisatie fout:', error);
            
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
            // Vraag gebruiker om map te selecteren
            const directoryHandle = await window.showDirectoryPicker({
                id: 'hondenDatabaseFolder',
                mode: 'readwrite',
                startIn: 'documents'
            });
            
            // Vraag permissie
            if ((await directoryHandle.queryPermission({ mode: 'readwrite' })) !== 'granted') {
                const permission = await directoryHandle.requestPermission({ mode: 'readwrite' });
                if (permission !== 'granted') {
                    throw new Error('Geen toestemming voor map toegang');
                }
            }
            
            // Open of maak app map aan
            let appDirectory;
            try {
                appDirectory = await directoryHandle.getDirectoryHandle('HondenDatabase_PWA', { create: true });
            } catch (error) {
                console.log('Kan app map niet maken, gebruik hoofdmap');
                appDirectory = directoryHandle;
            }
            
            this.currentStorage = {
                type: 'filesystem',
                directoryHandle: appDirectory,
                directoryName: directoryHandle.name,
                supportsTransactions: false,
                supportsQuery: false,
                needsReinit: false
            };
            
            console.log('Map geselecteerd:', directoryHandle.name);
            
            // Sla config op
            this.saveConfig({
                type: 'filesystem',
                selectedPath: directoryHandle.name,
                appDirectory: 'HondenDatabase_PWA',
                lastSync: new Date().toISOString()
            });
            
            console.log('✅ FileSystem backend succesvol geïnitialiseerd');
            return true;
            
        } catch (error) {
            console.error('FileSystem init error:', error);
            
            if (window.uiHandler?.showError) {
                let errorMsg = error.message;
                if (error.name === 'SecurityError' || error.message.includes('tracking')) {
                    errorMsg = 'Browser blokkeert map toegang. Controleer privacy instellingen of gebruik browser opslag.';
                }
                window.uiHandler.showError(`FileSystem kon niet geactiveerd worden:<br><small>${errorMsg}</small>`);
            }
            
            throw error;
        }
    }
    
    initializeIndexedDB() {
        console.log('Initialiseren IndexedDB backend...');
        
        try {
            this.saveConfig({
                type: 'indexeddb',
                lastSync: new Date().toISOString()
            });
            
            this.currentStorage = {
                type: 'indexeddb',
                supportsTransactions: true,
                supportsQuery: true
            };
            
            console.log('✅ IndexedDB backend ready');
            return true;
            
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
        
        if (this.currentStorage.type !== 'filesystem') {
            console.log('FileSystem niet actief');
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
            console.log('Voer migratie uit MET RELATIEHERSTEL...');
            
            const honden = await window.db.getHonden();
            console.log(`Migreer ${honden.length} honden...`);
            
            // STAP 1: Maak mapping tabellen
            const idToStamboomMap = {};
            const stamboomToIdMap = {};
            
            honden.forEach(hond => {
                if (hond.id && hond.stamboomnr) {
                    idToStamboomMap[hond.id] = hond.stamboomnr;
                    stamboomToIdMap[hond.stamboomnr] = hond.id;
                }
            });
            
            // STAP 2: Migreer honden met relatie conversie
            for (const hond of honden) {
                try {
                    const hondVoorOpslag = { ...hond };
                    
                    // Converteer vader ID naar stamboomnr
                    if (hond.vader_id && idToStamboomMap[hond.vader_id]) {
                        hondVoorOpslag.vader_stamboomnr = idToStamboomMap[hond.vader_id];
                        delete hondVoorOpslag.vader_id;
                    }
                    
                    // Converteer moeder ID naar stamboomnr
                    if (hond.moeder_id && idToStamboomMap[hond.moeder_id]) {
                        hondVoorOpslag.moeder_stamboomnr = idToStamboomMap[hond.moeder_id];
                        delete hondVoorOpslag.moeder_id;
                    }
                    
                    const filename = `hond_${hond.stamboomnr || hond.id}`;
                    await this.save(filename, hondVoorOpslag);
                    console.log(`Hond opgeslagen: ${filename} (vader: ${hondVoorOpslag.vader_stamboomnr || 'geen'}, moeder: ${hondVoorOpslag.moeder_stamboomnr || 'geen'})`);
                    
                } catch (error) {
                    console.error('Fout bij migreren hond:', error);
                }
            }
            
            // STAP 3: Sla mapping op voor later herstel
            await this.save('relatie_mapping', {
                idToStamboom: idToStamboomMap,
                stamboomToId: stamboomToIdMap,
                migrationDate: new Date().toISOString()
            });
            
            // STAP 4: Sla backup info op
            const backupConfig = {
                backupDate: new Date().toISOString(),
                hondenCount: honden.length,
                version: '2.0',
                hasRelationships: true
            };
            
            await this.save('backup_info', backupConfig);
            
            console.log('✅ Data migratie naar FileSystem voltooid MET RELATIES!');
            
            if (window.uiHandler && window.uiHandler.showSuccess) {
                window.uiHandler.showSuccess(`${honden.length} honden gemigreerd naar FileSystem (incl. relaties)`);
            }
            
        } catch (error) {
            console.error('Fout tijdens migratie:', error);
            throw error;
        }
    }
    
    async loadFromFileSystemToDatabase() {
        // VOORKOM HERHAALD LADEN
        if (this.dataLoaded) {
            console.log('Data al geladen uit FileSystem, overslaan...');
            return;
        }
        
        if (!this.currentStorage || this.currentStorage.type !== 'filesystem') {
            console.log('FileSystem niet actief, geen data te laden');
            return;
        }
        
        if (!window.db) {
            console.log('Wacht op database...');
            for (let i = 0; i < 30; i++) {
                if (window.db) break;
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            if (!window.db) {
                console.error('Database niet beschikbaar na wachten');
                return;
            }
        }
        
        this.dataLoaded = true; // Markeer als geladen
        
        try {
            console.log('Laad data uit FileSystem naar database...');
            
            // LAAD EERST RELATIE MAPPING
            let mapping = await this.load('relatie_mapping');
            if (!mapping) {
                console.log('Geen relatie mapping gevonden, laad zonder relaties');
                mapping = { idToStamboom: {}, stamboomToId: {} };
            }
            
            const files = await this.getAllFiles();
            console.log(`Bestanden gevonden in map: ${files.length}`);
            
            // STAP 1: Laad eerst alle honden (zonder relaties)
            const loadedHonden = [];
            
            for (const file of files) {
                if (file.type === 'file' && file.name.endsWith('.json') && file.name.startsWith('hond_')) {
                    try {
                        const hondData = await this.load(file.name.replace('.json', ''));
                        if (hondData && hondData.stamboomnr) {
                            loadedHonden.push(hondData);
                        }
                    } catch (error) {
                        console.error(`Fout bij laden hond:`, error);
                    }
                }
            }
            
            console.log(`${loadedHonden.length} honden gevonden in FileSystem`);
            
            if (loadedHonden.length === 0) {
                console.log('Geen honden gevonden om te laden');
                return;
            }
            
            // STAP 2: Haal bestaande honden op voor dubbele controle
            const existingHonden = await window.db.getHonden();
            const existingStamboomSet = new Set(existingHonden.map(h => h.stamboomnr).filter(Boolean));
            
            console.log(`${existingHonden.length} honden al in database`);
            
            // STAP 3: Voeg nieuwe honden toe (geen dubbele)
            const nieuweStamboomToIdMap = {};
            let nieuweHondenToegevoegd = 0;
            let bestaandeHondenBijgewerkt = 0;
            
            for (const hondData of loadedHonden) {
                try {
                    const stamboomnr = hondData.stamboomnr;
                    if (!stamboomnr) continue;
                    
                    const cleanHond = { ...hondData };
                    delete cleanHond.id;
                    
                    // DUBBELE BESCHERMING: Controleer of hond al bestaat
                    if (existingStamboomSet.has(stamboomnr)) {
                        // Update bestaande hond
                        const existingHond = existingHonden.find(h => h.stamboomnr === stamboomnr);
                        if (existingHond) {
                            await window.db.updateHond({ ...cleanHond, id: existingHond.id });
                            nieuweStamboomToIdMap[stamboomnr] = existingHond.id;
                            bestaandeHondenBijgewerkt++;
                            console.log(`Bestaande hond bijgewerkt: ${stamboomnr}`);
                        }
                    } else {
                        // Voeg nieuwe hond toe
                        try {
                            const hondId = await window.db.voegHondToe(cleanHond);
                            nieuweStamboomToIdMap[stamboomnr] = hondId;
                            nieuweHondenToegevoegd++;
                            console.log(`Nieuwe hond toegevoegd: ${stamboomnr}`);
                        } catch (addError) {
                            console.error(`Fout bij toevoegen hond ${stamboomnr}:`, addError);
                        }
                    }
                    
                } catch (error) {
                    console.error(`Fout bij verwerken hond ${hondData.stamboomnr}:`, error);
                }
            }
            
            // STAP 4: Update relaties met correcte IDs
            console.log('Update relaties tussen honden...');
            let relatiesHersteld = 0;
            
            for (const hondData of loadedHonden) {
                try {
                    const stamboomnr = hondData.stamboomnr;
                    const hondId = nieuweStamboomToIdMap[stamboomnr];
                    
                    if (!hondId) continue;
                    
                    const updateData = { id: hondId };
                    let needsUpdate = false;
                    
                    // Herstel vader relatie
                    if (hondData.vader_stamboomnr && nieuweStamboomToIdMap[hondData.vader_stamboomnr]) {
                        updateData.vader_id = nieuweStamboomToIdMap[hondData.vader_stamboomnr];
                        needsUpdate = true;
                        console.log(`Vader relatie: ${stamboomnr} -> ${hondData.vader_stamboomnr}`);
                    }
                    
                    // Herstel moeder relatie
                    if (hondData.moeder_stamboomnr && nieuweStamboomToIdMap[hondData.moeder_stamboomnr]) {
                        updateData.moeder_id = nieuweStamboomToIdMap[hondData.moeder_stamboomnr];
                        needsUpdate = true;
                        console.log(`Moeder relatie: ${stamboomnr} -> ${hondData.moeder_stamboomnr}`);
                    }
                    
                    if (needsUpdate) {
                        await window.db.updateHond(updateData);
                        relatiesHersteld++;
                    }
                    
                } catch (error) {
                    console.error(`Fout bij updaten relaties voor ${hondData.stamboomnr}:`, error);
                }
            }
            
            // STAP 5: Laad foto's (optioneel)
            let fotosGeladen = 0;
            for (const file of files) {
                if (file.type === 'file' && file.name.endsWith('.json') && file.name.startsWith('fotos_')) {
                    try {
                        const fotosData = await this.load(file.name.replace('.json', ''));
                        if (Array.isArray(fotosData)) {
                            for (const foto of fotosData) {
                                try {
                                    const cleanFoto = { ...foto };
                                    delete cleanFoto.id;
                                    await window.db.voegFotoToe(cleanFoto);
                                    fotosGeladen++;
                                } catch (fotoError) {
                                    console.error(`Fout bij foto:`, fotoError);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Fout bij laden foto's:`, error);
                    }
                }
            }
            
            // STAP 6: Laad privé info (optioneel)
            let priveGeladen = 0;
            for (const file of files) {
                if (file.type === 'file' && file.name.endsWith('.json') && file.name.startsWith('prive_')) {
                    try {
                        const priveData = await this.load(file.name.replace('.json', ''));
                        if (priveData) {
                            const cleanPrive = { ...priveData };
                            await window.db.bewaarPriveInfo(cleanPrive);
                            priveGeladen++;
                        }
                    } catch (error) {
                        console.error(`Fout bij laden privé info:`, error);
                    }
                }
            }
            
            console.log(`✅ Data geladen: ${nieuweHondenToegevoegd} nieuwe honden, ${bestaandeHondenBijgewerkt} bijgewerkt, ${relatiesHersteld} relaties, ${fotosGeladen} foto's, ${priveGeladen} privé records`);
            
            // Refresh UI
            setTimeout(() => {
                if (window.refreshHondenLijst) {
                    window.refreshHondenLijst();
                }
                
                if (window.loadInitialStats) {
                    window.loadInitialStats();
                }
            }, 1000);
            
            if (window.uiHandler && window.uiHandler.showSuccess) {
                if (nieuweHondenToegevoegd > 0) {
                    window.uiHandler.showSuccess(`${nieuweHondenToegevoegd} honden geladen uit map (${relatiesHersteld} relaties hersteld)`);
                } else if (bestaandeHondenBijgewerkt > 0) {
                    window.uiHandler.showSuccess(`${bestaandeHondenBijgewerkt} honden bijgewerkt uit map`);
                }
            }
            
        } catch (error) {
            console.error('Fout bij laden data uit FileSystem:', error);
            this.dataLoaded = false; // Reset bij fout
            throw error;
        }
    }
    
    async syncData() {
        console.log('Start synchronisatie...');
        
        if (this.currentStorage.type === 'filesystem') {
            try {
                await this.loadFromFileSystemToDatabase();
            } catch (error) {
                console.error('Sync fout:', error);
            }
        }
    }
    
    createSafeFilename(baseName) {
        let safeName = baseName.replace(/[<>:"/\\|?*]/g, '_');
        safeName = safeName.replace(/\s+/g, '_');
        if (safeName.length > 100) safeName = safeName.substring(0, 100);
        if (safeName.endsWith('.json')) safeName = safeName.substring(0, safeName.length - 5);
        return `${safeName}.json`;
    }
    
    loadConfig() {
        try {
            const configJson = localStorage.getItem('hondenDatabase_storageConfig');
            if (configJson) return JSON.parse(configJson);
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
            try {
                localStorage.setItem(`honden_${key}`, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error(`Fout bij opslaan in localStorage:`, error);
                throw error;
            }
        }
        
        if (!this.currentStorage.directoryHandle) {
            throw new Error('FileSystem niet correct geïnitialiseerd');
        }
        
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const encoder = new TextEncoder();
            const dataArray = encoder.encode(jsonString);
            
            let filename = key;
            if (!filename.endsWith('.json')) filename = `${filename}.json`;
            
            const fileHandle = await this.currentStorage.directoryHandle.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(dataArray);
            await writable.close();
            
            console.log(`✅ Bestand opgeslagen: ${filename}`);
            return true;
            
        } catch (error) {
            console.error(`Fout bij opslaan ${key}:`, error);
            throw error;
        }
    }
    
    async load(key) {
        if (!this.currentStorage || this.currentStorage.type !== 'filesystem') {
            try {
                const data = localStorage.getItem(`honden_${key}`);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error(`Fout bij laden uit localStorage:`, error);
                return null;
            }
        }
        
        if (!this.currentStorage.directoryHandle) return null;
        
        try {
            let filename = key;
            if (!filename.endsWith('.json')) filename = `${filename}.json`;
            
            const fileHandle = await this.currentStorage.directoryHandle.getFileHandle(filename);
            const file = await fileHandle.getFile();
            const text = await file.text();
            return JSON.parse(text);
            
        } catch (error) {
            console.error(`Fout bij laden ${key}:`, error);
            return null;
        }
    }
    
    async getAllFiles() {
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
            console.log(`${files.length} bestanden gevonden`);
            return files;
        } catch (error) {
            console.error('Fout bij getAllFiles():', error);
            return [];
        }
    }
    
    async listFiles() {
        return this.getAllFiles();
    }
    
    async delete(key) {
        if (!this.currentStorage) return false;
        
        if (this.currentStorage.type === 'filesystem') {
            try {
                let filename = key;
                if (!filename.endsWith('.json')) filename = `${filename}.json`;
                await this.currentStorage.directoryHandle.removeEntry(filename);
                console.log(`✅ Bestand verwijderd: ${filename}`);
                return true;
            } catch (error) {
                console.error(`Fout bij verwijderen ${key}:`, error);
                return false;
            }
        } else {
            localStorage.removeItem(`honden_${key}`);
            return true;
        }
    }
    
    async fileExists(filename) {
        if (!this.currentStorage || this.currentStorage.type !== 'filesystem' || !this.currentStorage.directoryHandle) {
            return false;
        }
        
        try {
            let safeFilename = filename;
            if (!safeFilename.endsWith('.json')) safeFilename = `${safeFilename}.json`;
            await this.currentStorage.directoryHandle.getFileHandle(safeFilename);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    resetDataLoaded() {
        this.dataLoaded = false;
        console.log('Data loaded flag gereset');
    }
}

// Maak globale instance
const storageManager = new StorageManager();
window.storageManager = storageManager;

// Export voor Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, storageManager };
}