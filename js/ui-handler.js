/**
 * UI Handler Module
 * Beheert alle UI interacties en modal weergave
 */

class UIHandler extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.modalsContainer = null;
        this.translations = {
            nl: {
                // Menu items
                dashboard: "Dashboard",
                addDog: "Hond Toevoegen",
                searchDog: "Hond Zoeken",
                privateInfo: "Privé Informatie",
                importExport: "Import/Export",
                settings: "Instellingen",
                logout: "Uitloggen",
                
                // Alerts
                loading: "Laden...",
                error: "Fout",
                success: "Succes",
                warning: "Waarschuwing",
                
                // Modal titels
                confirm: "Bevestigen",
                information: "Informatie"
            },
            en: {
                dashboard: "Dashboard",
                addDog: "Add Dog",
                searchDog: "Search Dog",
                privateInfo: "Private Information",
                importExport: "Import/Export",
                settings: "Settings",
                logout: "Logout",
                
                loading: "Loading...",
                error: "Error",
                success: "Success",
                warning: "Warning",
                
                confirm: "Confirm",
                information: "Information"
            },
            de: {
                dashboard: "Dashboard",
                addDog: "Hund Hinzufügen",
                searchDog: "Hund Suchen",
                privateInfo: "Private Informationen",
                importExport: "Import/Export",
                settings: "Einstellungen",
                logout: "Ausloggen",
                
                loading: "Laden...",
                error: "Fehler",
                success: "Erfolg",
                warning: "Warnung",
                
                confirm: "Bestätigen",
                information: "Information"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    init() {
        console.log('UIHandler initialiseren...');
        this.setupModalsContainer();
        this.setupMenuEvents();
        this.setupGlobalEvents();
    }
    
    setupModalsContainer() {
        // Controleer of modals container bestaat, anders maak aan
        this.modalsContainer = document.getElementById('modalsContainer');
        if (!this.modalsContainer) {
            this.modalsContainer = document.createElement('div');
            this.modalsContainer.id = 'modalsContainer';
            document.body.appendChild(this.modalsContainer);
        }
    }
    
    setupMenuEvents() {
        console.log('Menu events setup...');
        
        // Delegated event listener voor alle menu knoppen
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Hond toevoegen via menu of dashboard
            if (target.id === 'addDogBtn' || target.closest('#addDogBtn') || 
                (target.closest('[data-action="add-dog"]'))) {
                e.preventDefault();
                this.showAddDogModal();
            }
            
            // Hond zoeken via menu of dashboard
            if (target.id === 'searchDogBtn' || target.closest('#searchDogBtn') || 
                (target.closest('[data-action="search-dog"]'))) {
                e.preventDefault();
                this.showSearchModal();
            }
            
            // Privé info via menu of dashboard
            if (target.id === 'privateInfoBtn' || target.closest('#privateInfoBtn') || 
                (target.closest('[data-action="private-info"]'))) {
                e.preventDefault();
                this.showPrivateInfoModal();
            }
            
            // Import/Export
            if (target.closest('[data-action="import-export"]')) {
                e.preventDefault();
                this.showImportExportModal();
            }
            
            // Instellingen
            if (target.closest('[data-action="settings"]')) {
                e.preventDefault();
                this.showSettingsModal();
            }
            
            // Uitloggen
            if (target.closest('[data-action="logout"]')) {
                e.preventDefault();
                this.confirmLogout();
            }
        });
        
        // Taal switcher
        const languageSwitcher = document.getElementById('languageSwitcher');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('change', (e) => {
                this.handleLanguageChange(e.target.value);
            });
        }
    }
    
    setupGlobalEvents() {
        // Escape toets om modals te sluiten
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Klik buiten modal om te sluiten
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                const modal = bootstrap.Modal.getInstance(e.target);
                if (modal) {
                    modal.hide();
                }
            }
        });
    }
    
    // ========== MODAL FUNCTIES ==========
    
    showAddDogModal() {
        console.log('Toon hond toevoegen modal');
        
        if (!window.dogManager) {
            this.showError('DogManager niet beschikbaar. Controleer of DogManager.js correct is geladen.');
            return;
        }
        
        // Verwijder bestaande modal
        this.removeModal('addDogModal');
        
        // Genereer modal HTML via DogManager
        const modalHTML = window.dogManager.getModalHTML();
        this.modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        // Toon modal
        const modalElement = document.getElementById('addDogModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Setup events voor deze modal
            window.dogManager.setupEvents();
            
            // Cleanup bij sluiten
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
        }
    }
    
    showSearchModal() {
        console.log('Toon zoekmodal');
        
        if (!window.searchManager) {
            this.showError('SearchManager niet beschikbaar. Controleer of SearchManager.js correct is geladen.');
            return;
        }
        
        // Verwijder bestaande modal
        this.removeModal('searchModal');
        
        // Genereer modal HTML via SearchManager
        const modalHTML = window.searchManager.getSearchModalHTML();
        this.modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        // Toon modal
        const modalElement = document.getElementById('searchModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Setup events voor deze modal
            window.searchManager.setupSearchEvents();
            
            // Cleanup bij sluiten
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
        }
    }
    
    showPrivateInfoModal() {
        console.log('Toon privé info modal');
        
        if (!window.privateInfoManager) {
            this.showError('PrivateInfoManager niet beschikbaar. Controleer of PrivateInfoManager.js correct is geladen.');
            return;
        }
        
        // Verwijder bestaande modal
        this.removeModal('privateInfoModal');
        
        // Genereer modal HTML via PrivateInfoManager
        const modalHTML = window.privateInfoManager.getModalHTML();
        this.modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        // Toon modal
        const modalElement = document.getElementById('privateInfoModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Setup events voor deze modal
            window.privateInfoManager.setupEvents();
            window.privateInfoManager.loadPrivateInfoData();
            
            // Cleanup bij sluiten
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
        }
    }
    
    showImportExportModal() {
        console.log('Toon import/export modal');
        
        // Verwijder bestaande modal
        this.removeModal('importExportModal');
        
        const modalHTML = `
            <div class="modal fade" id="importExportModal" tabindex="-1" aria-labelledby="importExportModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="importExportModalLabel">
                                <i class="bi bi-arrow-left-right"></i> ${this.t('importExport')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-download"></i> Export</h6>
                                        </div>
                                        <div class="card-body">
                                            <p>Exporteer alle database gegevens naar een JSON bestand.</p>
                                            <button class="btn btn-primary w-100" id="exportDataBtn">
                                                <i class="bi bi-download"></i> Exporteer Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-upload"></i> Import</h6>
                                        </div>
                                        <div class="card-body">
                                            <p>Importeer gegevens vanuit een JSON backup bestand.</p>
                                            <div class="mb-3">
                                                <input type="file" class="form-control" id="importFile" accept=".json">
                                            </div>
                                            <button class="btn btn-success w-100" id="importDataBtn">
                                                <i class="bi bi-upload"></i> Importeer Data
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
        
        this.modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        const modalElement = document.getElementById('importExportModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Setup events
            document.getElementById('exportDataBtn').addEventListener('click', () => {
                this.exportData();
            });
            
            document.getElementById('importDataBtn').addEventListener('click', () => {
                this.importData();
            });
            
            // Cleanup
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
        }
    }
    
    showSettingsModal() {
        console.log('Toon instellingen modal');
        
        // Verwijder bestaande modal
        this.removeModal('settingsModal');
        
        const modalHTML = `
            <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title" id="settingsModalLabel">
                                <i class="bi bi-gear"></i> ${this.t('settings')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="languageSelect" class="form-label">Taal / Language</label>
                                <select class="form-select" id="languageSelect">
                                    <option value="nl" ${this.currentLang === 'nl' ? 'selected' : ''}>Nederlands</option>
                                    <option value="en" ${this.currentLang === 'en' ? 'selected' : ''}>English</option>
                                    <option value="de" ${this.currentLang === 'de' ? 'selected' : ''}>Deutsch</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Database Info</label>
                                <div class="card">
                                    <div class="card-body">
                                        <button class="btn btn-outline-info btn-sm w-100" id="showDatabaseInfoBtn">
                                            <i class="bi bi-info-circle"></i> Toon Database Informatie
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Geavanceerd</label>
                                <div class="card">
                                    <div class="card-body">
                                        <button class="btn btn-outline-warning btn-sm w-100 mb-2" id="clearCacheBtn">
                                            <i class="bi bi-trash"></i> Wis Browser Cache
                                        </button>
                                        <button class="btn btn-outline-danger btn-sm w-100" id="clearDatabaseBtn">
                                            <i class="bi bi-exclamation-triangle"></i> Wis Alle Data
                                        </button>
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
        
        this.modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        const modalElement = document.getElementById('settingsModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Setup events
            document.getElementById('languageSelect').addEventListener('change', (e) => {
                this.handleLanguageChange(e.target.value);
            });
            
            document.getElementById('showDatabaseInfoBtn').addEventListener('click', () => {
                this.showDatabaseInfo();
            });
            
            document.getElementById('clearCacheBtn').addEventListener('click', () => {
                this.clearCache();
            });
            
            document.getElementById('clearDatabaseBtn').addEventListener('click', () => {
                this.clearDatabase();
            });
            
            // Cleanup
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
        }
    }
    
    // ========== HELPER FUNCTIES ==========
    
    removeModal(modalId) {
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }
    
    handleLanguageChange(lang) {
        localStorage.setItem('appLanguage', lang);
        this.updateLanguage(lang);
        
        // Update alle managers
        if (window.dogManager) window.dogManager.updateLanguage(lang);
        if (window.searchManager) window.searchManager.updateLanguage(lang);
        if (window.privateInfoManager) window.privateInfoManager.updateLanguage(lang);
        
        // Herlaad pagina
        window.location.reload();
    }
    
    // ========== ALERT FUNCTIES ==========
    
    showAlert(message, type = 'info', duration = 3000) {
        const alertClass = {
            'info': 'alert-info',
            'success': 'alert-success',
            'warning': 'alert-warning',
            'error': 'alert-danger'
        }[type] || 'alert-info';
        
        const icon = {
            'info': 'bi-info-circle',
            'success': 'bi-check-circle',
            'warning': 'bi-exclamation-triangle',
            'error': 'bi-exclamation-octagon'
        }[type] || 'bi-info-circle';
        
        const alertHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show position-fixed top-0 end-0 m-3" 
                 style="z-index: 9999; max-width: 400px;" role="alert">
                <div class="d-flex align-items-center">
                    <i class="bi ${icon} me-2 fs-5"></i>
                    <div class="flex-grow-1">${message}</div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </div>
        `;
        
        // Verwijder bestaande alerts eerst
        const existingAlerts = document.querySelectorAll('.alert.position-fixed');
        existingAlerts.forEach(alert => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
        
        document.body.insertAdjacentHTML('beforeend', alertHTML);
        
        // Auto-sluiten na duration
        if (duration > 0) {
            setTimeout(() => {
                const alert = document.querySelector('.alert.position-fixed:last-child');
                if (alert) {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }
            }, duration);
        }
    }
    
    showError(message) {
        this.showAlert(message, 'error', 5000);
    }
    
    showSuccess(message) {
        this.showAlert(message, 'success', 3000);
    }
    
    showInfo(message) {
        this.showAlert(message, 'info', 3000);
    }
    
    showWarning(message) {
        this.showAlert(message, 'warning', 4000);
    }
    
    // ========== CONFIRM DIALOG ==========
    
    confirmDialog(message, onConfirm, onCancel = null) {
        // Verwijder bestaande confirm modal
        this.removeModal('confirmModal');
        
        const modalHTML = `
            <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title" id="confirmModalLabel">
                                <i class="bi bi-question-circle"></i> ${this.t('confirm')}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex align-items-start">
                                <i class="bi bi-exclamation-triangle-fill text-warning fs-3 me-3"></i>
                                <div class="flex-grow-1">
                                    ${message}
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuleren</button>
                            <button type="button" class="btn btn-warning" id="confirmBtn">Bevestigen</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        const modalElement = document.getElementById('confirmModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Setup events
        document.getElementById('confirmBtn').addEventListener('click', () => {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            modal.hide();
        });
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            if (typeof onCancel === 'function') {
                onCancel();
            }
            modalElement.remove();
        });
    }
    
    // ========== DATABASE FUNCTIES ==========
    
    async exportData() {
        try {
            this.showInfo('Data exporteren...');
            
            if (typeof db !== 'undefined') {
                const exportData = await db.exportData();
                const jsonString = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `honden-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.showSuccess('Data succesvol geëxporteerd!');
            } else {
                this.showError('Database niet beschikbaar');
            }
        } catch (error) {
            console.error('Export mislukt:', error);
            this.showError(`Export mislukt: ${error.message}`);
        }
    }
    
    async importData() {
        const fileInput = document.getElementById('importFile');
        if (!fileInput.files.length) {
            this.showError('Selecteer eerst een backup bestand');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                this.showInfo('Data importeren...');
                
                const importData = JSON.parse(e.target.result);
                
                if (typeof db !== 'undefined') {
                    await db.importData(importData, true);
                    this.showSuccess('Data succesvol geïmporteerd!');
                    
                    // Herlaad pagina om wijzigingen te tonen
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    this.showError('Database niet beschikbaar');
                }
            } catch (error) {
                console.error('Import mislukt:', error);
                this.showError(`Import mislukt: ${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.showError('Fout bij lezen bestand');
        };
        
        reader.readAsText(file);
    }
    
    async showDatabaseInfo() {
        try {
            if (typeof db !== 'undefined') {
                const stats = await db.getStatistieken();
                
                const infoHTML = `
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">Database Informatie</h6>
                        </div>
                        <div class="card-body">
                            <table class="table table-sm">
                                <tr>
                                    <th>Totaal Honden:</th>
                                    <td>${stats.totaalHonden}</td>
                                </tr>
                                <tr>
                                    <th>Totaal Foto's:</th>
                                    <td>${stats.totaalFotos}</td>
                                </tr>
                                <tr>
                                    <th>Totaal Privé Info:</th>
                                    <td>${stats.totaalPriveInfo}</td>
                                </tr>
                                <tr>
                                    <th>Laatste Update:</th>
                                    <td>${new Date(stats.laatsteUpdate).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th>Database Grootte:</th>
                                    <td>${stats.databaseGrootte}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                `;
                
                this.showAlert(infoHTML, 'info', 0);
            } else {
                this.showError('Database niet beschikbaar');
            }
        } catch (error) {
            console.error('Database info ophalen mislukt:', error);
            this.showError(`Database info ophalen mislukt: ${error.message}`);
        }
    }
    
    clearCache() {
        this.confirmDialog('Weet u zeker dat u de browser cache wilt wissen?', () => {
            localStorage.clear();
            sessionStorage.clear();
            this.showSuccess('Cache gewist. Pagina wordt herladen...');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
    
    clearDatabase() {
        this.confirmDialog(
            '<strong class="text-danger">WAARSCHUWING!</strong><br><br>' +
            'Dit verwijdert ALLE data uit de database, inclusief honden, foto\'s en privé informatie.<br>' +
            'Deze actie kan niet ongedaan worden gemaakt!<br><br>' +
            'Weet u zeker dat u alle data wilt verwijderen?',
            async () => {
                try {
                    this.showInfo('Database legen...');
                    
                    if (typeof db !== 'undefined') {
                        await db.wisAlleData();
                        this.showSuccess('Alle data succesvol verwijderd! Pagina wordt herladen...');
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        this.showError('Database niet beschikbaar');
                    }
                } catch (error) {
                    console.error('Database legen mislukt:', error);
                    this.showError(`Database legen mislukt: ${error.message}`);
                }
            }
        );
    }
    
    confirmLogout() {
        this.confirmDialog('Weet u zeker dat u wilt uitloggen?', () => {
            if (window.auth && typeof window.auth.logout === 'function') {
                window.auth.logout();
                this.showSuccess('Succesvol uitgelogd');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // Fallback: clear auth data en herlaad
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                window.location.reload();
            }
        });
    }
}

// Maak globale instantie
const uiHandler = new UIHandler();
window.uiHandler = uiHandler;

// Initialiseer bij DOM ready
document.addEventListener('DOMContentLoaded', () => {
    uiHandler.init();
});