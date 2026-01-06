/**
 * Stamboom Manager Module
 * Beheert 4-generatie stambomen voor honden - Zelfde layout op alle schermen
 * HORIZONTALE LAYOUT - Van links naar rechts met liggende cards
 * Overgrootouders 60% hoogte, zelfde breedte voor alle generaties
 * GEBRUIKT: COICalculator.js (extern bestand)
 * VERBETERD: Zorgt altijd voor volledige, actuele dataset
 */

class StamboomManager extends BaseModule {
    constructor(db, currentLang = 'nl') {
        super();
        this.db = db;
        this.currentLang = currentLang;
        this.allDogs = [];
        this.coiCalculator = null;
        this.isInitialized = false;
        
        // Verbeterde cache systemen
        this.dogPhotosCache = new Map();
        this.dogHasPhotosCache = new Map();
        this.dogThumbnailsCache = new Map();
        this.fullPhotoCache = new Map();
        
        // CRITIEKE VERBETERING: Cache voor volledige hondendata
        this.fullDogDataCache = new Map();
        this.dataLoadPromise = null;
        
        // Translations
        this.translations = {
            nl: {
                pedigreeTitle: "Stamboom van {name}",
                pedigree4Gen: "4-generatie stamboom",
                generatingPedigree: "Stamboom genereren...",
                close: "Sluiten",
                print: "Afdrukken",
                noData: "Geen gegevens",
                unknown: "Onbekend",
                currentDog: "Huidige hond",
                mainDog: "Hoofdhond",
                father: "Vader",
                mother: "Moeder",
                grandfather: "Grootvader",
                grandmother: "Grootmoeder",
                greatGrandfather: "Overgrootvader",
                greatGrandmother: "Overgrootmoeder",
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
                healthInfo: "Gezondheidsinformatie",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                eyesExplanation: "Verklaring ogen",
                thyroidExplanation: "Toelichting schildklier",
                male: "Reu",
                female: "Teef",
                paternal: "Paternaal",
                maternal: "Maternaal",
                clickForDetails: "Klik voor details",
                closePopup: "Sluiten",
                remarks: "Opmerkingen",
                noRemarks: "Geen opmerkingen",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten",
                loadingData: "Data laden...",
                refreshingData: "Data vernieuwen...",
                dataLoaded: "Data geladen",
                errorLoadingData: "Fout bij laden data"
            },
            en: {
                pedigreeTitle: "Pedigree of {name}",
                pedigree4Gen: "4-generation pedigree",
                generatingPedigree: "Generating pedigree...",
                close: "Close",
                print: "Print",
                noData: "No data",
                unknown: "Unknown",
                currentDog: "Current Dog",
                mainDog: "Main Dog",
                father: "Father",
                mother: "Mother",
                grandfather: "Grandfather",
                grandmother: "Grandmother",
                greatGrandfather: "Great Grandfather",
                greatGrandmother: "Great Grandmother",
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
                healthInfo: "Health Information",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                eyesExplanation: "Eye explanation",
                thyroidExplanation: "Thyroid explanation",
                male: "Male",
                female: "Female",
                paternal: "Paternal",
                maternal: "Maternaal",
                clickForDetails: "Click for details",
                closePopup: "Close",
                remarks: "Remarks",
                noRemarks: "No remarks",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great Grandparents",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close",
                loadingData: "Loading data...",
                refreshingData: "Refreshing data...",
                dataLoaded: "Data loaded",
                errorLoadingData: "Error loading data"
            },
            de: {
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "4-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wird generiert...",
                close: "Schließen",
                print: "Drucken",
                noData: "Keine Daten",
                unknown: "Unbekannt",
                currentDog: "Aktueller Hund",
                mainDog: "Haupt-Hund",
                father: "Vader",
                mother: "Mutter",
                grandfather: "Großvater",
                grandmother: "Großmutter",
                greatGrandfather: "Urgroßvater",
                greatGrandmother: "Urgroßmutter",
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
                healthInfo: "Gesundheitsinformationen",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                eyesExplanation: "Augenerklärung",
                thyroidExplanation: "Schilddrüse Erklärung",
                male: "Rüde",
                female: "Hündin",
                paternal: "Väterlich",
                maternal: "Mütterlich",
                clickForDetails: "Klicken für Details",
                closePopup: "Schließen",
                remarks: "Bemerkungen",
                noRemarks: "Keine Bemerkungen",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                coi6Gen: "COI 6 Gen",
                coiAllGen: "COI All Gen",
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbaar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen",
                loadingData: "Daten laden...",
                refreshingData: "Daten aktualisieren...",
                dataLoaded: "Daten geladen",
                errorLoadingData: "Fehler beim Laden der Daten"
            }
        };
        
        this.setupGlobalEventListeners();
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    // ==================== VERBETERDE INITIALISATIE ====================
    
    /**
     * VERBETERING: Garandeert dat we altijd volledige, actuele data hebben
     */
    async ensureInitialized() {
        if (this.isInitialized && this.allDogs.length > 0) {
            console.log('✅ StamboomManager al geïnitialiseerd met', this.allDogs.length, 'honden');
            return true;
        }
        
        try {
            console.log('🔄 StamboomManager initialiseren...');
            await this.loadAllDogsWithFullData();
            this.isInitialized = true;
            console.log('✅ StamboomManager geïnitialiseerd met', this.allDogs.length, 'honden');
            return true;
        } catch (error) {
            console.error('❌ Fout bij initialiseren StamboomManager:', error);
            this.isInitialized = false;
            return false;
        }
    }
    
    /**
     * VERBETERING: Laad ALLE honden met VOLLEDIGE gezondheidsdata
     */
    async loadAllDogsWithFullData() {
        try {
            if (!this.db || typeof this.db.getHonden !== 'function') {
                throw new Error('Database niet beschikbaar');
            }
            
            console.log('🔄 Alle honden laden met volledige data...');
            
            // Haal alle honden op (NET ZO ALS SEARCHMANAGER)
            const dogs = await this.db.getHonden();
            console.log(`📊 ${dogs.length} honden geladen uit database`);
            
            // ZORG DAT ALLE VELDEN AANWEZIG ZIJN
            this.allDogs = dogs.map(dog => this.enrichDogData(dog));
            
            // Cache voor snelle toegang
            this.allDogs.forEach(dog => {
                this.fullDogDataCache.set(dog.id, dog);
                if (dog.stamboomnr) {
                    this.fullDogDataCache.set(dog.stamboomnr, dog);
                }
            });
            
            // Initialiseer COI Calculator
            if (typeof COICalculator !== 'undefined') {
                this.coiCalculator = new COICalculator(this.allDogs);
                console.log('✅ COICalculator geïnitialiseerd met', this.allDogs.length, 'honden');
            } else {
                console.error('⚠️ COICalculator klasse niet gevonden');
                this.coiCalculator = null;
            }
            
            return this.allDogs;
            
        } catch (error) {
            console.error('❌ Fout bij laden honden:', error);
            throw error;
        }
    }
    
    /**
     * VERBETERING: Verrijk hondendata met alle vereiste velden
     */
    enrichDogData(dog) {
        return {
            // Basis velden
            id: dog.id || 0,
            naam: dog.naam || '',
            kennelnaam: dog.kennelnaam || '',
            stamboomnr: dog.stamboomnr || '',
            ras: dog.ras || '',
            geslacht: dog.geslacht || 'onbekend',
            geboortedatum: dog.geboortedatum || null,
            overlijdensdatum: dog.overlijdensdatum || null,
            vaderId: dog.vaderId || null,
            moederId: dog.moederId || null,
            vader: dog.vader || '',
            moeder: dog.moeder || '',
            
            // Gezondheidsvelden - ZORG DAT ZE ER ALTIJD ZIJN
            heupdysplasie: dog.heupdysplasie || '',
            elleboogdysplasie: dog.elleboogdysplasie || '',
            patella: dog.patella || '',
            ogen: dog.ogen || '',
            ogenVerklaring: dog.ogenVerklaring || '',
            dandyWalker: dog.dandyWalker || '',
            schildklier: dog.schildklier || '',
            schildklierVerklaring: dog.schildklierVerklaring || '',
            
            // Extra velden
            vachtkleur: dog.vachtkleur || '',
            land: dog.land || '',
            postcode: dog.postcode || '',
            opmerkingen: dog.opmerkingen || '',
            createdAt: dog.createdAt || null,
            updatedAt: dog.updatedAt || null
        };
    }
    
    /**
     * VERBETERING: Haal een hond op met GARANTIE op volledige data
     */
    async getDogWithFullData(dogId) {
        if (!dogId || dogId === 0) return null;
        
        // 1. Check cache eerst
        if (this.fullDogDataCache.has(dogId)) {
            const cachedDog = this.fullDogDataCache.get(dogId);
            if (this.hasCompleteHealthData(cachedDog)) {
                return cachedDog;
            }
        }
        
        // 2. Zoek in huidige dataset
        let dog = this.allDogs.find(d => d.id === dogId);
        
        // 3. Als niet gevonden of onvolledig, haal uit database
        if (!dog || !this.hasCompleteHealthData(dog)) {
            console.log(`🔄 Volledige data ophalen voor hond ${dogId}...`);
            try {
                const freshDog = await this.db.getHondById(dogId);
                if (freshDog) {
                    dog = this.enrichDogData(freshDog);
                    
                    // Update lokale dataset
                    const existingIndex = this.allDogs.findIndex(d => d.id === dogId);
                    if (existingIndex !== -1) {
                        this.allDogs[existingIndex] = { ...this.allDogs[existingIndex], ...dog };
                    } else {
                        this.allDogs.push(dog);
                    }
                    
                    // Update cache
                    this.fullDogDataCache.set(dogId, dog);
                    if (dog.stamboomnr) {
                        this.fullDogDataCache.set(dog.stamboomnr, dog);
                    }
                }
            } catch (error) {
                console.error(`❌ Fout bij ophalen hond ${dogId}:`, error);
                // Gebruik wat we hebben
            }
        }
        
        return dog || null;
    }
    
    /**
     * Controleer of een hond volledige gezondheidsdata heeft
     */
    hasCompleteHealthData(dog) {
        return dog && (
            dog.heupdysplasie !== undefined &&
            dog.elleboogdysplasie !== undefined &&
            dog.patella !== undefined &&
            dog.ogen !== undefined &&
            dog.dandyWalker !== undefined &&
            dog.schildklier !== undefined
        );
    }
    
    /**
     * VERBETERING: Synchroniseer data met externe module
     */
    async syncWithExternalData(externalDogs = []) {
        if (!externalDogs || externalDogs.length === 0) return;
        
        console.log(`🔄 Synchroniseren met ${externalDogs.length} externe honden...`);
        
        for (const externalDog of externalDogs) {
            const enrichedDog = this.enrichDogData(externalDog);
            const existingIndex = this.allDogs.findIndex(d => d.id === enrichedDog.id);
            
            if (existingIndex !== -1) {
                // Merge: externe data heeft voorrang
                this.allDogs[existingIndex] = { 
                    ...this.allDogs[existingIndex], 
                    ...enrichedDog 
                };
            } else {
                // Nieuwe hond toevoegen
                this.allDogs.push(enrichedDog);
            }
            
            // Update cache
            this.fullDogDataCache.set(enrichedDog.id, enrichedDog);
            if (enrichedDog.stamboomnr) {
                this.fullDogDataCache.set(enrichedDog.stamboomnr, enrichedDog);
            }
        }
        
        // Herinitialiseer COI calculator met nieuwe dataset
        if (this.coiCalculator && typeof COICalculator !== 'undefined') {
            this.coiCalculator = new COICalculator(this.allDogs);
        }
        
        console.log(`✅ Synchronisatie voltooid. Totaal: ${this.allDogs.length} honden`);
    }
    
    // ==================== BESTAANDE METHODES - VERBETERD ====================
    
    async initialize() {
        return this.ensureInitialized();
    }
    
    getDogById(id) {
        return this.allDogs.find(dog => dog.id === id) || null;
    }
    
    async checkDogHasPhotos(dogId) {
        if (!dogId || dogId === 0) return false;
        const dog = await this.getDogWithFullData(dogId);
        if (!dog || !dog.stamboomnr) return false;
        const cacheKey = `has_${dogId}_${dog.stamboomnr}`;
        if (this.dogHasPhotosCache.has(cacheKey)) {
            return this.dogHasPhotosCache.get(cacheKey);
        }
        try {
            const hasPhotos = await this.db.checkFotosExist(dog.stamboomnr);
            this.dogHasPhotosCache.set(cacheKey, hasPhotos);
            return hasPhotos;
        } catch (error) {
            console.error('Fout bij checken foto\'s voor hond:', dogId, error);
            return false;
        }
    }
    
    async getDogThumbnails(dogId, limit = 9) {
        if (!dogId || dogId === 0) return [];
        const dog = await this.getDogWithFullData(dogId);
        if (!dog || !dog.stamboomnr) return [];
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
    
    async getFullSizeFoto(fotoId) {
        if (!fotoId) return null;
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
    
    // ==================== COI BEREKENING ====================
    
    calculateCOI(dogId) {
        console.log('COI berekening voor database ID:', dogId);
        
        if (!dogId || dogId === 0) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        // Basisgevallen
        if (!dog.vaderId || !dog.moederId) {
            return { coi6Gen: '0.0', coiAllGen: '0.0' };
        }
        
        if (dog.vaderId === dog.moederId) {
            return { coi6Gen: '25.0', coiAllGen: '25.0' };
        }
        
        // Gebruik COICalculator als beschikbaar
        if (this.coiCalculator) {
            try {
                const result = this.coiCalculator.calculateCOI(dogId);
                console.log('COI resultaat:', result);
                return result;
            } catch (error) {
                console.error('Fout in COICalculator:', error);
            }
        }
        
        // Fallback berekening
        return { coi6Gen: '0.0', coiAllGen: '0.0' };
    }
    
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745';
        if (value <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
    
    // ==================== STAMBOOM OPBOUW ====================
    
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
        
        // Ouders - MET GARANTIE OP VOLLEDIGE DATA
        if (mainDog.vaderId) {
            const father = this.getDogById(mainDog.vaderId);
            if (father) pedigreeTree.father = father;
        }
        
        if (mainDog.moederId) {
            const mother = this.getDogById(mainDog.moederId);
            if (mother) pedigreeTree.mother = mother;
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
    
    // ==================== CARD GENERATIE ====================
    
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
        
        // VERBETERING: Garandeer dat we volledige data hebben voor deze hond
        const fullDog = await this.getDogWithFullData(dog.id);
        
        const hasPhotos = await this.checkDogHasPhotos(fullDog?.id || dog.id);
        const cameraIcon = hasPhotos ? '<i class="bi bi-camera text-danger ms-1"></i>' : '';

        const combinedName = fullDog?.naam || dog.naam || this.t('unknown');
        const showKennel = fullDog?.kennelnaam && fullDog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${fullDog.kennelnaam}` : '');
        
        return `
            <div class="pedigree-card-compact horizontal ${fullDog?.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                 data-dog-id="${fullDog?.id || dog.id}" 
                 data-dog-name="${fullDog?.naam || dog.naam || ''}"
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
                        ${fullDog?.stamboomnr ? `
                        <div class="dog-pedigree-compact" title="${fullDog.stamboomnr}">
                            ${fullDog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${fullDog?.ras ? `
                        <div class="dog-breed-compact" title="${fullDog.ras}">
                            ${fullDog.ras}
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
    
    // ==================== DETAIL POPUP ====================
    
    async getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        // VERBETERING: Garandeer volledige data voor de popup
        const fullDog = await this.getDogWithFullData(dog.id);
        if (!fullDog) {
            return `
                <div class="dog-detail-popup">
                    <div class="popup-header">
                        <h5 class="popup-title">${this.t('unknown')}</h5>
                        <button type="button" class="btn-close btn-close-white"></button>
                    </div>
                    <div class="popup-body">
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            ${this.t('errorLoadingData')}
                        </div>
                    </div>
                    <div class="popup-footer">
                        <button type="button" class="btn btn-secondary popup-close-btn">
                            <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                        </button>
                    </div>
                </div>
            `;
        }
        
        const genderText = fullDog.geslacht === 'reuen' ? this.t('male') : 
                          fullDog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        // Bereken COI waarden
        const coiValues = this.calculateCOI(fullDog.id);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        const coiAllColor = this.getCOIColor(coiValues.coiAllGen);
        
        // Laad thumbnails
        const thumbnails = await this.getDogThumbnails(fullDog.id, 9);
        
        // Maak gecombineerde naam+kennel string
        const combinedName = fullDog.naam || this.t('unknown');
        const showKennel = fullDog.kennelnaam && fullDog.kennelnaam.trim() !== '';
        const kennelSuffix = showKennel ? ` ${fullDog.kennelnaam}` : '';
        const headerText = combinedName + kennelSuffix;
        
        return `
            <div class="dog-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi ${fullDog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${headerText}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" aria-label="Sluiten"></button>
                </div>
                <div class="popup-body">
                    <!-- THUMBNAILS SECTIE -->
                    ${thumbnails.length > 0 ? `
                    <div class="info-section mb-3">
                        <h6><i class="bi bi-camera me-1"></i> ${this.t('photos')} (${thumbnails.length})</h6>
                        <div class="photos-grid" id="photosGrid${fullDog.id}">
                            ${thumbnails.map((thumb, index) => `
                                <div class="photo-thumbnail" 
                                     data-photo-id="${thumb.id}" 
                                     data-dog-id="${fullDog.id}" 
                                     data-photo-index="${index}"
                                     data-is-thumbnail="true">
                                    <img src="${thumb.thumbnail}" 
                                         alt="${fullDog.naam || ''} - ${thumb.filename || ''}" 
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
                    
                    <!-- BASISGEGEVENS -->
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="info-grid">
                            <!-- Stamboomnummer en Ras -->
                            <div class="info-row">
                                ${fullDog.stamboomnr ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('pedigreeNumber')}:</span>
                                    <span class="info-value">${fullDog.stamboomnr}</span>
                                </div>
                                ` : ''}
                                
                                ${fullDog.ras ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('breed')}:</span>
                                    <span class="info-value">${fullDog.ras}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- Geslacht en Vachtkleur -->
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('gender')}:</span>
                                    <span class="info-value">${genderText}</span>
                                </div>
                                
                                ${fullDog.vachtkleur ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coatColor')}:</span>
                                    <span class="info-value">${fullDog.vachtkleur}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- COI waarden -->
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
                            ${fullDog.geboortedatum ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('birthDate')}:</span>
                                    <span class="info-value">${this.formatDate(fullDog.geboortedatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${fullDog.overlijdensdatum ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('deathDate')}:</span>
                                    <span class="info-value">${this.formatDate(fullDog.overlijdensdatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            <!-- Land en postcode -->
                            ${fullDog.land ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('country')}:</span>
                                    <span class="info-value">${fullDog.land}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${fullDog.postcode ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('zipCode')}:</span>
                                    <span class="info-value">${fullDog.postcode}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- GEZONDHEIDSINFO -->
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo')}</h6>
                        <div class="info-grid">
                            ${fullDog.heupdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('hipDysplasia')}:</span>
                                    <span class="info-value">${this.getHealthBadge(fullDog.heupdysplasie, 'hip')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${fullDog.elleboogdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('elbowDysplasia')}:</span>
                                    <span class="info-value">${this.getHealthBadge(fullDog.elleboogdysplasie, 'elbow')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${fullDog.patella ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('patellaLuxation')}:</span>
                                    <span class="info-value">${this.getHealthBadge(fullDog.patella, 'patella')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${fullDog.ogen ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('eyes')}:</span>
                                    <span class="info-value">${this.getHealthBadge(fullDog.ogen, 'eyes')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${fullDog.ogenVerklaring ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('eyesExplanation')}:</span>
                                    <span class="info-value">${fullDog.ogenVerklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${fullDog.dandyWalker ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('dandyWalker')}:</span>
                                    <span class="info-value">${this.getHealthBadge(fullDog.dandyWalker, 'dandy')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${fullDog.schildklier ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('thyroid')}:</span>
                                    <span class="info-value">${this.getHealthBadge(fullDog.schildklier, 'thyroid')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${fullDog.schildklierVerklaring ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('thyroidExplanation')}:</span>
                                    <span class="info-value">${fullDog.schildklierVerklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- OPMERKINGEN -->
                    ${fullDog.opmerkingen ? `
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="remarks-box">
                            ${fullDog.opmerkingen}
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
    
    // ==================== EVENT LISTENERS ====================
    
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
                    const fullPhoto = await this.getFullSizeFoto(photoId);
                    
                    if (fullPhoto && fullPhoto.data) {
                        const popupTitle = document.querySelector('.popup-title');
                        let dogName = '';
                        if (popupTitle) {
                            dogName = popupTitle.textContent.trim();
                            dogName = dogName.replace(/^[^a-zA-Z]*/, '').trim();
                        }
                        
                        this.showLargePhoto(fullPhoto.data, dogName);
                    } else {
                        console.error('Kon volledige foto niet laden:', photoId);
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
        console.log('Toon grote foto');
        
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
    
    // ==================== HOOFD STAMBOOM FUNCTIE ====================
    
    async showPedigree(dog) {
        // VERBETERING: Garandeer dat we geïnitialiseerd zijn VOOR we iets tonen
        const isReady = await this.ensureInitialized();
        if (!isReady) {
            this.showError("Kon stamboom niet laden. Data niet beschikbaar.");
            return;
        }
        
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
                /* ... (zelfde CSS als voorheen, blijft ongewijzigd) ... */
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
        
        // VERBETERING: Gebruik getDogWithFullData voor alle kaarten
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
                
                const dog = await this.getDogWithFullData(dogId); // 👈 VERBETERING: Volledige data garanderen
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
    
    // ==================== BASE MODULE HELPER METHODES ====================
    
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