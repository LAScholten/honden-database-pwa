/**
 * Reu en Teef Combinatie Module
 * Voor het maken van fokplannen met specifieke reu en teef
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.selectedTeef = null;
        this.selectedReu = null;
        this.allHonden = [];
        this.translations = {
            nl: {
                title: "Reu en Teef Combinatie",
                description: "Selecteer een specifieke reu en teef voor uw fokplan",
                mother: "Teef (Moeder)",
                selectMother: "Selecteer een teef...",
                father: "Reu (Vader)",
                selectFather: "Selecteer een reu...",
                searchPlaceholder: "Typ om te zoeken...",
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
                save: "Toekomstige Stamboom Tonen",
                showPedigree: "Toon Stamboom",
                pedigreeTitle: "Toekomstige Stamboom - Voorspelling",
                pedigreeInfo: "Dit is een voorspelde stamboom op basis van de geselecteerde reu en teef:",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                motherSide: "Moeders kant",
                fatherSide: "Vaders kant",
                close: "Sluiten"
            },
            en: {
                title: "Male and Female Combination",
                description: "Select a specific male and female for your breeding plan",
                mother: "Female (Mother)",
                selectMother: "Select a female...",
                father: "Male (Father)",
                selectFather: "Select a male...",
                searchPlaceholder: "Type to search...",
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
                save: "Show Future Pedigree",
                showPedigree: "Show Pedigree",
                pedigreeTitle: "Future Pedigree - Prediction",
                pedigreeInfo: "This is a predicted pedigree based on the selected male and female:",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great-grandparents",
                motherSide: "Mother's side",
                fatherSide: "Father's side",
                close: "Close"
            },
            de: {
                title: "Rüde und Hündin Kombination",
                description: "Wählen Sie einen bestimmten Rüden und eine Hündin für Ihren Zuchtplan",
                mother: "Hündin (Mutter)",
                selectMother: "Wählen Sie eine Hündin...",
                father: "Rüde (Vater)",
                selectFather: "Wählen Sie einen Rüden...",
                searchPlaceholder: "Tippen Sie zum Suchen...",
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
                save: "Zukünftigen Stammbaum Zeigen",
                showPedigree: "Stammbaum Zeigen",
                pedigreeTitle: "Zukünftiger Stammbaum - Vorhersage",
                pedigreeInfo: "Dies ist ein vorhergesagter Stammbaum basierend auf dem ausgewählten Rüden und der Hündin:",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                motherSide: "Mutterseite",
                fatherSide: "Vaterseite",
                close: "Schließen"
            }
        };
    }
    
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async loadContent() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Reset geselecteerde honden
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // Laad honden data voor autocomplete
        this.allHonden = await this.getHonden();
        const teven = this.allHonden.filter(h => h.geslacht === 'teven');
        const reuen = this.allHonden.filter(h => h.geslacht === 'reuen');
        
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
                                <div class="autocomplete-container">
                                    <input type="text" 
                                           class="form-control" 
                                           id="teefSearch" 
                                           placeholder="${t('searchPlaceholder')}"
                                           autocomplete="off">
                                    <div class="autocomplete-dropdown" id="teefDropdown"></div>
                                </div>
                            </div>
                            <div id="teefDetails" class="d-none mt-3">
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
                                <div class="autocomplete-container">
                                    <input type="text" 
                                           class="form-control" 
                                           id="reuSearch" 
                                           placeholder="${t('searchPlaceholder')}"
                                           autocomplete="off">
                                    <div class="autocomplete-dropdown" id="reuDropdown"></div>
                                </div>
                            </div>
                            <div id="reuDetails" class="d-none mt-3">
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
            
            <!-- Stamboom Modal -->
            <div class="modal fade" id="pedigreeModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-diagram-3 text-purple me-2"></i>${t('pedigreeTitle')}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>${t('pedigreeInfo')}</p>
                            <div id="pedigreeContent"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                ${t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="saveBtn" disabled>
                <i class="bi bi-diagram-3"></i> ${t('save')}
            </button>
        `;
        
        // Voeg CSS toe voor autocomplete
        this.addAutocompleteStyles();
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.showPedigree();
        });
        
        // Setup autocomplete voor teef
        this.setupAutocomplete('teefSearch', teven, (hond) => {
            this.selectTeef(hond);
        });
        
        // Setup autocomplete voor reu
        this.setupAutocomplete('reuSearch', reuen, (hond) => {
            this.selectReu(hond);
        });
        
        // Update save button state bij wijzigingen
        const teefSearch = document.getElementById('teefSearch');
        const reuSearch = document.getElementById('reuSearch');
        const saveBtn = document.getElementById('saveBtn');
        
        const updateSaveButton = () => {
            const teefSelected = this.selectedTeef !== null;
            const reuSelected = this.selectedReu !== null;
            saveBtn.disabled = !(teefSelected && reuSelected);
        };
        
        teefSearch.addEventListener('input', updateSaveButton);
        reuSearch.addEventListener('input', updateSaveButton);
    }
    
    addAutocompleteStyles() {
        if (!document.querySelector('#autocomplete-styles')) {
            const style = document.createElement('style');
            style.id = 'autocomplete-styles';
            style.textContent = `
                .autocomplete-container {
                    position: relative;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    max-height: 300px;
                    overflow-y: auto;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 0.375rem;
                    border-top: none;
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 1000;
                    display: none;
                }
                
                .autocomplete-item {
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    border-bottom: 1px solid #f8f9fa;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item.active {
                    background-color: #6f42c1;
                    color: white;
                }
                
                .autocomplete-item .small {
                    font-size: 0.875rem;
                    opacity: 0.8;
                }
                
                /* Stamboom styles */
                .pedigree-chart {
                    font-family: Arial, sans-serif;
                }
                
                .pedigree-generation {
                    margin-bottom: 2rem;
                }
                
                .pedigree-row {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                
                .pedigree-box {
                    padding: 0.75rem;
                    border: 2px solid #6f42c1;
                    border-radius: 0.5rem;
                    background: white;
                    min-width: 180px;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .pedigree-box.parent {
                    border-color: #198754;
                    background: #f8fff9;
                }
                
                .pedigree-box.grandparent {
                    border-color: #0dcaf0;
                    background: #f8f9ff;
                }
                
                .pedigree-box.great-grandparent {
                    border-color: #ffc107;
                    background: #fffcf5;
                }
                
                .pedigree-name {
                    font-weight: bold;
                    font-size: 1.1rem;
                    color: #343a40;
                }
                
                .pedigree-details {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-top: 0.25rem;
                }
                
                .pedigree-label {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 0.5rem;
                    padding-bottom: 0.25rem;
                    border-bottom: 1px dashed #dee2e6;
                }
                
                .pedigree-connection {
                    position: relative;
                    height: 20px;
                    margin: 0.5rem 0;
                }
                
                .pedigree-connection::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 1px;
                    height: 100%;
                    background: #adb5bd;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupAutocomplete(inputId, items, onSelect) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId.replace('Search', 'Dropdown'));
        let activeIndex = -1;
        
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            activeIndex = -1;
            
            if (searchTerm.length < 1) {
                dropdown.style.display = 'none';
                return;
            }
            
            // Filter items op basis van zoekterm
            const filtered = items.filter(item => {
                const naam = item.naam?.toLowerCase() || '';
                const ras = item.ras?.toLowerCase() || '';
                const stamboom = item.stamboomnr?.toLowerCase() || '';
                
                return naam.includes(searchTerm) || 
                       ras.includes(searchTerm) || 
                       stamboom.includes(searchTerm) ||
                       (searchTerm.length === 1 && naam.startsWith(searchTerm));
            });
            
            if (filtered.length === 0) {
                dropdown.innerHTML = '<div class="autocomplete-item text-muted">Geen resultaten gevonden</div>';
                dropdown.style.display = 'block';
                return;
            }
            
            dropdown.innerHTML = filtered.map((item, index) => `
                <div class="autocomplete-item ${index === activeIndex ? 'active' : ''}" 
                     data-index="${index}"
                     data-value='${JSON.stringify(item)}'>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${item.naam || 'Onbekend'}</strong>
                            <div class="small">
                                ${item.ras || 'Onbekend ras'} 
                                ${item.stamboomnr ? `• ${item.stamboomnr}` : ''}
                            </div>
                        </div>
                        <div class="text-muted small">
                            ${item.geboortedatum ? new Date(item.geboortedatum).getFullYear() : '?'}
                        </div>
                    </div>
                </div>
            `).join('');
            
            dropdown.style.display = 'block';
            
            // Event listeners voor dropdown items
            dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const data = JSON.parse(item.getAttribute('data-value'));
                    input.value = `${data.naam} (${data.ras || 'Onbekend ras'})`;
                    dropdown.style.display = 'none';
                    onSelect(data);
                });
            });
        });
        
        input.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.autocomplete-item');
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    activeIndex = Math.min(activeIndex + 1, items.length - 1);
                    this.updateActiveItem(items, activeIndex);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    activeIndex = Math.max(activeIndex - 1, -1);
                    this.updateActiveItem(items, activeIndex);
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (activeIndex >= 0 && items[activeIndex]) {
                        const data = JSON.parse(items[activeIndex].getAttribute('data-value'));
                        input.value = `${data.naam} (${data.ras || 'Onbekend ras'})`;
                        dropdown.style.display = 'none';
                        onSelect(data);
                    }
                    break;
                    
                case 'Escape':
                    dropdown.style.display = 'none';
                    activeIndex = -1;
                    break;
            }
        });
        
        // Sluit dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }
    
    updateActiveItem(items, activeIndex) {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
            if (index === activeIndex) {
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }
    
    async getHonden() {
        try {
            if (this.db && typeof this.db.getHonden === 'function') {
                return await this.db.getHonden();
            }
            return [];
        } catch (error) {
            console.error('Fout bij ophalen honden:', error);
            return [];
        }
    }
    
    selectTeef(hond) {
        this.selectedTeef = hond;
        this.showHondDetails('teefDetails', hond, 'Teef');
        this.updateSaveButtonState();
    }
    
    selectReu(hond) {
        this.selectedReu = hond;
        this.showHondDetails('reuDetails', hond, 'Reu');
        this.updateSaveButtonState();
    }
    
    showHondDetails(elementId, hond, type) {
        const details = document.getElementById(elementId);
        const geboortedatum = hond.geboortedatum ? 
            new Date(hond.geboortedatum).toLocaleDateString(this.currentLang) : '-';
        
        details.innerHTML = `
            <div class="card border-primary">
                <div class="card-header bg-primary bg-opacity-10 border-primary">
                    <h6 class="mb-0">Geselecteerde ${type}</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 text-center mb-3 mb-md-0">
                            <div class="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                                 style="width: 80px; height: 80px; margin: 0 auto;">
                                <i class="bi bi-${type === 'Teef' ? 'gender-female' : 'gender-male'} text-primary" style="font-size: 2rem;"></i>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>${hond.naam || 'Onbekend'}</h5>
                            <div class="row small">
                                <div class="col-6">
                                    <strong>Ras:</strong><br>
                                    ${hond.ras || '-'}
                                </div>
                                <div class="col-6">
                                    <strong>Stamboom:</strong><br>
                                    ${hond.stamboomnr || '-'}
                                </div>
                                <div class="col-6 mt-2">
                                    <strong>Geboortedatum:</strong><br>
                                    ${geboortedatum}
                                </div>
                                <div class="col-6 mt-2">
                                    <strong>Kleur:</strong><br>
                                    ${hond.kleur || '-'}
                                </div>
                                ${hond.gewicht ? `
                                    <div class="col-6 mt-2">
                                        <strong>Gewicht:</strong><br>
                                        ${hond.gewicht} kg
                                    </div>
                                ` : ''}
                                ${hond.chipnummer ? `
                                    <div class="col-6 mt-2">
                                        <strong>Chipnummer:</strong><br>
                                        ${hond.chipnummer}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        details.classList.remove('d-none');
    }
    
    updateSaveButtonState() {
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.disabled = !(this.selectedTeef && this.selectedReu);
        }
    }
    
    goBack() {
        const breedingModal = document.getElementById('breedingPlanModal');
        if (breedingModal) {
            if (window.uiHandler && window.uiHandler.modules && window.uiHandler.modules.breeding) {
                window.uiHandler.modules.breeding.loadMainScreen();
            } else if (window.appUI && window.appUI.modules && window.appUI.modules.breeding) {
                window.appUI.modules.breeding.loadMainScreen();
            } else {
                console.warn('Kon breeding manager niet vinden, sluit modal');
                const modal = bootstrap.Modal.getInstance(breedingModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    }
    
    showPedigree() {
        if (!this.selectedTeef || !this.selectedReu) {
            this.showAlert('Selecteer zowel een teef als een reu', 'warning');
            return;
        }
        
        this.renderPedigree();
        const modal = new bootstrap.Modal(document.getElementById('pedigreeModal'));
        modal.show();
    }
    
    renderPedigree() {
        const t = this.t.bind(this);
        const content = document.getElementById('pedigreeContent');
        
        // Genereer voorspelde stamboom data
        const predictedPuppy = {
            naam: `Toekomstige pup van ${this.selectedTeef.naam} & ${this.selectedReu.naam}`,
            ouders: {
                moeder: this.selectedTeef,
                vader: this.selectedReu
            },
            grootouders: {
                moederMoeder: this.generateRandomAncestor('teef', 'Grootmoeder'),
                moederVader: this.generateRandomAncestor('reu', 'Grootvader'),
                vaderMoeder: this.generateRandomAncestor('teef', 'Grootmoeder'),
                vaderVader: this.generateRandomAncestor('reu', 'Grootvader')
            },
            overgrootouders: {
                mmMoeder: this.generateRandomAncestor('teef', 'Overgrootmoeder'),
                mmVader: this.generateRandomAncestor('reu', 'Overgrootvader'),
                mvMoeder: this.generateRandomAncestor('teef', 'Overgrootmoeder'),
                mvVader: this.generateRandomAncestor('reu', 'Overgrootvader'),
                vmMoeder: this.generateRandomAncestor('teef', 'Overgrootmoeder'),
                vmVader: this.generateRandomAncestor('reu', 'Overgrootvader'),
                vvMoeder: this.generateRandomAncestor('teef', 'Overgrootmoeder'),
                vvVader: this.generateRandomAncestor('reu', 'Overgrootvader')
            }
        };
        
        content.innerHTML = `
            <div class="pedigree-chart">
                <!-- Toekomstige pup -->
                <div class="pedigree-generation text-center mb-4">
                    <div class="pedigree-label">Toekomstige Pup (Voorspelling)</div>
                    <div class="pedigree-box parent">
                        <div class="pedigree-name">${predictedPuppy.naam}</div>
                        <div class="pedigree-details">
                            ${this.selectedTeef.ras || 'Mix'} • Voorspeld
                        </div>
                    </div>
                </div>
                
                <!-- Ouders -->
                <div class="pedigree-generation">
                    <div class="pedigree-label">${t('parents')}</div>
                    <div class="pedigree-row">
                        <div class="pedigree-box parent">
                            <div class="pedigree-name">${this.selectedReu.naam}</div>
                            <div class="pedigree-details">
                                ${this.selectedReu.ras || 'Onbekend'} • ${t('father')}
                            </div>
                        </div>
                        <div class="pedigree-box parent">
                            <div class="pedigree-name">${this.selectedTeef.naam}</div>
                            <div class="pedigree-details">
                                ${this.selectedTeef.ras || 'Onbekend'} • ${t('mother')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Grootouders -->
                <div class="pedigree-generation">
                    <div class="pedigree-label">${t('grandparents')}</div>
                    
                    <div class="row">
                        <!-- Vaders kant -->
                        <div class="col-md-6">
                            <div class="pedigree-label">${t('fatherSide')}</div>
                            <div class="pedigree-row">
                                <div class="pedigree-box grandparent">
                                    <div class="pedigree-name">${predictedPuppy.grootouders.vaderVader.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.grootouders.vaderVader.ras} • Grootvader
                                    </div>
                                </div>
                                <div class="pedigree-box grandparent">
                                    <div class="pedigree-name">${predictedPuppy.grootouders.vaderMoeder.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.grootouders.vaderMoeder.ras} • Grootmoeder
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Moeders kant -->
                        <div class="col-md-6">
                            <div class="pedigree-label">${t('motherSide')}</div>
                            <div class="pedigree-row">
                                <div class="pedigree-box grandparent">
                                    <div class="pedigree-name">${predictedPuppy.grootouders.moederVader.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.grootouders.moederVader.ras} • Grootvader
                                    </div>
                                </div>
                                <div class="pedigree-box grandparent">
                                    <div class="pedigree-name">${predictedPuppy.grootouders.moederMoeder.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.grootouders.moederMoeder.ras} • Grootmoeder
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Overgrootouders -->
                <div class="pedigree-generation">
                    <div class="pedigree-label">${t('greatGrandparents')}</div>
                    
                    <div class="row">
                        <!-- Vaders vaders kant -->
                        <div class="col-md-3">
                            <div class="pedigree-row">
                                <div class="pedigree-box great-grandparent">
                                    <div class="pedigree-name">${predictedPuppy.overgrootouders.vvVader.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.overgrootouders.vvVader.ras} • Overgrootvader
                                    </div>
                                </div>
                                <div class="pedigree-box great-grandparent">
                                    <div class="pedigree-name">${predictedPuppy.overgrootouders.vvMoeder.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.overgrootouders.vvMoeder.ras} • Overgrootmoeder
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Vaders moeders kant -->
                        <div class="col-md-3">
                            <div class="pedigree-row">
                                <div class="pedigree-box great-grandparent">
                                    <div class="pedigree-name">${predictedPuppy.overgrootouders.vmVader.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.overgrootouders.vmVader.ras} • Overgrootvader
                                    </div>
                                </div>
                                <div class="pedigree-box great-grandparent">
                                    <div class="pedigree-name">${predictedPuppy.overgrootouders.vmMoeder.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.overgrootouders.vmMoeder.ras} • Overgrootmoeder
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Moeders vaders kant -->
                        <div class="col-md-3">
                            <div class="pedigree-row">
                                <div class="pedigree-box great-grandparent">
                                    <div class="pedigree-name">${predictedPuppy.overgrootouders.mvVader.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.overgrootouders.mvVader.ras} • Overgrootvader
                                    </div>
                                </div>
                                <div class="pedigree-box great-grandparent">
                                    <div class="pedigree-name">${predictedPuppy.overgrootouders.mvMoeder.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.overgrootouders.mvMoeder.ras} • Overgrootmoeder
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Moeders moeders kant -->
                        <div class="col-md-3">
                            <div class="pedigree-row">
                                <div class="pedigree-box great-grandparent">
                                    <div class="pedigree-name">${predictedPuppy.overgrootouders.mmVader.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.overgrootouders.mmVader.ras} • Overgrootvader
                                    </div>
                                </div>
                                <div class="pedigree-box great-grandparent">
                                    <div class="pedigree-name">${predictedPuppy.overgrootouders.mmMoeder.naam}</div>
                                    <div class="pedigree-details">
                                        ${predictedPuppy.overgrootouders.mmMoeder.ras} • Overgrootmoeder
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Legenda -->
                <div class="mt-4 pt-3 border-top">
                    <div class="row small text-center">
                        <div class="col-md-3">
                            <div class="d-inline-block px-3 py-1 rounded border" style="border-color: #198754 !important; background: #f8fff9;">
                                <i class="bi bi-person-fill"></i> ${t('parents')}
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="d-inline-block px-3 py-1 rounded border" style="border-color: #0dcaf0 !important; background: #f8f9ff;">
                                <i class="bi bi-people-fill"></i> ${t('grandparents')}
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="d-inline-block px-3 py-1 rounded border" style="border-color: #ffc107 !important; background: #fffcf5;">
                                <i class="bi bi-people"></i> ${t('greatGrandparents')}
                            </div>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">
                                <i class="bi bi-info-circle"></i> Dit is een voorspelde stamboom
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateRandomAncestor(geslacht, relatie) {
        const rassen = ['Labrador Retriever', 'Golden Retriever', 'Duitse Herder', 'Border Collie', 
                       'Franse Bulldog', 'Beagle', 'Poedel', 'Rottweiler', 'Boxer', 'Teckel'];
        const voorvoegsels = ['van', 'de', 'het', 'der', 'den'];
        const namen = ['Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Daisy', 'Rocky', 'Molly', 'Bear', 'Lola'];
        
        const ras = rassen[Math.floor(Math.random() * rassen.length)];
        const voorvoegsel = Math.random() > 0.7 ? voorvoegsels[Math.floor(Math.random() * voorvoegsels.length)] + ' ' : '';
        const naam = `${voorvoegsel}${namen[Math.floor(Math.random() * namen.length)]}`;
        
        return {
            naam: `${naam} ${relatie}`,
            ras: ras,
            geslacht: geslacht,
            stamboomnr: `STB${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            geboortedatum: new Date(2015 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        };
    }
    
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const content = document.getElementById('breedingContent');
        if (content) {
            content.insertBefore(alertDiv, content.firstChild);
        }
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}