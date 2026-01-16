/**
 * Data Management Module voor HondenDatabase
 * COMPLEET MET ECHTE FILE SYSTEM PRIMAIRE OPSLAG
 * Wanneer FileSystem gekozen is → ALLE data gaat naar/van de map
 */

class DataManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = {
            nl: {
                dataManagement: "Data Beheer",
                dataImport: "Data Importeren",
                importDescription: "Importeer data uit een eerder geëxporteerd bestand.",
                selectJsonFile: "Selecteer exportbestand",
                chooseExportedFile: "Kies een bestand dat eerder is geëxporteerd uit deze applicatie",
                importStrategy: "Import strategie",
                importStrategyDescription: "Volledige herstel: Herstel alle data uit export",
                updateAndComplete: "Volledige herstel",
                startImport: "Start Import",
                importingData: "Data importeren...",
                buildingRelations: "Relaties opbouwen...",
                dataExport: "Data Exporteren",
                exportDescription: "Exporteer data naar een bestand voor backup of delen.",
                exportOptions: "Export opties",
                exportData: "Data exporteren",
                exportDataDescription: "Alle hondengegevens zonder foto's",
                exportPhotos: "Foto's exporteren",
                exportPhotosDescription: "Photo metadata en relaties",
                exportPrivateInfo: "Privé informatie exporteren",
                exportPrivateInfoDescription: "Vertrouwelijke notities en informatie",
                exportFormat: "Export formaat",
                jsonFormat: "JSON (aanbevolen)",
                csvFormat: "CSV (alleen hondengegevens)",
                startExport: "Start Export",
                exportingData: "Data exporteren...",
                databaseStatistics: "Database Statistieken",
                dogs: "Honden",
                photos: "Foto's",
                privateRecords: "Privé records",
                selectFileFirst: "Selecteer eerst een bestand om te importeren",
                fileReadError: "Fout bij lezen bestand",
                importFailed: "Import mislukt: ",
                importComplete: "Import voltooid!",
                importSummary: "Import samenvatting",
                newDogsAdded: "Nieuwe honden toegevoegd",
                dogsUpdated: "Honden bijgewerkt",
                photosImported: "Foto's geïmporteerd",
                privateUpdated: "Privé records bijgewerkt",
                relationshipsBuilt: "Relaties hersteld",
                exportSuccess: "Export succesvol voltooid!",
                exportFailed: "Export mislukt: ",
                exportFileSaved: "Bestand opgeslagen als: ",
                loadingStats: "Laden statistieken...",
                statsError: "Fout bij laden statistieken: ",
                nothingToExport: "Niets te exporteren - geen exportopties geselecteerd",
                error: "Fout",
                exportComplete: "Export compleet",
                totalDogsExported: "Totaal honden geëxporteerd: ",
                totalPhotosExported: "Totaal foto's geëxporteerd: ",
                totalPrivateExported: "Totaal privé records geëxporteerd: ",
                backupType: "Backup type",
                backupEverything: "Backup alles (veilig opslaan)",
                backupEverythingDescription: "Exporteer alle data inclusief privé notities",
                shareData: "Exporteren voor delen",
                shareDataDescription: "Exporteer naar keuze wat je wilt delen",
                backupStatusWarning: "Backup aanbevolen",
                backupStatusDanger: "Belangrijk",
                backupWarningText: "Laatste backup was {days} dagen geleden",
                backupDangerText: "Je hebt nog nooit een backup gemaakt!",
                desktopStorage: "Desktop Edition Opslag",
                desktopStorageDesc: "Deze Desktop Edition ondersteunt twee opslagmethoden:",
                fileStorage: "Bestandsopslag",
                fileStorageDesc: "Sla data op in echte bestanden op je computer. HONDEN EN FOTO'S WORDEN NU NAAR DE MAP GESCHREVEN!",
                useFileStorage: "Schakel over naar map",
                browserStorage: "Browser Opslag",
                browserStorageDesc: "Sla data op in de browser (standaard). ALLE DATA BLIJFT IN DE BROWSER.",
                useBrowserStorage: "Terug naar browser opslag",
                currentStorageStatus: "Huidige opslagstatus:",
                advancedStorageSettings: "Geavanceerde opslaginstellingen",
                switchToFiles: "Schakel over naar bestandsopslag",
                switchToBrowser: "Schakel over naar browser opslag",
                storageActive: "Actief",
                storageInactive: "Inactief",
                storageLoading: "Opslagstatus wordt geladen...",
                storageSettings: "Opslaginstellingen",
                storageFeaturesTitle: "💾 Bestandsopslag voordelen:",
                storageFeature1: "📁 Kies zelf een map op je computer",
                storageFeature2: "💾 Makkelijke backups (kopieer gewoon de map)",
                storageFeature3: "🔄 Synchronisatie tussen apparaten mogelijk",
                storageFeature4: "🔒 Meer controle over je data",
                storageWarning: "⚠️ Belangrijk:",
                storageWarningText: "Bij bestandsopslag wordt ALLE nieuwe data direct naar de map geschreven!"
            },
            en: {
                dataManagement: "Data Management",
                dataImport: "Data Import",
                importDescription: "Import data from a previously exported file.",
                selectJsonFile: "Select export file",
                chooseExportedFile: "Choose a file that was previously exported from this application",
                importStrategy: "Import strategy",
                importStrategyDescription: "Full restore: Restore all data from export",
                updateAndComplete: "Full restore",
                startImport: "Start Import",
                importingData: "Importing data...",
                buildingRelations: "Building relationships...",
                dataExport: "Data Export",
                exportDescription: "Export data to a file for backup or sharing.",
                exportOptions: "Export options",
                exportData: "Export data",
                exportDataDescription: "All dog data without photos",
                exportPhotos: "Export photos",
                exportPhotosDescription: "Photo metadata and relationships",
                exportPrivateInfo: "Export private information",
                exportPrivateInfoDescription: "Confidential notes and information",
                exportFormat: "Export format",
                jsonFormat: "JSON (recommended)",
                csvFormat: "CSV (dog data only)",
                startExport: "Start Export",
                exportingData: "Exporting data...",
                databaseStatistics: "Database Statistics",
                dogs: "Dogs",
                photos: "Photos",
                privateRecords: "Private records",
                selectFileFirst: "First select a file to import",
                fileReadError: "Error reading file",
                importFailed: "Import failed: ",
                importComplete: "Import completed!",
                importSummary: "Import summary",
                newDogsAdded: "New dogs added",
                dogsUpdated: "Dogs updated",
                photosImported: "Photos imported",
                privateUpdated: "Private records updated",
                relationshipsBuilt: "Relationships restored",
                exportSuccess: "Export successfully completed!",
                exportFailed: "Export failed: ",
                exportFileSaved: "File saved as: ",
                loadingStats: "Loading statistics...",
                statsError: "Error loading statistics: ",
                nothingToExport: "Nothing to export - no export options selected",
                error: "Error",
                exportComplete: "Export complete",
                totalDogsExported: "Total dogs exported: ",
                totalPhotosExported: "Total photos exported: ",
                totalPrivateExported: "Total private records exported: ",
                backupType: "Backup type",
                backupEverything: "Backup everything (safe storage)",
                backupEverythingDescription: "Export all data including private notes",
                shareData: "Export for sharing",
                shareDataDescription: "Export what you want to share",
                backupStatusWarning: "Backup recommended",
                backupStatusDanger: "Important",
                backupWarningText: "Last backup was {days} days ago",
                backupDangerText: "You have never made a backup!",
                desktopStorage: "Desktop Edition Storage",
                desktopStorageDesc: "This Desktop Edition supports two storage methods:",
                fileStorage: "File Storage",
                fileStorageDesc: "Save data in real files on your computer. DOGS AND PHOTOS ARE NOW WRITTEN TO THE FOLDER!",
                useFileStorage: "Switch to folder",
                browserStorage: "Browser Storage",
                browserStorageDesc: "Save data in the browser (default). ALL DATA STAYS IN THE BROWSER.",
                useBrowserStorage: "Back to browser storage",
                currentStorageStatus: "Current storage status:",
                advancedStorageSettings: "Advanced storage settings",
                switchToFiles: "Switch to file storage",
                switchToBrowser: "Switch to browser storage",
                storageActive: "Active",
                storageInactive: "Inactive",
                storageLoading: "Loading storage status...",
                storageSettings: "Storage settings",
                storageFeaturesTitle: "💾 File storage benefits:",
                storageFeature1: "📁 Choose your own folder on computer",
                storageFeature2: "💾 Easy backups (just copy the folder)",
                storageFeature3: "🔄 Sync between devices possible",
                storageFeature4: "🔒 More control over your data",
                storageWarning: "⚠️ Important:",
                storageWarningText: "With file storage, ALL new data is written directly to the folder!"
            },
            de: {
                dataManagement: "Datenverwaltung",
                dataImport: "Datenimport",
                importDescription: "Importieren Sie Daten aus einer zuvor exportierten Datei.",
                selectJsonFile: "Exportdatei auswählen",
                chooseExportedFile: "Wählen Sie eine Datei, die zuvor aus dieser Anwendung exportiert wurde",
                importStrategy: "Importstrategie",
                importStrategyDescription: "Vollständige Wiederherstellung: Alle Daten aus dem Export wiederherstellen",
                updateAndComplete: "Vollständige Wiederherstellung",
                startImport: "Import starten",
                importingData: "Daten werden importiert...",
                buildingRelations: "Beziehungen werden aufgebaut...",
                dataExport: "Datenexport",
                exportDescription: "Exportieren Sie Daten in een Datei für Backup of Teilen.",
                exportOptions: "Exportoptionen",
                exportData: "Daten exportieren",
                exportDataDescription: "Alle Hunde-Daten ohne Fotos",
                exportPhotos: "Fotos exportieren",
                exportPhotosDescription: "Foto-Metadaten und Beziehungen",
                exportPrivateInfo: "Private Informationen exportieren",
                exportPrivateInfoDescription: "Vertrauliche Notizen und Informationen",
                exportFormat: "Exportformat",
                jsonFormat: "JSON (empfohlen)",
                csvFormat: "CSV (nur Hunde-Daten)",
                startExport: "Export starten",
                exportingData: "Daten werden exportiert...",
                databaseStatistics: "Datenbankstatistiken",
                dogs: "Hunde",
                photos: "Fotos",
                privateRecords: "Private Aufzeichnungen",
                selectFileFirst: "Wählen Sie zuerst eine Datei zum Importieren",
                fileReadError: "Fehler beim Lesen der Datei",
                importFailed: "Import fehlgeschlagen: ",
                importComplete: "Import abgeschlossen!",
                importSummary: "Import-Zusammenfassung",
                newDogsAdded: "Neue Hunde hinzugefügt",
                dogsUpdated: "Hunde aktualisiert",
                photosImported: "Fotos importiert",
                privateUpdated: "Private Aufzeichnungen aktualisiert",
                relationshipsBuilt: "Beziehungen wiederhergestellt",
                exportSuccess: "Export erfolgreich abgeschlossen!",
                exportFailed: "Export fehlgeschlagen: ",
                exportFileSaved: "Datei gespeichert als: ",
                loadingStats: "Statistiken werden geladen...",
                statsError: "Fehler beim Laden der Statistiken: ",
                nothingToExport: "Nichts zu exportieren - geen Exportoptionen ausgewählt",
                error: "Fehler",
                exportComplete: "Export abgeschlossen",
                totalDogsExported: "Gesamte Hunde exportiert: ",
                totalPhotosExported: "Gesamte Fotos exportiert: ",
                totalPrivateExported: "Gesamte private Aufzeichnungen exportiert: ",
                backupType: "Backup-Typ",
                backupEverything: "Alles sichern (sichere Aufbewahrung)",
                backupEverythingDescription: "Exportieren Sie alle data einschließlich privater Notizen",
                shareData: "Zum Teilen exportieren",
                shareDataDescription: "Exportieren Sie was Sie teilen möchten",
                backupStatusWarning: "Backup empfohlen",
                backupStatusDanger: "Wichtig",
                backupWarningText: "Letztes Backup war vor {days} Tagen",
                backupDangerText: "Sie haben noch nie ein Backup erstellt!",
                desktopStorage: "Desktop Edition Speicherung",
                desktopStorageDesc: "Diese Desktop Edition unterstützt zwei Speichermethoden:",
                fileStorage: "Dateispeicherung",
                fileStorageDesc: "Speichern Sie Daten in echten Dateien auf Ihrem Computer. HUNDE UND FOTOS WERDEN JETZT IN DEN ORDNER GESCHRIEBEN!",
                useFileStorage: "Zum Ordner wechseln",
                browserStorage: "Browser-Speicherung",
                browserStorageDesc: "Speichern Sie Daten im Browser (Standard). ALLE DATEN BLEIBEN IM BROWSER.",
                useBrowserStorage: "Zurück zur Browser-Speicherung",
                currentStorageStatus: "Aktueller Speicherstatus:",
                advancedStorageSettings: "Erweiterte Speichereinstellungen",
                switchToFiles: "Zu Dateispeicherung wechseln",
                switchToBrowser: "Zu Browser-Speicherung wechseln",
                storageActive: "Aktiv",
                storageInactive: "Inactief",
                storageLoading: "Speicherstatus wird geladen...",
                storageSettings: "Speichereinstellungen",
                storageFeaturesTitle: "💾 Vorteile der Dateispeicherung:",
                storageFeature1: "📁 Wählen Sie Ihren eigenen Ordner auf dem Computer",
                storageFeature2: "💾 Einfache Backups (nur Ordner kopieren)",
                storageFeature3: "🔄 Synchronisation zwischen Geräten mogelijk",
                storageFeature4: "🔒 Mehr Kontrole über Ihre Daten",
                storageWarning: "⚠️ Wichtig:",
                storageWarningText: "Bei Dateispeicherung werden ALLE neuen Daten direkt in den Ordner geschrieben!"
            }
        };
        
        // Initialiseer de database later, wanneer die beschikbaar is
        this.db = null;
        this.dbReady = false;
        
        // Wacht tot database beschikbaar is
        this.initDatabase();
        
        // Track of we FileSystem gebruiken als primaire opslag
        this.isUsingFileSystem = false;
        
        // Cache voor snelle toegang
        this.dogCache = new Map();
        this.photoCache = new Map();
        
        // Controleer huidige opslagmodus
        this.checkStorageMode();
    }
    
    async checkStorageMode() {
        // Wacht tot StorageManager beschikbaar is
        setTimeout(async () => {
            if (window.storageManager) {
                const storageInfo = storageManager.getStorageInfo();
                this.isUsingFileSystem = storageInfo.current === 'filesystem';
                
                if (this.isUsingFileSystem) {
                    console.log('🎯 FileSystem is PRIMAIRE OPSLAG - alle data gaat naar/van de map');
                    
                    // Laad data uit map bij opstarten
                    await this.loadAllDataFromFileSystem();
                    
                    // Overschrijf database functies om via FileSystem te werken
                    this.overrideDatabaseFunctions();
                }
            }
        }, 1000);
    }
    
    async initDatabase() {
        const maxAttempts = 100;
        for (let i = 0; i < maxAttempts; i++) {
            if (window.db) {
                this.db = window.db;
                this.dbReady = true;
                console.log('Database gevonden in DataManager');
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (!this.db) {
            console.warn('Database nog niet beschikbaar');
        }
    }
    
    async ensureDatabase() {
        if (!this.dbReady) {
            await this.initDatabase();
        }
        
        if (!this.db) {
            throw new Error('Database niet beschikbaar');
        }
        
        return this.db;
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('dataManagementModal')) {
            this.loadDatabaseStats();
            this.updateModalTexts();
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        let backupStatusHTML = '';
        if (window.backupManager) {
            const status = window.backupManager.getStatus();
            const daysSince = window.backupManager.getDaysSinceLastBackup();
            
            if (status.level === 'danger') {
                backupStatusHTML = `<div class="alert alert-danger mb-3">
                    <i class="bi bi-exclamation-triangle-fill"></i> 
                    <strong>${t('backupStatusDanger')}</strong><br>
                    ${t('backupDangerText')}
                </div>`;
            } else if (status.level === 'warning') {
                const warningText = t('backupWarningText').replace('{days}', daysSince);
                backupStatusHTML = `<div class="alert alert-warning mb-3">
                    <i class="bi bi-exclamation-triangle"></i> 
                    <strong>${t('backupStatusWarning')}</strong><br>
                    ${warningText}
                </div>`;
            }
        }
        
        return `
            <div class="modal fade" id="dataManagementModal" tabindex="-1" aria-labelledby="dataManagementModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="dataManagementModalLabel">
                                <i class="bi bi-database-gear"></i> ${t('dataManagement')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close') || 'Sluiten'}"></button>
                        </div>
                        <div class="modal-body">
                            ${backupStatusHTML}
                            
                            <!-- Desktop Edition Opslag Selector - NIEUWE SECTIE -->
                            <div class="card mt-3 border-info">
                                <div class="card-header bg-info text-white">
                                    <h6 class="mb-0"><i class="bi bi-hdd"></i> ${t('desktopStorage')}</h6>
                                </div>
                                <div class="card-body">
                                    <p>${t('desktopStorageDesc')}</p>
                                    
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <div class="card h-100">
                                                <div class="card-body">
                                                    <h6><i class="bi bi-folder text-success"></i> ${t('fileStorage')}</h6>
                                                    <p class="small mb-2">${t('fileStorageDesc')}</p>
                                                    
                                                    <div class="mb-3">
                                                        <strong>${t('storageFeaturesTitle')}</strong>
                                                        <ul class="small mb-3">
                                                            <li>${t('storageFeature1')}</li>
                                                            <li>${t('storageFeature2')}</li>
                                                            <li>${t('storageFeature3')}</li>
                                                            <li>${t('storageFeature4')}</li>
                                                        </ul>
                                                        <div class="alert alert-warning small py-2 mb-0">
                                                            <i class="bi bi-exclamation-triangle"></i> 
                                                            <strong>${t('storageWarning')}</strong> 
                                                            ${t('storageWarningText')}
                                                        </div>
                                                    </div>
                                                    
                                                    <button class="btn btn-outline-success btn-sm w-100" id="useFileSystemBtn">
                                                        <i class="bi bi-check-circle"></i> ${t('useFileStorage')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card h-100">
                                                <div class="card-body">
                                                    <h6><i class="bi bi-browser-chrome text-primary"></i> ${t('browserStorage')}</h6>
                                                    <p class="small mb-2">${t('browserStorageDesc')}</p>
                                                    
                                                    <div class="mb-3">
                                                        <div class="alert alert-info small py-2 mb-0">
                                                            <i class="bi bi-info-circle"></i> 
                                                            <strong>Standaard instelling</strong> - Werkt in alle browsers zonder extra configuratie
                                                        </div>
                                                    </div>
                                                    
                                                    <button class="btn btn-outline-primary btn-sm w-100" id="useIndexedDBBtn">
                                                        <i class="bi bi-arrow-left-right"></i> ${t('useBrowserStorage')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id="currentStorageStatus" class="alert alert-light mb-3">
                                        <i class="bi bi-hourglass-split"></i> ${t('storageLoading')}
                                    </div>
                                    
                                    <button class="btn btn-info btn-sm w-100" id="openStorageSettingsBtn">
                                        <i class="bi bi-gear"></i> ${t('advancedStorageSettings')}
                                    </button>
                                </div>
                            </div>
                            
                            <div class="row mt-4">
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-success">
                                        <div class="card-header bg-success text-white">
                                            <h5 class="mb-0">
                                                <i class="bi bi-upload"></i> ${t('dataImport')}
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">
                                                ${t('importDescription')}
                                            </p>
                                            
                                            <div class="mb-3">
                                                <label for="importFile" class="form-label">${t('selectJsonFile')}</label>
                                                <input class="form-control" type="file" id="importFile" accept=".json,.csv">
                                                <div class="form-text">
                                                    ${t('chooseExportedFile')}
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label for="importStrategy" class="form-label">${t('importStrategy')}</label>
                                                <select class="form-select" id="importStrategy">
                                                    <option value="fullRestore" selected>${t('updateAndComplete')}</option>
                                                </select>
                                                <div class="form-text">
                                                    ${t('importStrategyDescription')}
                                                </div>
                                            </div>
                                            
                                            <button class="btn btn-success w-100" id="startImportBtn">
                                                <i class="bi bi-upload"></i> ${t('startImport')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-primary">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0">
                                                <i class="bi bi-download"></i> ${t('dataExport')}
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">
                                                ${t('exportDescription')}
                                            </p>
                                            
                                            <div class="mb-4">
                                                <label class="form-label">${t('backupType')}</label>
                                                
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="exportType" id="backupEverything" value="backup" checked>
                                                        <label class="form-check-label" for="backupEverything">
                                                            <strong>${t('backupEverything')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('backupEverythingDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="exportType" id="shareData" value="share">
                                                        <label class="form-check-label" for="shareData">
                                                            <strong>${t('shareData')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('shareDataDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-4" id="exportOptionsSection">
                                                <label class="form-label">${t('exportOptions')}</label>
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportData" checked>
                                                        <label class="form-check-label" for="exportData">
                                                            <strong>${t('exportData')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('exportDataDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportPhotos" checked>
                                                        <label class="form-check-label" for="exportPhotos">
                                                            <strong>${t('exportPhotos')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('exportPhotosDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportPrivateInfo" checked>
                                                        <label class="form-check-label" for="exportPrivateInfo">
                                                            <strong>${t('exportPrivateInfo')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('exportPrivateInfoDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label for="exportFormat" class="form-label">${t('exportFormat')}</label>
                                                <select class="form-select" id="exportFormat">
                                                    <option value="json" selected>${t('jsonFormat')}</option>
                                                    <option value="csv">${t('csvFormat')}</option>
                                                </select>
                                                <div class="form-text">
                                                    CSV is alleen beschikbaar wanneer "Data exporteren" is geselecteerd
                                                </div>
                                            </div>
                                            
                                            <button class="btn btn-primary w-100" id="startExportBtn">
                                                <i class="bi bi-download"></i> ${t('startExport')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card border-info mt-4">
                                <div class="card-header bg-info text-white">
                                    <h5 class="mb-0">
                                        <i class="bi bi-graph-up"></i> ${t('databaseStatistics')}
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row" id="databaseStats">
                                        <div class="col-md-4 text-center">
                                            <div class="display-6 text-primary" id="statsHonden">...</div>
                                            <div class="text-muted">${t('dogs')}</div>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            <div class="display-6 text-success" id="statsFotos">...</div>
                                            <div class="text-muted">${t('photos')}</div>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            <div class="display-6 text-warning" id="statsPrive">...</div>
                                            <div class="text-muted">${t('privateRecords')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close') || 'Sluiten'}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        const importBtn = document.getElementById('startImportBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.handleImport();
            });
        }
        
        const exportBtn = document.getElementById('startExportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.handleExport();
            });
        }
        
        const backupEverythingRadio = document.getElementById('backupEverything');
        const shareDataRadio = document.getElementById('shareData');
        const exportDataCheckbox = document.getElementById('exportData');
        const exportPhotosCheckbox = document.getElementById('exportPhotos');
        const exportPrivateInfoCheckbox = document.getElementById('exportPrivateInfo');
        const exportFormatSelect = document.getElementById('exportFormat');
        
        if (backupEverythingRadio) {
            backupEverythingRadio.addEventListener('change', () => {
                if (exportDataCheckbox) exportDataCheckbox.checked = true;
                if (exportPhotosCheckbox) exportPhotosCheckbox.checked = true;
                if (exportPrivateInfoCheckbox) exportPrivateInfoCheckbox.checked = true;
                this.updateExportFormatOptions();
            });
        }
        
        if (shareDataRadio) {
            shareDataRadio.addEventListener('change', () => {
                if (exportDataCheckbox) exportDataCheckbox.checked = true;
                if (exportPhotosCheckbox) exportPhotosCheckbox.checked = true;
                if (exportPrivateInfoCheckbox) exportPrivateInfoCheckbox.checked = true;
                this.updateExportFormatOptions();
            });
        }
        
        if (exportDataCheckbox) {
            exportDataCheckbox.addEventListener('change', () => {
                this.updateExportFormatOptions();
            });
        }
        
        if (exportFormatSelect) {
            exportFormatSelect.addEventListener('change', () => {
                this.updateExportFormatOptions();
            });
        }
        
        const modal = document.getElementById('dataManagementModal');
        if (modal) {
            modal.addEventListener('shown.bs.modal', () => {
                this.loadDatabaseStats();
                this.updateExportFormatOptions();
                this.loadStorageStatus();
            });
            
            modal.addEventListener('hidden.bs.modal', () => {
                setTimeout(() => this.loadStorageStatus(), 100);
            });
        }
        
        document.querySelectorAll('.app-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.updateLanguage(lang);
            });
        });
        
        this.setupStorageEvents();
    }
    
    setupStorageEvents() {
        const checkStorageManager = () => {
            if (!window.storageManager) {
                setTimeout(checkStorageManager, 500);
                return;
            }
            
            console.log('StorageManager gevonden, event listeners instellen...');
            
            const useFileSystemBtn = document.getElementById('useFileSystemBtn');
            if (useFileSystemBtn) {
                useFileSystemBtn.addEventListener('click', async () => {
                    await this.switchToFileSystem(useFileSystemBtn);
                });
            }
            
            const useIndexedDBBtn = document.getElementById('useIndexedDBBtn');
            if (useIndexedDBBtn) {
                useIndexedDBBtn.addEventListener('click', async () => {
                    await this.switchToIndexedDB(useIndexedDBBtn);
                });
            }
            
            const openStorageSettingsBtn = document.getElementById('openStorageSettingsBtn');
            if (openStorageSettingsBtn) {
                openStorageSettingsBtn.addEventListener('click', () => {
                    this.showSimpleStorageSelector();
                });
            }
            
            this.loadStorageStatus();
        };
        
        checkStorageManager();
    }
    
    showSimpleStorageSelector() {
        const html = `
            <div class="modal-backdrop fade show"></div>
            <div class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">Opslag Selector</h5>
                            <button type="button" class="btn-close btn-close-white" onclick="document.querySelector('.simple-storage-selector').remove(); document.querySelector('.modal-backdrop.fade.show:last-child').remove();"></button>
                        </div>
                        <div class="modal-body">
                            <p>Selecteer opslagtype:</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-success" onclick="window.dataManager.switchToFileSystem()">
                                    <i class="bi bi-folder"></i> Bestandsopslag (ALLE data naar map)
                                </button>
                                <button class="btn btn-primary" onclick="window.dataManager.switchToIndexedDB()">
                                    <i class="bi bi-browser-chrome"></i> Browser Opslag (standaard)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const div = document.createElement('div');
        div.className = 'simple-storage-selector';
        div.innerHTML = html;
        document.body.appendChild(div);
    }
    
    async switchToFileSystem(buttonElement) {
        const t = this.t.bind(this);
        
        if (!buttonElement) {
            buttonElement = document.getElementById('useFileSystemBtn');
        }
        
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.innerHTML = '<i class="bi bi-hourglass-split"></i> Bezig...';
        }
        
        try {
            if (!window.storageManager) {
                throw new Error('Storage manager niet beschikbaar');
            }
            
            console.log('🎯 Schakel over naar FileSystem als PRIMAIRE opslag...');
            
            await storageManager.initialize('filesystem');
            
            // Schakel FileSystem modus in
            this.isUsingFileSystem = true;
            
            // Migreer bestaande data naar map
            await this.migrateToFileSystem();
            
            // Laad alle data uit map in cache
            await this.loadAllDataFromFileSystem();
            
            // Overschrijf database functies om via FileSystem te werken
            this.overrideDatabaseFunctions();
            
            // Refresh UI
            this.loadStorageStatus();
            
            // Toon melding dat we nu met map werken
            if (window.uiHandler && window.uiHandler.showSuccess) {
                window.uiHandler.showSuccess('✅ Bestandsopslag geactiveerd!<br><small>Alle nieuwe honden en foto\'s worden nu naar de map geschreven.</small>');
            }
            
            // Refresh hondenlijst
            if (window.refreshHondenLijst) {
                setTimeout(() => window.refreshHondenLijst(), 1000);
            }
            
            console.log('🎯 FileSystem is nu PRIMAIRE opslaglocatie!');
            
        } catch (error) {
            console.error('FileSystem init error:', error);
            
            if (window.uiHandler && window.uiHandler.showError) {
                window.uiHandler.showError('Kon bestandsopslag niet activeren: ' + error.message);
            }
            
        } finally {
            if (buttonElement) {
                setTimeout(() => {
                    buttonElement.disabled = false;
                    buttonElement.innerHTML = '<i class="bi bi-check-circle"></i> ' + t('useFileStorage');
                }, 1000);
            }
        }
    }
    
    async switchToIndexedDB(buttonElement) {
        const t = this.t.bind(this);
        
        if (!buttonElement) {
            buttonElement = document.getElementById('useIndexedDBBtn');
        }
        
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.innerHTML = '<i class="bi bi-hourglass-split"></i> Bezig...';
        }
        
        try {
            if (!window.storageManager) {
                throw new Error('Storage manager niet beschikbaar');
            }
            
            await storageManager.initialize('indexeddb');
            
            // Schakel FileSystem modus uit
            this.isUsingFileSystem = false;
            
            // Herstel originele database functies
            this.restoreDatabaseFunctions();
            
            this.loadStorageStatus();
            
            if (window.uiHandler && window.uiHandler.showSuccess) {
                window.uiHandler.showSuccess('Browser opslag geactiveerd!<br><small>Alle data wordt nu weer in de browser opgeslagen.</small>');
            }
            
        } catch (error) {
            console.error('IndexedDB init error:', error);
            
            if (window.uiHandler && window.uiHandler.showError) {
                window.uiHandler.showError('Kon browser opslag niet activeren: ' + error.message);
            }
            
        } finally {
            if (buttonElement) {
                setTimeout(() => {
                    buttonElement.disabled = false;
                    buttonElement.innerHTML = '<i class="bi bi-arrow-left-right"></i> ' + t('useBrowserStorage');
                }, 1000);
            }
        }
    }
    
    // 🔄 OVERSCHRIJF DATABASE FUNCTIES VOOR FILESYSTEM OPSLAG
    overrideDatabaseFunctions() {
        if (!this.db) {
            console.error('Database niet beschikbaar voor override');
            return;
        }
        
        console.log('🔄 Overschrijf database functies voor FileSystem opslag...');
        
        // Bewaar originele functies
        this.originalFunctions = {
            voegHondToe: this.db.voegHondToe?.bind(this.db),
            updateHond: this.db.updateHond?.bind(this.db),
            verwijderHond: this.db.verwijderHond?.bind(this.db),
            getHonden: this.db.getHonden?.bind(this.db),
            getHondById: this.db.getHondById?.bind(this.db),
            zoekHonden: this.db.zoekHonden?.bind(this.db),
            voegFotoToe: this.db.voegFotoToe?.bind(this.db),
            getFotosVoorHond: this.db.getFotosVoorHond?.bind(this.db),
            verwijderFoto: this.db.verwijderFoto?.bind(this.db),
            bewaarPriveInfo: this.db.bewaarPriveInfo?.bind(this.db),
            getPriveInfo: this.db.getPriveInfo?.bind(this.db),
            getStatistieken: this.db.getStatistieken?.bind(this.db)
        };
        
        // === HONDEN FUNCTIES ===
        
        // Nieuwe hond toevoegen → naar map
        this.db.voegHondToe = async (hondData) => {
            console.log('➕ Voeg hond toe via FileSystem...');
            
            // Genereer ID als die er niet is
            if (!hondData.id) {
                hondData.id = 'hond_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            
            // Voeg timestamp toe
            hondData.createdAt = new Date().toISOString();
            hondData.updatedAt = new Date().toISOString();
            
            // Sla op in FileSystem
            let filename = '';
            if (hondData.stamboomnr) {
                filename = this.createSafeFilename(`hond_${hondData.stamboomnr}`);
            } else {
                filename = this.createSafeFilename(`hond_${hondData.id}`);
            }
            
            // Voeg ook relatie-informatie toe voor volledige backup compatibiliteit
            const hondMetRelaties = await this.addRelationInfoToDog(hondData);
            
            await storageManager.save(filename, hondMetRelaties);
            
            // Update cache
            this.dogCache.set(hondData.id, hondMetRelaties);
            if (hondData.stamboomnr) {
                this.dogCache.set(`stamboom_${hondData.stamboomnr}`, hondMetRelaties);
            }
            
            console.log('✅ Hond opgeslagen in map:', filename);
            
            // Update ook in browser database voor compatibiliteit
            if (this.originalFunctions.voegHondToe) {
                await this.originalFunctions.voegHondToe(hondData);
            }
            
            return hondData.id;
        };
        
        // Hond updaten → naar map
        this.db.updateHond = async (updateData) => {
            console.log('✏️ Update hond via FileSystem...');
            
            // Haal huidige hond op uit cache of map
            let huidigeHond = this.dogCache.get(updateData.id);
            if (!huidigeHond) {
                const allFiles = await storageManager.getAllFiles();
                const hondFiles = allFiles.filter(f => f.name.startsWith('hond_'));
                
                for (const file of hondFiles) {
                    const hond = await storageManager.load(file.name);
                    if (hond.id === updateData.id) {
                        huidigeHond = hond;
                        break;
                    }
                }
            }
            
            if (!huidigeHond) {
                throw new Error('Hond niet gevonden');
            }
            
            // Update gegevens
            const updatedHond = {
                ...huidigeHond,
                ...updateData,
                updatedAt: new Date().toISOString(),
                updatedBy: window.auth?.getCurrentUser()?.username || 'unknown'
            };
            
            // Sla op in FileSystem
            let filename = '';
            if (updatedHond.stamboomnr) {
                filename = this.createSafeFilename(`hond_${updatedHond.stamboomnr}`);
            } else {
                filename = this.createSafeFilename(`hond_${updatedHond.id}`);
            }
            
            // Voeg relatie-info toe
            const hondMetRelaties = await this.addRelationInfoToDog(updatedHond);
            await storageManager.save(filename, hondMetRelaties);
            
            // Update cache
            this.dogCache.set(updatedHond.id, hondMetRelaties);
            if (updatedHond.stamboomnr) {
                this.dogCache.set(`stamboom_${updatedHond.stamboomnr}`, hondMetRelaties);
            }
            
            console.log('✅ Hond bijgewerkt in map:', filename);
            
            // Update ook in browser database
            if (this.originalFunctions.updateHond) {
                await this.originalFunctions.updateHond(updateData);
            }
            
            return true;
        };
        
        // Hond verwijderen → uit map
        this.db.verwijderHond = async (id) => {
            console.log('🗑️ Verwijder hond via FileSystem...');
            
            // Zoek bestand voor deze hond
            const allFiles = await storageManager.getAllFiles();
            const hondFiles = allFiles.filter(f => f.name.startsWith('hond_'));
            
            for (const file of hondFiles) {
                const hond = await storageManager.load(file.name);
                if (hond.id === id) {
                    // Verwijder uit FileSystem
                    await storageManager.delete(file.name);
                    
                    // Verwijder uit cache
                    this.dogCache.delete(id);
                    if (hond.stamboomnr) {
                        this.dogCache.delete(`stamboom_${hond.stamboomnr}`);
                    }
                    
                    console.log('✅ Hond verwijderd uit map:', file.name);
                    break;
                }
            }
            
            // Verwijder ook uit browser database
            if (this.originalFunctions.verwijderHond) {
                await this.originalFunctions.verwijderHond(id);
            }
            
            return true;
        };
        
        // Alle honden ophalen → uit map cache
        this.db.getHonden = async () => {
            if (this.dogCache.size === 0) {
                await this.loadAllDogsFromFileSystem();
            }
            
            const honden = Array.from(this.dogCache.values())
                .filter(hond => !hond.id || typeof hond.id !== 'string' || !hond.id.startsWith('stamboom_')) // FIX: veilige check
                .map(hond => ({ ...hond }));
            
            console.log(`📊 Get ${honden.length} honden uit FileSystem cache`);
            return honden;
        };
        
        // Hond zoeken op ID → uit map cache
        this.db.getHondById = async (id) => {
            // Check cache
            if (this.dogCache.has(id)) {
                const hond = this.dogCache.get(id);
                if (!hond.id || typeof hond.id !== 'string' || !hond.id.startsWith('stamboom_')) {
                    return { ...hond };
                }
            }
            
            // Zoek in FileSystem
            const allFiles = await storageManager.getAllFiles();
            const hondFiles = allFiles.filter(f => f.name.startsWith('hond_'));
            
            for (const file of hondFiles) {
                try {
                    const hond = await storageManager.load(file.name);
                    if (hond.id === id) {
                        // Cache voor volgende keer
                        this.dogCache.set(id, hond);
                        if (hond.stamboomnr) {
                            this.dogCache.set(`stamboom_${hond.stamboomnr}`, hond);
                        }
                        return { ...hond };
                    }
                } catch (error) {
                    console.error('Fout bij laden hond:', error);
                }
            }
            
            return null;
        };
        
        // Hond zoeken op stamboomnr → uit map cache
        this.db.getHondByStamboomnr = async (stamboomnr) => {
            const cacheKey = `stamboom_${stamboomnr}`;
            if (this.dogCache.has(cacheKey)) {
                return { ...this.dogCache.get(cacheKey) };
            }
            
            // Zoek in FileSystem
            const filename = this.createSafeFilename(`hond_${stamboomnr}`);
            try {
                const hond = await storageManager.load(filename);
                if (hond) {
                    // Cache voor volgende keer
                    this.dogCache.set(hond.id, hond);
                    this.dogCache.set(cacheKey, hond);
                    return { ...hond };
                }
            } catch (error) {
                // Bestand niet gevonden, zoek in alle bestanden
                const allFiles = await storageManager.getAllFiles();
                const hondFiles = allFiles.filter(f => f.name.startsWith('hond_'));
                
                for (const file of hondFiles) {
                    try {
                        const hond = await storageManager.load(file.name);
                        if (hond.stamboomnr === stamboomnr) {
                            // Cache voor volgende keer
                            this.dogCache.set(hond.id, hond);
                            this.dogCache.set(cacheKey, hond);
                            return { ...hond };
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }
            
            return null;
        };
        
        // Zoek honden → uit map cache
        this.db.zoekHonden = async (zoekTerm) => {
            if (this.dogCache.size === 0) {
                await this.loadAllDogsFromFileSystem();
            }
            
            const honden = Array.from(this.dogCache.values())
                .filter(hond => !hond.id || typeof hond.id !== 'string' || !hond.id.startsWith('stamboom_'))
                .map(hond => ({ ...hond }));
            
            if (!zoekTerm) return honden;
            
            const term = zoekTerm.toLowerCase();
            return honden.filter(hond => {
                return (
                    (hond.naam && hond.naam.toLowerCase().includes(term)) ||
                    (hond.stamboomnr && hond.stamboomnr.toLowerCase().includes(term)) ||
                    (hond.kennelnaam && hond.kennelnaam.toLowerCase().includes(term)) ||
                    (hond.ras && hond.ras.toLowerCase().includes(term))
                );
            });
        };
        
        // === FOTO FUNCTIES ===
        
        // Foto toevoegen → naar map
        this.db.voegFotoToe = async (fotoData) => {
            console.log('📷 Voeg foto toe via FileSystem...');
            
            // Genereer ID als die er niet is
            if (!fotoData.id) {
                fotoData.id = 'foto_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            
            // Voeg timestamp toe
            fotoData.uploadedAt = new Date().toISOString();
            
            // Sla foto metadata op in FileSystem
            const fotoFilename = this.createSafeFilename(`foto_${fotoData.id}`);
            await storageManager.save(fotoFilename, fotoData);
            
            // Update foto cache
            this.photoCache.set(fotoData.id, fotoData);
            
            // Voeg toe aan hond's foto lijst
            if (fotoData.stamboomnr) {
                const hondFotoFilename = this.createSafeFilename(`fotos_hond_${fotoData.stamboomnr}`);
                let hondFotos = [];
                
                try {
                    hondFotos = await storageManager.load(hondFotoFilename) || [];
                } catch (error) {
                    // Bestand bestaat nog niet
                }
                
                hondFotos.push(fotoData);
                await storageManager.save(hondFotoFilename, hondFotos);
            }
            
            console.log('✅ Foto opgeslagen in map:', fotoFilename);
            
            // Update ook in browser database
            if (this.originalFunctions.voegFotoToe) {
                await this.originalFunctions.voegFotoToe(fotoData);
            }
            
            return fotoData.id;
        };
        
        // Foto's ophalen voor hond → uit map
        this.db.getFotosVoorHond = async (stamboomnr) => {
            const cacheKey = `fotos_${stamboomnr}`;
            
            // Check cache eerst
            if (this.photoCache.has(cacheKey)) {
                return [...this.photoCache.get(cacheKey)];
            }
            
            // Laad uit FileSystem
            const filename = this.createSafeFilename(`fotos_hond_${stamboomnr}`);
            let fotos = [];
            
            try {
                fotos = await storageManager.load(filename) || [];
            } catch (error) {
                // Bestand bestaat niet
            }
            
            // Cache voor volgende keer
            this.photoCache.set(cacheKey, fotos);
            
            console.log(`📸 Get ${fotos.length} foto's voor hond ${stamboomnr} uit FileSystem`);
            return [...fotos];
        };
        
        // Foto verwijderen → uit map
        this.db.verwijderFoto = async (fotoId) => {
            console.log('🗑️ Verwijder foto via FileSystem...');
            
            // Zoek foto metadata
            const fotoFilename = this.createSafeFilename(`foto_${fotoId}`);
            let fotoData = null;
            
            try {
                fotoData = await storageManager.load(fotoFilename);
            } catch (error) {
                // Foto niet gevonden
            }
            
            if (fotoData) {
                // Verwijder foto bestand
                await storageManager.delete(fotoFilename);
                
                // Verwijder uit cache
                this.photoCache.delete(fotoId);
                
                // Verwijder uit hond's foto lijst
                if (fotoData.stamboomnr) {
                    const hondFotoFilename = this.createSafeFilename(`fotos_hond_${fotoData.stamboomnr}`);
                    let hondFotos = [];
                    
                    try {
                        hondFotos = await storageManager.load(hondFotoFilename) || [];
                    } catch (error) {
                        // Bestand bestaat niet
                    }
                    
                    // Filter de verwijderde foto eruit
                    hondFotos = hondFotos.filter(f => f.id !== fotoId);
                    
                    if (hondFotos.length > 0) {
                        await storageManager.save(hondFotoFilename, hondFotos);
                    } else {
                        // Verwijder leeg bestand
                        await storageManager.delete(hondFotoFilename);
                    }
                    
                    // Update cache
                    this.photoCache.delete(`fotos_${fotoData.stamboomnr}`);
                }
                
                console.log('✅ Foto verwijderd uit map:', fotoFilename);
            }
            
            // Verwijder ook uit browser database
            if (this.originalFunctions.verwijderFoto) {
                await this.originalFunctions.verwijderFoto(fotoId);
            }
            
            return true;
        };
        
        // === PRIVÉ INFO FUNCTIES ===
        
        this.db.bewaarPriveInfo = async (priveData) => {
            const filename = this.createSafeFilename(`prive_${priveData.stamboomnr}`);
            await storageManager.save(filename, priveData);
            
            // Update ook in browser database
            if (this.originalFunctions.bewaarPriveInfo) {
                await this.originalFunctions.bewaarPriveInfo(priveData);
            }
            
            return true;
        };
        
        this.db.getPriveInfo = async (stamboomnr) => {
            const filename = this.createSafeFilename(`prive_${stamboomnr}`);
            try {
                return await storageManager.load(filename);
            } catch (error) {
                return null;
            }
        };
        
        // === STATISTIEKEN ===
        
        this.db.getStatistieken = async () => {
            // Laad alle data uit FileSystem
            if (this.dogCache.size === 0) {
                await this.loadAllDogsFromFileSystem();
            }
            
            const honden = Array.from(this.dogCache.values())
                .filter(hond => !hond.id || typeof hond.id !== 'string' || !hond.id.startsWith('stamboom_'));
            
            let totaalFotos = 0;
            const allFiles = await storageManager.getAllFiles();
            
            // Tel foto bestanden
            allFiles.forEach(file => {
                if (file.name.startsWith('foto_')) {
                    totaalFotos++;
                }
            });
            
            let totaalPriveInfo = 0;
            allFiles.forEach(file => {
                if (file.name.startsWith('prive_')) {
                    totaalPriveInfo++;
                }
            });
            
            return {
                totaalHonden: honden.length,
                totaalFotos: totaalFotos,
                totaalPriveInfo: totaalPriveInfo,
                opslagType: 'filesystem'
            };
        };
        
        console.log('✅ Database functies overschreven voor FileSystem opslag');
    }
    
    restoreDatabaseFunctions() {
        if (!this.db || !this.originalFunctions) {
            return;
        }
        
        console.log('🔄 Herstel originele database functies...');
        
        // Herstel alle originele functies
        Object.keys(this.originalFunctions).forEach(key => {
            if (this.originalFunctions[key]) {
                this.db[key] = this.originalFunctions[key];
            }
        });
        
        // Leeg cache
        this.dogCache.clear();
        this.photoCache.clear();
        
        this.isUsingFileSystem = false;
        
        console.log('✅ Originele database functies hersteld');
    }
    
    // 🗂️ FILE SYSTEM DATA MANAGEMENT
    
    async loadAllDataFromFileSystem() {
        console.log('🗂️ Laad alle data uit FileSystem...');
        
        // Laad honden
        await this.loadAllDogsFromFileSystem();
        
        // Laad foto metadata
        await this.loadAllPhotosFromFileSystem();
        
        console.log('✅ Alle data geladen uit FileSystem');
    }
    
    async loadAllDogsFromFileSystem() {
        try {
            const allFiles = await storageManager.getAllFiles();
            const hondFiles = allFiles.filter(f => f.name.startsWith('hond_'));
            
            console.log(`📂 Laad ${hondFiles.length} honden uit FileSystem...`);
            
            for (const file of hondFiles) {
                try {
                    const hond = await storageManager.load(file.name);
                    if (hond && hond.id) {
                        // Cache voor snelle toegang
                        this.dogCache.set(hond.id, hond);
                        if (hond.stamboomnr) {
                            this.dogCache.set(`stamboom_${hond.stamboomnr}`, hond);
                        }
                    }
                } catch (error) {
                    console.error(`Fout bij laden hond uit ${file.name}:`, error);
                }
            }
            
            console.log(`✅ ${this.dogCache.size} honden geladen in cache`);
            
        } catch (error) {
            console.error('Fout bij laden honden uit FileSystem:', error);
        }
    }
    
    async loadAllPhotosFromFileSystem() {
        try {
            const allFiles = await storageManager.getAllFiles();
            
            // Groepeer foto's per hond
            const hondFotosMap = new Map();
            
            // Zoek naar hond specifieke foto bestanden
            const hondFotoFiles = allFiles.filter(f => f.name.startsWith('fotos_hond_'));
            
            for (const file of hondFotoFiles) {
                try {
                    const fotos = await storageManager.load(file.name) || [];
                    const stamboomnr = file.name.replace('fotos_hond_', '').replace('.json', '');
                    
                    if (stamboomnr) {
                        this.photoCache.set(`fotos_${stamboomnr}`, fotos);
                        
                        // Cache individuele foto's ook
                        fotos.forEach(foto => {
                            if (foto.id) {
                                this.photoCache.set(foto.id, foto);
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Fout bij laden foto's uit ${file.name}:`, error);
                }
            }
            
            // Zoek naar individuele foto bestanden
            const individueleFotoFiles = allFiles.filter(f => f.name.startsWith('foto_'));
            
            for (const file of individueleFotoFiles) {
                try {
                    const foto = await storageManager.load(file.name);
                    if (foto && foto.id) {
                        this.photoCache.set(foto.id, foto);
                        
                        // Voeg toe aan hond's lijst
                        if (foto.stamboomnr) {
                            const cacheKey = `fotos_${foto.stamboomnr}`;
                            let fotos = this.photoCache.get(cacheKey) || [];
                            if (!fotos.find(f => f.id === foto.id)) {
                                fotos.push(foto);
                                this.photoCache.set(cacheKey, fotos);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Fout bij laden foto uit ${file.name}:`, error);
                }
            }
            
            console.log(`✅ Foto metadata geladen in cache`);
            
        } catch (error) {
            console.error('Fout bij laden foto\'s uit FileSystem:', error);
        }
    }
    
    async addRelationInfoToDog(hond) {
        // Als de hond al relatie info heeft, return dan
        if (hond.vaderStamboomnr || hond.moederStamboomnr) {
            return hond;
        }
        
        const hondMetRelaties = { ...hond };
        
        // Zoek vader relatie
        if (hond.vaderId) {
            let vader = this.dogCache.get(hond.vaderId);
            
            // Zoek in cache via stamboom key
            if (!vader) {
                const allFiles = await storageManager.getAllFiles();
                const hondFiles = allFiles.filter(f => f.name.startsWith('hond_'));
                
                for (const file of hondFiles) {
                    try {
                        const kandidaat = await storageManager.load(file.name);
                        if (kandidaat.id === hond.vaderId) {
                            vader = kandidaat;
                            this.dogCache.set(kandidaat.id, kandidaat);
                            if (kandidaat.stamboomnr) {
                                this.dogCache.set(`stamboom_${kandidaat.stamboomnr}`, kandidaat);
                            }
                            break;
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }
            
            if (vader && vader.stamboomnr) {
                hondMetRelaties.vaderStamboomnr = vader.stamboomnr;
                hondMetRelaties.vaderNaam = vader.naam;
                hondMetRelaties.vaderKennel = vader.kennelnaam;
            }
        }
        
        // Zoek moeder relatie
        if (hond.moederId) {
            let moeder = this.dogCache.get(hond.moederId);
            
            if (!moeder) {
                const allFiles = await storageManager.getAllFiles();
                const hondFiles = allFiles.filter(f => f.name.startsWith('hond_'));
                
                for (const file of hondFiles) {
                    try {
                        const kandidaat = await storageManager.load(file.name);
                        if (kandidaat.id === hond.moederId) {
                            moeder = kandidaat;
                            this.dogCache.set(kandidaat.id, kandidaat);
                            if (kandidaat.stamboomnr) {
                                this.dogCache.set(`stamboom_${kandidaat.stamboomnr}`, kandidaat);
                            }
                            break;
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }
            
            if (moeder && moeder.stamboomnr) {
                hondMetRelaties.moederStamboomnr = moeder.stamboomnr;
                hondMetRelaties.moederNaam = moeder.naam;
                hondMetRelaties.moederKennel = moeder.kennelnaam;
            }
        }
        
        return hondMetRelaties;
    }
    
    async migrateToFileSystem() {
        try {
            console.log('🔄 Migreer bestaande data naar FileSystem...');
            
            const db = await this.ensureDatabase();
            
            if (!window.storageManager) {
                throw new Error('StorageManager niet beschikbaar');
            }
            
            const storageInfo = storageManager.getStorageInfo();
            if (storageInfo.current !== 'filesystem') {
                return;
            }
            
            // Haal alle data op uit database
            const honden = await db.getHonden();
            console.log(`📦 Migreer ${honden.length} honden...`);
            
            // Maak parent lookup voor relaties
            const parentLookupMap = new Map();
            honden.forEach(hond => {
                if (hond.stamboomnr) {
                    parentLookupMap.set(hond.id, {
                        stamboomnr: hond.stamboomnr,
                        naam: hond.naam,
                        kennelnaam: hond.kennelnaam
                    });
                }
            });
            
            // Sla honden op in FileSystem met relatie-info
            for (const hond of honden) {
                const hondMetRelaties = { ...hond };
                
                // Voeg vader info toe
                if (hond.vaderId && parentLookupMap.has(hond.vaderId)) {
                    const vader = parentLookupMap.get(hond.vaderId);
                    hondMetRelaties.vaderStamboomnr = vader.stamboomnr;
                    hondMetRelaties.vaderNaam = vader.naam;
                    hondMetRelaties.vaderKennel = vader.kennelnaam;
                }
                
                // Voeg moeder info toe
                if (hond.moederId && parentLookupMap.has(hond.moederId)) {
                    const moeder = parentLookupMap.get(hond.moederId);
                    hondMetRelaties.moederStamboomnr = moeder.stamboomnr;
                    hondMetRelaties.moederNaam = moeder.naam;
                    hondMetRelaties.moederKennel = moeder.kennelnaam;
                }
                
                let filename = '';
                if (hond.stamboomnr) {
                    filename = this.createSafeFilename(`hond_${hond.stamboomnr}`);
                } else {
                    filename = this.createSafeFilename(`hond_${hond.id}`);
                }
                
                await storageManager.save(filename, hondMetRelaties);
            }
            
            // Migreer foto's
            if (typeof db.getAllFotos === 'function') {
                try {
                    const fotos = await db.getAllFotos();
                    console.log(`📸 Migreer ${fotos.length} foto's...`);
                    
                    // Groepeer foto's per hond
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
                        const filename = this.createSafeFilename(`fotos_hond_${stamboomnr}`);
                        await storageManager.save(filename, hondFotos);
                        
                        // Sla ook individuele foto metadata op
                        for (const foto of hondFotos) {
                            if (foto.id) {
                                const individueelFilename = this.createSafeFilename(`foto_${foto.id}`);
                                await storageManager.save(individueelFilename, foto);
                            }
                        }
                    }
                } catch (fotoError) {
                    console.log('Foto migratie overslagen:', fotoError);
                }
            }
            
            // Migreer privé info
            if (typeof db.getAllPriveInfo === 'function') {
                try {
                    const priveInfo = await db.getAllPriveInfo();
                    console.log(`🔒 Migreer ${priveInfo.length} privé records...`);
                    
                    for (const prive of priveInfo) {
                        if (prive.stamboomnr) {
                            const filename = this.createSafeFilename(`prive_${prive.stamboomnr}`);
                            await storageManager.save(filename, prive);
                        }
                    }
                } catch (priveError) {
                    console.log('Privé info migratie overslagen:', priveError);
                }
            }
            
            // Maak een complete backup
            const completeBackup = {
                metadata: {
                    exportDatum: new Date().toISOString(),
                    type: 'complete_migratie',
                    aantalHonden: honden.length,
                    opslagType: 'filesystem'
                }
            };
            
            const backupFilename = this.createSafeFilename(`migratie_backup_${new Date().toISOString().split('T')[0]}`);
            await storageManager.save(backupFilename, completeBackup);
            
            console.log('✅ Migratie naar FileSystem voltooid!');
            
        } catch (error) {
            console.error('Fout bij migratie naar FileSystem:', error);
            throw error;
        }
    }
    
    createSafeFilename(baseName) {
        let safeName = baseName.replace(/[<>:"/\\|?*]/g, '_');
        safeName = safeName.replace(/\s+/g, '_');
        if (safeName.length > 100) {
            safeName = safeName.substring(0, 100);
        }
        return `${safeName}.json`;
    }
    
    async loadStorageStatus() {
        const statusEl = document.getElementById('currentStorageStatus');
        if (!statusEl) return;
        
        if (!window.storageManager) {
            statusEl.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-hourglass-split me-2"></i>
                    <div>
                        <strong>${this.t('storageLoading')}</strong><br>
                        <small class="text-muted">StorageManager wordt geladen...</small>
                    </div>
                </div>
            `;
            statusEl.className = 'alert alert-light mb-0';
            
            setTimeout(() => this.loadStorageStatus(), 1000);
            return;
        }
        
        const info = storageManager.getStorageInfo();
        const t = this.t.bind(this);
        
        let html = '';
        let statusClass = 'light';
        
        if (info.current === 'filesystem') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-folder text-success me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>${t('fileStorage')} (${t('storageActive')})</strong><br>
                        <small class="text-muted">📍 Map: ${info.directoryName || 'Geselecteerd'}</small><br>
                        <small class="text-success">✅ Alle data wordt nu naar de map geschreven!</small>
                    </div>
                </div>
            `;
            statusClass = 'success';
        } else if (info.current === 'indexeddb' || info.current === 'indexeddb-temp') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-browser-chrome text-info me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>${t('browserStorage')} (${t('storageActive')})</strong><br>
                        <small class="text-muted">Data wordt in je browser opgeslagen</small>
                    </div>
                </div>
            `;
            statusClass = 'info';
        } else if (info.current === 'none') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-question-circle text-warning me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>${t('storageSettings')}</strong><br>
                        <small class="text-muted">Niet geconfigureerd - kies een opslagtype</small>
                    </div>
                </div>
            `;
            statusClass = 'warning';
        } else {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-hourglass-split me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>${t('storageLoading')}</strong>
                    </div>
                </div>
            `;
        }
        
        statusEl.innerHTML = html;
        statusEl.className = `alert alert-${statusClass} mb-0`;
    }
    
    updateExportFormatOptions() {
        const exportDataCheckbox = document.getElementById('exportData');
        const exportFormatSelect = document.getElementById('exportFormat');
        const csvOption = exportFormatSelect?.querySelector('option[value="csv"]');
        
        if (exportDataCheckbox && exportFormatSelect && csvOption) {
            const isDataChecked = exportDataCheckbox.checked;
            const isCSVSelected = exportFormatSelect.value === 'csv';
            
            csvOption.disabled = !isDataChecked;
            
            if (isCSVSelected && !isDataChecked) {
                exportFormatSelect.value = 'json';
            }
            
            const formText = exportFormatSelect.nextElementSibling;
            if (formText && formText.classList.contains('form-text')) {
                formText.textContent = isDataChecked 
                    ? 'CSV is alleen beschikbaar wanneer "Data exporteren" is geselecteerd' 
                    : 'CSV is niet beschikbaar zonder "Data exporteren"';
            }
        }
    }
    
    updateModalTexts() {
        const t = this.t.bind(this);
        const modal = document.getElementById('dataManagementModal');
        
        if (!modal) return;
        
        // Update alle tekst in modal
        const elements = modal.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (key && t(key)) {
                el.textContent = t(key);
            }
        });
        
        this.loadStorageStatus();
        this.updateBackupWarningText();
        this.updateExportFormatOptions();
    }
    
    updateBackupWarningText() {
        if (!window.backupManager) return;
        
        const status = window.backupManager.getStatus();
        const daysSince = window.backupManager.getDaysSinceLastBackup();
        const t = this.t.bind(this);
        
        const warningDiv = document.querySelector('#dataManagementModal .alert');
        if (!warningDiv) return;
        
        if (status.level === 'danger') {
            warningDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> 
                <strong>${t('backupStatusDanger')}</strong><br>
                ${t('backupDangerText')}`;
        } else if (status.level === 'warning') {
            const warningText = t('backupWarningText').replace('{days}', daysSince);
            warningDiv.innerHTML = `<i class="bi bi-exclamation-triangle"></i> 
                <strong>${t('backupStatusWarning')}</strong><br>
                ${warningText}`;
        }
    }
    
    async handleImport() {
        const t = this.t.bind(this);
        const fileInput = document.getElementById('importFile');
        
        if (!fileInput || !fileInput.files.length) {
            this.showError(t('selectFileFirst'));
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                this.showProgress(t('importingData'));
                
                let importData;
                if (file.name.endsWith('.csv')) {
                    importData = await this.parseCSV(e.target.result);
                } else {
                    importData = JSON.parse(e.target.result);
                }
                
                const result = await this.processImportWithRelations(importData);
                
                // Als FileSystem actief is, laad de data opnieuw in cache
                if (this.isUsingFileSystem) {
                    await this.loadAllDataFromFileSystem();
                }
                
                this.hideProgress();
                this.showImportResults(result);
                await this.loadDatabaseStats();
                
            } catch (error) {
                this.hideProgress();
                this.showError(`${t('importFailed')}${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.showError(t('fileReadError'));
        };
        
        reader.readAsText(file);
    }
    
    async handleExport() {
        const t = this.t.bind(this);
        const isBackup = document.getElementById('backupEverything')?.checked;
        const exportData = document.getElementById('exportData').checked;
        const exportPhotos = document.getElementById('exportPhotos').checked;
        const exportPrivateInfo = document.getElementById('exportPrivateInfo').checked;
        const exportFormat = document.getElementById('exportFormat').value;
        
        if (!exportData && !exportPhotos && !exportPrivateInfo) {
            this.showError(t('nothingToExport'));
            return;
        }
        
        if (exportFormat === 'csv' && !exportData) {
            this.showError('CSV export is alleen beschikbaar met "Data exporteren"');
            return;
        }
        
        this.showProgress(t('exportingData'));
        
        try {
            const exportDataObj = {
                metadata: {
                    exportDatum: new Date().toISOString(),
                    exportDoor: window.auth?.getCurrentUser()?.username || 'unknown',
                    exportType: isBackup ? 'backup' : 'share',
                    exportFormat: exportFormat,
                    containsData: exportData,
                    containsPhotos: exportPhotos,
                    containsPrivate: exportPrivateInfo,
                    versie: "2.0",
                    bevatRelaties: true,
                    opslagType: this.isUsingFileSystem ? 'filesystem' : 'browser'
                }
            };
            
            let hondenCount = 0;
            let fotosCount = 0;
            let priveCount = 0;
            
            if (exportData) {
                let honden = [];
                
                if (this.isUsingFileSystem) {
                    // Haal honden uit FileSystem cache
                    honden = Array.from(this.dogCache.values())
                        .filter(hond => !hond.id || typeof hond.id !== 'string' || !hond.id.startsWith('stamboom_'));
                } else {
                    // Haal honden uit database
                    const db = await this.ensureDatabase();
                    honden = await db.getHonden();
                }
                
                exportDataObj.honden = honden;
                hondenCount = honden.length;
            }
            
            if (exportPhotos) {
                let fotos = [];
                
                if (this.isUsingFileSystem) {
                    // Haal foto's uit FileSystem
                    const allFiles = await storageManager.getAllFiles();
                    const fotoFiles = allFiles.filter(f => f.name.startsWith('foto_'));
                    
                    for (const file of fotoFiles) {
                        try {
                            const foto = await storageManager.load(file.name);
                            if (foto) {
                                fotos.push(foto);
                            }
                        } catch (error) {
                            console.error('Fout bij laden foto:', error);
                        }
                    }
                } else if (typeof this.db?.getAllFotos === 'function') {
                    fotos = await this.db.getAllFotos();
                }
                
                exportDataObj.fotos = fotos;
                fotosCount = fotos.length;
            }
            
            if (exportPrivateInfo) {
                let priveInfo = [];
                
                if (this.isUsingFileSystem) {
                    // Haal privé info uit FileSystem
                    const allFiles = await storageManager.getAllFiles();
                    const priveFiles = allFiles.filter(f => f.name.startsWith('prive_'));
                    
                    for (const file of priveFiles) {
                        try {
                            const prive = await storageManager.load(file.name);
                            if (prive) {
                                priveInfo.push(prive);
                            }
                        } catch (error) {
                            console.error('Fout bij laden privé info:', error);
                        }
                    }
                } else if (typeof this.db?.getAllPriveInfo === 'function') {
                    priveInfo = await this.db.getAllPriveInfo();
                }
                
                exportDataObj.priveInfo = priveInfo;
                priveCount = priveInfo.length;
            }
            
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const timeStr = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
            let filenamePrefix = isBackup ? 'backup' : 'share';
            
            filenamePrefix += this.isUsingFileSystem ? '_filesystem' : '_browser';
            
            let filename = `${filenamePrefix}_${dateStr}_${timeStr}`;
            let fullFilename;
            
            if (exportFormat === 'csv' && exportData) {
                const csv = this.convertHondenToCSV(exportDataObj.honden);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                fullFilename = `${filename}.csv`;
                this.downloadFile(blob, fullFilename);
            } else {
                const jsonString = JSON.stringify(exportDataObj, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                fullFilename = `${filename}.json`;
                this.downloadFile(blob, fullFilename);
            }
            
            this.hideProgress();
            
            // Backup registreren
            if (isBackup && window.backupManager && exportData && exportPhotos && exportPrivateInfo) {
                window.backupManager.recordBackup('full', fullFilename);
            }
            
            let successDetails = `${t('exportComplete')}<br>`;
            if (exportData) {
                successDetails += `${t('totalDogsExported')}${hondenCount}<br>`;
            }
            if (exportPhotos && fotosCount > 0) {
                successDetails += `${t('totalPhotosExported')}${fotosCount}<br>`;
            }
            if (exportPrivateInfo && priveCount > 0) {
                successDetails += `${t('totalPrivateExported')}${priveCount}<br>`;
            }
            
            const opslagType = this.isUsingFileSystem ? 'map' : 'browser';
            successDetails += `<small>Export gemaakt van: <strong>${opslagType}</strong></small>`;
            
            const successMessage = `${t('exportSuccess')}<br>
                                  <small>${t('exportFileSaved')} <strong>${fullFilename}</strong></small><br>
                                  ${successDetails}`;
            this.showSuccess(successMessage);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('exportFailed')}${error.message}`);
        }
    }
    
    async processImportWithRelations(importData) {
        const t = this.t.bind(this);
        const result = {
            honden: { toegevoegd: 0, bijgewerkt: 0 },
            fotos: { toegevoegd: 0 },
            priveInfo: { bijgewerkt: 0 },
            relaties: { hersteld: 0 }
        };
        
        console.log('=== START IMPORT ===');
        
        const db = await this.ensureDatabase();
        
        // Importeer honden
        if (importData.honden && Array.isArray(importData.honden)) {
            console.log(`Importeer ${importData.honden.length} honden...`);
            
            for (const importedHond of importData.honden) {
                try {
                    // Importeer hond
                    if (this.isUsingFileSystem) {
                        // Direct naar FileSystem schrijven
                        let filename = '';
                        if (importedHond.stamboomnr) {
                            filename = this.createSafeFilename(`hond_${importedHond.stamboomnr}`);
                        } else {
                            filename = this.createSafeFilename(`hond_${importedHond.id}`);
                        }
                        
                        await storageManager.save(filename, importedHond);
                        
                        // Update cache
                        this.dogCache.set(importedHond.id, importedHond);
                        if (importedHond.stamboomnr) {
                            this.dogCache.set(`stamboom_${importedHond.stamboomnr}`, importedHond);
                        }
                        
                        result.honden.toegevoegd++;
                    } else {
                        // Naar database schrijven
                        if (importedHond.id && (await db.getHondById(importedHond.id))) {
                            await db.updateHond(importedHond);
                            result.honden.bijgewerkt++;
                        } else {
                            await db.voegHondToe(importedHond);
                            result.honden.toegevoegd++;
                        }
                    }
                } catch (error) {
                    console.error('Fout bij importeren hond:', error);
                }
            }
        }
        
        // Importeer foto's
        if (importData.fotos && Array.isArray(importData.fotos) && importData.fotos.length > 0) {
            console.log(`Importeer ${importData.fotos.length} foto's...`);
            
            for (const foto of importData.fotos) {
                try {
                    if (this.isUsingFileSystem) {
                        // Sla foto metadata op in FileSystem
                        const fotoFilename = this.createSafeFilename(`foto_${foto.id}`);
                        await storageManager.save(fotoFilename, foto);
                        
                        // Voeg toe aan hond's foto lijst
                        if (foto.stamboomnr) {
                            const hondFotoFilename = this.createSafeFilename(`fotos_hond_${foto.stamboomnr}`);
                            let hondFotos = [];
                            
                            try {
                                hondFotos = await storageManager.load(hondFotoFilename) || [];
                            } catch (error) {}
                            
                            hondFotos.push(foto);
                            await storageManager.save(hondFotoFilename, hondFotos);
                            
                            // Update cache
                            this.photoCache.set(`fotos_${foto.stamboomnr}`, hondFotos);
                        }
                        
                        result.fotos.toegevoegd++;
                    } else if (typeof db.voegFotoToe === 'function') {
                        await db.voegFotoToe(foto);
                        result.fotos.toegevoegd++;
                    }
                } catch (error) {
                    console.error('Fout bij importeren foto:', error);
                }
            }
        }
        
        // Importeer privé info
        if (importData.priveInfo && Array.isArray(importData.priveInfo) && importData.priveInfo.length > 0) {
            console.log(`Importeer ${importData.priveInfo.length} privé records...`);
            
            for (const prive of importData.priveInfo) {
                try {
                    if (this.isUsingFileSystem && prive.stamboomnr) {
                        const filename = this.createSafeFilename(`prive_${prive.stamboomnr}`);
                        await storageManager.save(filename, prive);
                        result.priveInfo.bijgewerkt++;
                    } else if (typeof db.bewaarPriveInfo === 'function') {
                        await db.bewaarPriveInfo(prive);
                        result.priveInfo.bijgewerkt++;
                    }
                } catch (error) {
                    console.error('Fout bij importeren privé info:', error);
                }
            }
        }
        
        console.log('=== IMPORT VOLTOOID ===', result);
        return result;
    }
    
    showProgress(message) {
        this.hideProgress();
        
        const progressHtml = `
            <div class="modal-backdrop fade show"></div>
            <div class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center">
                            <div class="spinner-border text-primary mb-3" role="status"></div>
                            <p>${message}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const progressDiv = document.createElement('div');
        progressDiv.id = 'dataManagerProgress';
        progressDiv.innerHTML = progressHtml;
        document.body.appendChild(progressDiv);
    }
    
    hideProgress() {
        const progressDiv = document.getElementById('dataManagerProgress');
        if (progressDiv) {
            progressDiv.remove();
        }
        document.querySelectorAll('.modal-backdrop.fade.show').forEach(backdrop => {
            if (backdrop.parentNode) {
                backdrop.remove();
            }
        });
    }
    
    showImportResults(result) {
        const t = this.t.bind(this);
        let summary = `<h5>${t('importSummary')}</h5><div class="alert alert-success">`;
        
        if (result.honden.toegevoegd > 0) {
            summary += `<strong>${result.honden.toegevoegd}</strong> ${t('newDogsAdded')}<br>`;
        }
        if (result.honden.bijgewerkt > 0) {
            summary += `<strong>${result.honden.bijgewerkt}</strong> ${t('dogsUpdated')}<br>`;
        }
        if (result.fotos.toegevoegd > 0) {
            summary += `<strong>${result.fotos.toegevoegd}</strong> ${t('photosImported')}<br>`;
        }
        if (result.priveInfo.bijgewerkt > 0) {
            summary += `<strong>${result.priveInfo.bijgewerkt}</strong> ${t('privateUpdated')}<br>`;
        }
        
        const opslagType = this.isUsingFileSystem ? 'map' : 'browser';
        summary += `<br><small>Data geïmporteerd in: <strong>${opslagType}</strong></small>`;
        
        summary += `</div>`;
        
        this.showSuccess(`${t('importComplete')}<br>${summary}`);
    }
    
    showSuccess(message) {
        this.hideProgress();
        
        const modalId = 'successModal-' + Date.now();
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-check-circle"></i> Succes</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();"></button>
                    </div>
                    <div class="modal-body">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const backdrop = document.createElement('div');
        backdrop.id = modalId + '-backdrop';
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
    }
    
    showError(message) {
        this.hideProgress();
        
        const modalId = 'errorModal-' + Date.now();
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title"><i class="bi bi-exclamation-triangle"></i> Fout</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();"></button>
                    </div>
                    <div class="modal-body">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const backdrop = document.createElement('div');
        backdrop.id = modalId + '-backdrop';
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
    }
    
    convertHondenToCSV(honden) {
        if (!honden || honden.length === 0) return '';
        
        const allHeaders = new Set(['id']);
        honden.forEach(hond => {
            Object.keys(hond).forEach(key => {
                if (typeof hond[key] !== 'object' && hond[key] !== null) {
                    allHeaders.add(key);
                }
            });
        });
        
        const headers = Array.from(allHeaders).sort();
        
        let csv = headers.join(';') + '\n';
        
        honden.forEach(hond => {
            const row = headers.map(header => {
                const value = hond[header];
                if (value === null || value === undefined || value === '') {
                    return '';
                }
                if (typeof value === 'string' && value.includes(';')) {
                    return `"${value}"`;
                }
                return String(value);
            });
            csv += row.join(';') + '\n';
        });
        
        return csv;
    }
    
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        if (lines.length < 2) return { honden: [] };
        
        const headers = lines[0].split(';').map(h => h.trim());
        const honden = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ';' && !inQuotes) {
                    values.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current);
            
            const hond = {};
            headers.forEach((header, index) => {
                if (values[index] !== undefined) {
                    let value = values[index];
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    hond[header] = value || null;
                }
            });
            
            if (hond.id || hond.stamboomnr || hond.naam) {
                honden.push(hond);
            }
        }
        
        return { honden };
    }
    
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    async loadDatabaseStats() {
        try {
            let stats = { totaalHonden: 0, totaalFotos: 0, totaalPriveInfo: 0 };
            
            if (this.isUsingFileSystem) {
                // Haal stats uit FileSystem
                if (this.dogCache.size === 0) {
                    await this.loadAllDogsFromFileSystem();
                }
                
                const honden = Array.from(this.dogCache.values())
                    .filter(hond => !hond.id || typeof hond.id !== 'string' || !hond.id.startsWith('stamboom_'));
                
                stats.totaalHonden = honden.length;
                
                // Tel foto's
                const allFiles = await storageManager.getAllFiles();
                stats.totaalFotos = allFiles.filter(f => f.name.startsWith('foto_')).length;
                stats.totaalPriveInfo = allFiles.filter(f => f.name.startsWith('prive_')).length;
                
            } else {
                // Haal stats uit database
                const db = await this.ensureDatabase();
                
                if (typeof db.getStatistieken !== 'function') {
                    console.error('getStatistieken functie niet beschikbaar');
                    return;
                }
                
                stats = await db.getStatistieken();
            }
            
            const hondenElement = document.getElementById('statsHonden');
            const fotosElement = document.getElementById('statsFotos');
            const priveElement = document.getElementById('statsPrive');
            
            if (hondenElement) hondenElement.textContent = stats.totaalHonden || 0;
            if (fotosElement) fotosElement.textContent = stats.totaalFotos || 0;
            if (priveElement) priveElement.textContent = stats.totaalPriveInfo || 0;
            
        } catch (error) {
            console.error(`${this.t('statsError')}${error}`);
        }
    }
}

// Maak DataManager globaal beschikbaar
if (!window.dataManager) {
    window.dataManager = new DataManager();
}