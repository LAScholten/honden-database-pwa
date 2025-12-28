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
                generation4: "Generatie 4 (Overgrootouders)",
                
                // Relatie aanduidingen
                paternal: "Paternaal",
                maternal: "Maternaal"
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
                generation4: "Generation 4 (Great Grandparents)",
                
                // Relation indicators
                paternal: "Paternal",
                maternal: "Maternal"
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
                generation4: "Generation 4 (Urgroßeltern)",
                
                // Relations
                paternal: "Väterlich",
                maternal: "Mütterlich"
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
            mainDog: null,           // Generatie 0: Hoofdhond (bovenaan)
            father: null,           // Generatie 1: Vader
            mother: null,           // Generatie 1: Moeder
            paternalGrandfather: null,   // Generatie 2: Paternale grootvader
            paternalGrandmother: null,   // Generatie 2: Paternale grootmoeder
            maternalGrandfather: null,   // Generatie 2: Maternale grootvader
            maternalGrandmother: null,   // Generatie 2: Maternale grootmoeder
            paternalGreatGrandfather1: null,  // Generatie 3: Paternale overgrootvader (vaders vader)
            paternalGreatGrandmother1: null,  // Generatie 3: Paternale overgrootmoeder (vaders vader)
            paternalGreatGrandfather2: null,  // Generatie 3: Paternale overgrootvader (vaders moeder)
            paternalGreatGrandmother2: null,  // Generatie 3: Paternale overgrootmoeder (vaders moeder)
            maternalGreatGrandfather1: null,  // Generatie 3: Maternale overgrootvader (moeders vader)
            maternalGreatGrandmother1: null,  // Generatie 3: Maternale overgrootmoeder (moeders vader)
            maternalGreatGrandfather2: null,  // Generatie 3: Maternale overgrootvader (moeders moeder)
            maternalGreatGrandmother2: null   // Generatie 3: Maternale overgrootmoeder (moeders moeder)
        };
        
        // Haal de hoofdhond op
        const mainDog = this.getDogById(dogId);
        if (!mainDog) return null;
        
        pedigreeTree.mainDog = mainDog;
        
        // Generatie 1: Ouders
        if (mainDog.vaderId) {
            pedigreeTree.father = this.getDogById(mainDog.vaderId);
        }
        
        if (mainDog.moederId) {
            pedigreeTree.mother = this.getDogById(mainDog.moederId);
        }
        
        // Generatie 2: Grootouders (paternale kant)
        if (pedigreeTree.father && pedigreeTree.father.vaderId) {
            pedigreeTree.paternalGrandfather = this.getDogById(pedigreeTree.father.vaderId);
        }
        
        if (pedigreeTree.father && pedigreeTree.father.moederId) {
            pedigreeTree.paternalGrandmother = this.getDogById(pedigreeTree.father.moederId);
        }
        
        // Generatie 2: Grootouders (maternale kant)
        if (pedigreeTree.mother && pedigreeTree.mother.vaderId) {
            pedigreeTree.maternalGrandfather = this.getDogById(pedigreeTree.mother.vaderId);
        }
        
        if (pedigreeTree.mother && pedigreeTree.mother.moederId) {
            pedigreeTree.maternalGrandmother = this.getDogById(pedigreeTree.mother.moederId);
        }
        
        // Generatie 3: Overgrootouders (paternale vader kant)
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.vaderId) {
            pedigreeTree.paternalGreatGrandfather1 = this.getDogById(pedigreeTree.paternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.moederId) {
            pedigreeTree.paternalGreatGrandmother1 = this.getDogById(pedigreeTree.paternalGrandfather.moederId);
        }
        
        // Generatie 3: Overgrootouders (paternale moeder kant)
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.vaderId) {
            pedigreeTree.paternalGreatGrandfather2 = this.getDogById(pedigreeTree.paternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.moederId) {
            pedigreeTree.paternalGreatGrandmother2 = this.getDogById(pedigreeTree.paternalGrandmother.moederId);
        }
        
        // Generatie 3: Overgrootouders (maternale vader kant)
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.vaderId) {
            pedigreeTree.maternalGreatGrandfather1 = this.getDogById(pedigreeTree.maternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.moederId) {
            pedigreeTree.maternalGreatGrandmother1 = this.getDogById(pedigreeTree.maternalGrandfather.moederId);
        }
        
        // Generatie 3: Overgrootouders (maternale moeder kant)
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
    
    getDogCardHTML(dog, relation = '', isMainDog = false) {
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
        
        // Speciale styling voor hoofdhond
        const mainDogClass = isMainDog ? 'main-dog' : '';
        const headerColor = isMainDog ? 'bg-primary' : 'bg-secondary';
        
        return `
            <div class="pedigree-card ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass}">
                <div class="pedigree-card-header ${headerColor}">
                    <div class="relation">
                        ${relation}
                        ${isMainDog ? '<div class="main-dog-badge"><i class="bi bi-star-fill"></i></div>' : ''}
                    </div>
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
        
        // Vul de stamboom in - NIEUWE LAYOUT MET HOOFDHOND BOVENAAN
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
                    grid-template-rows: repeat(8, auto);
                    gap: 15px;
                    min-width: 1400px;
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
                
                /* Hoofdhond styling */
                .pedigree-card.main-dog {
                    border-color: #0d6efd;
                    border-width: 3px;
                    background: linear-gradient(to bottom, #e8f4fd, #ffffff);
                    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
                }
                
                .pedigree-card-header {
                    color: white;
                    padding: 10px 12px;
                    font-size: 0.85rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .pedigree-card-header.bg-primary {
                    background: #0d6efd !important;
                }
                
                .pedigree-card-header.bg-secondary {
                    background: #6c757d !important;
                }
                
                .relation {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                }
                
                .main-dog-badge {
                    background: #ffc107;
                    color: #212529;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                }
                
                .pedigree-card-body {
                    padding: 15px;
                }
                
                .dog-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #0d6efd;
                }
                
                .main-dog .dog-name {
                    color: #0d6efd;
                    font-size: 1.2rem;
                }
                
                .kennel-name {
                    font-style: italic;
                    color: #6c757d;
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
                
                /* NIEUWE LAYOUT: Generatie 0 bovenaan (rij 1) */
                .gen0 { grid-column: 7 / 10; grid-row: 1 / 3; }
                
                /* Generatie 1: Ouders (rij 2-3) */
                .gen1-father { grid-column: 3 / 6; grid-row: 3 / 5; }
                .gen1-mother { grid-column: 11 / 14; grid-row: 3 / 5; }
                
                /* Generatie 2: Grootouders (rij 4-5) */
                .gen2-paternal-grandfather { grid-column: 1 / 4; grid-row: 5 / 7; }
                .gen2-paternal-grandmother { grid-column: 5 / 8; grid-row: 5 / 7; }
                .gen2-maternal-grandfather { grid-column: 10 / 13; grid-row: 5 / 7; }
                .gen2-maternal-grandmother { grid-column: 14 / 17; grid-row: 5 / 7; }
                
                /* Generatie 3: Overgrootouders (rij 6-8) */
                .gen3-paternal-great-grandfather1 { grid-column: 1 / 3; grid-row: 7 / 9; }
                .gen3-paternal-great-grandmother1 { grid-column: 3 / 5; grid-row: 7 / 9; }
                .gen3-paternal-great-grandfather2 { grid-column: 5 / 7; grid-row: 7 / 9; }
                .gen3-paternal-great-grandmother2 { grid-column: 7 / 9; grid-row: 7 / 9; }
                .gen3-maternal-great-grandfather1 { grid-column: 10 / 12; grid-row: 7 / 9; }
                .gen3-maternal-great-grandmother1 { grid-column: 12 / 14; grid-row: 7 / 9; }
                .gen3-maternal-great-grandfather2 { grid-column: 14 / 16; grid-row: 7 / 9; }
                .gen3-maternal-great-grandmother2 { grid-column: 16 / 18; grid-row: 7 / 9; }
                
                /* Verbindingslijnen styling */
                .pedigree-lines {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                }
                
                .line {
                    position: absolute;
                    background-color: #6c757d;
                }
                
                .line.horizontal {
                    height: 2px;
                }
                
                .line.vertical {
                    width: 2px;
                }
                
                .zoom-controls .btn {
                    padding: 4px 8px;
                    font-size: 0.875rem;
                }
                
                /* Generatie labels */
                .generation-label {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 5px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    margin: 5px 0;
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
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
                        gap: 8px;
                        min-width: auto;
                    }
                    
                    .pedigree-card {
                        break-inside: avoid;
                        box-shadow: none;
                        border: 1px solid #dee2e6;
                    }
                    
                    .main-dog {
                        border: 2px solid #0d6efd !important;
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
        
        const setupZoom = () => {
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
        };
        
        // Setup zoom wanneer grid beschikbaar is
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (container.querySelector('.pedigree-grid')) {
                    setupZoom();
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(container, { childList: true, subtree: true });
    }
    
    renderPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) return;
        
        const gridHTML = `
            <div class="pedigree-grid">
                <!-- Generatie 0: Hoofdhond (bovenaan) -->
                <div class="pedigree-card gen0 main-dog">
                    ${this.getDogCardHTML(pedigreeTree.mainDog, this.t('mainDog'), true)}
                </div>
                
                <!-- Generatie 1: Ouders -->
                <div class="pedigree-card gen1-father">
                    ${this.getDogCardHTML(pedigreeTree.father, this.t('father'))}
                </div>
                <div class="pedigree-card gen1-mother">
                    ${this.getDogCardHTML(pedigreeTree.mother, this.t('mother'))}
                </div>
                
                <!-- Generatie 2: Grootouders -->
                <div class="pedigree-card gen2-paternal-grandfather">
                    ${this.getDogCardHTML(pedigreeTree.paternalGrandfather, 
                                          `${this.t('paternal')} ${this.t('grandfather')}`)}
                </div>
                <div class="pedigree-card gen2-paternal-grandmother">
                    ${this.getDogCardHTML(pedigreeTree.paternalGrandmother, 
                                          `${this.t('paternal')} ${this.t('grandmother')}`)}
                </div>
                <div class="pedigree-card gen2-maternal-grandfather">
                    ${this.getDogCardHTML(pedigreeTree.maternalGrandfather, 
                                          `${this.t('maternal')} ${this.t('grandfather')}`)}
                </div>
                <div class="pedigree-card gen2-maternal-grandmother">
                    ${this.getDogCardHTML(pedigreeTree.maternalGrandmother, 
                                          `${this.t('maternal')} ${this.t('grandmother')}`)}
                </div>
                
                <!-- Generatie 3: Overgrootouders -->
                <div class="pedigree-card gen3-paternal-great-grandfather1">
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandfather1, 
                                          `${this.t('paternal')} ${this.t('greatGrandfather')}`)}
                </div>
                <div class="pedigree-card gen3-paternal-great-grandmother1">
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandmother1, 
                                          `${this.t('paternal')} ${this.t('greatGrandmother')}`)}
                </div>
                <div class="pedigree-card gen3-paternal-great-grandfather2">
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandfather2, 
                                          `${this.t('paternal')} ${this.t('greatGrandfather')}`)}
                </div>
                <div class="pedigree-card gen3-paternal-great-grandmother2">
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandmother2, 
                                          `${this.t('paternal')} ${this.t('greatGrandmother')}`)}
                </div>
                
                <div class="pedigree-card gen3-maternal-great-grandfather1">
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandfather1, 
                                          `${this.t('maternal')} ${this.t('greatGrandfather')}`)}
                </div>
                <div class="pedigree-card gen3-maternal-great-grandmother1">
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandmother1, 
                                          `${this.t('maternal')} ${this.t('greatGrandmother')}`)}
                </div>
                <div class="pedigree-card gen3-maternal-great-grandfather2">
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandfather2, 
                                          `${this.t('maternal')} ${this.t('greatGrandfather')}`)}
                </div>
                <div class="pedigree-card gen3-maternal-great-grandmother2">
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandmother2, 
                                          `${this.t('maternal')} ${this.t('greatGrandmother')}`)}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        // Voeg visuele lijnen toe (optioneel)
        this.addPedigreeLines();
    }
    
    addPedigreeLines() {
        // Deze functie voegt visuele verbindingslijnen toe tussen de kaarten
        // Voor nu houden we het simpel, maar je kunt SVG lijnen toevoegen
        
        setTimeout(() => {
            const container = document.getElementById('pedigreeContainer');
            const grid = container.querySelector('.pedigree-grid');
            
            if (!grid) return;
            
            // Maak een div voor de lijnen
            const linesDiv = document.createElement('div');
            linesDiv.className = 'pedigree-lines';
            grid.appendChild(linesDiv);
            
            // Hier zou je logica komen om lijnen tussen de kaarten te tekenen
            // Dit vereist het berekenen van posities van de kaarten
            
        }, 100);
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