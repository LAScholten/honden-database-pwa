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
                    <!-- Eerste rij: Naam en geslacht -->
                    <div class="detail-section">
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
                    </div>
                    
                    <!-- Tweede rij: Stamboomnummer en ras NAast elkaar -->
                    <div class="detail-section">
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
                    </div>
                    
                    <!-- Derde rij: Geboortedatum en overlijdensdatum -->
                    <div class="detail-section">
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
                    </div>
                    
                    <!-- Vierde rij: Kennel en land -->
                    <div class="detail-section">
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
                    </div>
                    
                    <!-- Vijfde rij: Vachtkleur en postcode -->
                    <div class="detail-section">
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
                    </div>
                    
                    <!-- Zesde rij: BEIDE COI WAARDEN NAast elkaar -->
                    <div class="detail-section coi-section">
                        <div class="detail-row inline-row">
                            <div class="detail-item">
                                <span class="detail-label">${this.t('coi6Gen')}:</span>
                                <span class="detail-value coi-value">${coi.coi6Gen}%</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${this.t('coiAllGen')}:</span>
                                <span class="detail-value coi-value">${coi.coiAllGen}%</span>
                            </div>
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
                        
                        <div class="health-explanations">
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
            
            /* ============================================= */
            /* POPUP STYLES - CONSISTENT MOBIEL & DESKTOP   */
            /* ============================================= */
            
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
            
            /* Detail secties - consistente layout voor alle schermen */
            .detail-section {
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .detail-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            
            /* INLINE ROWS - Voor items naast elkaar */
            .inline-row {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-bottom: 10px;
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
                word-break: break-word;
            }
            
            /* COI Sectie - beide waarden naast elkaar */
            .coi-section .detail-value {
                font-weight: bold;
                color: #6f42c1;
                font-size: 1.1rem;
            }
            
            /* Gezondheidsinformatie */
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
            
            .health-explanations {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
            }
            
            .explanation {
                margin-bottom: 15px;
            }
            
            .explanation:last-child {
                margin-bottom: 0;
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
                word-break: break-word;
            }
            
            .parent-name:hover {
                color: #0056b3;
            }
            
            /* Opmerkingen */
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
            
            /* MOBIELE AANPASSINGEN VOOR POPUP */
            @media (max-width: 768px) {
                /* Popup begint 10px van linkerkant */
                .popup-content {
                    width: calc(100% - 20px) !important;
                    margin: 10px !important;
                    max-width: none !important;
                }
                
                /* Inline rows worden op mobiel gestapeld */
                .inline-row {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .detail-item {
                    min-width: 100%;
                }
                
                /* Gezondheidsgrid wordt 1 kolom */
                .health-grid {
                    grid-template-columns: 1fr !important;
                }
                
                /* Ouders grid wordt 1 kolom */
                .parents-grid {
                    grid-template-columns: 1fr !important;
                }
                
                /* Kleinere padding op mobiel */
                .popup-header,
                .popup-body,
                .popup-footer {
                    padding: 15px;
                }
                
                .popup-header h3 {
                    font-size: 1.3rem;
                }
            }
            
            /* Extra kleine schermen */
            @media (max-width: 480px) {
                .popup-content {
                    border-radius: 8px;
                }
                
                .detail-label {
                    font-size: 0.85rem;
                }
                
                .detail-value {
                    font-size: 0.95rem;
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

// Helper: bereken COI voor X generaties - GECORRIGEERDE IMPLEMENTATIE
calculateCOIForGenerations(dogId, maxGenerations) {
    if (!dogId || dogId === 0 || maxGenerations <= 0) return 0;
    
    const dog = this.getDogById(dogId);
    if (!dog || !dog.vaderId || !dog.moederId) {
        return 0;
    }
    
    // Check op dezelfde ouders
    if (dog.vaderId === dog.moederId) {
        return 0.25;
    }
    
    // Check op ouder-kind relaties - stop direct
    if (this.isParentChildPair(dog.vaderId, dog.moederId)) {
        return 0.25;
    }
    
    // Check op broer/zus ouders - stop direct
    if (this.areSiblings(dog.vaderId, dog.moederId)) {
        return 0.25;
    }
    
    // GECORRIGEERDE BEREKENING volgens Wright's formule:
    // Fₓ = Σ[(½)^(n₁ + n₂ + 1) * (1 + Fₐ)] voor alle gemeenschappelijke voorouders
    
    let totalCOI = 0;
    const processedAncestors = new Set(); // Voorkom dubbele verwerking
    
    // Vind alle gemeenschappelijke voorouders
    const commonAncestors = this.findCommonAncestors(dogId, maxGenerations);
    
    // Voor elke gemeenschappelijke voorouder
    for (const ancestorId of commonAncestors) {
        if (processedAncestors.has(ancestorId)) continue;
        processedAncestors.add(ancestorId);
        
        // Zoek ALLE UNIEKE paden van vader naar voorouder
        const fatherPaths = this.findAllUniquePathsToAncestor(dog.vaderId, ancestorId, maxGenerations - 1);
        // Zoek ALLE UNIEKE paden van moeder naar voorouder
        const motherPaths = this.findAllUniquePathsToAncestor(dog.moederId, ancestorId, maxGenerations - 1);
        
        // Als er paden zijn via beide ouders
        if (fatherPaths.length > 0 && motherPaths.length > 0) {
            // Bereken bijdrage voor elke unieke combinatie van paden
            for (const fPath of fatherPaths) {
                for (const mPath of motherPaths) {
                    const n1 = fPath.length; // aantal generaties via vader
                    const n2 = mPath.length; // aantal generaties via moeder
                    
                    // Berekening volgens formule: (½)^(n₁ + n₂ + 1)
                    const baseContribution = Math.pow(0.5, n1 + n2 + 1);
                    
                    // (1 + Fₐ) waar Fₐ de COI is van de voorouder zelf
                    // Belangrijk: bereken COI van voorouder met REDUCERED maxGenerations
                    const remainingGenerations = Math.max(0, maxGenerations - Math.max(n1, n2) - 1);
                    const ancestorCOI = this.calculateCOIForGenerations(ancestorId, remainingGenerations);
                    const contribution = baseContribution * (1 + ancestorCOI);
                    
                    totalCOI += contribution;
                }
            }
        }
    }
    
    return totalCOI;
}

// GECORRIGEERDE HELPER: vind ALLE UNIEKE paden naar een voorouder (voorkom dubbele paden)
findAllUniquePathsToAncestor(startDogId, ancestorId, maxDepth) {
    const allPaths = [];
    const visitedPaths = new Set(); // Gebruik string representatie om duplicaten te detecteren
    
    const findPathsRecursive = (currentDogId, currentDepth, currentPath) => {
        if (!currentDogId || currentDogId === 0 || currentDepth > maxDepth) return;
        
        // Voorkom oneindige loops door cirkel in stamboom
        if (currentPath.includes(currentDogId)) return;
        
        const dog = this.getDogById(currentDogId);
        if (!dog) return;
        
        const newPath = [...currentPath, currentDogId];
        
        // Als we de voorouder hebben gevonden
        if (currentDogId === ancestorId) {
            const pathKey = newPath.slice(1).join('-'); // Verwijder startpunt
            // Controleer of dit pad al is gevonden (via andere route)
            if (!visitedPaths.has(pathKey)) {
                allPaths.push(newPath.slice(1));
                visitedPaths.add(pathKey);
            }
            return;
        }
        
        // Zoek verder via vader
        if (dog.vaderId) {
            findPathsRecursive(dog.vaderId, currentDepth + 1, newPath);
        }
        
        // Zoek verder via moeder
        if (dog.moederId) {
            findPathsRecursive(dog.moederId, currentDepth + 1, newPath);
        }
    };
    
    findPathsRecursive(startDogId, 0, []);
    return allPaths;
}

// Aangepaste helper: vind alle gemeenschappelijke voorouders (exclusief ouders zelf)
findCommonAncestors(dogId, maxGenerations) {
    if (!dogId || maxGenerations <= 0) return new Set();
    
    const dog = this.getDogById(dogId);
    if (!dog || !dog.vaderId || !dog.moederId) return new Set();
    
    // Verzamel alle voorouders van vaders kant (exclusief vader zelf)
    const paternalAncestors = this.collectAllAncestors(dog.vaderId, maxGenerations - 1);
    // Verzamel alle voorouders van moeders kant (exclusief moeder zelf)
    const maternalAncestors = this.collectAllAncestors(dog.moederId, maxGenerations - 1);
    
    // Vind gemeenschappelijke voorouders
    const commonAncestors = new Set();
    for (const ancestor of paternalAncestors) {
        if (maternalAncestors.has(ancestor)) {
            commonAncestors.add(ancestor);
        }
    }
    
    return commonAncestors;
}

// Helper: verzamel ALLE voorouders tot bepaalde diepte
collectAllAncestors(dogId, maxGenerations) {
    const ancestors = new Set();
    if (!dogId || dogId === 0 || maxGenerations <= 0) return ancestors;
    
    const collectRecursive = (currentDogId, currentDepth) => {
        if (!currentDogId || currentDogId === 0 || currentDepth > maxGenerations) return;
        
        const dog = this.getDogById(currentDogId);
        if (!dog) return;
        
        // Voeg huidige hond toe (als we dieper dan 0 zijn)
        if (currentDepth > 0) {
            ancestors.add(currentDogId);
        }
        
        // Recursief ouders toevoegen
        if (dog.vaderId) {
            collectRecursive(dog.vaderId, currentDepth + 1);
        }
        if (dog.moederId) {
            collectRecursive(dog.moederId, currentDepth + 1);
        }
    };
    
    collectRecursive(dogId, 0);
    return ancestors;
}

/* ============================================= */
/* EINDE COI BEREKENING                         */
/* ============================================= */   
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
    
    // Helper voor COI kleuren
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745'; // groen
        if (value <= 6.0) return '#fd7e14'; // oranje
        return '#dc3545'; // rood
    }
    
    // LIGGENDE CARD VOOR STAMBOOM - overgrootouders kleinere hoogte
    getDogCompactCardHTML(dog, relation = '', isMainDog = false, generation = 0) {
        if (!dog) {
            return `
                <div class="pedigree-card-compact horizontal empty gen${generation}" data-dog-id="0">
                    <div class="pedigree-card-header-compact horizontal">
                        <div class="relation-compact">${relation}</div>
                    </div>
                    <div class="pedigree-card-body-compact horizontal text-center py-3">
                        <div class="no-data-text">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? 'bg-primary' : 'bg-secondary';
        
        // Bepaal of we de kennelnaam moeten tonen
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        
        // Maak een gecombineerde naam+kennel string voor automatische aanpassing
        const combinedName = dog.naam || this.t('unknown');
        const kennelSuffix = showKennel ? ` ${dog.kennelnaam}` : '';
        const fullDisplayText = combinedName + kennelSuffix;
        
        return `
            <div class="pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}">
                <div class="pedigree-card-header-compact horizontal ${headerColor}">
                    <div class="relation-compact">
                        <span class="relation-text">${relation}</span>
                        ${isMainDog ? '<span class="main-dot">★</span>' : ''}
                    </div>
                    <div class="gender-icon-compact">
                        <i class="bi ${genderIcon}"></i>
                    </div>
                </div>
                <div class="pedigree-card-body-compact horizontal">
                    <!-- Regel 1: Naam en kennelnaam in één regel -->
                    <div class="card-row card-row-1">
                        <div class="dog-name-kennel-compact" title="${fullDisplayText}">
                            ${fullDisplayText}
                        </div>
                    </div>
                    
                    <!-- Regel 2: Stamboomnummer en ras -->
                    <div class="card-row card-row-2">
                        ${dog.stamboomnr ? `
                        <div class="dog-pedigree-compact" title="${dog.stamboomnr}">
                            ${dog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${dog.ras ? `
                        <div class="dog-breed-compact" title="${dog.ras}">
                            ${dog.ras}
                        </div>
                        ` : ''}
                    </div>
                    
                    <!-- Regel 3: Klik hint -->
                    <div class="card-row card-row-3">
                        <div class="click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}
                        </div>
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
        
        // Bereken COI waarden - met correcte formule
        const coiValues = this.calculateCOI(dog.id);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        const coiAllColor = this.getCOIColor(coiValues.coiAllGen);
        
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
                    
                    <div class="info-section mb-2">
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
                            
                            <!-- COI waarden - met kleurcodering -->
                            <div class="info-item">
                                <span class="info-label">${this.t('coi6Gen')}:</span>
                                <span class="info-value coi-value" style="color: ${coi6Color}; font-weight: bold;">
                                    ${coiValues.coi6Gen}%
                                </span>
                            </div>
                            
                            <div class="info-item">
                                <span class="info-label">${this.t('coiAllGen')}:</span>
                                <span class="info-value coi-value" style="color: ${coiAllColor}; font-weight: bold;">
                                    ${coiValues.coiAllGen}%
                                </span>
                            </div>
                            
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
                    
                    <div class="info-section mb-2">
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
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="remarks-box">
                            ${dog.opmerkingen}
                        </div>
                    </div>
                    ` : `
                    <div class="info-section mb-2">
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
                        <div class="modal-body p-0" style="overflow: hidden;">
                            <!-- MOBIELE CONTAINER - 6.5 inch hoog -->
                            <div class="pedigree-mobile-wrapper" id="pedigreeMobileWrapper">
                                <div class="pedigree-container-compact" id="pedigreeContainer">
                                    <div class="text-center py-5">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">${this.t('generatingPedigree')}</span>
                                        </div>
                                        <p class="mt-3">${this.t('generatingPedigree')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- FOOTER VERWIJDERD -->
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
                /* MOBIELE WRAPPER */
                .pedigree-mobile-wrapper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #f8f9fa;
                    position: relative;
                    border-radius: 12px;
                }
                
                /* HORIZONTALE PEDIGREE CONTAINER */
                .pedigree-container-compact {
                    padding: 15px !important;
                    margin: 0 !important;
                    width: 100% !important;
                    background: #f8f9fa;
                    overflow-x: auto !important;
                    overflow-y: auto !important;
                    position: relative;
                    min-height: 0 !important;
                    box-sizing: border-box !important;
                    border-radius: inherit;
                }
                
                .pedigree-grid-compact {
                    display: flex;
                    flex-direction: row;
                    height: auto;
                    min-width: fit-content;
                    padding: 10px 15px !important;
                    gap: 20px;
                    align-items: flex-start;
                    box-sizing: border-box !important;
                    margin: 0 auto;
                }
                
                /* GENERATIE KOLOM - VERTICALE STACK VAN LIGGENDE CARDS */
                .pedigree-generation-col {
                    display: flex;
                    flex-direction: column;
                    height: auto;
                    justify-content: flex-start;
                    min-width: 0;
                }
                
                /* ZELFDE SPACING PER GENERATIE - ALLES GELIJK ZETTEN */
                .pedigree-generation-col.gen0 {
                    gap: 4px !important; /* Gelijk aan andere generaties */
                }
                
                .pedigree-generation-col.gen1 {
                    gap: 4px !important;
                }
                
                .pedigree-generation-col.gen2 {
                    gap: 4px !important;
                }
                
                .pedigree-generation-col.gen3 {
                    gap: 4px !important;  /* Gelijk aan andere generaties */
                }
                
                /* BASIS LIGGENDE CARDS */
                .pedigree-card-compact.horizontal {
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin: 0 !important;
                    padding: 0 !important;
                    flex-shrink: 0;
                }
                
                /* ZELFDE BREEDTE VOOR ALLE GENERATIES - ANDERE HOOGTE VOOR OVERGROOTOUDERS */
                .pedigree-card-compact.horizontal.gen0,
                .pedigree-card-compact.horizontal.gen1,
                .pedigree-card-compact.horizontal.gen2 {
                    width: 160px !important;
                    height: 120px !important;
                }
                
                /* OVERGROOTOUDERS: 60% HOOGTE VAN NORMALE CARDS */
                .pedigree-card-compact.horizontal.gen3 {
                    width: 160px !important;
                    height: 60px !important;  /* 60% van 100px */
                }
                
                /* Hoofdhond extra styling */
                .pedigree-card-compact.horizontal.main-dog-compact {
                    border: 2px solid #0d6efd !important;
                    background: #f0f7ff;
                    width: 170px !important;
                    height: 110px !important;
                }
                
                /* Geslacht kleuren */
                .pedigree-card-compact.horizontal.male {
                    border-left: 4px solid #0d6efd !important;
                }
                
                .pedigree-card-compact.horizontal.female {
                    border-left: 4px solid #dc3545 !important;
                }
                
                .pedigree-card-compact.horizontal:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.12);
                    transform: translateY(-1px);
                    z-index: 1;
                    position: relative;
                }
                
                .pedigree-card-compact.horizontal.empty {
                    background: #f8f9fa;
                    cursor: default;
                    opacity: 0.6;
                }
                
                .pedigree-card-compact.horizontal.empty:hover {
                    transform: none !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
                }
                
                /* CARD HEADER - VERSCHILLENDE GROOTTES PER GENERATIE */
                .pedigree-card-header-compact.horizontal {
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                
                /* Header voor gen0, gen1, gen2 */
                .pedigree-card-compact.horizontal.gen0 .pedigree-card-header-compact.horizontal,
                .pedigree-card-compact.horizontal.gen1 .pedigree-card-header-compact.horizontal,
                .pedigree-card-compact.horizontal.gen2 .pedigree-card-header-compact.horizontal {
                    padding: 5px 8px;
                    font-size: 0.7rem;
                    min-height: 22px;
                }
                
                /* Header voor gen3 (overgrootouders) - 60% van normale grootte */
                .pedigree-card-compact.horizontal.gen3 .pedigree-card-header-compact.horizontal {
                    padding: 3px 6px;
                    font-size: 0.56rem;  /* 80% van 0.7rem */
                    min-height: 16px;
                }
                
                .pedigree-card-header-compact.horizontal.bg-primary {
                    background: #0d6efd !important;
                }
                
                .pedigree-card-header-compact.horizontal.bg-secondary {
                    background: #6c757d !important;
                }
                
                .relation-compact {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    font-weight: 600;
                    overflow: hidden;
                    flex: 1;
                }
                
                .relation-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .main-dot {
                    color: #ffc107;
                    font-size: 0.7rem;
                    flex-shrink: 0;
                }
                
                .gender-icon-compact {
                    flex-shrink: 0;
                    margin-left: 4px;
                }
                
                /* CARD BODY - VERSCHILLENDE PADDING PER GENERATIE */
                .pedigree-card-body-compact.horizontal {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex: 1;
                }
                
                /* Body voor gen0, gen1, gen2 */
                .pedigree-card-compact.horizontal.gen0 .pedigree-card-body-compact.horizontal,
                .pedigree-card-compact.horizontal.gen1 .pedigree-card-body-compact.horizontal,
                .pedigree-card-compact.horizontal.gen2 .pedigree-card-body-compact.horizontal {
                    padding: 6px 8px;
                }
                
                /* Body voor gen3 (overgrootouders) - 60% van normale grootte */
                .pedigree-card-compact.horizontal.gen3 .pedigree-card-body-compact.horizontal {
                    padding: 4px 6px;
                }
                
                /* CARD ROWS voor liggende layout */
                .card-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                }
                
                .card-row-1 {
                    margin-bottom: 2px;
                }
                
                .card-row-2 {
                    margin-bottom: 2px;
                }
                
                .card-row-3 {
                    margin-top: auto;
                }
                
                /* NAAM + KENNEL COMBINATIE STYLING */
                .dog-name-kennel-compact {
                    font-weight: 600;
                    color: #0d6efd;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    width: 100%;
                }
                
                /* TEKST GROOTTES PER GENERATIE */
                /* Hoofdhond, ouders en grootouders (gen0, gen1, gen2) */
                .pedigree-card-compact.horizontal.gen0 .dog-name-kennel-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-name-kennel-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-name-kennel-compact {
                    font-size: 0.75rem;
                }
                
                .pedigree-card-compact.horizontal.gen0 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen0 .dog-breed-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-breed-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-breed-compact {
                    font-size: 0.65rem;
                }
                
                .pedigree-card-compact.horizontal.gen0 .click-hint-compact,
                .pedigree-card-compact.horizontal.gen1 .click-hint-compact,
                .pedigree-card-compact.horizontal.gen2 .click-hint-compact {
                    font-size: 0.55rem;
                }
                
                /* Overgrootouders (gen3): 60% van normale tekstgrootte */
                .pedigree-card-compact.horizontal.gen3 .dog-name-kennel-compact {
                    font-size: 0.6rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen3 .dog-breed-compact {
                    font-size: 0.52rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .click-hint-compact {
                    font-size: 0.44rem;
                }
                
                /* Algemene tekst styling voor andere elementen */
                .dog-pedigree-compact {
                    font-weight: 600;
                    color: #495057;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                }
                
                .dog-breed-compact {
                    color: #28a745;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                    text-align: right;
                }
                
                .no-data-text {
                    color: #6c757d;
                    font-style: italic;
                    line-height: 1.3;
                    font-size: 0.7rem;
                }
                
                .click-hint-compact {
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                    line-height: 1;
                    width: 100%;
                    padding-top: 2px;
                    border-top: 1px dashed #dee2e6;
                }
                
                /* Generation labels styling - GELIJKE RUIMTE VOOR ALLE GENERATIES */
                .generation-label {
                    font-weight: bold;
                    color: #495057;
                    text-align: center;
                    margin-bottom: 8px !important; /* Gelijk voor alle generaties */
                    font-size: 0.75rem;
                    background: #e9ecef;
                    padding: 4px 8px;
                    border-radius: 4px;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                
                /* ============================================= */
                /* BEGIN MOBIELE AANPASSINGEN (max-width: 767px) */
                /* ============================================= */
                @media (max-width: 767px) {
                    /* EENVOUDIGE MODAL ZONDER FULLSCREEN */
                    #pedigreeModal.modal.fade .modal-dialog {
                        max-width: 100%;
                        margin: 0.5rem auto;
                        height: auto;
                    }
                    
                    #pedigreeModal.modal.fade .modal-content {
                        width: 100%;
                        height: auto;
                        margin: 0;
                        border-radius: 12px; /* Afgeronde hoeken */
                        display: flex;
                        flex-direction: column;
                    }
                    
                    #pedigreeModal.modal.fade .modal-header {
                        margin: 0;
                        padding: 0.75rem 1rem;
                        border: none;
                        width: 100%;
                        flex-shrink: 0;
                        min-height: auto;
                        z-index: 1;
                        border-radius: 12px 12px 0 0; /* Afgeronde bovenhoeken */
                    }
                    
                    #pedigreeModal.modal.fade .modal-body {
                        width: 100%;
                        padding: 0;
                        margin: 0;
                        flex: 1 1 auto;
                        overflow: hidden;
                        min-height: 0;
                        max-height: 640px;
                        border-radius: 0 0 12px 12px; /* Afgeronde onderhoeken */
                    }
                    
                    .pedigree-mobile-wrapper {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        background: #f8f9fa;
                        border-radius: 0 0 12px 12px; /* Afgeronde onderhoeken */
                    }
                    
                    /* CONTAINER HOOGTE */
                    .pedigree-container-compact {
                        height: 640px !important;
                        overflow-x: auto !important; /* Horizontale scroll */
                        overflow-y: hidden !important; /* Geen verticale scroll */
                        padding: 10px !important;
                        -webkit-overflow-scrolling: touch;
                        display: flex;
                        flex-direction: column;
                        border-radius: 0 0 12px 12px; /* Afgeronde onderhoeken */
                    }
                    
                    /* Horizontale grid - generaties naast elkaar */
                    .pedigree-grid-compact {
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        height: 100% !important;
                        min-width: max-content !important;
                        padding: 10px 15px !important;
                        gap: 15px !important;
                        margin: 0 !important;
                        align-items: stretch !important;
                        box-sizing: border-box !important;
                        width: auto !important;
                    }
                    
                    /* Elke generatie kolom - centraal uitlijnen van cards */
                    .pedigree-generation-col {
                        display: flex !important;
                        flex-direction: column !important;
                        height: 100% !important;
                        flex-shrink: 0 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        position: relative;
                        justify-content: center !important; /* Centreren voor alle generaties */
                        align-items: flex-start !important;
                    }
                    
                    /* Generatie 0: Huidige hond - links in het midden */
                    .pedigree-generation-col.gen0 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important; /* Gelijk aan andere generaties */
                    }
                    
                    /* Generatie 1: Ouders - vader boven midden, moeder onder midden */
                    .pedigree-generation-col.gen1 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important; /* Gelijk aan andere generaties */
                    }
                    
                    /* Vader: 2px boven het midden */
                    .pedigree-generation-col.gen1 > .pedigree-card-compact.horizontal:nth-child(2) {
                        margin-top: -2px !important; /* 2px boven midden */
                    }
                    
                    /* Moeder: 2px onder het midden */
                    .pedigree-generation-col.gen1 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: 2px !important; /* 2px onder midden */
                    }
                    
                    /* Generatie 2: Grootouders - 4 cards vanuit het midden uitgelijnd */
                    .pedigree-generation-col.gen2 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important; /* Gelijk aan andere generaties */
                    }
                    
                    /* Grootouders: eerste 2 cards iets boven midden, laatste 2 cards iets onder midden */
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(2),
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -4px !important; /* Bovenste paar */
                    }
                    
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(4),
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: 4px !important; /* Onderste paar */
                    }
                    
                    /* Generatie 3: Overgrootouders - 8 cards centraal uitgelijnd */
                    .pedigree-generation-col.gen3 {
                        justify-content: center !important; /* CENTREREN net als andere generaties */
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important; /* Gelijk aan andere generaties */
                    }
                    
                    /* Overgrootouders: verdeel de 8 cards symmetrisch rond het midden */
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(2),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -8px !important; /* Eerste paar: 8px boven midden */
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(4),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: -4px !important; /* Tweede paar: 4px boven midden */
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(6),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(7) {
                        margin-top: 0px !important; /* Derde paar: exact midden */
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(8),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(9) {
                        margin-top: 4px !important; /* Vierde paar: 4px onder midden */
                    }
                    
                    /* Generation labels - GELIJKE RUIMTE VOOR ALLE GENERATIES */
                    .pedigree-generation-col .generation-label {
                        font-size: 0.7rem !important;
                        padding: 3px 6px !important;
                        margin-bottom: 8px !important; /* Gelijk voor alle generaties */
                        white-space: nowrap !important;
                        width: 100%;
                        text-align: center;
                        position: static !important;
                        margin-top: 0 !important;
                    }
                    
                    /* ALLE CARDS 220px BREED OP MOBIEL */
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important; /* 220px breed */
                        height: 120px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important; /* 220px breed */
                        height: 62px !important;  /* 2px hoger (was 60px) */
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important; /* 220px */
                        height: 120px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    /* Zorg dat alle cards in hun kolom blijven */
                    .pedigree-generation-col > * {
                        width: 100% !important;
                    }
                }
                
                /* Kleine mobiele schermen */
                @media (max-width: 480px) {
                    .pedigree-container-compact {
                        height: 600px !important; /* Blijft */
                        padding: 8px !important;
                    }
                    
                    .pedigree-grid-compact {
                        padding: 8px 12px !important;
                        gap: 4px !important;
                    }
                    
                    /* Cards blijven 220px breed, maar kolommen iets smaller */
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important; /* 200px breed */
                        height: 105px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important; /* 200px breed */
                        height: 59px !important;  /* 2px hoger (was 57px) */
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important; /* 220px border */
                        height: 105px !important;
                    }
                    
                    .pedigree-generation-col {
                        min-width: 220px !important; /* 220px breed */
                        width: 220px !important;
                    }
                    
                    .pedigree-generation-col.gen0,
                    .pedigree-generation-col.gen1,
                    .pedigree-generation-col.gen2,
                    .pedigree-generation-col.gen3 {
                        min-width: 220px !important;
                        width: 220px !important;
                    }
                    
                    .generation-label {
                        font-size: 0.65rem !important;
                        padding: 2px 5px !important;
                        margin-bottom: 8px !important; /* Gelijk voor alle generaties */
                    }
                }
                /* ============================================= */
                /* EINDE MOBIELE AANPASSINGEN */
                /* ============================================= */
                
                /* ============================================= */
                /* BEGIN DESKTOP STYLES (min-width: 768px) */
                /* ============================================= */
                @media (min-width: 768px) {
                    #pedigreeModal.modal.fade .modal-dialog.modal-fullscreen {
                        width: 100vw !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        max-width: none !important;
                        padding: 0 !important;
                    }
                    
                    #pedigreeModal.modal.fade .modal-content {
                        width: 100% !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        border-radius: 0 !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    
                    #pedigreeModal.modal.fade .modal-header {
                        margin: 0 !important;
                        padding: 0.75rem 1rem !important;
                        border: none !important;
                        width: 100% !important;
                        flex-shrink: 0 !important;
                        min-height: auto !important;
                        z-index: 1;
                    }
                    
                    #pedigreeModal.modal.fade .modal-body {
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        flex: 1 1 auto !important;
                        overflow: hidden !important;
                        min-height: 0 !important;
                    }
                    
                    .pedigree-mobile-wrapper {
                        height: 100%;
                        border-radius: 0;
                    }
                    
                    .pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        align-items: center;
                        padding: 0 !important;
                        display: flex;
                        border-radius: 0;
                    }
                    
                    .pedigree-grid-compact {
                        flex-direction: row;
                        height: 100%;
                        min-width: fit-content;
                        padding: 0 20px !important;
                        gap: 25px;
                        align-items: center;
                        box-sizing: border-box !important;
                        margin: 0 auto;
                    }
                    
                    .pedigree-generation-col {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        justify-content: center;
                        min-width: 0;
                    }
                    
                    /* ZELFDE GAP VOOR ALLE GENERATIES OP DESKTOP */
                    .pedigree-generation-col.gen0 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen1 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen2 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 {
                        gap: 4px !important;
                        justify-content: center; /* Overgrootouders centreren op desktop */
                    }
                    
                    /* Desktop cards - originele grootte (geen 200px op desktop) */
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 132px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 66px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 132px !important;
                    }
                    
                    /* Desktop tekstgrootte */
                    .pedigree-card-compact.horizontal.gen0 .dog-name-kennel-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-name-kennel-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-name-kennel-compact {
                        font-size: 0.8rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen0 .dog-breed-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-breed-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-breed-compact {
                        font-size: 0.7rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .click-hint-compact,
                    .pedigree-card-compact.horizontal.gen1 .click-hint-compact,
                    .pedigree-card-compact.horizontal.gen2 .click-hint-compact {
                        font-size: 0.6rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .dog-name-kennel-compact {
                        font-size: 0.64rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen3 .dog-breed-compact {
                        font-size: 0.56rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .click-hint-compact {
                        font-size: 0.48rem;
                    }
                    
                    .generation-label {
                        font-size: 0.8rem;
                        padding: 4px 8px;
                        margin-bottom: 8px !important; /* Gelijk voor alle generaties */
                    }
                }
                
                @media (min-width: 1024px) and (max-width: 1365px) {
                    .pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                    }
                    
                    .pedigree-grid-compact {
                        gap: 15px;
                        padding: 0 12px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 132px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 63px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 132px !important;
                    }
                }
                /* ============================================= */
                /* EINDE DESKTOP STYLES */
                /* ============================================= */
                
                /* POPUP STYLES - IDENTIEK VOOR MOBIEL EN DESKTOP */
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
                    animation: fadeIn 0.3s;
                    overflow-y: auto;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .pedigree-popup-container {
                    background: white;
                    border-radius: 12px;
                    max-width: 350px;
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                    width: calc(100% - 20px);
                    margin: 10px;
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
                    flex: 1;
                }
                
                .popup-close {
                    background: none;
                    border: none;
                    font-size: 1.3rem;
                    cursor: pointer;
                    opacity: 0.8;
                    color: white;
                    flex-shrink: 0;
                    margin-left: 15px;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .popup-close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
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
                    margin-bottom: 8px;
                    font-size: 1.4rem;
                }
                
                /* Minder ruimte tussen secties */
                .info-section {
                    margin-bottom: 20px;
                }
                
                .info-section h6 {
                    color: #495057;
                    margin-bottom: 10px;
                    padding-bottom: 6px;
                    border-bottom: 2px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    font-size: 1rem;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 8px;
                }
                
                @media (min-width: 400px) {
                    .info-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    padding: 6px 0;
                }
                
                /* COI waarden styling - met kleurcodering */
                .coi-value {
                    font-size: 1.05rem !important;
                    font-weight: 700 !important;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                    margin-bottom: 2px;
                    line-height: 1.2;
                }
                
                .info-value {
                    color: #212529;
                    font-size: 0.95rem;
                    line-height: 1.3;
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
                    padding: 10px 25px;
                    font-size: 1rem;
                }
                
                /* Print styles */
                @media print {
                    .modal-dialog {
                        max-width: none;
                        margin: 0;
                    }
                    
                    .modal-header {
                        display: none !important;
                    }
                    
                    .pedigree-container-compact {
                        padding: 0;
                        background: white;
                        height: auto !important;
                        overflow-x: visible !important;
                        height: 100vh !important;
                    }
                    
                    .pedigree-grid-compact {
                        flex-direction: row !important;
                        height: auto;
                        padding: 20px !important;
                        gap: 15px;
                    }
                    
                    .pedigree-generation-col {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .pedigree-card-compact.horizontal {
                        break-inside: avoid;
                        box-shadow: none;
                        border: 1px solid #ccc !important;
                        margin-bottom: 10px;
                    }
                    
                    .main-dog-compact {
                        border: 2px solid #000 !important;
                    }
                }
                
                /* Lege card styling */
                .pedigree-card-compact.horizontal.empty {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* VISUELE VERBINDINGEN */
                .pedigree-generation-col {
                    position: relative;
                }
                
                .pedigree-generation-col:not(:first-child)::before {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 50%;
                    width: 10px;
                    height: 1px;
                    background: #adb5bd;
                    opacity: 0.5;
                }
                
                /* Overgrootouder styling - subtiele opacity */
                .pedigree-card-compact.horizontal.gen3 {
                    opacity: 0.9;
                }
                
                .pedigree-card-compact.horizontal.gen3:hover {
                    opacity: 1;
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
    
    renderCompactPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) return;
        
        const gridHTML = `
            <div class="pedigree-grid-compact">
                <!-- Generatie 0: Hoofdhond -->
                <div class="pedigree-generation-col gen0">
                    <div class="generation-label">${this.t('currentDog')}</div>
                    ${this.getDogCompactCardHTML(pedigreeTree.mainDog, this.t('mainDog'), true, 0)}
                </div>
                
                <!-- Generatie 1: Ouders -->
                <div class="pedigree-generation-col gen1">
                    <div class="generation-label">${this.t('parents')}</div>
                    ${this.getDogCompactCardHTML(pedigreeTree.father, this.t('father'), false, 1)}
                    ${this.getDogCompactCardHTML(pedigreeTree.mother, this.t('mother'), false, 1)}
                </div>
                
                <!-- Generatie 2: Grootouders -->
                <div class="pedigree-generation-col gen2">
                    <div class="generation-label">${this.t('grandparents')}</div>
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGrandfather, this.t('grandfather'), false, 2)}
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGrandmother, this.t('grandmother'), false, 2)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGrandfather, this.t('grandfather'), false, 2)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGrandmother, this.t('grandmother'), false, 2)}
                </div>
                
                <!-- Generatie 3: Overgrootouders -->
                <div class="pedigree-generation-col gen3">
                    <div class="generation-label">${this.t('greatGrandparents')}</div>
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmother'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmother'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmother'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmother'), false, 3)}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        // Add click events to cards
        this.setupCardClickEvents();
    }
    
    setupCardClickEvents() {
        const cards = document.querySelectorAll('.pedigree-card-compact.horizontal:not(.empty)');
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
        } else {
            console.log('Progress hidden');
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