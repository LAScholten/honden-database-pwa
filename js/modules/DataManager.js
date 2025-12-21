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
                
                // Import sectie
                dataImport: "Data Importeren",
                importDescription: "Importeer data uit een eerder geëxporteerd bestand.",
                selectJsonFile: "Selecteer exportbestand",
                chooseExportedFile: "Kies een bestand dat eerder is geëxporteerd uit deze applicatie",
                importStrategy: "Import strategie",
                importStrategyDescription: "Bijwerken en aanvullen: Bestaande gegevens aanvullen, nieuwe gegevens toevoegen",
                updateAndComplete: "Bijwerken en aanvullen",
                startImport: "Start Import",
                importingData: "Data importeren...",
                
                // Export sectie
                dataExport: "Data Exporteren",
                exportDescription: "Exporteer data naar een bestand voor backup of delen.",
                exportOptions: "Export opties",
                exportDataPhotos: "Data en foto's exporteren",
                exportDataPhotosDescription: "Alle hondengegevens en foto metadata",
                exportPrivateInfo: "Privé informatie exporteren",
                exportPrivateInfoDescription: "Medische en financiële gegevens",
                exportFormat: "Export formaat",
                jsonFormat: "JSON (aanbevolen)",
                csvFormat: "CSV (alleen hondengegevens)",
                startExport: "Start Export",
                exportingData: "Data exporteren...",
                
                // Statistieken
                databaseStatistics: "Database Statistieken",
                dogs: "Honden",
                photos: "Foto's",
                privateRecords: "Privé records",
                
                // Alerts en messages
                selectFileFirst: "Selecteer eerst een bestand om te importeren",
                fileReadError: "Fout bij lezen bestand",
                importFailed: "Import mislukt: ",
                importComplete: "Import voltooid!",
                importSummary: "Import samenvatting",
                newDogsAdded: "Nieuwe honden toegevoegd",
                dogsUpdated: "Honden bijgewerkt",
                photosImported: "Foto's geïmporteerd",
                privateUpdated: "Privé records bijgewerkt",
                exportSuccess: "Export succesvol voltooid!",
                exportFailed: "Export mislukt: ",
                exportFileSaved: "Bestand opgeslagen als: ",
                loadingStats: "Laden statistieken...",
                statsError: "Fout bij laden statistieken: ",
                nothingToExport: "Niets te exporteren - geen exportopties geselecteerd",
                error: "Fout"
            },
            en: {
                // Card titles
                dataManagement: "Data Management",
                
                // Import section
                dataImport: "Data Import",
                importDescription: "Import data from a previously exported file.",
                selectJsonFile: "Select export file",
                chooseExportedFile: "Choose a file previously exported from this application",
                importStrategy: "Import strategy",
                importStrategyDescription: "Update and complete: Complete existing data, add new data",
                updateAndComplete: "Update and complete",
                startImport: "Start Import",
                importingData: "Importing data...",
                
                // Export section
                dataExport: "Data Export",
                exportDescription: "Export data to a file for backup or sharing.",
                exportOptions: "Export options",
                exportDataPhotos: "Export data and photos",
                exportDataPhotosDescription: "All dog data and photo metadata",
                exportPrivateInfo: "Export private information",
                exportPrivateInfoDescription: "Medical and financial data",
                exportFormat: "Export format",
                jsonFormat: "JSON (recommended)",
                csvFormat: "CSV (dog data only)",
                startExport: "Start Export",
                exportingData: "Exporting data...",
                
                // Statistics
                databaseStatistics: "Database Statistics",
                dogs: "Dogs",
                photos: "Photos",
                privateRecords: "Private records",
                
                // Alerts and messages
                selectFileFirst: "Select a file first to import",
                fileReadError: "Error reading file",
                importFailed: "Import failed: ",
                importComplete: "Import complete!",
                importSummary: "Import summary",
                newDogsAdded: "New dogs added",
                dogsUpdated: "Dogs updated",
                photosImported: "Photos imported",
                privateUpdated: "Private records updated",
                exportSuccess: "Export successful!",
                exportFailed: "Export failed: ",
                exportFileSaved: "File saved as: ",
                loadingStats: "Loading statistics...",
                statsError: "Error loading statistics: ",
                nothingToExport: "Nothing to export - no export options selected",
                error: "Error"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('dataManagementModal')) {
            this.loadDatabaseStats();
        }
    }
    
    getModalHTML() {
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
                                                <input class="form-control" type="file" id="importFile" accept=".json,.csv">
                                                <div class="form-text">
                                                    ${t('chooseExportedFile')}
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label for="importStrategy" class="form-label">${t('importStrategy')}</label>
                                                <select class="form-select" id="importStrategy">
                                                    <option value="updateComplete" selected>${t('updateAndComplete')}</option>
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
                                                <label class="form-label">${t('exportOptions')}</label>
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportDataPhotos" checked>
                                                        <label class="form-check-label" for="exportDataPhotos">
                                                            <strong>${t('exportDataPhotos')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('exportDataPhotosDescription')}
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
        
        if (!fileInput || !fileInput.files.length) {
            this.showError(this.t('selectFileFirst'));
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                this.showProgress(this.t('importingData'));
                
                let importData;
                if (file.name.endsWith('.csv')) {
                    importData = await this.parseCSV(e.target.result);
                } else {
                    importData = JSON.parse(e.target.result);
                }
                
                const result = await this.processImport(importData);
                
                this.hideProgress();
                this.showImportResults(result);
                
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
    
    async processImport(importData) {
        const result = {
            honden: { toegevoegd: 0, bijgewerkt: 0 },
            fotos: { toegevoegd: 0 },
            priveInfo: { bijgewerkt: 0 }
        };
        
        // Import honden data
        if (importData.honden) {
            for (const importedHond of importData.honden) {
                let existingHond;
                
                // Probeer verschillende methodes om hond op te halen
                try {
                    existingHond = await this.db.getHondById(importedHond.id);
                } catch (e1) {
                    try {
                        existingHond = await this.db.getHond(importedHond.id);
                    } catch (e2) {
                        try {
                            // Haal alle honden op en zoek de juiste
                            const allHonden = await this.db.getHonden();
                            existingHond = allHonden.find(h => h.id === importedHond.id);
                        } catch (e3) {
                            existingHond = null;
                        }
                    }
                }
                
                if (!existingHond) {
                    // Nieuwe hond toevoegen
                    try {
                        await this.db.addHond(importedHond);
                        result.honden.toegevoegd++;
                    } catch (e) {
                        try {
                            await this.db.saveHond(importedHond);
                            result.honden.toegevoegd++;
                        } catch (e2) {
                            console.error('Kon hond niet toevoegen:', importedHond.id, e2);
                        }
                    }
                } else {
                    // Bestaande hond bijwerken en aanvullen
                    const updatedHond = this.mergeHonden(existingHond, importedHond);
                    try {
                        await this.db.updateHond(updatedHond);
                        result.honden.bijgewerkt++;
                    } catch (e) {
                        try {
                            await this.db.saveHond(updatedHond);
                            result.honden.bijgewerkt++;
                        } catch (e2) {
                            console.error('Kon hond niet updaten:', updatedHond.id, e2);
                        }
                    }
                }
            }
        }
        
        // Import foto metadata
        if (importData.fotos) {
            for (const importedFoto of importData.fotos) {
                try {
                    // Probeer foto toe te voegen (niet controleren of hij al bestaat)
                    await this.db.addFoto(importedFoto);
                    result.fotos.toegevoegd++;
                } catch (e) {
                    try {
                        await this.db.saveFoto(importedFoto);
                        result.fotos.toegevoegd++;
                    } catch (e2) {
                        // Foto bestaat mogelijk al, sla over
                        console.log('Foto bestaat al of kan niet worden toegevoegd:', importedFoto.id);
                    }
                }
            }
        }
        
        // Import prive info
        if (importData.priveInfo) {
            for (const importedPrive of importData.priveInfo) {
                try {
                    // Probeer prive info bij te werken
                    const existingPrive = await this.db.getPriveInfoByHondId(importedPrive.hondId);
                    
                    if (existingPrive) {
                        const updatedPrive = this.mergePriveInfo(existingPrive, importedPrive);
                        await this.db.updatePriveInfo(updatedPrive);
                        result.priveInfo.bijgewerkt++;
                    }
                    // Als er geen bestaande prive info is, doen we niets (geen nieuwe toevoegen)
                } catch (e) {
                    // Prive info kan niet worden bijgewerkt, sla over
                    console.log('Kon prive info niet bijwerken voor hond:', importedPrive.hondId);
                }
            }
        }
        
        return result;
    }
    
    mergeHonden(existing, imported) {
        const merged = { ...existing };
        
        // Merge alle velden - alleen lege/ontbrekende velden aanvullen
        for (const key in imported) {
            if (imported.hasOwnProperty(key) && key !== 'id') {
                // Als het veld leeg is in bestaande maar gevuld in import, aanvullen
                if ((existing[key] === null || existing[key] === undefined || existing[key] === '') && 
                    imported[key] !== null && imported[key] !== undefined && imported[key] !== '') {
                    merged[key] = imported[key];
                }
                // Als het een object is (zoals gezondheidsinformatie), dieper mergen
                else if (typeof imported[key] === 'object' && imported[key] !== null) {
                    if (!existing[key] || typeof existing[key] !== 'object') {
                        merged[key] = imported[key];
                    } else {
                        merged[key] = this.deepMerge(existing[key], imported[key]);
                    }
                }
            }
        }
        
        return merged;
    }
    
    mergePriveInfo(existing, imported) {
        const merged = { ...existing };
        
        // Alleen lege velden aanvullen bij prive info
        for (const key in imported) {
            if (imported.hasOwnProperty(key) && key !== 'id' && key !== 'hondId') {
                if ((existing[key] === null || existing[key] === undefined || existing[key] === '') && 
                    imported[key] !== null && imported[key] !== undefined && imported[key] !== '') {
                    merged[key] = imported[key];
                }
            }
        }
        
        return merged;
    }
    
    deepMerge(target, source) {
        const output = { ...target };
        
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && 
                    target[key] && typeof target[key] === 'object') {
                    output[key] = this.deepMerge(target[key], source[key]);
                } else if (target[key] === null || target[key] === undefined || target[key] === '') {
                    output[key] = source[key];
                }
            }
        }
        
        return output;
    }
    
    showImportResults(result) {
        const summary = `
            <h5>${this.t('importSummary')}</h5>
            <div class="alert alert-success">
                <strong>${result.honden.toegevoegd}</strong> ${this.t('newDogsAdded')}<br>
                <strong>${result.honden.bijgewerkt}</strong> ${this.t('dogsUpdated')}<br>
                <strong>${result.fotos.toegevoegd}</strong> ${this.t('photosImported')}<br>
                <strong>${result.priveInfo.bijgewerkt}</strong> ${this.t('privateUpdated')}
            </div>
        `;
        
        this.showSuccess(`${this.t('importComplete')}<br>${summary}`);
    }
    
    async handleExport() {
        const exportDataPhotos = document.getElementById('exportDataPhotos').checked;
        const exportPrivateInfo = document.getElementById('exportPrivateInfo').checked;
        const exportFormat = document.getElementById('exportFormat').value;
        
        if (!exportDataPhotos && !exportPrivateInfo) {
            this.showError(this.t('nothingToExport'));
            return;
        }
        
        this.showProgress(this.t('exportingData'));
        
        try {
            const exportData = {
                metadata: {
                    exportDatum: new Date().toISOString(),
                    exportDoor: this.auth.getCurrentUser()?.username || 'unknown',
                    exportType: exportDataPhotos ? (exportPrivateInfo ? 'all' : 'dataPhotos') : 'privateOnly'
                }
            };
            
            if (exportDataPhotos) {
                // Haal honden data op
                try {
                    exportData.honden = await this.db.getHonden();
                } catch (e) {
                    console.error('Kon honden niet ophalen:', e);
                    exportData.honden = [];
                }
                
                // Haal foto metadata op
                try {
                    exportData.fotos = await this.db.getFotos();
                } catch (e) {
                    console.error('Kon foto\'s niet ophalen:', e);
                    exportData.fotos = [];
                }
            }
            
            if (exportPrivateInfo) {
                // Gebruik veilige methode om privé informatie op te halen
                exportData.priveInfo = await this.getPrivateInfoSafely();
            }
            
            // Genereer bestandsnaam op basis van export type
            const dateStr = new Date().toISOString().split('T')[0];
            let filename;
            
            if (exportDataPhotos && exportPrivateInfo) {
                filename = `honddataphotoprive_${dateStr}`;
            } else if (exportDataPhotos && !exportPrivateInfo) {
                filename = `honddataphoto_${dateStr}`;
            } else {
                filename = `hondprive_${dateStr}`;
            }
            
            let blob, fullFilename;
            
            if (exportFormat === 'csv' && exportDataPhotos) {
                const csv = this.convertHondenToCSV(exportData.honden || []);
                blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                fullFilename = `${filename}.csv`;
            } else {
                const jsonString = JSON.stringify(exportData, null, 2);
                blob = new Blob([jsonString], { type: 'application/json' });
                fullFilename = `${filename}.json`;
            }
            
            this.downloadFile(blob, fullFilename);
            this.hideProgress();
            
            const successMessage = `${this.t('exportSuccess')}<br>
                                  <small>${this.t('exportFileSaved')} <strong>${fullFilename}</strong></small>`;
            this.showSuccess(successMessage);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('exportFailed')}${error.message}`);
        }
    }
    
    async getPrivateInfoSafely() {
        const priveInfoArray = [];
        
        try {
            // Probeer eerst alle honden op te halen
            const honden = await this.db.getHonden();
            
            // Voor elke hond, probeer de privé info op te halen
            for (const hond of honden) {
                try {
                    // Probeer verschillende methodes
                    let priveInfo;
                    
                    // Methode 1: getPriveInfoByHondId
                    try {
                        priveInfo = await this.db.getPriveInfoByHondId(hond.id);
                    } catch (e1) {
                        // Methode 2: getPriveInfo (mogelijk met hondId parameter)
                        try {
                            priveInfo = await this.db.getPriveInfo(hond.id);
                        } catch (e2) {
                            // Methode 3: getPrivateInfo (Engelse naam)
                            try {
                                priveInfo = await this.db.getPrivateInfo(hond.id);
                            } catch (e3) {
                                // Geen privé info gevonden voor deze hond
                                priveInfo = null;
                            }
                        }
                    }
                    
                    if (priveInfo) {
                        priveInfoArray.push(priveInfo);
                    }
                } catch (hondError) {
                    console.warn(`Kon geen privé info vinden voor hond ${hond.id}:`, hondError.message);
                    // Ga door met de volgende hond
                }
            }
        } catch (error) {
            console.error('Fout bij ophalen honden voor privé info export:', error);
        }
        
        return priveInfoArray;
    }
    
    convertHondenToCSV(honden) {
        if (!honden || honden.length === 0) return '';
        
        // Verzamel alle unieke headers
        const headers = new Set(['id']);
        honden.forEach(hond => {
            Object.keys(hond).forEach(key => {
                // Sla complexe objecten over voor CSV
                if (typeof hond[key] !== 'object' || hond[key] === null) {
                    headers.add(key);
                }
            });
        });
        
        // Converteer naar array en sorteer
        const headersArray = Array.from(headers).sort();
        
        // Maak CSV header
        let csv = headersArray.join(';') + '\n';
        
        // Voeg rijen toe
        honden.forEach(hond => {
            const row = headersArray.map(header => {
                const value = hond[header];
                if (value === null || value === undefined) return '';
                
                // Escape strings met puntkomma's
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
            if (!lines[i].trim()) continue;
            
            const values = this.parseCSVLine(lines[i]);
            const hond = {};
            
            headers.forEach((header, index) => {
                if (values[index] !== undefined) {
                    hond[header] = values[index] === '' ? null : values[index];
                }
            });
            
            if (hond.id) {
                honden.push(hond);
            }
        }
        
        return { honden };
    }
    
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (char === ';' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
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
            let stats = {
                totaalHonden: 0,
                totaalFotos: 0,
                totaalPriveInfo: 0
            };
            
            try {
                // Tel honden
                const honden = await this.db.getHonden();
                stats.totaalHonden = honden ? honden.length : 0;
            } catch (e) {
                console.error('Kon honden niet tellen:', e);
            }
            
            try {
                // Tel foto's
                const fotos = await this.db.getFotos();
                stats.totaalFotos = fotos ? fotos.length : 0;
            } catch (e) {
                console.error('Kon foto\'s niet tellen:', e);
            }
            
            try {
                // Tel privé info (veilig)
                const honden = await this.db.getHonden();
                if (honden && honden.length > 0) {
                    let priveCount = 0;
                    for (const hond of honden.slice(0, 5)) { // Beperk tot 5 checks
                        try {
                            const prive = await this.db.getPriveInfoByHondId(hond.id);
                            if (prive) priveCount++;
                        } catch (e) {
                            // Doe niets, ga door
                        }
                    }
                    stats.totaalPriveInfo = priveCount;
                }
            } catch (e) {
                console.error('Kon privé info niet tellen:', e);
            }
            
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
    
    showProgress(message) {
        // Implementeer je progress modal/indicator
        console.log('Progress:', message);
    }
    
    hideProgress() {
        // Verberg progress indicator
        console.log('Hide progress');
    }
    
    showSuccess(message) {
        // Toon success message
        alert('Success: ' + message);
    }
    
    showError(message) {
        // Toon error message
        alert('Error: ' + message);
    }
}