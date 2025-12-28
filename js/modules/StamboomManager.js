/**
 * Stamboom Manager Module
 * Beheert 4-generatie stambomen voor honden - Mobile Optimized
 */

class StamboomManager extends BaseModule {
    constructor(db, currentLang = 'nl') {
        super();
        this.db = db;
        this.currentLang = currentLang;
        this.allDogs = [];
        this.translations = {
            nl: {
                pedigreeTitle: "Stamboom van {name}",
                pedigree4Gen: "4-generatie stamboom",
                generatingPedigree: "Stamboom genereren...",
                close: "Sluiten",
                print: "Afdrukken",
                zoomIn: "Vergroot",
                zoomOut: "Verklein",
                resetZoom: "Reset zoom",
                noData: "Geen gegevens",
                unknown: "Onbekend",
                
                // Familierelaties
                currentDog: "Huidige hond",
                mainDog: "Hoofdhond",
                father: "Vader",
                mother: "Moeder",
                grandfather: "Grootvader",
                grandmother: "Grootmoeder",
                greatGrandfather: "Overgrootvader",
                greatGrandmother: "Overgrootmoeder",
                
                // Hond gegevens
                name: "Naam",
                kennel: "Kennel",
                pedigreeNumber: "Stamboomnummer",
                breed: "Ras",
                gender: "Geslacht",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                coatColor: "Vachtkleur",
                country: "Land",
                zipCode: "Postcode",
                
                // Gezondheid
                healthInfo: "Gezondheidsinformatie",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                eyesExplanation: "Verklaring ogen",
                thyroidExplanation: "Toelichting schildklier",
                
                // Geslacht
                male: "Reu",
                female: "Teef",
                
                // Labels
                paternal: "Paternaal",
                maternal: "Maternaal",
                clickForDetails: "Klik voor details",
                closePopup: "Sluiten",
                remarks: "Opmerkingen",
                noRemarks: "Geen opmerkingen"
            },
            en: {
                pedigreeTitle: "Pedigree of {name}",
                pedigree4Gen: "4-generation pedigree",
                generatingPedigree: "Generating pedigree...",
                close: "Close",
                print: "Print",
                zoomIn: "Zoom In",
                zoomOut: "Zoom Out",
                resetZoom: "Reset Zoom",
                noData: "No data",
                unknown: "Unknown",
                
                // Family relations
                currentDog: "Current Dog",
                mainDog: "Main Dog",
                father: "Father",
                mother: "Mother",
                grandfather: "Grandfather",
                grandmother: "Grandmother",
                greatGrandfather: "Great Grandfather",
                greatGrandmother: "Great Grandmother",
                
                // Dog details
                name: "Name",
                kennel: "Kennel",
                pedigreeNumber: "Pedigree number",
                breed: "Breed",
                gender: "Gender",
                birthDate: "Birth date",
                deathDate: "Death date",
                coatColor: "Coat color",
                country: "Country",
                zipCode: "Zip code",
                
                // Health
                healthInfo: "Health Information",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                eyesExplanation: "Eye explanation",
                thyroidExplanation: "Thyroid explanation",
                
                // Gender
                male: "Male",
                female: "Female",
                
                // Labels
                paternal: "Paternal",
                maternal: "Maternaal",
                clickForDetails: "Click for details",
                closePopup: "Close",
                remarks: "Remarks",
                noRemarks: "No remarks"
            },
            de: {
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "4-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wird generiert...",
                close: "Schließen",
                print: "Drucken",
                zoomIn: "Vergrößern",
                zoomOut: "Verkleinern",
                resetZoom: "Zoom zurücksetzen",
                noData: "Keine Daten",
                unknown: "Unbekannt",
                
                // Familienbeziehungen
                currentDog: "Aktueller Hund",
                mainDog: "Haupt-Hund",
                father: "Vater",
                mother: "Mutter",
                grandfather: "Großvater",
                grandmother: "Großmutter",
                greatGrandfather: "Urgroßvater",
                greatGrandmother: "Urgroßmutter",
                
                // Hund Details
                name: "Name",
                kennel: "Kennel",
                pedigreeNumber: "Stammbaum-Nummer",
                breed: "Rasse",
                gender: "Geschlecht",
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                coatColor: "Fellfarbe",
                country: "Land",
                zipCode: "Postleitzahl",
                
                // Gesundheit
                healthInfo: "Gesundheitsinformationen",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                eyesExplanation: "Augenerklärung",
                thyroidExplanation: "Schilddrüse Erklärung",
                
                // Geschlecht
                male: "Rüde",
                female: "Hündin",
                
                // Labels
                paternal: "Väterlich",
                maternal: "Mütterlich",
                clickForDetails: "Klicken für Details",
                closePopup: "Schließen",
                remarks: "Bemerkungen",
                noRemarks: "Keine Bemerkungen"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async initialize() {
        this.allDogs = await this.db.getHonden();
        console.log(`${this.allDogs.length} honden geladen voor stambomen`);
    }
    
    getDogById(id) {
        return this.allDogs.find(dog => dog.id === id);
    }
    
    buildPedigreeTree(dogId) {
        const pedigreeTree = {
            mainDog: null,
            father: null,
            mother: null,
            paternalGrandfather: null,
            paternalGrandmother: null,
            maternalGrandfather: null,
            maternalGrandmother: null,
            paternalGreatGrandfather1: null,
            paternalGreatGrandmother1: null,
            paternalGreatGrandfather2: null,
            paternalGreatGrandmother2: null,
            maternalGreatGrandfather1: null,
            maternalGreatGrandmother1: null,
            maternalGreatGrandfather2: null,
            maternalGreatGrandmother2: null
        };
        
        const mainDog = this.getDogById(dogId);
        if (!mainDog) return null;
        
        pedigreeTree.mainDog = mainDog;
        
        // Ouders
        if (mainDog.vaderId) {
            pedigreeTree.father = this.getDogById(mainDog.vaderId);
        }
        
        if (mainDog.moederId) {
            pedigreeTree.mother = this.getDogById(mainDog.moederId);
        }
        
        // Grootouders
        if (pedigreeTree.father && pedigreeTree.father.vaderId) {
            pedigreeTree.paternalGrandfather = this.getDogById(pedigreeTree.father.vaderId);
        }
        
        if (pedigreeTree.father && pedigreeTree.father.moederId) {
            pedigreeTree.paternalGrandmother = this.getDogById(pedigreeTree.father.moederId);
        }
        
        if (pedigreeTree.mother && pedigreeTree.mother.vaderId) {
            pedigreeTree.maternalGrandfather = this.getDogById(pedigreeTree.mother.vaderId);
        }
        
        if (pedigreeTree.mother && pedigreeTree.mother.moederId) {
            pedigreeTree.maternalGrandmother = this.getDogById(pedigreeTree.mother.moederId);
        }
        
        // Overgrootouders
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.vaderId) {
            pedigreeTree.paternalGreatGrandfather1 = this.getDogById(pedigreeTree.paternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.moederId) {
            pedigreeTree.paternalGreatGrandmother1 = this.getDogById(pedigreeTree.paternalGrandfather.moederId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.vaderId) {
            pedigreeTree.paternalGreatGrandfather2 = this.getDogById(pedigreeTree.paternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.moederId) {
            pedigreeTree.paternalGreatGrandmother2 = this.getDogById(pedigreeTree.paternalGrandmother.moederId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.vaderId) {
            pedigreeTree.maternalGreatGrandfather1 = this.getDogById(pedigreeTree.maternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.moederId) {
            pedigreeTree.maternalGreatGrandmother1 = this.getDogById(pedigreeTree.maternalGrandfather.moederId);
        }
        
        if (pedigreeTree.maternalGrandmother && pedigreeTree.maternalGrandmother.vaderId) {
            pedigreeTree.maternalGreatGrandfather2 = this.getDogById(pedigreeTree.maternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.maternalGrandmother && pedigreeTree.maternalGrandmother.moederId) {
            pedigreeTree.maternalGreatGrandmother2 = this.getDogById(pedigreeTree.maternalGrandmother.moederId);
        }
        
        return pedigreeTree;
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        } catch {
            return dateString;
        }
    }
    
    getHealthBadge(value, type) {
        if (!value || value === '') {
            return `<span class="badge bg-secondary">${this.t('unknown')}</span>`;
        }
        
        let badgeClass = 'badge ';
        switch(type) {
            case 'hip': badgeClass += 'badge-hd'; break;
            case 'elbow': badgeClass += 'badge-ed'; break;
            case 'patella': badgeClass += 'badge-pl'; break;
            case 'eyes': badgeClass += 'badge-eyes'; break;
            case 'dandy': badgeClass += 'badge-dandy'; break;
            case 'thyroid': badgeClass += 'badge-thyroid'; break;
            default: badgeClass += 'bg-secondary';
        }
        
        return `<span class="${badgeClass}">${value}</span>`;
    }
    
    // COMPACTE CARD VOOR STAMBOOM
    getDogCompactCardHTML(dog, relation = '', isMainDog = false) {
        if (!dog) {
            return `
                <div class="pedigree-card-compact empty" data-dog-id="0">
                    <div class="pedigree-card-header-compact">
                        <div class="relation-compact">${relation}</div>
                    </div>
                    <div class="pedigree-card-body-compact text-center py-3">
                        <div class="no-data-text">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? 'bg-primary' : 'bg-secondary';
        
        return `
            <div class="pedigree-card-compact ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}">
                <div class="pedigree-card-header-compact ${headerColor}">
                    <div class="relation-compact">
                        <span class="relation-text">${relation}</span>
                        ${isMainDog ? '<span class="main-dot">★</span>' : ''}
                    </div>
                    <div class="gender-icon-compact">
                        <i class="bi ${genderIcon}"></i>
                    </div>
                </div>
                <div class="pedigree-card-body-compact">
                    <!-- Alleen belangrijke informatie in compacte weergave -->
                    <div class="dog-name-compact" title="${dog.naam || this.t('unknown')}">
                        ${dog.naam || this.t('unknown')}
                    </div>
                    
                    ${dog.kennelnaam ? `
                    <div class="dog-kennel-compact" title="${dog.kennelnaam}">
                        ${dog.kennelnaam}
                    </div>
                    ` : ''}
                    
                    ${dog.stamboomnr ? `
                    <div class="dog-pedigree-compact">
                        ${dog.stamboomnr}
                    </div>
                    ` : ''}
                    
                    ${dog.ras ? `
                    <div class="dog-breed-compact">
                        ${dog.ras}
                    </div>
                    ` : ''}
                    
                    <!-- Klik hint -->
                    <div class="click-hint-compact">
                        <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // DETAIL POPUP voor wanneer op card geklikt wordt
    getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        return `
            <div class="dog-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${relation}
                    </h5>
                    <button type="button" class="btn-close btn-close-white popup-close"></button>
                </div>
                <div class="popup-body">
                    <div class="dog-popup-name mb-2">
                        <h4>${dog.naam || this.t('unknown')}</h4>
                        ${dog.kennelnaam ? `<div class="text-muted">${dog.kennelnaam}</div>` : ''}
                    </div>
                    
                    <div class="info-section mb-3">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="info-grid">
                            ${dog.stamboomnr ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('pedigreeNumber')}:</span>
                                <span class="info-value">${dog.stamboomnr}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.ras ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('breed')}:</span>
                                <span class="info-value">${dog.ras}</span>
                            </div>
                            ` : ''}
                            
                            <div class="info-item">
                                <span class="info-label">${this.t('gender')}:</span>
                                <span class="info-value">${genderText}</span>
                            </div>
                            
                            ${dog.vachtkleur ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('coatColor')}:</span>
                                <span class="info-value">${dog.vachtkleur}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.geboortedatum ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('birthDate')}:</span>
                                <span class="info-value">${this.formatDate(dog.geboortedatum)}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('deathDate')}:</span>
                                <span class="info-value">${this.formatDate(dog.overlijdensdatum)}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.land ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('country')}:</span>
                                <span class="info-value">${dog.land}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.postcode ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('zipCode')}:</span>
                                <span class="info-value">${dog.postcode}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="info-section mb-3">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo')}</h6>
                        <div class="info-grid">
                            ${dog.heupdysplasie ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('hipDysplasia')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.heupdysplasie, 'hip')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('elbowDysplasia')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.elleboogdysplasie, 'elbow')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('patellaLuxation')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.patella, 'patella')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('eyes')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.ogen, 'eyes')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.ogenVerklaring ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('eyesExplanation')}:</span>
                                <span class="info-value">${dog.ogenVerklaring}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('dandyWalker')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.dandyWalker, 'dandy')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('thyroid')}:</span>
                                <span class="info-value">${this.getHealthBadge(dog.schildklier, 'thyroid')}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklierVerklaring ? `
                            <div class="info-item">
                                <span class="info-label">${this.t('thyroidExplanation')}:</span>
                                <span class="info-value">${dog.schildklierVerklaring}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${dog.opmerkingen ? `
                    <div class="info-section mb-3">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="remarks-box">
                            ${dog.opmerkingen}
                        </div>
                    </div>
                    ` : `
                    <div class="info-section mb-3">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="text-muted">${this.t('noRemarks')}</div>
                    </div>
                    `}
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-secondary popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
    }
    
    showPedigree(dog) {
        if (!document.getElementById('pedigreeModal')) {
            this.createPedigreeModal();
        }
        
        const pedigreeTree = this.buildPedigreeTree(dog.id);
        if (!pedigreeTree) {
            this.showError("Kon stamboom niet genereren");
            return;
        }
        
        const title = this.t('pedigreeTitle').replace('{name}', dog.naam || this.t('unknown'));
        document.getElementById('pedigreeModalLabel').textContent = title;
        
        this.renderCompactPedigree(pedigreeTree);
        
        const modal = new bootstrap.Modal(document.getElementById('pedigreeModal'));
        modal.show();
    }
    
    createPedigreeModal() {
        const modalHTML = `
            <div class="modal fade" id="pedigreeModal" tabindex="-1" aria-labelledby="pedigreeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="pedigreeModalLabel">
                                <i class="bi bi-diagram-3 me-2"></i> ${this.t('pedigree4Gen')}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${this.t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0">
                            <div class="pedigree-container-compact" id="pedigreeContainer">
                                <div class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">${this.t('generatingPedigree')}</span>
                                    </div>
                                    <p class="mt-3">${this.t('generatingPedigree')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="zoom-controls me-auto">
                                <button class="btn btn-sm btn-outline-secondary btn-zoom-out">
                                    <i class="bi bi-dash-lg"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary btn-zoom-reset mx-2">
                                    100%
                                </button>
                                <button class="btn btn-sm btn-outline-secondary btn-zoom-in">
                                    <i class="bi bi-plus-lg"></i>
                                </button>
                            </div>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i> ${this.t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Popup overlay voor hond details -->
            <div class="pedigree-popup-overlay" id="pedigreePopupOverlay" style="display: none;">
                <div class="pedigree-popup-container" id="pedigreePopupContainer">
                    <!-- Hier komt de popup content -->
                </div>
            </div>
            
            <style>
                /* MOBILE-FIRST COMPACT STYLES - VERBETERDE MOBIEL LAYOUT */
                .pedigree-container-compact {
                    padding: 10px;
                    background: #f8f9fa;
                    min-height: 500px;
                    overflow: auto;
                    transition: transform 0.3s;
                }
                
                .pedigree-grid-compact {
                    display: grid;
                    grid-template-columns: 1fr;
                    grid-auto-rows: minmax(110px, auto);
                    gap: 8px;
                    width: 100%;
                    max-width: 100%;
                    transform-origin: top left;
                    padding: 5px;
                }
                
                /* COMPACT CARDS */
                .pedigree-card-compact {
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-height: 110px;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }
                
                .pedigree-card-compact:hover {
                    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
                    transform: translateY(-2px);
                }
                
                .pedigree-card-compact.male {
                    border-left: 3px solid #0d6efd;
                }
                
                .pedigree-card-compact.female {
                    border-left: 3px solid #dc3545;
                }
                
                .pedigree-card-compact.main-dog-compact {
                    border: 2px solid #0d6efd;
                    background: #f0f7ff;
                }
                
                .pedigree-card-compact.empty {
                    background: #f8f9fa;
                    cursor: default;
                    opacity: 0.6;
                }
                
                .pedigree-card-compact.empty:hover {
                    transform: none;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                /* Card header */
                .pedigree-card-header-compact {
                    color: white;
                    padding: 6px 8px;
                    font-size: 0.7rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    min-height: 26px;
                }
                
                .pedigree-card-header-compact.bg-primary {
                    background: #0d6efd !important;
                }
                
                .pedigree-card-header-compact.bg-secondary {
                    background: #6c757d !important;
                }
                
                .relation-compact {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 600;
                    overflow: hidden;
                }
                
                .relation-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                }
                
                .main-dot {
                    color: #ffc107;
                    font-size: 0.8rem;
                }
                
                .gender-icon-compact {
                    font-size: 0.8rem;
                    flex-shrink: 0;
                }
                
                /* Card body */
                .pedigree-card-body-compact {
                    padding: 8px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .dog-name-compact {
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: #0d6efd;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .dog-kennel-compact {
                    font-size: 0.75rem;
                    color: #6c757d;
                    font-style: italic;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .dog-pedigree-compact {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 2px;
                }
                
                .dog-breed-compact {
                    font-size: 0.75rem;
                    color: #28a745;
                    margin-bottom: 4px;
                }
                
                .no-data-text {
                    font-size: 0.8rem;
                    color: #6c757d;
                    font-style: italic;
                }
                
                .click-hint-compact {
                    font-size: 0.65rem;
                    color: #6c757d;
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
                
                /* MOBIEL LAYOUT - FULL WIDTH VOOR ALLE GENERATIES */
                /* Generation 0: Main dog - full width */
                .gen0-compact { grid-column: 1; grid-row: 1; }
                
                /* Generation 1: Parents - beide full width onder elkaar */
                .gen1-father-compact { grid-column: 1; grid-row: 2; }
                .gen1-mother-compact { grid-column: 1; grid-row: 3; }
                
                /* Generation 2: Grandparents - allemaal full width onder elkaar */
                .gen2-paternal-grandfather-compact { grid-column: 1; grid-row: 4; }
                .gen2-paternal-grandmother-compact { grid-column: 1; grid-row: 5; }
                .gen2-maternal-grandfather-compact { grid-column: 1; grid-row: 6; }
                .gen2-maternal-grandmother-compact { grid-column: 1; grid-row: 7; }
                
                /* Generation 3: Great-grandparents - allemaal full width onder elkaar */
                .gen3-paternal-great-grandfather1-compact { grid-column: 1; grid-row: 8; }
                .gen3-paternal-great-grandmother1-compact { grid-column: 1; grid-row: 9; }
                .gen3-paternal-great-grandfather2-compact { grid-column: 1; grid-row: 10; }
                .gen3-paternal-great-grandmother2-compact { grid-column: 1; grid-row: 11; }
                .gen3-maternal-great-grandfather1-compact { grid-column: 1; grid-row: 12; }
                .gen3-maternal-great-grandmother1-compact { grid-column: 1; grid-row: 13; }
                .gen3-maternal-great-grandfather2-compact { grid-column: 1; grid-row: 14; }
                .gen3-maternal-great-grandmother2-compact { grid-column: 1; grid-row: 15; }
                
                /* TABLET LAYOUT (2 kolommen) */
                @media (min-width: 576px) {
                    .pedigree-grid-compact {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                    }
                    
                    /* Generation 0: Main dog - full width boven */
                    .gen0-compact { grid-column: 1 / -1; grid-row: 1; }
                    
                    /* Generation 1: Parents - naast elkaar op rij 2 */
                    .gen1-father-compact { grid-column: 1; grid-row: 2; }
                    .gen1-mother-compact { grid-column: 2; grid-row: 2; }
                    
                    /* Generation 2: Grandparents - 2 per rij */
                    .gen2-paternal-grandfather-compact { grid-column: 1; grid-row: 3; }
                    .gen2-paternal-grandmother-compact { grid-column: 2; grid-row: 3; }
                    .gen2-maternal-grandfather-compact { grid-column: 1; grid-row: 4; }
                    .gen2-maternal-grandmother-compact { grid-column: 2; grid-row: 4; }
                    
                    /* Generation 3: Great-grandparents - 2 per rij */
                    .gen3-paternal-great-grandfather1-compact { grid-column: 1; grid-row: 5; }
                    .gen3-paternal-great-grandmother1-compact { grid-column: 2; grid-row: 5; }
                    .gen3-paternal-great-grandfather2-compact { grid-column: 1; grid-row: 6; }
                    .gen3-paternal-great-grandmother2-compact { grid-column: 2; grid-row: 6; }
                    .gen3-maternal-great-grandfather1-compact { grid-column: 1; grid-row: 7; }
                    .gen3-maternal-great-grandmother1-compact { grid-column: 2; grid-row: 7; }
                    .gen3-maternal-great-grandfather2-compact { grid-column: 1; grid-row: 8; }
                    .gen3-maternal-great-grandmother2-compact { grid-column: 2; grid-row: 8; }
                }
                
                /* DESKTOP LAYOUT (4 kolommen) */
                @media (min-width: 992px) {
                    .pedigree-grid-compact {
                        grid-template-columns: repeat(4, 1fr);
                        gap: 12px;
                    }
                    
                    /* Generation 0: Main dog - full width boven */
                    .gen0-compact { grid-column: 1 / -1; grid-row: 1; }
                    
                    /* Generation 1: Parents - middelste 2 kolommen */
                    .gen1-father-compact { grid-column: 2; grid-row: 2; }
                    .gen1-mother-compact { grid-column: 3; grid-row: 2; }
                    
                    /* Generation 2: Grandparents - 4 kolommen naast elkaar */
                    .gen2-paternal-grandfather-compact { grid-column: 1; grid-row: 3; }
                    .gen2-paternal-grandmother-compact { grid-column: 2; grid-row: 3; }
                    .gen2-maternal-grandfather-compact { grid-column: 3; grid-row: 3; }
                    .gen2-maternal-grandmother-compact { grid-column: 4; grid-row: 3; }
                    
                    /* Generation 3: Great-grandparents - 4 kolommen, 2 rijen */
                    .gen3-paternal-great-grandfather1-compact { grid-column: 1; grid-row: 4; }
                    .gen3-paternal-great-grandmother1-compact { grid-column: 2; grid-row: 4; }
                    .gen3-paternal-great-grandfather2-compact { grid-column: 3; grid-row: 4; }
                    .gen3-paternal-great-grandmother2-compact { grid-column: 4; grid-row: 4; }
                    .gen3-maternal-great-grandfather1-compact { grid-column: 1; grid-row: 5; }
                    .gen3-maternal-great-grandmother1-compact { grid-column: 2; grid-row: 5; }
                    .gen3-maternal-great-grandfather2-compact { grid-column: 3; grid-row: 5; }
                    .gen3-maternal-great-grandmother2-compact { grid-column: 4; grid-row: 5; }
                }
                
                /* GROTE DESKTOP LAYOUT (6-8 kolommen) */
                @media (min-width: 1400px) {
                    .pedigree-grid-compact {
                        grid-template-columns: repeat(8, 1fr);
                        gap: 15px;
                    }
                    
                    /* Generation 0: Main dog - full width boven */
                    .gen0-compact { grid-column: 1 / -1; grid-row: 1; }
                    
                    /* Generation 1: Parents - breder in het midden */
                    .gen1-father-compact { grid-column: 3 / 5; grid-row: 2; }
                    .gen1-mother-compact { grid-column: 5 / 7; grid-row: 2; }
                    
                    /* Generation 2: Grandparents - 4 cards, ieder 2 kolommen breed */
                    .gen2-paternal-grandfather-compact { grid-column: 1 / 3; grid-row: 3; }
                    .gen2-paternal-grandmother-compact { grid-column: 3 / 5; grid-row: 3; }
                    .gen2-maternal-grandfather-compact { grid-column: 5 / 7; grid-row: 3; }
                    .gen2-maternal-grandmother-compact { grid-column: 7 / 9; grid-row: 3; }
                    
                    /* Generation 3: Great-grandparents - 8 cards, ieder 1 kolom breed */
                    .gen3-paternal-great-grandfather1-compact { grid-column: 1; grid-row: 4; }
                    .gen3-paternal-great-grandmother1-compact { grid-column: 2; grid-row: 4; }
                    .gen3-paternal-great-grandfather2-compact { grid-column: 3; grid-row: 4; }
                    .gen3-paternal-great-grandmother2-compact { grid-column: 4; grid-row: 4; }
                    .gen3-maternal-great-grandfather1-compact { grid-column: 5; grid-row: 4; }
                    .gen3-maternal-great-grandmother1-compact { grid-column: 6; grid-row: 4; }
                    .gen3-maternal-great-grandfather2-compact { grid-column: 7; grid-row: 4; }
                    .gen3-maternal-great-grandmother2-compact { grid-column: 8; grid-row: 4; }
                }
                
                /* POPUP STYLES - MOBILE FRIENDLY & CENTERED */
                .pedigree-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1060;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 15px;
                    animation: fadeIn 0.3s;
                    overflow-y: auto;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .pedigree-popup-container {
                    background: white;
                    border-radius: 10px;
                    width: 100%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                    margin: auto;
                    display: flex;
                    flex-direction: column;
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .dog-detail-popup {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    max-height: 90vh;
                }
                
                .popup-header {
                    background: #0d6efd;
                    color: white;
                    padding: 15px;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                .popup-title {
                    margin: 0;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                
                .popup-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    opacity: 0.8;
                    color: white;
                    flex-shrink: 0;
                    margin-left: 10px;
                }
                
                .popup-close:hover {
                    opacity: 1;
                }
                
                .popup-body {
                    padding: 15px;
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
                
                .dog-popup-name {
                    margin-bottom: 15px;
                }
                
                .dog-popup-name h4 {
                    color: #0d6efd;
                    margin-bottom: 5px;
                    font-size: 1.3rem;
                }
                
                .info-section {
                    margin-bottom: 20px;
                }
                
                .info-section h6 {
                    color: #495057;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    align-items: center;
                    font-size: 0.95rem;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                }
                
                @media (min-width: 400px) {
                    .info-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    padding: 8px 0;
                    min-height: 40px;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.85rem;
                    margin-bottom: 3px;
                    line-height: 1.2;
                }
                
                .info-value {
                    color: #212529;
                    font-size: 0.9rem;
                    line-height: 1.3;
                    word-break: break-word;
                }
                
                .remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 10px;
                    border-radius: 5px;
                    font-style: italic;
                    color: #495057;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                
                .popup-footer {
                    padding: 15px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .popup-close-btn {
                    min-width: 120px;
                    padding: 8px 20px;
                }
                
                /* Zoom controls */
                .zoom-controls {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .zoom-controls .btn {
                    padding: 4px 10px;
                    font-size: 0.85rem;
                    min-width: 40px;
                }
                
                /* Print styles */
                @media print {
                    .modal-dialog {
                        max-width: none;
                        margin: 0;
                    }
                    
                    .modal-header, .modal-footer {
                        display: none !important;
                    }
                    
                    .pedigree-container-compact {
                        padding: 0;
                        background: white;
                    }
                    
                    .pedigree-grid-compact {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 10px;
                    }
                    
                    .pedigree-card-compact {
                        break-inside: avoid;
                        box-shadow: none;
                        border: 1px solid #ccc !important;
                        min-height: 100px;
                    }
                    
                    .main-dog-compact {
                        border: 2px solid #000 !important;
                    }
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupPedigreeModalEvents();
    }
    
    setupPedigreeModalEvents() {
        const modal = document.getElementById('pedigreeModal');
        if (!modal) return;
        
        // Print functionaliteit
        const printBtn = modal.querySelector('.btn-print');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
        
        // Zoom functionaliteit
        const setupZoom = () => {
            const container = document.getElementById('pedigreeContainer');
            const grid = container.querySelector('.pedigree-grid-compact');
            if (!grid) return;
            
            let currentZoom = 1;
            
            const zoomInBtn = modal.querySelector('.btn-zoom-in');
            const zoomOutBtn = modal.querySelector('.btn-zoom-out');
            const zoomResetBtn = modal.querySelector('.btn-zoom-reset');
            
            if (zoomInBtn) {
                zoomInBtn.addEventListener('click', () => {
                    currentZoom = Math.min(currentZoom + 0.1, 1.5);
                    grid.style.transform = `scale(${currentZoom})`;
                });
            }
            
            if (zoomOutBtn) {
                zoomOutBtn.addEventListener('click', () => {
                    currentZoom = Math.max(currentZoom - 0.1, 0.7);
                    grid.style.transform = `scale(${currentZoom})`;
                });
            }
            
            if (zoomResetBtn) {
                zoomResetBtn.addEventListener('click', () => {
                    currentZoom = 1;
                    grid.style.transform = 'scale(1)';
                });
            }
        };
        
        // Setup zoom when grid is available
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (document.getElementById('pedigreeContainer').querySelector('.pedigree-grid-compact')) {
                    setupZoom();
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(document.getElementById('pedigreeContainer'), { childList: true, subtree: true });
    }
    
    renderCompactPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) return;
        
        const gridHTML = `
            <div class="pedigree-grid-compact">
                <!-- Generatie 0: Hoofdhond (full width bovenaan) -->
                <div class="pedigree-card-compact gen0-compact main-dog-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.mainDog, this.t('mainDog'), true)}
                </div>
                
                <!-- Generatie 1: Ouders -->
                <div class="pedigree-card-compact gen1-father-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.father, this.t('father'))}
                </div>
                <div class="pedigree-card-compact gen1-mother-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.mother, this.t('mother'))}
                </div>
                
                <!-- Generatie 2: Grootouders -->
                <div class="pedigree-card-compact gen2-paternal-grandfather-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGrandfather, this.t('grandfather'))}
                </div>
                <div class="pedigree-card-compact gen2-paternal-grandmother-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGrandmother, this.t('grandmother'))}
                </div>
                <div class="pedigree-card-compact gen2-maternal-grandfather-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGrandfather, this.t('grandfather'))}
                </div>
                <div class="pedigree-card-compact gen2-maternal-grandmother-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGrandmother, this.t('grandmother'))}
                </div>
                
                <!-- Generatie 3: Overgrootouders -->
                <div class="pedigree-card-compact gen3-paternal-great-grandfather1-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfather'))}
                </div>
                <div class="pedigree-card-compact gen3-paternal-great-grandmother1-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmother'))}
                </div>
                <div class="pedigree-card-compact gen3-paternal-great-grandfather2-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfather'))}
                </div>
                <div class="pedigree-card-compact gen3-paternal-great-grandmother2-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmother'))}
                </div>
                <div class="pedigree-card-compact gen3-maternal-great-grandfather1-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfather'))}
                </div>
                <div class="pedigree-card-compact gen3-maternal-great-grandmother1-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmother'))}
                </div>
                <div class="pedigree-card-compact gen3-maternal-great-grandfather2-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfather'))}
                </div>
                <div class="pedigree-card-compact gen3-maternal-great-grandmother2-compact">
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmother'))}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        // Add click events to cards
        this.setupCardClickEvents();
    }
    
    setupCardClickEvents() {
        const cards = document.querySelectorAll('.pedigree-card-compact:not(.empty)');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId === 0) return; // Skip empty cards
                
                const dog = this.getDogById(dogId);
                if (!dog) return;
                
                const relation = card.getAttribute('data-relation') || '';
                this.showDogDetailPopup(dog, relation);
            });
        });
    }
    
    showDogDetailPopup(dog, relation) {
        const overlay = document.getElementById('pedigreePopupOverlay');
        const container = document.getElementById('pedigreePopupContainer');
        
        if (!overlay || !container) return;
        
        const popupHTML = this.getDogDetailPopupHTML(dog, relation);
        container.innerHTML = popupHTML;
        
        // Show overlay - center in viewport
        overlay.style.display = 'flex';
        
        // Ensure popup is visible and centered
        setTimeout(() => {
            container.style.marginTop = '0';
            container.style.transform = 'translateY(0)';
        }, 10);
        
        // Add close event listeners
        const closeButtons = container.querySelectorAll('.popup-close, .popup-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.style.display = 'none';
            });
        });
        
        // Close when clicking outside popup
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
        
        // Close with Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.style.display = 'none';
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        // Clean up event listener when popup closes
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    // Helper methodes van BaseModule
    showProgress(message) {
        if (typeof super.showProgress === 'function') {
            super.showProgress(message);
        } else {
            console.log('Progress:', message);
        }
    }
    
    hideProgress() {
        if (typeof super.hideProgress === 'function') {
            super.hideProgress();
        }
    }
    
    showError(message) {
        if (typeof super.showError === 'function') {
            super.showError(message);
        } else {
            console.error('Error:', message);
            alert(message);
        }
    }
    
    showSuccess(message) {
        if (typeof super.showSuccess === 'function') {
            super.showSuccess(message);
        } else {
            console.log('Success:', message);
        }
    }
}