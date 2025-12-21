// js/modules/DogManager.js

/**
 * Hond Management Module
 * Beheert toevoegen en bewerken van honden
 */

class DogManager extends BaseModule {
    constructor() {
        super('dog', 'Nieuwe Hond Toevoegen');
        console.log('DogManager geïnitialiseerd');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = [];
    }
    
    /**
     * Render de module interface
     */
    getModalHTML(isEdit = false, dogData = null) {
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        
        if (!isAdmin) {
            return `
                <div class="modal fade" id="dogModal" tabindex="-1" aria-labelledby="dogModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="dogModalLabel">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <span class="module-title" data-key="accessDenied">Toegang Geweigerd</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-danger">
                                    <h5><i class="bi bi-shield-lock"></i> Onvoldoende rechten</h5>
                                    <p>U heeft geen toestemming om honden toe te voegen of te bewerken. Alleen administrators kunnen deze functie gebruiken.</p>
                                    <p class="mb-0">U bent ingelogd als: <strong>${auth.getCurrentUser().username}</strong> (Gebruiker)</p>
                                </div>
                                
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h6><i class="bi bi-info-circle text-primary"></i> Beschikbare functies voor gebruikers</h6>
                                        <ul>
                                            <li>Honden zoeken en bekijken</li>
                                            <li>Foto galerij bekijken</li>
                                            <li>Privé informatie beheren</li>
                                            <li>Data importeren/exporteren</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-1"></i>
                                    <span class="module-text" data-key="close">Sluiten</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Als gebruiker admin is, toon het normale formulier
        const translations = this.getTranslations();
        const modalTitle = isEdit ? translations.editDog : translations.newDog;
        
        const data = dogData || {};
        
        let recentBreedsHTML = '';
        if (this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="form-text mb-2">${translations.recentBreeds}:</div>
                <div class="d-flex flex-wrap gap-2 mb-3">
            `;
            this.lastBreeds.forEach(breed => {
                recentBreedsHTML += `
                    <button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">
                        ${breed}
                    </button>
                `;
            });
            recentBreedsHTML += `</div>`;
        }
        
        return `
            <div class="modal fade" id="dogModal" tabindex="-1" aria-labelledby="dogModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="dogModalLabel">
                                <i class="bi bi-plus-circle"></i> ${modalTitle}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="${isEdit ? 'editDogForm' : 'addDogForm'}">
                                <input type="hidden" id="dogId" value="${data.id || ''}">
                                <input type="hidden" id="fatherId" value="${data.vaderId || ''}">
                                <input type="hidden" id="motherId" value="${data.moederId || ''}">
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="dogName" class="form-label">${translations.nameRequired}</label>
                                            <input type="text" class="form-control" id="dogName" value="${data.naam || ''}" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="pedigreeNumber" class="form-label">${translations.pedigreeNumber}</label>
                                            <input type="text" class="form-control" id="pedigreeNumber" value="${data.stamboomnr || ''}" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="breed" class="form-label">${translations.breedRequired}</label>
                                            <input type="text" class="form-control" id="breed" value="${data.ras || ''}" required>
                                            ${recentBreedsHTML}
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="gender" class="form-label">${translations.gender}</label>
                                            <select class="form-select" id="gender">
                                                <option value="">${translations.chooseGender}</option>
                                                <option value="reuen" ${data.geslacht === 'reuen' ? 'selected' : ''}>${translations.male}</option>
                                                <option value="teven" ${data.geslacht === 'teven' ? 'selected' : ''}>${translations.female}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3 position-relative">
                                            <label for="father" class="form-label">${translations.father}</label>
                                            <input type="text" class="form-control parent-input" id="father" 
                                                   value="${data.vader || ''}" 
                                                   placeholder="${translations.fatherSearch}"
                                                   data-parent-type="father"
                                                   autocomplete="off">
                                            <div class="autocomplete-dropdown" id="fatherDropdown"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3 position-relative">
                                            <label for="mother" class="form-label">${translations.mother}</label>
                                            <input type="text" class="form-control parent-input" id="mother" 
                                                   value="${data.moeder || ''}" 
                                                   placeholder="${translations.motherSearch}"
                                                   data-parent-type="mother"
                                                   autocomplete="off">
                                            <div class="autocomplete-dropdown" id="motherDropdown"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="birthDate" class="form-label">${translations.birthDate}</label>
                                            <input type="date" class="form-control" id="birthDate" value="${data.geboortedatum || ''}">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="deathDate" class="form-label">${translations.deathDate}</label>
                                            <input type="date" class="form-control" id="deathDate" value="${data.overlijdensdatum || ''}">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i>
                                    ${translations.requiredFields}
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i>
                                ${translations.cancel}
                            </button>
                            ${isEdit ? `
                            <button type="button" class="btn btn-danger" id="deleteDogBtn">
                                <i class="bi bi-trash"></i> ${translations.delete}
                            </button>
                            ` : ''}
                            <button type="button" class="btn btn-primary" id="saveDogBtn">
                                <i class="bi bi-save"></i> ${translations.saveDog}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Haal vertalingen op voor huidige taal
     */
    getTranslations() {
        const translations = {
            nl: {
                newDog: "Nieuwe Hond Toevoegen",
                editDog: "Hond Bewerken",
                nameRequired: "Naam *",
                pedigreeNumber: "Stamboomnummer *",
                breedRequired: "Ras *",
                recentBreeds: "Recent gebruikte rassen",
                father: "Vader",
                mother: "Moeder",
                fatherSearch: "Begin met typen om vader te zoeken...",
                motherSearch: "Begin met typen om moeder te zoeken...",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                gender: "Geslacht",
                chooseGender: "Selecteer geslacht...",
                male: "Reu",
                female: "Teef",
                saveDog: "Hond Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                requiredFields: "Velden met * zijn verplicht",
                accessDenied: "Toegang Geweigerd",
                close: "Sluiten"
            },
            en: {
                newDog: "Add New Dog",
                editDog: "Edit Dog",
                nameRequired: "Name *",
                pedigreeNumber: "Pedigree number *",
                breedRequired: "Breed *",
                recentBreeds: "Recently used breeds",
                father: "Father",
                mother: "Mother",
                fatherSearch: "Start typing to search for father...",
                motherSearch: "Start typing to search for mother...",
                birthDate: "Birth date",
                deathDate: "Death date",
                gender: "Gender",
                chooseGender: "Select gender...",
                male: "Male",
                female: "Female",
                saveDog: "Save Dog",
                cancel: "Cancel",
                delete: "Delete",
                requiredFields: "Fields with * are required",
                accessDenied: "Access Denied",
                close: "Close"
            },
            de: {
                newDog: "Neuen Hund hinzufügen",
                editDog: "Hund bearbeiten",
                nameRequired: "Name *",
                pedigreeNumber: "Stammbaum-Nummer *",
                breedRequired: "Rasse *",
                recentBreeds: "Kürzlich verwendete Rassen",
                father: "Vater",
                mother: "Mutter",
                fatherSearch: "Beginnen Sie mit der Eingabe, um den Vater zu suchen...",
                motherSearch: "Beginnen Sie mit der Eingabe, um die Mutter zu suchen...",
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                gender: "Geschlecht",
                chooseGender: "Geschlecht wählen...",
                male: "Rüde",
                female: "Hündin",
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                requiredFields: "Felder mit * zijn Pflichtfelder",
                accessDenied: "Zugriff Verweigert",
                close: "Schließen"
            }
        };
        
        return translations[this.currentLang] || translations.nl;
    }
    
    addToLastBreeds(breed) {
        if (!breed || breed.trim() === '') return;
        
        const breedStr = breed.trim();
        const index = this.lastBreeds.indexOf(breedStr);
        
        if (index > -1) {
            this.lastBreeds.splice(index, 1);
        }
        
        this.lastBreeds.unshift(breedStr);
        
        if (this.lastBreeds.length > 5) {
            this.lastBreeds = this.lastBreeds.slice(0, 5);
        }
        
        localStorage.setItem('lastBreeds', JSON.stringify(this.lastBreeds));
    }
    
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                this.allDogs = await this.db.getHonden();
                this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
                console.log(`${this.allDogs.length} honden geladen voor autocomplete`);
            } catch (error) {
                console.error('Fout bij laden honden voor autocomplete:', error);
            }
        }
    }
    
    /**
     * Setup event listeners voor deze module
     */
    setupEvents() {
        console.log('DogManager setupEvents aangeroepen');
        
        // Als gebruiker geen admin is, kunnen we stoppen hier
        if (!auth.isAdmin()) {
            console.log('Gebruiker is geen admin, geen events nodig voor DogManager');
            
            // Vertaal de modal tekst
            setTimeout(() => {
                this.translateModal();
            }, 100);
            return;
        }
        
        // Laad honden voor autocomplete (alleen voor admins)
        this.loadAllDogs();
        
        // Event listeners voor formulier
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const formId = document.getElementById('dogId') ? 'editDogForm' : 'addDogForm';
                this.saveDog(formId);
            });
        }
        
        // Delete knop
        const deleteBtn = document.getElementById('deleteDogBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteDog();
            });
        }
        
        // Recente rassen knoppen
        document.querySelectorAll('.recent-breed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('breed');
                if (breedInput) {
                    breedInput.value = breed;
                }
            });
        });
        
        // Setup autocomplete voor ouders
        setTimeout(() => {
            this.setupParentAutocomplete();
        }, 100);
        
        // Vertaal de modal tekst
        setTimeout(() => {
            this.translateModal();
        }, 100);
    }
    
    /**
     * Vertaal de modal tekst
     */
    translateModal() {
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (this.getTranslations()[key]) {
                element.textContent = this.getTranslations()[key];
            }
        });
    }
    
    setupParentAutocomplete() {
        console.log('Setting up parent autocomplete...');
        
        // Voeg CSS toe voor dropdowns
        this.addAutocompleteStyles();
        
        // Event listeners voor vader en moeder velden
        document.querySelectorAll('.parent-input').forEach(input => {
            const parentType = input.dataset.parentType;
            console.log(`Setting up autocomplete for ${parentType}`);
            
            input.addEventListener('focus', () => {
                console.log(`${parentType} input focus`);
                this.loadAllDogs(); // Zorg dat honden geladen zijn
            });
            
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                console.log(`${parentType} input: "${searchTerm}"`);
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', (e) => {
                // Wacht even voordat dropdown wordt verborgen (voor klikken op item)
                setTimeout(() => {
                    const dropdown = document.getElementById(`${parentType}Dropdown`);
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            });
        });
        
        // Klik buiten dropdown om te verbergen
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input') && !e.target.closest('.autocomplete-dropdown')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    addAutocompleteStyles() {
        // Voeg CSS toe voor autocomplete dropdowns als deze nog niet bestaat
        if (!document.getElementById('autocomplete-styles')) {
            const style = document.createElement('style');
            style.id = 'autocomplete-styles';
            style.textContent = `
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    width: 100%;
                    z-index: 1000;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    display: none;
                    margin-top: 2px;
                }
                
