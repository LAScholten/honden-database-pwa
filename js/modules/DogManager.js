// js/modules/DogManager.js

/**
 * DogManager - Module voor het toevoegen en beheren van honden
 * Alleen toegankelijk voor administrators
 */
class DogManager extends BaseModule {
    constructor() {
        super('dogmanager', 'Hond Toevoegen');
        console.log('DogManager geïnitialiseerd');
    }
    
    /**
     * Render de module interface
     */
    getModalHTML() {
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        const user = auth.getCurrentUser();
        const username = user ? user.username : 'Gast';
        
        if (!isAdmin) {
            return `
                <div class="modal fade" id="addDogModal" tabindex="-1" aria-labelledby="addDogModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="addDogModalLabel">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <span class="module-title" data-key="accessDenied">Toegang Geweigerd</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-danger">
                                    <h5><i class="bi bi-shield-lock"></i> Onvoldoende rechten</h5>
                                    <p>U heeft geen toestemming om nieuwe honden toe te voegen. Alleen administrators kunnen deze functie gebruiken.</p>
                                    <p class="mb-0">U bent ingelogd als: <strong>${username}</strong> (Gebruiker)</p>
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
        
        // Laad recente rassen uit localStorage
        const lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        let recentBreedsHTML = '';
        
        if (lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="form-text mb-2" data-key="recentBreeds">Recent gebruikte rassen:</div>
                <div class="d-flex flex-wrap gap-2 mb-3">
            `;
            lastBreeds.forEach(breed => {
                recentBreedsHTML += `
                    <button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">
                        ${breed}
                    </button>
                `;
            });
            recentBreedsHTML += `</div>`;
        }
        
        return `
            <div class="modal fade" id="addDogModal" tabindex="-1" aria-labelledby="addDogModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="addDogModalLabel">
                                <i class="bi bi-plus-circle me-2"></i>
                                <span class="module-title" data-key="newDog">Nieuwe Hond Toevoegen</span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addDogForm">
                                <input type="hidden" id="fatherId" value="">
                                <input type="hidden" id="motherId" value="">
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="dogName" class="form-label">
                                                <span data-key="nameRequired">Naam *</span>
                                            </label>
                                            <input type="text" class="form-control" id="dogName" value="" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="pedigreeNumber" class="form-label">
                                                <span data-key="pedigreeNumber">Stamboomnummer *</span>
                                            </label>
                                            <input type="text" class="form-control" id="pedigreeNumber" value="" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="breed" class="form-label">
                                                <span data-key="breedRequired">Ras *</span>
                                            </label>
                                            <input type="text" class="form-control" id="breed" value="" required>
                                            ${recentBreedsHTML}
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="gender" class="form-label">
                                                <span data-key="gender">Geslacht</span>
                                            </label>
                                            <select class="form-select" id="gender">
                                                <option value="">Selecteer geslacht...</option>
                                                <option value="reuen">Reu</option>
                                                <option value="teven">Teef</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3 position-relative">
                                            <label for="father" class="form-label">
                                                <span data-key="father">Vader</span>
                                            </label>
                                            <input type="text" class="form-control parent-input" id="father" 
                                                   value="" 
                                                   placeholder="Begin met typen om vader te zoeken..."
                                                   data-parent-type="father"
                                                   autocomplete="off">
                                            <div class="autocomplete-dropdown" id="fatherDropdown"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3 position-relative">
                                            <label for="mother" class="form-label">
                                                <span data-key="mother">Moeder</span>
                                            </label>
                                            <input type="text" class="form-control parent-input" id="mother" 
                                                   value="" 
                                                   placeholder="Begin met typen om moeder te zoeken..."
                                                   data-parent-type="mother"
                                                   autocomplete="off">
                                            <div class="autocomplete-dropdown" id="motherDropdown"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="birthDate" class="form-label">
                                                <span data-key="birthDate">Geboortedatum</span>
                                            </label>
                                            <input type="date" class="form-control" id="birthDate" value="">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="deathDate" class="form-label">
                                                <span data-key="deathDate">Overlijdensdatum</span>
                                            </label>
                                            <input type="date" class="form-control" id="deathDate" value="">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i>
                                    <span data-key="requiredFields">Velden met * zijn verplicht</span>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i>
                                <span class="module-text" data-key="cancel">Annuleren</span>
                            </button>
                            <button type="button" class="btn btn-primary" id="saveDogBtn">
                                <i class="bi bi-save me-1"></i>
                                <span class="module-text" data-key="saveDog">Hond Opslaan</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Setup event listeners voor deze module
     */
    setupEvents() {
        console.log('DogManager setupEvents called');
        
        // Vertaal de modal tekst
        setTimeout(() => {
            this.translateModal();
        }, 100);
        
        // Als gebruiker geen admin is, stop hier - geen extra events nodig
        if (!auth.isAdmin()) {
            const modal = document.getElementById('addDogModal');
            if (modal) {
                modal.addEventListener('shown.bs.modal', () => {
                    console.log('DogManager toegang geweigerd modal is nu zichtbaar');
                });
            }
            return;
        }
        
        // Alleen voor admins: laad honden en setup events
        this.loadAllDogs().then(() => {
            // Event listener voor opslaan knop
            const saveBtn = document.getElementById('saveDogBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    this.saveDog();
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
            this.setupParentAutocomplete();
        });
    }
    
    /**
     * Vertaal de modal tekst
     */
    translateModal() {
        const currentLang = localStorage.getItem('appLanguage') || 'nl';
        const translations = {
            nl: {
                newDog: "Nieuwe Hond Toevoegen",
                nameRequired: "Naam *",
                pedigreeNumber: "Stamboomnummer *",
                breedRequired: "Ras *",
                recentBreeds: "Recent gebruikte rassen",
                father: "Vader",
                mother: "Moeder",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                gender: "Geslacht",
                requiredFields: "Velden met * zijn verplicht",
                cancel: "Annuleren",
                saveDog: "Hond Opslaan",
                accessDenied: "Toegang Geweigerd",
                close: "Sluiten"
            },
            en: {
                newDog: "Add New Dog",
                nameRequired: "Name *",
                pedigreeNumber: "Pedigree number *",
                breedRequired: "Breed *",
                recentBreeds: "Recently used breeds",
                father: "Father",
                mother: "Mother",
                birthDate: "Birth date",
                deathDate: "Death date",
                gender: "Gender",
                requiredFields: "Fields with * are required",
                cancel: "Cancel",
                saveDog: "Save Dog",
                accessDenied: "Access Denied",
                close: "Close"
            },
            de: {
                newDog: "Neuen Hund hinzufügen",
                nameRequired: "Name *",
                pedigreeNumber: "Stammbaum-Nummer *",
                breedRequired: "Rasse *",
                recentBreeds: "Kürzlich verwendete Rassen",
                father: "Vater",
                mother: "Mutter",
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                gender: "Geschlecht",
                requiredFields: "Felder mit * sind Pflichtfelder",
                cancel: "Abbrechen",
                saveDog: "Hund speichern",
                accessDenied: "Zugriff Verweigert",
                close: "Schließen"
            }
        };
        
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[currentLang] && translations[currentLang][key]) {
                element.textContent = translations[currentLang][key];
            }
        });
        
        // Vertaal select opties
        const genderSelect = document.getElementById('gender');
        if (genderSelect) {
            const options = genderSelect.querySelectorAll('option');
            if (currentLang === 'en') {
                if (options[0]) options[0].textContent = "Select gender...";
                if (options[1]) options[1].textContent = "Male";
                if (options[2]) options[2].textContent = "Female";
            } else if (currentLang === 'de') {
                if (options[0]) options[0].textContent = "Geschlecht wählen...";
                if (options[1]) options[1].textContent = "Rüde";
                if (options[2]) options[2].textContent = "Hündin";
            }
        }
        
        // Vertaal placeholders
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        if (fatherInput && motherInput) {
            if (currentLang === 'en') {
                fatherInput.placeholder = "Start typing to search for father...";
                motherInput.placeholder = "Start typing to search for mother...";
            } else if (currentLang === 'de') {
                fatherInput.placeholder = "Beginnen Sie mit der Eingabe, um den Vater zu suchen...";
                motherInput.placeholder = "Beginnen Sie mit der Eingabe, um die Mutter zu suchen...";
            }
        }
    }
    
    /**
     * Laad alle honden voor autocomplete
     */
    async loadAllDogs() {
        try {
            this.allDogs = await this.db.getHonden();
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            console.log(`${this.allDogs.length} honden geladen voor autocomplete`);
        } catch (error) {
            console.error('Fout bij laden honden voor autocomplete:', error);
            this.allDogs = [];
        }
    }
    
    /**
     * Setup autocomplete voor ouder velden
     */
    setupParentAutocomplete() {
        console.log('Setting up parent autocomplete...');
        
        // Voeg CSS toe voor dropdowns
        this.addAutocompleteStyles();
        
        // Event listeners voor vader en moeder velden
        document.querySelectorAll('.parent-input').forEach(input => {
            const parentType = input.dataset.parentType;
            
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', () => {
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
    
    /**
     * Voeg CSS styles toe voor autocomplete
     */
    addAutocompleteStyles() {
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
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Toon autocomplete suggesties voor ouders
     */
    showParentAutocomplete(searchTerm, parentType) {
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) return;
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        const targetGender = parentType === 'father' ? 'reuen' : 'teven';
        const suggestions = this.allDogs.filter(dog => {
            if (!dog.naam) return false;
            const dogName = dog.naam.toLowerCase();
            const matchesSearch = dogName.includes(searchTerm);
            const matchesGender = !dog.geslacht || dog.geslacht === targetGender;
            return matchesSearch && matchesGender;
        }).slice(0, 8);
        
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
            item.addEventListener('click', () => {
                const dogId = item.getAttribute('data-id');
                const dogName = item.getAttribute('data-name');
                const input = document.getElementById(parentType);
                const idInput = document.getElementById(`${parentType}Id`);
                
                if (input) input.value = dogName;
                if (idInput) idInput.value = dogId;
                
                dropdown.style.display = 'none';
            });
        });
    }
    
    /**
     * Sla een nieuwe hond op
     */
    async saveDog() {
        if (!auth.isAdmin()) {
            this.showError("Alleen administrators mogen honden toevoegen");
            return;
        }
        
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Validatie
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError("Naam, stamboomnummer en ras zijn verplichte velden");
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        // Toon voortgang
        this.showProgress("Hond opslaan...");
        
        try {
            const newId = await this.db.voegHondToe(dogData);
            this.hideProgress();
            this.showSuccess("Hond succesvol toegevoegd!");
            
            // Voeg toe aan lokale lijst voor toekomstige autocomplete
            dogData.id = newId;
            this.allDogs.push(dogData);
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            
            // Sluit modal na succes
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addDogModal'));
                if (modal) modal.hide();
                
                // Reset formulier
                document.getElementById('addDogForm').reset();
                document.getElementById('fatherId').value = '';
                document.getElementById('motherId').value = '';
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('Error saving dog:', error);
            this.showError(`Fout bij opslaan: ${error.message}`);
        }
    }
    
    /**
     * Voeg ras toe aan recent gebruikte rassen
     */
    addToLastBreeds(breed) {
        if (!breed || breed.trim() === '') return;
        
        const breedStr = breed.trim();
        let lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        const index = lastBreeds.indexOf(breedStr);
        
        if (index > -1) {
            lastBreeds.splice(index, 1);
        }
        
        lastBreeds.unshift(breedStr);
        
        if (lastBreeds.length > 5) {
            lastBreeds = lastBreeds.slice(0, 5);
        }
        
        localStorage.setItem('lastBreeds', JSON.stringify(lastBreeds));
    }
    
    /**
     * Helper methodes voor notifications
     */
    showError(message) {
        if (typeof appUI !== 'undefined' && appUI.showNotification) {
            appUI.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }
    
    showSuccess(message) {
        if (typeof appUI !== 'undefined' && appUI.showNotification) {
            appUI.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }
    
    showProgress(message) {
        if (typeof appUI !== 'undefined' && appUI.showNotification) {
            appUI.showNotification(message, 'info', true);
        }
    }
    
    hideProgress() {
        if (typeof appUI !== 'undefined' && appUI.hideNotification) {
            appUI.hideNotification();
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