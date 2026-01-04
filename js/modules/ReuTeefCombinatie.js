/**
 * Reu en Teef Combinatie Module
 * Voor het maken van fokplannen met specifieke reu en teef
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = {
            nl: {
                title: "Reu en Teef Combinatie",
                description: "Selecteer een specifieke reu en teef voor uw fokplan",
                mother: "Teef (Moeder)",
                selectMother: "Selecteer een teef...",
                father: "Reu (Vader)",
                selectFather: "Selecteer een reu...",
                inDevelopment: "Deze functie is momenteel in ontwikkeling",
                devMessage: "De volledige functionaliteit voor reu en teef combinatie zal binnenkort beschikbaar zijn.",
                features: [
                    "Selectie van specifieke reu en teef",
                    "Genetische compatibiliteitsanalyse",
                    "Stamboom verificatie",
                    "Gezondheidsscore berekening",
                    "Voorspelde nestgrootte",
                    "Planning en kalenderintegratie"
                ],
                back: "Terug",
                save: "Opslaan"
            },
            en: {
                title: "Male and Female Combination",
                description: "Select a specific male and female for your breeding plan",
                mother: "Female (Mother)",
                selectMother: "Select a female...",
                father: "Male (Father)",
                selectFather: "Select a male...",
                inDevelopment: "This feature is currently in development",
                devMessage: "The full functionality for male and female combination will be available soon.",
                features: [
                    "Selection of specific male and female",
                    "Genetic compatibility analysis",
                    "Pedigree verification",
                    "Health score calculation",
                    "Predicted litter size",
                    "Planning and calendar integration"
                ],
                back: "Back",
                save: "Save"
            },
            de: {
                title: "Rüde und Hündin Kombination",
                description: "Wählen Sie einen bestimmten Rüden und eine Hündin für Ihren Zuchtplan",
                mother: "Hündin (Mutter)",
                selectMother: "Wählen Sie eine Hündin...",
                father: "Rüde (Vater)",
                selectFather: "Wählen Sie einen Rüden...",
                inDevelopment: "Diese Funktion ist derzeit in Entwicklung",
                devMessage: "Die vollständige Funktionalität für Rüde und Hündin Kombination wird demnächst verfügbar sein.",
                features: [
                    "Auswahl spezifischer Rüde und Hündin",
                    "Genetische Kompatibilitätsanalyse",
                    "Stammbaumverifizierung",
                    "Gesundheitswertberechnung",
                    "Vorhergesagte Wurfgröße",
                    "Planung und Kalenderintegration"
                ],
                back: "Zurück",
                save: "Speichern"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async loadContent() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Laad honden data voor dropdowns
        const honden = await this.getHonden();
        const teven = honden.filter(h => h.geslacht === 'teven');
        const reuen = honden.filter(h => h.geslacht === 'reuen');
        
        content.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-tools"></i>
                <strong>${t('inDevelopment')}</strong><br>
                ${t('devMessage')}
            </div>
            
            <h5 class="mb-4">
                <i class="bi bi-gender-male-female text-purple"></i> ${t('title')}
            </h5>
            <p class="text-muted mb-4">${t('description')}</p>
            
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">${t('mother')}</h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">${t('selectMother')}</label>
                                <select class="form-select" id="teefSelect">
                                    <option value="">${t('selectMother')}</option>
                                    ${teven.map(teef => `
                                        <option value="${teef.id}">
                                            ${teef.naam} (${teef.ras || 'Onbekend ras'})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div id="teefDetails" class="d-none">
                                <!-- Teef details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">${t('father')}</h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">${t('selectFather')}</label>
                                <select class="form-select" id="reuSelect">
                                    <option value="">${t('selectFather')}</option>
                                    ${reuen.map(reu => `
                                        <option value="${reu.id}">
                                            ${reu.naam} (${reu.ras || 'Onbekend ras'})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div id="reuDetails" class="d-none">
                                <!-- Reu details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mt-4">
                <div class="card-header">
                    <h6 class="mb-0">Toekomstige functionaliteiten</h6>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        ${t('features').map(feature => `
                            <li class="list-group-item">
                                <i class="bi bi-check-circle text-success me-2"></i>${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="saveBtn" disabled>
                <i class="bi bi-save"></i> ${t('save')}
            </button>
        `;
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            window.breedingManager.loadMainScreen();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveCombinatie();
        });
        
        document.getElementById('teefSelect').addEventListener('change', (e) => {
            this.updateTeefDetails(e.target.value);
        });
        
        document.getElementById('reuSelect').addEventListener('change', (e) => {
            this.updateReuDetails(e.target.value);
        });
        
        // Update save button state
        const teefSelect = document.getElementById('teefSelect');
        const reuSelect = document.getElementById('reuSelect');
        const saveBtn = document.getElementById('saveBtn');
        
        const updateSaveButton = () => {
            const teefSelected = teefSelect.value !== '';
            const reuSelected = reuSelect.value !== '';
            saveBtn.disabled = !(teefSelected && reuSelected);
        };
        
        teefSelect.addEventListener('change', updateSaveButton);
        reuSelect.addEventListener('change', updateSaveButton);
    }
    
    async getHonden() {
        try {
            if (window.db && typeof window.db.getHonden === 'function') {
                return await window.db.getHonden();
            }
            return [];
        } catch (error) {
            console.error('Fout bij ophalen honden:', error);
            return [];
        }
    }
    
    async updateTeefDetails(teefId) {
        if (!teefId) {
            document.getElementById('teefDetails').classList.add('d-none');
            return;
        }
        
        const honden = await this.getHonden();
        const teef = honden.find(h => h.id == teefId);
        
        if (!teef) return;
        
        const details = document.getElementById('teefDetails');
        details.innerHTML = `
            <hr>
            <h6>Details:</h6>
            <div class="row small">
                <div class="col-6">
                    <strong>Naam:</strong><br>
                    ${teef.naam || '-'}
                </div>
                <div class="col-6">
                    <strong>Ras:</strong><br>
                    ${teef.ras || '-'}
                </div>
                <div class="col-6 mt-2">
                    <strong>Stamboom:</strong><br>
                    ${teef.stamboomnr || '-'}
                </div>
                <div class="col-6 mt-2">
                    <strong>Geboortedatum:</strong><br>
                    ${teef.geboortedatum ? new Date(teef.geboortedatum).toLocaleDateString(this.currentLang) : '-'}
                </div>
            </div>
        `;
        details.classList.remove('d-none');
    }
    
    async updateReuDetails(reuId) {
        if (!reuId) {
            document.getElementById('reuDetails').classList.add('d-none');
            return;
        }
        
        const honden = await this.getHonden();
        const reu = honden.find(h => h.id == reuId);
        
        if (!reu) return;
        
        const details = document.getElementById('reuDetails');
        details.innerHTML = `
            <hr>
            <h6>Details:</h6>
            <div class="row small">
                <div class="col-6">
                    <strong>Naam:</strong><br>
                    ${reu.naam || '-'}
                </div>
                <div class="col-6">
                    <strong>Ras:</strong><br>
                    ${reu.ras || '-'}
                </div>
                <div class="col-6 mt-2">
                    <strong>Stamboom:</strong><br>
                    ${reu.stamboomnr || '-'}
                </div>
                <div class="col-6 mt-2">
                    <strong>Geboortedatum:</strong><br>
                    ${reu.geboortedatum ? new Date(reu.geboortedatum).toLocaleDateString(this.currentLang) : '-'}
                </div>
            </div>
        `;
        details.classList.remove('d-none');
    }
    
    saveCombinatie() {
        const teefId = document.getElementById('teefSelect').value;
        const reuId = document.getElementById('reuSelect').value;
        
        if (!teefId || !reuId) {
            this.showAlert('Selecteer zowel een teef als een reu', 'warning');
            return;
        }
        
        this.showAlert('Functie in ontwikkeling - Combinatie wordt binnenkort opgeslagen', 'info');
    }
    
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const content = document.getElementById('breedingContent');
        content.insertBefore(alertDiv, content.firstChild);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}