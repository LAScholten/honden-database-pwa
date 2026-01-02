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
        this.dogPhotosCache = new Map(); // Cache voor hondenfoto's
        this.dogHasPhotosCache = new Map(); // NIEUW: Cache voor foto aanwezigheid
        this.dogThumbnailsCache = new Map(); // NIEUW: Cache voor thumbnails
        this.fullPhotoCache = new Map(); // NIEUW: Cache voor volledige foto's
        
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
                coiAllGen: "COI All Gen",
                
                // Foto's
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten"
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
                coiAllGen: "COI All Gen",
                
                // Photos
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close"
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
                coiAllGen: "COI All Gen",
                
                // Fotos
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbaar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen"
            }
        };
        
        // Event delegation setup voor foto clicks
        this.setupGlobalEventListeners();
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
    
    // NIEUW: Check alleen of er foto's zijn (geen data laden)
    async checkDogHasPhotos(dogId) {
        if (!dogId || dogId === 0) return false;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return false;
        
        // Check cache voor foto aanwezigheid
        const cacheKey = `has_${dogId}_${dog.stamboomnr}`;
        if (this.dogHasPhotosCache.has(cacheKey)) {
            return this.dogHasPhotosCache.get(cacheKey);
        }
        
        try {
            // Gebruik de snelle check functie
            const hasPhotos = await this.db.checkFotosExist(dog.stamboomnr);
            this.dogHasPhotosCache.set(cacheKey, hasPhotos);
            return hasPhotos;
        } catch (error) {
            console.error('Fout bij checken foto\'s voor hond:', dogId, error);
            return false;
        }
    }
    
    // NIEUW: Laad alleen thumbnails
    async getDogThumbnails(dogId, limit = 9) {
        if (!dogId || dogId === 0) return [];
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return [];
        
        // Check cache voor thumbnails
        const cacheKey = `thumbs_${dogId}_${dog.stamboomnr}_${limit}`;
        if (this.dogThumbnailsCache.has(cacheKey)) {
            return this.dogThumbnailsCache.get(cacheKey);
        }
        
        try {
            const thumbnails = await this.db.getFotoThumbnails(dog.stamboomnr, limit);
            this.dogThumbnailsCache.set(cacheKey, thumbnails || []);
            return thumbnails || [];
        } catch (error) {
            console.error('Fout bij ophalen thumbnails voor hond:', dogId, error);
            return [];
        }
    }
    
    // NIEUW: Laad originele foto alleen wanneer nodig
    async getFullSizeFoto(fotoId) {
        if (!fotoId) return null;
        
        // Check cache voor volledige foto
        const cacheKey = `full_${fotoId}`;
        if (this.fullPhotoCache.has(cacheKey)) {
            return this.fullPhotoCache.get(cacheKey);
        }
        
        try {
            const foto = await this.db.getFotoById(fotoId);
            if (foto) {
                this.fullPhotoCache.set(cacheKey, foto);
            }
            return foto;
        } catch (error) {
            console.error('Fout bij ophalen volledige foto:', fotoId, error);
            return null;
        }
    }

/* ============================================= */
/* ALTERNATIEVE, NOG EENVOUDIGERE VERSIE */
/* Gebruik deze als bovenstaande nog te complex is */
/* ============================================= */

calculateCOISimple(dogId) {
    console.log('Eenvoudige COI berekening voor hond ID:', dogId);
    
    if (!dogId || dogId === 0) {
        return { coi6Gen: '0.0', coiAllGen: '0.0' };
    }
    
    const dog = this.getDogById(dogId);
    if (!dog || !dog.vaderId || !dog.moederId) {
        return { coi6Gen: '0.0', coiAllGen: '0.0' };
    }
    
    // Zeer eenvoudige controles
    if (dog.vaderId === dog.moederId) {
        return { coi6Gen: '25.0', coiAllGen: '25.0' };
    }
    
    // Gebruik een benadering op basis van overlapping
    const coi6Gen = this.calculateOverlapCOI(dogId, 6);
    const coiAllGen = this.calculateOverlapCOI(dogId, 12);
    
    const coi6GenPercent = Math.min(99.9, Math.max(0, coi6Gen * 100));
    const coiAllGenPercent = Math.min(99.9, Math.max(0, coiAllGen * 100));
    
    return {
        coi6Gen: coi6GenPercent.toFixed(1),
        coiAllGen: coiAllGenPercent.toFixed(1)
    };
}

