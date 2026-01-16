/**
 * Data Management Module voor HondenDatabase
 * BACKUP ONLY VERSIE - Geen FileSystem, alleen import/export
 */

class DataManager {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = window.db || null;
        this.dbReady = !!window.db;
        
        console.log('✅ DataManager geïnitialiseerd (Backup Only)');
        
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
                importDescription: "Importeer data uit een eerder geëxporteerd backup bestand.",
                selectJsonFile: "Selecteer backup bestand",
                startImport: "Start Import",
                importingData: "Data importeren...",
                dataExport: "Data Exporteren",
                exportDescription: "Exporteer data naar een JSON bestand voor backup.",
                exportData: "Exporteer alle hondengegevens",
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
                selectFileFirst: "Selecteer eerst een backup bestand",
                importComplete: "Import voltooid!",
                importFailed: "Import mislukt: ",
                exportSuccess: "Backup succesvol gemaakt!",
                exportFailed: "Backup mislukt: ",
                exportFileSaved: "Backup opgeslagen als: ",
                nothingToExport: "Niets te exporteren",
                backupWarning: "⚠️ Maak regelmatig backups!",
                backupTip: "Tip: Sla backups op meerdere locaties op."
            }
        };
        
        return translations[this.currentLang][key] || key;
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="dataManagementModal" tabindex="-1" aria-labelledby="dataManagementModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="dataManagementModalLabel">
                                <i class="bi bi-database-gear"></i> ${t('dataManagement')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            
                            <!-- Backup Waarschuwing -->
                            <div class="alert alert-warning mb-4">
                                <i class="bi bi-exclamation-triangle-fill"></i> ${t('backupWarning')}<br>
                                <small>${t('backupTip')}</small>
                            </div>
                            
                            <!-- Import/Export -->
                            <div class="row">
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
                                                <div class="form-text">Selecteer een eerder gemaakte backup (.json)</div>
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
        console.log('DataManager setupEvents aangeroepen (Backup Only)');
        
        // Import knop
        document.getElementById('startImportBtn')?.addEventListener('click', () => {
            console.log('Import knop geklikt');
            this.handleImport();
        });
        
        // Export knop
        document.getElementById('startExportBtn')?.addEventListener('click', () => {
            console.log('Export knop geklikt');
            this.handleExport();
        });
    }
    
    async handleImport() {
        const t = this.t.bind(this);
        const fileInput = document.getElementById('importFile');
        
        if (!fileInput || !fileInput.files.length) {
            this.showError(t('selectFileFirst'));
            return;
        }
        
        const file = fileInput.files[0];
        
        // Alleen JSON accepteren
        if (!file.name.endsWith('.json')) {
            this.showError('Alleen JSON backup bestanden worden ondersteund');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                this.showProgress(t('importingData'));
                
                const importData = JSON.parse(e.target.result);
                
                // Controleer of het een geldig backup bestand is
                if (!importData.metadata || !importData.metadata.exportDatum) {
                    throw new Error('Ongeldig backup bestand formaat');
                }
                
                // Controleer of db beschikbaar is
                const db = this.db || window.db;
                if (!db) {
                    throw new Error('Database niet beschikbaar');
                }
                
                // Importeer honden met relatieherstel
                if (importData.honden && Array.isArray(importData.honden)) {
                    let added = 0;
                    let updated = 0;
                    
                    // Maak mapping van stamboomnr naar ID voor relaties
                    const stamboomToIdMap = {};
                    
                    // Eerst alle honden toevoegen (zonder relaties)
                    for (const hond of importData.honden) {
                        try {
                            if (!hond.stamboomnr) continue;
                            
                            const existingHonden = await db.getHonden();
                            const exists = existingHonden.some(existing => 
                                existing.stamboomnr === hond.stamboomnr
                            );
                            
                            const cleanHond = { ...hond };
                            delete cleanHond.id;
                            delete cleanHond.vader_id;
                            delete cleanHond.moeder_id;
                            
                            if (exists) {
                                // Update bestaande
                                const existing = existingHonden.find(h => h.stamboomnr === hond.stamboomnr);
                                await db.updateHond({ ...cleanHond, id: existing.id });
                                stamboomToIdMap[hond.stamboomnr] = existing.id;
                                updated++;
                            } else {
                                // Voeg nieuwe toe
                                const newId = await db.voegHondToe(cleanHond);
                                stamboomToIdMap[hond.stamboomnr] = newId;
                                added++;
                            }
                        } catch (hondError) {
                            console.error('Fout bij importeren hond:', hondError);
                        }
                    }
                    
                    // Nu relaties herstellen
                    console.log('Herstel relaties...');
                    let relatiesHersteld = 0;
                    
                    for (const hond of importData.honden) {
                        try {
                            const hondId = stamboomToIdMap[hond.stamboomnr];
                            if (!hondId) continue;
                            
                            const updateData = { id: hondId };
                            let needsUpdate = false;
                            
                            // Vader relatie
                            if (hond.vader_stamboomnr && stamboomToIdMap[hond.vader_stamboomnr]) {
                                updateData.vader_id = stamboomToIdMap[hond.vader_stamboomnr];
                                needsUpdate = true;
                            }
                            
                            // Moeder relatie
                            if (hond.moeder_stamboomnr && stamboomToIdMap[hond.moeder_stamboomnr]) {
                                updateData.moeder_id = stamboomToIdMap[hond.moeder_stamboomnr];
                                needsUpdate = true;
                            }
                            
                            if (needsUpdate) {
                                await db.updateHond(updateData);
                                relatiesHersteld++;
                            }
                        } catch (relError) {
                            console.error('Fout bij relatieherstel:', relError);
                        }
                    }
                    
                    console.log(`Import resultaat: ${added} toegevoegd, ${updated} bijgewerkt, ${relatiesHersteld} relaties hersteld`);
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
            this.showError('Fout bij lezen backup bestand');
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
                    versie: "2.0",
                    app: "HondenDatabase",
                    backupType: "full_export"
                }
            };
            
            const db = this.db || window.db;
            if (!db) {
                throw new Error('Database niet beschikbaar');
            }
            
            if (exportData) {
                exportDataObj.honden = await db.getHonden();
                
                // Voeg relatie mapping toe voor import
                if (exportDataObj.honden && exportDataObj.honden.length > 0) {
                    exportDataObj.metadata.totalHonden = exportDataObj.honden.length;
                    exportDataObj.metadata.hasRelationships = true;
                }
            }
            
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const timeStr = new Date().toTimeString().split(' ')[0].replace(/:/g, '');
            let filename = `honden_backup_${dateStr}_${timeStr}`;
            
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
        
        // Bepaal alle headers uit alle honden
        const headers = new Set();
        honden.forEach(hond => {
            Object.keys(hond).forEach(key => {
                if (typeof hond[key] !== 'object' && hond[key] !== null) {
                    headers.add(key);
                }
            });
        });
        
        const headerArray = Array.from(headers);
        let csv = headerArray.join(';') + '\n';
        
        honden.forEach(hond => {
            const row = headerArray.map(header => {
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
                return;
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
    console.log('✅ DataManager class globaal beschikbaar gemaakt (Backup Only)');
}

// Creëer een instance
if (!window.dataManager) {
    window.dataManager = new DataManager();
    console.log('✅ DataManager instance gemaakt (Backup Only)');
}