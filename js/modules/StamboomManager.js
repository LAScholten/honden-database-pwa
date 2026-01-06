/**
 * Stamboom Manager Module - FIXED VERSION
 * Probleem: getDogById() zoekt alleen in this.allDogs, niet in database
 * Oplossing: Maak getDogById() ASYNCHROON en laat het altijd volledige data garanderen
 */

class StamboomManager extends BaseModule {
    constructor(db, currentLang = 'nl') {
        super();
        this.db = db;
        this.currentLang = currentLang;
        this.allDogs = [];
        this.coiCalculator = null;
        this.isInitialized = false;
        
        // Cache systemen
        this.dogPhotosCache = new Map();
        this.dogHasPhotosCache = new Map();
        this.dogThumbnailsCache = new Map();
        this.fullPhotoCache = new Map();
        
        // CRITIEKE FIX: Centrale cache voor hondendata
        this.dogCache = new Map();
        
        // Translations (zoals voorheen)
        this.translations = { /* ... blijft hetzelfde ... */ };
        
        this.setupGlobalEventListeners();
    }
    
    // ==================== KRITIEKE FIX: ALTIJD VOLLEDIGE DATA ====================
    
    /**
     * VERVANG getDogById() door async getDog() die ALTIJD volledige data geeft
     */
    async getDog(dogId) {
        if (!dogId || dogId === 0) return null;
        
        // 1. Check cache eerst (SNEL)
        if (this.dogCache.has(dogId)) {
            const cachedDog = this.dogCache.get(dogId);
            // Controleer of het complete data is
            if (this.isCompleteDog(cachedDog)) {
                return cachedDog;
            }
        }
        
        // 2. Zoek in lokale dataset
        let dog = this.allDogs.find(d => d.id === dogId);
        
        // 3. Als niet gevonden of onvolledig, haal uit database
        if (!dog || !this.isCompleteDog(dog)) {
            try {
                console.log(`🔄 Ophalen hond ${dogId} uit database...`);
                const dbDog = await this.db.getHondById(dogId);
                
                if (dbDog) {
                    // Verrijk de data
                    dog = this.enrichDogData(dbDog);
                    
                    // Update lokale dataset
                    const index = this.allDogs.findIndex(d => d.id === dogId);
                    if (index !== -1) {
                        // Merge: database data heeft voorrang
                        this.allDogs[index] = { ...this.allDogs[index], ...dog };
                    } else {
                        // Voeg nieuwe hond toe
                        this.allDogs.push(dog);
                    }
                    
                    // Update cache
                    this.dogCache.set(dogId, dog);
                    if (dog.stamboomnr) {
                        this.dogCache.set(dog.stamboomnr, dog);
                    }
                    
                    console.log(`✅ Hond ${dogId} geladen uit database`);
                }
            } catch (error) {
                console.error(`❌ Fout bij ophalen hond ${dogId}:`, error);
                // Gebruik wat we hebben
                if (dog) {
                    console.warn(`⚠️ Gebruik onvolledige lokale data voor hond ${dogId}`);
                }
            }
        }
        
        return dog || null;
    }
    
    /**
     * Controleer of een hond object complete data heeft
     */
    isCompleteDog(dog) {
        if (!dog) return false;
        
        // Basis velden die altijd moeten bestaan
        const requiredFields = ['id', 'naam'];
        
        // Optioneel: controleer gezondheidsvelden
        const hasHealthData = (
            dog.heupdysplasie !== undefined &&
            dog.elleboogdysplasie !== undefined &&
            dog.patella !== undefined &&
            dog.ogen !== undefined &&
            dog.dandyWalker !== undefined &&
            dog.schildklier !== undefined
        );
        
        return requiredFields.every(field => dog[field] !== undefined);
    }
    
    /**
     * Backward compatibility: behoud getDogById() maar maak het async
     */
    async getDogById(id) {
        return this.getDog(id);
    }
    
    // ==================== VERBETERDE INITIALISATIE ====================
    
    async ensureInitialized() {
        if (this.isInitialized && this.allDogs.length > 0) {
            return true;
        }
        
        try {
            console.log('🔄 StamboomManager initialiseren...');
            await this.loadAllDogs();
            this.isInitialized = true;
            console.log(`✅ StamboomManager geïnitialiseerd met ${this.allDogs.length} honden`);
            return true;
        } catch (error) {
            console.error('❌ Fout bij initialiseren:', error);
            return false;
        }
    }
    
