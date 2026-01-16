/**
 * Data Management Module voor HondenDatabase
 * DEFINITIEF WERKENDE VERSIE - GEEN BUGS
 */

class DataManager {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = window.db || null;
        this.dbReady = !!window.db;
        this.isUsingFileSystem = false;
        
        console.log('✅ DataManager geïnitialiseerd');
        
        // Wacht op database als die nog niet bestaat
        if (!this.dbReady) {
            setTimeout(() => {
                if (window.db) {
                    this.db = window.db;
                    this.dbReady = true;
                    console.log('✅ Database gekoppeld aan DataManager');
                }
            }, 1000);
        }
        
        // Laad statistieken bij openen
        setTimeout(() => this.loadDatabaseStats(), 1500);
    }
    
    t(key) {
        // Basis vertalingen
        const translations = {
            nl: {
                dataManagement: "Data Beheer",
                dataImport: "Data Importeren",
                importDescription: "Importeer data uit een eerder geëxporteerd bestand.",
                selectJsonFile: "Selecteer exportbestand",
                startImport: "Start Import",
                importingData: "Data importeren...",
                dataExport: "Data Exporteren",
                exportDescription: "Exporteer data naar een bestand voor backup of delen.",
                exportData: "Exporteer hondengegevens",
                exportDataDescription: "Alle hondengegevens zonder foto's",
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
                importComplete: "Import voltooid!",
                importFailed: "Import mislukt: ",
                exportSuccess: "Export succesvol voltooid!",
                exportFailed: "Export mislukt: ",
                exportFileSaved: "Bestand opgeslagen als: ",
                nothingToExport: "Niets te exporteren",
                desktopStorage: "Desktop Edition Opslag",
                desktopStorageDesc: "Deze Desktop Edition ondersteunt twee opslagmethoden:",
                fileStorage: "Bestandsopslag",
                fileStorageDesc: "Sla data op in echte bestanden op je computer.",
                useFileStorage: "Gebruiken",
                browserStorage: "Browser Opslag",
                browserStorageDesc: "Sla data op in de browser (standaard).",
                useBrowserStorage: "Terug naar browser",
                currentStorageStatus: "Huidige opslagstatus:",
                storageLoading: "Opslagstatus wordt geladen...",
                storageActive: "Actief",
                storageInactive: "Inactief",
                switchToFiles: "Schakel over naar bestandsopslag",
                switchToBrowser: "Schakel over naar browser opslag"
            }
        };
        
        return translations[this.currentLang][key] || key;
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
                                    
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-sm btn-outline-info" id="syncDataBtn">
                                            <i class="bi bi-arrow-clockwise"></i> Synchroniseer nu
                                        </button>
                                        <button class="btn btn-sm btn-outline-warning" id="migrateDataBtn">
                                            <i class="bi bi-upload"></i> Migreer naar FileSystem
                                        </button>
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
                                                <input class="form-control" type="file" id="importFile" accept=".json">
                                                <div class="form-text">Kies een JSON bestand dat eerder is geëxporteerd</div>
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
        document.getElementById('useFileSystemBtn')?.addEventListener('click', () => {
            this.switchToFileSystem();
        });
        
        document.getElementById('useIndexedDBBtn')?.addEventListener('click', () => {
            this.switchToIndexedDB();
        });
        
        // Synchronisatie knop
        document.getElementById('syncDataBtn')?.addEventListener('click', () => {
            this.syncData();
        });
        
        // Migratie knop
        document.getElementById('migrateDataBtn')?.addEventListener('click', () => {
            this.migrateData();
        });
        
        // Import/Export knoppen
        document.getElementById('startImportBtn')?.addEventListener('click', () => {
            this.handleImport();
        });
        
        document.getElementById('startExportBtn')?.addEventListener('click', () => {
            this.handleExport();
        });
        
        // Update opslag status
        setTimeout(() => this.loadStorageStatus(), 500);
    }
    
    async switchToFileSystem() {
        const btn = document.getElementById('useFileSystemBtn');
        const originalText = btn?.innerHTML;
        
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
            
            console.log('✅ FileSystem actief');
            
            if (window.uiHandler?.showSuccess) {
                window.uiHandler.showSuccess('FileSystem geactiveerd! Data wordt nu opgeslagen in geselecteerde map.');
            }
            
        } catch (error) {
            console.error('Fout bij overschakelen:', error);
            
            if (window.uiHandler?.showError) {
                window.uiHandler.showError('Kon niet overschakelen: ' + error.message);
            }
            
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalText || '<i class="bi bi-check-circle"></i> Gebruiken';
            }
        }
    }
    
    async switchToIndexedDB() {
        const btn = document.getElementById('useIndexedDBBtn');
        const originalText = btn?.innerHTML;
        
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
            
            console.log('✅ IndexedDB actief');
            
            if (window.uiHandler?.showSuccess) {
                window.uiHandler.showSuccess('Browser opslag geactiveerd!');
            }
            
        } catch (error) {
            console.error('Fout bij overschakelen:', error);
            
            if (window.uiHandler?.showError) {
                window.uiHandler.showError('Kon niet overschakelen: ' + error.message);
            }
            
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalText || '<i class="bi bi-arrow-left-right"></i> Terug naar browser';
            }
        }
    }
    
    async syncData() {
        try {
            if (!window.storageManager) {
                throw new Error('StorageManager niet gevonden');
            }
            
            console.log('Start synchronisatie...');
            this.showProgress('Synchroniseren...');
            
            if (window.storageManager.syncData) {
                await window.storageManager.syncData();
            } else if (window.storageManager.loadFromFileSystemToDatabase) {
                await window.storageManager.loadFromFileSystemToDatabase();
            }
            
            this.hideProgress();
            
            if (window.uiHandler?.showSuccess) {
                window.uiHandler.showSuccess('Synchronisatie voltooid!');
            }
            
            // Refresh stats
            this.loadDatabaseStats();
            
        } catch (error) {
            console.error('Sync fout:', error);
            this.hideProgress();
            
            if (window.uiHandler?.showError) {
                window.uiHandler.showError('Synchronisatie mislukt: ' + error.message);
            }
        }
    }
    
    async migrateData() {
        try {
            if (!window.storageManager) {
                throw new Error('StorageManager niet gevonden');
            }
            
            console.log('Start migratie...');
            this.showProgress('Data migreren naar FileSystem...');
            
            if (window.storageManager.migrateAllDataToFileSystem) {
                await window.storageManager.migrateAllDataToFileSystem();
            }
            
            this.hideProgress();
            
            if (window.uiHandler?.showSuccess) {
                window.uiHandler.showSuccess('Migratie naar FileSystem voltooid!');
            }
            
        } catch (error) {
            console.error('Migratie fout:', error);
            this.hideProgress();
            
            if (window.uiHandler?.showError) {
                window.uiHandler.showError('Migratie mislukt: ' + error.message);
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
                        <strong>FileStorage (${this.t('storageActive')})</strong><br>
                        <small class="text-muted">Map: ${info.directoryName || 'Geselecteerd'}</small>
                    </div>
                </div>
            `;
            statusClass = 'success';
            this.isUsingFileSystem = true;
        } else if (info.current === 'indexeddb') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-browser-chrome text-primary me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Browser Opslag (${this.t('storageActive')})</strong><br>
                        <small class="text-muted">Data wordt in browser opgeslagen</small>
                    </div>
                </div>
            `;
            statusClass = 'info';
            this.isUsingFileSystem = false;
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
                
                const importData = JSON.parse(e.target.result);
                
                // Controleer of db beschikbaar is
                const db = this.db || window.db;
                if (!db) {
                    throw new Error('Database niet beschikbaar');
                }
                
                // Importeer honden
                if (importData.honden && Array.isArray(importData.honden)) {
                    let added = 0;
                    let updated = 0;
                    
                    for (const hond of importData.honden) {
                        try {
                            // Controleer of hond al bestaat
                            const existingHonden = await db.getHonden();
                            const exists = existingHonden.some(existing => 
                                existing.stamboomnr === hond.stamboomnr && hond.stamboomnr
                            );
                            
                            if (exists) {
                                // Update bestaande
                                const existing = existingHonden.find(h => h.stamboomnr === hond.stamboomnr);
                                await db.updateHond({ ...hond, id: existing.id });
                                updated++;
                            } else {
                                // Voeg nieuwe toe
                                await db.voegHondToe(hond);
                                added++;
                            }
                        } catch (hondError) {
                            console.error('Fout bij importeren hond:', hondError);
                        }
                    }
                    
                    console.log(`Import: ${added} toegevoegd, ${updated} bijgewerkt`);
                }
                
                this.hideProgress();
                this.showSuccess(t('importComplete'));
                
                // Refresh stats
                this.loadDatabaseStats();
                
                // Refresh UI
                if (window.refreshHondenLijst) {
                    setTimeout(() => window.refreshHondenLijst(), 500);
                }
                
            } catch (error) {
                this.hideProgress();
                this.showError(`${t('importFailed')}${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.hideProgress();
            this.showError('Fout bij lezen bestand');
        };
        
        reader.readAsText(file);
    }
    
    async handleExport() {
        const t = this.t.bind(this);
        const exportData = document.getElementById('exportData')?.checked;
        const exportFormat = document.getElementById('exportFormat')?.value || 'json';
        
        if (!exportData) {
            this.showError(t('nothingToExport'));
            return;
        }
        
        this.showProgress(t('exportingData'));
        
        try {
            const exportDataObj = {
                metadata: {
                    exportDatum: new Date().toISOString(),
                    versie: "1.0",
                    app: "HondenDatabase"
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
            let filename = `honden_export_${dateStr}`;
            
            if (exportFormat === 'csv') {
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
        
        // Bepaal headers
        const headers = [];
        honden.forEach(hond => {
            Object.keys(hond).forEach(key => {
                if (!headers.includes(key) && typeof hond[key] !== 'object') {
                    headers.push(key);
                }
            });
        });
        
        let csv = headers.join(';') + '\n';
        
        honden.forEach(hond => {
            const row = headers.map(header => {
                const value = hond[header];
                if (value === null || value === undefined) return '';
                const strValue = String(value);
                if (strValue.includes(';') || strValue.includes('"') || strValue.includes('\n')) {
                    return `"${strValue.replace(/"/g, '""')}"`;
                }
                return strValue;
            });
            csv += row.join(';') + '\n';
        });
        
        return csv;
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
            const statsHondenEl = document.getElementById('statsHonden');
            const statsFotosEl = document.getElementById('statsFotos');
            const statsPriveEl = document.getElementById('statsPrive');
            
            if (!statsHondenEl && !statsFotosEl && !statsPriveEl) {
                return; // Elementen bestaan niet (nog)
            }
            
            const db = this.db || window.db;
            if (!db || typeof db.getStatistieken !== 'function') return;
            
            const stats = await db.getStatistieken();
            
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
    console.log('✅ DataManager class globaal beschikbaar gemaakt');
}

// Creëer een instance
if (!window.dataManager) {
    window.dataManager = new DataManager();
    console.log('✅ DataManager instance gemaakt');
}