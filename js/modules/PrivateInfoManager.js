/**
 * Privé Informatie Module
 * Beheert vertrouwelijke informatie over honden
 */

class PrivateInfoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.currentHondId = null;
        this.currentPriveInfo = null;
        this.hondenCache = []; // Cache voor honden voor autocomplete
        this.translations = {
            nl: {
                // Modal titels
                privateInfo: "Privé Informatie",
                privateNotes: "Privé Notities",
                notesPlaceholder: "Voer hier alle vertrouwelijke informatie in...",
                
                // Selectie sectie
                selectDog: "Selecteer Hond",
                dog: "Hond",
                chooseDog: "Kies een hond...",
                typeDogName: "Typ hondennaam...",
                loadInfo: "Info Laden",
                
                // Beveiligingsinfo
                securityInfo: "Beveiligingsinfo",
                privateStorage: "Alle informatie wordt privaat opgeslagen in uw browser",
                
                // Knoppen
                clear: "Wissen",
                save: "Opslaan",
                backup: "Backup",
                restore: "Restore",
                
                // Alerts
                selectDogFirst: "Selecteer eerst een hond",
                loadingInfo: "Privé info laden...",
                noInfoFound: "Geen privé informatie gevonden voor deze hond. U kunt nieuwe informatie toevoegen.",
                loadFailed: "Laden mislukt: ",
                dogNotFound: "Hond niet gevonden in database",
                dogSelectionRequired: "Selecteer een hond uit de lijst",
                savingInfo: "Privé info opslaan...",
                saveSuccess: "Privé informatie succesvol opgeslagen!",
                saveFailed: "Opslaan mislukt: ",
                clearConfirm: "Weet je zeker dat je alle notities wilt wissen? Dit wordt niet automatisch opgeslagen.",
                fieldsCleared: "Notities gewist. Vergeet niet op te slaan als je de wijzigingen wilt bewaren.",
                makingBackup: "Backup maken...",
                backupSuccess: "Backup succesvol gemaakt!",
                backupFailed: "Backup mislukt: ",
                invalidBackup: "Ongeldig backup bestand",
                restoreConfirm: "Weet je zeker dat je deze backup wilt herstellen?",
                restoring: "Backup herstellen...",
                restoreSuccess: "Backup succesvol hersteld!",
                restoreFailed: "Herstellen mislukt: ",
                backupReadError: "Fout bij lezen backup bestand"
            },
            en: {
                // Modal titles
                privateInfo: "Private Information",
                privateNotes: "Private Notes",
                notesPlaceholder: "Enter all confidential information here...",
                
                // Selection section
                selectDog: "Select Dog",
                dog: "Dog",
                chooseDog: "Choose a dog...",
                typeDogName: "Type dog name...",
                loadInfo: "Load Info",
                
                // Security info
                securityInfo: "Security Info",
                privateStorage: "All information is privately stored in your browser",
                
                // Buttons
                clear: "Clear",
                save: "Save",
                backup: "Backup",
                restore: "Restore",
                
                // Alerts
                selectDogFirst: "Select a dog first",
                loadingInfo: "Loading private info...",
                noInfoFound: "No private information found for this dog. You can add new information.",
                loadFailed: "Loading failed: ",
                dogNotFound: "Dog not found in database",
                dogSelectionRequired: "Select a dog from the list",
                savingInfo: "Saving private info...",
                saveSuccess: "Private information successfully saved!",
                saveFailed: "Save failed: ",
                clearConfirm: "Are you sure you want to clear all notes? This will not be automatically saved.",
                fieldsCleared: "Notes cleared. Don't forget to save if you want to keep the changes.",
                makingBackup: "Making backup...",
                backupSuccess: "Backup successfully created!",
                backupFailed: "Backup failed: ",
                invalidBackup: "Invalid backup file",
                restoreConfirm: "Are you sure you want to restore this backup?",
                restoring: "Restoring backup...",
                restoreSuccess: "Backup successfully restored!",
                restoreFailed: "Restore failed: ",
                backupReadError: "Error reading backup file"
            },
            de: {
                // Modal Titel
                privateInfo: "Private Informationen",
                privateNotes: "Private Notizen",
                notesPlaceholder: "Geben Sie hier alle vertraulichen Informationen ein...",
                
                // Auswahlbereich
                selectDog: "Hund auswählen",
                dog: "Hund",
                chooseDog: "Wählen Sie einen Hund...",
                typeDogName: "Hundename eingeben...",
                loadInfo: "Info Laden",
                
                // Sicherheitsinfo
                securityInfo: "Sicherheitsinfo",
                privateStorage: "Alle Informationen werden privat in Ihrem Browser gespeichert",
                
                // Knöpfe
                clear: "Löschen",
                save: "Speichern",
                backup: "Backup",
                restore: "Wiederherstellen",
                
                // Meldungen
                selectDogFirst: "Wählen Sie zuerst einen Hund",
                loadingInfo: "Private Info wird geladen...",
                noInfoFound: "Keine privaten Informationen für diesen Hund gefunden. Sie können neue Informationen hinzufügen.",
                loadFailed: "Laden fehlgeschlagen: ",
                dogNotFound: "Hund nicht in der Datenbank gefunden",
                dogSelectionRequired: "Wählen Sie einen Hund aus der Liste",
                savingInfo: "Private Info wird gespeichert...",
                saveSuccess: "Private Informationen erfolgreich gespeichert!",
                saveFailed: "Speichern fehlgeschlagen: ",
                clearConfirm: "Sind Sie sicher, dass Sie alle Notizen löschen möchten? Dies wird nicht automatisch gespeichert.",
                fieldsCleared: "Notizen gelöscht. Vergessen Sie nicht zu speichern, wenn Sie die Änderungen behalten möchten.",
                makingBackup: "Backup wird erstellt...",
                backupSuccess: "Backup erfolgreich erstellt!",
                backupFailed: "Backup fehlgeschlagen: ",
                invalidBackup: "Ungültige Backup-Datei",
                restoreConfirm: "Sind Sie sicher, dass Sie dieses Backup wiederherstellen möchten?",
                restoring: "Backup wird wiederhergestellt...",
                restoreSuccess: "Backup erfolgreich wiederhergestellt!",
                restoreFailed: "Wiederherstellung fehlgeschlagen: ",
                backupReadError: "Fehler beim Lesen der Backup-Datei"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('privateInfoModal')) {
            this.loadPrivateInfoData();
            this.setupAutocomplete();
            if (this.currentHondId) {
                this.loadPrivateInfoForDog();
            }
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="privateInfoModal" tabindex="-1" aria-labelledby="privateInfoModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title" id="privateInfoModalLabel">
                                <i class="bi bi-lock"></i> ${t('privateInfo')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-search"></i> ${t('selectDog')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="privateHondInput" class="form-label">${t('dog')}</label>
                                                <input type="text" class="form-control" id="privateHondInput" 
                                                    placeholder="${t('typeDogName')}" autocomplete="off">
                                                <div class="autocomplete-dropdown" id="hondAutocomplete"></div>
                                                <input type="hidden" id="selectedHondId">
                                                <input type="hidden" id="selectedStamboomnr">
                                                <div class="small text-muted mt-1" id="selectedHondInfo"></div>
                                            </div>
                                            <button class="btn btn-dark w-100" id="loadPrivateInfoBtn">
                                                <i class="bi bi-eye"></i> ${t('loadInfo')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-shield"></i> ${t('securityInfo')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="small">
                                                <p><i class="bi bi-check-circle text-success"></i> ${t('privateStorage')}</p>
                                                <p><i class="bi bi-link-45deg"></i> ${this.getPermissionInfo()}</p>
                                            </div>
                                            <div class="mt-3">
                                                <button class="btn btn-outline-dark btn-sm" id="backupPrivateInfoBtn">
                                                    <i class="bi bi-download"></i> ${t('backup')}
                                                </button>
                                                <button class="btn btn-outline-dark btn-sm" id="restorePrivateInfoBtn">
                                                    <i class="bi bi-upload"></i> ${t('restore')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="bi bi-journal-text"></i> ${t('privateNotes')}</h6>
                                </div>
                                <div class="card-body">
                                    <div id="privateInfoForm">
                                        <div class="mb-3">
                                            <textarea class="form-control" id="privateNotes" rows="12" 
                                                placeholder="${t('notesPlaceholder')}" ${this.getTextareaPermission()}></textarea>
                                        </div>
                                        
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-secondary" id="clearPrivateInfoBtn" ${this.getClearButtonPermission()}>
                                                <i class="bi bi-x-circle"></i> ${t('clear')}
                                            </button>
                                            <button class="btn btn-dark" id="savePrivateInfoBtn" ${this.getSaveButtonPermission()}>
                                                <i class="bi bi-save"></i> ${t('save')}
                                            </button>
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
    
    // Permissie controle functies
    getPermissionInfo() {
        const user = window.auth?.getCurrentUser();
        if (!user) return "Login vereist voor toegang tot privé informatie";
        
        if (user.permissions?.includes('private_full')) {
            return "U heeft volledige toegang tot privé informatie";
        } else if (user.permissions?.includes('private_view')) {
            return "U heeft alleen leestoegang tot privé informatie";
        } else if (user.permissions?.includes('private_none')) {
            return "U heeft geen toegang tot privé informatie";
        }
        return "Toegangsrechten worden gecontroleerd...";
    }
    
    getTextareaPermission() {
        const user = window.auth?.getCurrentUser();
        if (!user || !user.permissions) return "disabled";
        
        if (user.permissions.includes('private_full')) {
            return "";
        }
        return "disabled";
    }
    
    getClearButtonPermission() {
        return this.getTextareaPermission(); //zelfde als textarea
    }
    
    getSaveButtonPermission() {
        return this.getTextareaPermission(); //zelfde als textarea
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
        
        this.setupAutocomplete();
    }
    
    async loadPrivateInfoData() {
        try {
            this.hondenCache = await this.db.getHonden();
            this.setupAutocomplete();
        } catch (error) {
            console.error('Fout bij laden honden data:', error);
        }
    }
    
    setupAutocomplete() {
        const input = document.getElementById('privateHondInput');
        const dropdown = document.getElementById('hondAutocomplete');
        
        if (!input || !dropdown) return;
        
        // Stijl voor dropdown
        dropdown.style.cssText = `
            position: absolute;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 0.375rem;
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            width: calc(100% - 2px);
            margin-top: -1px;
        `;
        
        input.addEventListener('input', () => {
            const query = input.value.toLowerCase().trim();
            dropdown.innerHTML = '';
            
            if (query.length < 2) {
                dropdown.style.display = 'none';
                return;
            }
            
            const filteredHonden = this.hondenCache.filter(hond => 
                hond.naam.toLowerCase().includes(query) || 
                (hond.stamboomnr && hond.stamboomnr.toLowerCase().includes(query))
            );
            
            if (filteredHonden.length === 0) {
                dropdown.innerHTML = `
                    <div class="autocomplete-item p-2 text-muted">
                        ${this.t('dogNotFound')}
                    </div>
                `;
            } else {
                filteredHonden.forEach(hond => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item p-2 border-bottom hover-bg-light';
                    item.style.cursor = 'pointer';
                    item.innerHTML = `
                        <div class="fw-bold">${hond.naam}</div>
                        <small class="text-muted">
                            ${hond.stamboomnr || 'Geen stamboomnr'} | 
                            ${hond.ras || 'Onbekend ras'} | 
                            ${hond.geslacht || 'Onbekend'}
                        </small>
                    `;
                    
                    item.addEventListener('click', () => {
                        input.value = hond.naam;
                        document.getElementById('selectedHondId').value = hond.id;
                        document.getElementById('selectedStamboomnr').value = hond.stamboomnr || '';
                        
                        const infoDiv = document.getElementById('selectedHondInfo');
                        if (infoDiv) {
                            infoDiv.innerHTML = `
                                <span class="text-success">
                                    <i class="bi bi-check-circle"></i> Geselecteerd: 
                                    ${hond.stamboomnr ? hond.stamboomnr + ' | ' : ''}
                                    ${hond.ras ? hond.ras + ' | ' : ''}
                                    Geb: ${hond.geboortedatum || 'onbekend'}
                                </span>
                            `;
                        }
                        
                        dropdown.style.display = 'none';
                    });
                    
                    dropdown.appendChild(item);
                });
            }
            
            if (filteredHonden.length > 0) {
                dropdown.style.display = 'block';
                const inputRect = input.getBoundingClientRect();
                dropdown.style.width = inputRect.width + 'px';
                dropdown.style.top = (inputRect.bottom + window.scrollY) + 'px';
                dropdown.style.left = inputRect.left + 'px';
            }
        });
        
        // Verberg dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // Toon dropdown bij focus (als er al tekst staat)
        input.addEventListener('focus', () => {
            if (input.value.length >= 2) {
                input.dispatchEvent(new Event('input'));
            }
        });
    }
    
    async loadPrivateInfoForDog() {
        const t = this.t.bind(this);
        const hondInput = document.getElementById('privateHondInput');
        const selectedHondId = document.getElementById('selectedHondId').value;
        const selectedStamboomnr = document.getElementById('selectedStamboomnr').value;
        
        if (!hondInput.value.trim() || !selectedHondId) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        // Verifieer dat de ingevoerde hond bestaat in cache
        const selectedHond = this.hondenCache.find(h => 
            h.id.toString() === selectedHondId && 
            h.naam.toLowerCase() === hondInput.value.trim().toLowerCase()
        );
        
        if (!selectedHond) {
            this.showError(t('dogSelectionRequired'));
            return;
        }
        
        this.currentHondId = parseInt(selectedHondId);
        
        this.showProgress(t('loadingInfo'));
        
        try {
            // Gebruik stamboomnr voor privé info opslag (zoals in database)
            this.currentPriveInfo = await this.db.getPriveInfoVoorStamboomnr(selectedStamboomnr);
            
            this.hideProgress();
            this.displayPrivateInfo();
            this.updatePrivateInfoHeader(selectedHond);
            
        } catch (error) {
            this.hideProgress();
            
            if (error.message.includes('niet gevonden') || !this.currentPriveInfo) {
                this.currentPriveInfo = null;
                this.displayPrivateInfo();
                this.showInfo(t('noInfoFound'));
            } else {
                this.showError(`${t('loadFailed')}${error.message}`);
            }
        }
    }
    
    displayPrivateInfo() {
        const notesTextarea = document.getElementById('privateNotes');
        if (!notesTextarea) return;
        
        notesTextarea.value = '';
        
        if (this.currentPriveInfo) {
            notesTextarea.value = this.currentPriveInfo.privateNotes || '';
        }
        
        // Update permissions na laden
        const user = window.auth?.getCurrentUser();
        if (user && user.permissions) {
            if (!user.permissions.includes('private_full')) {
                notesTextarea.setAttribute('disabled', 'disabled');
                document.getElementById('clearPrivateInfoBtn').setAttribute('disabled', 'disabled');
                document.getElementById('savePrivateInfoBtn').setAttribute('disabled', 'disabled');
            }
        }
    }
    
    updatePrivateInfoHeader(hond) {
        const modalTitle = document.querySelector('#privateInfoModal .modal-title');
        if (modalTitle && hond) {
            modalTitle.innerHTML = `
                <i class="bi bi-lock"></i> ${this.t('privateInfo')} - 
                ${hond.naam} 
                <small class="text-muted">(${hond.stamboomnr || 'Geen stamboomnr'})</small>
            `;
        }
    }
    
    async savePrivateInfo() {
        const t = this.t.bind(this);
        
        // Controleer permissions
        const user = window.auth?.getCurrentUser();
        if (!user || !user.permissions?.includes('private_full')) {
            this.showError("U heeft geen rechten om privé informatie op te slaan");
            return;
        }
        
        const hondInput = document.getElementById('privateHondInput');
        const selectedHondId = document.getElementById('selectedHondId').value;
        const selectedStamboomnr = document.getElementById('selectedStamboomnr').value;
        
        if (!hondInput.value.trim() || !selectedHondId) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.showProgress(t('savingInfo'));
        
        try {
            // Verifieer dat de hond nog steeds bestaat
            const selectedHond = this.hondenCache.find(h => 
                h.id.toString() === selectedHondId && 
                h.stamboomnr === selectedStamboomnr
            );
            
            if (!selectedHond) {
                throw new Error(t('dogNotFound'));
            }
            
            const priveInfo = {
                stamboomnr: selectedStamboomnr,
                privateNotes: document.getElementById('privateNotes').value.trim(),
                vertrouwelijk: true
            };
            
            await this.db.bewaarPriveInfo(priveInfo);
            
            this.hideProgress();
            this.showSuccess(t('saveSuccess'));
            
            // Herlaad de info na opslaan
            this.currentPriveInfo = await this.db.getPriveInfoVoorStamboomnr(selectedStamboomnr);
            this.displayPrivateInfo();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('saveFailed')}${error.message}`);
        }
    }
    
    clearPrivateInfo() {
        const t = this.t.bind(this);
        
        // Controleer permissions
        const user = window.auth?.getCurrentUser();
        if (!user || !user.permissions?.includes('private_full')) {
            this.showError("U heeft geen rechten om privé informatie te wissen");
            return;
        }
        
        if (!confirm(t('clearConfirm'))) {
            return;
        }
        
        document.getElementById('privateNotes').value = '';
        
        this.showSuccess(t('fieldsCleared'));
    }
    
    async backupPrivateInfo() {
        const t = this.t.bind(this);
        
        // Controleer permissions
        const user = window.auth?.getCurrentUser();
        if (!user || !user.permissions?.includes('private_full')) {
            this.showError("U heeft geen rechten om backups te maken");
            return;
        }
        
        this.showProgress(t('makingBackup'));
        
        try {
            const allPriveInfo = await this.db.getAllPriveInfo();
            const honden = await this.db.getHonden();
            
            const enrichedData = allPriveInfo.map(info => {
                const hond = honden.find(h => h.stamboomnr === info.stamboomnr);
                return {
                    stamboomnr: info.stamboomnr,
                    privateNotes: info.privateNotes || '',
                    hondNaam: hond ? hond.naam : 'Onbekend',
                    hondChipnummer: hond ? hond.chipnummer : 'Onbekend'
                };
            });
            
            const backupData = {
                backupDatum: new Date().toISOString(),
                aantalRecords: enrichedData.length,
                data: enrichedData
            };
            
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `prive-info-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.hideProgress();
            this.showSuccess(t('backupSuccess'));
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('backupFailed')}${error.message}`);
        }
    }
    
    async restorePrivateInfo() {
        const t = this.t.bind(this);
        
        // Controleer permissions
        const user = window.auth?.getCurrentUser();
        if (!user || !user.permissions?.includes('private_full')) {
            this.showError("U heeft geen rechten om backups te herstellen");
            return;
        }
        
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
                        throw new Error(t('invalidBackup'));
                    }
                    
                    if (!confirm(t('restoreConfirm'))) {
                        return;
                    }
                    
                    this.showProgress(t('restoring'));
                    
                    const priveInfoData = backupData.data.map(item => ({
                        stamboomnr: item.stamboomnr,
                        privateNotes: item.privateNotes || '',
                        vertrouwelijk: true
                    }));
                    
                    let successCount = 0;
                    let errorCount = 0;
                    
                    for (const info of priveInfoData) {
                        try {
                            // Verifieer dat de hond bestaat voordat we privé info toevoegen
                            const hond = await this.db.getHondByStamboomnr(info.stamboomnr);
                            if (hond) {
                                await this.db.bewaarPriveInfo(info);
                                successCount++;
                            } else {
                                console.warn(`Hond met stamboomnr ${info.stamboomnr} niet gevonden, overslaan...`);
                                errorCount++;
                            }
                        } catch (error) {
                            console.error('Fout bij importeren privé info:', error);
                            errorCount++;
                        }
                    }
                    
                    this.hideProgress();
                    
                    if (errorCount > 0) {
                        this.showInfo(`${successCount} records hersteld, ${errorCount} mislukt`);
                    } else {
                        this.showSuccess(t('restoreSuccess'));
                    }
                    
                } catch (error) {
                    this.hideProgress();
                    this.showError(`${t('restoreFailed')}${error.message}`);
                }
            };
            
            reader.onerror = () => {
                this.showError(t('backupReadError'));
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    // Helper method voor bestandsdownload
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
}