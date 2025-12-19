/**
 * Fok Planning Module
 * Beheert fokplannen en nest planning
 */

class BreedingManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.breedingPlans = [];
        this.translations = {
            nl: {
                // Modal titels
                breedingPlan: "Fok Planning",
                breedingInfo: "Maak en beheer fokplannen voor uw honden. Plan dekkingen, nesten en geboortes.",
                
                // Nieuw fokplan
                newBreedingPlan: "Nieuw Fokplan",
                mother: "Moeder",
                motherRequired: "Moeder *",
                selectMother: "Selecteer teef...",
                father: "Vader",
                fatherRequired: "Vader *",
                selectFather: "Selecteer reu...",
                expectedBirthDate: "Geboortedatum verwacht",
                expectedLitterSize: "Verwachte nestgrootte",
                notes: "Opmerkingen",
                extraNotes: "Extra notities over het fokplan...",
                saveBreedingPlan: "Fokplan Opslaan",
                
                // Actieve plannen
                activeBreedingPlans: "Actieve Fokplannen",
                activePlans: "Actieve plannen",
                nextBirth: "Volgende geboorte",
                totalLittersYear: "Totaal nesten dit jaar",
                successRate: "Succesratio",
                none: "Geen",
                
                // Overzicht
                breedingPlanOverview: "Fokplan Overzicht",
                date: "Datum",
                status: "Status",
                litterSize: "Nestgrootte",
                actions: "Acties",
                noPlans: "Nog geen fokplannen aangemaakt",
                
                // Status labels
                planned: "Gepland",
                inProgress: "Lopend",
                completed: "Voltooid",
                cancelled: "Geannuleerd",
                unknown: "Onbekend",
                
                // Details modal
                breedingPlanDetails: "Fokplan Details",
                motherDetails: "Moeder",
                fatherDetails: "Vader",
                planDetails: "Plan Details",
                actualLitterSize: "Werkelijke nestgrootte",
                completionDate: "Voltooiingsdatum",
                createdOn: "Aangemaakt op",
                createdBy: "Aangemaakt door",
                updateStatus: "Status Bijwerken",
                
                // Status update
                updateStatusTitle: "Status Bijwerken",
                newStatus: "Nieuwe Status",
                confirmUpdate: "Bijwerken",
                
                // Alerts
                selectBoth: "Selecteer zowel moeder als vader",
                sameDog: "Moeder en vader kunnen niet dezelfde hond zijn",
                motherMustBeFemale: "Moeder moet een teef zijn",
                fatherMustBeMale: "Vader moet een reu zijn",
                savingPlan: "Fokplan opslaan...",
                planSaved: "Fokplan succesvol opgeslagen!",
                saveFailed: "Fout bij opslaan fokplan: ",
                dogNotFound: "Hond niet gevonden in database",
                deleteConfirm: "Weet je zeker dat je dit fokplan wilt verwijderen?",
                deleteSuccess: "Fokplan verwijderd!",
                deleteFailed: "Verwijderen mislukt: ",
                planNotFound: "Fokplan niet gevonden",
                statusUpdated: "Status bijgewerkt!"
            },
            en: {
                // Modal titles
                breedingPlan: "Breeding Plan",
                breedingInfo: "Create and manage breeding plans for your dogs. Plan matings, litters and births.",
                
                // New breeding plan
                newBreedingPlan: "New Breeding Plan",
                mother: "Mother",
                motherRequired: "Mother *",
                selectMother: "Select female...",
                father: "Father",
                fatherRequired: "Father *",
                selectFather: "Select male...",
                expectedBirthDate: "Expected birth date",
                expectedLitterSize: "Expected litter size",
                notes: "Notes",
                extraNotes: "Extra notes about the breeding plan...",
                saveBreedingPlan: "Save Breeding Plan",
                
                // Active plans
                activeBreedingPlans: "Active Breeding Plans",
                activePlans: "Active plans",
                nextBirth: "Next birth",
                totalLittersYear: "Total litters this year",
                successRate: "Success rate",
                none: "None",
                
                // Overview
                breedingPlanOverview: "Breeding Plan Overview",
                date: "Date",
                status: "Status",
                litterSize: "Litter size",
                actions: "Actions",
                noPlans: "No breeding plans created yet",
                
                // Status labels
                planned: "Planned",
                inProgress: "In Progress",
                completed: "Completed",
                cancelled: "Cancelled",
                unknown: "Unknown",
                
                // Details modal
                breedingPlanDetails: "Breeding Plan Details",
                motherDetails: "Mother",
                fatherDetails: "Father",
                planDetails: "Plan Details",
                actualLitterSize: "Actual litter size",
                completionDate: "Completion date",
                createdOn: "Created on",
                createdBy: "Created by",
                updateStatus: "Update Status",
                
                // Status update
                updateStatusTitle: "Update Status",
                newStatus: "New Status",
                confirmUpdate: "Update",
                
                // Alerts
                selectBoth: "Select both mother and father",
                sameDog: "Mother and father cannot be the same dog",
                motherMustBeFemale: "Mother must be a female",
                fatherMustBeMale: "Father must be a male",
                savingPlan: "Saving breeding plan...",
                planSaved: "Breeding plan successfully saved!",
                saveFailed: "Error saving breeding plan: ",
                dogNotFound: "Dog not found in database",
                deleteConfirm: "Are you sure you want to delete this breeding plan?",
                deleteSuccess: "Breeding plan deleted!",
                deleteFailed: "Delete failed: ",
                planNotFound: "Breeding plan not found",
                statusUpdated: "Status updated!"
            },
            de: {
                // Modal Titel
                breedingPlan: "Zuchtplanung",
                breedingInfo: "Erstellen und verwalten Sie Zuchtpläne für Ihre Hunde. Planen Sie Deckungen, Würfe und Geburten.",
                
                // Neuer Zuchtplan
                newBreedingPlan: "Neuer Zuchtplan",
                mother: "Mutter",
                motherRequired: "Mutter *",
                selectMother: "Hündin auswählen...",
                father: "Vater",
                fatherRequired: "Vater *",
                selectFather: "Rüde auswählen...",
                expectedBirthDate: "Erwartetes Geburtsdatum",
                expectedLitterSize: "Erwartete Wurfgröße",
                notes: "Notizen",
                extraNotes: "Zusätzliche Notizen zum Zuchtplan...",
                saveBreedingPlan: "Zuchtplan speichern",
                
                // Aktive Pläne
                activeBreedingPlans: "Aktive Zuchtpläne",
                activePlans: "Aktive Pläne",
                nextBirth: "Nächste Geburt",
                totalLittersYear: "Würfe dieses Jahr",
                successRate: "Erfolgsrate",
                none: "Keine",
                
                // Übersicht
                breedingPlanOverview: "Zuchtplan Übersicht",
                date: "Datum",
                status: "Status",
                litterSize: "Wurfgröße",
                actions: "Aktionen",
                noPlans: "Noch keine Zuchtpläne erstellt",
                
                // Status Labels
                planned: "Geplant",
                inProgress: "Laufend",
                completed: "Abgeschlossen",
                cancelled: "Abgebrochen",
                unknown: "Unbekannt",
                
                // Details Modal
                breedingPlanDetails: "Zuchtplan Details",
                motherDetails: "Mutter",
                fatherDetails: "Vater",
                planDetails: "Plan Details",
                actualLitterSize: "Tatsächliche Wurfgröße",
                completionDate: "Abschlussdatum",
                createdOn: "Erstellt am",
                createdBy: "Erstellt von",
                updateStatus: "Status aktualisieren",
                
                // Status Update
                updateStatusTitle: "Status aktualisieren",
                newStatus: "Neuer Status",
                confirmUpdate: "Aktualisieren",
                
                // Meldungen
                selectBoth: "Wählen Sie sowohl Mutter als auch Vater",
                sameDog: "Mutter und Vater können nicht derselbe Hund sein",
                motherMustBeFemale: "Mutter muss eine Hündin sein",
                fatherMustBeMale: "Vater muss ein Rüde sein",
                savingPlan: "Zuchtplan wird gespeichert...",
                planSaved: "Zuchtplan erfolgreich gespeichert!",
                saveFailed: "Fehler beim Speichern des Zuchtplans: ",
                dogNotFound: "Hund nicht in der Datenbank gefunden",
                deleteConfirm: "Sind Sie sicher, dass Sie diesen Zuchtplan löschen möchten?",
                deleteSuccess: "Zuchtplan gelöscht!",
                deleteFailed: "Löschen fehlgeschlagen: ",
                planNotFound: "Zuchtplan nicht gefunden",
                statusUpdated: "Status aktualisiert!"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('breedingPlanModal')) {
            this.loadBreedingData();
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="breedingPlanModal" tabindex="-1" aria-labelledby="breedingPlanModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-purple text-white">
                            <h5 class="modal-title" id="breedingPlanModalLabel">
                                <i class="bi bi-calendar-heart"></i> ${t('breedingPlan')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-4">
                                <i class="bi bi-info-circle"></i>
                                ${t('breedingInfo')}
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header bg-purple text-white">
                                            <h6 class="mb-0"><i class="bi bi-plus-circle"></i> ${t('newBreedingPlan')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row g-3">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="breedingMother" class="form-label">${t('motherRequired')}</label>
                                                        <select class="form-select" id="breedingMother" required>
                                                            <option value="">${t('selectMother')}</option>
                                                            <!-- Teven opties worden hier ingeladen -->
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="breedingFather" class="form-label">${t('fatherRequired')}</label>
                                                        <select class="form-select" id="breedingFather" required>
                                                            <option value="">${t('selectFather')}</option>
                                                            <!-- Reuen opties worden hier ingeladen -->
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="breedingDate" class="form-label">${t('expectedBirthDate')}</label>
                                                        <input type="date" class="form-control" id="breedingDate">
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="breedingLitterSize" class="form-label">${t('expectedLitterSize')}</label>
                                                        <input type="number" class="form-control" id="breedingLitterSize" min="1" max="20">
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="mb-3">
                                                        <label for="breedingNotes" class="form-label">${t('notes')}</label>
                                                        <textarea class="form-control" id="breedingNotes" rows="2" placeholder="${t('extraNotes')}"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <button class="btn btn-purple w-100" id="saveBreedingPlanBtn">
                                                <i class="bi bi-save"></i> ${t('saveBreedingPlan')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-calendar-check"></i> ${t('activeBreedingPlans')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="text-center">
                                                <div class="display-4 text-purple mb-2" id="activeBreedingPlans">0</div>
                                                <div class="text-muted">${t('activePlans')}</div>
                                            </div>
                                            <hr>
                                            <div class="small">
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span>${t('nextBirth')}:</span>
                                                    <span id="nextBreedingDate">${t('none')}</span>
                                                </div>
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span>${t('totalLittersYear')}:</span>
                                                    <span id="totalLittersYear">0</span>
                                                </div>
                                                <div class="d-flex justify-content-between">
                                                    <span>${t('successRate')}:</span>
                                                    <span id="breedingSuccessRate">0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="bi bi-list-check"></i> ${t('breedingPlanOverview')}</h6>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>${t('mother')}</th>
                                                    <th>${t('father')}</th>
                                                    <th>${t('date')}</th>
                                                    <th>${t('status')}</th>
                                                    <th>${t('litterSize')}</th>
                                                    <th>${t('actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody id="breedingPlansTable">
                                                <tr>
                                                    <td colspan="6" class="text-center py-4">
                                                        <i class="bi bi-calendar-x text-muted"></i>
                                                        <p class="mt-2 text-muted">${t('noPlans')}</p>
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
        const t = this.t.bind(this);
        
        try {
            const honden = await this.db.getHonden();
            const motherSelect = document.getElementById('breedingMother');
            const fatherSelect = document.getElementById('breedingFather');
            
            if (motherSelect) {
                motherSelect.innerHTML = `<option value="">${t('selectMother')}</option>`;
                honden.filter(h => h.geslacht === 'teven').forEach(hond => {
                    const option = document.createElement('option');
                    option.value = hond.id;
                    option.textContent = `${hond.naam} (${hond.ras})`;
                    motherSelect.appendChild(option);
                });
            }
            
            if (fatherSelect) {
                fatherSelect.innerHTML = `<option value="">${t('selectFather')}</option>`;
                honden.filter(h => h.geslacht === 'reuen').forEach(hond => {
                    const option = document.createElement('option');
                    option.value = hond.id;
                    option.textContent = `${hond.naam} (${hond.ras})`;
                    fatherSelect.appendChild(option);
                });
            }
            
            await this.loadBreedingPlans();
            
        } catch (error) {
            console.error('Fout bij laden fok data:', error);
        }
    }
    
    async loadBreedingPlans() {
        try {
            const savedPlans = localStorage.getItem('breedingPlans');
            this.breedingPlans = savedPlans ? JSON.parse(savedPlans) : [];
            
            await this.updateBreedingStats();
            this.displayBreedingPlans();
            
        } catch (error) {
            console.error('Fout bij laden fokplannen:', error);
        }
    }
    
    async updateBreedingStats() {
        const t = this.t.bind(this);
        const activePlansElement = document.getElementById('activeBreedingPlans');
        const nextBreedingDateElement = document.getElementById('nextBreedingDate');
        const totalLittersYearElement = document.getElementById('totalLittersYear');
        const breedingSuccessRateElement = document.getElementById('breedingSuccessRate');
        
        if (!this.breedingPlans || this.breedingPlans.length === 0) {
            if (activePlansElement) activePlansElement.textContent = '0';
            if (nextBreedingDateElement) nextBreedingDateElement.textContent = t('none');
            if (totalLittersYearElement) totalLittersYearElement.textContent = '0';
            if (breedingSuccessRateElement) breedingSuccessRateElement.textContent = '0%';
            return;
        }
        
        const currentYear = new Date().getFullYear();
        const currentDate = new Date();
        
        const activePlans = this.breedingPlans.filter(plan => {
            if (!plan.expectedDate) return false;
            const planDate = new Date(plan.expectedDate);
            return planDate >= currentDate || plan.status === 'in-progress';
        });
        
        let nextDate = null;
        this.breedingPlans.forEach(plan => {
            if (plan.expectedDate && plan.status === 'planned') {
                const planDate = new Date(plan.expectedDate);
                if (planDate >= currentDate && (!nextDate || planDate < nextDate)) {
                    nextDate = planDate;
                }
            }
        });
        
        const littersThisYear = this.breedingPlans.filter(plan => {
            if (!plan.completedDate) return false;
            const completedDate = new Date(plan.completedDate);
            return completedDate.getFullYear() === currentYear;
        }).length;
        
        const completedPlans = this.breedingPlans.filter(p => p.status === 'completed');
        const cancelledPlans = this.breedingPlans.filter(p => p.status === 'cancelled');
        const totalEnded = completedPlans.length + cancelledPlans.length;
        const successRate = totalEnded > 0 ? Math.round((completedPlans.length / totalEnded) * 100) : 0;
        
        if (activePlansElement) activePlansElement.textContent = activePlans.length;
        if (nextBreedingDateElement) {
            nextBreedingDateElement.textContent = nextDate ? 
                nextDate.toLocaleDateString(this.currentLang) : t('none');
        }
        if (totalLittersYearElement) totalLittersYearElement.textContent = littersThisYear;
        if (breedingSuccessRateElement) breedingSuccessRateElement.textContent = `${successRate}%`;
    }
    
    async saveBreedingPlan() {
        const t = this.t.bind(this);
        const motherId = document.getElementById('breedingMother').value;
        const fatherId = document.getElementById('breedingFather').value;
        const expectedDate = document.getElementById('breedingDate').value;
        const litterSize = document.getElementById('breedingLitterSize').value;
        const notes = document.getElementById('breedingNotes').value.trim();
        
        if (!motherId || !fatherId) {
            this.showError(t('selectBoth'));
            return;
        }
        
        if (motherId === fatherId) {
            this.showError(t('sameDog'));
            return;
        }
        
        this.showProgress(t('savingPlan'));
        
        try {
            const honden = await this.db.getHonden();
            const mother = honden.find(h => h.id === parseInt(motherId));
            const father = honden.find(h => h.id === parseInt(fatherId));
            
            if (!mother || !father) {
                throw new Error(t('dogNotFound'));
            }
            
            if (mother.geslacht !== 'teven') {
                throw new Error(t('motherMustBeFemale'));
            }
            if (father.geslacht !== 'reuen') {
                throw new Error(t('fatherMustBeMale'));
            }
            
            const newPlan = {
                id: Date.now(),
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
            
            this.breedingPlans.push(newPlan);
            localStorage.setItem('breedingPlans', JSON.stringify(this.breedingPlans));
            
            this.hideProgress();
            this.showSuccess(t('planSaved'));
            
            document.getElementById('breedingMother').value = '';
            document.getElementById('breedingFather').value = '';
            document.getElementById('breedingDate').value = '';
            document.getElementById('breedingLitterSize').value = '';
            document.getElementById('breedingNotes').value = '';
            
            await this.loadBreedingData();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('saveFailed')}${error.message}`);
        }
    }
    
    displayBreedingPlans() {
        const t = this.t.bind(this);
        const tableBody = document.getElementById('breedingPlansTable');
        if (!tableBody) return;
        
        if (!this.breedingPlans || this.breedingPlans.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="bi bi-calendar-x text-muted"></i>
                        <p class="mt-2 text-muted">${t('noPlans')}</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        
        this.breedingPlans.sort((a, b) => {
            const dateA = a.expectedDate ? new Date(a.expectedDate) : new Date(0);
            const dateB = b.expectedDate ? new Date(b.expectedDate) : new Date(0);
            return dateB - dateA;
        });
        
        this.breedingPlans.forEach(plan => {
            const statusBadge = this.getStatusBadge(plan.status);
            const dateDisplay = plan.expectedDate ? 
                new Date(plan.expectedDate).toLocaleDateString(this.currentLang) : t('notPlanned');
            
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
                            <i class="bi bi-eye"></i> ${t('view')}
                        </button>
                        <button class="btn btn-sm btn-outline-warning edit-plan-btn" data-id="${plan.id}">
                            <i class="bi bi-pencil"></i> ${t('edit')}
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-plan-btn" data-id="${plan.id}">
                            <i class="bi bi-trash"></i> ${t('delete')}
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        this.setupPlanActionListeners();
    }
    
    getStatusBadge(status) {
        const t = this.t.bind(this);
        const badges = {
            'planned': `<span class="badge bg-primary">${t('planned')}</span>`,
            'in-progress': `<span class="badge bg-warning">${t('inProgress')}</span>`,
            'completed': `<span class="badge bg-success">${t('completed')}</span>`,
            'cancelled': `<span class="badge bg-danger">${t('cancelled')}</span>`
        };
        
        return badges[status] || `<span class="badge bg-secondary">${t('unknown')}</span>`;
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
        const t = this.t.bind(this);
        const plan = this.breedingPlans.find(p => p.id === planId);
        
        if (!plan) {
            this.showError(t('planNotFound'));
            return;
        }
        
        const honden = await this.db.getHonden();
        const mother = honden.find(h => h.id === plan.motherId);
        const father = honden.find(h => h.id === plan.fatherId);
        
        const html = `
            <div class="modal fade" id="viewBreedingPlanModal" tabindex="-1" aria-labelledby="viewBreedingPlanModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-purple text-white">
                            <h5 class="modal-title" id="viewBreedingPlanModalLabel">
                                <i class="bi bi-calendar-heart"></i> ${t('breedingPlanDetails')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0">${t('motherDetails')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <h5>${plan.motherName}</h5>
                                            ${mother ? `
                                                <div class="small">
                                                    <div><strong>${t('breed')}:</strong> ${mother.ras || '-'}</div>
                                                    <div><strong>${t('chipNumber')}:</strong> ${mother.chipnummer || '-'}</div>
                                                    <div><strong>${t('birthDate')}:</strong> ${mother.geboortedatum ? 
                                                        new Date(mother.geboortedatum).toLocaleDateString(this.currentLang) : '-'}</div>
                                                </div>
                                            ` : `<p class="text-muted">${t('dogNotFound')}</p>`}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0">${t('fatherDetails')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <h5>${plan.fatherName}</h5>
                                            ${father ? `
                                                <div class="small">
                                                    <div><strong>${t('breed')}:</strong> ${father.ras || '-'}</div>
                                                    <div><strong>${t('chipNumber')}:</strong> ${father.chipnummer || '-'}</div>
                                                    <div><strong>${t('birthDate')}:</strong> ${father.geboortedatum ? 
                                                        new Date(father.geboortedatum).toLocaleDateString(this.currentLang) : '-'}</div>
                                                </div>
                                            ` : `<p class="text-muted">${t('dogNotFound')}</p>`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0">${t('planDetails')}</h6>
                                </div>
                                <div class="card-body">
                                    <table class="table table-sm">
                                        <tr>
                                            <th style="width: 40%">${t('status')}:</th>
                                            <td>${this.getStatusBadge(plan.status)}</td>
                                        </tr>
                                        <tr>
                                            <th>${t('expectedBirthDate')}:</th>
                                            <td>${plan.expectedDate ? 
                                                new Date(plan.expectedDate).toLocaleDateString(this.currentLang) : t('notPlanned')}</td>
                                        </tr>
                                        <tr>
                                            <th>${t('expectedLitterSize')}:</th>
                                            <td>${plan.litterSize || t('unknown')}</td>
                                        </tr>
                                        <tr>
                                            <th>${t('createdOn')}:</th>
                                            <td>${new Date(plan.createdAt).toLocaleString(this.currentLang)}</td>
                                        </tr>
                                        <tr>
                                            <th>${t('createdBy')}:</th>
                                            <td>${plan.createdBy}</td>
                                        </tr>
                                    </table>
                                    
                                    ${plan.notes ? `
                                    <div class="mt-3">
                                        <h6>${t('notes')}</h6>
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
                                ${t('updateStatus')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.getElementById('modalsContainer');
        container.insertAdjacentHTML('beforeend', html);
        
        const modalElement = document.getElementById('viewBreedingPlanModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        const updateBtn = document.getElementById('updatePlanStatusBtn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                modal.hide();
                this.updatePlanStatus(plan.id);
            });
        }
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
    
    async updatePlanStatus(planId) {
        const t = this.t.bind(this);
        const plan = this.breedingPlans.find(p => p.id === planId);
        
        if (!plan) {
            this.showError(t('planNotFound'));
            return;
        }
        
        const html = `
            <div class="modal fade" id="updatePlanStatusModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title">${t('updateStatusTitle')}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">${t('newStatus')}</label>
                                <select class="form-select" id="newPlanStatus">
                                    <option value="planned" ${plan.status === 'planned' ? 'selected' : ''}>${t('planned')}</option>
                                    <option value="in-progress" ${plan.status === 'in-progress' ? 'selected' : ''}>${t('inProgress')}</option>
                                    <option value="completed" ${plan.status === 'completed' ? 'selected' : ''}>${t('completed')}</option>
                                    <option value="cancelled" ${plan.status === 'cancelled' ? 'selected' : ''}>${t('cancelled')}</option>
                                </select>
                            </div>
                            ${plan.status === 'completed' ? `
                            <div class="mb-3">
                                <label class="form-label">${t('actualLitterSize')}</label>
                                <input type="number" class="form-control" id="actualLitterSize" 
                                       value="${plan.actualLitterSize || ''}" min="0" max="20">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">${t('completionDate')}</label>
                                <input type="date" class="form-control" id="completionDate" 
                                       value="${new Date().toISOString().split('T')[0]}">
                            </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('cancel')}</button>
                            <button type="button" class="btn btn-warning" id="confirmStatusUpdateBtn" data-id="${planId}">${t('confirmUpdate')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.getElementById('modalsContainer');
        container.insertAdjacentHTML('beforeend', html);
        
        const modalElement = document.getElementById('updatePlanStatusModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        const confirmBtn = document.getElementById('confirmStatusUpdateBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const newStatus = document.getElementById('newPlanStatus').value;
                plan.status = newStatus;
                
                if (newStatus === 'completed') {
                    plan.actualLitterSize = parseInt(document.getElementById('actualLitterSize').value) || null;
                    plan.completedDate = document.getElementById('completionDate').value || new Date().toISOString();
                }
                
                localStorage.setItem('breedingPlans', JSON.stringify(this.breedingPlans));
                
                modal.hide();
                this.showSuccess(t('statusUpdated'));
                this.loadBreedingData();
            });
        }
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
    
    async editBreedingPlan(planId) {
        this.showError('Bewerken functie wordt binnenkort geïmplementeerd');
    }
    
    async deleteBreedingPlan(planId) {
        const t = this.t.bind(this);
        
        if (!confirm(t('deleteConfirm'))) {
            return;
        }
        
        try {
            this.breedingPlans = this.breedingPlans.filter(p => p.id !== planId);
            localStorage.setItem('breedingPlans', JSON.stringify(this.breedingPlans));
            
            this.showSuccess(t('deleteSuccess'));
            await this.loadBreedingData();
            
        } catch (error) {
            this.showError(`${t('deleteFailed')}${error.message}`);
        }
    }


if (typeof window !== 'undefined') {
    window.BreedingManager = BreedingManager;
}
