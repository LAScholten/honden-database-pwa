/**
 * Data Management Module
 * Beheert import/export en database operaties
 */

class DataManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = {
            nl: {
                // Card titels
                dataManagement: "Data Beheer",
                loggedInAs: "Ingelogd als",
                administrator: "Administrator",
                user: "Gebruiker",
                adminFullRights: "U kunt nieuwe honden toevoegen en alle data beheren.",
                userLimitedRights: "U kunt alle data importeren/exporteren en bestaande honden bijwerken, maar geen nieuwe honden toevoegen.",
                
                // Import sectie
                dataImport: "Data Importeren",
                importDescription: "Importeer data uit een eerder geëxporteerd JSON bestand.",
                selectJsonFile: "Selecteer JSON bestand",
                chooseExportedFile: "Kies een bestand dat eerder is geëxporteerd uit deze applicatie",
                importStrategy: "Import strategie",
                mergeExisting: "Samenvoegen met bestaande data",
                replaceAll: "Vervang alle bestaande data",
                updateOnly: "Alleen bestaande records bijwerken",
                importDogs: "Honden importeren",
                importPhotos: "Foto's importeren",
                importPrivateInfo: "Privé informatie importeren",
                adminOnlyPrivate: "Alleen admin kan privé info importeren",
                startImport: "Start Import",
                
                // Export sectie
                dataExport: "Data Exporteren",
                exportDescription: "Exporteer data naar een JSON bestand voor backup of delen.",
                exportType: "Export type",
                completeBackup: "Complete backup (alles)",
                dogsOnly: "Alleen honden data",
                photosOnly: "Alleen foto metadata",
                privateOnly: "Alleen privé informatie",
                customSelection: "Zelf selecteren...",
                dogsData: "Honden data",
                photosMetadata: "Foto metadata",
                privateInformation: "Privé informatie",
                exportFormat: "Export formaat",
                jsonRecommended: "JSON (aanbevolen)",
                csvDogsOnly: "CSV (alleen honden data)",
                startExport: "Start Export",
                
                // Statistieken
                databaseStatistics: "Database Statistieken",
                dogs: "Honden",
                photos: "Foto's",
                privateRecords: "Privé records",
                
                // Alerts en messages
                selectFileFirst: "Selecteer eerst een JSON bestand om te importeren",
                fileReadError: "Fout bij lezen bestand",
                importFailed: "Import mislukt: ",
                importComplete: "Import voltooid!",
                newDogsAdded: "nieuwe honden toegevoegd",
                dogsUpdated: "honden bijgewerkt",
                photosImported: "foto's geïmporteerd",
                privateUpdated: "privé records bijgewerkt",
                exportingData: "Data exporteren...",
                exportSuccess: "Export succesvol voltooid!",
                exportFailed: "Export mislukt: ",
                customExportSuccess: "Aangepaste export succesvol voltooid!",
                loadingStats: "Laden statistieken...",
                statsError: "Fout bij laden statistieken: "
            },
            en: {
                // Card titles
                dataManagement: "Data Management",
                loggedInAs: "Logged in as",
                administrator: "Administrator",
                user: "User",
                adminFullRights: "You can add new dogs and manage all data.",
                userLimitedRights: "You can import/export all data and update existing dogs, but cannot add new dogs.",
                
                // Import section
                dataImport: "Data Import",
                importDescription: "Import data from a previously exported JSON file.",
                selectJsonFile: "Select JSON file",
                chooseExportedFile: "Choose a file previously exported from this application",
                importStrategy: "Import strategy",
                mergeExisting: "Merge with existing data",
                replaceAll: "Replace all existing data",
                updateOnly: "Update existing records only",
                importDogs: "Import dogs",
                importPhotos: "Import photos",
                importPrivateInfo: "Import private information",
                adminOnlyPrivate: "Only admin can import private info",
                startImport: "Start Import",
                
                // Export section
                dataExport: "Data Export",
                exportDescription: "Export data to a JSON file for backup or sharing.",
                exportType: "Export type",
                completeBackup: "Complete backup (everything)",
                dogsOnly: "Dogs data only",
                photosOnly: "Photos metadata only",
                privateOnly: "Private information only",
                customSelection: "Custom selection...",
                dogsData: "Dogs data",
                photosMetadata: "Photos metadata",
                privateInformation: "Private information",
                exportFormat: "Export format",
                jsonRecommended: "JSON (recommended)",
                csvDogsOnly: "CSV (dogs data only)",
                startExport: "Start Export",
                
                // Statistics
                databaseStatistics: "Database Statistics",
                dogs: "Dogs",
                photos: "Photos",
                privateRecords: "Private records",
                
                // Alerts and messages
                selectFileFirst: "Select a JSON file first to import",
                fileReadError: "Error reading file",
                importFailed: "Import failed: ",
                importComplete: "Import complete!",
                newDogsAdded: "new dogs added",
                dogsUpdated: "dogs updated",
                photosImported: "photos imported",
                privateUpdated: "private records updated",
                exportingData: "Exporting data...",
                exportSuccess: "Export successful!",
                exportFailed: "Export failed: ",
                customExportSuccess: "Custom export successful!",
                loadingStats: "Loading statistics...",
                statsError: "Error loading statistics: "
            },
            de: {
                // Card Titel
                dataManagement: "Datenverwaltung",
                loggedInAs: "Eingeloggt als",
                administrator: "Administrator",
                user: "Benutzer",
                adminFullRights: "Sie können neue Hunde hinzufügen und alle Daten verwalten.",
                userLimitedRights: "Sie können alle Daten importieren/exportieren und bestehende Hunde aktualisieren, aber keine neuen Hunde hinzufügen.",
                
                // Import Bereich
                dataImport: "Daten Import",
                importDescription: "Importieren Sie Daten aus einer zuvor exportierten JSON-Datei.",
                selectJsonFile: "JSON-Datei auswählen",
                chooseExportedFile: "Wählen Sie eine zuvor aus dieser Anwendung exportierte Datei",
                importStrategy: "Importstrategie",
                mergeExisting: "Mit vorhandenen Daten zusammenführen",
                replaceAll: "Alle vorhandenen Daten ersetzen",
                updateOnly: "Nur vorhandene Datensätze aktualisieren",
                importDogs: "Hunde importieren",
                importPhotos: "Fotos importieren",
                importPrivateInfo: "Private Informationen importieren",
                adminOnlyPrivate: "Nur Admin kann private Info importieren",
                startImport: "Import starten",
                
                // Export Bereich
                dataExport: "Daten Export",
                exportDescription: "Exportieren Sie Daten in eine JSON-Datei für Backup oder Freigabe.",
                exportType: "Exporttyp",
                completeBackup: "Komplettes Backup (alles)",
                dogsOnly: "Nur Hunde-Daten",
                photosOnly: "Nur Foto-Metadaten",
                privateOnly: "Nur private Informationen",
                customSelection: "Eigene Auswahl...",
                dogsData: "Hunde-Daten",
                photosMetadata: "Foto-Metadaten",
                privateInformation: "Private Informationen",
                exportFormat: "Exportformat",
                jsonRecommended: "JSON (empfohlen)",
                csvDogsOnly: "CSV (nur Hunde-Daten)",
                startExport: "Export starten",
                
                // Statistiken
                databaseStatistics: "Datenbank Statistiken",
                dogs: "Hunde",
                photos: "Fotos",
                privateRecords: "Private Datensätze",
                
                // Meldungen
                selectFileFirst: "Wählen Sie zuerst eine JSON-Datei zum Importieren",
                fileReadError: "Fehler beim Lesen der Datei",
                importFailed: "Import fehlgeschlagen: ",
                importComplete: "Import abgeschlossen!",
                newDogsAdded: "neue Hunde hinzugefügt",
                dogsUpdated: "Hunde aktualisiert",
                photosImported: "Fotos importiert",
                privateUpdated: "private Datensätze aktualisiert",
                exportingData: "Daten exportieren...",
                exportSuccess: "Export erfolgreich!",
                exportFailed: "Export fehlgeschlagen: ",
                customExportSuccess: "Benutzerdefinierter Export erfolgreich!",
                loadingStats: "Lade Statistiken...",
                statsError: "Fehler beim Laden der Statistiken: "
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        // Herlaad UI als nodig
        if (document.getElementById('dataManagementModal')) {
            this.loadDatabaseStats();
        }
    }
    
