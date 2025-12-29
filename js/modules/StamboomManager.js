/**
 * Stamboom Manager Module
 * Beheert 4-generatie stambomen voor honden - Responsive layout
 * Mobiele weergave: Vergelijkbaar met searchmanager container
 * Desktop weergave: Horizontale layout van links naar rechts
 */

class StamboomManager extends BaseModule {
    constructor(db, currentLang = 'nl') {
        super();
        this.db = db;
        this.currentLang = currentLang;
        this.allDogs = [];
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        // Vertalingen
        this.translations = {
            nl: {
                pedigreeTitle: "Stamboom van {name}",
                pedigree4Gen: "4-generatie stamboom",
                generatingPedigree: "Stamboom genereren...",
                close: "Sluiten",
                print: "Afdrukken",
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
                noRemarks: "Geen opmerkingen",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                
                // Mobiele weergave
                mobileView: "Mobiele weergave",
                desktopView: "Desktop weergave",
                generation: "Generatie",
                switchToDesktop: "Desktop weergave",
                switchToMobile: "Mobiele weergave",
                zoomIn: "Vergroten",
                zoomOut: "Verkleinen",
                resetZoom: "Zoom resetten",
                
                // Search manager stijl
                selectDogToView: "Selecteer een hond om details te zien",
                dogDetails: "Hond Details",
                backToSearch: "Terug naar overzicht"
            },
            en: {
                pedigreeTitle: "Pedigree of {name}",
                pedigree4Gen: "4-generation pedigree",
                generatingPedigree: "Generating pedigree...",
                close: "Close",
                print: "Print",
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
                noRemarks: "No remarks",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great Grandparents",
                
                // Mobile view
                mobileView: "Mobile view",
                desktopView: "Desktop view",
                generation: "Generation",
                switchToDesktop: "Desktop view",
                switchToMobile: "Mobile view",
                zoomIn: "Zoom in",
                zoomOut: "Zoom out",
                resetZoom: "Reset zoom",
                
                // Search manager style
                selectDogToView: "Select a dog to view details",
                dogDetails: "Dog Details",
                backToSearch: "Back to overview"
            },
            de: {
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "4-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wird generiert...",
                close: "Schließen",
                print: "Drucken",
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
                birthDate: "Geboortedatum",
                deathDate: "Sterbedatum",
                coatColor: "Fellfarbe",
                country: "Country",
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
                noRemarks: "Keine Bemerkungen",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                
                // Mobile Ansicht
                mobileView: "Mobile Ansicht",
                desktopView: "Desktop Ansicht",
                generation: "Generation",
                switchToDesktop: "Desktop Ansicht",
                switchToMobile: "Mobile Ansicht",
                zoomIn: "Vergrößern",
                zoomOut: "Verkleinern",
                resetZoom: "Zoom zurücksetzen",
                
                // Search manager style
                selectDogToView: "Wählen Sie einen Hund, um Details zu sehen",
                dogDetails: "Hund Details",
                backToSearch: "Zurück zur Übersicht"
            }
        };
        
        // Check schermgrootte bij resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        });
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
    
    // RENDER DE PEDIGREE OP BASIS VAN SCHERMGROOTTE
    renderPedigree(pedigreeTree) {
        if (this.isMobile) {
            return this.renderMobilePedigree(pedigreeTree);
        } else if (this.isTablet) {
            return this.renderTabletPedigree(pedigreeTree);
        } else {
            return this.renderDesktopPedigree(pedigreeTree);
        }
    }
    
    // MOBIELE WEERGAVE - Zoals SearchManager container
    renderMobilePedigree(pedigreeTree) {
        const t = this.t.bind(this);
        
        // Maak een lijst van alle honden in de stamboom
        const dogs = [
            { dog: pedigreeTree.mainDog, relation: t('currentDog'), generation: 0 },
            { dog: pedigreeTree.father, relation: t('father'), generation: 1 },
            { dog: pedigreeTree.mother, relation: t('mother'), generation: 1 },
            { dog: pedigreeTree.paternalGrandfather, relation: t('grandfather'), generation: 2 },
            { dog: pedigreeTree.paternalGrandmother, relation: t('grandmother'), generation: 2 },
            { dog: pedigreeTree.maternalGrandfather, relation: t('grandfather'), generation: 2 },
            { dog: pedigreeTree.maternalGrandmother, relation: t('grandmother'), generation: 2 },
            { dog: pedigreeTree.paternalGreatGrandfather1, relation: t('greatGrandfather'), generation: 3 },
            { dog: pedigreeTree.paternalGreatGrandmother1, relation: t('greatGrandmother'), generation: 3 },
            { dog: pedigreeTree.paternalGreatGrandfather2, relation: t('greatGrandfather'), generation: 3 },
            { dog: pedigreeTree.paternalGreatGrandmother2, relation: t('greatGrandmother'), generation: 3 },
            { dog: pedigreeTree.maternalGreatGrandfather1, relation: t('greatGrandfather'), generation: 3 },
            { dog: pedigreeTree.maternalGreatGrandmother1, relation: t('greatGrandmother'), generation: 3 },
            { dog: pedigreeTree.maternalGreatGrandfather2, relation: t('greatGrandfather'), generation: 3 },
            { dog: pedigreeTree.maternalGreatGrandmother2, relation: t('greatGrandmother'), generation: 3 }
        ];
        
        let html = `
            <div class="pedigree-mobile-container">
                <!-- Header met hoofdhond informatie -->
                <div class="pedigree-mobile-header">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h4 class="mb-1">${pedigreeTree.mainDog?.naam || t('unknown')}</h4>
                            <div class="text-muted small">
                                ${t('pedigree4Gen')}
                            </div>
                        </div>
                        <div class="text-end">
                            <button class="btn btn-sm btn-outline-primary btn-switch-view">
                                <i class="bi bi-laptop"></i> ${t('switchToDesktop')}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Generatie navigatie -->
                    <div class="generation-navigation mb-3">
                        <div class="d-flex flex-wrap gap-2">
                            <button class="btn btn-sm btn-outline-secondary btn-generation active" data-generation="all">
                                ${t('all')}
                            </button>
                            <button class="btn btn-sm btn-outline-secondary btn-generation" data-generation="0">
                                ${t('generation')} 0
                            </button>
                            <button class="btn btn-sm btn-outline-secondary btn-generation" data-generation="1">
                                ${t('generation')} 1
                            </button>
                            <button class="btn btn-sm btn-outline-secondary btn-generation" data-generation="2">
                                ${t('generation')} 2
                            </button>
                            <button class="btn btn-sm btn-outline-secondary btn-generation" data-generation="3">
                                ${t('generation')} 3
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Lijst van honden in stamboom -->
                <div class="pedigree-mobile-list" id="pedigreeMobileList">
        `;
        
        dogs.forEach(item => {
            if (!item.dog) {
                html += `
                    <div class="pedigree-mobile-item empty" data-generation="${item.generation}">
                        <div class="pedigree-item-header">
                            <div class="relation-label">${item.relation}</div>
                        </div>
                        <div class="pedigree-item-body">
                            <div class="text-muted fst-italic">${t('noData')}</div>
                        </div>
                    </div>
                `;
            } else {
                const genderIcon = item.dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                                 item.dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
                
                html += `
                    <div class="pedigree-mobile-item" data-dog-id="${item.dog.id}" data-generation="${item.generation}">
                        <div class="pedigree-item-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="relation-label">
                                    <i class="bi ${genderIcon} me-1"></i>
                                    ${item.relation}
                                </div>
                                <span class="generation-badge">G${item.generation}</span>
                            </div>
                        </div>
                        <div class="pedigree-item-body">
                            <div class="dog-name-line">
                                <strong>${item.dog.naam || t('unknown')}</strong>
                                ${item.dog.kennelnaam ? `<span class="text-muted ms-2">${item.dog.kennelnaam}</span>` : ''}
                            </div>
                            <div class="dog-details-line">
                                ${item.dog.stamboomnr ? `<span class="stamboom">${item.dog.stamboomnr}</span>` : ''}
                                ${item.dog.ras ? `<span class="ras">${item.dog.ras}</span>` : ''}
                                <span class="geslacht">
                                    ${item.dog.geslacht === 'reuen' ? t('male') : 
                                      item.dog.geslacht === 'teven' ? t('female') : t('unknown')}
                                </span>
                            </div>
                            <div class="click-hint">
                                <i class="bi bi-info-circle"></i> ${t('clickForDetails')}
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    // TABLET WEERGAVE - Compacte horizontale layout
    renderTabletPedigree(pedigreeTree) {
        const t = this.t.bind(this);
        
        return `
            <div class="pedigree-tablet-container">
                <div class="pedigree-tablet-header mb-3">
                    <h4>${t('pedigree4Gen')}</h4>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary btn-switch-view">
                            <i class="bi bi-phone"></i> ${t('switchToMobile')}
                        </button>
                        <button class="btn btn-sm btn-outline-secondary btn-zoom-control" data-action="zoomOut">
                            <i class="bi bi-dash-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary btn-zoom-control" data-action="resetZoom">
                            <i class="bi bi-zoom-reset"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary btn-zoom-control" data-action="zoomIn">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
                
                <div class="pedigree-tablet-grid">
                    <!-- Generatie 0 -->
                    <div class="generation-col">
                        <div class="generation-label">${t('generation')} 0</div>
                        ${this.getCompactCardHTML(pedigreeTree.mainDog, t('mainDog'), true)}
                    </div>
                    
                    <!-- Generatie 1 -->
                    <div class="generation-col">
                        <div class="generation-label">${t('generation')} 1</div>
                        ${this.getCompactCardHTML(pedigreeTree.father, t('father'))}
                        ${this.getCompactCardHTML(pedigreeTree.mother, t('mother'))}
                    </div>
                    
                    <!-- Generatie 2 -->
                    <div class="generation-col">
                        <div class="generation-label">${t('generation')} 2</div>
                        ${this.getCompactCardHTML(pedigreeTree.paternalGrandfather, t('grandfather'))}
                        ${this.getCompactCardHTML(pedigreeTree.paternalGrandmother, t('grandmother'))}
                        ${this.getCompactCardHTML(pedigreeTree.maternalGrandfather, t('grandfather'))}
                        ${this.getCompactCardHTML(pedigreeTree.maternalGrandmother, t('grandmother'))}
                    </div>
                    
                    <!-- Generatie 3 -->
                    <div class="generation-col">
                        <div class="generation-label">${t('generation')} 3</div>
                        ${this.getCompactCardHTML(pedigreeTree.paternalGreatGrandfather1, t('greatGrandfather'))}
                        ${this.getCompactCardHTML(pedigreeTree.paternalGreatGrandmother1, t('greatGrandmother'))}
                        ${this.getCompactCardHTML(pedigreeTree.paternalGreatGrandfather2, t('greatGrandfather'))}
                        ${this.getCompactCardHTML(pedigreeTree.paternalGreatGrandmother2, t('greatGrandmother'))}
                        ${this.getCompactCardHTML(pedigreeTree.maternalGreatGrandfather1, t('greatGrandfather'))}
                        ${this.getCompactCardHTML(pedigreeTree.maternalGreatGrandmother1, t('greatGrandmother'))}
                        ${this.getCompactCardHTML(pedigreeTree.maternalGreatGrandfather2, t('greatGrandfather'))}
                        ${this.getCompactCardHTML(pedigreeTree.maternalGreatGrandmother2, t('greatGrandmother'))}
                    </div>
                </div>
            </div>
        `;
    }
    
    // DESKTOP WEERGAVE - Horizontale layout
    renderDesktopPedigree(pedigreeTree) {
        const t = this.t.bind(this);
        
        return `
            <div class="pedigree-desktop-container">
                <div class="pedigree-desktop-header mb-3">
                    <button class="btn btn-sm btn-outline-primary btn-switch-view">
                        <i class="bi bi-phone"></i> ${t('switchToMobile')}
                    </button>
                </div>
                
                <div class="pedigree-desktop-grid">
                    <!-- Generatie 0 -->
                    <div class="generation-desktop-col">
                        <div class="generation-label">${t('currentDog')}</div>
                        ${this.getDesktopCardHTML(pedigreeTree.mainDog, t('mainDog'), true)}
                    </div>
                    
                    <!-- Generatie 1 -->
                    <div class="generation-desktop-col">
                        <div class="generation-label">${t('parents')}</div>
                        ${this.getDesktopCardHTML(pedigreeTree.father, t('father'))}
                        ${this.getDesktopCardHTML(pedigreeTree.mother, t('mother'))}
                    </div>
                    
                    <!-- Generatie 2 -->
                    <div class="generation-desktop-col">
                        <div class="generation-label">${t('grandparents')}</div>
                        ${this.getDesktopCardHTML(pedigreeTree.paternalGrandfather, t('grandfather'))}
                        ${this.getDesktopCardHTML(pedigreeTree.paternalGrandmother, t('grandmother'))}
                        ${this.getDesktopCardHTML(pedigreeTree.maternalGrandfather, t('grandfather'))}
                        ${this.getDesktopCardHTML(pedigreeTree.maternalGrandmother, t('grandmother'))}
                    </div>
                    
                    <!-- Generatie 3 -->
                    <div class="generation-desktop-col">
                        <div class="generation-label">${t('greatGrandparents')}</div>
                        ${this.getDesktopCardHTML(pedigreeTree.paternalGreatGrandfather1, t('greatGrandfather'))}
                        ${this.getDesktopCardHTML(pedigreeTree.paternalGreatGrandmother1, t('greatGrandmother'))}
                        ${this.getDesktopCardHTML(pedigreeTree.paternalGreatGrandfather2, t('greatGrandfather'))}
                        ${this.getDesktopCardHTML(pedigreeTree.paternalGreatGrandmother2, t('greatGrandmother'))}
                        ${this.getDesktopCardHTML(pedigreeTree.maternalGreatGrandfather1, t('greatGrandfather'))}
                        ${this.getDesktopCardHTML(pedigreeTree.maternalGreatGrandmother1, t('greatGrandmother'))}
                        ${this.getDesktopCardHTML(pedigreeTree.maternalGreatGrandfather2, t('greatGrandfather'))}
                        ${this.getDesktopCardHTML(pedigreeTree.maternalGreatGrandmother2, t('greatGrandmother'))}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Helper methods voor kaarten
    getCompactCardHTML(dog, relation, isMain = false) {
        const t = this.t.bind(this);
        
        if (!dog) {
            return `
                <div class="pedigree-card-compact empty">
                    <div class="card-header-compact">
                        <div class="relation-compact">${relation}</div>
                    </div>
                    <div class="card-body-compact">
                        <div class="text-muted fst-italic">${t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        return `
            <div class="pedigree-card-compact ${isMain ? 'main-dog' : ''}" data-dog-id="${dog.id}">
                <div class="card-header-compact ${isMain ? 'bg-primary' : 'bg-secondary'}">
                    <div class="relation-compact">
                        <i class="bi ${genderIcon} me-1"></i>
                        ${relation}
                    </div>
                </div>
                <div class="card-body-compact">
                    <div class="dog-name-compact">${dog.naam || t('unknown')}</div>
                    ${dog.stamboomnr ? `<div class="dog-pedigree-compact">${dog.stamboomnr}</div>` : ''}
                    <div class="click-hint-compact">
                        <i class="bi bi-info-circle"></i> ${t('clickForDetails')}
                    </div>
                </div>
            </div>
        `;
    }
    
    getDesktopCardHTML(dog, relation, isMain = false) {
        const t = this.t.bind(this);
        
        if (!dog) {
            return `
                <div class="pedigree-card-desktop empty">
                    <div class="card-header-desktop">
                        ${relation}
                    </div>
                    <div class="card-body-desktop">
                        <div class="text-muted fst-italic">${t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        return `
            <div class="pedigree-card-desktop ${isMain ? 'main-dog' : ''}" data-dog-id="${dog.id}">
                <div class="card-header-desktop ${isMain ? 'bg-primary' : 'bg-secondary'}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="bi ${genderIcon} me-1"></i>
                            ${relation}
                        </div>
                        ${dog.kennelnaam ? `<div class="kennel-name">${dog.kennelnaam}</div>` : ''}
                    </div>
                </div>
                <div class="card-body-desktop">
                    <div class="dog-name-desktop">${dog.naam || t('unknown')}</div>
                    <div class="dog-details-desktop">
                        ${dog.stamboomnr ? `<div class="pedigree-nr">${dog.stamboomnr}</div>` : ''}
                        ${dog.ras ? `<div class="breed">${dog.ras}</div>` : ''}
                    </div>
                    <div class="click-hint-desktop">
                        <i class="bi bi-info-circle"></i> ${t('clickForDetails')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // DETAIL POPUP voor wanneer op card geklikt wordt
    getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        const t = this.t.bind(this);
        const genderText = dog.geslacht === 'reuen' ? t('male') : 
                          dog.geslacht === 'teven' ? t('female') : t('unknown');
        
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
                    <div class="dog-popup-name mb-3">
                        <h4>${dog.naam || t('unknown')}</h4>
                        ${dog.kennelnaam ? `<div class="text-muted">${dog.kennelnaam}</div>` : ''}
                    </div>
                    
                    <div class="info-section mb-3">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="info-grid">
                            ${dog.stamboomnr ? `
                            <div class="info-item">
                                <span class="info-label">${t('pedigreeNumber')}:</span>
                                <span class="info-value">${dog.stamboomnr}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.ras ? `
                            <div class="info-item">
                                <span class="info-label">${t('breed')}:</span>
                                <span class="info-value">${dog.ras}</span>
                            </div>
                            ` : ''}
                            
                            <div class="info-item">
                                <span class="info-label">${t('gender')}:</span>
                                <span class="info-value">${genderText}</span>
                            </div>
                            
                            ${dog.vachtkleur ? `
                            <div class="info-item">
                                <span class="info-label">${t('coatColor')}:</span>
                                <span class="info-value">${dog.vachtkleur}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.geboortedatum ? `
                            <div class="info-item">
                                <span class="info-label">${t('birthDate')}:</span>
                                <span class="info-value">${this.formatDate(dog.geboortedatum)}</span>
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="info-item">
                                <span class="info-label">${t('deathDate')}:</span>
                                <span class="info-value">${this.formatDate(dog.overlijdensdatum)}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${dog.opmerkingen ? `
                    <div class="info-section mb-3">
                        <h6><i class="bi bi-chat-text me-1"></i> ${t('remarks')}</h6>
                        <div class="remarks-box">
                            ${dog.opmerkingen}
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-secondary popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${t('closePopup')}
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
        
        const container = document.getElementById('pedigreeContainer');
        container.innerHTML = this.renderPedigree(pedigreeTree);
        
        // Setup events
        this.setupPedigreeEvents(pedigreeTree);
        
        const modal = new bootstrap.Modal(document.getElementById('pedigreeModal'));
        modal.show();
    }
    
    createPedigreeModal() {
        const t = this.t.bind(this);
        
        const modalHTML = `
            <div class="modal fade" id="pedigreeModal" tabindex="-1" aria-labelledby="pedigreeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="pedigreeModalLabel">
                                <i class="bi bi-diagram-3 me-2"></i> ${t('pedigree4Gen')}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-3">
                            <div class="pedigree-container" id="pedigreeContainer">
                                <div class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">${t('generatingPedigree')}</span>
                                    </div>
                                    <p class="mt-3">${t('generatingPedigree')}</p>
                                </div>
                            </div>
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
                /* GEMEENSCHAPPELIJKE STYLES */
                .pedigree-container {
                    height: calc(100vh - 150px);
                    overflow-y: auto;
                }
                
                /* MOBIELE WEERGAVE STYLES - SearchManager stijl */
                .pedigree-mobile-container {
                    padding: 10px;
                }
                
                .pedigree-mobile-header {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    margin-bottom: 15px;
                }
                
                .generation-navigation {
                    border-top: 1px solid #dee2e6;
                    padding-top: 10px;
                }
                
                .btn-generation {
                    border-radius: 20px;
                    padding: 4px 12px;
                    font-size: 0.8rem;
                }
                
                .btn-generation.active {
                    background-color: #0d6efd;
                    color: white;
                    border-color: #0d6efd;
                }
                
                .pedigree-mobile-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .pedigree-mobile-item {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .pedigree-mobile-item:hover {
                    background-color: #f8f9fa;
                    border-color: #0d6efd;
                    transform: translateX(3px);
                }
                
                .pedigree-mobile-item.empty {
                    opacity: 0.6;
                    cursor: default;
                }
                
                .pedigree-mobile-item.empty:hover {
                    transform: none;
                    border-color: #dee2e6;
                    background: white;
                }
                
                .pedigree-item-header {
                    margin-bottom: 10px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .relation-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                }
                
                .generation-badge {
                    background: #6c757d;
                    color: white;
                    font-size: 0.7rem;
                    padding: 2px 6px;
                    border-radius: 10px;
                }
                
                .pedigree-item-body {
                    font-size: 0.9rem;
                }
                
                .dog-name-line {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0d6efd;
                    margin-bottom: 8px;
                }
                
                .dog-details-line {
                    color: #495057;
                    font-size: 0.85rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .stamboom {
                    font-weight: 600;
                }
                
                .ras {
                    font-style: italic;
                }
                
                .geslacht {
                    color: #6c757d;
                }
                
                .click-hint {
                    font-size: 0.75rem;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                /* TABLET WEERGAVE STYLES */
                .pedigree-tablet-container {
                    padding: 10px;
                }
                
                .pedigree-tablet-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .pedigree-tablet-grid {
                    display: flex;
                    gap: 15px;
                    overflow-x: auto;
                    padding: 10px 0;
                }
                
                .generation-col {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    min-width: 160px;
                }
                
                .generation-label {
                    font-weight: bold;
                    color: #495057;
                    text-align: center;
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                    background: #e9ecef;
                    padding: 5px 10px;
                    border-radius: 4px;
                }
                
                .pedigree-card-compact {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-height: 80px;
                }
                
                .pedigree-card-compact:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
                
                .pedigree-card-compact.empty {
                    opacity: 0.6;
                    cursor: default;
                }
                
                .pedigree-card-compact.empty:hover {
                    transform: none;
                    box-shadow: none;
                }
                
                .pedigree-card-compact.main-dog {
                    border: 2px solid #0d6efd;
                }
                
                .card-header-compact {
                    color: white;
                    padding: 8px 10px;
                    font-size: 0.8rem;
                }
                
                .relation-compact {
                    display: flex;
                    align-items: center;
                }
                
                .card-body-compact {
                    padding: 10px;
                }
                
                .dog-name-compact {
                    font-weight: 600;
                    color: #0d6efd;
                    margin-bottom: 5px;
                    font-size: 0.85rem;
                }
                
                .dog-pedigree-compact {
                    font-size: 0.75rem;
                    color: #6c757d;
                    margin-bottom: 5px;
                }
                
                .click-hint-compact {
                    font-size: 0.65rem;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
                
                /* DESKTOP WEERGAVE STYLES */
                .pedigree-desktop-container {
                    padding: 20px;
                }
                
                .pedigree-desktop-header {
                    text-align: right;
                }
                
                .pedigree-desktop-grid {
                    display: flex;
                    justify-content: center;
                    gap: 25px;
                    margin-top: 30px;
                }
                
                .generation-desktop-col {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .pedigree-card-desktop {
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    overflow: hidden;
                    width: 200px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .pedigree-card-desktop:hover {
                    box-shadow: 0 3px 8px rgba(0,0,0,0.15);
                    transform: translateY(-3px);
                }
                
                .pedigree-card-desktop.empty {
                    opacity: 0.6;
                    cursor: default;
                }
                
                .pedigree-card-desktop.main-dog {
                    border: 3px solid #0d6efd;
                    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
                }
                
                .card-header-desktop {
                    color: white;
                    padding: 10px 15px;
                    font-size: 0.9rem;
                }
                
                .kennel-name {
                    font-size: 0.75rem;
                    opacity: 0.9;
                }
                
                .card-body-desktop {
                    padding: 15px;
                }
                
                .dog-name-desktop {
                    font-weight: 700;
                    color: #0d6efd;
                    margin-bottom: 8px;
                    font-size: 1rem;
                }
                
                .dog-details-desktop {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: #6c757d;
                    margin-bottom: 10px;
                }
                
                .click-hint-desktop {
                    font-size: 0.75rem;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                /* POPUP STYLES */
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
                    padding: 20px;
                    animation: fadeIn 0.3s;
                }
                
                .pedigree-popup-container {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 350px;
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
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
                }
                
                .popup-header {
                    background: #0d6efd;
                    color: white;
                    padding: 16px 20px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                .popup-title {
                    margin: 0;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                }
                
                .popup-close {
                    background: none;
                    border: none;
                    font-size: 1.3rem;
                    cursor: pointer;
                    opacity: 0.8;
                    color: white;
                }
                
                .popup-close:hover {
                    opacity: 1;
                }
                
                .popup-body {
                    padding: 20px;
                    flex: 1;
                    overflow-y: auto;
                }
                
                .dog-popup-name {
                    margin-bottom: 20px;
                }
                
                .dog-popup-name h4 {
                    color: #0d6efd;
                    margin-bottom: 8px;
                }
                
                .info-section {
                    margin-bottom: 25px;
                }
                
                .info-section h6 {
                    color: #495057;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #e9ecef;
                    display: flex;
                    align-items: center;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    padding: 8px 0;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                    margin-bottom: 4px;
                }
                
                .info-value {
                    color: #212529;
                    font-size: 0.95rem;
                    word-break: break-word;
                }
                
                .remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 12px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #495057;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                .popup-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: center;
                    background: #f8f9fa;
                    border-radius: 0 0 12px 12px;
                }
                
                .popup-close-btn {
                    min-width: 130px;
                }
                
                /* RESPONSIVE BREAKPOINTS */
                @media (max-width: 768px) {
                    .pedigree-desktop-container,
                    .pedigree-tablet-container {
                        display: none;
                    }
                    
                    .pedigree-mobile-container {
                        display: block;
                    }
                    
                    .pedigree-container {
                        height: calc(100vh - 120px);
                    }
                }
                
                @media (min-width: 769px) and (max-width: 1024px) {
                    .pedigree-desktop-container,
                    .pedigree-mobile-container {
                        display: none;
                    }
                    
                    .pedigree-tablet-container {
                        display: block;
                    }
                    
                    .pedigree-container {
                        height: calc(100vh - 140px);
                    }
                }
                
                @media (min-width: 1025px) {
                    .pedigree-mobile-container,
                    .pedigree-tablet-container {
                        display: none;
                    }
                    
                    .pedigree-desktop-container {
                        display: block;
                    }
                    
                    .pedigree-container {
                        height: calc(100vh - 160px);
                    }
                }
                
                /* Print styles */
                @media print {
                    .modal-header {
                        display: none !important;
                    }
                    
                    .pedigree-container {
                        height: auto;
                        overflow: visible;
                    }
                    
                    .btn-switch-view,
                    .btn-zoom-control,
                    .btn-print {
                        display: none !important;
                    }
                    
                    .pedigree-desktop-grid {
                        display: flex !important;
                        flex-wrap: wrap;
                        gap: 10px;
                    }
                    
                    .generation-desktop-col {
                        break-inside: avoid;
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
    }
    
    setupPedigreeEvents(pedigreeTree) {
        // Click events voor honden kaarten
        const cards = document.querySelectorAll('[data-dog-id]');
        cards.forEach(card => {
            const dogId = parseInt(card.getAttribute('data-dog-id'));
            if (dogId > 0) {
                card.addEventListener('click', () => {
                    const dog = this.getDogById(dogId);
                    if (dog) {
                        const relation = card.querySelector('.relation-compact, .relation-label, .card-header-desktop')?.textContent || '';
                        this.showDogDetailPopup(dog, relation.trim());
                    }
                });
            }
        });
        
        // Generatie filter voor mobiele weergave
        const generationButtons = document.querySelectorAll('.btn-generation');
        generationButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const generation = e.target.getAttribute('data-generation');
                
                // Update active state
                generationButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filter honden op generatie
                const items = document.querySelectorAll('.pedigree-mobile-item');
                items.forEach(item => {
                    const itemGen = item.getAttribute('data-generation');
                    if (generation === 'all' || itemGen === generation) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // Switch view button
        const switchButtons = document.querySelectorAll('.btn-switch-view');
        switchButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle tussen mobiel/desktop modus
                this.isMobile = !this.isMobile;
                
                // Herlaad de pedigree
                const container = document.getElementById('pedigreeContainer');
                container.innerHTML = this.renderPedigree(pedigreeTree);
                
                // Herstel events
                this.setupPedigreeEvents(pedigreeTree);
            });
        });
        
        // Zoom controls voor tablet
        const zoomControls = document.querySelectorAll('.btn-zoom-control');
        zoomControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                const grid = document.querySelector('.pedigree-tablet-grid');
                
                if (!grid) return;
                
                let currentScale = parseFloat(grid.style.transform?.replace('scale(', '')?.replace(')', '')) || 1;
                
                switch(action) {
                    case 'zoomIn':
                        currentScale = Math.min(currentScale + 0.1, 2);
                        break;
                    case 'zoomOut':
                        currentScale = Math.max(currentScale - 0.1, 0.5);
                        break;
                    case 'resetZoom':
                        currentScale = 1;
                        break;
                }
                
                grid.style.transform = `scale(${currentScale})`;
                grid.style.transformOrigin = 'center center';
            });
        });
    }
    
    showDogDetailPopup(dog, relation) {
        const overlay = document.getElementById('pedigreePopupOverlay');
        const container = document.getElementById('pedigreePopupContainer');
        
        if (!overlay || !container) return;
        
        const popupHTML = this.getDogDetailPopupHTML(dog, relation);
        container.innerHTML = popupHTML;
        
        overlay.style.display = 'flex';
        
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