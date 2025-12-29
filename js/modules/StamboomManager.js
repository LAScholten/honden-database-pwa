/**
 * Stamboom Manager Module - Wigvorm layout
 */

class StamboomManager extends BaseModule {
    constructor(db, currentLang = 'nl') {
        super();
        this.db = db;
        this.currentLang = currentLang;
        this.allDogs = [];
        this.translations = {
            nl: {
                pedigreeTitle: "StamPboom van {name}",
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
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders"
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
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great Grandparents"
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
                father: "Vater",
                mother: "Mutter",
                grandfather: "Großvater",
                grandmother: "Großmutter",
                greatGrandfather: "Urgroßvater",
                greatGrandmother: "Urgroßmutter",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async initialize() {
        this.allDogs = await this.db.getHonden();
    }
    
    getDogById(id) {
        return this.allDogs.find(dog => dog.id === id);
    }
    
    buildPedigreeTree(dogId) {
        const mainDog = this.getDogById(dogId);
        if (!mainDog) return null;
        
        const tree = { mainDog };
        
        if (mainDog.vaderId) tree.father = this.getDogById(mainDog.vaderId);
        if (mainDog.moederId) tree.mother = this.getDogById(mainDog.moederId);
        
        if (tree.father && tree.father.vaderId) tree.paternalGrandfather = this.getDogById(tree.father.vaderId);
        if (tree.father && tree.father.moederId) tree.paternalGrandmother = this.getDogById(tree.father.moederId);
        if (tree.mother && tree.mother.vaderId) tree.maternalGrandfather = this.getDogById(tree.mother.vaderId);
        if (tree.mother && tree.mother.moederId) tree.maternalGrandmother = this.getDogById(tree.mother.moederId);
        
        if (tree.paternalGrandfather && tree.paternalGrandfather.vaderId) tree.paternalGreatGrandfather1 = this.getDogById(tree.paternalGrandfather.vaderId);
        if (tree.paternalGrandfather && tree.paternalGrandfather.moederId) tree.paternalGreatGrandmother1 = this.getDogById(tree.paternalGrandfather.moederId);
        if (tree.paternalGrandmother && tree.paternalGrandmother.vaderId) tree.paternalGreatGrandfather2 = this.getDogById(tree.paternalGrandmother.vaderId);
        if (tree.paternalGrandmother && tree.paternalGrandmother.moederId) tree.paternalGreatGrandmother2 = this.getDogById(tree.paternalGrandmother.moederId);
        if (tree.maternalGrandfather && tree.maternalGrandfather.vaderId) tree.maternalGreatGrandfather1 = this.getDogById(tree.maternalGrandfather.vaderId);
        if (tree.maternalGrandfather && tree.maternalGrandfather.moederId) tree.maternalGreatGrandmother1 = this.getDogById(tree.maternalGrandfather.moederId);
        if (tree.maternalGrandmother && tree.maternalGrandmother.vaderId) tree.maternalGreatGrandfather2 = this.getDogById(tree.maternalGrandmother.vaderId);
        if (tree.maternalGrandmother && tree.maternalGrandmother.moederId) tree.maternalGreatGrandmother2 = this.getDogById(tree.maternalGrandmother.moederId);
        
        return tree;
    }
    
    getDogCardHTML(dog, relation = '', isMainDog = false, generation = 0) {
        if (!dog) {
            return `
                <div class="pedigree-card empty gen${generation}" data-dog-id="0">
                    <div class="card-header">${relation}</div>
                    <div class="card-body text-center py-3">
                        <div class="no-data">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        return `
            <div class="pedigree-card ${dog.geslacht === 'reuen' ? 'male' : 'female'} gen${generation} ${isMainDog ? 'main-dog' : ''}" 
                 data-dog-id="${dog.id}">
                <div class="card-header ${isMainDog ? 'bg-primary' : 'bg-secondary'}">
                    <span>${relation}</span>
                    <i class="bi ${genderIcon}"></i>
                </div>
                <div class="card-body">
                    <div class="dog-name">${dog.naam || this.t('unknown')}</div>
                    ${dog.kennelnaam ? `<div class="dog-kennel">${dog.kennelnaam}</div>` : ''}
                    ${dog.stamboomnr ? `<div class="dog-pedigree">${dog.stamboomnr}</div>` : ''}
                    <div class="click-hint">
                        <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}
                    </div>
                </div>
            </div>
        `;
    }
    
    showPedigree(dog) {
        if (!document.getElementById('pedigreeModal')) {
            this.createPedigreeModal();
        }
        
        const pedigreeTree = this.buildPedigreeTree(dog.id);
        if (!pedigreeTree) return;
        
        document.getElementById('pedigreeModalLabel').textContent = 
            this.t('pedigreeTitle').replace('{name}', dog.naam || this.t('unknown'));
        
        this.renderPedigree(pedigreeTree);
        
        new bootstrap.Modal(document.getElementById('pedigreeModal')).show();
    }
    
    createPedigreeModal() {
        const modalHTML = `
            <div class="modal fade" id="pedigreeModal" tabindex="-1">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-diagram-3 me-2"></i> ${this.t('pedigree4Gen')}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${this.t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
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
                    </div>
                </div>
            </div>
            
            <style>
                /* RESET */
                #pedigreeModal .modal-dialog.modal-fullscreen {
                    width: 100vw;
                    height: 100vh;
                    margin: 0;
                    max-width: none;
                }
                
                #pedigreeModal .modal-content {
                    width: 100%;
                    height: 100vh;
                    margin: 0;
                    border: none;
                    border-radius: 0;
                    display: flex;
                    flex-direction: column;
                }
                
                #pedigreeModal .modal-header {
                    margin: 0;
                    padding: 0.75rem 1rem;
                    border: none;
                    flex-shrink: 0;
                }
                
                #pedigreeModal .modal-body {
                    width: 100%;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    overflow: hidden;
                }
                