    getModalHTML() {
        const isAdmin = this.auth.isAdmin();
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="dataManagementModal" tabindex="-1" aria-labelledby="dataManagementModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="dataManagementModalLabel">
                                <i class="bi bi-database-gear"></i> ${t('dataManagement')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert ${isAdmin ? 'alert-info' : 'alert-warning'} mb-4">
                                <div class="d-flex">
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-${isAdmin ? 'shield-check' : 'person'} fs-4"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <h6 class="alert-heading">${t('loggedInAs')} ${isAdmin ? t('administrator') : t('user')}</h6>
                                        ${isAdmin ? t('adminFullRights') : t('userLimitedRights')}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
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
                                                <input class="form-control" type="file" id="importFile" accept=".json">
                                                <div class="form-text">
                                                    ${t('chooseExportedFile')}
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label for="importStrategy" class="form-label">${t('importStrategy')}</label>
                                                <select class="form-select" id="importStrategy">
                                                    <option value="merge" selected>${t('mergeExisting')}</option>
                                                    ${isAdmin ? `<option value="replace">${t('replaceAll')}</option>` : ''}
                                                    <option value="update">${t('updateOnly')}</option>
                                                </select>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="importHonden" checked>
                                                    <label class="form-check-label" for="importHonden">
                                                        ${t('importDogs')}
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="importFotos" checked>
                                                    <label class="form-check-label" for="importFotos">
                                                        ${t('importPhotos')}
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="importPriveInfo" ${isAdmin ? 'checked' : ''}>
                                                    <label class="form-check-label" for="importPriveInfo">
                                                        ${t('importPrivateInfo')}
                                                    </label>
                                                    ${!isAdmin ? `<div class="form-text">${t('adminOnlyPrivate')}</div>` : ''}
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
                                            
                                            <div class="mb-3">
                                                <label for="exportType" class="form-label">${t('exportType')}</label>
                                                <select class="form-select" id="exportType">
                                                    <option value="all" selected>${t('completeBackup')}</option>
                                                    <option value="honden">${t('dogsOnly')}</option>
                                                    <option value="fotos">${t('photosOnly')}</option>
                                                    ${isAdmin ? `<option value="prive">${t('privateOnly')}</option>` : ''}
                                                    <option value="selectie">${t('customSelection')}</option>
                                                </select>
                                            </div>
                                            
                                            <div id="exportSelectionOptions" style="display: none;">
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportHondenSelect" checked>
                                                        <label class="form-check-label" for="exportHondenSelect">
                                                            ${t('dogsData')}
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportFotosSelect" checked>
                                                        <label class="form-check-label" for="exportFotosSelect">
                                                            ${t('photosMetadata')}
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportPriveSelect" ${isAdmin ? 'checked' : ''}>
                                                        <label class="form-check-label" for="exportPriveSelect">
                                                            ${t('privateInformation')}
                                                        </label>
                                                        ${!isAdmin ? `<div class="form-text">${t('adminOnlyPrivate')}</div>` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label for="exportFormat" class="form-label">${t('exportFormat')}</label>
                                                <select class="form-select" id="exportFormat">
                                                    <option value="json" selected>${t('jsonRecommended')}</option>
                                                    <option value="csv">${t('csvDogsOnly')}</option>
                                                </select>
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
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        // Export type selector
        const exportTypeSelect = document.getElementById('exportType');
        if (exportTypeSelect) {
            exportTypeSelect.addEventListener('change', (e) => {
                const showSelection = e.target.value === 'selectie';
                const optionsDiv = document.getElementById('exportSelectionOptions');
                if (optionsDiv) {
                    optionsDiv.style.display = showSelection ? 'block' : 'none';
                }
            });
        }
        
        // Start import
        const importBtn = document.getElementById('startImportBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.handleImport();
            });
        }
        
        // Start export
        const exportBtn = document.getElementById('startExportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.handleExport();
            });
        }
    }
    
    async handleImport() {
        const fileInput = document.getElementById('importFile');
        const strategy = document.getElementById('importStrategy').value;
        const importHonden = document.getElementById('importHonden').checked;
        const importFotos = document.getElementById('importFotos').checked;
        const importPriveInfo = document.getElementById('importPriveInfo').checked;
        
        if (!fileInput || !fileInput.files.length) {
            this.showError(this.t('selectFileFirst'));
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                const filteredData = {};
                if (importHonden && importData.honden) filteredData.honden = importData.honden;
                if (importFotos && importData.fotos) filteredData.fotos = importData.fotos;
                if (importPriveInfo && importData.priveInfo) filteredData.priveInfo = importData.priveInfo;
                
                this.showProgress(this.t('importingData') || 'Data importeren...');
                
                const overschrijven = strategy === 'replace';
                const resultaat = await this.db.importData(filteredData, overschrijven);
                
                this.hideProgress();
                this.showSuccess(
                    `${this.t('importComplete')}<br>
                    ${resultaat.honden.toegevoegd} ${this.t('newDogsAdded')}<br>
                    ${resultaat.honden.bijgewerkt} ${this.t('dogsUpdated')}<br>
                    ${resultaat.fotos.toegevoegd} ${this.t('photosImported')}<br>
                    ${resultaat.priveInfo.bijgewerkt} ${this.t('privateUpdated')}`
                );
                
                await this.loadDatabaseStats();
                
            } catch (error) {
                this.hideProgress();
                this.showError(`${this.t('importFailed')}${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.showError(this.t('fileReadError'));
        };
        
        reader.readAsText(file);
    }
    
    async handleExport() {
        const exportType = document.getElementById('exportType').value;
        const exportFormat = document.getElementById('exportFormat').value;
        
        let type = exportType;
        if (exportType === 'selectie') {
            const exportHonden = document.getElementById('exportHondenSelect').checked;
            const exportFotos = document.getElementById('exportFotosSelect').checked;
            const exportPrive = document.getElementById('exportPriveSelect').checked;
            
            if (exportHonden && exportFotos && exportPrive) type = 'all';
            else if (exportHonden && !exportFotos && !exportPrive) type = 'honden';
            else if (!exportHonden && exportFotos && !exportPrive) type = 'fotos';
            else if (!exportHonden && !exportFotos && exportPrive) type = 'prive';
            else {
                await this.handleCustomExport(exportHonden, exportFotos, exportPrive, exportFormat);
                return;
            }
        }
        
        this.showProgress(this.t('exportingData'));
        
        try {
            const exportData = await this.db.exportData(type);
            
            let blob, filename;
            if (exportFormat === 'csv' && type === 'honden') {
                const csv = this.convertToCSV(exportData.honden);
                blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                filename = `honden-export-${new Date().toISOString().split('T')[0]}.csv`;
            } else {
                const jsonString = JSON.stringify(exportData, null, 2);
                blob = new Blob([jsonString], { type: 'application/json' });
                filename = `honden-export-${new Date().toISOString().split('T')[0]}.json`;
            }
            
            this.downloadFile(blob, filename);
            this.hideProgress();
            this.showSuccess(this.t('exportSuccess'));
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('exportFailed')}${error.message}`);
        }
    }
    
    async handleCustomExport(exportHonden, exportFotos, exportPrive, format) {
        this.showProgress(this.t('exportingData'));
        
        try {
            const exportData = {
                metadata: {
                    exportDatum: new Date().toISOString(),
                    exportDoor: this.auth.getCurrentUser()?.username || 'unknown',
                    type: 'custom'
                }
            };
            
            if (exportHonden) {
                exportData.honden = await this.db.getHonden();
            }
            if (exportFotos) {
                exportData.fotos = await this.db.getAllFotos();
            }
            if (exportPrive && this.auth.isAdmin()) {
                exportData.priveInfo = await this.db.getAllPriveInfo();
            }
            
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `honden-custom-export-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.hideProgress();
            this.showSuccess(this.t('customExportSuccess'));
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('exportFailed')}${error.message}`);
        }
    }
    
    async loadDatabaseStats() {
        try {
            const stats = await this.db.getStatistieken();
            
            const hondenElement = document.getElementById('statsHonden');
            const fotosElement = document.getElementById('statsFotos');
            const priveElement = document.getElementById('statsPrive');
            
            if (hondenElement) hondenElement.textContent = stats.totaalHonden;
            if (fotosElement) fotosElement.textContent = stats.totaalFotos;
            if (priveElement) priveElement.textContent = stats.totaalPriveInfo;
            
        } catch (error) {
            console.error(`${this.t('statsError')}${error}`);
        }
    }


if (typeof window !== 'undefined') {
    window.DataManager = DataManager;
}
