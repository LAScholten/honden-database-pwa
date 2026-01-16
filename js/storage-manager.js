/**
 * Storage Manager voor HondenDatabase Desktop Edition
 * WERKEND MET RELATIEHERSTEL ZOALS BACKUP IMPORT
 */

class StorageManager {
    constructor() {
        this.storageType = 'auto';
        this.availableTypes = this.detectStorageTypes();
        this.currentStorage = null;
        this.migrationInProgress = false;
        this.dbReady = false;
        this.isInitializing = false;
        this.dataLoaded = false;
        this.loadingInProgress = false; // Voorkom gelijktijdig laden
        
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
                    console.log('Start automatisch laden data uit FileSystem...');
                    setTimeout(() => {
                        this.loadFromFileSystemToDatabase().catch(e => 
                            console.log('Auto-load fout:', e.message)
                        );
                    }, 1500);
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
            const directoryHandle = await window.showDirectoryPicker({
                id: 'hondenDatabaseFolder',
                mode: 'readwrite',
                startIn: 'documents'
            });
            
            if ((await directoryHandle.queryPermission({ mode: 'readwrite' })) !== 'granted') {
                const permission = await directoryHandle.requestPermission({ mode: 'readwrite' });
                if (permission !== 'granted') {
                    throw new Error('Geen toestemming voor map toegang');
                }
            }
            
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
            
            // STAP 1: Maak RELATIE TABELLEN zoals backup import doet
            const idToStamboomMap = {};
            const stamboomToIdMap = {};
            const stamboomToHondDataMap = {}; // Voor relatieherstel
            
            honden.forEach(hond => {
                if (hond.id && hond.stamboomnr) {
                    idToStamboomMap[hond.id] = hond.stamboomnr;
                    stamboomToIdMap[hond.stamboomnr] = hond.id;
                    stamboomToHondDataMap[hond.stamboomnr] = hond;
                }
            });
            
            // STAP 2: Migreer honden met RELATIE CONVERSIE
            for (const hond of honden) {
                try {
                    // Maak een kopie voor opslag
                    const hondVoorOpslag = { ...hond };
                    
                    // CONVERTEER RELATIES NET ALS BACKUP:
                    // Vader ID → stamboomnr
                    if (hond.vader_id && idToStamboomMap[hond.vader_id]) {
                        hondVoorOpslag._vader_stamboomnr = idToStamboomMap[hond.vader_id]; // Met underscore
                    }
                    
                    // Moeder ID → stamboomnr  
                    if (hond.moeder_id && idToStamboomMap[hond.moeder_id]) {
                        hondVoorOpslag._moeder_stamboomnr = idToStamboomMap[hond.moeder_id]; // Met underscore
                    }
                    
                    // Verwijder interne IDs voor opslag
                    delete hondVoorOpslag.id;
                    delete hondVoorOpslag.vader_id;
                    delete hondVoorOpslag.moeder_id;
                    
                    // Sla op onder stamboomnr
                    const filename = `hond_${hond.stamboomnr || hond.id}`;
                    await this.save(filename, hondVoorOpslag);
                    console.log(`Hond opgeslagen: ${filename} (vader: ${hondVoorOpslag._vader_stamboomnr || 'geen'}, moeder: ${hondVoorOpslag._moeder_stamboomnr || 'geen'})`);
                    
                } catch (error) {
                    console.error('Fout bij migreren hond:', error);
                }
            }
            
            // STAP 3: Sla RELATIE TABELLEN op VOOR HERSTEL
            await this.save('_relatie_mapping', {
                idToStamboom: idToStamboomMap,
                stamboomToId: stamboomToIdMap,
                migrationDate: new Date().toISOString(),
                totalHonden: honden.length
            });
            
            // STAP 4: Sla backup info op
            const backupConfig = {
                backupDate: new Date().toISOString(),
                hondenCount: honden.length,
                version: '3.0',
                hasRelationships: true,
                relationshipMethod: 'stamboomnr_mapping'
            };
            
            await this.save('_backup_info', backupConfig);
            
            console.log('✅ Data migratie naar FileSystem voltooid MET RELATIE TABELLEN!');
            
            if (window.uiHandler && window.uiHandler.showSuccess) {
                window.uiHandler.showSuccess(`${honden.length} honden gemigreerd naar FileSystem (incl. relatie tabellen)`);
            }
            
        } catch (error) {
            console.error('Fout tijdens migratie:', error);
            throw error;
        }
    }
    
    async loadFromFileSystemToDatabase() {
        // VOORKOM GELIJKTIG LADEN
        if (this.loadingInProgress) {
            console.log('Laden al bezig...');
            return;
        }
        
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
        
        this.loadingInProgress = true;
        
        try {
            console.log('START: Laad data uit FileSystem met RELATIEHERSTEL...');
            
            // STAP 1: Laad RELATIE TABELLEN (zoals backup import)
            const mappingData = await this.load('_relatie_mapping');
            if (!mappingData) {
                console.log('⚠️ Geen relatie tabellen gevonden. Laad in legacy modus...');
                await this.loadLegacyMode();
                return;
            }
            
            console.log('Relatie tabellen gevonden:', {
                hondenCount: mappingData.totalHonden,
                migrationDate: mappingData.migrationDate
            });
            
            // STAP 2: Laad alle honden bestanden
            const files = await this.getAllFiles();
            const hondFiles = files.filter(f => 
                f.type === 'file' && 
                f.name.endsWith('.json') && 
                f.name.startsWith('hond_') &&
                !f.name.startsWith('_') // Skip metadata files
            );
            
            console.log(`${hondFiles.length} honden bestanden gevonden`);
            
            if (hondFiles.length === 0) {
                console.log('Geen honden gevonden om te laden');
                this.dataLoaded = true;
                return;
            }
            
            // STAP 3: Bouw TEMPORAIRE MAPPING voor relatieherstel
            const tempStamboomToData = {};
            const tempStamboomToNewId = {};
            const allHondData = [];
            
            // Eerst: laad alle data in memory
            for (const file of hondFiles) {
                try {
                    const key = file.name.replace('.json', '');
                    const hondData = await this.load(key);
                    
                    if (hondData && hondData.stamboomnr) {
                        tempStamboomToData[hondData.stamboomnr] = hondData;
                        allHondData.push(hondData);
                    }
                } catch (error) {
                    console.error(`Fout bij laden hond bestand ${file.name}:`, error);
                }
            }
            
            console.log(`${allHondData.length} honden geladen in memory`);
            
            // STAP 4: Haal bestaande honden op voor dubbele controle
            const existingHonden = await window.db.getHonden();
            const existingStamboomSet = new Set(existingHonden.map(h => h.stamboomnr).filter(Boolean));
            
            // STAP 5: Voeg ALLE NIEUWE HONDEN toe (ZONDER relaties eerst)
            let nieuweHondenToegevoegd = 0;
            let bestaandeHondenBijgewerkt = 0;
            
            for (const hondData of allHondData) {
                try {
                    const stamboomnr = hondData.stamboomnr;
                    if (!stamboomnr) continue;
                    
                    // Maak clean kopie (zonder underscore relaties voor nu)
                    const cleanHond = { ...hondData };
                    delete cleanHond.id;
                    delete cleanHond._vader_stamboomnr;
                    delete cleanHond._moeder_stamboomnr;
                    
                    // DUBBELE BESCHERMING
                    if (existingStamboomSet.has(stamboomnr)) {
                        // Update bestaande hond (zonder relaties eerst)
                        const existingHond = existingHonden.find(h => h.stamboomnr === stamboomnr);
                        if (existingHond) {
                            // Bewaar oude relaties
                            const oldVaderId = existingHond.vader_id;
                            const oldMoederId = existingHond.moeder_id;
                            
                            // Update zonder relaties
                            const updateWithoutRelations = { ...cleanHond, id: existingHond.id };
                            delete updateWithoutRelations.vader_id;
                            delete updateWithoutRelations.moeder_id;
                            
                            await window.db.updateHond(updateWithoutRelations);
                            tempStamboomToNewId[stamboomnr] = existingHond.id;
                            
                            // Herstel oude relaties
                            if (oldVaderId || oldMoederId) {
                                await window.db.updateHond({
                                    id: existingHond.id,
                                    vader_id: oldVaderId || null,
                                    moeder_id: oldMoederId || null
                                });
                            }
                            
                            bestaandeHondenBijgewerkt++;
                            console.log(`Bestaande hond bijgewerkt (relaties behouden): ${stamboomnr}`);
                        }
                    } else {
                        // Voeg NIEUWE hond toe (zonder relaties eerst)
                        try {
                            // Verwijder eventuele relatie velden
                            delete cleanHond.vader_id;
                            delete cleanHond.moeder_id;
                            
                            const newId = await window.db.voegHondToe(cleanHond);
                            tempStamboomToNewId[stamboomnr] = newId;
                            nieuweHondenToegevoegd++;
                            console.log(`Nieuwe hond toegevoegd (zonder relaties): ${stamboomnr} -> ID ${newId}`);
                        } catch (addError) {
                            console.error(`Fout bij toevoegen hond ${stamboomnr}:`, addError);
                        }
                    }
                    
                } catch (error) {
                    console.error(`Fout bij verwerken hond ${hondData.stamboomnr}:`, error);
                }
            }
            
            // STAP 6: NU RELATIES HERSTELLEN (zoals backup import)
            console.log('Start relatieherstel zoals backup import...');
            let relatiesHersteld = 0;
            let relatieFouten = 0;
            
            for (const hondData of allHondData) {
                try {
                    const stamboomnr = hondData.stamboomnr;
                    if (!stamboomnr) continue;
                    
                    const hondId = tempStamboomToNewId[stamboomnr];
                    if (!hondId) continue;
                    
                    const updateData = { id: hondId };
                    let needsUpdate = false;
                    
                    // RELATIEHERSTEL: Gebruik underscore velden
                    if (hondData._vader_stamboomnr) {
                        const vaderStamboomnr = hondData._vader_stamboomnr;
                        const vaderId = tempStamboomToNewId[vaderStamboomnr];
                        
                        if (vaderId) {
                            updateData.vader_id = vaderId;
                            needsUpdate = true;
                            console.log(`✅ Vader relatie hersteld: ${stamboomnr} (ID:${hondId}) → ${vaderStamboomnr} (ID:${vaderId})`);
                        } else {
                            console.log(`⚠️ Vader niet gevonden: ${stamboomnr} → ${vaderStamboomnr}`);
                            relatieFouten++;
                        }
                    }
                    
                    if (hondData._moeder_stamboomnr) {
                        const moederStamboomnr = hondData._moeder_stamboomnr;
                        const moederId = tempStamboomToNewId[moederStamboomnr];
                        
                        if (moederId) {
                            updateData.moeder_id = moederId;
                            needsUpdate = true;
                            console.log(`✅ Moeder relatie hersteld: ${stamboomnr} (ID:${hondId}) → ${moederStamboomnr} (ID:${moederId})`);
                        } else {
                            console.log(`⚠️ Moeder niet gevonden: ${stamboomnr} → ${moederStamboomnr}`);
                            relatieFouten++;
                        }
                    }
                    
                    if (needsUpdate) {
                        await window.db.updateHond(updateData);
                        relatiesHersteld++;
                    }
                    
                } catch (error) {
                    console.error(`Fout bij relatieherstel voor ${hondData.stamboomnr}:`, error);
                    relatieFouten++;
                }
            }
            
            // STAP 7: Laad aanvullende data
            let fotosGeladen = 0;
            let priveGeladen = 0;
            
            // Foto's laden
            const fotoFiles = files.filter(f => 
                f.type === 'file' && 
                f.name.endsWith('.json') && 
                f.name.startsWith('fotos_')
            );
            
            for (const file of fotoFiles) {
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
                                console.error('Fout bij foto toevoegen:', fotoError);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Fout bij laden foto's ${file.name}:`, error);
                }
            }
            
            // Privé info laden
            const priveFiles = files.filter(f => 
                f.type === 'file' && 
                f.name.endsWith('.json') && 
                f.name.startsWith('prive_')
            );
            
            for (const file of priveFiles) {
                try {
                    const priveData = await this.load(file.name.replace('.json', ''));
                    if (priveData) {
                        const cleanPrive = { ...priveData };
                        await window.db.bewaarPriveInfo(cleanPrive);
                        priveGeladen++;
                    }
                } catch (error) {
                    console.error(`Fout bij laden privé info ${file.name}:`, error);
                }
            }
            
            // RESULTATEN
            console.log(`✅ LADEN VOLTOOID:`);
            console.log(`   Nieuwe honden: ${nieuweHondenToegevoegd}`);
            console.log(`   Bijgewerkte honden: ${bestaandeHondenBijgewerkt}`);
            console.log(`   Relaties hersteld: ${relatiesHersteld}`);
            console.log(`   Relatie fouten: ${relatieFouten}`);
            console.log(`   Foto's: ${fotosGeladen}`);
            console.log(`   Privé records: ${priveGeladen}`);
            
            this.dataLoaded = true;
            
            // Refresh UI
            setTimeout(() => {
                if (window.refreshHondenLijst) window.refreshHondenLijst();
                if (window.loadInitialStats) window.loadInitialStats();
                
                if (window.uiHandler && window.uiHandler.showSuccess) {
                    let msg = '';
                    if (nieuweHondenToegevoegd > 0) {
                        msg = `${nieuweHondenToegevoegd} honden geladen (${relatiesHersteld} relaties hersteld)`;
                    } else if (bestaandeHondenBijgewerkt > 0) {
                        msg = `${bestaandeHondenBijgewerkt} honden bijgewerkt`;
                    } else if (relatiesHersteld > 0) {
                        msg = `${relatiesHersteld} relaties hersteld`;
                    }
                    
                    if (msg) {
                        window.uiHandler.showSuccess(msg);
                    }
                }
            }, 1000);
            
        } catch (error) {
            console.error('Fout bij laden data uit FileSystem:', error);
            this.dataLoaded = false;
            throw error;
        } finally {
            this.loadingInProgress = false;
        }
    }
    
    async loadLegacyMode() {
        console.log('Legacy modus: laad zonder relatie tabellen...');
        
        try {
            const files = await this.getAllFiles();
            const hondFiles = files.filter(f => 
                f.type === 'file' && 
                f.name.endsWith('.json') && 
                f.name.startsWith('hond_')
            );
            
            for (const file of hondFiles) {
                try {
                    const hondData = await this.load(file.name.replace('.json', ''));
                    if (hondData && hondData.stamboomnr) {
                        const cleanHond = { ...hondData };
                        delete cleanHond.id;
                        
                        const existing = await window.db.getHonden();
                        const exists = existing.some(h => h.stamboomnr === cleanHond.stamboomnr);
                        
                        if (!exists) {
                            await window.db.voegHondToe(cleanHond);
                            console.log(`Hond toegevoegd (legacy): ${cleanHond.stamboomnr}`);
                        }
                    }
                } catch (error) {
                    console.error(`Legacy fout bij ${file.name}:`, error);
                }
            }
            
            console.log('Legacy laden voltooid');
            
        } catch (error) {
            console.error('Legacy mode fout:', error);
            throw error;
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, storageManager };
}