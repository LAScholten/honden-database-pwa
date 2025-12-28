/**
 * Stamboom Manager Module
 * Beheert 4-generatie stambomen voor honden
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
                exportPDF: "Exporteer PDF",
                zoomIn: "Vergroot",
                zoomOut: "Verklein",
                resetZoom: "Reset zoom",
                noData: "Geen gegevens beschikbaar",
                unknown: "Onbekend",
                
                // Familierelaties
                currentDog: "Huidige hond",
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
                
                // Gezondheid
                healthInfo: "Gezondheidsinformatie",
                hipDysplasia: "HD",
                elbowDysplasia: "ED",
                patellaLuxation: "PL",
                eyes: "Ogen",
                dandyWalker: "DWM",
                thyroid: "Schildklier",
                
                // Geslacht
                male: "Reu",
                female: "Teef",
                
                // Generaties
                generation1: "Generatie 1 (Huidige hond)",
                generation2: "Generatie 2 (Ouders)",
                generation3: "Generatie 3 (Grootouders)",
                generation4: "Generatie 4 (Overgrootouders)"
            },
            en: {
                pedigreeTitle: "Pedigree of {name}",
                pedigree4Gen: "4-generation pedigree",
                generatingPedigree: "Generating pedigree...",
                close: "Close",
                print: "Print",
                exportPDF: "Export PDF",
                zoomIn: "Zoom In",
                zoomOut: "Zoom Out",
                resetZoom: "Reset Zoom",
                noData: "No data available",
                unknown: "Unknown",
                
                // Family relations
                currentDog: "Current Dog",
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
                
                // Health
                healthInfo: "Health Information",
                hipDysplasia: "HD",
                elbowDysplasia: "ED",
                patellaLuxation: "PL",
                eyes: "Eyes",
                dandyWalker: "DWM",
                thyroid: "Thyroid",
                
                // Gender
                male: "Male",
                female: "Female",
                
                // Generations
                generation1: "Generation 1 (Current Dog)",
                generation2: "Generation 2 (Parents)",
                generation3: "Generation 3 (Grandparents)",
                generation4: "Generation 4 (Great Grandparents)"
            },
            de: {
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "4-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wird generiert...",
                close: "Schließen",
                print: "Drucken",
                exportPDF: "PDF exportieren",
                zoomIn: "Vergrößern",
                zoomOut: "Verkleinern",
                resetZoom: "Zoom zurücksetzen",
                noData: "Keine Daten verfügbar",
                unknown: "Unbekannt",
                
                // Familienbeziehungen
                currentDog: "Aktueller Hund",
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
                
                // Gesundheit
                healthInfo: "Gesundheitsinformationen",
                hipDysplasia: "HD",
                elbowDysplasia: "ED",
                patellaLuxation: "PL",
                eyes: "Augen",
                dandyWalker: "DWM",
                thyroid: "Schilddrüse",
                
                // Geschlecht
                male: "Rüde",
                female: "Hündin",
                
                // Generationen
                generation1: "Generation 1 (Aktueller Hund)",
                generation2: "Generation 2 (Eltern)",
                generation3: "Generation 3 (Großeltern)",
                generation4: "Generation 4 (Urgroßeltern)"
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
    
    buildPedigreeTree(dogId, generations = 4) {
        const pedigreeTree = {
            dog: null,
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
        
        // Haal de hoofdhond op
        const mainDog = this.getDogById(dogId);
        if (!mainDog) return null;
        
        pedigreeTree.dog = mainDog;
        
        // Gen 2: Ouders
        if (mainDog.vaderId) {
            pedigreeTree.father = this.getDogById(mainDog.vaderId);
        }
        
        if (mainDog.moederId) {
            pedigreeTree.mother = this.getDogById(mainDog.moederId);
        }
        
        // Gen 3: Grootouders (paternale kant)
        if (pedigreeTree.father && pedigreeTree.father.vaderId) {
            pedigreeTree.paternalGrandfather = this.getDogById(pedigreeTree.father.vaderId);
        }
        
        if (pedigreeTree.father && pedigreeTree.father.moederId) {
            pedigreeTree.paternalGrandmother = this.getDogById(pedigreeTree.father.moederId);
        }
        
        // Gen 3: Grootouders (maternale kant)
        if (pedigreeTree.mother && pedigreeTree.mother.vaderId) {
            pedigreeTree.maternalGrandfather = this.getDogById(pedigreeTree.mother.vaderId);
        }
        
        if (pedigreeTree.mother && pedigreeTree.mother.moederId) {
            pedigreeTree.maternalGrandmother = this.getDogById(pedigreeTree.mother.moederId);
        }
        
        // Gen 4: Overgrootouders (paternale vader kant)
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.vaderId) {
            pedigreeTree.paternalGreatGrandfather1 = this.getDogById(pedigreeTree.paternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.moederId) {
            pedigreeTree.paternalGreatGrandmother1 = this.getDogById(pedigreeTree.paternalGrandfather.moederId);
        }
        
        // Gen 4: Overgrootouders (paternale moeder kant)
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.vaderId) {
            pedigreeTree.paternalGreatGrandfather2 = this.getDogById(pedigreeTree.paternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.moederId) {
            pedigreeTree.paternalGreatGrandmother2 = this.getDogById(pedigreeTree.paternalGrandmother.moederId);
        }
        
        // Gen 4: Overgrootouders (maternale vader kant)
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.vaderId) {
            pedigreeTree.maternalGreatGrandfather1 = this.getDogById(pedigreeTree.maternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.moederId) {
            pedigreeTree.maternalGreatGrandmother1 = this.getDogById(pedigreeTree.maternalGrandfather.moederId);
        }
        
        // Gen 4: Overgrootouders (maternale moeder kant)
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
        const date = new Date(dateString);
        return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                      this.currentLang === 'de' ? 'de-DE' : 'en-US');
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
    
    getDogCardHTML(dog, relation = '') {
        if (!dog) {
            return `
                <div class="pedigree-card empty">
                    <div class="pedigree-card-header">
                        <div class="relation">${relation}</div>
                    </div>
                    <div class="pedigree-card-body text-center py-4">
                        <i class="bi bi-question-circle display-4 text-muted opacity-50"></i>
                        <div class="mt-2">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        return `
            <div class="pedigree-card ${dog.geslacht === 'reuen' ? 'male' : 'female'}">
                <div class="pedigree-card-header">
                    <div class="relation">${relation}</div>
                    <div class="gender-badge">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'}"></i>
                    </div>
                </div>
                <div class="pedigree-card-body">
                    <div class="dog-name mb-2">
                        <strong>${dog.naam || this.t('unknown')}</strong>
                        ${dog.kennelnaam ? `<div class="kennel-name text-muted small">${dog.kennelnaam}</div>` : ''}
                    </div>
                    
                    <div class="dog-details">
                        ${dog.stamboomnr ? `
                        <div class="detail-row">
                            <span class="detail-label">${this.t('pedigreeNumber')}:</span>
                            <span class="detail-value">${dog.stamboomnr}</span>
                        </div>
                        ` : ''}
                        
                        ${dog.ras ? `
                        <div class="detail-row">
                            <span class="detail-label">${this.t('breed')}:</span>
                            <span class="detail-value">${dog.ras}</span>
                        </div>
                        ` : ''}
                        
                        <div class="detail-row">
                            <span class="detail-label">${this.t('gender')}:</span>
                            <span class="detail-value">${genderText}</span>
                        </div>
                        
                        ${dog.vachtkleur ? `
                        <div class="detail-row">
                            <span class="detail-label">${this.t('coatColor')}:</span>
                            <span class="detail-value">${dog.vachtkleur}</span>
                        </div>
                        ` : ''}
                        
                        ${dog.geboortedatum ? `
                        <div class="detail-row">
                            <span class="detail-label">${this.t('birthDate')}:</span>
                            <span class="detail-value">${this.formatDate(dog.geboortedatum)}</span>
                        </div>
                        ` : ''}
                        
                        ${dog.overlijdensdatum ? `
                        <div class="detail-row">
                            <span class="detail-label">${this.t('deathDate')}:</span>
                            <span class="detail-value">${this.formatDate(dog.overlijdensdatum)}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="health-info mt-3">
                        <div class="health-title mb-2">${this.t('healthInfo')}:</div>
                        <div class="health-badges">
                            ${dog.heupdysplasie ? `
                            <div class="health-badge-item">
                                <span class="badge-label">${this.t('hipDysplasia')}:</span>
                                ${this.getHealthBadge(dog.heupdysplasie, 'hip')}
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="health-badge-item">
                                <span class="badge-label">${this.t('elbowDysplasia')}:</span>
                                ${this.getHealthBadge(dog.elleboogdysplasie, 'elbow')}
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="health-badge-item">
                                <span class="badge-label">${this.t('patellaLuxation')}:</span>
                                ${this.getHealthBadge(dog.patella, 'patella')}
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="health-badge-item">
                                <span class="badge-label">${this.t('eyes')}:</span>
                                ${this.getHealthBadge(dog.ogen, 'eyes')}
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="health-badge-item">
                                <span class="badge-label">${this.t('dandyWalker')}:</span>
                                ${this.getHealthBadge(dog.dandyWalker, 'dandy')}
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="health-badge-item">
                                <span class="badge-label">${this.t('thyroid')}:</span>
                                ${this.getHealthBadge(dog.schildklier, 'thyroid')}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    showPedigree(dog) {
        // Maak modal HTML als die nog niet bestaat
        if (!document.getElementById('pedigreeModal')) {
            this.createPedigreeModal();
        }
        
        // Bouw de stamboom
        const pedigreeTree = this.buildPedigreeTree(dog.id);
        if (!pedigreeTree) {
            this.showError("Kon stamboom niet genereren");
            return;
        }
        
        // Update modal titel
        const title = this.t('pedigreeTitle').replace('{name}', dog.naam || this.t('unknown'));
        document.getElementById('pedigreeModalLabel').textContent = title;
        
        // Vul de stamboom in
        this.renderPedigree(pedigreeTree);
        
        // Toon de modal
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
                            <div class="pedigree-container" id="pedigreeContainer">
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
                                    <i class="bi bi-zoom-out"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary btn-zoom-reset mx-2">
                                    <i class="bi bi-zoom-in"></i> 100%
                                </button>
                                <button class="btn btn-sm btn-outline-secondary btn-zoom-in">
                                    <i class="bi bi-zoom-in"></i>
                                </button>
                            </div>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i> ${this.t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .pedigree-container {
                    padding: 20px;
                    background: #f8f9fa;
                    min-height: 600px;
                    overflow: auto;
                    transition: transform 0.3s;
                }
                
                .pedigree-grid {
                    display: grid;
                    grid-template-columns: repeat(15, 1fr);
                    grid-template-rows: repeat(7, auto);
                    gap: 10px;
                    min-width: 1200px;
                    transform-origin: top left;
                }
                
                .pedigree-card {
                    background: white;
                    border-radius: 8px;
                    border: 2px solid #dee2e6;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    overflow: hidden;
                    transition: all 0.3s;
                }
                
                .pedigree-card:hover {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                    transform: translateY(-2px);
                }
                
                .pedigree-card.male {
                    border-color: #cfe2ff;
                    background: linear-gradient(to bottom, #ffffff, #f0f7ff);
                }
                
                .pedigree-card.female {
                    border-color: #f8d7da;
                    background: linear-gradient(to bottom, #ffffff, #fff0f3);
                }
                
                .pedigree-card.empty {
                    border-color: #e9ecef;
                    background: #f8f9fa;
                }
                
                .pedigree-card-header {
                    background: #6c757d;
                    color: white;
                    padding: 8px 12px;
                    font-size: 0.85rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .pedigree-card-body {
                    padding: 12px;
                }
                
                .dog-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #0d6efd;
                }
                
                .kennel-name {
                    font-style: italic;
                }
                
                .detail-row {
                    display: flex;
                    margin-bottom: 4px;
                    font-size: 0.85rem;
                }
                
                .detail-label {
                    font-weight: 600;
                    color: #495057;
                    width: 110px;
                    min-width: 110px;
                }
                
                .detail-value {
                    color: #212529;
                    flex: 1;
                }
                
                .health-info {
                    border-top: 1px solid #dee2e6;
                    padding-top: 8px;
                    margin-top: 8px;
                }
                
                .health-title {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #495057;
                }
                
                .health-badges {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 4px;
                }
                
                .health-badge-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .badge-label {
                    font-size: 0.75rem;
                    color: #6c757d;
                    white-space: nowrap;
                }
                
                .connection-line {
                    position: absolute;
                    background: #6c757d;
                }
                
                .connection-line.horizontal {
                    height: 2px;
                }
                
                .connection-line.vertical {
                    width: 2px;
                }
                
                /* Grid positions voor 4-generatie stamboom */
                /* Gen 1: Huidige hond - midden onder */
                .gen1 { grid-column: 7 / 10; grid-row: 6 / 8; }
                
                /* Gen 2: Ouders */
                .gen2-father { grid-column: 3 / 6; grid-row: 4 / 6; }
                .gen2-mother { grid-column: 11 / 14; grid-row: 4 / 6; }
                
                /* Gen 3: Grootouders */
                .gen3-paternal-grandfather { grid-column: 1 / 4; grid-row: 2 / 4; }
                .gen3-paternal-grandmother { grid-column: 5 / 8; grid-row: 2 / 4; }
                .gen3-maternal-grandfather { grid-column: 10 / 13; grid-row: 2 / 4; }
                .gen3-maternal-grandmother { grid-column: 14 / 17; grid-row: 2 / 4; }
                
                /* Gen 4: Overgrootouders */
                .gen4-paternal-great-grandfather1 { grid-column: 1 / 3; grid-row: 1; }
                .gen4-paternal-great-grandmother1 { grid-column: 3 / 5; grid-row: 1; }
                .gen4-paternal-great-grandfather2 { grid-column: 5 / 7; grid-row: 1; }
                .gen4-paternal-great-grandmother2 { grid-column: 7 / 9; grid-row: 1; }
                .gen4-maternal-great-grandfather1 { grid-column: 10 / 12; grid-row: 1; }
                .gen4-maternal-great-grandmother1 { grid-column: 12 / 14; grid-row: 1; }
                .gen4-maternal-great-grandfather2 { grid-column: 14 / 16; grid-row: 1; }
                .gen4-maternal-great-grandmother2 { grid-column: 16 / 18; grid-row: 1; }
                
                .zoom-controls .btn {
                    padding: 4px 8px;
                    font-size: 0.875rem;
                }
                
                @media print {
                    .modal-dialog {
                        max-width: none;
                        margin: 0;
                    }
                    
                    .modal-header, .modal-footer {
                        display: none !important;
                    }
                    
                    .pedigree-container {
                        padding: 0;
                        background: white;
                    }
                    
                    .pedigree-grid {
                        gap: 5px;
                        min-width: auto;
                    }
                    
                    .pedigree-card {
                        break-inside: avoid;
                        box-shadow: none;
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
        let currentZoom = 1;
        const container = modal.querySelector('#pedigreeContainer');
        const grid = container.querySelector('.pedigree-grid');
        
        if (grid) {
            modal.querySelector('.btn-zoom-in').addEventListener('click', () => {
                currentZoom = Math.min(currentZoom + 0.1, 2);
                grid.style.transform = `scale(${currentZoom})`;
            });
            
            modal.querySelector('.btn-zoom-out').addEventListener('click', () => {
                currentZoom = Math.max(currentZoom - 0.1, 0.5);
                grid.style.transform = `scale(${currentZoom})`;
            });
            
            modal.querySelector('.btn-zoom-reset').addEventListener('click', () => {
                currentZoom = 1;
                grid.style.transform = 'scale(1)';
            });
        }
    }
    
    renderPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) return;
        
        const gridHTML = `
            <div class="pedigree-grid">
                <!-- Generatie 4: Overgrootouders (rij 1) -->
                <div class="pedigree-card gen4-paternal-great-grandfather1">
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfather'))}
                </div>
                <div class="pedigree-card gen4-paternal-great-grandmother1">
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmother'))}
                </div>
                <div class="pedigree-card gen4-paternal-great-grandfather2">
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfather'))}
                </div>
                <div class="pedigree-card gen4-paternal-great-grandmother2">
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmother'))}
                </div>
                
                <div class="pedigree-card gen4-maternal-great-grandfather1">
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfather'))}
                </div>
                <div class="pedigree-card gen4-maternal-great-grandmother1">
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmother'))}
                </div>
                <div class="pedigree-card gen4-maternal-great-grandfather2">
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfather'))}
                </div>
                <div class="pedigree-card gen4-maternal-great-grandmother2">
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmother'))}
                </div>
                
                <!-- Generatie 3: Grootouders (rij 2-3) -->
                <div class="pedigree-card gen3-paternal-grandfather">
                    ${this.getDogCardHTML(pedigreeTree.paternalGrandfather, this.t('grandfather'))}
                </div>
                <div class="pedigree-card gen3-paternal-grandmother">
                    ${this.getDogCardHTML(pedigreeTree.paternalGrandmother, this.t('grandmother'))}
                </div>
                <div class="pedigree-card gen3-maternal-grandfather">
                    ${this.getDogCardHTML(pedigreeTree.maternalGrandfather, this.t('grandfather'))}
                </div>
                <div class="pedigree-card gen3-maternal-grandmother">
                    ${this.getDogCardHTML(pedigreeTree.maternalGrandmother, this.t('grandmother'))}
                </div>
                
                <!-- Generatie 2: Ouders (rij 4-5) -->
                <div class="pedigree-card gen2-father">
                    ${this.getDogCardHTML(pedigreeTree.father, this.t('father'))}
                </div>
                <div class="pedigree-card gen2-mother">
                    ${this.getDogCardHTML(pedigreeTree.mother, this.t('mother'))}
                </div>
                
                <!-- Generatie 1: Huidige hond (rij 6-7) -->
                <div class="pedigree-card gen1">
                    ${this.getDogCardHTML(pedigreeTree.dog, this.t('currentDog'))}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        // Voeg verbindingslijnen toe
        this.addConnectionLines();
    }
    
    addConnectionLines() {
        // Deze functie zou SVG lijnen kunnen toevoegen tussen de kaarten
        // Voor nu houden we het simpel zonder visuele lijnen
        // Kan later uitgebreid worden met SVG graphics
    }
}