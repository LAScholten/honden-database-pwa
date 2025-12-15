/**
 * Hond Management Module
 * Beheert toevoegen, zoeken en bewerken van honden
 */

class DogManager extends BaseModule {
    constructor() {
        super();
    }
    
    getModalHTML() {
        return `
            <div class="modal fade" id="addDogModal" tabindex="-1" aria-labelledby="addDogModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="addDogModalLabel">
                                <i class="bi bi-plus-circle"></i> Nieuwe Hond Toevoegen
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addDogForm">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="hondNaam" class="form-label">Naam *</label>
                                            <input type="text" class="form-control" id="hondNaam" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="hondRas" class="form-label">Ras *</label>
                                            <input type="text" class="form-control" id="hondRas" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="hondChipnummer" class="form-label">Chipnummer *</label>
                                            <input type="text" class="form-control" id="hondChipnummer" required>
                                            <div class="form-text">Uniek identificatienummer</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="hondGeboortedatum" class="form-label">Geboortedatum</label>
                                            <input type="date" class="form-control" id="hondGeboortedatum">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="hondGeslacht" class="form-label">Geslacht</label>
                                            <select class="form-select" id="hondGeslacht">
                                                <option value="">Kies...</option>
                                                <option value="reuen">Reu</option>
                                                <option value="teven">Teef</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="hondKleur" class="form-label">Kleur</label>
                                            <input type="text" class="form-control" id="hondKleur">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="hondGewicht" class="form-label">Gewicht (kg)</label>
                                            <input type="number" step="0.1" class="form-control" id="hondGewicht">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="hondEigenaar" class="form-label">Eigenaar</label>
                                    <input type="text" class="form-control" id="hondEigenaar">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="hondOpmerkingen" class="form-label">Opmerkingen</label>
                                    <textarea class="form-control" id="hondOpmerkingen" rows="3"></textarea>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i>
                                    Velden met een * zijn verplicht. Het chipnummer moet uniek zijn.
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuleren</button>
                            <button type="button" class="btn btn-primary" id="saveDogBtn">Hond Opslaan</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getSearchModalHTML() {
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search"></i> Hond Zoeken
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <label for="searchNaam" class="form-label">Naam</label>
                                            <input type="text" class="form-control" id="searchNaam" placeholder="Voer naam in...">
                                        </div>
                                        <div class="col-md-4">
                                            <label for="searchRas" class="form-label">Ras</label>
                                            <input type="text" class="form-control" id="searchRas" placeholder="Voer ras in...">
                                        </div>
                                        <div class="col-md-4">
                                            <label for="searchChipnummer" class="form-label">Chipnummer</label>
                                            <input type="text" class="form-control" id="searchChipnummer" placeholder="Voer chipnummer in...">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="searchEigenaar" class="form-label">Eigenaar</label>
                                            <input type="text" class="form-control" id="searchEigenaar" placeholder="Voer eigenaar in...">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="searchGeslacht" class="form-label">Geslacht</label>
                                            <select class="form-select" id="searchGeslacht">
                                                <option value="">Alle geslachten</option>
                                                <option value="reuen">Reu</option>
                                                <option value="teven">Teef</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <button class="btn btn-info" id="searchBtn">
                                            <i class="bi bi-search"></i> Zoeken
                                        </button>
                                        <button class="btn btn-secondary" id="resetSearchBtn">
                                            <i class="bi bi-arrow-clockwise"></i> Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="searchResultsContainer">
                                <div class="text-center py-5">
                                    <i class="bi bi-search display-1 text-muted"></i>
                                    <p class="mt-3 text-muted">Voer zoekcriteria in en klik op zoeken</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveNewDog();
            });
        }
    }
    
    setupSearchEvents() {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }
        
        const resetBtn = document.getElementById('resetSearchBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSearchForm();
            });
        }
    }
    
    async saveNewDog() {
        if (!this.auth.isAdmin()) {
            this.showError('Alleen administrators mogen nieuwe honden toevoegen');
            return;
        }
        
        const hond = {
            naam: document.getElementById('hondNaam').value.trim(),
            ras: document.getElementById('hondRas').value.trim(),
            chipnummer: document.getElementById('hondChipnummer').value.trim(),
            geboortedatum: document.getElementById('hondGeboortedatum').value,
            geslacht: document.getElementById('hondGeslacht').value,
            kleur: document.getElementById('hondKleur').value.trim(),
            gewicht: document.getElementById('hondGewicht').value ? parseFloat(document.getElementById('hondGewicht').value) : null,
            eigenaar: document.getElementById('hondEigenaar').value.trim(),
            opmerkingen: document.getElementById('hondOpmerkingen').value.trim()
        };
        
        if (!hond.naam || !hond.ras || !hond.chipnummer) {
            this.showError('Naam, ras en chipnummer zijn verplichte velden');
            return;
        }
        
        this.showProgress('Hond opslaan...');
        
        try {
            await this.db.voegHondToe(hond);
            this.hideProgress();
            this.showSuccess(`Hond "${hond.naam}" succesvol toegevoegd!`);
            
            // Formulier resetten
            document.getElementById('addDogForm').reset();
            
            // Modal sluiten na succes
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addDogModal'));
                if (modal) modal.hide();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Fout bij toevoegen hond: ${error.message}`);
        }
    }
    
    async performSearch() {
        const criteria = {
            naam: document.getElementById('searchNaam').value.trim(),
            ras: document.getElementById('searchRas').value.trim(),
            chipnummer: document.getElementById('searchChipnummer').value.trim(),
            eigenaar: document.getElementById('searchEigenaar').value.trim(),
            geslacht: document.getElementById('searchGeslacht').value
        };
        
        // Verwijder lege criteria
        Object.keys(criteria).forEach(key => {
            if (!criteria[key]) delete criteria[key];
        });
        
        if (Object.keys(criteria).length === 0) {
            this.showError('Voer minstens één zoekcriterium in');
            return;
        }
        
        this.showProgress('Zoeken...');
        
        try {
            const results = await this.db.zoekHonden(criteria);
            this.hideProgress();
            this.displaySearchResults(results);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Zoeken mislukt: ${error.message}`);
        }
    }
    
    resetSearchForm() {
        document.getElementById('searchNaam').value = '';
        document.getElementById('searchRas').value = '';
        document.getElementById('searchChipnummer').value = '';
        document.getElementById('searchEigenaar').value = '';
        document.getElementById('searchGeslacht').value = '';
        
        const resultsContainer = document.getElementById('searchResultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <p class="mt-3 text-muted">Voer zoekcriteria in en klik op zoeken</p>
                </div>
            `;
        }
        
        this.showSuccess('Zoekformulier gereset');
    }
    
    displaySearchResults(results) {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <p class="mt-3 text-muted">Geen honden gevonden met de opgegeven criteria</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">Zoekresultaten (${results.length} gevonden)</h6>
                        <button class="btn btn-sm btn-outline-info" id="exportSearchResultsBtn">
                            <i class="bi bi-download"></i> Exporteer
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Naam</th>
                                    <th>Ras</th>
                                    <th>Chipnummer</th>
                                    <th>Geslacht</th>
                                    <th>Geboortedatum</th>
                                    <th>Eigenaar</th>
                                    <th>Acties</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        results.forEach(hond => {
            html += `
                <tr>
                    <td><strong>${hond.naam}</strong></td>
                    <td>${hond.ras || '-'}</td>
                    <td><code>${hond.chipnummer || '-'}</code></td>
                    <td>${hond.geslacht === 'reuen' ? 'Reu' : hond.geslacht === 'teven' ? 'Teef' : '-'}</td>
                    <td>${hond.geboortedatum ? new Date(hond.geboortedatum).toLocaleDateString('nl-NL') : '-'}</td>
                    <td>${hond.eigenaar || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-dog-btn" data-id="${hond.id}">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning edit-dog-btn" data-id="${hond.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Voeg event listeners toe voor knoppen
        document.querySelectorAll('.view-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.view-dog-btn').dataset.id;
                this.viewDogDetails(hondId);
            });
        });
        
        document.querySelectorAll('.edit-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.edit-dog-btn').dataset.id;
                this.editDog(hondId);
            });
        });
        
        const exportBtn = document.getElementById('exportSearchResultsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportSearchResults(results);
            });
        }
    }
    
    async viewDogDetails(hondId) {
        try {
            const honden = await this.db.getHonden();
            const hond = honden.find(h => h.id === parseInt(hondId));
            
            if (!hond) {
                this.showError('Hond niet gevonden');
                return;
            }
            
            const html = `
                <div class="modal fade" id="viewDogModal" tabindex="-1" aria-labelledby="viewDogModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-info text-white">
                                <h5 class="modal-title" id="viewDogModalLabel">
                                    <i class="bi bi-eye"></i> ${hond.naam} - Details
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="border-bottom pb-2">Basis Informatie</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th style="width: 40%">Naam:</th>
                                                <td>${hond.naam}</td>
                                            </tr>
                                            <tr>
                                                <th>Ras:</th>
                                                <td>${hond.ras || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>Chipnummer:</th>
                                                <td><code>${hond.chipnummer || '-'}</code></td>
                                            </tr>
                                            <tr>
                                                <th>Geslacht:</th>
                                                <td>${hond.geslacht === 'reuen' ? 'Reu' : hond.geslacht === 'teven' ? 'Teef' : '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>Geboortedatum:</th>
                                                <td>${hond.geboortedatum ? new Date(hond.geboortedatum).toLocaleDateString('nl-NL') : '-'}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="border-bottom pb-2">Extra Informatie</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th style="width: 40%">Kleur:</th>
                                                <td>${hond.kleur || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>Gewicht:</th>
                                                <td>${hond.gewicht ? hond.gewicht + ' kg' : '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>Eigenaar:</th>
                                                <td>${hond.eigenaar || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>Aangemaakt:</th>
                                                <td>${new Date(hond.createdAt).toLocaleString('nl-NL')}</td>
                                            </tr>
                                            <tr>
                                                <th>Laatst bijgewerkt:</th>
                                                <td>${new Date(hond.updatedAt).toLocaleString('nl-NL')}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                
                                ${hond.opmerkingen ? `
                                <div class="mt-4">
                                    <h6 class="border-bottom pb-2">Opmerkingen</h6>
                                    <div class="bg-light p-3 rounded">
                                        ${hond.opmerkingen}
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Toon modal
            const container = document.getElementById('modalsContainer');
            container.insertAdjacentHTML('beforeend', html);
            
            const modalElement = document.getElementById('viewDogModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Cleanup na sluiten
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
        } catch (error) {
            this.showError(`Fout bij laden hond details: ${error.message}`);
        }
    }
    
    async editDog(hondId) {
        if (!this.auth.isAdmin()) {
            this.showError('Alleen administrators mogen honden bewerken');
            return;
        }
        
        try {
            const honden = await this.db.getHonden();
            const hond = honden.find(h => h.id === parseInt(hondId));
            
            if (!hond) {
                this.showError('Hond niet gevonden');
                return;
            }
            
            // Toon bewerkingsformulier (vergelijkbaar met toevoegen maar met bestaande waarden)
            // Dit kan worden uitgebreid naar een volledig bewerkingsformulier
            this.showError('Bewerken functie wordt binnenkort geïmplementeerd');
            
        } catch (error) {
            this.showError(`Fout bij bewerken hond: ${error.message}`);
        }
    }
    
    async exportSearchResults(results) {
        if (!results || results.length === 0) {
            this.showError('Geen resultaten om te exporteren');
            return;
        }
        
        try {
            const jsonString = JSON.stringify(results, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `zoekresultaten-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.showSuccess('Zoekresultaten geëxporteerd!');
            
        } catch (error) {
            this.showError(`Export mislukt: ${error.message}`);
        }
    }
}