                .autocomplete-item {
                    padding: 8px 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background-color 0.2s;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item:last-child {
                    border-bottom: none;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: bold;
                    font-size: 0.95rem;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.8rem;
                    color: #6c757d;
                    margin-top: 2px;
                }
                
                .parent-input-container {
                    position: relative;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    showParentAutocomplete(searchTerm, parentType) {
        console.log(`showParentAutocomplete for ${parentType}: "${searchTerm}"`);
        
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) {
            console.error(`Dropdown niet gevonden: ${parentType}Dropdown`);
            return;
        }
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        const targetGender = parentType === 'father' ? 'reuen' : 'teven';
        console.log(`Filtering for gender: ${targetGender}, total dogs: ${this.allDogs.length}`);
        
        const suggestions = this.allDogs.filter(dog => {
            if (!dog.naam) return false;
            const dogName = dog.naam.toLowerCase();
            const matchesSearch = dogName.includes(searchTerm);
            const matchesGender = !dog.geslacht || dog.geslacht === targetGender;
            return matchesSearch && matchesGender;
        }).slice(0, 8);
        
        console.log(`Found ${suggestions.length} suggestions`);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            html += `
                <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}">
                    <div class="dog-name">${dog.naam}</div>
                    <div class="dog-info">
                        ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'}
                    </div>
                </div>
            `;
        });
        
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        
        // Event listeners voor autocomplete items
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                console.log('Item clicked');
                const dogId = item.getAttribute('data-id');
                const dogName = item.getAttribute('data-name');
                const input = document.getElementById(parentType);
                const idInput = document.getElementById(`${parentType}Id`);
                
