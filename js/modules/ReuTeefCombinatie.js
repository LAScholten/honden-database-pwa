/**
 * Reu en Teef Combinatie Module
 * Maakt gebruik van de bestaande StamboomManager
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.selectedTeef = null;
        this.selectedReu = null;
        this.allHonden = [];
        
        // Stamboom Manager instance - WORDT VAN BUITENAF INJECTEERD
        this.stamboomManager = null;
        
        // Vertalingen
        this.translations = {
            nl: {
                title: "Reu en Teef Combinatie",
                description: "Selecteer een reu en teef voor fokplan",
                mother: "Teef (Moeder)",
                selectMother: "Selecteer teef...",
                father: "Reu (Vader)",
                selectFather: "Selecteer reu...",
                searchPlaceholder: "Zoek op naam...",
                back: "Terug",
                showFuturePuppy: "Toon Toekomstige Pup",
                futurePuppyName: "Toekomstige Pup",
                futurePuppyDescription: "Combinatie {reu} × {teef}",
                combinedParents: "Combinatie ouders",
                searchByName: "Zoek op naam of kennel"
            },
            en: {
                title: "Male and Female Combination",
                description: "Select male and female for breeding plan",
                mother: "Female (Mother)",
                selectMother: "Select female...",
                father: "Male (Father)",
                selectFather: "Select male...",
                searchPlaceholder: "Search by name...",
                back: "Back",
                showFuturePuppy: "Show Future Puppy",
                futurePuppyName: "Future Puppy",
                futurePuppyDescription: "Combination {father} × {mother}",
                combinedParents: "Combination parents",
                searchByName: "Search by name or kennel"
            },
            de: {
                title: "Rüde und Hündin Kombination",
                description: "Wählen Sie Rüde und Hündin für Zuchtplan",
                mother: "Hündin (Mutter)",
                selectMother: "Wählen Sie Hündin...",
                father: "Rüde (Vater)",
                selectFather: "Wählen Sie Rüden...",
                searchPlaceholder: "Suche nach Name...",
                back: "Zurück",
                showFuturePuppy: "Zeige Zukünftigen Welpen",
                futurePuppyName: "Zukünftiger Welpe",
                futurePuppyDescription: "Kombination {father} × {mother}",
                combinedParents: "Kombination Eltern",
                searchByName: "Suche nach Name oder Zwingername"
            }
        };
    }
    
    injectDependencies(db, stamboomManager) {
        this.db = db;
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
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Reset
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // Laad honden
        await this.loadAllHonden();
        
        content.innerHTML = `
            <div class="alert alert-info mb-3">
                <i class="bi bi-info-circle"></i> ${this.t('description')}
            </div>
            
            <h5 class="mb-3"><i class="bi bi-gender-male-female"></i> ${this.t('title')}</h5>
            
            <div class="row g-3">
                <!-- Teef -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-light">
                            <h6 class="mb-0"><i class="bi bi-gender-female text-pink"></i> ${this.t('mother')}</h6>
                        </div>
                        <div class="card-body">
                            <input type="text" class="form-control mb-2" id="teefSearch" placeholder="${this.t('searchPlaceholder')}">
                            <div id="teefSearchResults" class="search-results"></div>
                            <div id="teefDetails" class="d-none"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Reu -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-light">
                            <h6 class="mb-0"><i class="bi bi-gender-male text-blue"></i> ${this.t('father')}</h6>
                        </div>
                        <div class="card-body">
                            <input type="text" class="form-control mb-2" id="reuSearch" placeholder="${this.t('searchPlaceholder')}">
                            <div id="reuSearchResults" class="search-results"></div>
                            <div id="reuDetails" class="d-none"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Toekomstige Pup -->
            <div class="card mt-3 d-none" id="futurePuppySummary">
                <div class="card-header bg-success text-white">
                    <h6 class="mb-0"><i class="bi bi-stars"></i> Toekomstige Pup</h6>
                </div>
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5>${this.t('futurePuppyName')}</h5>
                            <p class="mb-0" id="futurePuppyDescription"></p>
                        </div>
                        <div class="col-md-4 text-end">
                            <button type="button" class="btn btn-success" id="showFuturePedigreeBtn">
                                <i class="bi bi-diagram-3"></i> ${this.t('showFuturePuppy')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left"></i> ${this.t('back')}
            </button>
        `;
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => this.goBack());
        
        // Setup search
        this.setupSearch('teefSearch', 'teefSearchResults', 'teven', (hond) => this.selectTeef(hond));
        this.setupSearch('reuSearch', 'reuSearchResults', 'reuen', (hond) => this.selectReu(hond));
        
        // Groene knop event
        document.addEventListener('click', (e) => {
            if (e.target.id === 'showFuturePedigreeBtn') {
                this.showFuturePuppyPedigree();
            }
        });
    }
    
    async loadAllHonden() {
        try {
            this.allHonden = await this.db.getHonden();
        } catch (error) {
            console.error('Fout bij laden honden:', error);
            this.allHonden = [];
        }
    }
    
    setupSearch(inputId, resultsId, geslacht, onSelect) {
        const input = document.getElementById(inputId);
        const results = document.getElementById(resultsId);
        
        input.addEventListener('input', (e) => {
            const term = e.target.value.trim();
            
            if (!term) {
                results.innerHTML = `<div class="text-muted text-center p-3">${this.t('searchByName')}</div>`;
                return;
            }
            
            const filtered = this.allHonden.filter(hond => {
                if (geslacht === 'teven' && hond.geslacht !== 'teven') return false;
                if (geslacht === 'reuen' && hond.geslacht !== 'reuen') return false;
                
                return (hond.naam || '').toLowerCase().includes(term.toLowerCase()) ||
                       (hond.kennelnaam || '').toLowerCase().includes(term.toLowerCase()) ||
                       (hond.stamboomnr || '').toLowerCase().includes(term.toLowerCase());
            });
            
            if (filtered.length === 0) {
                results.innerHTML = `<div class="text-muted text-center p-3">Geen resultaten</div>`;
                return;
            }
            
            let html = '<div class="list-group">';
            filtered.forEach(hond => {
                html += `
                    <a href="#" class="list-group-item list-group-item-action" data-id="${hond.id}">
                        <strong>${hond.naam || 'Onbekend'}</strong>
                        ${hond.kennelnaam ? `<br><small class="text-muted">${hond.kennelnaam}</small>` : ''}
                        ${hond.stamboomnr ? `<br><small>${hond.stamboomnr}</small>` : ''}
                    </a>
                `;
            });
            html += '</div>';
            
            results.innerHTML = html;
            
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
        
        // Initiele weergave
        results.innerHTML = `<div class="text-muted text-center p-3">${this.t('searchByName')}</div>`;
    }
    
    selectTeef(hond) {
        this.selectedTeef = hond;
        this.showSelectedDog('teefDetails', 'teefSearchResults', hond);
        this.updateFuturePuppySummary();
    }
    
    selectReu(hond) {
        this.selectedReu = hond;
        this.showSelectedDog('reuDetails', 'reuSearchResults', hond);
        this.updateFuturePuppySummary();
    }
    
    showSelectedDog(detailsId, resultsId, hond) {
        const details = document.getElementById(detailsId);
        const results = document.getElementById(resultsId);
        
        results.style.display = 'none';
        details.classList.remove('d-none');
        
        details.innerHTML = `
            <div class="card mt-2">
                <div class="card-body p-3">
                    <h6 class="card-title mb-1">${hond.naam || 'Onbekend'}</h6>
                    <p class="card-text small mb-1">
                        ${hond.kennelnaam ? `<span class="text-muted">${hond.kennelnaam}</span><br>` : ''}
                        ${hond.stamboomnr ? `Stamboom: ${hond.stamboomnr}<br>` : ''}
                        ${hond.ras ? `Ras: ${hond.ras}<br>` : ''}
                        ${hond.geboortedatum ? `Geboren: ${new Date(hond.geboortedatum).toLocaleDateString()}` : ''}
                    </p>
                    <button class="btn btn-sm btn-outline-secondary mt-1" onclick="window.reuTeefCombinatie.clearSelection('${detailsId}', '${resultsId}')">
                        <i class="bi bi-x"></i> Wis
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
        results.innerHTML = `<div class="text-muted text-center p-3">${this.t('searchByName')}</div>`;
        
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
            alert('Selecteer eerst een reu en een teef');
            return;
        }
        
        // CONTROLEER OF STAMBOOMMANAGER BESCHIKBAAR IS
        if (!this.stamboomManager) {
            console.error('StamboomManager is niet geïnjecteerd!');
            alert('StamboomManager niet beschikbaar');
            return;
        }
        
        console.log('StamboomManager beschikbaar:', this.stamboomManager);
        
        // Maak virtuele pup met ALLE benodigde velden
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
            geboortedatum: new Date().toISOString().split('T')[0],
            vachtkleur: '',
            land: '',
            postcode: '',
            heupdysplasie: '',
            elleboogdysplasie: '',
            patella: '',
            ogen: '',
            ogenVerklaring: '',
            dandyWalker: '',
            schildklier: '',
            schildklierVerklaring: '',
            opmerkingen: ''
        };
        
        console.log('Toekomstige pup gemaakt:', futurePuppy);
        console.log('Geselecteerde reu:', this.selectedReu);
        console.log('Geselecteerde teef:', this.selectedTeef);
        
        // DIRECT de StamboomManager gebruiken - dit is de kern
        try {
            await this.stamboomManager.showPedigree(futurePuppy);
            console.log('Stamboom getoond via StamboomManager');
        } catch (error) {
            console.error('Fout bij tonen stamboom:', error);
            alert('Fout bij tonen stamboom: ' + error.message);
        }
    }
}

// Maak beschikbaar voor inline onclick
window.reuTeefCombinatie = new ReuTeefCombinatie();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}