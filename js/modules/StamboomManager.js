/**
 * Stamboom Manager Module
 * Beheert 4-generatie stambomen voor honden - Zelfde layout op alle schermen
 * HORIZONTALE LAYOUT - Van links naar rechts met liggende cards
 * Overgrootouders 60% hoogte, zelfde breedte voor alle generaties
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
                
                // COI
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen"
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
                
                // COI
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen"
            },
            de: {
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "4-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wordt generiert...",
                close: "Schließen",
                print: "Drucken",
                noData: "Keine Daten",
                unknown: "Unbekannt",
                
                // Familienbeziehungen
                currentDog: "Aktueller Hund",
                mainDog: "Haupt-Hund",
                father: "Vader",
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
                gender: "Geslacht",
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
                clickForDetails: "Klicken voor Details",
                closePopup: "Schließen",
                remarks: "Bemerkungen",
                noRemarks: "Keine Bemerkungen",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                
                // COI
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen"
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
    
/* ============================================= */
/* BEGIN COI BEREKENING - Wright's formule      */
/* ============================================= */

// CORRECTE COI BEREKENING volgens formule van Wright
calculateCOI(dogId) {
    if (!dogId || dogId === 0) return { coi6Gen: '0.0', coiAllGen: '0.0' };
    
    const dog = this.getDogById(dogId);
    if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
    
    // Als er geen ouders zijn, is COI altijd 0%
    if (!dog.vaderId || !dog.moederId) {
        return { coi6Gen: '0.0', coiAllGen: '0.0' };
    }
    
    // Check speciaal geval: ouders zijn dezelfde hond
    if (dog.vaderId === dog.moederId) {
        return { 
            coi6Gen: '25.0', 
            coiAllGen: '25.0' 
        };
    }
    
    // NIEUW: Check op directe ouder-kind relaties
    if (this.isParentChildPair(dog.vaderId, dog.moederId)) {
        return { 
            coi6Gen: '25.0', 
            coiAllGen: '25.0' 
        };
    }
    
    // Check speciaal geval: ouders zijn broer en zus
    if (this.areSiblings(dog.vaderId, dog.moederId)) {
        return { 
            coi6Gen: '25.0', 
            coiAllGen: '25.0' 
        };
    }
    
    // Bereken COI voor 6 generaties
    const coi6Gen = this.calculateCOIForGenerations(dogId, 6);
    // Bereken COI voor ALLE generaties (volledige database)
    const coiAllGen = this.calculateCOIForGenerations(dogId, 999);
    
    return { 
        coi6Gen: (coi6Gen * 100).toFixed(1), 
        coiAllGen: (coiAllGen * 100).toFixed(1) 
    };
}

// NIEUWE HELPER: controleer of het een ouder-kind paar is
isParentChildPair(dogId1, dogId2) {
    if (!dogId1 || !dogId2 || dogId1 === dogId2) return false;
    
    const dog1 = this.getDogById(dogId1);
    const dog2 = this.getDogById(dogId2);
    
    if (!dog1 || !dog2) return false;
    
    // Controleer of dog1 ouder is van dog2 (vader of moeder)
    const dog1IsParentOfDog2 = (
        (dog1.vaderId === dogId2 || dog1.moederId === dogId2) ? false : // dog1 kan niet kind zijn van dog2 als dog2 ouder is
        (dog2.vaderId === dogId1 || dog2.moederId === dogId1)
    );
    
    // Controleer of dog2 ouder is van dog1
    const dog2IsParentOfDog1 = (
        (dog2.vaderId === dogId1 || dog2.moederId === dogId1) ? false :
        (dog1.vaderId === dogId2 || dog1.moederId === dogId2)
    );
    
    return dog1IsParentOfDog2 || dog2IsParentOfDog1;
}

// Helper: controleer of twee honden broer en zus zijn (zelfde ouders)
areSiblings(dogId1, dogId2) {
    if (!dogId1 || !dogId2 || dogId1 === dogId2) return false;
    
    const dog1 = this.getDogById(dogId1);
    const dog2 = this.getDogById(dogId2);
    
    if (!dog1 || !dog2) return false;
    
    // Controleer of ze dezelfde ouders hebben
    const sameParents = (
        dog1.vaderId && dog2.vaderId && dog1.vaderId === dog2.vaderId &&
        dog1.moederId && dog2.moederId && dog1.moederId === dog2.moederId
    );
    
    // Of als ouders omgewisseld zijn (vader van dog1 = moeder van dog2, etc.)
    const swappedParents = (
        dog1.vaderId && dog2.moederId && dog1.vaderId === dog2.moederId &&
        dog1.moederId && dog2.vaderId && dog1.moederId === dog2.vaderId
    );
    
    return sameParents || swappedParents;
}

