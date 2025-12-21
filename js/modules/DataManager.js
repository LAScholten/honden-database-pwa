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
                exportSuccess: "Export succesvol voltooid!",
                exportFailed: "Export mislukt: ",
                exportFileSaved: "Bestand opgeslagen als: ",
                loadingStats: "Laden statistieken...",
                statsError: "Fout bij laden statistieken: ",
                nothingToExport: "Niets te exporteren - geen exportopties geselecteerd",
                error: "Fout"
            },
            en: {
                dataManagement: "Data Management",
                dataImport: "Data Import",
                importDescription: "Import data from a previously exported file.",
                selectJsonFile: "Select export file",
                chooseExportedFile: "Choose a file previously exported from this application",
                importStrategy: "Import strategy",
                importStrategyDescription: "Full restore: Restore all data from export",
                updateAndComplete: "Full restore",
                startImport: "Start Import",
                importingData: "Importing data...",
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
                databaseStatistics: "Database Statistics",
                dogs: "Dogs",
                photos: "Photos",
                privateRecords: "Private records",
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
            priveInfo: { toegevoegd: 0, bijgewerkt: 0 }
        };
        
        // SIMPELE LOGICA: Voeg alles toe uit de import
        // Dit zorgt ervoor dat verwijderde honden hersteld worden
        
        // 1. Importeer honden
        if (importData.honden && Array.isArray(importData.honden)) {
            for (const hond of importData.honden) {
                try {
                    // Probeer eerst de hond toe te voegen
                    await this.db.addHond(hond);
                    result.honden.toegevoegd++;
                } catch (addError) {
                    // Als toevoegen faalt, probeer dan te updaten
                    try {
                        await this.db.updateHond(hond);
                        result.honden.bijgewerkt++;
                    } catch (updateError) {
                        // Als update faalt, probeer save (werkt vaak voor beide)
                        try {
                            await this.db.saveHond(hond);
                            result.honden.bijgewerkt++;
                        } catch (saveError) {
                            console.error(`Kon hond ${hond.id} niet importeren:`, saveError);
                        }
                    }
                }
            }
        }
        
        // 2. Importeer foto's
        if (importData.fotos && Array.isArray(importData.fotos)) {
            for (const foto of importData.fotos) {
                try {
                    await this.db.addFoto(foto);
                    result.fotos.toegevoegd++;
                } catch (error) {
                    // Foto bestaat mogelijk al, sla over
                    console.log(`Foto ${foto.id} bestaat al of kan niet worden toegevoegd`);
                }
            }
        }
        
        // 3. Importeer privé info
        if (importData.priveInfo && Array.isArray(importData.priveInfo)) {
            for (const prive of importData.priveInfo) {
                try {
                    // Probeer toe te voegen
                    await this.db.addPriveInfo(prive);
                    result.priveInfo.toegevoegd++;
                } catch (addError) {
                    // Probeer te updaten
                    try {
                        await this.db.updatePriveInfo(prive);
                        result.priveInfo.bijgewerkt++;
                    } catch (updateError) {
                        console.error(`Kon privé info voor hond ${prive.hondId} niet importeren:`, updateError);
                    }
                }
            }
        }
        
        return result;
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
                    versie: "1.0"
                }
            };
            
            // SIMPELE LOGICA: Haal alles op wat beschikbaar is
            
            if (exportDataPhotos) {
                try {
                    exportData.honden = await this.db.getHonden();
                } catch (error) {
                    console.error('Kon honden niet ophalen:', error);
                    exportData.honden = [];
                }
                
                try {
                    exportData.fotos = await this.db.getFotos();
                } catch (error) {
                    console.error('Kon foto\'s niet ophalen:', error);
                    exportData.fotos = [];
                }
            }
            
            if (exportPrivateInfo) {
                // Veilige methode: probeer eerst getAllPriveInfo, anders per hond
                try {
                    exportData.priveInfo = await this.db.getAllPriveInfo();
                } catch (error) {
                    console.log('Kan niet alle privé info in één keer ophalen, probeer per hond...');
                    exportData.priveInfo = await this.getPriveInfoPerHond();
                }
            }
            
            // Genereer bestandsnaam
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
            
            if (exportFormat === 'csv' && exportDataPhotos && exportData.honden && exportData.honden.length > 0) {
                const csv = this.convertHondenToCSV(exportData.honden);
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
    
    async getPriveInfoPerHond() {
        const priveInfoArray = [];
        
        try {
            // Haal alle honden op
            const honden = await this.db.getHonden();
            
            // Voor elke hond, probeer privé info te krijgen
            for (const hond of honden) {
                try {
                    // Probeer verschillende methoden
                    let priveInfo;
                    
                    // Methode 1
                    if (typeof this.db.getPriveInfoByHondId === 'function') {
                        priveInfo = await this.db.getPriveInfoByHondId(hond.id);
                    } 
                    // Methode 2
                    else if (typeof this.db.getPriveInfo === 'function') {
                        priveInfo = await this.db.getPriveInfo(hond.id);
                    }
                    // Methode 3 - probeer gewoon de hond ID mee te geven
                    else if (typeof this.db.getPrivateInfo === 'function') {
                        priveInfo = await this.db.getPrivateInfo(hond.id);
                    }
                    
                    if (priveInfo) {
                        priveInfoArray.push(priveInfo);
                    }
                } catch (hondError) {
                    // Sla deze hond over
                    console.log(`Geen privé info voor hond ${hond.id}`);
                }
            }
        } catch (error) {
            console.error('Fout bij ophalen privé info per hond:', error);
        }
        
        return priveInfoArray;
    }
    
    convertHondenToCSV(honden) {
        if (!honden || honden.length === 0) return '';
        
        // Zoek alle mogelijke headers
        const allHeaders = [];
        honden.forEach(hond => {
            Object.keys(hond).forEach(key => {
                if (!allHeaders.includes(key) && key !== 'id') {
                    allHeaders.push(key);
                }
            });
        });
        
        // Sorteer headers
        allHeaders.sort();
        
        // Begin met ID
        const headers = ['id', ...allHeaders];
        
        // Maak CSV
        let csv = headers.join(';') + '\n';
        
        honden.forEach(hond => {
            const row = headers.map(header => {
                const value = hond[header];
                if (value === null || value === undefined) {
                    return '';
                }
                // Als het een string is met puntkomma, zet tussen aanhalingstekens
                if (typeof value === 'string' && value.includes(';')) {
                    return `"${value}"`;
                }
                // Converteer naar string
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
                    hond[header] = values[index] || null;
                }
            });
            
            if (hond.id) {
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
            let honden = [];
            let fotos = [];
            let priveCount = 0;
            
            try {
                honden = await this.db.getHonden() || [];
            } catch (e) {
                console.error('Kon honden niet ophalen voor stats:', e);
            }
            
            try {
                fotos = await this.db.getFotos() || [];
            } catch (e) {
                console.error('Kon foto\'s niet ophalen voor stats:', e);
            }
            
            // Probeer privé info te tellen
            if (honden.length > 0) {
                // Check eerste paar honden
                for (let i = 0; i < Math.min(3, honden.length); i++) {
                    try {
                        const prive = await this.db.getPriveInfoByHondId(honden[i].id);
                        if (prive) priveCount++;
                    } catch (e) {
                        // Doe niets
                    }
                }
                // Schatting maken
                priveCount = Math.round((priveCount / Math.min(3, honden.length)) * honden.length);
            }
            
            const hondenElement = document.getElementById('statsHonden');
            const fotosElement = document.getElementById('statsFotos');
            const priveElement = document.getElementById('statsPrive');
            
            if (hondenElement) hondenElement.textContent = honden.length;
            if (fotosElement) fotosElement.textContent = fotos.length;
            if (priveElement) priveElement.textContent = priveCount;
            
        } catch (error) {
            console.error(`${this.t('statsError')}${error}`);
        }
    }
    
    showImportResults(result) {
        let summary = `<h5>${this.t('importSummary')}</h5><div class="alert alert-success">`;
        
        if (result.honden.toegevoegd > 0) {
            summary += `<strong>${result.honden.toegevoegd}</strong> ${this.t('newDogsAdded')}<br>`;
        }
        if (result.honden.bijgewerkt > 0) {
            summary += `<strong>${result.honden.bijgewerkt}</strong> ${this.t('dogsUpdated')}<br>`;
        }
        if (result.fotos.toegevoegd > 0) {
            summary += `<strong>${result.fotos.toegevoegd}</strong> ${this.t('photosImported')}<br>`;
        }
        if (result.priveInfo.toegevoegd > 0 || result.priveInfo.bijgewerkt > 0) {
            const totalPrive = result.priveInfo.toegevoegd + result.priveInfo.bijgewerkt;
            summary += `<strong>${totalPrive}</strong> ${this.t('privateUpdated')}<br>`;
        }
        
        summary += `</div>`;
        
        this.showSuccess(`${this.t('importComplete')}<br>${summary}`);
    }
    
    showProgress(message) {
        // Eenvoudige progress indicator
        const progressHtml = `
            <div class="modal-backdrop fade show"></div>
            <div class="modal fade show" style="display: block;">
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
    }
    
    showSuccess(message) {
        alert(message.replace(/<br>/g, '\n').replace(/<[^>]*>/g, ''));
    }
    
    showError(message) {
        alert(message.replace(/<br>/g, '\n').replace(/<[^>]*>/g, ''));
    }
}