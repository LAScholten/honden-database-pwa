/**
 * Fok Planning Module
 * Beheert fokplannen en nest planning
 */

class BreedingManager extends BaseModule {
    constructor() {
        super();
        this.breedingPlans = [];
    }
    
    getModalHTML() {
        return `
            <div class="modal fade" id="breedingPlanModal" tabindex="-1" aria-labelledby="breedingPlanModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-purple text-white">
                            <h5 class="modal-title" id="breedingPlanModalLabel">
                                <i class="bi bi-calendar-heart"></i> Fok Planning
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-4">
                                <i class="bi bi-info-circle"></i>
                                Maak en beheer fokplannen voor uw honden. Plan dekkingen, nesten en geboortes.
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header bg-purple text-white">
                                            <h6 class="mb-0"><i class="bi bi-plus-circle"></i> Nieuw Fokplan</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row g-3">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="breedingMother" class="form-label">Moeder *</label>
                                                        <select class="form-select" id="breedingMother" required>
                                                            <option value="">Selecteer teef...</option>
                                                            <!-- Teven opties worden hier ingeladen -->
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="breedingFather" class="form-label">Vader *</label>
                                                        <select class="form-select" id="breedingFather" required>
                                                            <option value="">Selecteer reu...</option>
                                                            <!-- Reuen opties worden hier ingeladen -->
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="breedingDate" class="form-label">Geboortedatum verwacht</label>
                                                        <input type="date" class="form-control" id="breedingDate">
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="breedingLitterSize" class="form-label">Verwachte nestgrootte</label>
                                                        <input type="number" class="form-control" id="breedingLitterSize" min="1" max="20">
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="mb-3">
                                                        <label for="breedingNotes" class="form-label">Opmerkingen</label>
                                                        <textarea class="form-control" id="breedingNotes" rows="2" placeholder="Extra notities over het fokplan..."></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <button class="btn btn-purple w-100" id="saveBreedingPlanBtn">
                                                <i class="bi bi-save"></i> Fokplan Opslaan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-calendar-check"></i> Actieve Fokplannen</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="text-center">
                                                <div class="display-4 text-purple mb-2" id="activeBreedingPlans">0</div>
                                                <div class="text-muted">Actieve plannen</div>
                                            </div>
                                            <hr>
                                            <div class="small">
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span>Volgende geboorte:</span>
                                                    <span id="nextBreedingDate">Geen</span>
                                                </div>
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span>Totaal nesten dit jaar:</span>
                                                    <span id="totalLittersYear">0</span>
                                                </div>
                                                <div class="d-flex justify-content-between">
                                                    <span>Succesratio:</span>
                                                    <span id="breedingSuccessRate">0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="bi bi-list-check"></i> Fokplan Overzicht</h6>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Moeder</th>
                                                    <th>Vader</th>
                                                    <th>Datum</th>
                                                    <th>Status</th>
                                                    <th>Nestgrootte</th>
                                                    <th>Acties</th>
                                                </tr>
                                            </thead>
                                            <tbody id="breedingPlansTable">
                                                <tr>
                                                    <td colspan="6" class="text-center py-4">
                                                        <i class="bi bi-calendar-x text-muted"></i>
                                                        <p class="mt-2 text-muted">Nog geen fokplannen aangemaakt</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
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
        const saveBtn = document.getElementById('saveBreedingPlanBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveBreedingPlan();
            });
        }
    }
    
    async loadBreedingData() {
        try {
            // Laad honden voor dropdowns
            const honden = await this.db.getHonden();
            const motherSelect = document.getElementById('breedingMother');
            const fatherSelect = document.getElementById('breedingFather');
            
            if (motherSelect) {
                motherSelect.innerHTML = '<option value="">Selecteer teef...</option>';
                honden.filter(h => h.geslacht === 'teven').forEach(hond => {
                    const option = document.createElement('option');
                    option.value = hond.id;
                    option.textContent = `${hond.naam} (${hond.ras})`;
                    motherSelect.appendChild(option);
                });
            }
            
            if (fatherSelect) {
                fatherSelect.innerHTML = '<option value="">Selecteer reu...</option>';
                honden.filter(h => h.geslacht === 'reuen').forEach(hond => {
                    const option = document.createElement('option');
                    option.value = hond.id;
                    option.textContent = `${hond.naam} (${hond.ras})`;
                    fatherSelect.appendChild(option);
                });
            }
            
            // Laad bestaande fokplannen
            await this.loadBreedingPlans();
            
        } catch (error) {
            console.error('Fout bij laden fok data:', error);
        }
    }
    
    async loadBreedingPlans() {
        try {
            // Laad fokplannen uit localStorage (tijdelijke oplossing)
            const savedPlans = localStorage.getItem('breedingPlans');
            this.breedingPlans = savedPlans ? JSON.parse(savedPlans) : [];
            
            // Update statistieken
            await this.updateBreedingStats();
            
            // Toon overzicht
            this.displayBreedingPlans();
            
        } catch (error) {
            console.error('Fout bij laden fokplannen:', error);
        }
    }
    
    async updateBreedingStats() {
        const activePlansElement = document.getElementById('activeBreedingPlans');
        const nextBreedingDateElement = document.getElementById('nextBreedingDate');
        const totalLittersYearElement = document.getElementById('totalLittersYear');
        const breedingSuccessRateElement = document.getElementById('breedingSuccessRate');
        
        if (!this.breedingPlans || this.breedingPlans.length === 0) {
            if (activePlansElement) activePlansElement.textContent = '0';
            if (nextBreedingDateElement) nextBreedingDateElement.textContent = 'Geen';
            if (totalLittersYearElement) totalLittersYearElement.textContent = '0';
            if (breedingSuccessRateElement) breedingSuccessRateElement.textContent = '0%';
            return;
        }
        
        // Bereken statistieken
        const currentYear = new Date().getFullYear();
        const currentDate = new Date();
        
        // Actieve plannen (toekomstige of lopende)
        const activePlans = this.breedingPlans.filter(plan => {
            if (!plan.expectedDate) return false;
            const planDate = new Date(plan.expectedDate);
            return planDate >= currentDate || plan.status === 'in-progress';
        });
        
        // Volgende geboortedatum
        let nextDate = null;
        this.breedingPlans.forEach(plan => {
            if (plan.expectedDate && plan.status === 'planned') {
                const planDate = new Date(plan.expectedDate);
                if (planDate >= currentDate && (!nextDate || planDate < nextDate)) {
                    nextDate = planDate;
                }
            }
        });
        
        // Nesten dit jaar
        const littersThisYear = this.breedingPlans.filter(plan => {
            if (!plan.completedDate) return false;
            const completedDate = new Date(plan.completedDate);
            return completedDate.getFullYear() === currentYear;
        }).length;
        
        // Succesratio (afgeronde plannen vs geannuleerd)
        const completedPlans = this.breedingPlans.filter(p => p.status === 'completed');
        const cancelledPlans = this.breedingPlans.filter(p => p.status === 'cancelled');
        const totalEnded = completedPlans.length + cancelledPlans.length;
        const successRate = totalEnded > 0 ? Math.round((completedPlans.length / totalEnded) * 100) : 0;
        
        // Update UI
        if (activePlansElement) activePlansElement.textContent = activePlans.length;
        if (nextBreedingDateElement) {
            nextBreedingDateElement.textContent = nextDate ? 
                nextDate.toLocaleDateString('nl-NL') : 'Geen';
        }
        if (totalLittersYearElement) totalLittersYearElement.textContent = littersThisYear;
        if (breedingSuccessRateElement) breedingSuccessRateElement.textContent = `${successRate}%`;
    }
    
    async saveBreedingPlan() {
        const motherId = document.getElementById('breedingMother').value;
        const fatherId = document.getElementById('breedingFather').value;
        const expectedDate = document.getElementById('breedingDate').value;
        const litterSize = document.getElementById('breedingLitterSize').value;
        const notes = document.getElementById('breedingNotes').value.trim();
        
        if (!motherId || !fatherId) {
            this.showError('Selecteer zowel moeder als vader');
            return;
        }
        
        if (motherId === fatherId) {
            this.showError('Moeder en vader kunnen niet dezelfde hond zijn');
            return;
        }
        
        this.showProgress('Fokplan opslaan...');
        
        try {
            // Laad honden voor namen
            const honden = await this.db.getHonden();
            const mother = honden.find(h => h.id === parseInt(motherId));
            const father = honden.find(h => h.id === parseInt(fatherId));
            
            if (!mother || !father) {
                throw new Error('Hond niet gevonden in database');
            }
            
            // Valideer geslachten
            if (mother.geslacht !== 'teven') {
                throw new Error('Moeder moet een teef zijn');
            }
            if (father.geslacht !== 'reuen') {
                throw new Error('Vader moet een reu zijn');
            }
            
            // Maak nieuw fokplan
            const newPlan = {
                id: Date.now(), // Tijdelijke ID
                motherId: parseInt(motherId),
                motherName: mother.naam,
                fatherId: parseInt(fatherId),
                fatherName: father.naam,
                expectedDate: expectedDate || null,
                litterSize: litterSize ? parseInt(litterSize) : null,
                notes: notes,
                status: 'planned',
                createdAt: new Date().toISOString(),
                createdBy: this.auth.getCurrentUser()?.username || 'unknown'
            };
            
            // Voeg toe aan lijst
            this.breedingPlans.push(newPlan);
            
            // Sla op in localStorage
            localStorage.setItem('breedingPlans', JSON.stringify(this.breedingPlans));
            
            this.hideProgress();
            this.showSuccess('Fokplan succesvol opgeslagen!');
            
            // Formulier resetten
            document.getElementById('breedingMother').value = '';
            document.getElementById('breedingFather').value = '';
            document.getElementById('breedingDate').value = '';
            document.getElementById('breedingLitterSize').value = '';
            document.getElementById('breedingNotes').value = '';
            
            // Herlaad data
            await this.loadBreedingData();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Fout bij opslaan fokplan: ${error.message}`);
        }
    }
    
    displayBreedingPlans() {
        const tableBody = document.getElementById('breedingPlansTable');
        if (!tableBody) return;
        
        if (!this.breedingPlans || this.breedingPlans.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="bi bi-calendar-x text-muted"></i>
                        <p class="mt-2 text-muted">Nog geen fokplannen aangemaakt</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        
        this.breedingPlans.sort((a, b) => {
            const dateA = a.expectedDate ? new Date(a.expectedDate) : new Date(0);
            const dateB = b.expectedDate ? new Date(b.expectedDate) : new Date(0);
            return dateB - dateA; // Nieuwste eerst
        });
        
        this.breedingPlans.forEach(plan => {
            const statusBadge = this.getStatusBadge(plan.status);
            const dateDisplay = plan.expectedDate ? 
                new Date(plan.expectedDate).toLocaleDateString('nl-NL') : 'Niet gepland';
            
            html += `
                <tr>
                    <td>
                        <strong>${plan.motherName}</strong>
                        ${plan.notes ? `<br><small class="text-muted">${plan.notes}</small>` : ''}
                    </td>
                    <td>${plan.fatherName}</td>
                    <td>${dateDisplay}</td>
                    <td>${statusBadge}</td>
                    <td>${plan.litterSize || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info view-plan-btn" data-id="${plan.id}">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning edit-plan-btn" data-id="${plan.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-plan-btn" data-id="${plan.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        
        // Voeg event listeners toe
        this.setupPlanActionListeners();
    }
    
    getStatusBadge(status) {
        const badges = {
            'planned': '<span class="badge bg-primary">Gepland</span>',
            'in-progress': '<span class="badge bg-warning">Lopend</span>',
            'completed': '<span class="badge bg-success">Voltooid</span>',
            'cancelled': '<span class="badge bg-danger">Geannuleerd</span>'
        };
        
        return badges[status] || '<span class="badge bg-secondary">Onbekend</span>';
    }
    
    setupPlanActionListeners() {
        document.querySelectorAll('.view-plan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planId = parseInt(e.target.closest('.view-plan-btn').dataset.id);
                this.viewBreedingPlan(planId);
            });
        });
        
        document.querySelectorAll('.edit-plan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planId = parseInt(e.target.closest('.edit-plan-btn').dataset.id);
                this.editBreedingPlan(planId);
            });
        });
        
        document.querySelectorAll('.delete-plan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planId = parseInt(e.target.closest('.delete-plan-btn').dataset.id);
                this.deleteBreedingPlan(planId);
            });
        });
    }
    
    async viewBreedingPlan(planId) {
        const plan = this.breedingPlans.find(p => p.id === planId);
        
        if (!plan) {
            this.showError('Fokplan niet gevonden');
            return;
        }
        
        // Laad hond details
        const honden = await this.db.getHonden();
        const mother = honden.find(h => h.id === plan.motherId);
        const father = honden.find(h => h.id === plan.fatherId);
        
        const html = `
            <div class="modal fade" id="viewBreedingPlanModal" tabindex="-1" aria-labelledby="viewBreedingPlanModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-purple text-white">
                            <h5 class="modal-title" id="viewBreedingPlanModalLabel">
                                <i class="bi bi-calendar-heart"></i> Fokplan Details
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0">Moeder</h6>
                                        </div>
                                        <div class="card-body">
                                            <h5>${plan.motherName}</h5>
                                            ${mother ? `
                                                <div class="small">
                                                    <div><strong>Ras:</strong> ${mother.ras || '-'}</div>
                                                    <div><strong>Chipnummer:</strong> ${mother.chipnummer || '-'}</div>
                                                    <div><strong>Geboortedatum:</strong> ${mother.geboortedatum ? 
                                                        new Date(mother.geboortedatum).toLocaleDateString('nl-NL') : '-'}</div>
                                                </div>
                                            ` : '<p class="text-muted">Hond niet gevonden in database</p>'}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0">Vader</h6>
                                        </div>
                                        <div class="card-body">
                                            <h5>${plan.fatherName}</h5>
                                            ${father ? `
                                                <div class="small">
                                                    <div><strong>Ras:</strong> ${father.ras || '-'}</div>
                                                    <div><strong>Chipnummer:</strong> ${father.chipnummer || '-'}</div>
                                                    <div><strong>Geboortedatum:</strong> ${father.geboortedatum ? 
                                                        new Date(father.geboortedatum).toLocaleDateString('nl-NL') : '-'}</div>
                                                </div>
                                            ` : '<p class="text-muted">Hond niet gevonden in database</p>'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0">Plan Details</h6>
                                </div>
                                <div class="card-body">
                                    <table class="table table-sm">
                                        <tr>
                                            <th style="width: 40%">Status:</th>
                                            <td>${this.getStatusBadge(plan.status)}</td>
                                        </tr>
                                        <tr>
                                            <th>Verwachte geboortedatum:</th>
                                            <td>${plan.expectedDate ? 
                                                new Date(plan.expectedDate).toLocaleDateString('nl-NL') : 'Niet gepland'}</td>
                                        </tr>
                                        <tr>
                                            <th>Verwachte nestgrootte:</th>
                                            <td>${plan.litterSize || 'Onbekend'}</td>
                                        </tr>
                                        <tr>
                                            <th>Aangemaakt op:</th>
                                            <td>${new Date(plan.createdAt).toLocaleString('nl-NL')}</td>
                                        </tr>
                                        <tr>
                                            <th>Aangemaakt door:</th>
                                            <td>${plan.createdBy}</td>
                                        </tr>
                                    </table>
                                    
                                    ${plan.notes ? `
                                    <div class="mt-3">
                                        <h6>Opmerkingen</h6>
                                        <div class="bg-light p-3 rounded">
                                            ${plan.notes}
                                        </div>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                            <button type="button" class="btn btn-purple" id="updatePlanStatusBtn" data-id="${plan.id}">
                                Status Bijwerken
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Toon modal
        const container = document.getElementById('modalsContainer');
        container.insertAdjacentHTML('beforeend', html);
        
        const modalElement = document.getElementById('viewBreedingPlanModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Voeg event listener voor status update toe
        const updateBtn = document.getElementById('updatePlanStatusBtn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                modal.hide();
                this.updatePlanStatus(plan.id);
            });
        }
        
        // Cleanup na sluiten
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
    
    async updatePlanStatus(planId) {
        const plan = this.breedingPlans.find(p => p.id === planId);
        
        if (!plan) {
            this.showError('Fokplan niet gevonden');
            return;
        }
        
        const html = `
            <div class="modal fade" id="updatePlanStatusModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title">Status Bijwerken</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Nieuwe Status</label>
                                <select class="form-select" id="newPlanStatus">
                                    <option value="planned" ${plan.status === 'planned' ? 'selected' : ''}>Gepland</option>
                                    <option value="in-progress" ${plan.status === 'in-progress' ? 'selected' : ''}>Lopend</option>
                                    <option value="completed" ${plan.status === 'completed' ? 'selected' : ''}>Voltooid</option>
                                    <option value="cancelled" ${plan.status === 'cancelled' ? 'selected' : ''}>Geannuleerd</option>
                                </select>
                            </div>
                            ${plan.status === 'completed' ? `
                            <div class="mb-3">
                                <label class="form-label">Werkelijke nestgrootte</label>
                                <input type="number" class="form-control" id="actualLitterSize" 
                                       value="${plan.actualLitterSize || ''}" min="0" max="20">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Voltooiingsdatum</label>
                                <input type="date" class="form-control" id="completionDate" 
                                       value="${new Date().toISOString().split('T')[0]}">
                            </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuleren</button>
                            <button type="button" class="btn btn-warning" id="confirmStatusUpdateBtn" data-id="${planId}">Bijwerken</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Toom modal
        const container = document.getElementById('modalsContainer');
        container.insertAdjacentHTML('beforeend', html);
        
        const modalElement = document.getElementById('updatePlanStatusModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Voeg event listener toe
        const confirmBtn = document.getElementById('confirmStatusUpdateBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const newStatus = document.getElementById('newPlanStatus').value;
                
                // Update plan
                plan.status = newStatus;
                
                if (newStatus === 'completed') {
                    plan.actualLitterSize = parseInt(document.getElementById('actualLitterSize').value) || null;
                    plan.completedDate = document.getElementById('completionDate').value || new Date().toISOString();
                }
                
                // Sla op
                localStorage.setItem('breedingPlans', JSON.stringify(this.breedingPlans));
                
                modal.hide();
                this.showSuccess('Status bijgewerkt!');
                
                // Herlaad data
                this.loadBreedingData();
            });
        }
        
        // Cleanup
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
    
    async editBreedingPlan(planId) {
        this.showError('Bewerken functie wordt binnenkort geïmplementeerd');
    }
    
    async deleteBreedingPlan(planId) {
        if (!confirm('Weet je zeker dat je dit fokplan wilt verwijderen?')) {
            return;
        }
        
        try {
            // Verwijder plan
            this.breedingPlans = this.breedingPlans.filter(p => p.id !== planId);
            
            // Sla op
            localStorage.setItem('breedingPlans', JSON.stringify(this.breedingPlans));
            
            this.showSuccess('Fokplan verwijderd!');
            
            // Herlaad data
            await this.loadBreedingData();
            
        } catch (error) {
            this.showError(`Verwijderen mislukt: ${error.message}`);
        }
    }
}
