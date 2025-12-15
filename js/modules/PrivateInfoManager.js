/**
 * Privé Informatie Module
 * Beheert vertrouwelijke informatie over honden
 */

class PrivateInfoManager extends BaseModule {
    constructor() {
        super();
        this.currentHondId = null;
        this.currentPriveInfo = null;
    }
    
    getModalHTML() {
        const isAdmin = this.auth.isAdmin();
        
        return `
            <div class="modal fade" id="privateInfoModal" tabindex="-1" aria-labelledby="privateInfoModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title" id="privateInfoModalLabel">
                                <i class="bi bi-lock"></i> Privé Informatie
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert ${isAdmin ? 'alert-info' : 'alert-warning'} mb-4">
                                <div class="d-flex">
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-${isAdmin ? 'shield-check' : 'eye'} fs-4"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <h6 class="alert-heading">${isAdmin ? 'Volledige toegang' : 'Alleen bekijken'}</h6>
                                        ${isAdmin 
                                            ? 'U kunt alle privé informatie bewerken en bekijken.' 
                                            : 'U kunt privé informatie alleen bekijken, niet bewerken.'}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-search"></i> Selecteer Hond</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="privateHondSelect" class="form-label">Hond</label>
                                                <select class="form-select" id="privateHondSelect">
                                                    <option value="">Kies een hond...</option>
                                                    <!-- Hond opties worden hier ingeladen -->
                                                </select>
                                            </div>
                                            <button class="btn btn-dark w-100" id="loadPrivateInfoBtn">
                                                <i class="bi bi-eye"></i> Info Laden
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-shield"></i> Beveiligingsinfo</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="small">
                                                <p><i class="bi bi-check-circle text-success"></i> Alle privé informatie wordt lokaal opgeslagen</p>
                                                <p><i class="bi bi-check-circle text-success"></i> Geen toegang zonder inloggen</p>
                                                <p><i class="bi bi-check-circle text-success"></i> Export met wachtwoordbeveiliging mogelijk</p>
                                                <p><i class="bi bi-clock-history"></i> Laatste backup: <span id="lastBackupDate">Nog geen backup</span></p>
                                            </div>
                                            <div class="mt-3">
                                                <button class="btn btn-outline-dark btn-sm" id="backupPrivateInfoBtn">
                                                    <i class="bi bi-download"></i> Backup Privé Info
                                                </button>
                                                ${isAdmin ? `
                                                <button class="btn btn-outline-dark btn-sm" id="restorePrivateInfoBtn">
                                                    <i class="bi bi-upload"></i> Restore Backup
                                                </button>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="bi bi-journal-text"></i> Privé Notities</h6>
                                </div>
                                <div class="card-body">
                                    <div id="privateInfoForm">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="privateMedical" class="form-label">Medische Historie</label>
                                                    <textarea class="form-control" id="privateMedical" rows="4" ${!isAdmin ? 'readonly' : ''}
                                                        placeholder="Vaccinaties, operaties, medicatie..."></textarea>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="privateBehavior" class="form-label">Gedragsnotities</label>
                                                    <textarea class="form-control" id="privateBehavior" rows="4" ${!isAdmin ? 'readonly' : ''}
                                                        placeholder="Gedrag, training, specifieke gewoontes..."></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="privateVet" class="form-label">Dierenarts Contact</label>
                                                    <textarea class="form-control" id="privateVet" rows="3" ${!isAdmin ? 'readonly' : ''}
                                                        placeholder="Naam, telefoon, specialisaties..."></textarea>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="privateDiet" class="form-label">Voeding & Dieet</label>
                                                    <textarea class="form-control" id="privateDiet" rows="3" ${!isAdmin ? 'readonly' : ''}
                                                        placeholder="Speciaal dieet, allergieën, voedingsschema..."></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="privateOther" class="form-label">Overige Notities</label>
                                            <textarea class="form-control" id="privateOther" rows="3" ${!isAdmin ? 'readonly' : ''}
                                                placeholder="Andere vertrouwelijke informatie..."></textarea>
                                        </div>
                                        
                                        ${isAdmin ? `
                                        <div class="alert alert-warning">
                                            <i class="bi bi-exclamation-triangle"></i>
                                            Deze informatie is vertrouwelijk en alleen zichtbaar voor geautoriseerde gebruikers.
                                        </div>
                                        
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-secondary" id="clearPrivateInfoBtn">
                                                <i class="bi bi-x-circle"></i> Wissen
                                            </button>
                                            <button class="btn btn-dark" id="savePrivateInfoBtn">
                                                <i class="bi bi-save"></i> Opslaan
                                            </button>
                                        </div>
                                        ` : `
                                        <div class="alert alert-info">
                                            <i class="bi bi-info-circle"></i>
                                            U kunt deze informatie alleen bekijken. Alleen administrators kunnen wijzigingen aanbrengen.
                                        </div>
                                        `}
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
        const loadBtn = document.getElementById('loadPrivateInfoBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadPrivateInfoForDog();
            });
        }
        
        const saveBtn = document.getElementById('savePrivateInfoBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.savePrivateInfo();
            });
        }
        
        const clearBtn = document.getElementById('clearPrivateInfoBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearPrivateInfo();
            });
        }
        
        const backupBtn = document.getElementById('backupPrivateInfoBtn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                this.backupPrivateInfo();
            });
        }
        
        const restoreBtn = document.getElementById('restorePrivateInfoBtn');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => {
                this.restorePrivateInfo();
            });
        }
    }
    
    async loadPrivateInfoData() {
        try {
            // Laad honden voor dropdown
            const honden = await this.db.getHonden();
            const hondSelect = document.getElementById('privateHondSelect');
            if (hondSelect) {
                hondSelect.innerHTML = '<option value="">Kies een hond...</option>';
                honden.forEach(hond => {
                    const option = document.createElement('option');
                    option.value = hond.id;
                    option.textContent = `${hond.naam} (${hond.chipnummer})`;
                    hondSelect.appendChild(option);
                });
            }
            
            // Laad laatste backup datum
            await this.updateLastBackupDate();
            
        } catch (error) {
            console.error('Fout bij laden privé info data:', error);
        }
    }
    
    async loadPrivateInfoForDog() {
        const hondId = document.getElementById('privateHondSelect').value;
        
        if (!hondId) {
            this.showError('Selecteer eerst een hond');
            return;
        }
        
        this.currentHondId = parseInt(hondId);
        
        this.showProgress('Privé info laden...');
        
        try {
            // Laad privé info uit database
            this.currentPriveInfo = await this.db.getPriveInfoVoorHond(this.currentHondId);
            
            // Laad hond details voor referentie
            const honden = await this.db.getHonden();
            const selectedHond = honden.find(h => h.id === this.currentHondId);
            
            if (!selectedHond) {
                throw new Error('Hond niet gevonden in database');
            }
            
            this.hideProgress();
            
            // Toon info in formulier
            this.displayPrivateInfo();
            
            // Update UI voor specifieke hond
            this.updatePrivateInfoHeader(selectedHond);
            
        } catch (error) {
            this.hideProgress();
            
            // Als er geen info gevonden is, toon leeg formulier
            if (error.message.includes('niet gevonden') || !this.currentPriveInfo) {
                this.currentPriveInfo = null;
                this.displayPrivateInfo();
                this.showInfo('Geen privé informatie gevonden voor deze hond. U kunt nieuwe informatie toevoegen (admin alleen).');
            } else {
                this.showError(`Laden mislukt: ${error.message}`);
            }
        }
    }
    
    displayPrivateInfo() {
        const isAdmin = this.auth.isAdmin();
        
        // Reset formulier
        document.getElementById('privateMedical').value = '';
        document.getElementById('privateBehavior').value = '';
        document.getElementById('privateVet').value = '';
        document.getElementById('privateDiet').value = '';
        document.getElementById('privateOther').value = '';
        
        // Als er info is, vul het in
        if (this.currentPriveInfo) {
            document.getElementById('privateMedical').value = this.currentPriveInfo.medischeHistorie || '';
            document.getElementById('privateBehavior').value = this.currentPriveInfo.gedragsnotities || '';
            document.getElementById('privateVet').value = this.currentPriveInfo.contactDierenarts || '';
            document.getElementById('privateDiet').value = this.currentPriveInfo.voeding || '';
            document.getElementById('privateOther').value = this.currentPriveInfo.overigeNotities || '';
        }
        
        // Zet read-only mode voor niet-admins
        const textareas = document.querySelectorAll('#privateInfoForm textarea');
        textareas.forEach(textarea => {
            textarea.readOnly = !isAdmin;
        });
    }
    
    updatePrivateInfoHeader(hond) {
        const modalTitle = document.querySelector('#privateInfoModal .modal-title');
        if (modalTitle && hond) {
            modalTitle.innerHTML = `<i class="bi bi-lock"></i> Privé Informatie - ${hond.naam}`;
        }
    }
    
    async savePrivateInfo() {
        if (!this.auth.isAdmin()) {
            this.showError('Alleen administrators mogen privé informatie opslaan');
            return;
        }
        
        if (!this.currentHondId) {
            this.showError('Selecteer eerst een hond');
            return;
        }
        
        this.showProgress('Privé info opslaan...');
        
        try {
            const priveInfo = {
                hondId: this.currentHondId,
                medischeHistorie: document.getElementById('privateMedical').value.trim(),
                gedragsnotities: document.getElementById('privateBehavior').value.trim(),
                contactDierenarts: document.getElementById('privateVet').value.trim(),
                voeding: document.getElementById('privateDiet').value.trim(),
                overigeNotities: document.getElementById('privateOther').value.trim(),
                vertrouwelijk: true
            };
            
            await this.db.bewaarPriveInfo(priveInfo);
            
            this.hideProgress();
            this.showSuccess('Privé informatie succesvol opgeslagen!');
            
            // Herlaad huidige info
            await this.loadPrivateInfoForDog();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Opslaan mislukt: ${error.message}`);
        }
    }
    
    clearPrivateInfo() {
        if (!this.auth.isAdmin()) {
            this.showError('Alleen administrators mogen privé informatie wissen');
            return;
        }
        
        if (!confirm('Weet je zeker dat je alle velden wilt wissen? Dit wordt niet automatisch opgeslagen.')) {
            return;
        }
        
        document.getElementById('privateMedical').value = '';
        document.getElementById('privateBehavior').value = '';
        document.getElementById('privateVet').value = '';
        document.getElementById('privateDiet').value = '';
        document.getElementById('privateOther').value = '';
        
        this.showSuccess('Velden gewist. Vergeet niet op te slaan als je de wijzigingen wilt bewaren.');
    }
    
    async backupPrivateInfo() {
        this.showProgress('Backup maken...');
        
        try {
            const allPriveInfo = await this.db.getAllPriveInfo();
            const honden = await this.db.getHonden();
            
            // Verrijk data met hondennamen
            const enrichedData = allPriveInfo.map(info => {
                const hond = honden.find(h => h.id === info.hondId);
                return {
                    ...info,
                    hondNaam: hond ? hond.naam : 'Onbekend',
                    hondChipnummer: hond ? hond.chipnummer : 'Onbekend'
                };
            });
            
            const backupData = {
                metadata: {
                    type: 'private_info_backup',
                    backupDatum: new Date().toISOString(),
                    backupDoor: this.auth.getCurrentUser()?.username || 'unknown',
                    aantalRecords: enrichedData.length
                },
                data: enrichedData
            };
            
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `prive-info-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.hideProgress();
            this.showSuccess('Backup succesvol gemaakt!');
            
            // Update laatste backup datum
            await this.saveLastBackupDate();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Backup mislukt: ${error.message}`);
        }
    }
    
    async restorePrivateInfo() {
        if (!this.auth.isAdmin()) {
            this.showError('Alleen administrators mogen backups herstellen');
            return;
        }
        
        // Maak file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    if (!backupData.data || !Array.isArray(backupData.data)) {
                        throw new Error('Ongeldig backup bestand');
                    }
                    
                    if (!confirm(`Weet je zeker dat je deze backup wilt herstellen? 
                    Dit zal ${backupData.data.length} privé records importeren.`)) {
                        return;
                    }
                    
                    this.showProgress('Backup herstellen...');
                    
                    // Converteer naar juist formaat
                    const priveInfoData = backupData.data.map(item => ({
                        hondId: item.hondId,
                        medischeHistorie: item.medischeHistorie || '',
                        gedragsnotities: item.gedragsnotities || '',
                        contactDierenarts: item.contactDierenarts || '',
                        voeding: item.voeding || '',
                        overigeNotities: item.overigeNotities || '',
                        vertrouwelijk: true
                    }));
                    
                    // Importeer data
                    let successCount = 0;
                    let errorCount = 0;
                    
                    for (const info of priveInfoData) {
                        try {
                            await this.db.bewaarPriveInfo(info);
                            successCount++;
                        } catch (error) {
                            console.error('Fout bij importeren privé info:', error);
                            errorCount++;
                        }
                    }
                    
                    this.hideProgress();
                    
                    if (errorCount > 0) {
                        this.showSuccess(
                            `Backup hersteld met ${successCount} succesvolle records.<br>
                            ${errorCount} records konden niet worden geïmporteerd.`
                        );
                    } else {
                        this.showSuccess(`Backup succesvol hersteld! ${successCount} records geïmporteerd.`);
                    }
                    
                    // Update laatste backup datum
                    await this.saveLastBackupDate();
                    
                } catch (error) {
                    this.hideProgress();
                    this.showError(`Herstellen mislukt: ${error.message}`);
                }
            };
            
            reader.onerror = () => {
                this.showError('Fout bij lezen backup bestand');
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    async saveLastBackupDate() {
        const backupInfo = {
            lastBackup: new Date().toISOString(),
            backupBy: this.auth.getCurrentUser()?.username || 'unknown'
        };
        
        localStorage.setItem('lastPrivateInfoBackup', JSON.stringify(backupInfo));
        await this.updateLastBackupDate();
    }
    
    async updateLastBackupDate() {
        const lastBackupElement = document.getElementById('lastBackupDate');
        if (!lastBackupElement) return;
        
        const backupInfo = JSON.parse(localStorage.getItem('lastPrivateInfoBackup'));
        
        if (backupInfo && backupInfo.lastBackup) {
            const date = new Date(backupInfo.lastBackup);
            lastBackupElement.textContent = `${date.toLocaleDateString('nl-NL')} (door ${backupInfo.backupBy})`;
        } else {
            lastBackupElement.textContent = 'Nog geen backup';
        }
    }
}