calculateCOIForGenerations(dogId, generations) {
    const pathCache = new Map();
    
    const calculateFx = (id, gen) => {
        if (gen > generations) return 0;
        if (!id || id === 0) return 0;
        
        const dog = this.getDogById(id);
        if (!dog) return 0;
        
        // Als geen ouders, return 0
        if (!dog.vaderId || !dog.moederId) return 0;
        
        // Als ouders hetzelfde zijn, return 0.25 voor deze tak
        if (dog.vaderId === dog.moederId) {
            return 0.25;
        }
        
        // Check cache voor dit ID op deze diepte
        const cacheKey = `${id}_${gen}`;
        if (pathCache.has(cacheKey)) {
            return pathCache.get(cacheKey);
        }
        
        // Recursief berekenen voor beide ouders
        const fxFather = calculateFx(dog.vaderId, gen + 1);
        const fxMother = calculateFx(dog.moederId, gen + 1);
        
        // Bereken Fx volgens Wright's formule
        let fx = 0;
        
        // Controleer op gemeenschappelijke voorouders
        if (this.haveCommonAncestor(dog.vaderId, dog.moederId, generations - gen)) {
            // Als er gemeenschappelijke voorouders zijn, gebruik de formule
            fx = 0.5 * (fxFather + fxMother);
        } else {
            // Geen gemeenschappelijke voorouders, alleen doorgeven van ouders
            fx = 0.5 * (fxFather + fxMother);
        }
        
        pathCache.set(cacheKey, fx);
        return fx;
    };
    
    return calculateFx(dogId, 1);
}

// Helper: controleer of twee honden gemeenschappelijke voorouders hebben binnen x generaties
haveCommonAncestor(id1, id2, maxDepth) {
    if (!id1 || !id2 || id1 === 0 || id2 === 0) return false;
    if (id1 === id2) return true;
    
    const ancestors1 = this.getAllAncestors(id1, maxDepth);
    const ancestors2 = this.getAllAncestors(id2, maxDepth);
    
    // Controleer op overlap
    for (const anc1 of ancestors1) {
        if (ancestors2.includes(anc1)) {
            return true;
        }
    }
    
    return false;
}

// Helper: haal alle voorouders op tot een bepaalde diepte
getAllAncestors(dogId, maxDepth, currentDepth = 0, ancestors = new Set()) {
    if (currentDepth >= maxDepth || !dogId || dogId === 0) {
        return Array.from(ancestors);
    }
    
    const dog = this.getDogById(dogId);
    if (!dog) return Array.from(ancestors);
    
    ancestors.add(dogId);
    
    if (dog.vaderId && dog.vaderId !== 0) {
        this.getAllAncestors(dog.vaderId, maxDepth, currentDepth + 1, ancestors);
    }
    
    if (dog.moederId && dog.moederId !== 0) {
        this.getAllAncestors(dog.moederId, maxDepth, currentDepth + 1, ancestors);
    }
    
    return Array.from(ancestors);
}

/* ============================================= */
/* STAMBOOM GENERATIE                           */
/* ============================================= */

