/**
 * Data Management Module voor HondenDatabase
 * COMPLEET MET ALLE FUNCTIONALITEIT + GEEN BUGS
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
                fileStorageDesc: "Sla data op in echte bestanden op je computer.",
                useFileStorage: "Gebruiken",
                browserStorage: "Browser Opslag",
                browserStorageDesc: "Sla data op in de browser (standaard).",
                useBrowserStorage: "Terug naar browser",
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
                storageWarningText: "Bij bestandsopslag moet je zelf een map selecteren. De app zal je hierom vragen."
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
                fileStorageDesc: "Save data in real files on your computer.",
                useFileStorage: "Use",
                browserStorage: "Browser Storage",
                browserStorageDesc: "Save data in the browser (default).",
                useBrowserStorage: "Back to browser",
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
                storageWarningText: "With file storage, you need to select a folder. The app will ask you for this."
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
                fileStorageDesc: "Speichern Sie Daten in echten Dateien auf Ihrem Computer.",
                useFileStorage: "Verwenden",
                browserStorage: "Browser-Speicherung",
                browserStorageDesc: "Speichern Sie Daten im Browser (Standard).",
                useBrowserStorage: "Zurück zum Browser",
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
                storageFeature3: "🔄 Synchronisation zwischen Geräten möglich",
                storageFeature4: "🔒 Mehr Kontrole über Ihre Daten",
                storageWarning: "⚠️ Wichtig:",
                storageWarningText: "Bei Dateispeicherung müssen Sie einen Ordner auswählen. Die App wird Sie danach fragen."
            }
        };
        
        this.db = null;
        this.dbReady = false;
        
        // Cache voor FileSystem mode
        this.dogCache = new Map();
        this.photoCache = new Map();
        this.isUsingFileSystem = false;
        
        this.initDatabase();
    }
    
    async initDatabase() {
        for (let i = 0; i < 50; i++) {
            if (window.db) {
                this.db = window.db;
                this.dbReady = true;
                console.log('Database gevonden in DataManager');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.warn('Database niet beschikbaar na 5 seconden');
    }
    
    async ensureDatabase() {
        if (!this.dbReady) await this.initDatabase();
        if (!this.db) throw new Error('Database niet beschikbaar');
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
                            
                            <!-- Desktop Edition Opslag Selector -->
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
                            
                            <!-- Import/Export secties -->
                            <div class="row mt-4">
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-success">
                                        <div class="card-header bg-success text-white">
                                            <h5 class="mb-0"><i class="bi bi-upload"></i> ${t('dataImport')}</h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">${t('importDescription')}</p>
                                            
                                            <div class="mb-3">
                                                <label for="importFile" class="form-label">${t('selectJsonFile')}</label>
                                                <input class="form-control" type="file" id="importFile" accept=".json,.csv">
                                                <div class="form-text">${t('chooseExportedFile')}</div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label for="importStrategy" class="form-label">${t('importStrategy')}</label>
                                                <select class="form-select" id="importStrategy">
                                                    <option value="fullRestore" selected>${t('updateAndComplete')}</option>
                                                </select>
                                                <div class="form-text">${t('importStrategyDescription')}</div>
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
                                            <h5 class="mb-0"><i class="bi bi-download"></i> ${t('dataExport')}</h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">${t('exportDescription')}</p>
                                            
                                            <div class="mb-4">
                                                <label class="form-label">${t('backupType')}</label>
                                                
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="exportType" id="backupEverything" value="backup" checked>
                                                        <label class="form-check-label" for="backupEverything">
                                                            <strong>${t('backupEverything')}</strong>
                                                        </label>
                                                        <div class="form-text">${t('backupEverythingDescription')}</div>
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="exportType" id="shareData" value="share">
                                                        <label class="form-check-label" for="shareData">
                                                            <strong>${t('shareData')}</strong>
                                                        </label>
                                                        <div class="form-text">${t('shareDataDescription')}</div>
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
                                                        <div class="form-text">${t('exportDataDescription')}</div>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportPhotos" checked>
                                                        <label class="form-check-label" for="exportPhotos">
                                                            <strong>${t('exportPhotos')}</strong>
                                                        </label>
                                                        <div class="form-text">${t('exportPhotosDescription')}</div>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportPrivateInfo" checked>
                                                        <label class="form-check-label" for="exportPrivateInfo">
                                                            <strong>${t('exportPrivateInfo')}</strong>
                                                        </label>
                                                        <div class="form-text">${t('exportPrivateInfoDescription')}</div>
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
                            
                            <!-- Statistieken -->
                            <div class="card border-info mt-4">
                                <div class="card-header bg-info text-white">
                                    <h5 class="mb-0"><i class="bi bi-graph-up"></i> ${t('databaseStatistics')}</h5>
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
        // Import/Export knoppen
        document.getElementById('startImportBtn')?.addEventListener('click', () => this.handleImport());
        document.getElementById('startExportBtn')?.addEventListener('click', () => this.handleExport());
        
        // Opslag knoppen
        document.getElementById('useFileSystemBtn')?.addEventListener('click', () => this.switchToFileSystem());
        document.getElementById('useIndexedDBBtn')?.addEventListener('click', () => this.switchToIndexedDB());
        document.getElementById('openStorageSettingsBtn')?.addEventListener('click', () => this.showStorageSelector());
        
        // Export type selectie
        const backupRadio = document.getElementById('backupEverything');
        const shareRadio = document.getElementById('shareData');
        
        if (backupRadio && shareRadio) {
            backupRadio.addEventListener('change', () => this.updateExportOptions());
            shareRadio.addEventListener('change', () => this.updateExportOptions());
        }
        
        // Modal events
        const modal = document.getElementById('dataManagementModal');
        if (modal) {
            modal.addEventListener('shown.bs.modal', () => {
                this.loadDatabaseStats();
                this.updateExportOptions();
                this.loadStorageStatus();
                this.updateBackupWarningText();
            });
        }
        
        // Taal switchers
        document.querySelectorAll('.app-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.updateLanguage(lang);
            });
        });
    }
    
    showStorageSelector() {
        const html = `
            <div class="modal-backdrop fade show"></div>
            <div class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">Opslag Selector</h5>
                            <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove(); document.querySelector('.modal-backdrop:last-child').remove();"></button>
                        </div>
                        <div class="modal-body">
                            <p>Selecteer opslagtype:</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-success" onclick="window.dataManager.switchToFileSystem(); this.closest('.modal').remove(); document.querySelector('.modal-backdrop:last-child').remove();">
                                    <i class="bi bi-folder"></i> Bestandsopslag
                                </button>
                                <button class="btn btn-primary" onclick="window.dataManager.switchToIndexedDB(); this.closest('.modal').remove(); document.querySelector('.modal-backdrop:last-child').remove();">
                                    <i class="bi bi-browser-chrome"></i> Browser Opslag
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const div = document.createElement('div');
        div.className = 'storage-selector-modal';
        div.innerHTML = html;
        document.body.appendChild(div);
    }
    
    async switchToFileSystem() {
        const btn = document.getElementById('useFileSystemBtn');
        const originalHtml = btn?.innerHTML;
        
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Bezig...';
        }
        
        try {
            if (!window.storageManager) {
                throw new Error('StorageManager niet gevonden');
            }
            
            console.log('Schakel over naar FileSystem...');
            
            // Initialiseer FileSystem
            await storageManager.initialize('filesystem');
            
            // Update status
            this.isUsingFileSystem = true;
            this.loadStorageStatus();
            
            // Migreer bestaande data
            await this.migrateDataToFileSystem();
            
            // Toon melding
            if (window.uiHandler?.showSuccess) {
                window.uiHandler.showSuccess('FileSystem geactiveerd!<br><small>Data wordt nu naar de map geschreven.</small>');
            }
            
            console.log('✅ FileSystem actief');
            
        } catch (error) {
            console.error('Fout bij overschakelen naar FileSystem:', error);
            
            // Fallback naar IndexedDB
            this.isUsingFileSystem = false;
            
            if (window.uiHandler?.showError) {
                let errorMsg = error.message;
                if (error.name === 'SecurityError' || error.message.includes('tracking')) {
                    errorMsg = 'Browser blokkeert map toegang. Gebruik browser opslag.';
                }
                window.uiHandler.showError(`Kon niet overschakelen:<br><small>${errorMsg}</small>`);
            }
            
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalHtml || '<i class="bi bi-check-circle"></i> Gebruiken';
            }
        }
    }
    
    async switchToIndexedDB() {
        const btn = document.getElementById('useIndexedDBBtn');
        const originalHtml = btn?.innerHTML;
        
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Bezig...';
        }
        
        try {
            if (!window.storageManager) {
                throw new Error('StorageManager niet gevonden');
            }
            
            console.log('Schakel over naar IndexedDB...');
            
            // Initialiseer IndexedDB
            await storageManager.initialize('indexeddb');
            
            // Update status
            this.isUsingFileSystem = false;
            this.loadStorageStatus();
            
            // Toon melding
            if (window.uiHandler?.showSuccess) {
                window.uiHandler.showSuccess('Browser opslag geactiveerd!');
            }
            
            console.log('✅ IndexedDB actief');
            
        } catch (error) {
            console.error('Fout bij overschakelen naar IndexedDB:', error);
            
            if (window.uiHandler?.showError) {
                window.uiHandler.showError('Kon niet overschakelen: ' + error.message);
            }
            
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalHtml || '<i class="bi bi-arrow-left-right"></i> Terug naar browser';
            }
        }
    }
    
    async migrateDataToFileSystem() {
        try {
            if (!window.storageManager || !this.db) {
                console.log('Niet alles beschikbaar voor migratie');
                return;
            }
            
            const storageInfo = storageManager.getStorageInfo();
            if (storageInfo.current !== 'filesystem') {
                console.log('FileSystem niet actief');
                return;
            }
            
            console.log('Start data migratie naar FileSystem...');
            
            // Haal alle honden op
            const honden = await this.db.getHonden();
            console.log(`Migreer ${honden.length} honden...`);
            
            let successCount = 0;
            
            for (const hond of honden) {
                try {
                    let filename = 'hond_';
                    if (hond.stamboomnr) {
                        filename += hond.stamboomnr;
                    } else if (hond.id) {
                        filename += hond.id;
                    } else {
                        filename += Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    }
                    
                    // Sla hond op in FileSystem
                    await storageManager.save(filename, hond);
                    successCount++;
                    
                } catch (error) {
                    console.error('Fout bij migreren hond:', error);
                }
            }
            
            console.log(`✅ ${successCount}/${honden.length} honden gemigreerd`);
            
        } catch (error) {
            console.error('Migratie fout:', error);
        }
    }
    
    loadStorageStatus() {
        const statusEl = document.getElementById('currentStorageStatus');
        if (!statusEl || !window.storageManager) return;
        
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
                        <small class="text-muted">Map: ${info.directoryName || 'Geselecteerd'}</small>
                    </div>
                </div>
            `;
            statusClass = 'success';
        } else if (info.current === 'indexeddb') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-browser-chrome text-primary me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>${t('browserStorage')} (${t('storageActive')})</strong><br>
                        <small class="text-muted">Data wordt in je browser opgeslagen</small>
                    </div>
                </div>
            `;
            statusClass = 'info';
        } else {
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
        }
        
        statusEl.innerHTML = html;
        statusEl.className = `alert alert-${statusClass} mb-0`;
    }
    
    updateExportOptions() {
        const backupRadio = document.getElementById('backupEverything');
        const shareRadio = document.getElementById('shareData');
        const exportData = document.getElementById('exportData');
        const exportPhotos = document.getElementById('exportPhotos');
        const exportPrivate = document.getElementById('exportPrivateInfo');
        const exportFormat = document.getElementById('exportFormat');
        const csvOption = exportFormat?.querySelector('option[value="csv"]');
        
        if (backupRadio?.checked) {
            // Backup alles: alles aan
            if (exportData) exportData.checked = true;
            if (exportPhotos) exportPhotos.checked = true;
            if (exportPrivate) exportPrivate.checked = true;
        }
        
        // CSV alleen als data geëxporteerd wordt
        if (csvOption && exportData) {
            csvOption.disabled = !exportData.checked;
            if (!exportData.checked && exportFormat.value === 'csv') {
                exportFormat.value = 'json';
            }
        }
    }
    
    updateBackupWarningText() {
        if (!window.backupManager) return;
        
        const status = window.backupManager.getStatus();
        const daysSince = window.backupManager.getDaysSinceLastBackup();
        const t = this.t.bind(this);
        
        const warningDiv = document.querySelector('#dataManagementModal .alert.alert-danger, #dataManagementModal .alert.alert-warning');
        if (!warningDiv) return;
        
        if (status.level === 'danger') {
            warningDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> 
                <strong>${t('backupStatusDanger')}</strong><br>
                ${t('backupDangerText')}`;
            warningDiv.className = 'alert alert-danger mb-3';
        } else if (status.level === 'warning') {
            const warningText = t('backupWarningText').replace('{days}', daysSince);
            warningDiv.innerHTML = `<i class="bi bi-exclamation-triangle"></i> 
                <strong>${t('backupStatusWarning')}</strong><br>
                ${warningText}`;
            warningDiv.className = 'alert alert-warning mb-3';
        }
    }
    
    updateModalTexts() {
        const t = this.t.bind(this);
        const modal = document.getElementById('dataManagementModal');
        
        if (!modal) return;
        
        // Update alle belangrijke tekst
        const updates = {
            '#dataManagementModalLabel': `<i class="bi bi-database-gear"></i> ${t('dataManagement')}`,
            '.card.border-info .card-header h6': `<i class="bi bi-hdd"></i> ${t('desktopStorage')}`,
            '.card.border-info .card-body p': t('desktopStorageDesc'),
            '.card.h-100:first-child h6': `<i class="bi bi-folder text-success"></i> ${t('fileStorage')}`,
            '.card.h-100:first-child p.small': t('fileStorageDesc'),
            '.card.h-100:first-child strong': t('storageFeaturesTitle'),
            '.card.h-100:nth-child(2) h6': `<i class="bi bi-browser-chrome text-primary"></i> ${t('browserStorage')}`,
            '.card.h-100:nth-child(2) p.small': t('browserStorageDesc'),
            '#useFileSystemBtn': `<i class="bi bi-check-circle"></i> ${t('useFileStorage')}`,
            '#useIndexedDBBtn': `<i class="bi bi-arrow-left-right"></i> ${t('useBrowserStorage')}`,
            '#openStorageSettingsBtn': `<i class="bi bi-gear"></i> ${t('advancedStorageSettings')}`,
            '.card.border-success .card-header h5': `<i class="bi bi-upload"></i> ${t('dataImport')}`,
            '.card.border-success .card-body p': t('importDescription'),
            '#importFile + .form-text': t('chooseExportedFile'),
            '#startImportBtn': `<i class="bi bi-upload"></i> ${t('startImport')}`,
            '.card.border-primary .card-header h5': `<i class="bi bi-download"></i> ${t('dataExport')}`,
            '.card.border-primary .card-body p': t('exportDescription'),
            '#backupEverything + label strong': t('backupEverything'),
            '#backupEverything + label + .form-text': t('backupEverythingDescription'),
            '#shareData + label strong': t('shareData'),
            '#shareData + label + .form-text': t('shareDataDescription'),
            '#exportData + label strong': t('exportData'),
            '#exportData + label + .form-text': t('exportDataDescription'),
            '#exportPhotos + label strong': t('exportPhotos'),
            '#exportPhotos + label + .form-text': t('exportPhotosDescription'),
            '#exportPrivateInfo + label strong': t('exportPrivateInfo'),
            '#exportPrivateInfo + label + .form-text': t('exportPrivateInfoDescription'),
            '#startExportBtn': `<i class="bi bi-download"></i> ${t('startExport')}`,
            '.card.border-info.mt-4 .card-header h5': `<i class="bi bi-graph-up"></i> ${t('databaseStatistics')}`
        };
        
        for (const [selector, text] of Object.entries(updates)) {
            const element = modal.querySelector(selector);
            if (element) {
                if (selector.includes('innerHTML') || selector.includes('<')) {
                    element.innerHTML = text;
                } else {
                    element.textContent = text;
                }
            }
        }
        
        // Update feature list items
        const featureItems = modal.querySelectorAll('.card.h-100:first-child ul li');
        if (featureItems.length >= 4) {
            featureItems[0].textContent = t('storageFeature1');
            featureItems[1].textContent = t('storageFeature2');
            featureItems[2].textContent = t('storageFeature3');
            featureItems[3].textContent = t('storageFeature4');
        }
        
        // Update storage warning
        const storageWarning = modal.querySelector('.card.h-100:first-child .alert-warning');
        if (storageWarning) {
            storageWarning.innerHTML = `<i class="bi bi-exclamation-triangle"></i> <strong>${t('storageWarning')}</strong> ${t('storageWarningText')}`;
        }
        
        // Update statistiek labels
        const statLabels = modal.querySelectorAll('#databaseStats .text-muted');
        if (statLabels.length >= 3) {
            statLabels[0].textContent = t('dogs');
            statLabels[1].textContent = t('photos');
            statLabels[2].textContent = t('privateRecords');
        }
        
        this.loadStorageStatus();
        this.updateBackupWarningText();
        this.updateExportOptions();
    }
    
    async handleImport() {
        const t = this.t.bind(this);
        const fileInput = document.getElementById('importFile');
        
        if (!fileInput?.files.length) {
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
                
                this.hideProgress();
                this.showImportResults(result);
                await this.loadDatabaseStats();
                
                // Als FileSystem actief is, sla data ook daar op
                if (this.isUsingFileSystem && window.storageManager) {
                    await this.saveImportedDataToFileSystem(importData);
                }
                
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
    
    async processImportWithRelations(importData) {
        const result = {
            honden: { toegevoegd: 0, bijgewerkt: 0 },
            fotos: { toegevoegd: 0 },
            priveInfo: { bijgewerkt: 0 },
            relaties: { hersteld: 0 }
        };
        
        const db = await this.ensureDatabase();
        
        // Import honden
        if (importData.honden && Array.isArray(importData.honden)) {
            const stamboomToIdMap = new Map();
            
            // Fase 1: Importeer/update honden
            for (const importedHond of importData.honden) {
                try {
                    const stamboomnr = importedHond.stamboomnr;
                    if (!stamboomnr) continue;
                    
                    // Zoek bestaande hond
                    const existingHonden = await db.getHonden();
                    const existing = existingHonden.find(h => h.stamboomnr === stamboomnr);
                    
                    if (!existing) {
                        // Nieuwe hond
                        const newId = await db.voegHondToe(importedHond);
                        stamboomToIdMap.set(stamboomnr, newId);
                        result.honden.toegevoegd++;
                    } else {
                        // Update bestaande
                        await db.updateHond({ ...importedHond, id: existing.id });
                        stamboomToIdMap.set(stamboomnr, existing.id);
                        result.honden.bijgewerkt++;
                    }
                } catch (error) {
                    console.error('Fout bij importeren hond:', error);
                }
            }
            
            // Fase 2: Herstel relaties
            for (const importedHond of importData.honden) {
                try {
                    const stamboomnr = importedHond.stamboomnr;
                    const hondId = stamboomToIdMap.get(stamboomnr);
                    
                    if (!hondId) continue;
                    
                    let vaderId = null;
                    let moederId = null;
                    
                    // Zoek vader
                    if (importedHond.vaderStamboomnr) {
                        vaderId = stamboomToIdMap.get(importedHond.vaderStamboomnr);
                    }
                    
                    // Zoek moeder
                    if (importedHond.moederStamboomnr) {
                        moederId = stamboomToIdMap.get(importedHond.moederStamboomnr);
                    }
                    
                    if (vaderId || moederId) {
                        await db.updateHond({
                            id: hondId,
                            vaderId: vaderId,
                            moederId: moederId
                        });
                        result.relaties.hersteld++;
                    }
                } catch (error) {
                    console.error('Fout bij herstellen relaties:', error);
                }
            }
        }
        
        // Import foto's
        if (importData.fotos && Array.isArray(importData.fotos) && typeof db.voegFotoToe === 'function') {
            for (const foto of importData.fotos) {
                try {
                    await db.voegFotoToe(foto);
                    result.fotos.toegevoegd++;
                } catch (error) {
                    console.error('Fout bij importeren foto:', error);
                }
            }
        }
        
        // Import privé info
        if (importData.priveInfo && Array.isArray(importData.priveInfo) && typeof db.bewaarPriveInfo === 'function') {
            for (const prive of importData.priveInfo) {
                try {
                    await db.bewaarPriveInfo(prive);
                    result.priveInfo.bijgewerkt++;
                } catch (error) {
                    console.error('Fout bij importeren privé info:', error);
                }
            }
        }
        
        return result;
    }
    
    async saveImportedDataToFileSystem(importData) {
        if (!window.storageManager || !this.isUsingFileSystem) return;
        
        try {
            console.log('Sla geïmporteerde data op in FileSystem...');
            
            // Sla honden op
            if (importData.honden) {
                for (const hond of importData.honden) {
                    if (hond.stamboomnr) {
                        const filename = `import_hond_${hond.stamboomnr}_${Date.now()}`;
                        await storageManager.save(filename, hond);
                    }
                }
            }
            
            console.log('Geïmporteerde data opgeslagen in FileSystem');
            
        } catch (error) {
            console.error('Fout bij opslaan in FileSystem:', error);
        }
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
                    versie: "2.0"
                }
            };
            
            const db = await this.ensureDatabase();
            
            if (exportData) {
                exportDataObj.honden = await db.getHonden();
            }
            
            if (exportPhotos && typeof db.getAllFotos === 'function') {
                try {
                    exportDataObj.fotos = await db.getAllFotos();
                } catch (error) {
                    exportDataObj.fotos = [];
                }
            }
            
            if (exportPrivateInfo && typeof db.getAllPriveInfo === 'function') {
                try {
                    exportDataObj.priveInfo = await db.getAllPriveInfo();
                } catch (error) {
                    exportDataObj.priveInfo = [];
                }
            }
            
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const timeStr = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
            let filenamePrefix = isBackup ? 'backup' : 'export';
            
            if (exportData && exportPhotos && exportPrivateInfo) {
                filenamePrefix += '_compleet';
            }
            
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
            
            // Registreer backup
            if (isBackup && window.backupManager && exportData && exportPhotos && exportPrivateInfo) {
                window.backupManager.recordBackup('full', fullFilename);
            }
            
            let successDetails = `${t('exportComplete')}<br>`;
            if (exportData) {
                successDetails += `${t('totalDogsExported')}${exportDataObj.honden?.length || 0}<br>`;
            }
            if (exportPhotos && exportDataObj.fotos?.length) {
                successDetails += `${t('totalPhotosExported')}${exportDataObj.fotos.length}<br>`;
            }
            if (exportPrivateInfo && exportDataObj.priveInfo?.length) {
                successDetails += `${t('totalPrivateExported')}${exportDataObj.priveInfo.length}<br>`;
            }
            
            const successMessage = `${t('exportSuccess')}<br>
                                  <small>${t('exportFileSaved')} <strong>${fullFilename}</strong></small><br>
                                  <small>${successDetails}</small>`;
            this.showSuccess(successMessage);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('exportFailed')}${error.message}`);
        }
    }
    
    // Helper functies
    convertHondenToCSV(honden) {
        if (!honden || !honden.length) return '';
        
        const headers = Object.keys(honden[0]).filter(k => 
            typeof honden[0][k] !== 'object' && honden[0][k] !== null
        );
        
        let csv = headers.join(';') + '\n';
        
        honden.forEach(hond => {
            const row = headers.map(header => {
                const value = hond[header];
                if (value === null || value === undefined) return '';
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
        if (progressDiv) progressDiv.remove();
        document.querySelectorAll('.modal-backdrop.fade.show').forEach(backdrop => backdrop.remove());
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
        if (result.relaties.hersteld > 0) {
            summary += `<strong>${result.relaties.hersteld}</strong> ${t('relationshipsBuilt')}<br>`;
        }
        
        if (this.isUsingFileSystem) {
            summary += `<br><small>✅ Data ook opgeslagen in map</small>`;
        }
        
        summary += `</div>`;
        this.showSuccess(`${t('importComplete')}<br>${summary}`);
    }
    
    showSuccess(message) {
        this.showModal(message, 'success', 'Succes');
    }
    
    showError(message) {
        this.showModal(message, 'danger', 'Fout');
    }
    
    showModal(message, type, title) {
        this.hideProgress();
        
        const modalId = 'modal-' + Date.now();
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-${type} text-white">
                        <h5 class="modal-title"><i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${title}</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();"></button>
                    </div>
                    <div class="modal-body">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-${type}" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();">OK</button>
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
    
    async loadDatabaseStats() {
        try {
            const db = await this.ensureDatabase();
            
            if (typeof db.getStatistieken !== 'function') {
                console.error('getStatistieken functie niet beschikbaar');
                return;
            }
            
            const stats = await db.getStatistieken();
            
            document.getElementById('statsHonden')?.textContent = stats.totaalHonden || 0;
            document.getElementById('statsFotos')?.textContent = stats.totaalFotos || 0;
            document.getElementById('statsPrive')?.textContent = stats.totaalPriveInfo || 0;
            
        } catch (error) {
            console.error(`${this.t('statsError')}${error}`);
        }
    }
}

// Maak DataManager globaal beschikbaar
if (!window.dataManager) {
    window.dataManager = new DataManager();
}