// js/modules/DogManager.js

/**
 * DogManager - Module voor het toevoegen van nieuwe honden
 */
class DogManager extends BaseModule {
    constructor() {
        super('dog', 'Nieuwe Hond Toevoegen');
        console.log('DogManager geïnitialiseerd');
    }
    
    /**
     * Render de module interface
     */
    getModalHTML(dogData = null) {
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        
        if (!isAdmin) {
            const currentLang = localStorage.getItem('appLanguage') || 'nl';
            const translations = {
                nl: {
                    accessDenied: "Toegang Geweigerd",
                    insufficientRights: "Onvoldoende rechten",
                    userFunctions: "Beschikbare functies voor gebruikers",
                    searchDogs: "Honden zoeken en bekijken",
                    viewPhotos: "Foto galerij bekijken",
                    managePrivateInfo: "Privé informatie beheren",
                    importExport: "Data importeren/exporteren",
                    close: "Sluiten"
                },
                en: {
                    accessDenied: "Access Denied",
                    insufficientRights: "Insufficient rights",
                    userFunctions: "Available functions for users",
                    searchDogs: "Search and view dogs",
                    viewPhotos: "View photo gallery",
                    managePrivateInfo: "Manage private information",
                    importExport: "Import/export data",
                    close: "Close"
                },
                de: {
                    accessDenied: "Zugriff Verweigert",
                    insufficientRights: "Unzureichende Rechte",
                    userFunctions: "Verfügbare Funktionen für Benutzer",
                    searchDogs: "Hunde suchen und anzeigen",
                    viewPhotos: "Foto-Galerie anzeigen",
                    managePrivateInfo: "Private Informationen verwalten",
                    importExport: "Daten importieren/exportieren",
                    close: "Schließen"
                }
            };
            
            const t = translations[currentLang] || translations.nl;
            const username = auth.getCurrentUser().username;
            
            return `
                <div class="modal fade" id="dogModal" tabindex="-1" aria-labelledby="dogModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="dogModalLabel">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    ${t.accessDenied}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-danger">
                                    <h5><i class="bi bi-shield-lock"></i> ${t.insufficientRights}</h5>
                                    <p>U heeft geen toestemming om nieuwe honden toe te voegen. Alleen administrators kunnen deze functie gebruiken.</p>
                                    <p class="mb-0">U bent ingelogd als: <strong>${username}</strong> (Gebruiker)</p>
                                </div>
                                
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h6><i class="bi bi-info-circle text-primary"></i> ${t.userFunctions}</h6>
                                        <ul>
                                            <li>${t.searchDogs}</li>
                                            <li>${t.viewPhotos}</li>
                                            <li>${t.managePrivateInfo}</li>
                                            <li>${t.importExport}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-1"></i>
                                    ${t.close}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Als gebruiker admin is, toon het formulier voor nieuwe hond
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
                chooseGender: "Selecteer geslacht...",
                male: "Reu",
                female: "Teef",
                saveDog: "Hond Opslaan",
                cancel: "Annuleren",
                requiredFields: "Velden met * zijn verplicht",
                fatherSearch: "Begin met typen om vader te zoeken...",
                motherSearch: "Begin met typen om moeder te zoeken..."
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
                chooseGender: "Select gender...",
                male: "Male",
                female: "Female",
                saveDog: "Save Dog",
                cancel: "Cancel",
                requiredFields: "Fields with * are required",
                fatherSearch: "Start typing to search for father...",
                motherSearch: "Start typing to search for mother..."
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
                chooseGender: "Geschlecht wählen...",
                male: "Rüde",
                female: "Hündin",
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                requiredFields: "Felder mit * zijn Pflichtfelder",
                fatherSearch: "Beginnen Sie mit der Eingabe, um den Vater zu suchen...",
                motherSearch: "Beginnen Sie mit der Eingabe, um die Mutter zu suchen..."
            }
        };
        
        const t = translations[currentLang] || translations.nl;
        const data = dogData || {};
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        
        let recentBreedsHTML = '';
        if (this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="form-text mb-2">${t.recentBreeds}:</div>
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
                                <i class="bi bi-plus-circle"></i> ${t.newDog}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addDogForm">
                                <input type="hidden" id="fatherId" value="${data.vaderId || ''}">
                                <input type="hidden" id="motherId" value="${data.moederId || ''}">
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="dogName" class="form-label">${t.nameRequired}</label>
                                            <input type="text" class="form-control" id="dogName" value="" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="pedigreeNumber" class="form-label">${t.pedigreeNumber}</label>
                                            <input type="text" class="form-control" id="pedigreeNumber" value="" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="breed" class="form-label">${t.breedRequired}</label>
                                            <input type="text" class="form-control" id="breed" value="" required>
                                            ${recentBreedsHTML}
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="gender" class="form-label">${t.gender}</label>
                                            <select class="form-select" id="gender">
                                                <option value="">${t.chooseGender}</option>
                                                <option value="reuen">${t.male}</option>
                                                <option value="teven">${t.female}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3 position-relative">
                                            <label for="father" class="form-label">${t.father}</label>
                                            <input type="text" class="form-control parent-input" id="father" 
                                                   value="" 
                                                   placeholder="${t.fatherSearch}"
                                                   data-parent-type="father"
                                                   autocomplete="off">
                                            <div class="autocomplete-dropdown" id="fatherDropdown"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3 position-relative">
                                            <label for="mother" class="form-label">${t.mother}</label>
                                            <input type="text" class="form-control parent-input" id="mother" 
                                                   value="" 
                                                   placeholder="${t.motherSearch}"
                                                   data-parent-type="mother"
                                                   autocomplete="off">
                                            <div class="autocomplete-dropdown" id="motherDropdown"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="birthDate" class="form-label">${t.birthDate}</label>
                                            <input type="date" class="form-control" id="birthDate" value="">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="deathDate" class="form-label">${t.deathDate}</label>
                                            <input type="date" class="form-control" id="deathDate" value="">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i>
                                    ${t.requiredFields}
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i>
                                ${t.cancel}
                            </button>
                            <button type="button" class="btn btn-primary" id="saveDogBtn">
                                <i class="bi bi-save"></i> ${t.saveDog}
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
        console.log('DogManager setupEvents aangeroepen');
        
        // Als gebruiker geen admin is, kunnen we stoppen hier
        if (!auth.isAdmin()) {
            console.log('Gebruiker is geen admin, geen events nodig voor DogManager');
            return;
        }
        
        // Laad honden voor autocomplete (alleen voor admins)
        this.loadAllDogs();
        
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
        setTimeout(() => {
            this.setupParentAutocomplete();
        }, 100);
    }
    
    async loadAllDogs() {
        if (!this.allDogs || this.allDogs.length === 0) {
            try {
                this.allDogs = await this.db.getHonden();
                this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
                console.log(`${this.allDogs.length} honden geladen voor autocomplete`);
            } catch (error) {
                console.error('Fout bij laden honden voor autocomplete:', error);
            }
        }
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
    
    async saveDog() {
        if (!auth.isAdmin()) {
            this.showError("Alleen administrators mogen nieuwe honden toevoegen");
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
        
        console.log('Saving new dog data:', dogData);
        
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError("Naam, stamboomnummer en ras zijn verplichte velden");
            return;
        }
        
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress("Hond opslaan...");
        
        try {
            const newId = await this.db.voegHondToe(dogData);
            console.log('New dog added with ID:', newId);
            this.hideProgress();
            this.showSuccess("Hond succesvol toegevoegd!");
            
            // Voeg de nieuwe hond toe aan de lokale lijst voor toekomstige autocomplete
            dogData.id = newId;
            this.allDogs.push(dogData);
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('dogModal'));
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