                /* WIGVORM CONTAINER */
                .pedigree-container {
                    width: 100%;
                    height: 100%;
                    background: #f8f9fa;
                    overflow-x: auto;
                    overflow-y: auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                
                /* WIGVORM GRID - ALLES VANAF HET MIDDEN */
                .pedigree-grid {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    gap: 30px;
                    height: 100%;
                    min-width: min-content;
                }
                
                /* GENERATIE KOLOM - VERTICAL GECENTREERD */
                .generation-col {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    height: 100%;
                }
                
                /* GEN 0: 1 CARD (MIDDEN) */
                .generation-col.gen0 {
                    justify-content: center;
                }
                
                /* GEN 1: 2 CARDS */
                .generation-col.gen1 {
                    gap: 30px;
                }
                
                /* GEN 2: 4 CARDS */
                .generation-col.gen2 {
                    gap: 15px;
                }
                
                /* GEN 3: 8 CARDS - KLEINER */
                .generation-col.gen3 {
                    gap: 8px;
                }
                
                /* CARDS */
                .pedigree-card {
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    width: 200px;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                
                /* HOOGTES PER GENERATIE */
                .pedigree-card.gen0 {
                    height: 140px;
                }
                
                .pedigree-card.gen1 {
                    height: 130px;
                }
                
                .pedigree-card.gen2 {
                    height: 120px;
                }
                
                .pedigree-card.gen3 {
                    height: 80px; /* 60% van gen2 */
                    width: 190px;
                }
                
                .pedigree-card.main-dog {
                    border: 3px solid #0d6efd;
                    background: #f0f7ff;
                }
                
                .pedigree-card.male {
                    border-left: 5px solid #0d6efd;
                }
                
                .pedigree-card.female {
                    border-left: 5px solid #dc3545;
                }
                
                .pedigree-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                
                .card-header {
                    color: white;
                    padding: 8px 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 8px 8px 0 0;
                }
                
                .card-body {
                    padding: 10px 12px;
                    display: flex;
                    flex-direction: column;
                    height: calc(100% - 38px);
                }
                
                .pedigree-card.gen3 .card-header {
                    padding: 5px 8px;
                    font-size: 0.7rem;
                }
                
                .pedigree-card.gen3 .card-body {
                    padding: 6px 8px;
                }
                
                .dog-name {
                    font-weight: 600;
                    color: #0d6efd;
                    font-size: 0.9rem;
                    margin-bottom: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .pedigree-card.gen3 .dog-name {
                    font-size: 0.8rem;
                }
                
                .dog-kennel, .dog-pedigree {
                    font-size: 0.8rem;
                    color: #6c757d;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .pedigree-card.gen3 .dog-kennel,
                .pedigree-card.gen3 .dog-pedigree {
                    font-size: 0.7rem;
                }
                
                .click-hint {
                    margin-top: auto;
                    font-size: 0.75rem;
                    color: #6c757d;
                    text-align: center;
                    padding-top: 5px;
                    border-top: 1px dashed #dee2e6;
                }
                
                .pedigree-card.gen3 .click-hint {
                    font-size: 0.65rem;
                }
                
                .no-data {
                    color: #6c757d;
                    font-style: italic;
                    font-size: 0.9rem;
                }
                
                /* MOBIEL - ZELFDE LAYOUT, HORIZONTALE SCROLL */
                @media (max-width: 767px) {
                    .pedigree-container {
                        padding: 15px;
                        justify-content: flex-start;
                        align-items: flex-start;
                    }
                    
                    .pedigree-grid {
                        justify-content: flex-start;
                        gap: 20px;
                        padding-right: 15px;
                    }
                    
                    .generation-col {
                        height: auto;
                        min-height: 100%;
                    }
                    
                    /* GEEN WITTE BALK - VOLLEDIGE HOOGTE */
                    #pedigreeModal .modal-body {
                        overflow: hidden;
                    }
                    
                    .pedigree-container {
                        overflow-y: hidden; /* GEEN VERTICALE SCROLL */
                    }
                }
                
                /* KLEINE TELEFOONS */
                @media (max-width: 480px) {
                    .pedigree-card {
                        width: 180px;
                    }
                    
                    .pedigree-card.gen3 {
                        width: 170px;
                    }
                    
                    .pedigree-card.gen0 { height: 130px; }
                    .pedigree-card.gen1 { height: 120px; }
                    .pedigree-card.gen2 { height: 110px; }
                    .pedigree-card.gen3 { height: 75px; }
                    
                    .pedigree-grid {
                        gap: 15px;
                    }
                    
                    .generation-col.gen1 { gap: 25px; }
                    .generation-col.gen2 { gap: 12px; }
                    .generation-col.gen3 { gap: 6px; }
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('pedigreeModal');
        const printBtn = modal.querySelector('.btn-print');
        if (printBtn) {
            printBtn.addEventListener('click', () => window.print());
        }
    }
    
    renderPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        container.innerHTML = `
            <div class="pedigree-grid">
                <!-- GEN 0 - MIDDEN -->
                <div class="generation-col gen0">
                    ${this.getDogCardHTML(pedigreeTree.mainDog, this.t('mainDog'), true, 0)}
                </div>
                
                <!-- GEN 1 - OUDERS -->
                <div class="generation-col gen1">
                    ${this.getDogCardHTML(pedigreeTree.father, this.t('father'), false, 1)}
                    ${this.getDogCardHTML(pedigreeTree.mother, this.t('mother'), false, 1)}
                </div>
                
                <!-- GEN 2 - GROOTOUDERS -->
                <div class="generation-col gen2">
                    ${this.getDogCardHTML(pedigreeTree.paternalGrandfather, this.t('grandfather'), false, 2)}
                    ${this.getDogCardHTML(pedigreeTree.paternalGrandmother, this.t('grandmother'), false, 2)}
                    ${this.getDogCardHTML(pedigreeTree.maternalGrandfather, this.t('grandfather'), false, 2)}
                    ${this.getDogCardHTML(pedigreeTree.maternalGrandmother, this.t('grandmother'), false, 2)}
                </div>
                
                <!-- GEN 3 - OVERGROOTOUDERS -->
                <div class="generation-col gen3">
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmother'), false, 3)}
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCardHTML(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmother'), false, 3)}
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmother'), false, 3)}
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfather'), false, 3)}
                    ${this.getDogCardHTML(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmother'), false, 3)}
                </div>
            </div>
        `;
    }
}

// Helper methodes
StamboomManager.prototype.showError = function(message) {
    console.error('Error:', message);
    alert(message);
};