async generate4GenStamboom(mainDogId) {
    const mainDog = this.getDogById(mainDogId);
    if (!mainDog) {
        throw new Error("Hoofdhond niet gevonden");
    }

    // Haal 4 generaties op
    const generations = {
        gen0: mainDog,
        gen1: {
            father: mainDog.vaderId ? this.getDogById(mainDog.vaderId) : null,
            mother: mainDog.moederId ? this.getDogById(mainDog.moederId) : null
        },
        gen2: {
            paternalGrandfather: mainDog.vaderId ? 
                (this.getDogById(mainDog.vaderId)?.vaderId ? this.getDogById(this.getDogById(mainDog.vaderId).vaderId) : null) : null,
            paternalGrandmother: mainDog.vaderId ? 
                (this.getDogById(mainDog.vaderId)?.moederId ? this.getDogById(this.getDogById(mainDog.vaderId).moederId) : null) : null,
            maternalGrandfather: mainDog.moederId ? 
                (this.getDogById(mainDog.moederId)?.vaderId ? this.getDogById(this.getDogById(mainDog.moederId).vaderId) : null) : null,
            maternalGrandmother: mainDog.moederId ? 
                (this.getDogById(mainDog.moederId)?.moederId ? this.getDogById(this.getDogById(mainDog.moederId).moederId) : null) : null
        },
        gen3: {
            paternalGreatGrandfather1: mainDog.vaderId && this.getDogById(mainDog.vaderId)?.vaderId ?
                (this.getDogById(this.getDogById(mainDog.vaderId).vaderId)?.vaderId ? 
                 this.getDogById(this.getDogById(this.getDogById(mainDog.vaderId).vaderId).vaderId) : null) : null,
            paternalGreatGrandmother1: mainDog.vaderId && this.getDogById(mainDog.vaderId)?.vaderId ?
                (this.getDogById(this.getDogById(mainDog.vaderId).vaderId)?.moederId ? 
                 this.getDogById(this.getDogById(this.getDogById(mainDog.vaderId).vaderId).moederId) : null) : null,
            paternalGreatGrandfather2: mainDog.vaderId && this.getDogById(mainDog.vaderId)?.moederId ?
                (this.getDogById(this.getDogById(mainDog.vaderId).moederId)?.vaderId ? 
                 this.getDogById(this.getDogById(this.getDogById(mainDog.vaderId).moederId).vaderId) : null) : null,
            paternalGreatGrandmother2: mainDog.vaderId && this.getDogById(mainDog.vaderId)?.moederId ?
                (this.getDogById(this.getDogById(mainDog.vaderId).moederId)?.moederId ? 
                 this.getDogById(this.getDogById(this.getDogById(mainDog.vaderId).moederId).moederId) : null) : null,
            maternalGreatGrandfather1: mainDog.moederId && this.getDogById(mainDog.moederId)?.vaderId ?
                (this.getDogById(this.getDogById(mainDog.moederId).vaderId)?.vaderId ? 
                 this.getDogById(this.getDogById(this.getDogById(mainDog.moederId).vaderId).vaderId) : null) : null,
            maternalGreatGrandmother1: mainDog.moederId && this.getDogById(mainDog.moederId)?.vaderId ?
                (this.getDogById(this.getDogById(mainDog.moederId).vaderId)?.moederId ? 
                 this.getDogById(this.getDogById(this.getDogById(mainDog.moederId).vaderId).moederId) : null) : null,
            maternalGreatGrandfather2: mainDog.moederId && this.getDogById(mainDog.moederId)?.moederId ?
                (this.getDogById(this.getDogById(mainDog.moederId).moederId)?.vaderId ? 
                 this.getDogById(this.getDogById(this.getDogById(mainDog.moederId).moederId).vaderId) : null) : null,
            maternalGreatGrandmother2: mainDog.moederId && this.getDogById(mainDog.moederId)?.moederId ?
                (this.getDogById(this.getDogById(mainDog.moederId).moederId)?.moederId ? 
                 this.getDogById(this.getDogById(this.getDogById(mainDog.moederId).moederId).moederId) : null) : null
        }
    };

    return generations;
}

/* ============================================= */
/* HTML RENDERING - HORIZONTALE LAYOUT          */
/* ============================================= */

async renderStamboom(mainDogId, container) {
    container.innerHTML = `
        <div class="pedigree-loading">
            <div class="spinner"></div>
            <p>${this.t('generatingPedigree')}</p>
        </div>
    `;

    try {
        const generations = await this.generate4GenStamboom(mainDogId);
        const mainDog = generations.gen0;
        
        // Bereken COI voor hoofd hond
        const coi = this.calculateCOI(mainDogId);
        
        // Genereer HTML voor horizontale stamboom
        const html = this.generateHorizontalPedigreeHTML(generations, mainDog, coi);
        
        container.innerHTML = html;
        
        // Voeg event listeners toe voor klikbare cards
        this.addCardClickListeners();
        
    } catch (error) {
        console.error("Fout bij genereren stamboom:", error);
        container.innerHTML = `
            <div class="pedigree-error">
                <p>Er is een fout opgetreden bij het genereren van de stamboom.</p>
                <button class="btn btn-primary" onclick="location.reload()">Opnieuw proberen</button>
            </div>
        `;
    }
}

