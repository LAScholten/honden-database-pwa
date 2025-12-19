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
        this.translations = {
            nl: {
                // Modal titels
                privateInfo: "Privé Informatie",
                fullAccess: "Volledige toegang",
                viewOnly: "Alleen bekijken",
                adminAccess: "U kunt alle privé informatie bewerken en bekijken.",
                userAccess: "U kunt privé informatie alleen bekijken, niet bewerken.",
                
                // Selectie sectie
                selectDog: "Selecteer Hond",
                dog: "Hond",
                chooseDog: "Kies een hond...",
                loadInfo: "Info Laden",
                
                // Beveiligingsinfo
                securityInfo: "Beveiligingsinfo",
                localStorage: "Alle privé informatie wordt lokaal opgeslagen",
                loginRequired: "Geen toegang zonder inloggen",
                passwordExport: "Export met wachtwoordbeveiliging mogelijk",
                lastBackup: "Laatste backup",
                noBackup: "Nog geen backup",
                backupPrivate: "Backup Privé Info",
                restoreBackup: "Restore Backup",
                
                // Notities sectie
                privateNotes: "Privé Notities",
                medicalHistory: "Medische Historie",
                medicalPlaceholder: "Vaccinaties, operaties, medicatie...",
                behaviorNotes: "Gedragsnotities",
                behaviorPlaceholder: "Gedrag, training, specifieke gewoontes...",
                vetContact: "Dierenarts Contact",
                vetPlaceholder: "Naam, telefoon, specialisaties...",
                diet: "Voeding & Dieet",
                dietPlaceholder: "Speciaal dieet, allergieën, voedingsschema...",
                otherNotes: "Overige Notities",
                otherPlaceholder: "Andere vertrouwelijke informatie...",
                
                // Waarschuwingen
                confidentialInfo: "Deze informatie is vertrouwelijk en alleen zichtbaar voor geautoriseerde gebruikers.",
                viewOnlyInfo: "U kunt deze informatie alleen bekijken. Alleen administrators kunnen wijzigingen aanbrengen.",
                clear: "Wissen",
                save: "Opslaan",
                
                // Alerts
                selectDogFirst: "Selecteer eerst een hond",
                loadingInfo: "Privé info laden...",
                noInfoFound: "Geen privé informatie gevonden voor deze hond. U kunt nieuwe informatie tovoegen (admin alleen).",
                loadFailed: "Laden mislukt: ",
                dogNotFound: "Hond niet gevonden in database",
                adminOnlySave: "Alleen administrators mogen privé informatie opslaan",
                savingInfo: "Privé info opslaan...",
                saveSuccess: "Privé informatie succesvol opgeslagen!",
                saveFailed: "Opslaan mislukt: ",
                clearConfirm: "Weet je zeker dat je alle velden wilt wissen? Dit wordt niet automatisch opgeslagen.",
                fieldsCleared: "Velden gewist. Vergeet niet op te slaan als je de wijzigingen wilt bewaren.",
                makingBackup: "Backup maken...",
                backupSuccess: "Backup succesvol gemaakt!",
                backupFailed: "Backup mislukt: ",
                adminOnlyRestore: "Alleen administrators mogen backups herstellen",
                invalidBackup: "Ongeldig backup bestand",
                restoreConfirm: "Weet je zeker dat je deze backup wilt herstellen? Dit zal privé records importeren.",
                restoring: "Backup herstellen...",
                restoreSuccess: "Backup succesvol hersteld! records geïmporteerd.",
                restorePartial: "Backup hersteld met succesvolle records. records konden niet worden geïmporteerd.",
                restoreFailed: "Herstellen mislukt: ",
                backupReadError: "Fout bij lezen backup bestand",
                
                // Export/Import
                privateInfoBackup: "prive_info_backup",
                numberOfRecords: "aantalRecords"
            },
            en: {
                // Modal titles
                privateInfo: "Private Information",
                fullAccess: "Full access",
                viewOnly: "View only",
                adminAccess: "You can edit and view all private information.",
                userAccess: "You can only view private information, not edit it.",
                
                // Selection section
                selectDog: "Select Dog",
                dog: "Dog",
                chooseDog: "Choose a dog...",
                loadInfo: "Load Info",
                
                // Security info
                securityInfo: "Security Info",
                localStorage: "All private information is stored locally",
                loginRequired: "No access without login",
                passwordExport: "Export with password protection possible",
                lastBackup: "Last backup",
                noBackup: "No backup yet",
                backupPrivate: "Backup Private Info",
                restoreBackup: "Restore Backup",
                
                // Notes section
                privateNotes: "Private Notes",
                medicalHistory: "Medical History",
                medicalPlaceholder: "Vaccinations, surgeries, medication...",
                behaviorNotes: "Behavior Notes",
                behaviorPlaceholder: "Behavior, training, specific habits...",
                vetContact: "Vet Contact",
                vetPlaceholder: "Name, phone, specializations...",
                diet: "Diet & Nutrition",
                dietPlaceholder: "Special diet, allergies, feeding schedule...",
                otherNotes: "Other Notes",
                otherPlaceholder: "Other confidential information...",
                
                // Warnings
                confidentialInfo: "This information is confidential and only visible to authorized users.",
                viewOnlyInfo: "You can only view this information. Only administrators can make changes.",
                clear: "Clear",
                save: "Save",
                
                // Alerts
                selectDogFirst: "Select a dog first",
                loadingInfo: "Loading private info...",
                noInfoFound: "No private information found for this dog. You can add new information (admin only).",
                loadFailed: "Loading failed: ",
                dogNotFound: "Dog not found in database",
                adminOnlySave: "Only administrators can save private information",
                savingInfo: "Saving private info...",
                saveSuccess: "Private information successfully saved!",
                saveFailed: "Save failed: ",
                clearConfirm: "Are you sure you want to clear all fields? This will not be automatically saved.",
                fieldsCleared: "Fields cleared. Don't forget to save if you want to keep the changes.",
                makingBackup: "Making backup...",
                backupSuccess: "Backup successfully created!",
                backupFailed: "Backup failed: ",
                adminOnlyRestore: "Only administrators can restore backups",
                invalidBackup: "Invalid backup file",
                restoreConfirm: "Are you sure you want to restore this backup? This will import private records.",
                restoring: "Restoring backup...",
                restoreSuccess: "Backup successfully restored! records imported.",
                restorePartial: "Backup restored with successful records. records could not be imported.",
                restoreFailed: "Restore failed: ",
                backupReadError: "Error reading backup file",
                
                // Export/Import
                privateInfoBackup: "private_info_backup",
                numberOfRecords: "numberOfRecords"
            },
            de: {
                // Modal Titel
                privateInfo: "Private Informationen",
                fullAccess: "Voller Zugriff",
                viewOnly: "Nur Ansehen",
                adminAccess: "Sie können alle privaten Informationen bearbeiten und ansehen.",
                userAccess: "Sie können private Informationen nur ansehen, nicht bearbeiten.",
                
                // Auswahlbereich
                selectDog: "Hund auswählen",
                dog: "Hund",
                chooseDog: "Wählen Sie einen Hund...",
                loadInfo: "Info Laden",
                
                // Sicherheitsinfo
                securityInfo: "Sicherheitsinfo",
                localStorage: "Alle privaten Informationen werden lokal gespeichert",
                loginRequired: "Kein Zugriff ohne Anmeldung",
                passwordExport: "Export mit Passwortschutz möglich",
                lastBackup: "Letztes Backup",
                noBackup: "Noch kein Backup",
                backupPrivate: "Private Info Backup",
                restoreBackup: "Backup Wiederherstellen",
                
                // Notizenbereich
                privateNotes: "Private Notizen",
                medicalHistory: "Medizinische Geschichte",
                medicalPlaceholder: "Impfungen, Operationen, Medikamente...",
                behaviorNotes: "Verhaltensnotizen",
                behaviorPlaceholder: "Verhalten, Training, spezifische Gewohnheiten...",
                vetContact: "Tierarzt Kontakt",
                vetPlaceholder: "Name, Telefon, Spezialisierungen...",
                diet: "Ernährung & Diät",
                dietPlaceholder: "Spezialdiät, Allergien, Fütterungsplan...",
                otherNotes: "Weitere Notizen",
                otherPlaceholder: "Andere vertrauliche Informationen...",
                
                // Warnungen
                confidentialInfo: "Diese Informationen sind vertraulich und nur für autorisierte Benutzer sichtbar.",
                viewOnlyInfo: "Sie können diese Informationen nur ansehen. Nur Administratoren können Änderungen vornehmen.",
                clear: "Löschen",
                save: "Speichern",
                
                // Meldungen
                selectDogFirst: "Wählen Sie zuerst einen Hund",
                loadingInfo: "Private Info wird geladen...",
                noInfoFound: "Keine privaten Informationen für diesen Hund gefunden. Sie können neue Informationen hinzufügen (nur Admin).",
                loadFailed: "Laden fehlgeschlagen: ",
                dogNotFound: "Hund nicht in der Datenbank gefunden",
                adminOnlySave: "Nur Administratoren können private Informationen speichern",
                savingInfo: "Private Info wird gespeichert...",
                saveSuccess: "Private Informationen erfolgreich gespeichert!",
                saveFailed: "Speichern fehlgeschlagen: ",
                clearConfirm: "Sind Sie sicher, dass Sie alle Felder löschen möchten? Dies wird nicht automatisch gespeichert.",
                fieldsCleared: "Felder gelöscht. Vergessen Sie nicht zu speichern, wenn Sie die Änderungen behalten möchten.",
                makingBackup: "Backup wird erstellt...",
                backupSuccess: "Backup erfolgreich erstellt!",
                backupFailed: "Backup fehlgeschlagen: ",
                adminOnlyRestore: "Nur Administratoren können Backups wiederherstellen",
                invalidBackup: "Ungültige Backup-Datei",
                restoreConfirm: "Sind Sie sicher, dass Sie dieses Backup wiederherstellen möchten? Dadurch werden private Datensätze importiert.",
                restoring: "Backup wird wiederhergestellt...",
                restoreSuccess: "Backup erfolgreich wiederhergestellt! Datensätze importiert.",
                restorePartial: "Backup mit erfolgreichen Datensätzen wiederhergestellt. Datensätze konnten nicht importiert werden.",
                restoreFailed: "Wiederherstellung fehlgeschlagen: ",
                backupReadError: "Fehler beim Lesen der Backup-Datei",
                
                // Export/Import
                privateInfoBackup: "private_info_backup",
                numberOfRecords: "anzahlDatensaetze"
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
            if (this.currentHondId) {
                this.loadPrivateInfoForDog();
            }
        }
    }
    
    getModalHTML() {
        const isAdmin = this.auth.isAdmin();
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
                            <div class="alert ${isAdmin ? 'alert-info' : 'alert-warning'} mb-4">
                                <div class="d-flex">
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-${isAdmin ? 'shield-check' : 'eye'} fs-4"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <h6 class="alert-heading">${isAdmin ? t('fullAccess') : t('viewOnly')}</h6>
                                        ${isAdmin ? t('adminAccess') : t('userAccess')}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-search"></i> ${t('selectDog')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="privateHondSelect" class="form-label">${t('dog')}</label>
                                                <select class="form-select" id="privateHondSelect">
                                                    <option value="">${t('chooseDog')}</option>
                                                    <!-- Hond opties worden hier ingeladen -->
                                                </select>
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
                                                <p><i class="bi bi-check-circle text-success"></i> ${t('localStorage')}</p>
                                                <p><i class="bi bi-check-circle text-success"></i> ${t('loginRequired')}</p>
                                                <p><i class="bi bi-check-circle text-success"></i> ${t('passwordExport')}</p>
                                                <p><i class="bi bi-clock-history"></i> ${t('lastBackup')}: <span id="lastBackupDate">${t('noBackup')}</span></p>
                                            </div>
                                            <div class="mt-3">
                                                <button class="btn btn-outline-dark btn-sm" id="backupPrivateInfoBtn">
                                                    <i class="bi bi-download"></i> ${t('backupPrivate')}
                                                </button>
                                                ${isAdmin ? `
                                                <button class="btn btn-outline-dark btn-sm" id="restorePrivateInfoBtn">
                                                    <i class="bi bi-upload"></i> ${t('restoreBackup')}
                                                </button>
                                                ` : ''}
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
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="privateMedical" class="form-label">${t('medicalHistory')}</label>
                                                    <textarea class="form-control" id="privateMedical" rows="4" ${!isAdmin ? 'readonly' : ''}
                                                        placeholder="${t('medicalPlaceholder')}"></textarea>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="privateBehavior" class="form-label">${t('behaviorNotes')}</label>
                                                    <textarea class="form-control" id="privateBehavior" rows="4" ${!isAdmin ? 'readonly' : ''}
                                                        placeholder="${t('behaviorPlaceholder')}"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="privateVet" class="form-label">${t('vetContact')}</label>
                                                    <textarea class="form-control" id="privateVet" rows="3" ${!isAdmin ? 'readonly' : ''}
                                                        placeholder="${t('vetPlaceholder')}"></textarea>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="privateDiet" class="form-label">${t('diet')}</label>
                                                    <textarea class="form-control" id="privateDiet" rows="3" ${!isAdmin ? 'readonly' : ''}
                                                        placeholder="${t('dietPlaceholder')}"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="privateOther" class="form-label">${t('otherNotes')}</label>
                                            <textarea class="form-control" id="privateOther" rows="3" ${!isAdmin ? 'readonly' : ''}
                                                placeholder="${t('otherPlaceholder')}"></textarea>
                                        </div>
                                        
                                        ${isAdmin ? `
                                        <div class="alert alert-warning">
                                            <i class="bi bi-exclamation-triangle"></i>
                                            ${t('confidentialInfo')}
                                        </div>
                                        
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-secondary" id="clearPrivateInfoBtn">
                                                <i class="bi bi-x-circle"></i> ${t('clear')}
                                            </button>
                                            <button class="btn btn-dark" id="savePrivateInfoBtn">
                                                <i class="bi bi-save"></i> ${t('save')}
                                            </button>
                                        </div>
                                        ` : `
                                        <div class="alert alert-info">
                                            <i class="bi bi-info-circle"></i>
                                            ${t('viewOnlyInfo')}
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
        const t = this.t.bind(this);
        
        try {
            const honden = await this.db.getHonden();
            const hondSelect = document.getElementById('privateHondSelect');
            if (hondSelect) {
                hondSelect.innerHTML = `<option value="">${t('chooseDog')}</option>`;
                honden.forEach(hond => {
                    const option = document.createElement('option');
                    option.value = hond.id;
                    option.textContent = `${hond.naam} (${hond.chipnummer})`;
                    hondSelect.appendChild(option);
                });
            }
            
            await this.updateLastBackupDate();
            
        } catch (error) {
            console.error('Fout bij laden privé info data:', error);
        }
    }
    
    async loadPrivateInfoForDog() {
        const t = this.t.bind(this);
        const hondId = document.getElementById('privateHondSelect').value;
        
        if (!hondId) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.currentHondId = parseInt(hondId);
        
        this.showProgress(t('loadingInfo'));
        
        try {
            this.currentPriveInfo = await this.db.getPriveInfoVoorHond(this.currentHondId);
            
            const honden = await this.db.getHonden();
            const selectedHond = honden.find(h => h.id === this.currentHondId);
            
            if (!selectedHond) {
                throw new Error(t('dogNotFound'));
            }
            
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
        const isAdmin = this.auth.isAdmin();
        
        document.getElementById('privateMedical').value = '';
        document.getElementById('privateBehavior').value = '';
        document.getElementById('privateVet').value = '';
        document.getElementById('privateDiet').value = '';
        document.getElementById('privateOther').value = '';
        
        if (this.currentPriveInfo) {
            document.getElementById('privateMedical').value = this.currentPriveInfo.medischeHistorie || '';
            document.getElementById('privateBehavior').value = this.currentPriveInfo.gedragsnotities || '';
            document.getElementById('privateVet').value = this.currentPriveInfo.contactDierenarts || '';
            document.getElementById('privateDiet').value = this.currentPriveInfo.voeding || '';
            document.getElementById('privateOther').value = this.currentPriveInfo.overigeNotities || '';
        }
        
        const textareas = document.querySelectorAll('#privateInfoForm textarea');
        textareas.forEach(textarea => {
            textarea.readOnly = !isAdmin;
        });
    }
    
    updatePrivateInfoHeader(hond) {
        const modalTitle = document.querySelector('#privateInfoModal .modal-title');
        if (modalTitle && hond) {
            modalTitle.innerHTML = `<i class="bi bi-lock"></i> ${this.t('privateInfo')} - ${hond.naam}`;
        }
    }
    
    async savePrivateInfo() {
        const t = this.t.bind(this);
        
        if (!this.auth.isAdmin()) {
            this.showError(t('adminOnlySave'));
            return;
        }
        
        if (!this.currentHondId) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.showProgress(t('savingInfo'));
        
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
            this.showSuccess(t('saveSuccess'));
            
            await this.loadPrivateInfoForDog();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('saveFailed')}${error.message}`);
        }
    }
    
    clearPrivateInfo() {
        const t = this.t.bind(this);
        
        if (!this.auth.isAdmin()) {
            this.showError(t('adminOnlySave'));
            return;
        }
        
        if (!confirm(t('clearConfirm'))) {
            return;
        }
        
        document.getElementById('privateMedical').value = '';
        document.getElementById('privateBehavior').value = '';
        document.getElementById('privateVet').value = '';
        document.getElementById('privateDiet').value = '';
        document.getElementById('privateOther').value = '';
        
        this.showSuccess(t('fieldsCleared'));
    }
    
    async backupPrivateInfo() {
        const t = this.t.bind(this);
        this.showProgress(t('makingBackup'));
        
        try {
            const allPriveInfo = await this.db.getAllPriveInfo();
            const honden = await this.db.getHonden();
            
            const enrichedData = allPriveInfo.map(info => {
                const hond = honden.find(h => h.id === info.hondId);
                return {
                    ...info,
                    hondNaam: hond ? hond.naam : t('unknown'),
                    hondChipnummer: hond ? hond.chipnummer : t('unknown')
                };
            });
            
            const backupData = {
                metadata: {
                    type: t('privateInfoBackup'),
                    backupDatum: new Date().toISOString(),
                    backupDoor: this.auth.getCurrentUser()?.username || 'unknown',
                    [t('numberOfRecords')]: enrichedData.length
                },
                data: enrichedData
            };
            
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `prive-info-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.hideProgress();
            this.showSuccess(t('backupSuccess'));
            
            await this.saveLastBackupDate();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('backupFailed')}${error.message}`);
        }
    }
    
    async restorePrivateInfo() {
        const t = this.t.bind(this);
        
        if (!this.auth.isAdmin()) {
            this.showError(t('adminOnlyRestore'));
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
                    
                    if (!confirm(`${t('restoreConfirm')} ${backupData.data.length}`)) {
                        return;
                    }
                    
                    this.showProgress(t('restoring'));
                    
                    const priveInfoData = backupData.data.map(item => ({
                        hondId: item.hondId,
                        medischeHistorie: item.medischeHistorie || '',
                        gedragsnotities: item.gedragsnotities || '',
                        contactDierenarts: item.contactDierenarts || '',
                        voeding: item.voeding || '',
                        overigeNotities: item.overigeNotities || '',
                        vertrouwelijk: true
                    }));
                    
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
                            `${t('restorePartial')}<br>
                            ${successCount} ${t('successful')}<br>
                            ${errorCount} ${t('failed')}`
                        );
                    } else {
                        this.showSuccess(`${t('restoreSuccess')} ${successCount}`);
                    }
                    
                    await this.saveLastBackupDate();
                    
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
    
    async saveLastBackupDate() {
        const backupInfo = {
            lastBackup: new Date().toISOString(),
            backupBy: this.auth.getCurrentUser()?.username || 'unknown'
        };
        
        localStorage.setItem('lastPrivateInfoBackup', JSON.stringify(backupInfo));
        await this.updateLastBackupDate();
    }
    
    async updateLastBackupDate() {
        const t = this.t.bind(this);
        const lastBackupElement = document.getElementById('lastBackupDate');
        if (!lastBackupElement) return;
        
        const backupInfo = JSON.parse(localStorage.getItem('lastPrivateInfoBackup'));
        
        if (backupInfo && backupInfo.lastBackup) {
            const date = new Date(backupInfo.lastBackup);
            lastBackupElement.textContent = `${date.toLocaleDateString(this.currentLang)} (${t('by')} ${backupInfo.backupBy})`;
        } else {
            lastBackupElement.textContent = t('noBackup');
        }
    }

// Global export
if (typeof window !== 'undefined') {
    window.PrivateInfoManager = PrivateInfoManager;
}
