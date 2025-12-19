/**
 * Data Management Module
 * Beheert import/export en database operaties
 */

class DataManager extends BaseModule {
    constructor() {
        super();
    }
    
    getModalHTML() {
        const isAdmin = this.auth.isAdmin();
        
        return `
            <div class="modal fade" id="dataManagementModal" tabindex="-1" aria-labelledby="dataManagementModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="dataManagementModalLabel">
                                <i class="bi bi-database-gear"></i> Data Beheer
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
                                        <h6 class="alert-heading">Ingelogd als ${isAdmin ? 'Administrator' : 'Gebruiker'}</h6>
                                        ${isAdmin 
                                            ? 'U kunt nieuwe honden toevoegen en alle data beheren.' 
                                            : 'U kunt alle data importeren/exporteren en bestaande honden bijwerken, maar geen nieuwe honden toevoegen.'}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-success">
                                        <div class="card-header bg-success text-white">
                                            <h5 class="mb-0">
                                                <i class="bi bi-upload"></i> Data Importeren
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">
                                                Importeer data uit een eerder geëxporteerd JSON bestand.
                                            </p>
                                            
                                            <div class="mb-3">
                                                <label for="importFile" class="form-label">Selecteer JSON bestand</label>
                                                <input class="form-control" type="file" id="importFile" accept=".json">
                                                <div class="form-text">
                                                    Kies een bestand dat eerder is geëxporteerd uit deze applicatie
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label for="importStrategy" class="form-label">Import strategie</label>
                                                <select class="form-select" id="importStrategy">
                                                    <option value="merge" selected>Samenvoegen met bestaande data</option>
                                                    ${isAdmin ? '<option value="replace">Vervang alle bestaande data</option>' : ''}
                                                    <option value="update">Alleen bestaande records bijwerken</option>
                                                </select>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="importHonden" checked>
                                                    <label class="form-check-label" for="importHonden">
                                                        Honden importeren
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="importFotos" checked>
                                                    <label class="form-check-label" for="importFotos">
                                                        Foto's importeren
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="importPriveInfo" ${isAdmin ? 'checked' : ''}>
                                                    <label class="form-check-label" for="importPriveInfo">
                                                        Privé informatie importeren
                                                    </label>
                                                    ${!isAdmin ? '<div class="form-text">Alleen admin kan privé info importeren</div>' : ''}
                                                </div>
                                            </div>
                                            
                                            <button class="btn btn-success w-100" id="startImportBtn">
                                                <i class="bi bi-upload"></i> Start Import
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-primary">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0">
                                                <i class="bi bi-download"></i> Data Exporteren
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">
                                                Exporteer data naar een JSON bestand voor backup of delen.
                                            </p>
                                            
                                            <div class="mb-3">
                                                <label for="exportType" class="form-label">Export type</label>
                                                <select class="form-select" id="exportType">
                                                    <option value="all" selected>Complete backup (alles)</option>
                                                    <option value="honden">Alleen honden data</option>
                                                    <option value="fotos">Alleen foto metadata</option>
                                                    ${isAdmin ? '<option value="prive">Alleen privé informatie</option>' : ''}
                                                    <option value="selectie">Zelf selecteren...</option>
                                                </select>
                                            </div>
                                            
                                            <div id="exportSelectionOptions" style="display: none;">
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportHondenSelect" checked>
                                                        <label class="form-check-label" for="exportHondenSelect">
                                                            Honden data
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportFotosSelect" checked>
                                                        <label class="form-check-label" for="exportFotosSelect">
                                                            Foto metadata
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportPriveSelect" ${isAdmin ? 'checked' : ''}>
                                                        <label class="form-check-label" for="exportPriveSelect">
                                                            Privé informatie
                                                        </label>
                                                        ${!isAdmin ? '<div class="form-text">Alleen admin kan privé info exporteren</div>' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label for="exportFormat" class="form-label">Export formaat</label>
                                                <select class="form-select" id="exportFormat">
                                                    <option value="json" selected>JSON (aanbevolen)</option>
                                                    <option value="csv">CSV (alleen honden data)</option>
                                                </select>
                                            </div>
                                            
                                            <button class="btn btn-primary w-100" id="startExportBtn">
                                                <i class="bi bi-download"></i> Start Export
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card border-info mt-4">
                                <div class="card-header bg-info text-white">
                                    <h5 class="mb-0">
                                        <i class="bi bi-graph-up"></i> Database Statistieken
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row" id="databaseStats">
                                        <div class="col-md-4 text-center">
                                            <div class="display-6 text-primary" id="statsHonden">...</div>
                                            <div class="text-muted">Honden</div>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            <div class="display-6 text-success" id="statsFotos">...</div>
                                            <div class="text-muted">Foto's</div>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            <div class="display-6 text-warning" id="statsPrive">...</div>
                                            <div class="text-muted">Privé records</div>
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
            this.showError('Selecteer eerst een JSON bestand om te importeren');
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
                
                this.showProgress('Data importeren...');
                
                const overschrijven = strategy === 'replace';
                const resultaat = await this.db.importData(filteredData, overschrijven);
                
                this.hideProgress();
                this.showSuccess(
                    `Import voltooid!<br>
                    ${resultaat.honden.toegevoegd} nieuwe honden toegevoegd<br>
                    ${resultaat.honden.bijgewerkt} honden bijgewerkt<br>
                    ${resultaat.fotos.toegevoegd} foto's geïmporteerd<br>
                    ${resultaat.priveInfo.bijgewerkt} privé records bijgewerkt`
                );
                
                await this.loadDatabaseStats();
                
            } catch (error) {
                this.hideProgress();
                this.showError(`Import mislukt: ${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.showError('Fout bij lezen bestand');
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
        
        this.showProgress('Data exporteren...');
        
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
            this.showSuccess('Export succesvol voltooid!');
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Export mislukt: ${error.message}`);
        }
    }
    
    async handleCustomExport(exportHonden, exportFotos, exportPrive, format) {
        this.showProgress('Data exporteren...');
        
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
            this.showSuccess('Aangepaste export succesvol voltooid!');
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Export mislukt: ${error.message}`);
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
            console.error('Fout bij laden statistieken:', error);
        }
    }
}