                if (input) {
                    input.value = dogName;
                    console.log(`Set ${parentType} to: ${dogName}`);
                }
                if (idInput) {
                    idInput.value = dogId;
                    console.log(`Set ${parentType}Id to: ${dogId}`);
                }
                
                dropdown.style.display = 'none';
            });
        });
    }
    
    async saveDog(formType) {
        if (!auth.isAdmin()) {
            this.showError("Alleen administrators mogen honden toevoegen/bewerken");
            return;
        }
        
        const isEdit = formType === 'editDogForm';
        const dogId = isEdit ? document.getElementById('dogId').value : null;
        
        const dogData = {
            naam: document.getElementById('dogName').value.trim(),
            stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
            ras: document.getElementById('breed').value.trim(),
            geslacht: document.getElementById('gender').value,
            vader: document.getElementById('father').value.trim(),
            vaderId: document.getElementById('fatherId').value ? parseInt(document.getElementById('fatherId').value) : null,
            moeder: document.getElementById('mother').value.trim(),
            moederId: document.getElementById('motherId').value ? parseInt(document.getElementById('motherId').value) : null,
            geboortedatum: document.getElementById('birthDate').value,
            overlijdensdatum: document.getElementById('deathDate').value,
            updatedAt: new Date().toISOString()
        };
        
        console.log('Saving dog data:', dogData);
        
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError("Naam, stamboomnummer en ras zijn verplichte velden");
            return;
        }
        
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress("Hond opslaan...");
        
        try {
            if (isEdit && dogId) {
                await this.db.updateHond(parseInt(dogId), dogData);
                this.hideProgress();
                this.showSuccess("Hond succesvol bijgewerkt!");
            } else {
                dogData.createdAt = new Date().toISOString();
                const newId = await this.db.voegHondToe(dogData);
                console.log('New dog added with ID:', newId);
                this.hideProgress();
                this.showSuccess("Hond succesvol toegevoegd!");
            }
            
            // Voeg de nieuwe hond toe aan de lokale lijst voor toekomstige autocomplete
            if (!isEdit) {
                dogData.id = isEdit ? parseInt(dogId) : Date.now(); // Tijdelijke ID
                this.allDogs.push(dogData);
                this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            }
            
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('dogModal'));
                if (modal) modal.hide();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('Error saving dog:', error);
            this.showError(`Fout bij opslaan: ${error.message}`);
        }
    }
    
    async deleteDog() {
        if (!auth.isAdmin()) {
            this.showError("Alleen administrators mogen honden toevoegen/bewerken");
            return;
        }
        
        const dogId = document.getElementById('dogId').value;
        if (!dogId) return;
        
        if (!confirm("Weet u zeker dat u deze hond wilt verwijderen?")) return;
        
        this.showProgress("Verwijderen...");
        
        try {
            await this.db.verwijderHond(parseInt(dogId));
            this.hideProgress();
            this.showSuccess("Hond succesvol verwijderd!");
            
            // Verwijder uit lokale lijst
            const index = this.allDogs.findIndex(dog => dog.id === parseInt(dogId));
            if (index > -1) {
                this.allDogs.splice(index, 1);
            }
            
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('dogModal'));
                if (modal) modal.hide();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Fout bij verwijderen: ${error.message}`);
        }
    }
    
    /**
     * Initialiseer de module
     */
    async init() {
        console.log('DogManager geïnitialiseerd');
        return true;
    }
}

// Maak globaal beschikbaar voor debug doeleinden
if (typeof window !== 'undefined') {
    window.DogManager = DogManager;
}