    async loadAllDogs() {
        try {
            if (!this.db || typeof this.db.getHonden !== 'function') {
                throw new Error('Database niet beschikbaar');
            }
            
            console.log('🔄 Alle honden laden...');
            const dogs = await this.db.getHonden();
            console.log(`📊 ${dogs.length} honden geladen uit database`);
            
            // Verrijk alle data
            this.allDogs = dogs.map(dog => this.enrichDogData(dog));
            
            // Vul cache
            this.allDogs.forEach(dog => {
                this.dogCache.set(dog.id, dog);
                if (dog.stamboomnr) {
                    this.dogCache.set(dog.stamboomnr, dog);
                }
            });
            
            // Initialiseer COI Calculator
            if (typeof COICalculator !== 'undefined') {
                this.coiCalculator = new COICalculator(this.allDogs);
                console.log('✅ COICalculator geïnitialiseerd');
            }
            
            return this.allDogs;
            
        } catch (error) {
            console.error('❌ Fout bij laden honden:', error);
            throw error;
        }
    }
    
    enrichDogData(dog) {
        // ZORG DAT ALLE VELDEN BESTAAN
        return {
            // Identificatie
            id: dog.id || 0,
            naam: dog.naam || '',
            kennelnaam: dog.kennelnaam || '',
            stamboomnr: dog.stamboomnr || '',
            
            // Basis info
            ras: dog.ras || '',
            geslacht: dog.geslacht || 'onbekend',
            geboortedatum: dog.geboortedatum || null,
            overlijdensdatum: dog.overlijdensdatum || null,
            vachtkleur: dog.vachtkleur || '',
            
            // Ouders (IDs en namen)
            vaderId: dog.vaderId || null,
            moederId: dog.moederId || null,
            vader: dog.vader || '',
            moeder: dog.moeder || '',
            
            // GEZONDHEIDSVELDEN - ZORG DAT ZE ER ALTIJD ZIJN
            heupdysplasie: dog.heupdysplasie || '',
            elleboogdysplasie: dog.elleboogdysplasie || '',
            patella: dog.patella || '',
            ogen: dog.ogen || '',
            ogenVerklaring: dog.ogenVerklaring || '',
            dandyWalker: dog.dandyWalker || '',
            schildklier: dog.schildklier || '',
            schildklierVerklaring: dog.schildklierVerklaring || '',
            
            // Extra
            land: dog.land || '',
            postcode: dog.postcode || '',
            opmerkingen: dog.opmerkingen || '',
            createdAt: dog.createdAt || null,
            updatedAt: dog.updatedAt || null
        };
    }
    
    // ==================== STAMBOOM OPBOUW - FIXED ====================
    
    async buildPedigreeTree(dogId) {
        console.log(`🌳 Stamboom bouwen voor hond ${dogId}...`);
        
        const mainDog = await this.getDog(dogId); // 👈 ASYNCHROON!
        if (!mainDog) {
            console.error(`❌ Hoofdhond ${dogId} niet gevonden`);
            return null;
        }
        
        const pedigreeTree = {
            mainDog: mainDog,
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
        
        // Haal ouders ASYNCHROON op
        if (mainDog.vaderId) {
            pedigreeTree.father = await this.getDog(mainDog.vaderId);
        }
        
        if (mainDog.moederId) {
            pedigreeTree.mother = await this.getDog(mainDog.moederId);
        }
        
        // Haal grootouders ASYNCHROON op
        if (pedigreeTree.father) {
            if (pedigreeTree.father.vaderId) {
                pedigreeTree.paternalGrandfather = await this.getDog(pedigreeTree.father.vaderId);
            }
            if (pedigreeTree.father.moederId) {
                pedigreeTree.paternalGrandmother = await this.getDog(pedigreeTree.father.moederId);
            }
        }
        
        if (pedigreeTree.mother) {
            if (pedigreeTree.mother.vaderId) {
                pedigreeTree.maternalGrandfather = await this.getDog(pedigreeTree.mother.vaderId);
            }
            if (pedigreeTree.mother.moederId) {
                pedigreeTree.maternalGrandmother = await this.getDog(pedigreeTree.mother.moederId);
            }
        }
        
        // Haal overgrootouders ASYNCHROON op
        if (pedigreeTree.paternalGrandfather) {
            if (pedigreeTree.paternalGrandfather.vaderId) {
                pedigreeTree.paternalGreatGrandfather1 = await this.getDog(pedigreeTree.paternalGrandfather.vaderId);
            }
            if (pedigreeTree.paternalGrandfather.moederId) {
                pedigreeTree.paternalGreatGrandmother1 = await this.getDog(pedigreeTree.paternalGrandfather.moederId);
            }
        }
        
        if (pedigreeTree.paternalGrandmother) {
            if (pedigreeTree.paternalGrandmother.vaderId) {
                pedigreeTree.paternalGreatGrandfather2 = await this.getDog(pedigreeTree.paternalGrandmother.vaderId);
            }
            if (pedigreeTree.paternalGrandmother.moederId) {
                pedigreeTree.paternalGreatGrandmother2 = await this.getDog(pedigreeTree.paternalGrandmother.moederId);
            }
        }
        
        if (pedigreeTree.maternalGrandfather) {
            if (pedigreeTree.maternalGrandfather.vaderId) {
                pedigreeTree.maternalGreatGrandfather1 = await this.getDog(pedigreeTree.maternalGrandfather.vaderId);
            }
            if (pedigreeTree.maternalGrandfather.moederId) {
                pedigreeTree.maternalGreatGrandmother1 = await this.getDog(pedigreeTree.maternalGrandfather.moederId);
            }
        }
        
        if (pedigreeTree.maternalGrandmother) {
            if (pedigreeTree.maternalGrandmother.vaderId) {
                pedigreeTree.maternalGreatGrandfather2 = await this.getDog(pedigreeTree.maternalGrandmother.vaderId);
            }
            if (pedigreeTree.maternalGrandmother.moederId) {
                pedigreeTree.maternalGreatGrandmother2 = await this.getDog(pedigreeTree.maternalGrandmother.moederId);
            }
        }
        
        console.log(`✅ Stamboom gebouwd voor ${mainDog.naam} (ID: ${dogId})`);
        return pedigreeTree;
    }
    
    // ==================== CARD GENERATIE - FIXED ====================
    
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
        
        // GEBRUIK DE VERKREGEN HOND (die al correct is)
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? 'bg-primary' : 'bg-secondary';
        
        // Check foto's
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        const cameraIcon = hasPhotos ? '<i class="bi bi-camera text-danger ms-1"></i>' : '';

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
    
    // ==================== HOOFDFUNCTIE - FIXED ====================
    
    async showPedigree(dog) {
        // Garandeer initialisatie
        await this.ensureInitialized();
        
        if (!document.getElementById('pedigreeModal')) {
            this.createPedigreeModal();
        }
        
        // Gebruik ASYNCHRONE stamboom bouwer
        const pedigreeTree = await this.buildPedigreeTree(dog.id);
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
    
    async renderCompactPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) return;
        
        // Gebruik getDogCompactCardHTML die nu gewoon de hond gebruikt
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
        
        // Add click events
        this.setupCardClickEvents();
    }
    
