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
                // Controleer of de functie getHond bestaat, anders gebruik getDogById of findHond
                let existingHond;
                
                if (typeof this.db.getHond === 'function') {
                    existingHond = await this.db.getHond(importedHond.id);
                } else if (typeof this.db.getDogById === 'function') {
                    existingHond = await this.db.getDogById(importedHond.id);
                } else if (typeof this.db.findHond === 'function') {
                    existingHond = await this.db.findHond(importedHond.id);
                } else {
                    // Probeer de eerste beschikbare methode
                    existingHond = await this.db.getDog(importedHond.id);
                }
                
                if (!existingHond) {
                    // Nieuwe hond toevoegen
                    await this.addHondToDatabase(importedHond);
                    result.honden.toegevoegd++;
                } else {
                    // Bestaande hond bijwerken en aanvullen
                    const updatedHond = this.mergeHonden(existingHond, importedHond);
                    await this.updateHondInDatabase(updatedHond);
                    result.honden.bijgewerkt++;
                }
            }
        }
        
        // Import foto metadata
        if (importData.fotos) {
            for (const importedFoto of importData.fotos) {
                let existingFoto;
                
                if (typeof this.db.getFoto === 'function') {
                    existingFoto = await this.db.getFoto(importedFoto.id);
                } else if (typeof this.db.getPhotoById === 'function') {
                    existingFoto = await this.db.getPhotoById(importedFoto.id);
                }
                
                if (!existingFoto) {
                    await this.addFotoToDatabase(importedFoto);
                    result.fotos.toegevoegd++;
                }
                // Bestaande foto's worden niet overschreven
            }
        }
        
        // Import prive info
        if (importData.priveInfo) {
            for (const importedPrive of importData.priveInfo) {
                let existingPrive;
                
                if (typeof this.db.getPriveInfo === 'function') {
                    existingPrive = await this.db.getPriveInfo(importedPrive.hondId);
                } else if (typeof this.db.getPrivateInfo === 'function') {
                    existingPrive = await this.db.getPrivateInfo(importedPrive.hondId);
                }
                
                if (existingPrive) {
                    const updatedPrive = this.mergePriveInfo(existingPrive, importedPrive);
                    await this.updatePriveInfoInDatabase(updatedPrive);
                    result.priveInfo.bijgewerkt++;
                }
                // Alleen bestaande records bijwerken, geen nieuwe toevoegen
            }
        }
        
        return result;
    }
    
    async addHondToDatabase(hond) {
        if (typeof this.db.addHond === 'function') {
            return await this.db.addHond(hond);
        } else if (typeof this.db.addDog === 'function') {
            return await this.db.addDog(hond);
        } else if (typeof this.db.saveHond === 'function') {
            return await this.db.saveHond(hond);
        } else {
            return await this.db.createDog(hond);
        }
    }
    
    async updateHondInDatabase(hond) {
        if (typeof this.db.updateHond === 'function') {
            return await this.db.updateHond(hond);
        } else if (typeof this.db.updateDog === 'function') {
            return await this.db.updateDog(hond);
        } else if (typeof this.db.saveHond === 'function') {
            return await this.db.saveHond(hond);
        } else {
            return await this.db.updateDogById(hond.id, hond);
        }
    }
    
    async addFotoToDatabase(foto) {
        if (typeof this.db.addFoto === 'function') {
            return await this.db.addFoto(foto);
        } else if (typeof this.db.addPhoto === 'function') {
            return await this.db.addPhoto(foto);
        } else if (typeof this.db.saveFoto === 'function') {
            return await this.db.saveFoto(foto);
        } else {
            return await this.db.createPhoto(foto);
        }
    }
    
    async updatePriveInfoInDatabase(priveInfo) {
        if (typeof this.db.updatePriveInfo === 'function') {
            return await this.db.updatePriveInfo(priveInfo);
        } else if (typeof this.db.updatePrivateInfo === 'function') {
            return await this.db.updatePrivateInfo(priveInfo);
        } else if (typeof this.db.savePriveInfo === 'function') {
            return await this.db.savePriveInfo(priveInfo);
        } else {
            return await this.db.updatePrivateInfoByDogId(priveInfo.hondId, priveInfo);
        }
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
                if (typeof this.db.getHonden === 'function') {
                    exportData.honden = await this.db.getHonden();
                } else if (typeof this.db.getDogs === 'function') {
                    exportData.honden = await this.db.getDogs();
                } else if (typeof this.db.getAllDogs === 'function') {
                    exportData.honden = await this.db.getAllDogs();
                } else {
                    exportData.honden = await this.db.getAllHonden();
                }
                
                // Haal foto metadata op
                if (typeof this.db.getAllFotos === 'function') {
                    exportData.fotos = await this.db.getAllFotos();
                } else if (typeof this.db.getPhotos === 'function') {
                    exportData.fotos = await this.db.getPhotos();
                } else if (typeof this.db.getAllPhotos === 'function') {
                    exportData.fotos = await this.db.getAllPhotos();
                }
            }
            
            if (exportPrivateInfo) {
                // Haal privé informatie op
                if (typeof this.db.getAllPriveInfo === 'function') {
                    exportData.priveInfo = await this.db.getAllPriveInfo();
                } else if (typeof this.db.getPrivateInfoAll === 'function') {
                    exportData.priveInfo = await this.db.getPrivateInfoAll();
                } else if (typeof this.db.getAllPrivateInfo === 'function') {
                    exportData.priveInfo = await this.db.getAllPrivateInfo();
                } else {
                    // Probeer alternatieve methode
                    exportData.priveInfo = await this.getPriveInfoForExport();
                }
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
    
    async getPriveInfoForExport() {
        try {
            // Probeer verschillende methodes om privé info op te halen
            if (typeof this.db.getAllPriveInfo === 'function') {
                return await this.db.getAllPriveInfo();
            } else if (typeof this.db.getPrivateInfoAll === 'function') {
                return await this.db.getPrivateInfoAll();
            }
            
            // Alternatieve methode: haal per hond de privé info op
            const honden = await this.db.getHonden();
            const priveInfoArray = [];
            
            for (const hond of honden) {
                try {
                    let priveInfo;
                    
                    if (typeof this.db.getPriveInfo === 'function') {
                        priveInfo = await this.db.getPriveInfo(hond.id);
                    } else if (typeof this.db.getPrivateInfo === 'function') {
                        priveInfo = await this.db.getPrivateInfo(hond.id);
                    } else if (typeof this.db.getPrivateInfoByDogId === 'function') {
                        priveInfo = await this.db.getPrivateInfoByDogId(hond.id);
                    }
                    
                    if (priveInfo) {
                        priveInfoArray.push(priveInfo);
                    }
                } catch (err) {
                    console.warn(`Kon geen privé info vinden voor hond ${hond.id}:`, err.message);
                }
            }
            
            return priveInfoArray;
        } catch (error) {
            console.error('Fout bij ophalen privé info:', error);
            return [];
        }
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
            let stats;
            
            if (typeof this.db.getStatistieken === 'function') {
                stats = await this.db.getStatistieken();
            } else if (typeof this.db.getStatistics === 'function') {
                stats = await this.db.getStatistics();
            } else if (typeof this.db.getStats === 'function') {
                stats = await this.db.getStats();
            } else {
                // Maak handmatig statistieken
                stats = {
                    totaalHonden: 0,
                    totaalFotos: 0,
                    totaalPriveInfo: 0
                };
                
                // Tel honden
                if (typeof this.db.getHonden === 'function') {
                    const honden = await this.db.getHonden();
                    stats.totaalHonden = honden.length;
                }
                
                // Tel foto's
                if (typeof this.db.getAllFotos === 'function') {
                    const fotos = await this.db.getAllFotos();
                    stats.totaalFotos = fotos.length;
                }
            }
            
            const hondenElement = document.getElementById('statsHonden');
            const fotosElement = document.getElementById('statsFotos');
            const priveElement = document.getElementById('statsPrive');
            
            if (hondenElement) hondenElement.textContent = stats.totaalHonden;
            if (fotosElement) fotosElement.textContent = stats.totaalFotos;
            if (priveElement) priveElement.textContent = stats.totaalPriveInfo || 0;
            
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