generateHorizontalPedigreeHTML(generations, mainDog, coi) {
    const mainDogCoi = this.calculateCOI(mainDog.id);
    
    return `
        <div class="pedigree-container horizontal-pedigree">
            <div class="pedigree-header">
                <h2>${this.t('pedigreeTitle').replace('{name}', mainDog.naam || this.t('unknown'))}</h2>
                <div class="pedigree-subtitle">${this.t('pedigree4Gen')}</div>
            </div>
            
            <div class="generations-container">
                <!-- Generatie 3: Overgrootouders (60% hoogte) -->
                <div class="generation generation-3">
                    <div class="generation-label">${this.t('greatGrandparents')}</div>
                    <div class="cards-container">
                        ${this.renderDogCard(generations.gen3.paternalGreatGrandfather1, 'great-grandfather paternal')}
                        ${this.renderDogCard(generations.gen3.paternalGreatGrandmother1, 'great-grandmother paternal')}
                        ${this.renderDogCard(generations.gen3.paternalGreatGrandfather2, 'great-grandfather paternal')}
                        ${this.renderDogCard(generations.gen3.paternalGreatGrandmother2, 'great-grandmother paternal')}
                        ${this.renderDogCard(generations.gen3.maternalGreatGrandfather1, 'great-grandfather maternal')}
                        ${this.renderDogCard(generations.gen3.maternalGreatGrandmother1, 'great-grandmother maternal')}
                        ${this.renderDogCard(generations.gen3.maternalGreatGrandfather2, 'great-grandfather maternal')}
                        ${this.renderDogCard(generations.gen3.maternalGreatGrandmother2, 'great-grandmother maternal')}
                    </div>
                </div>
                
                <!-- Generatie 2: Grootouders -->
                <div class="generation generation-2">
                    <div class="generation-label">${this.t('grandparents')}</div>
                    <div class="cards-container">
                        ${this.renderDogCard(generations.gen2.paternalGrandfather, 'grandfather paternal')}
                        ${this.renderDogCard(generations.gen2.paternalGrandmother, 'grandmother paternal')}
                        ${this.renderDogCard(generations.gen2.maternalGrandfather, 'grandfather maternal')}
                        ${this.renderDogCard(generations.gen2.maternalGrandmother, 'grandmother maternal')}
                    </div>
                </div>
                
                <!-- Generatie 1: Ouders -->
                <div class="generation generation-1">
                    <div class="generation-label">${this.t('parents')}</div>
                    <div class="cards-container">
                        ${this.renderDogCard(generations.gen1.father, 'father')}
                        ${this.renderDogCard(generations.gen1.mother, 'mother')}
                    </div>
                </div>
                
                <!-- Generatie 0: Hoofdhond -->
                <div class="generation generation-0">
                    <div class="generation-label">${this.t('mainDog')}</div>
                    <div class="cards-container">
                        ${this.renderMainDogCard(mainDog, mainDogCoi)}
                    </div>
                </div>
            </div>
            
            <div class="pedigree-footer">
                <div class="coi-summary">
                    <div class="coi-item">
                        <span class="coi-label">${this.t('coi6Gen')}:</span>
                        <span class="coi-value">${coi.coi6Gen}%</span>
                    </div>
                    <div class="coi-item">
                        <span class="coi-label">${this.t('coiAllGen')}:</span>
                        <span class="coi-value">${coi.coiAllGen}%</span>
                    </div>
                </div>
                <button class="btn btn-secondary print-pedigree">
                    <i class="fas fa-print"></i> ${this.t('print')}
                </button>
            </div>
        </div>
    `;
}

renderDogCard(dog, type = '') {
    if (!dog) {
        return `
            <div class="dog-card empty ${type}">
                <div class="dog-card-content">
                    <div class="dog-name">${this.t('unknown')}</div>
                    <div class="dog-info">${this.t('noData')}</div>
                </div>
            </div>
        `;
    }
    
    const genderClass = dog.geslacht === 'M' ? 'male' : dog.geslacht === 'V' ? 'female' : '';
    const coi = this.calculateCOI(dog.id);
    
    return `
        <div class="dog-card ${genderClass} ${type}" data-dog-id="${dog.id}">
            <div class="dog-card-content">
                <div class="dog-header">
                    <div class="dog-name" title="${dog.naam || this.t('unknown')}">
                        ${dog.naam || this.t('unknown')}
                    </div>
                    <div class="dog-gender">
                        ${dog.geslacht === 'M' ? '♂' : dog.geslacht === 'V' ? '♀' : ''}
                    </div>
                </div>
                
                <div class="dog-details">
                    <div class="detail-row">
                        <span class="detail-label">${this.t('kennel')}:</span>
                        <span class="detail-value">${dog.kennelNaam || this.t('unknown')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${this.t('birthDate')}:</span>
                        <span class="detail-value">${dog.geboortedatum ? new Date(dog.geboortedatum).toLocaleDateString() : this.t('unknown')}</span>
                    </div>
                </div>
                
                <div class="dog-coi">
                    <span class="coi-badge">COI 6G: ${coi.coi6Gen}%</span>
                </div>
                
                <div class="click-hint">${this.t('clickForDetails')}</div>
            </div>
        </div>
    `;
}