calculateOverlapCOI(dogId, generations) {
    if (generations <= 0) return 0;
    
    const dog = this.getDogById(dogId);
    if (!dog || !dog.vaderId || !dog.moederId) return 0;
    
    if (dog.vaderId === dog.moederId) return 0.25;
    
    // Bereken overlapping van voorouders tussen ouders
    const fatherAncestors = this.getAncestorSet(dog.vaderId, generations - 1);
    const motherAncestors = this.getAncestorSet(dog.moederId, generations - 1);
    
    // Vind gemeenschappelijke voorouders
    const commonAncestors = new Set();
    for (const ancestor of fatherAncestors) {
        if (motherAncestors.has(ancestor)) {
            commonAncestors.add(ancestor);
        }
    }
    
    // Eenvoudige benadering: aantal gemeenschappelijke voorouders / totaal unieke voorouders
    const totalUniqueAncestors = new Set([...fatherAncestors, ...motherAncestors]);
    
    if (totalUniqueAncestors.size === 0) return 0;
    
    // Basis COI berekening
    let baseCOI = (commonAncestors.size / totalUniqueAncestors.size) * 0.5;
    
    // Voeg COI van gemeenschappelijke voorouders toe
    let additionalCOI = 0;
    for (const ancestorId of commonAncestors) {
        const ancestorCOI = this.calculateOverlapCOI(ancestorId, generations - 1);
        additionalCOI += ancestorCOI * 0.25;
    }
    
    return Math.min(0.999, baseCOI + additionalCOI);
}

