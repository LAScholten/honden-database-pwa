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
        this.dogHasPhotosCache = new Map(); // Cache voor foto aanwezigheid
        this.dogThumbnailsCache = new Map(); // Cache voor thumbnails
        this.fullPhotoCache = new Map(); // Cache voor volledige foto's
        
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
    
    // NIEUW: Batch check ALLE honden in de stamboom tegelijk
    async batchCheckAllDogsHasPhotos(pedigreeTree) {
        // Verzamel alle unieke stamboomnummers uit de hele stamboom
        const stamboomnrs = new Set();
        
        const addDogToSet = (dog) => {
            if (dog && dog.stamboomnr && dog.stamboomnr.trim() !== '') {
                stamboomnrs.add(dog.stamboomnr);
            }
        };
        
        // Voeg alle honden uit de stamboom toe
        addDogToSet(pedigreeTree.mainDog);
        addDogToSet(pedigreeTree.father);
        addDogToSet(pedigreeTree.mother);
        addDogToSet(pedigreeTree.paternalGrandfather);
        addDogToSet(pedigreeTree.paternalGrandmother);
        addDogToSet(pedigreeTree.maternalGrandfather);
        addDogToSet(pedigreeTree.maternalGrandmother);
        addDogToSet(pedigreeTree.paternalGreatGrandfather1);
        addDogToSet(pedigreeTree.paternalGreatGrandmother1);
        addDogToSet(pedigreeTree.paternalGreatGrandfather2);
        addDogToSet(pedigreeTree.paternalGreatGrandmother2);
        addDogToSet(pedigreeTree.maternalGreatGrandfather1);
        addDogToSet(pedigreeTree.maternalGreatGrandmother1);
        addDogToSet(pedigreeTree.maternalGreatGrandfather2);
        addDogToSet(pedigreeTree.maternalGreatGrandmother2);
        
        if (stamboomnrs.size === 0) {
            console.log('Geen stamboomnummers om te checken');
            return {};
        }
        
        console.log(`Batch checking ${stamboomnrs.size} honden voor foto's...`);
        
        try {
            // Doe 1 enkele batch query voor ALLE honden
            const batchResults = await this.db.checkFotosExistForStamboomnrs(Array.from(stamboomnrs));
            
            // Cache de resultaten per hond ID
            this.allDogs.forEach(dog => {
                if (dog && dog.stamboomnr && batchResults[dog.stamboomnr] !== undefined) {
                    const cacheKey = `has_${dog.id}_${dog.stamboomnr}`;
                    this.dogHasPhotosCache.set(cacheKey, batchResults[dog.stamboomnr]);
                }
            });
            
            console.log(`Batch check voltooid: ${Object.values(batchResults).filter(Boolean).length} van de ${stamboomnrs.size} hebben foto's`);
            return batchResults;
        } catch (error) {
            console.error('Fout bij batch foto check:', error);
            return {};
        }
    }
    
    // Helper: Check of een specifieke hond foto's heeft (gebruik cache)
    async checkDogHasPhotos(dogId) {
        if (!dogId || dogId === 0) return false;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return false;
        
        // Check cache
        const cacheKey = `has_${dogId}_${dog.stamboomnr}`;
        if (this.dogHasPhotosCache.has(cacheKey)) {
            return this.dogHasPhotosCache.get(cacheKey);
        }
        
        // Als niet in cache, doe een individuele check (backup)
        try {
            const hasPhotos = await this.db.checkFotosExist(dog.stamboomnr);
            this.dogHasPhotosCache.set(cacheKey, hasPhotos);
            return hasPhotos;
        } catch (error) {
            console.error('Fout bij individuele foto check:', dogId, error);
            return false;
        }
    }
    
    // Laad alleen thumbnails
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
    
    // Laad originele foto alleen wanneer nodig
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