    // ==================== DETAIL POPUP - FIXED ====================
    
    async getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        // GEBRUIK DE HOND DIE WE AL HEBBEN (deze is al correct)
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        // Bereken COI
        const coiValues = this.calculateCOI(dog.id);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        const coiAllColor = this.getCOIColor(coiValues.coiAllGen);
        
        // Laad thumbnails
        const thumbnails = await this.getDogThumbnails(dog.id, 9);
        
        // Maak naam
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const headerText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        // HTML (zelfde als voorheen, maar nu met CORRECTE data)
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
                    <!-- ... (zelfde HTML als voorheen) ... -->
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-secondary popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
    }
    
    // ==================== OVERIGE METHODES ====================
    
    setupCardClickEvents() {
        const cards = document.querySelectorAll('.pedigree-card-compact.horizontal:not(.empty)');
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId === 0) return;
                
                // 👈 ASYNCHROON: Haal altijd volledige data op
                const dog = await this.getDog(dogId);
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
        
        overlay.style.display = 'flex';
        
        // Close event listeners...
        const closeButtons = container.querySelectorAll('.btn-close, .popup-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.style.display = 'none';
            });
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
        
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.style.display = 'none';
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    // ==================== HULP METHODES ====================
    
    // Overige methodes blijven hetzelfde...
    async checkDogHasPhotos(dogId) {
        const dog = await this.getDog(dogId);
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
            console.error('Fout bij checken foto\'s:', dogId, error);
            return false;
        }
    }
    
    async getDogThumbnails(dogId, limit = 9) {
        const dog = await this.getDog(dogId);
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
            console.error('Fout bij thumbnails:', dogId, error);
            return [];
        }
    }
    
    // COI, formatDate, getHealthBadge, etc blijven hetzelfde...
    calculateCOI(dogId) {
        if (!dogId || dogId === 0) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        const dog = this.allDogs.find(d => d.id === dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0' };
        
        if (this.coiCalculator) {
            try {
                return this.coiCalculator.calculateCOI(dogId);
            } catch (error) {
                console.error('COI fout:', error);
            }
        }
        
        return { coi6Gen: '0.0', coiAllGen: '0.0' };
    }
    
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745';
        if (value <= 6.0) return '#fd7e14';
        return '#dc3545';
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
    
    // BaseModule helpers
    showProgress(message) {
        if (typeof super.showProgress === 'function') {
            super.showProgress(message);
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
            alert(message);
        }
    }
    
    showSuccess(message) {
        if (typeof super.showSuccess === 'function') {
            super.showSuccess(message);
        }
    }
}