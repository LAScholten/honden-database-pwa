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
                
                console.log('=== IMPORT DEBUG ===');
                console.log('Import data ontvangen');
                console.log('Aantal honden in import:', importData.honden ? importData.honden.length : 0);
                
                // DEBUG: Check welke database functies beschikbaar zijn
                console.log('Beschikbare database functies:');
                const dbFunctions = Object.keys(this.db).filter(key => typeof this.db[key] === 'function');
                console.log(dbFunctions);
                
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
        
        // Eerst kijken welke functies we hebben
        const hasAddHond = typeof this.db.addHond === 'function';
        const hasUpdateHond = typeof this.db.updateHond === 'function';
        const hasGetHonden = typeof this.db.getHonden === 'function';
        
        console.log('Database functies beschikbaar:');
        console.log('- addHond:', hasAddHond);
        console.log('- updateHond:', hasUpdateHond);
        console.log('- getHonden:', hasGetHonden);
        
        if (!hasAddHond || !hasUpdateHond || !hasGetHonden) {
            console.error('BELANGRIJKE database functies ontbreken!');
            this.showError('Database functies ontbreken. Kan niet importeren.');
            return result;
        }
        
        // Haal huidige honden op om te weten wat we hebben
        let currentHonden = [];
        try {
            currentHonden = await this.db.getHonden();
            console.log('Huidige honden in database:', currentHonden.length);
        } catch (e) {
            console.error('Kon huidige honden niet ophalen:', e);
            return result;
        }
        
        const currentHondIds = currentHonden.map(h => h.id);
        console.log('Huidige hond IDs:', currentHondIds);
        
        // 1. Importeer honden
        if (importData.honden && Array.isArray(importData.honden)) {
            console.log('Te importeren honden:', importData.honden.length);
            console.log('Te importeren hond IDs:', importData.honden.map(h => h.id));
            
            for (const hond of importData.honden) {
                const hondExists = currentHondIds.includes(hond.id);
                console.log(`Hond ${hond.id}: bestaat in database? ${hondExists}`);
                
                try {
                    if (!hondExists) {
                        // Nieuwe hond toevoegen
                        console.log(`Voeg hond ${hond.id} toe...`);
                        await this.db.addHond(hond);
                        result.honden.toegevoegd++;
                        console.log(`Hond ${hond.id} toegevoegd`);
                    } else {
                        // Bestaande hond bijwerken
                        console.log(`Update hond ${hond.id}...`);
                        await this.db.updateHond(hond);
                        result.honden.bijgewerkt++;
                        console.log(`Hond ${hond.id} bijgewerkt`);
                    }
                } catch (error) {
                    console.error(`Fout bij verwerken hond ${hond.id}:`, error);
                    
                    // Probeer de andere methode als één faalt
                    try {
                        if (hondExists) {
                            console.log(`Probeer addHond voor bestaande hond ${hond.id}...`);
                            await this.db.addHond(hond);
                            result.honden.bijgewerkt++; // Tellen als bijgewerkt
                            console.log(`Hond ${hond.id} bijgewerkt via addHond`);
                        } else {
                            console.log(`Probeer updateHond voor nieuwe hond ${hond.id}...`);
                            await this.db.updateHond(hond);
                            result.honden.toegevoegd++; // Tellen als toegevoegd
                            console.log(`Hond ${hond.id} toegevoegd via updateHond`);
                        }
                    } catch (secondError) {
                        console.error(`Kan hond ${hond.id} niet verwerken via welke methode dan ook:`, secondError);
                    }
                }
            }
        }
        
        console.log('Import resultaat honden:', result.honden);
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
            
            // DEBUG: Check welke functies we hebben voor export
            console.log('=== EXPORT DEBUG ===');
            const dbFunctions = Object.keys(this.db).filter(key => typeof this.db[key] === 'function');
            console.log('Beschikbare database functies:', dbFunctions);
            
            if (exportDataPhotos) {
                try {
                    // Probeer getHonden
                    if (typeof this.db.getHonden === 'function') {
                        exportData.honden = await this.db.getHonden();
                        console.log('Honden geëxporteerd:', exportData.honden.length);
                    } else {
                        console.error('getHonden functie niet beschikbaar!');
                        exportData.honden = [];
                    }
                } catch (error) {
                    console.error('Kon honden niet ophalen:', error);
                    exportData.honden = [];
                }
            }
            
            // Privé info - alleen als checkbox is aangevinkt
            if (exportPrivateInfo) {
                exportData.priveInfo = []; // Lege array voor nu
                console.log('Privé info export is uitgeschakeld vanwege rechtenbeperkingen');
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
            
            // ALTIJD JSON exporteren, geen CSV
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const fullFilename = `${filename}.json`;
            
            this.downloadFile(blob, fullFilename);
            this.hideProgress();
            
            const successMessage = `${this.t('exportSuccess')}<br>
                                  <small>${this.t('exportFileSaved')} <strong>${fullFilename}</strong></small><br>
                                  <small>Aantal honden: ${exportData.honden ? exportData.honden.length : 0}</small>`;
            this.showSuccess(successMessage);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('exportFailed')}${error.message}`);
        }
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
            let hondenCount = 0;
            
            try {
                if (typeof this.db.getHonden === 'function') {
                    const honden = await this.db.getHonden() || [];
                    hondenCount = honden.length;
                }
            } catch (e) {
                console.error('Kon honden niet tellen:', e);
            }
            
            const hondenElement = document.getElementById('statsHonden');
            const fotosElement = document.getElementById('statsFotos');
            const priveElement = document.getElementById('statsPrive');
            
            if (hondenElement) hondenElement.textContent = hondenCount;
            if (fotosElement) fotosElement.textContent = '0'; // Geen foto functies
            if (priveElement) priveElement.textContent = '0'; // Geen privé functies
            
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
        
        summary += `</div>`;
        
        this.showSuccess(`${this.t('importComplete')}<br>${summary}`);
    }
    
    showProgress(message) {
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
    
    // CSV parsing functies (vereenvoudigd)
    parseCSV(csvText) {
        // Eenvoudige CSV parsing
        const lines = csvText.split('\n');
        if (lines.length < 2) return { honden: [] };
        
        const headers = lines[0].split(';');
        const honden = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(';');
            const hond = {};
            
            headers.forEach((header, index) => {
                if (values[index] !== undefined) {
                    let value = values[index];
                    // Verwijder aanhalingstekens
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    hond[header.trim()] = value || null;
                }
            });
            
            if (hond.id) {
                honden.push(hond);
            }
        }
        
        return { honden };
    }
    
    convertHondenToCSV(honden) {
        if (!honden || honden.length === 0) return '';
        
        // Eenvoudige CSV conversie
        const headers = Object.keys(honden[0]);
        let csv = headers.join(';') + '\n';
        
        honden.forEach(hond => {
            const row = headers.map(header => {
                const value = hond[header];
                if (value === null || value === undefined) return '';
                // Als het een string is met puntkomma, zet tussen aanhalingstekens
                if (typeof value === 'string' && value.includes(';')) {
                    return `"${value}"`;
                }
                return String(value);
            });
            csv += row.join(';') + '\n';
        });
        
        return csv;
    }
}