analyzePedigree(dogId, depth = 4) {
    const dog = this.getDogById(dogId);
    if (!dog) return;
    
    console.log(`\n=== STAMBOOM ANALYSE voor ${dog.naam} (ID: ${dogId}) ===`);
    console.log(`Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);
    
    if (dog.vaderId && dog.moederId) {
        // Controleer voor gemeenschappelijke voorouders
        const common = this.findCommonAncestors(dog.vaderId, dog.moederId, depth);
        console.log(`Aantal gemeenschappelijke voorouders: ${common.size}`);
        
        if (common.size > 0) {
            console.log('Gemeenschappelijke voorouders:');
            for (const ancestorId of common) {
                const ancestor = this.getDogById(ancestorId);
                console.log(`  - ${ancestor?.naam || 'Onbekend'} (ID: ${ancestorId})`);
            }
        }
    }
    
    // Toon ouders
    if (dog.vaderId) {
        const vader = this.getDogById(dog.vaderId);
        console.log(`Vader: ${vader?.naam || 'Onbekend'} (ID: ${dog.vaderId})`);
    }
    
    if (dog.moederId) {
        const moeder = this.getDogById(dog.moederId);
        console.log(`Moeder: ${moeder?.naam || 'Onbekend'} (ID: ${dog.moederId})`);
    }
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
    async getDogCompactCardHTML(dog, relation = '', isMainDog = false, generation = 0, hasPhotos = false) {
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
        
        // Gebruik de pre-gecheckte hasPhotos waarde
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
    
    // DETAIL POPUP met thumbnails
    async getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        // Bereken COI waarden
        const coiValues = this.calculateCOI(dog.id);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        const coiAllColor = this.getCOIColor(coiValues.coiAllGen);
        
        // Laad alleen thumbnails
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
                    // Laad pas de volledige foto als er op geklikt wordt
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
        
        // NIEUW: Eerst BATCH check ALLE honden in 1 keer
        console.time('batchFotoCheck');
        const batchResults = await this.batchCheckAllDogsHasPhotos(pedigreeTree);
        console.timeEnd('batchFotoCheck');
        
        // Render daarna de stamboom met de pre-gecheckte foto status
        await this.renderCompactPedigree(pedigreeTree, batchResults);
        
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
                /* ... (alle CSS blijft precies hetzelfde) ... */
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
    
    // UPDATE: renderCompactPedigree met pre-gecheckte foto status
    async renderCompactPedigree(pedigreeTree, batchResults = {}) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) return;
        
        // Helper: Haal foto status op uit batch results
        const getHasPhotos = (dog) => {
            if (!dog || !dog.stamboomnr) return false;
            return batchResults[dog.stamboomnr] || false;
        };
        
        // Maak alle cards met pre-gecheckte foto status
        const mainDogCard = await this.getDogCompactCardHTML(
            pedigreeTree.mainDog, 
            this.t('mainDog'), 
            true, 
            0,
            getHasPhotos(pedigreeTree.mainDog)
        );
        
        const fatherCard = await this.getDogCompactCardHTML(
            pedigreeTree.father, 
            this.t('father'), 
            false, 
            1,
            getHasPhotos(pedigreeTree.father)
        );
        
        const motherCard = await this.getDogCompactCardHTML(
            pedigreeTree.mother, 
            this.t('mother'), 
            false, 
            1,
            getHasPhotos(pedigreeTree.mother)
        );
        
        const paternalGrandfatherCard = await this.getDogCompactCardHTML(
            pedigreeTree.paternalGrandfather, 
            this.t('grandfather'), 
            false, 
            2,
            getHasPhotos(pedigreeTree.paternalGrandfather)
        );
        
        const paternalGrandmotherCard = await this.getDogCompactCardHTML(
            pedigreeTree.paternalGrandmother, 
            this.t('grandmother'), 
            false, 
            2,
            getHasPhotos(pedigreeTree.paternalGrandmother)
        );
        
        const maternalGrandfatherCard = await this.getDogCompactCardHTML(
            pedigreeTree.maternalGrandfather, 
            this.t('grandfather'), 
            false, 
            2,
            getHasPhotos(pedigreeTree.maternalGrandfather)
        );
        
        const maternalGrandmotherCard = await this.getDogCompactCardHTML(
            pedigreeTree.maternalGrandmother, 
            this.t('grandmother'), 
            false, 
            2,
            getHasPhotos(pedigreeTree.maternalGrandmother)
        );
        
        // Overgrootouders
        const paternalGreatGrandfather1Card = await this.getDogCompactCardHTML(
            pedigreeTree.paternalGreatGrandfather1, 
            this.t('greatGrandfather'), 
            false, 
            3,
            getHasPhotos(pedigreeTree.paternalGreatGrandfather1)
        );
        
        const paternalGreatGrandmother1Card = await this.getDogCompactCardHTML(
            pedigreeTree.paternalGreatGrandmother1, 
            this.t('greatGrandmother'), 
            false, 
            3,
            getHasPhotos(pedigreeTree.paternalGreatGrandmother1)
        );
        
        const paternalGreatGrandfather2Card = await this.getDogCompactCardHTML(
            pedigreeTree.paternalGreatGrandfather2, 
            this.t('greatGrandfather'), 
            false, 
            3,
            getHasPhotos(pedigreeTree.paternalGreatGrandfather2)
        );
        
        const paternalGreatGrandmother2Card = await this.getDogCompactCardHTML(
            pedigreeTree.paternalGreatGrandmother2, 
            this.t('greatGrandmother'), 
            false, 
            3,
            getHasPhotos(pedigreeTree.paternalGreatGrandmother2)
        );
        
        const maternalGreatGrandfather1Card = await this.getDogCompactCardHTML(
            pedigreeTree.maternalGreatGrandfather1, 
            this.t('greatGrandfather'), 
            false, 
            3,
            getHasPhotos(pedigreeTree.maternalGreatGrandfather1)
        );
        
        const maternalGreatGrandmother1Card = await this.getDogCompactCardHTML(
            pedigreeTree.maternalGreatGrandmother1, 
            this.t('greatGrandmother'), 
            false, 
            3,
            getHasPhotos(pedigreeTree.maternalGreatGrandmother1)
        );
        
        const maternalGreatGrandfather2Card = await this.getDogCompactCardHTML(
            pedigreeTree.maternalGreatGrandfather2, 
            this.t('greatGrandfather'), 
            false, 
            3,
            getHasPhotos(pedigreeTree.maternalGreatGrandfather2)
        );
        
        const maternalGreatGrandmother2Card = await this.getDogCompactCardHTML(
            pedigreeTree.maternalGreatGrandmother2, 
            this.t('greatGrandmother'), 
            false, 
            3,
            getHasPhotos(pedigreeTree.maternalGreatGrandmother2)
        );
        
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