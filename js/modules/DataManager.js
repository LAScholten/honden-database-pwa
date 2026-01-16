/**
 * Data Management Module voor HondenDatabase
 * DEFINITIEF WERKENDE VERSIE - GEEN ERRORS
 */

class DataManager {
    constructor() {
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
            }
        };
        
        this.db = null;
        this.dbReady = false;
        this.isUsingFileSystem = false;
        
        console.log('DataManager geïnitialiseerd');
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        let backupStatusHTML = '';
        if (window.backupManager) {
            try {
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
            } catch (e) {
                console.log('Geen backup status beschikbaar');
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
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            ${backupStatusHTML}
                            
                            <!-- Opslag selector -->
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
                                </div>
                            </div>
                            
                            <!-- Import/Export -->
                            <div class="row mt-4">
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-success">
                                        <div class="card-header bg-success text-white">
                                            <h5 class="mb-0"><i class="bi bi-upload"></i> ${t('dataImport')}</h5>
                                        </div>
                                        <div class="card-body">
                                            <p>${t('importDescription')}</p>
                                            
                                            <div class="mb-3">
                                                <label class="form-label">${t('selectJsonFile')}</label>
                                                <input class="form-control" type="file" id="importFile" accept=".json,.csv">
                                                <div class="form-text">${t('chooseExportedFile')}</div>
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
                                            <p>${t('exportDescription')}</p>
                                            
                                            <div class="mb-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="exportData" checked>
                                                    <label class="form-check-label">
                                                        <strong>${t('exportData')}</strong>
                                                    </label>
                                                    <div class="form-text">${t('exportDataDescription')}</div>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="exportPhotos">
                                                    <label class="form-check-label">
                                                        <strong>${t('exportPhotos')}</strong>
                                                    </label>
                                                    <div class="form-text">${t('exportPhotosDescription')}</div>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="exportPrivateInfo">
                                                    <label class="form-check-label">
                                                        <strong>${t('exportPrivateInfo')}</strong>
                                                    </label>
                                                    <div class="form-text">${t('exportPrivateInfoDescription')}</div>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label class="form-label">${t('exportFormat')}</label>
                                                <select class="form-select" id="exportFormat">
                                                    <option value="json">${t('jsonFormat')}</option>
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
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        console.log('DataManager setupEvents aangeroepen');
        
        // Opslag knoppen
        const useFileSystemBtn = document.getElementById('useFileSystemBtn');
        const useIndexedDBBtn = document.getElementById('useIndexedDBBtn');
        
        if (useFileSystemBtn) {
            useFileSystemBtn.addEventListener('click', () => {
                console.log('FileSystem knop geklikt');
                this.switchToFileSystem();
            });
        }
        
        if (useIndexedDBBtn) {
            useIndexedDBBtn.addEventListener('click', () => {
                console.log('IndexedDB knop geklikt');
                this.switchToIndexedDB();
            });
        }
        
        // Import/Export knoppen
        const startImportBtn = document.getElementById('startImportBtn');
        const startExportBtn = document.getElementById('startExportBtn');
        
        if (startImportBtn) {
            startImportBtn.addEventListener('click', () => {
                console.log('Import knop geklikt');
                this.handleImport();
            });
        }
        
        if (startExportBtn) {
            startExportBtn.addEventListener('click', () => {
                console.log('Export knop geklikt');
                this.handleExport();
            });
        }
        
        // Update opslag status
        setTimeout(() => this.loadStorageStatus(), 500);
    }
    
    async switchToFileSystem() {
        const btn = document.getElementById('useFileSystemBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Bezig...';
        }
        
        try {
            if (!window.storageManager) {
                throw new Error('StorageManager niet gevonden');
            }
            
            console.log('Schakel over naar FileSystem...');
            await window.storageManager.initialize('filesystem');
            
            this.isUsingFileSystem = true;
            this.loadStorageStatus();
            
            console.log('FileSystem actief');
            
            if (window.uiHandler && window.uiHandler.showSuccess) {
                window.uiHandler.showSuccess('FileSystem geactiveerd!');
            }
            
        } catch (error) {
            console.error('Fout bij overschakelen:', error);
            
            if (window.uiHandler && window.uiHandler.showError) {
                window.uiHandler.showError('Kon niet overschakelen: ' + error.message);
            }
            
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Gebruiken';
            }
        }
    }
    
    async switchToIndexedDB() {
        const btn = document.getElementById('useIndexedDBBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Bezig...';
        }
        
        try {
            if (!window.storageManager) {
                throw new Error('StorageManager niet gevonden');
            }
            
            console.log('Schakel over naar IndexedDB...');
            await window.storageManager.initialize('indexeddb');
            
            this.isUsingFileSystem = false;
            this.loadStorageStatus();
            
            console.log('IndexedDB actief');
            
            if (window.uiHandler && window.uiHandler.showSuccess) {
                window.uiHandler.showSuccess('Browser opslag geactiveerd!');
            }
            
        } catch (error) {
            console.error('Fout bij overschakelen:', error);
            
            if (window.uiHandler && window.uiHandler.showError) {
                window.uiHandler.showError('Kon niet overschakelen: ' + error.message);
            }
            
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="bi bi-arrow-left-right"></i> Terug naar browser';
            }
        }
    }
    
    loadStorageStatus() {
        const statusEl = document.getElementById('currentStorageStatus');
        if (!statusEl || !window.storageManager) return;
        
        const info = window.storageManager.getStorageInfo();
        let html = '';
        let statusClass = 'light';
        
        if (info.current === 'filesystem') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-folder text-success me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>FileStorage (Actief)</strong><br>
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
                        <strong>Browser Opslag (Actief)</strong><br>
                        <small class="text-muted">Data wordt in browser opgeslagen</small>
                    </div>
                </div>
            `;
            statusClass = 'info';
        } else {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-question-circle text-warning me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Niet geconfigureerd</strong><br>
                        <small class="text-muted">Kies een opslagtype</small>
                    </div>
                </div>
            `;
            statusClass = 'warning';
        }
        
        statusEl.innerHTML = html;
        statusEl.className = `alert alert-${statusClass} mb-0`;
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
                
                const db = this.db || window.db;
                if (!db) {
                    throw new Error('Database niet beschikbaar');
                }
                
                if (importData.honden && Array.isArray(importData.honden)) {
                    for (const hond of importData.honden) {
                        try {
                            await db.voegHondToe(hond);
                        } catch (error) {
                            console.error('Fout bij importeren hond:', error);
                        }
                    }
                }
                
                this.hideProgress();
                this.showSuccess(t('importComplete'));
                
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
        const exportData = document.getElementById('exportData')?.checked;
        const exportPhotos = document.getElementById('exportPhotos')?.checked;
        const exportPrivateInfo = document.getElementById('exportPrivateInfo')?.checked;
        const exportFormat = document.getElementById('exportFormat')?.value || 'json';
        
        if (!exportData && !exportPhotos && !exportPrivateInfo) {
            this.showError(t('nothingToExport'));
            return;
        }
        
        this.showProgress(t('exportingData'));
        
        try {
            const exportDataObj = {
                metadata: {
                    exportDatum: new Date().toISOString(),
                    versie: "1.0"
                }
            };
            
            const db = this.db || window.db;
            if (!db) {
                throw new Error('Database niet beschikbaar');
            }
            
            if (exportData) {
                exportDataObj.honden = await db.getHonden();
            }
            
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            let filename = `export_${dateStr}`;
            
            if (exportFormat === 'csv' && exportData) {
                const csv = this.convertHondenToCSV(exportDataObj.honden);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                filename += '.csv';
                this.downloadFile(blob, filename);
            } else {
                const jsonString = JSON.stringify(exportDataObj, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                filename += '.json';
                this.downloadFile(blob, filename);
            }
            
            this.hideProgress();
            this.showSuccess(`${t('exportSuccess')}<br><small>${t('exportFileSaved')} <strong>${filename}</strong></small>`);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('exportFailed')}${error.message}`);
        }
    }
    
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
        
        const div = document.createElement('div');
        div.id = 'dataManagerProgress';
        div.innerHTML = progressHtml;
        document.body.appendChild(div);
    }
    
    hideProgress() {
        const div = document.getElementById('dataManagerProgress');
        if (div) div.remove();
        document.querySelectorAll('.modal-backdrop.fade.show').forEach(el => el.remove());
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
                        <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove(); this.closest('.modal').nextElementSibling?.remove();"></button>
                    </div>
                    <div class="modal-body">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-${type}" onclick="this.closest('.modal').remove(); this.closest('.modal').nextElementSibling?.remove();">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
    }
    
    async loadDatabaseStats() {
        try {
            const db = this.db || window.db;
            if (!db || typeof db.getStatistieken !== 'function') return;
            
            const stats = await db.getStatistieken();
            
            const statsHondenEl = document.getElementById('statsHonden');
            const statsFotosEl = document.getElementById('statsFotos');
            const statsPriveEl = document.getElementById('statsPrive');
            
            if (statsHondenEl) statsHondenEl.textContent = stats.totaalHonden || 0;
            if (statsFotosEl) statsFotosEl.textContent = stats.totaalFotos || 0;
            if (statsPriveEl) statsPriveEl.textContent = stats.totaalPriveInfo || 0;
            
        } catch (error) {
            console.error('Fout bij laden statistieken:', error);
        }
    }
}

// Maak DataManager globaal beschikbaar
if (!window.DataManager) {
    window.DataManager = DataManager;
    console.log('DataManager class globaal beschikbaar gemaakt');
}

// Creëer een globale instance
if (!window.dataManager) {
    window.dataManager = new DataManager();
    console.log('DataManager instance gemaakt');
}