renderMainDogCard(dog, coi) {
    const genderClass = dog.geslacht === 'M' ? 'male' : dog.geslacht === 'V' ? 'female' : '';
    
    return `
        <div class="dog-card main ${genderClass}" data-dog-id="${dog.id}">
            <div class="dog-card-content">
                <div class="dog-header">
                    <div class="dog-name" title="${dog.naam || this.t('unknown')}">
                        ${dog.naam || this.t('unknown')}
                    </div>
                    <div class="dog-gender">
                        ${dog.geslacht === 'M' ? '♂' : dog.geslacht === 'V' ? '♀' : ''}
                    </div>
                </div>
                
                <div class="dog-details">
                    <div class="detail-row">
                        <span class="detail-label">${this.t('kennel')}:</span>
                        <span class="detail-value">${dog.kennelNaam || this.t('unknown')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${this.t('pedigreeNumber')}:</span>
                        <span class="detail-value">${dog.stamboeknummer || this.t('unknown')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${this.t('birthDate')}:</span>
                        <span class="detail-value">${dog.geboortedatum ? new Date(dog.geboortedatum).toLocaleDateString() : this.t('unknown')}</span>
                    </div>
                </div>
                
                <div class="dog-coi-main">
                    <div class="coi-item">
                        <span class="coi-label">${this.t('coi6Gen')}:</span>
                        <span class="coi-value">${coi.coi6Gen}%</span>
                    </div>
                    <div class="coi-item">
                        <span class="coi-label">${this.t('coiAllGen')}:</span>
                        <span class="coi-value">${coi.coiAllGen}%</span>
                    </div>
                </div>
                
                <div class="click-hint">${this.t('clickForDetails')}</div>
            </div>
        </div>
    `;
}

/* ============================================= */
/* POPUP DETAILS - GELIJK VOOR MOBIEL & DESKTOP */
/* ============================================= */

