/**
 * Reu en Teef Combinatie Module - VERSIMPELDE VERSIE
 * Voor het maken van fokplannen met specifieke reu en teef
 * GEBRUIKT de bestaande StamboomManager voor stamboom visualisatie
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.selectedTeef = null;
        this.selectedReu = null;
        this.allHonden = [];
        this.hondenCache = new Map();
        
        // Stamboom Manager instance
        this.stamboomManager = null;
        
        // Vertalingen (verkorte versie)
        this.translations = {
            nl: {
                title: "Reu en Teef Combinatie",
                description: "Selecteer een specifieke reu en teef voor uw fokplan",
                mother: "Teef (Moeder)",
                selectMother: "Selecteer een teef...",
                father: "Reu (Vader)",
                selectFather: "Selecteer een reu...",
                searchPlaceholder: "Typ om te zoeken...",
                back: "Terug",
                showFuturePuppy: "Toon Toekomstige Pup Stamboom",
                loading: "Laden...",
                noDogFound: "Geen hond gevonden",
                genderTeef: "Teef",
                genderReu: "Reu",
                searchByName: "Zoek op naam of kennel",
                selectDogFirst: "Selecteer eerst een reu én een teef",
                futurePuppyName: "Toekomstige Pup",
                futurePuppyDescription: "Voorspelling van combinatie {reu} × {teef}",
                combinedParents: "Combinatie ouders"
            },
            en: {
                title: "Male and Female Combination",
                description: "Select a specific male and female for your breeding plan",
                mother: "Female (Mother)",
                selectMother: "Select a female...",
                father: "Male (Father)",
                selectFather: "Select a male...",
                searchPlaceholder: "Type to search...",
                back: "Back",
                showFuturePuppy: "Show Future Puppy Pedigree",
                loading: "Loading...",
                noDogFound: "No dog found",
                genderTeef: "Female",
                genderReu: "Male",
                searchByName: "Search by name or kennel",
                selectDogFirst: "Select both a male and a female first",
                futurePuppyName: "Future Puppy",
                futurePuppyDescription: "Prediction of combination {father} × {mother}",
                combinedParents: "Combination parents"
            },
            de: {
                title: "Rüde und Hündin Kombination",
                description: "Wählen Sie einen bestimmten Rüden und eine Hündin für Ihren Zuchtplan",
                mother: "Hündin (Mutter)",
                selectMother: "Wählen Sie eine Hündin...",
                father: "Rüde (Vater)",
                selectFather: "Wählen Sie einen Rüden...",
                searchPlaceholder: "Tippen Sie zum Suchen...",
                back: "Zurück",
                showFuturePuppy: "Zukünftigen Welpen-Stammbaum Zeigen",
                loading: "Laden...",
                noDogFound: "Kein Hund gefunden",
                genderTeef: "Hündin",
                genderReu: "Rüde",
                searchByName: "Suche nach Name oder Zwingername",
                selectDogFirst: "Wählen Sie zuerst einen Rüden und eine Hündin",
                futurePuppyName: "Zukünftiger Welpe",
                futurePuppyDescription: "Vorhersage der Kombination {father} × {mother}",
                combinedParents: "Kombination Eltern"
            }
        };
    }
    
    injectDependencies(db, auth, stamboomManager) {
        this.db = db;
        this.auth = auth;
        this.stamboomManager = stamboomManager;
    }
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }
    
    async loadContent() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Reset
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // Laad honden
        await this.loadAllHonden();
        
        content.innerHTML = `
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle"></i>
                <strong>${t('searchByName')}</strong><br>
                ${t('description')}
            </div>
            
            <h5 class="mb-4">
                <i class="bi bi-gender-male-female text-purple"></i> ${t('title')}
            </h5>
            
            <div class="row g-4">
                <!-- Teef selectie -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-female text-pink me-2"></i>${t('mother')}
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">${t('selectMother')}</label>
                                <input type="text" 
                                       class="form-control" 
                                       id="teefSearch" 
                                       placeholder="${t('searchPlaceholder')}"
                                       autocomplete="off">
                            </div>
                            <div id="teefSearchResults" class="mt-3">
                                <div class="text-center py-4 text-muted">
                                    <i class="bi bi-search display-6"></i>
                                    <p class="mt-2">${t('searchByName')}</p>
                                </div>
                            </div>
                            <div id="teefDetails" class="d-none"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Reu selectie -->
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-male text-blue me-2"></i>${t('father')}
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">${t('selectFather')}</label>
                                <input type="text" 
                                       class="form-control" 
                                       id="reuSearch" 
                                       placeholder="${t('searchPlaceholder')}"
                                       autocomplete="off">
                            </div>
                            <div id="reuSearchResults" class="mt-3">
                                <div class="text-center py-4 text-muted">
                                    <i class="bi bi-search display-6"></i>
                                    <p class="mt-2">${t('searchByName')}</p>
                                </div>
                            </div>
                            <div id="reuDetails" class="d-none"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Toekomstige Pup Samenvatting -->
            <div class="card mt-4 d-none" id="futurePuppySummary">
                <div class="card-header bg-success text-white">
                    <h6 class="mb-0">
                        <i class="bi bi-stars me-2"></i>Toekomstige Pup
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5>${t('futurePuppyName')}</h5>
                            <p class="mb-2" id="futurePuppyDescription">
                                ${t('futurePuppyDescription', { reu: '?', teef: '?' })}
                            </p>
                        </div>
                        <div class="col-md-4 text-end">
                            <button type="button" class="btn btn-success btn-lg" id="showFuturePedigreeBtn">
                                <i class="bi bi-diagram-3 me-2"></i> ${t('showFuturePuppy')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
        `;
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => this.goBack());
        
        // Setup search
        this.setupSearch('teefSearch', 'teefSearchResults', 'teven', (hond) => this.selectTeef(hond));
        this.setupSearch('reuSearch', 'reuSearchResults', 'reuen', (hond) => this.selectReu(hond));
        
        // Groene knop event
        setTimeout(() => {
            const btn = document.getElementById('showFuturePedigreeBtn');
            if (btn) {
                btn.addEventListener('click', () => this.showFuturePuppyPedigree());
            }
        }, 100);
    }
    
    async loadAllHonden() {
        try {
            if (this.db && typeof this.db.getHonden === 'function') {
                this.allHonden = await this.db.getHonden();
                console.log(`Geladen: ${this.allHonden.length} honden`);
            }
        } catch (error) {
            console.error('Fout bij laden honden:', error);
            this.allHonden = [];
        }
    }
    
    setupSearch(inputId, resultsId, geslacht, onSelect) {
        const input = document.getElementById(inputId);
        const results = document.getElementById(resultsId);
        
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            
            if (!term) {
                results.innerHTML = `
                    <div class="text-center py-4 text-muted">
                        <i class="bi bi-search display-6"></i>
                        <p class="mt-2">${this.t('searchByName')}</p>
                    </div>
                `;
                return;
            }
            
            // Filter honden
            const filtered = this.allHonden.filter(hond => {
                if (geslacht === 'teven' && hond.geslacht !== 'teven') return false;
                if (geslacht === 'reuen' && hond.geslacht !== 'reuen') return false;
                
                const naam = (hond.naam || '').toLowerCase();
                const kennel = (hond.kennelnaam || '').toLowerCase();
                const stamboom = (hond.stamboomnr || '').toLowerCase();
                
                return naam.includes(term) || kennel.includes(term) || stamboom.includes(term);
            });
            
            // Toon resultaten
            if (filtered.length === 0) {
                results.innerHTML = `
                    <div class="text-center py-4 text-muted">
                        <i class="bi bi-search-x display-6"></i>
                        <p class="mt-2">${this.t('noDogFound')}</p>
                    </div>
                `;
                return;
            }
            
            let html = '<div class="list-group">';
            filtered.forEach(hond => {
                html += `
                    <a href="#" class="list-group-item list-group-item-action" data-id="${hond.id}">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${hond.naam || 'Onbekend'}</h6>
                            <small>${hond.geslacht === 'reuen' ? this.t('genderReu') : this.t('genderTeef')}</small>
                        </div>
                        <p class="mb-1">
                            ${hond.kennelnaam ? `<small class="text-muted">${hond.kennelnaam}</small><br>` : ''}
                            ${hond.stamboomnr ? `<small>${hond.stamboomnr}</small>` : ''}
                        </p>
                    </a>
                `;
            });
            html += '</div>';
            
            results.innerHTML = html;
            
            // Click events
            results.querySelectorAll('a').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = parseInt(item.getAttribute('data-id'));
                    const hond = filtered.find(h => h.id === id);
                    if (hond) {
                        input.value = hond.naam || '';
                        onSelect(hond);
                    }
                });
            });
        });
    }
    
    selectTeef(hond) {
        this.selectedTeef = hond;
        this.showSelectedDog('teefDetails', 'teefSearchResults', hond, 'teef');
        this.updateFuturePuppySummary();
    }
    
    selectReu(hond) {
        this.selectedReu = hond;
        this.showSelectedDog('reuDetails', 'reuSearchResults', hond, 'reu');
        this.updateFuturePuppySummary();
    }
    
    showSelectedDog(detailsId, resultsId, hond, type) {
        const details = document.getElementById(detailsId);
        const results = document.getElementById(resultsId);
        
        results.style.display = 'none';
        details.classList.remove('d-none');
        
        details.innerHTML = `
            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">${hond.naam || 'Onbekend'}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${hond.kennelnaam || ''}</h6>
                    <p class="card-text">
                        <strong>Stamboomnr:</strong> ${hond.stamboomnr || 'Onbekend'}<br>
                        <strong>Ras:</strong> ${hond.ras || 'Onbekend'}<br>
                        <strong>Geslacht:</strong> ${type === 'teef' ? this.t('genderTeef') : this.t('genderReu')}<br>
                        ${hond.geboortedatum ? `<strong>Geboortedatum:</strong> ${new Date(hond.geboortedatum).toLocaleDateString()}<br>` : ''}
                        ${hond.vachtkleur ? `<strong>Vachtkleur:</strong> ${hond.vachtkleur}` : ''}
                    </p>
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.reuTeefCombinatie.clearSelection('${detailsId}', '${resultsId}')">
                        <i class="bi bi-x-circle me-1"></i> Wissen
                    </button>
                </div>
            </div>
        `;
    }
    
    clearSelection(detailsId, resultsId) {
        const details = document.getElementById(detailsId);
        const results = document.getElementById(resultsId);
        const inputId = detailsId.replace('Details', 'Search');
        const input = document.getElementById(inputId);
        
        if (detailsId === 'teefDetails') this.selectedTeef = null;
        if (detailsId === 'reuDetails') this.selectedReu = null;
        
        if (input) input.value = '';
        details.classList.add('d-none');
        details.innerHTML = '';
        
        results.style.display = 'block';
        results.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-search display-6"></i>
                <p class="mt-2">${this.t('searchByName')}</p>
            </div>
        `;
        
        this.updateFuturePuppySummary();
    }
    
    updateFuturePuppySummary() {
        const summary = document.getElementById('futurePuppySummary');
        const btn = document.getElementById('showFuturePedigreeBtn');
        
        if (this.selectedTeef && this.selectedReu) {
            summary.classList.remove('d-none');
            if (btn) btn.disabled = false;
            
            document.getElementById('futurePuppyDescription').textContent = 
                this.t('futurePuppyDescription', { 
                    reu: this.selectedReu.naam || '?', 
                    teef: this.selectedTeef.naam || '?' 
                });
        } else {
            summary.classList.add('d-none');
            if (btn) btn.disabled = true;
        }
    }
    
    goBack() {
        const modal = document.getElementById('breedingPlanModal');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
        }
    }
    
    async showFuturePuppyPedigree() {
        if (!this.selectedTeef || !this.selectedReu) {
            alert(this.t('selectDogFirst'));
            return;
        }
        
        // Zorg dat StamboomManager bestaat
        if (!this.stamboomManager && this.db) {
            this.stamboomManager = new StamboomManager(this.db, this.currentLang);
            await this.stamboomManager.initialize();
        }
        
        if (!this.stamboomManager) {
            alert('StamboomManager niet beschikbaar');
            return;
        }
        
        // Maak virtuele pup
        const futurePuppy = {
            id: -999, // Uniek ID voor toekomstige pup
            naam: this.t('futurePuppyName'),
            geslacht: 'onbekend',
            vaderId: this.selectedReu.id,
            moederId: this.selectedTeef.id,
            vader: this.selectedReu.naam,
            moeder: this.selectedTeef.naam,
            kennelnaam: this.t('combinedParents'),
            ras: this.selectedReu.ras || this.selectedTeef.ras || 'Mix',
            stamboomnr: 'VOORSPELD',
            geboortedatum: new Date().toISOString().split('T')[0]
        };
        
        // DIRECT de StamboomManager gebruiken om de stamboom te tonen
        // Dit zorgt voor de juiste layout en klikbare cards
        await this.stamboomManager.showPedigree(futurePuppy);
    }
}

// Maak beschikbaar voor inline onclick
window.reuTeefCombinatie = null;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}