getAncestorSet(dogId, generations) {
    const ancestors = new Set();
    
    const collect = (currentId, depth) => {
        if (depth > generations || !currentId) return;
        
        const dog = this.getDogById(currentId);
        if (!dog) return;
        
        // Voeg ouders toe
        if (dog.vaderId) {
            ancestors.add(dog.vaderId);
            collect(dog.vaderId, depth + 1);
        }
        
        if (dog.moederId) {
            ancestors.add(dog.moederId);
            collect(dog.moederId, depth + 1);
        }
    };
    
    collect(dogId, 0);
    return ancestors;
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
    
    // Helper voor COI kleuren
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745'; // groen
        if (value <= 6.0) return '#fd7e14'; // oranje
        return '#dc3545'; // rood
    }
    
    // LIGGENDE CARD VOOR STAMBOOM - met fototoestelicoon
    async getDogCompactCardHTML(dog, relation = '', isMainDog = false, generation = 0) {
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
        
        // Check of deze hond foto's heeft (SNELLE CHECK)
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        const cameraIcon = hasPhotos ? '<i class="bi bi-camera text-danger ms-1"></i>' : '';

        // Maak een gecombineerde naam+kennel string voor automatische aanpassing
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        return `
            <div class="pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}"
                 data-has-photos="${hasPhotos}">
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
                    
                    <!-- Regel 3: Klik hint met fototoestelicoon -->
                    <div class="card-row card-row-3">
                        <div class="click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}${cameraIcon}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // UPDATE: DETAIL POPUP met thumbnails
    async getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        // Bereken COI waarden
        const coiValues = this.calculateCOI(dog.id);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        const coiAllColor = this.getCOIColor(coiValues.coiAllGen);
        
        // NIEUW: Laad alleen thumbnails
        const thumbnails = await this.getDogThumbnails(dog.id, 9);
        
        // Maak een gecombineerde naam+kennel string voor de header
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const kennelSuffix = showKennel ? ` ${dog.kennelnaam}` : '';
        const headerText = combinedName + kennelSuffix;
        
        return `
            <div class="dog-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${headerText}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" aria-label="Sluiten"></button>
                </div>
                <div class="popup-body">
                    <!-- THUMBNAILS SECTIE BOVENAAN (indien beschikbaar) -->
                    ${thumbnails.length > 0 ? `
                    <div class="info-section mb-3">
                        <h6><i class="bi bi-camera me-1"></i> ${this.t('photos')} (${thumbnails.length})</h6>
                        <div class="photos-grid" id="photosGrid${dog.id}">
                            ${thumbnails.map((thumb, index) => `
                                <div class="photo-thumbnail" 
                                     data-photo-id="${thumb.id}" 
                                     data-dog-id="${dog.id}" 
                                     data-photo-index="${index}"
                                     data-is-thumbnail="true">
                                    <img src="${thumb.thumbnail}" 
                                         alt="${dog.naam || ''} - ${thumb.filename || ''}" 
                                         class="thumbnail-img"
                                         loading="lazy">
                                    <div class="photo-hover">
                                        <i class="bi bi-zoom-in"></i>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="photo-hint">
                            <small class="text-muted"><i class="bi bi-info-circle me-1"></i> ${this.t('clickToEnlarge')}</small>
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- BASISGEGEVENS NA FOTO'S -->
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="info-grid">
                            <!-- Stamboomnummer en Ras naast elkaar -->
                            <div class="info-row">
                                ${dog.stamboomnr ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('pedigreeNumber')}:</span>
                                    <span class="info-value">${dog.stamboomnr}</span>
                                </div>
                                ` : ''}
                                
                                ${dog.ras ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('breed')}:</span>
                                    <span class="info-value">${dog.ras}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- Geslacht en Vachtkleur naast elkaar -->
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('gender')}:</span>
                                    <span class="info-value">${genderText}</span>
                                </div>
                                
                                ${dog.vachtkleur ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coatColor')}:</span>
                                    <span class="info-value">${dog.vachtkleur}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- Beide COI waarden naast elkaar -->
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coi6Gen')}:</span>
                                    <span class="info-value coi-value" style="color: ${coi6Color}; font-weight: bold;">
                                        ${coiValues.coi6Gen}%
                                    </span>
                                </div>
                                
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coiAllGen')}:</span>
                                    <span class="info-value coi-value" style="color: ${coiAllColor}; font-weight: bold;">
                                        ${coiValues.coiAllGen}%
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Datums -->
                            ${dog.geboortedatum ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('birthDate')}:</span>
                                    <span class="info-value">${this.formatDate(dog.geboortedatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('deathDate')}:</span>
                                    <span class="info-value">${this.formatDate(dog.overlijdensdatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            <!-- Land en postcode -->
                            ${dog.land ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('country')}:</span>
                                    <span class="info-value">${dog.land}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.postcode ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('zipCode')}:</span>
                                    <span class="info-value">${dog.postcode}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo')}</h6>
                        <div class="info-grid">
                            ${dog.heupdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('hipDysplasia')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.heupdysplasie, 'hip')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('elbowDysplasia')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.elleboogdysplasie, 'elbow')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('patellaLuxation')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.patella, 'patella')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('eyes')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.ogen, 'eyes')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogenVerklaring ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('eyesExplanation')}:</span>
                                    <span class="info-value">${dog.ogenVerklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('dandyWalker')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.dandyWalker, 'dandy')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('thyroid')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.schildklier, 'thyroid')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklierVerklaring ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('thyroidExplanation')}:</span>
                                    <span class="info-value">${dog.schildklierVerklaring}</span>
                                </div>
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
    
    // UPDATE: Setup globale event listeners voor gefaseerd foto laden
    setupGlobalEventListeners() {
        // Event delegation voor foto thumbnail clicks
        document.addEventListener('click', async (e) => {
            const thumbnail = e.target.closest('.photo-thumbnail');
            if (thumbnail) {
                e.preventDefault();
                e.stopPropagation();
                
                const photoId = thumbnail.getAttribute('data-photo-id');
                const isThumbnail = thumbnail.getAttribute('data-is-thumbnail') === 'true';
                
                if (!photoId) return;
                
                try {
                    // NIEUW: Laad pas de volledige foto als er op geklikt wordt
                    const fullPhoto = await this.getFullSizeFoto(photoId);
                    
                    if (fullPhoto && fullPhoto.data) {
                        // Haal hondnaam op uit de popup
                        const popupTitle = document.querySelector('.popup-title');
                        let dogName = '';
                        if (popupTitle) {
                            dogName = popupTitle.textContent.trim();
                            dogName = dogName.replace(/^[^a-zA-Z]*/, '').trim();
                        }
                        
                        this.showLargePhoto(fullPhoto.data, dogName);
                    } else {
                        console.error('Kon volledige foto niet laden:', photoId);
                        // Probeer de thumbnail als fallback
                        const imgElement = thumbnail.querySelector('img');
                        if (imgElement && imgElement.src) {
                            this.showLargePhoto(imgElement.src, dogName);
                        }
                    }
                } catch (error) {
                    console.error('Fout bij laden volledige foto:', error);
                }
            }
        });
        
        // Event delegation voor grote foto sluitknoppen
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('photo-large-close') || 
                e.target.classList.contains('photo-large-close-btn') ||
                e.target.closest('.photo-large-close') ||
                e.target.closest('.photo-large-close-btn')) {
                const overlay = document.getElementById('photoLargeOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
            
            // Klik buiten de grote foto om te sluiten
            if (e.target.id === 'photoLargeOverlay') {
                const overlay = e.target;
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
        });
    }
    
    showLargePhoto(photoData, dogName = '') {
        console.log('Toon grote foto:', photoData.substring(0, 100) + '...');
        
        // Verwijder bestaande overlay
        const existingOverlay = document.getElementById('photoLargeOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Maak nieuwe overlay
        const overlayHTML = `
            <div class="photo-large-overlay" id="photoLargeOverlay" style="display: flex;">
                <div class="photo-large-container" id="photoLargeContainer">
                    <div class="photo-large-header">
                        <button type="button" class="btn-close btn-close-white photo-large-close"></button>
                    </div>
                    <div class="photo-large-content">
                        <img src="${photoData}" 
                             alt="${dogName || 'Foto'}" 
                             class="photo-large-img"
                             id="photoLargeImg"
                             style="max-width: 90vw; max-height: 80vh; object-fit: contain;">
                    </div>
                    <div class="photo-large-footer">
                        <button type="button" class="btn btn-secondary photo-large-close-btn">
                            <i class="bi bi-x-circle me-1"></i> ${this.t('closePhoto')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Sluit met Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('photoLargeOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        // Clean up
        const overlay = document.getElementById('photoLargeOverlay');
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    async showPedigree(dog) {
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
        
        await this.renderCompactPedigree(pedigreeTree);
        
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
                    height: 60px !important;
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
                
                /* CARD HEADER */
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
                
                /* Header voor gen3 (overgrootouders) */
                .pedigree-card-compact.horizontal.gen3 .pedigree-card-header-compact.horizontal {
                    padding: 3px 6px;
                    font-size: 0.56rem;
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
                
                /* CARD BODY */
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
                
                /* Body voor gen3 (overgrootouders) */
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
                
                /* Overgrootouders (gen3) */
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
                
                /* Algemene tekst styling */
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
                
                /* Click hint met fototoestelicoon */
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
                    font-size: 0.55rem;
                }
                
                .click-hint-compact .bi-camera {
                    color: #1a15f4;
                    font-size: 0.7rem;
                }
                
                /* Generation labels styling */
                .generation-label {
                    font-weight: bold;
                    color: #495057;
                    text-align: center;
                    margin-bottom: 8px !important;
                    font-size: 0.75rem;
                    background: #e9ecef;
                    padding: 4px 8px;
                    border-radius: 4px;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                
                /* ============================================= */
                /* MOBIELE AANPASSINGEN */
                /* ============================================= */
                @media (max-width: 767px) {
                    #pedigreeModal.modal.fade .modal-dialog {
                        max-width: 100%;
                        margin: 0.5rem auto;
                        height: auto;
                    }
                    
                    #pedigreeModal.modal.fade .modal-content {
                        width: 100%;
                        height: auto;
                        margin: 0;
                        border-radius: 12px;
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
                        border-radius: 12px 12px 0 0;
                    }
                    
                    #pedigreeModal.modal.fade .modal-body {
                        width: 100%;
                        padding: 0;
                        margin: 0;
                        flex: 1 1 auto;
                        overflow: hidden;
                        min-height: 0;
                        max-height: 640px;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .pedigree-mobile-wrapper {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        background: #f8f9fa;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .pedigree-container-compact {
                        height: 640px !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        padding: 10px !important;
                        -webkit-overflow-scrolling: touch;
                        display: flex;
                        flex-direction: column;
                        border-radius: 0 0 12px 12px;
                    }
                    
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
                    
                    .pedigree-generation-col {
                        display: flex !important;
                        flex-direction: column !important;
                        height: 100% !important;
                        flex-shrink: 0 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        position: relative;
                        justify-content: center !important;
                        align-items: flex-start !important;
                    }
                    
                    .pedigree-generation-col.gen0 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen1 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen1 > .pedigree-card-compact.horizontal:nth-child(2) {
                        margin-top: -2px !important;
                    }
                    
                    .pedigree-generation-col.gen1 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: 2px !important;
                    }
                    
                    .pedigree-generation-col.gen2 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(2),
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -4px !important;
                    }
                    
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(4),
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(2),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -8px !important;
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(4),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: -4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(6),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(7) {
                        margin-top: 0px !important;
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(8),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(9) {
                        margin-top: 4px !important;
                    }
                    
                    .pedigree-generation-col .generation-label {
                        font-size: 0.7rem !important;
                        padding: 3px 6px !important;
                        margin-bottom: 8px !important;
                        white-space: nowrap !important;
                        width: 100%;
                        text-align: center;
                        position: static !important;
                        margin-top: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important;
                        height: 140px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important;
                        height: 70px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important;
                        height: 140px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-generation-col > * {
                        width: 100% !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .pedigree-container-compact {
                        height: 640px !important;
                        padding: 8px !important;
                    }
                    
                    .pedigree-grid-compact {
                        padding: 8px 12px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important;
                        height: 140px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important;
                        height: 70px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important;
                        height: 140px !important;
                    }
                    
                    .pedigree-generation-col {
                        min-width: 220px !important;
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
                        margin-bottom: 8px !important;
                    }
                }
                
                /* ============================================= */
                /* DESKTOP STYLES */
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
                        justify-content: center;
                    }
                    
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
                        margin-bottom: 8px !important;
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
                /* DETAIL POPUP STYLES MET THUMBNAILS BOVENAAN */
                /* ============================================= */
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
                    max-width: 400px;
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
                    padding: 12px 16px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }
                
                .popup-title {
                    margin: 0;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                
                /* Eigen kruisje styling - WIT KRUISJE */
                .popup-header .btn-close {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    background: transparent;
                    border: none;
                    position: relative;
                    cursor: pointer;
                    opacity: 0.8;
                    z-index: 2;
                    filter: invert(1) grayscale(100%) brightness(200%) !important;
                }
                
                .popup-header .btn-close::before,
                .popup-header .btn-close::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 18px;
                    height: 2px;
                    background: #000 !important;
                    transform-origin: center;
                }
                
                .popup-header .btn-close::before {
                    transform: translate(-50%, -50%) rotate(45deg);
                }
                
                .popup-header .btn-close::after {
                    transform: translate(-50%, -50%) rotate(-45deg);
                }
                
                .popup-header .btn-close:hover {
                    opacity: 1;
                }
                
                .popup-body {
                    padding: 15px;
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
                
                /* INFO SECTIES */
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
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .info-row {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 8px !important;
                    margin-bottom: 0 !important;
                    width: 100% !important;
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    width: 100% !important;
                    min-width: 0 !important;
                }
                
                .info-item-half {
                    grid-column: span 1 !important;
                    width: 100% !important;
                }
                
                .info-item-full {
                    grid-column: 1 / -1 !important;
                    width: 100% !important;
                    margin-bottom: 4px;
                }
                
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
                
                /* THUMBNAILS SECTIE IN POPUP */
                .photos-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 6px;
                    margin-bottom: 10px;
                    max-width: 240px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .photo-thumbnail {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    border-radius: 4px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.2s;
                }
                
                .photo-thumbnail:hover {
                    border-color: #0d6efd;
                    transform: scale(1.05);
                }
                
                .thumbnail-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .photo-hover {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                
                .photo-thumbnail:hover .photo-hover {
                    opacity: 1;
                }
                
                .photo-hover i {
                    color: white;
                    font-size: 1.2rem;
                }
                
                .photo-hint {
                    text-align: center;
                    margin-bottom: 15px;
                    font-size: 0.85rem;
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
                
                /* ============================================= */
                /* GROTE FOTO OVERLAY STYLES */
                /* ============================================= */
                .photo-large-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    z-index: 1070;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s;
                }
                
                .photo-large-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    max-height: 95vh;
                    animation: slideUp 0.3s;
                }
                
                .photo-large-header {
                    padding: 12px 16px;
                    background: #0d6efd;
                    color: white;
                    display: flex;
                    justify-content: flex-end;
                }
                
                .photo-large-close {
                    background: none;
                    border: none;
                    color: white;
                    opacity: 0.8;
                    font-size: 1.3rem;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                
                .photo-large-close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .photo-large-content {
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex: 1;
                    min-height: 300px;
                }
                
                .photo-large-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 4px;
                }
                
                .photo-large-footer {
                    padding: 16px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: center;
                    background: #f8f9fa;
                }
                
                .photo-large-close-btn {
                    min-width: 120px;
                    padding: 8px 20px;
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
                    
                    .pedigree-popup-overlay,
                    .photo-large-overlay {
                        display: none !important;
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
                
                /* Overgrootouder styling */
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
    
    async renderCompactPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) return;
        
        // Maak alle cards asynchroon om foto checks te doen (SNELLE CHECK)
        const mainDogCard = await this.getDogCompactCardHTML(pedigreeTree.mainDog, this.t('mainDog'), true, 0);
        const fatherCard = await this.getDogCompactCardHTML(pedigreeTree.father, this.t('father'), false, 1);
        const motherCard = await this.getDogCompactCardHTML(pedigreeTree.mother, this.t('mother'), false, 1);
        const paternalGrandfatherCard = await this.getDogCompactCardHTML(pedigreeTree.paternalGrandfather, this.t('grandfather'), false, 2);
        const paternalGrandmotherCard = await this.getDogCompactCardHTML(pedigreeTree.paternalGrandmother, this.t('grandmother'), false, 2);
        const maternalGrandfatherCard = await this.getDogCompactCardHTML(pedigreeTree.maternalGrandfather, this.t('grandfather'), false, 2);
        const maternalGrandmotherCard = await this.getDogCompactCardHTML(pedigreeTree.maternalGrandmother, this.t('grandmother'), false, 2);
        
        // Overgrootouders
        const paternalGreatGrandfather1Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfather'), false, 3);
        const paternalGreatGrandmother1Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmother'), false, 3);
        const paternalGreatGrandfather2Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfather'), false, 3);
        const paternalGreatGrandmother2Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmother'), false, 3);
        const maternalGreatGrandfather1Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfather'), false, 3);
        const maternalGreatGrandmother1Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmother'), false, 3);
        const maternalGreatGrandfather2Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfather'), false, 3);
        const maternalGreatGrandmother2Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmother'), false, 3);
        
        const gridHTML = `
            <div class="pedigree-grid-compact">
                <!-- Generatie 0: Hoofdhond -->
                <div class="pedigree-generation-col gen0">
                    <div class="generation-label">${this.t('currentDog')}</div>
                    ${mainDogCard}
                </div>
                
                <!-- Generatie 1: Ouders -->
                <div class="pedigree-generation-col gen1">
                    <div class="generation-label">${this.t('parents')}</div>
                    ${fatherCard}
                    ${motherCard}
                </div>
                
                <!-- Generatie 2: Grootouders -->
                <div class="pedigree-generation-col gen2">
                    <div class="generation-label">${this.t('grandparents')}</div>
                    ${paternalGrandfatherCard}
                    ${paternalGrandmotherCard}
                    ${maternalGrandfatherCard}
                    ${maternalGrandmotherCard}
                </div>
                
                <!-- Generatie 3: Overgrootouders -->
                <div class="pedigree-generation-col gen3">
                    <div class="generation-label">${this.t('greatGrandparents')}</div>
                    ${paternalGreatGrandfather1Card}
                    ${paternalGreatGrandmother1Card}
                    ${paternalGreatGrandfather2Card}
                    ${paternalGreatGrandmother2Card}
                    ${maternalGreatGrandfather1Card}
                    ${maternalGreatGrandmother1Card}
                    ${maternalGreatGrandfather2Card}
                    ${maternalGreatGrandmother2Card}
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
            card.addEventListener('click', async (e) => {
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId === 0) return;
                
                const dog = this.getDogById(dogId);
                if (!dog) return;
                
                const relation = card.getAttribute('data-relation') || '';
                await this.showDogDetailPopup(dog, relation);
            });
        });
    }
    
    async showDogDetailPopup(dog, relation) {
        const overlay = document.getElementById('pedigreePopupOverlay');
        const container = document.getElementById('pedigreePopupContainer');
        
        if (!overlay || !container) return;
        
        const popupHTML = await this.getDogDetailPopupHTML(dog, relation);
        container.innerHTML = popupHTML;
        
        // Show overlay
        overlay.style.display = 'flex';
        
        // Add close event listeners
        const closeButtons = container.querySelectorAll('.btn-close, .popup-close-btn');
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