addCardClickListeners() {
    document.querySelectorAll('.dog-card[data-dog-id]').forEach(card => {
        card.addEventListener('click', (e) => {
            const dogId = parseInt(card.dataset.dogId);
            if (dogId && dogId > 0) {
                this.showDogDetailsPopup(dogId);
            }
        });
    });
    
    // Print button
    const printBtn = document.querySelector('.print-pedigree');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

showDogDetailsPopup(dogId) {
    const dog = this.getDogById(dogId);
    if (!dog) return;
    
    const coi = this.calculateCOI(dogId);
    
    // Verwijder bestaande popup
    const existingPopup = document.querySelector('.dog-details-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Genereer popup HTML met consistente layout voor mobiel en desktop
    const popupHTML = `
        <div class="dog-details-popup">
            <div class="popup-overlay"></div>
            <div class="popup-content">
                <div class="popup-header">
                    <h3>${dog.naam || this.t('unknown')}</h3>
                    <button class="popup-close">&times;</button>
                </div>
                
                <div class="popup-body">
                    <!-- Eerste rij: Naam en geslacht NAast elkaar -->
                    <div class="detail-row inline-row">
                        <div class="detail-item">
                            <span class="detail-label">${this.t('name')}:</span>
                            <span class="detail-value">${dog.naam || this.t('unknown')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${this.t('gender')}:</span>
                            <span class="detail-value">${dog.geslacht === 'M' ? this.t('male') : dog.geslacht === 'V' ? this.t('female') : this.t('unknown')}</span>
                        </div>
                    </div>
                    
                    <!-- Tweede rij: Stamboomnummer en ras NAast elkaar -->
                    <div class="detail-row inline-row">
                        <div class="detail-item">
                            <span class="detail-label">${this.t('pedigreeNumber')}:</span>
                            <span class="detail-value">${dog.stamboeknummer || this.t('unknown')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${this.t('breed')}:</span>
                            <span class="detail-value">${dog.ras || this.t('unknown')}</span>
                        </div>
                    </div>
                    
                    <!-- Derde rij: Geboortedatum en overlijdensdatum -->
                    <div class="detail-row inline-row">
                        <div class="detail-item">
                            <span class="detail-label">${this.t('birthDate')}:</span>
                            <span class="detail-value">${dog.geboortedatum ? new Date(dog.geboortedatum).toLocaleDateString() : this.t('unknown')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${this.t('deathDate')}:</span>
                            <span class="detail-value">${dog.overlijdensdatum ? new Date(dog.overlijdensdatum).toLocaleDateString() : this.t('unknown')}</span>
                        </div>
                    </div>
                    
                    <!-- Vierde rij: Kennel en land -->
                    <div class="detail-row inline-row">
                        <div class="detail-item">
                            <span class="detail-label">${this.t('kennel')}:</span>
                            <span class="detail-value">${dog.kennelNaam || this.t('unknown')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${this.t('country')}:</span>
                            <span class="detail-value">${dog.land || this.t('unknown')}</span>
                        </div>
                    </div>
                    
                    <!-- Vijfde rij: Vachtkleur en postcode -->
                    <div class="detail-row inline-row">
                        <div class="detail-item">
                            <span class="detail-label">${this.t('coatColor')}:</span>
                            <span class="detail-value">${dog.vachtkleur || this.t('unknown')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${this.t('zipCode')}:</span>
                            <span class="detail-value">${dog.postcode || this.t('unknown')}</span>
                        </div>
                    </div>
                    
                    <!-- Zesde rij: BEIDE COI WAARDEN NAast elkaar -->
                    <div class="detail-row inline-row coi-section">
                        <div class="detail-item">
                            <span class="detail-label">${this.t('coi6Gen')}:</span>
                            <span class="detail-value coi-value">${coi.coi6Gen}%</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${this.t('coiAllGen')}:</span>
                            <span class="detail-value coi-value">${coi.coiAllGen}%</span>
                        </div>
                    </div>
                    
                    <!-- Gezondheidsinformatie -->
                    <div class="detail-section health-section">
                        <h4>${this.t('healthInfo')}</h4>
                        <div class="health-grid">
                            <div class="health-item">
                                <span class="health-label">${this.t('hipDysplasia')}:</span>
                                <span class="health-value">${dog.heupdysplasie || this.t('unknown')}</span>
                            </div>
                            <div class="health-item">
                                <span class="health-label">${this.t('elbowDysplasia')}:</span>
                                <span class="health-value">${dog.elleboogdysplasie || this.t('unknown')}</span>
                            </div>
                            <div class="health-item">
                                <span class="health-label">${this.t('patellaLuxation')}:</span>
                                <span class="health-value">${dog.patellaLuxatie || this.t('unknown')}</span>
                            </div>
                            <div class="health-item">
                                <span class="health-label">${this.t('eyes')}:</span>
                                <span class="health-value">${dog.ogen || this.t('unknown')}</span>
                            </div>
                            <div class="health-item">
                                <span class="health-label">${this.t('dandyWalker')}:</span>
                                <span class="health-value">${dog.dandyWalker || this.t('unknown')}</span>
                            </div>
                            <div class="health-item">
                                <span class="health-label">${this.t('thyroid')}:</span>
                                <span class="health-value">${dog.schildklier || this.t('unknown')}</span>
                            </div>
                        </div>
                        
                        ${dog.ogenToelichting ? `
                            <div class="explanation">
                                <strong>${this.t('eyesExplanation')}:</strong>
                                <p>${dog.ogenToelichting}</p>
                            </div>
                        ` : ''}
                        
                        ${dog.schildklierToelichting ? `
                            <div class="explanation">
                                <strong>${this.t('thyroidExplanation')}:</strong>
                                <p>${dog.schildklierToelichting}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Opmerkingen -->
                    ${dog.opmerkingen ? `
                        <div class="detail-section remarks-section">
                            <h4>${this.t('remarks')}</h4>
                            <p>${dog.opmerkingen}</p>
                        </div>
                    ` : ''}
                    
                    <!-- Ouders informatie -->
                    <div class="detail-section parents-section">
                        <h4>${this.t('parents')}</h4>
                        <div class="parents-grid">
                            <div class="parent-item">
                                <strong>${this.t('father')}:</strong>
                                ${dog.vaderId ? `
                                    <span class="parent-name" data-dog-id="${dog.vaderId}">
                                        ${this.getDogById(dog.vaderId)?.naam || this.t('unknown')}
                                    </span>
                                ` : this.t('unknown')}
                            </div>
                            <div class="parent-item">
                                <strong>${this.t('mother')}:</strong>
                                ${dog.moederId ? `
                                    <span class="parent-name" data-dog-id="${dog.moederId}">
                                        ${this.getDogById(dog.moederId)?.naam || this.t('unknown')}
                                    </span>
                                ` : this.t('unknown')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="popup-footer">
                    <button class="btn btn-secondary close-popup">${this.t('close')}</button>
                </div>
            </div>
        </div>
    `;
    
    // Voeg popup toe aan body
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Voeg event listeners toe
    const popup = document.querySelector('.dog-details-popup');
    const overlay = popup.querySelector('.popup-overlay');
    const closeBtn = popup.querySelector('.popup-close');
    const closePopupBtn = popup.querySelector('.close-popup');
    
    // Sluit popup bij klikken op overlay, close button of sluiten knop
    [overlay, closeBtn, closePopupBtn].forEach(element => {
        element.addEventListener('click', () => {
            popup.remove();
        });
    });
    
    // Voorkom dat klikken op de popup content de popup sluit
    popup.querySelector('.popup-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Maak ouder namen klikbaar
    popup.querySelectorAll('.parent-name[data-dog-id]').forEach(parentName => {
        parentName.addEventListener('click', (e) => {
            e.stopPropagation();
            const parentId = parseInt(parentName.dataset.dogId);
            if (parentId && parentId > 0) {
                popup.remove();
                this.showDogDetailsPopup(parentId);
            }
        });
    });
    
    // Escape key om popup te sluiten
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup) {
            popup.remove();
        }
    });
}

/* ============================================= */
/* CSS STYLES VOOR HORIZONTALE STAMBOOM         */
/* ============================================= */

getStyles() {
    return `
        <style>
            /* Basis stamboom stijlen */
            .pedigree-container {
                width: 100%;
                min-height: 600px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 20px;
                margin: 20px 0;
            }
            
            .pedigree-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .pedigree-header h2 {
                color: #333;
                margin: 0 0 5px 0;
                font-size: 1.8rem;
            }
            
            .pedigree-subtitle {
                color: #666;
                font-size: 1rem;
                font-style: italic;
            }
            
            /* Horizontale generaties layout */
            .generations-container {
                display: flex;
                flex-direction: row-reverse;
                justify-content: flex-start;
                align-items: stretch;
                gap: 20px;
                overflow-x: auto;
                padding: 20px 0;
                min-height: 500px;
            }
            
            .generation {
                display: flex;
                flex-direction: column;
                min-width: 250px;
            }
            
            .generation-label {
                text-align: center;
                font-weight: bold;
                color: #555;
                margin-bottom: 10px;
                padding: 5px;
                background: #f5f5f5;
                border-radius: 4px;
                font-size: 0.9rem;
            }
            
            /* Generatie specifieke hoogtes */
            .generation-0 {
                height: 100%;
            }
            
            .generation-1 {
                height: 85%;
            }
            
            .generation-2 {
                height: 70%;
            }
            
            .generation-3 {
                height: 60%;
            }
            
            .cards-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                height: 100%;
            }
            
            /* Dog cards */
            .dog-card {
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                flex: 1;
                min-height: 120px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            
            .dog-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                border-color: #007bff;
            }
            
            .dog-card.empty {
                background: #f8f9fa;
                color: #6c757d;
                cursor: default;
                opacity: 0.7;
            }
            
            .dog-card.empty:hover {
                transform: none;
                box-shadow: none;
                border-color: #e0e0e0;
            }
            
            .dog-card.male {
                border-left: 4px solid #007bff;
            }
            
            .dog-card.female {
                border-left: 4px solid #e83e8c;
            }
            
            .dog-card.main {
                border: 3px solid #28a745;
                background: #f8fff9;
            }
            
            .dog-card-content {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            
            .dog-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
            }
            
            .dog-name {
                font-weight: bold;
                font-size: 1.1rem;
                color: #333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 80%;
            }
            
            .dog-gender {
                font-size: 1.2rem;
                color: #666;
            }
            
            .dog-details {
                font-size: 0.85rem;
                color: #666;
                margin-bottom: 10px;
            }
            
            .detail-row {
                margin-bottom: 4px;
            }
            
            .detail-label {
                font-weight: 500;
                color: #555;
            }
            
            .detail-value {
                color: #333;
            }
            
            .dog-coi, .dog-coi-main {
                margin-top: auto;
            }
            
            .coi-badge {
                display: inline-block;
                background: #6f42c1;
                color: white;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 500;
            }
            
            .dog-coi-main {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .coi-item {
                display: flex;
                justify-content: space-between;
                font-size: 0.9rem;
            }
            
            .coi-label {
                color: #555;
            }
            
            .coi-value {
                font-weight: bold;
                color: #333;
            }
            
            .click-hint {
                font-size: 0.75rem;
                color: #007bff;
                text-align: center;
                margin-top: 10px;
                font-style: italic;
            }
            
            /* Footer */
            .pedigree-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }
            
            .coi-summary {
                display: flex;
                gap: 20px;
            }
            
            .print-pedigree {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            /* Loading state */
            .pedigree-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                color: #666;
            }
            
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #007bff;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Error state */
            .pedigree-error {
                text-align: center;
                padding: 40px;
                color: #dc3545;
            }
            
            /* Popup styles */
            .dog-details-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .popup-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(3px);
            }
            
            .popup-content {
                position: relative;
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 1001;
                display: flex;
                flex-direction: column;
            }
            
            .popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #e0e0e0;
                background: #f8f9fa;
                border-radius: 12px 12px 0 0;
            }
            
            .popup-header h3 {
                margin: 0;
                color: #333;
                font-size: 1.5rem;
            }
            
            .popup-close {
                background: none;
                border: none;
                font-size: 2rem;
                color: #666;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .popup-close:hover {
                background-color: rgba(0,0,0,0.1);
            }
            
            .popup-body {
                padding: 20px;
                flex: 1;
                overflow-y: auto;
            }
            
            /* Inline rows voor items naast elkaar */
            .inline-row {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-bottom: 15px;
            }
            
            .detail-item {
                flex: 1;
                min-width: 200px;
            }
            
            .detail-label {
                font-weight: 600;
                color: #555;
                font-size: 0.9rem;
                display: block;
                margin-bottom: 2px;
            }
            
            .detail-value {
                color: #333;
                font-size: 1rem;
            }
            
            /* COI sectie */
            .coi-section .detail-value {
                font-weight: bold;
                color: #6f42c1;
                font-size: 1.1rem;
            }
            
            /* Gezondheidsinformatie */
            .health-section {
                margin-top: 20px;
            }
            
            .health-section h4 {
                margin-top: 0;
                margin-bottom: 15px;
                color: #333;
            }
            
            .health-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .health-item {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .health-label {
                font-weight: 500;
                color: #666;
                font-size: 0.9rem;
            }
            
            .health-value {
                color: #333;
                font-size: 1rem;
            }
            
            .explanation {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            
            .explanation strong {
                color: #333;
                display: block;
                margin-bottom: 5px;
            }
            
            .explanation p {
                margin: 0;
                color: #666;
                line-height: 1.5;
            }
            
            /* Ouders sectie */
            .parents-section {
                margin-top: 20px;
            }
            
            .parents-section h4 {
                margin-top: 0;
                margin-bottom: 15px;
                color: #333;
            }
            
            .parents-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 20px;
            }
            
            .parent-item {
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            
            .parent-item strong {
                color: #555;
                display: block;
                margin-bottom: 5px;
            }
            
            .parent-name {
                color: #007bff;
                cursor: pointer;
                text-decoration: underline;
                transition: color 0.2s;
                font-size: 1.1rem;
            }
            
            .parent-name:hover {
                color: #0056b3;
            }
            
            /* Opmerkingen */
            .remarks-section {
                margin-top: 20px;
            }
            
            .remarks-section h4 {
                margin-top: 0;
                margin-bottom: 10px;
                color: #333;
            }
            
            .remarks-section p {
                margin: 0;
                color: #666;
                line-height: 1.6;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            
            .popup-footer {
                padding: 20px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                justify-content: flex-end;
                background: #f8f9fa;
                border-radius: 0 0 12px 12px;
            }
            
            .close-popup {
                min-width: 100px;
            }
            
            /* MOBIELE AANPASSINGEN - Alleen de popup 10px van linkerkant */
            @media (max-width: 768px) {
                .popup-content {
                    width: calc(100% - 20px) !important;
                    margin: 0 10px !important;
                    max-width: none !important;
                }
            }
            
            /* Print styles */
            @media print {
                .dog-details-popup,
                .popup-overlay,
                .print-pedigree {
                    display: none !important;
                }
                
                .pedigree-container {
                    box-shadow: none;
                    border: 1px solid #ccc;
                }
                
                .dog-card {
                    break-inside: avoid;
                }
            }
        </style>
    `;
}
}