// js/modules/DogManager.js

/**
 * Hond Management Module
 * Beheert toevoegen van nieuwe honden
 */

class DogManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = [];
        this.translations = {
            nl: {
                newDog: "Nieuwe Hond Toevoegen",
                editDog: "Hond Bewerken",
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
                delete: "Verwijderen",
                requiredFields: "Velden met * zijn verplicht",
                adminOnly: "Alleen administrators mogen honden toevoegen",
                fieldsRequired: "Naam, stamboomnummer en ras zijn verplichte velden",
                savingDog: "Hond opslaan...",
                dogAdded: "Hond succesvol toegevoegd!",
                dogUpdated: "Hond succesvol bijgewerkt!",
                dogDeleted: "Hond succesvol verwijderd!",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                accessDenied: "Toegang Geweigerd",
                insufficientRights: "Onvoldoende rechten",
                userFunctions: "Beschikbare functies voor gebruikers",
                searchDogs: "Honden zoeken en bekijken",
                viewPhotos: "Foto galerij bekijken",
                managePrivateInfo: "Privé informatie beheren",
                importExport: "Data importeren/exporteren",
                close: "Sluiten",
                fatherSearch: "Begin met typen om vader te zoeken...",
                motherSearch: "Begin met typen om moeder te zoeken..."
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
                adminOnly: "Only administrators can add dogs",
                fieldsRequired: "Name, pedigree number and breed are required fields",
                savingDog: "Saving dog...",
                dogAdded: "Dog successfully added!",
                dogUpdated: "Dog successfully updated!",
                dogDeleted: "Dog successfully deleted!",
                confirmDelete: "Are you sure you want to delete this dog?",
                accessDenied: "Access Denied",
                insufficientRights: "Insufficient rights",
                userFunctions: "Available functions for users",
                searchDogs: "Search and view dogs",
                viewPhotos: "View photo gallery",
                managePrivateInfo: "Manage private information",
                importExport: "Import/export data",
                close: "Close",
                fatherSearch: "Start typing to search for father...",
                motherSearch: "Start typing to search for mother..."
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
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                gender: "Geschlecht",
                chooseGender: "Geschlecht wählen...",
                male: "Rüde",
                female: "Hündin",
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                requiredFields: "Felder mit * sind Pflichtfelder",
                adminOnly: "Nur Administratoren können Hunde hinzufügen",
                fieldsRequired: "Name, Stammbaum-Nummer und Rasse sind Pflichtfelder",
                savingDog: "Hund wird gespeichert...",
                dogAdded: "Hund erfolgreich hinzugefügt!",
                dogUpdated: "Hund erfolgreich aktualisiert!",
                dogDeleted: "Hund erfolgreich gelöscht!",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Hund löschen möchten?",
                accessDenied: "Zugriff Verweigert",
                insufficientRights: "Unzureichende Rechte",
                userFunctions: "Verfügbare Funktionen für Benutzer",
                searchDogs: "Hunde suchen und anzeigen",
                viewPhotos: "Foto-Galerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Daten importieren/exportieren",
                close: "Schließen",
                fatherSearch: "Beginnen Sie mit der Eingabe, um den Vater zu suchen...",
                motherSearch: "Beginnen Sie mit der Eingabe, um die Mutter zu suchen..."
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    getModalHTML() {
        // Controleer of gebruiker admin is - toon anders toegang geweigerd
        if (!auth.isAdmin()) {
            const username = auth.getCurrentUser().username;
            
            return `
                <div class="modal fade" id="addDogModal" tabindex="-1" aria-labelledby="addDogModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="addDogModalLabel">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    ${this.t('accessDenied')}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-danger">
                                    <h5><i class="bi bi-shield-lock"></i> ${this.t('insufficientRights')}</h5>
                                    <p>U heeft geen toestemming om nieuwe honden toe te voegen. Alleen administrators kunnen deze functie gebruiken.</p>
                                    <p class="mb-0">U bent ingelogd als: <strong>${username}</strong> (Gebruiker)</p>
                                </div>
                                
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h6><i class="bi bi-info-circle text-primary"></i> ${this.t('userFunctions')}</h6>
                                        <ul>
                                            <li>${this.t('searchDogs')}</li>
                                            <li>${this.t('viewPhotos')}</li>
                                            <li>${this.t('managePrivateInfo')}</li>
                                            <li>${this.t('importExport')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-1"></i>
                                    ${this.t('close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Voor admins: toon normaal formulier
        const t = this.t.bind(this);
        
        let recentBreedsHTML = '';
        if (this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="form-text mb-2">${t('recentBreeds')}:</div>
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
            <div class="modal fade" id="addDogModal" tabindex="-1" aria-labelledby="addDogModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="addDogModalLabel">
                                <i class="bi bi-plus-circle"></i> ${t('newDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addDogForm">
                                <input type="hidden" id="fatherId" value="">
                                <input type="hidden" id="motherId" value="">
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="dogName" class="form-label">${t('nameRequired')}</label>
                                            <input type="text" class="form-control" id="dogName" value="" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="pedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                                            <input type="text" class="form-control" id="pedigreeNumber" value="" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="breed" class="form-label">${t('breedRequired')}</label>
                                            <input type="text" class="form-control" id="breed" value="" required>
                                            ${recentBreedsHTML}
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="gender" class="form-label">${t('gender')}</label>
                                            <select class="form-select" id="gender">
                                                <option value="">${t('chooseGender')}</option>
                                                <option value="reuen">${t('male')}</option>
                                                <option value="teven">${t('female')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3 position-relative">
                                            <label for="father" class="form-label">${t('father')}</label>
                                            <input type="text" class="form-control parent-input" id="father" 
                                                   value="" 
                                                   placeholder="${t('fatherSearch')}"
                                                   data-parent-type="father"
                                                   autocomplete="off">
                                            <div class="autocomplete-dropdown" id="fatherDropdown"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3 position-relative">
                                            <label for="mother" class="form-label">${t('mother')}</label>
                                            <input type="text" class="form-control parent-input" id="mother" 
                                                   value="" 
                                                   placeholder="${t('motherSearch')}"
                                                   data-parent-type="mother"
                                                   autocomplete="off">
                                            <div class="autocomplete-dropdown" id="motherDropdown"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="birthDate" class="form-label">${t('birthDate')}</label>
                                            <input type="date" class="form-control" id="birthDate" value="">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="deathDate" class="form-label">${t('deathDate')}</label>
                                            <input type="date" class="form-control" id="deathDate" value="">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i>
                                    ${t('requiredFields')}
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('cancel')}</button>
                            <button type="button" class="btn btn-primary" id="saveDogBtn">
                                ${t('saveDog')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
    
    setupEvents() {
        console.log('DogManager setupEvents aangeroepen');
        
        // Als gebruiker geen admin is, stop hier - er zijn geen events nodig voor de toegang geweigerd modal
        if (!auth.isAdmin()) {
            console.log('Gebruiker is geen admin, geen events nodig voor DogManager');
            return;
        }
        
        // Laad honden voor autocomplete (alleen voor admins)
        this.loadAllDogs();
        
        // Event listeners voor formulier
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
        
        // Setup autocomplete voor ouders (wacht even tot DOM geladen is)
        setTimeout(() => {
            this.setupParentAutocomplete();
        }, 100);
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
            this.showError(this.t('adminOnly'));
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
        
        console.log('Saving dog data:', dogData);
        
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress(this.t('savingDog'));
        
        try {
            const newId = await this.db.voegHondToe(dogData);
            console.log('New dog added with ID:', newId);
            this.hideProgress();
            this.showSuccess(this.t('dogAdded'));
            
            // Voeg de nieuwe hond toe aan de lokale lijst voor toekomstige autocomplete
            dogData.id = newId;
            this.allDogs.push(dogData);
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addDogModal'));
                if (modal) modal.hide();
                
                // Reset het formulier
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
}