/**
 * Search Manager Module
 * Beheert het zoeken naar honden met real-time filtering op naam en kennelnaam
 */

class SearchManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.searchType = 'name'; // 'name' of 'kennel'
        this.stamboomManager = null; // Wordt later geïnitialiseerd
        
        // Vertalingen uitgebreid met pedigree knop
        this.translations = {
            nl: {
                // ... [alle bestaande vertalingen blijven hetzelfde]
                // Voeg deze toe:
                pedigreeButton: "Stamboom",
                pedigreeTitle: "Stamboom van {name}",
                generatingPedigree: "Stamboom genereren...",
                openPedigree: "Stamboom openen",
                pedigree4Gen: "4-generatie stamboom",
                
                // Familierelaties voor stamboom
                greatGrandfather: "Overgrootvader",
                greatGrandmother: "Overgrootmoeder",
                grandfather: "Grootvader",
                grandmother: "Grootmoeder",
                father: "Vader",
                mother: "Moeder",
                currentDog: "Huidige hond"
            },
            en: {
                // ... [alle bestaande vertalingen blijven hetzelfde]
                // Add these:
                pedigreeButton: "Pedigree",
                pedigreeTitle: "Pedigree of {name}",
                generatingPedigree: "Generating pedigree...",
                openPedigree: "Open pedigree",
                pedigree4Gen: "4-generation pedigree",
                
                // Family relations for pedigree
                greatGrandfather: "Great Grandfather",
                greatGrandmother: "Great Grandmother",
                grandfather: "Grandfather",
                grandmother: "Grandmother",
                father: "Father",
                mother: "Mother",
                currentDog: "Current Dog"
            },
            de: {
                // ... [alle bestaande vertalingen blijven hetzelfde]
                // Füge diese hinzu:
                pedigreeButton: "Ahnentafel",
                pedigreeTitle: "Ahnentafel von {name}",
                generatingPedigree: "Ahnentafel wird generiert...",
                openPedigree: "Ahnentafel öffnen",
                pedigree4Gen: "4-Generationen Ahnentafel",
                
                // Familienbeziehungen für Ahnentafel
                greatGrandfather: "Urgroßvater",
                greatGrandmother: "Urgroßmutter",
                grandfather: "Großvater",
                grandmother: "Großmutter",
                father: "Vater",
                mother: "Mutter",
                currentDog: "Aktueller Hund"
            }
        };
    }
    
    t(key, subKey = null) {
        if (subKey && this.translations[this.currentLang][key] && typeof this.translations[this.currentLang][key] === 'object') {
            return this.translations[this.currentLang][key][subKey] || subKey;
        }
        return this.translations[this.currentLang][key] || key;
    }
    
    // Nieuw: Initialiseer StamboomManager
    async initializeStamboomManager() {
        if (!this.stamboomManager) {
            this.stamboomManager = new StamboomManager(this.db, this.currentLang);
            await this.stamboomManager.initialize();
        }
    }
    
    // Bestaande methodes blijven...
    
    showDogDetails(dog, isParentView = false, originalDogId = null) {
        const t = this.t.bind(this);
        const container = document.getElementById('detailsContainer');
        
        if (!container) return;
        
        let fatherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        let motherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        
        if (dog.vaderId) {
            const father = this.allDogs.find(d => d.id === dog.vaderId);
            if (father) {
                fatherInfo = { 
                    id: father.id,
                    naam: father.naam || t('unknown'),
                    stamboomnr: father.stamboomnr || '',
                    ras: father.ras || '',
                    kennelnaam: father.kennelnaam || ''
                };
            }
        }
        
        if (dog.moederId) {
            const mother = this.allDogs.find(d => d.id === dog.moederId);
            if (mother) {
                motherInfo = { 
                    id: mother.id,
                    naam: mother.naam || t('unknown'),
                    stamboomnr: mother.stamboomnr || '',
                    ras: mother.ras || '',
                    kennelnaam: mother.kennelnaam || ''
                };
            }
        }
        
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        };
        
        const getHealthBadge = (value, type) => {
            if (!value || value === '') {
                return `<span class="badge bg-secondary">${t('unknown')}</span>`;
            }
            
            let badgeClass = '';
            let badgeText = value;
            
            switch(type) {
                case 'hip':
                    badgeClass = 'badge-hd';
                    badgeText = t('hipGrades', value) || value;
                    break;
                case 'elbow':
                    badgeClass = 'badge-ed';
                    badgeText = t('elbowGrades', value) || value;
                    break;
                case 'patella':
                    badgeClass = 'badge-pl';
                    badgeText = t('patellaGrades', value) || value;
                    break;
                case 'eyes':
                    badgeClass = 'badge-eyes';
                    badgeText = t('eyeStatus', value) || value;
                    break;
                case 'dandy':
                    badgeClass = 'badge-dandy';
                    badgeText = t('dandyStatus', value) || value;
                    break;
                case 'thyroid':
                    badgeClass = 'badge-thyroid';
                    badgeText = t('thyroidStatus', value) || value;
                    break;
                default:
                    badgeClass = 'badge bg-secondary';
            }
            
            return `<span class="badge ${badgeClass}">${badgeText}</span>`;
        };
        
        const displayValue = (value) => {
            return value && value !== '' ? value : t('unknown');
        };
        
        const genderText = dog.geslacht === 'reuen' ? t('male') : 
                          dog.geslacht === 'teven' ? t('female') : t('unknown');
        
        const html = `
            <div class="details-card">
                ${isParentView ? `
                <div class="details-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-sm btn-outline-secondary back-button" data-original-dog="${originalDogId}">
                            <i class="bi bi-arrow-left me-1"></i> ${t('backToSearch')}
                        </button>
                        <div class="text-muted small">
                            <i class="bi bi-info-circle me-1"></i> ${t('viewingParent')}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="details-header ${isParentView ? 'pt-0' : ''}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="dog-name-header">${displayValue(dog.naam)}</div>
                            ${dog.kennelnaam ? `<div class="text-muted mb-2">${displayValue(dog.kennelnaam)}</div>` : ''}
                            
                            <!-- VOLGORDE: Stamboomnummer + Ras + Geslacht + Vachtkleur -->
                            <div class="dog-detail-header-line mt-2">
                                ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                                ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                                <span class="geslacht">${genderText}</span>
                                ${dog.vachtkleur && dog.vachtkleur.trim() !== '' ? 
                                  `<span class="vachtkleur">${dog.vachtkleur}</span>` : 
                                  `<span class="text-muted fst-italic">geen vachtkleur</span>`}
                            </div>
                        </div>
                        <div class="text-end">
                            <!-- Geboortedatum -->
                            ${dog.geboortedatum ? `
                            <div class="text-muted">
                                <i class="bi bi-calendar me-1"></i>
                                ${formatDate(dog.geboortedatum)}
                            </div>
                            ` : ''}
                            
                            <!-- Overlijdensdatum -->
                            ${dog.overlijdensdatum ? `
                            <div class="text-muted ${dog.geboortedatum ? 'mt-1' : ''}">
                                <i class="bi bi-calendar-x me-1"></i>
                                ${formatDate(dog.overlijdensdatum)}
                            </div>
                            ` : ''}
                            
                            <!-- Stamboom knop -->
                            <button class="btn btn-sm btn-outline-primary mt-2 btn-pedigree" data-dog-id="${dog.id}">
                                <i class="bi bi-diagram-3 me-1"></i> ${t('pedigreeButton')}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="details-body">
                    <div class="info-group">
                        <div class="info-group-title d-flex justify-content-between align-items-center">
                            <div>
                                <i class="bi bi-people me-1"></i> ${t('parents')}
                            </div>
                            <button class="btn btn-sm btn-outline-primary btn-pedigree" data-dog-id="${dog.id}">
                                <i class="bi bi-diagram-3 me-1"></i> ${t('pedigreeButton')}
                            </button>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="father-card" ${fatherInfo.id ? `data-parent-id="${fatherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                    <div class="fw-bold mb-1 text-primary">
                                        <i class="bi bi-gender-male me-1"></i> ${t('father')}
                                    </div>
                                    <div class="parent-name">${fatherInfo.naam} ${fatherInfo.kennelnaam}</div>
                                    ${fatherInfo.stamboomnr ? `<div class="parent-info">${fatherInfo.stamboomnr}</div>` : ''}
                                    ${fatherInfo.ras ? `<div class="parent-info">${fatherInfo.ras}</div>` : ''}
                                    ${fatherInfo.id ? `
                                    <div class="click-hint">
                                        <i class="bi bi-arrow-right-circle"></i>
                                        ${t('clickToView')}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="mother-card" ${motherInfo.id ? `data-parent-id="${motherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                    <div class="fw-bold mb-1 text-danger">
                                        <i class="bi bi-gender-female me-1"></i> ${t('mother')}
                                    </div>
                                    <div class="parent-mother-name">${motherInfo.naam} ${motherInfo.kennelnaam}</div>
                                    ${motherInfo.stamboomnr ? `<div class="parent-info">${motherInfo.stamboomnr}</div>` : ''}
                                    ${motherInfo.ras ? `<div class="parent-info">${motherInfo.ras}</div>` : ''}
                                    ${motherInfo.id ? `
                                    <div class="click-hint">
                                        <i class="bi bi-arrow-right-circle"></i>
                                        ${t('clickToView')}
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Rest van de details blijft hetzelfde -->
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-heart-pulse me-1"></i> ${t('healthInfo')}
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('hipDysplasia')}</div>
                                <div>${getHealthBadge(dog.heupdysplasie, 'hip')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('elbowDysplasia')}</div>
                                <div>${getHealthBadge(dog.elleboogdysplasie, 'elbow')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('patellaLuxation')}</div>
                                <div>${getHealthBadge(dog.patella, 'patella')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('eyes')}</div>
                                <div>${getHealthBadge(dog.ogen, 'eyes')}</div>
                                ${dog.ogenVerklaring ? `<div class="text-muted small mt-1">${dog.ogenVerklaring}</div>` : ''}
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('dandyWalker')}</div>
                                <div>${getHealthBadge(dog.dandyWalker, 'dandy')}</div>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <div class="fw-bold mb-1">${t('thyroid')}</div>
                                <div>${getHealthBadge(dog.schildklier, 'thyroid')}</div>
                                ${dog.schildklierVerklaring ? `<div class="text-muted small mt-1">${dog.schildklierVerklaring}</div>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-group">
                        <div class="info-group-title">
                            <i class="bi bi-info-circle me-1"></i> ${t('additionalInfo')}
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="fw-bold mb-1">${t('country')}</div>
                                <div>${displayValue(dog.land)}</div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="fw-bold mb-1">${t('zipCode')}</div>
                                <div>${displayValue(dog.postcode)}</div>
                            </div>
                        </div>
                        
                        <div class="mt-3">
                            <div class="fw-bold mb-2">${t('remarks')}</div>
                            <div class="remarks-box">
                                ${dog.opmerkingen ? dog.opmerkingen : t('noAdditionalInfo')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Event listeners voor ouders
        if (fatherInfo.id) {
            const fatherCard = document.querySelector('.father-card');
            if (fatherCard) {
                fatherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(fatherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(fatherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        if (motherInfo.id) {
            const motherCard = document.querySelector('.mother-card');
            if (motherCard) {
                motherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(motherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(motherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        // Event listeners voor stamboom knoppen
        document.querySelectorAll('.btn-pedigree').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                await this.openPedigree(dogId);
            });
        });
        
        if (isParentView) {
            const backButton = document.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    const originalDogId = parseInt(backButton.getAttribute('data-original-dog'));
                    const originalDog = this.allDogs.find(d => d.id === originalDogId);
                    if (originalDog) {
                        this.showDogDetails(originalDog);
                    }
                });
            }
        }
    }
    
    // NIEUWE METHODE: Stamboom openen
    async openPedigree(dogId) {
        // Initialiseer stamboom manager als nog niet gedaan
        await this.initializeStamboomManager();
        
        // Zoek de hond
        const dog = this.allDogs.find(d => d.id === dogId);
        if (!dog) {
            this.showError("Hond niet gevonden");
            return;
        }
        
        // Toon stamboom modal
        this.stamboomManager.showPedigree(dog);
    }
    
    // Bestaande methodes blijven hier...
    // ...
}