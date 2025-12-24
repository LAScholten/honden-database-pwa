/**
 * Nest Management Module
 * Beheert toevoegen en bewerken van nesten
 */

class LitterManager {
    constructor() {
        console.log('LitterManager constructor aangeroepen');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = []; // Voor autocomplete van ouders
        this.translations = {
            nl: {
                // Form velden
                name: "Naam",
                nameRequired: "Naam *",
                pedigreeNumber: "Stamboomnummer *",
                breed: "Ras",
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
                hipDysplasia: "Heupdysplasie",
                hipGrades: "Selecteer graad...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Elleboogdysplasie",
                elbowGrades: "Selecteer graad...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Niet bekend)",
                patellaLuxation: "Patella Luxatie",
                patellaGrades: "Selecteer graad...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Ogen",
                eyesFree: "Vrij",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Overig",
                eyesExplanation: "Verklaring overig",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Selecteer status...",
                dandyFreeDNA: "Vrij op DNA",
                dandyFreeParents: "Vrij op ouders",
                dandyCarrier: "Drager",
                dandyAffected: "Lijder",
                thyroid: "Schildklier",
                thyroidNegative: "Tgaa Negatief",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                addPhoto: "Foto toevoegen",
                chooseFile: "Kies bestand",
                noFileChosen: "Geen bestand gekozen",
                remarks: "Opmerkingen",
                requiredFields: "Velden met * zijn verplicht",
                saveDog: "Puppy Toevoegen",
                cancel: "Annuleren",
                delete: "Verwijderen",
                choose: "Kies...",
                close: "Sluiten",
                
                // Nest specifieke teksten
                litterTitle: "Nieuw Nest Toevoegen",
                puppyCount: "Aantal Puppy's",
                addPuppy: "Puppy Toevoegen",
                saveLitter: "Nest Opslaan",
                puppyName: "Puppy Naam",
                puppyNameRequired: "Puppy Naam *",
                puppyPedigreeNumber: "Puppy Stamboomnummer *",
                puppyAdded: "Puppy toegevoegd",
                litterSaved: "Nest succesvol opgeslagen",
                
                // Alerts
                adminOnly: "Alleen administrators mogen nesten toevoegen/bewerken",
                fieldsRequired: "Naam, stamboomnummer en ras zijn verplichte velden",
                savingDog: "Nest opslaan...",
                dogAdded: "Nest succesvol toegevoegd!",
                dogUpdated: "Nest succesvol bijgewerkt!",
                dogDeleted: "Nest succesvol verwijderen!",
                addFailed: "Fout bij toevoegen nest: ",
                updateFailed: "Fout bij bijwerken nest: ",
                deleteFailed: "Fout bij verwijderen nest: ",
                confirmDelete: "Weet u zeker dat u dit nest wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                photoError: "Fout bij uploaden foto: "
            },
            en: {
                // Form fields
                name: "Name",
                nameRequired: "Name *",
                pedigreeNumber: "Pedigree number *",
                breed: "Breed",
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
                hipDysplasia: "Hip Dysplasia",
                hipGrades: "Select grade...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Elbow Dysplasia",
                elbowGrades: "Select grade...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Not known)",
                patellaLuxation: "Patella Luxation",
                patellaGrades: "Select grade...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Eyes",
                eyesFree: "Free",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Other",
                eyesExplanation: "Other explanation",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Select status...",
                dandyFreeDNA: "Free on DNA",
                dandyFreeParents: "Free on parents",
                dandyCarrier: "Carrier",
                dandyAffected: "Affected",
                thyroid: "Thyroid",
                thyroidNegative: "Tgaa Negative",
                thyroidPositive: "Tgaa Positive",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                addPhoto: "Add photo",
                chooseFile: "Choose file",
                noFileChosen: "No file chosen",
                remarks: "Remarks",
                requiredFields: "Fields with * are required",
                saveDog: "Save Dog",
                cancel: "Cancel",
                delete: "Delete",
                choose: "Choose...",
                close: "Close",
                
                // Litter specific texts
                litterTitle: "Add New Litter",
                puppyCount: "Number of Puppies",
                addPuppy: "Add Puppy",
                saveLitter: "Save Litter",
                puppyName: "Puppy Name",
                puppyNameRequired: "Puppy Name *",
                puppyPedigreeNumber: "Puppy Pedigree Number *",
                puppyAdded: "Puppy added",
                litterSaved: "Litter successfully saved",
                
                // Alerts
                adminOnly: "Only administrators can add/edit litters",
                fieldsRequired: "Name, pedigree number and breed are required fields",
                savingDog: "Saving litter...",
                dogAdded: "Litter successfully added!",
                dogUpdated: "Litter successfully updated!",
                dogDeleted: "Litter successfully deleted!",
                addFailed: "Error adding litter: ",
                updateFailed: "Error updating litter: ",
                deleteFailed: "Error deleting litter: ",
                confirmDelete: "Are you sure you want to delete this litter?",
                photoAdded: "Photo added",
                photoError: "Error uploading photo: "
            },
            de: {
                // Formular Felder
                name: "Name",
                nameRequired: "Name *",
                pedigreeNumber: "Stammbaum-Nummer *",
                breed: "Rasse",
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
                hipDysplasia: "Hüftdysplasie",
                hipGrades: "Grad wählen...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Ellbogendysplasie",
                elbowGrades: "Grad wählen...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Nicht bekannt)",
                patellaLuxation: "Patella Luxation",
                patellaGrades: "Grad wählen...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Augen",
                eyesFree: "Frei",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Andere",
                eyesExplanation: "Erklärung andere",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Status wählen...",
                dandyFreeDNA: "Frei auf DNA",
                dandyFreeParents: "Frei op ouders",
                dandyCarrier: "Träger",
                dandyAffected: "Betroffen",
                thyroid: "Schilddrüse",
                thyroidNegative: "Tgaa Negativ",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                addPhoto: "Foto hinzufügen",
                chooseFile: "Datei wählen",
                noFileChosen: "Keine Datei gewählt",
                remarks: "Bemerkungen",
                requiredFields: "Felder mit * sind Pflichtfelder",
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                choose: "Wählen...",
                close: "Schließen",
                
                // Wurf spezifische Texte
                litterTitle: "Neuen Wurf hinzufügen",
                puppyCount: "Anzahl Welpen",
                addPuppy: "Welpe hinzufügen",
                saveLitter: "Wurf speichern",
                puppyName: "Welpen Name",
                puppyNameRequired: "Welpen Name *",
                puppyPedigreeNumber: "Welpen Stammbaum-Nummer *",
                puppyAdded: "Welpe hinzugefügt",
                litterSaved: "Wurf erfolgreich gespeichert",
                
                // Meldungen
                adminOnly: "Nur Administratoren können Würfe hinzufügen/bearbeiten",
                fieldsRequired: "Name, Stammbaum-Nummer und Rasse sind Pflichtfelder",
                savingDog: "Wurf wird gespeichert...",
                dogAdded: "Wurf erfolgreich hinzugefügt!",
                dogUpdated: "Wurf erfolgreich aktualisiert!",
                dogDeleted: "Wurf erfolgreich gelöscht!",
                addFailed: "Fehler beim Hinzufügen des Wurfes: ",
                updateFailed: "Fehler beim Aktualisieren des Wurfes: ",
                deleteFailed: "Fehler beim Löschen des Wurfes: ",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Wurf löschen möchten?",
                photoAdded: "Foto hinzugefügt",
                photoError: "Fehler beim Hochladen des Fotos: "
            }
        };
        
        // Referenties naar externe objecten (worden later geïnjecteerd)
        this.db = null;
        this.auth = null;
        this.isInitialized = false;
        this.puppies = []; // Array voor puppy gegevens
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    /**
     * Injecteer database en auth objecten
     */
    injectDependencies(db, auth) {
        console.log('LitterManager: injectDependencies aangeroepen');
        this.db = db;
        this.auth = auth;
        this.isInitialized = true;
        console.log('LitterManager: Dependencies geïnjecteerd - db:', !!this.db, 'auth:', !!this.auth);
    }
    
    /**
     * Initialiseer LitterManager - dit MOET aangeroepen worden voordat events worden opgezet
     */
    async initialize() {
        console.log('LitterManager: initialize aangeroepen');
        
        if (!this.db || !this.auth) {
            console.error('LitterManager: Dependencies niet geïnjecteerd!');
            throw new Error('LitterManager is niet geïnitialiseerd met dependencies');
        }
        
        // Laad honden voor autocomplete
        await this.loadAllDogs();
        
        console.log('LitterManager: Initialisatie voltooid');
        return true;
    }
    
    getFormHTML() {
        console.log('LitterManager: getFormHTML aangeroepen');
        
        const t = this.t.bind(this);
        
        // Genereer recente rassen opties
        let recentBreedsHTML = '';
        if (this.lastBreeds && this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="form-text mb-2">${t('recentBreeds')}:</div>
                <div class="d-flex flex-wrap gap-2 mb-3" id="recentBreedsContainer">
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
            <h5 class="mb-3 text-center" style="color: #e74c3c;">
                <i class="bi bi-people me-2"></i>${t('litterTitle')}
            </h5>
            
            <!-- Ouders Sectie -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="bi bi-gender-ambiguous me-2"></i>Ouders</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3 parent-input-wrapper">
                                <label for="father" class="form-label">${t('father')} *</label>
                                <input type="text" class="form-control" id="father" 
                                       placeholder="Begin met typen om vader te zoeken..."
                                       data-parent-type="father"
                                       autocomplete="off">
                                <input type="hidden" id="fatherId" value="">
                                <div class="autocomplete-dropdown" id="fatherDropdown" style="display: none;"></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3 parent-input-wrapper">
                                <label for="mother" class="form-label">${t('mother')} *</label>
                                <input type="text" class="form-control" id="mother" 
                                       placeholder="Begin met typen om moeder te zoeken..."
                                       data-parent-type="mother"
                                       autocomplete="off">
                                <input type="hidden" id="motherId" value="">
                                <div class="autocomplete-dropdown" id="motherDropdown" style="display: none;"></div>
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
                                <label for="birthDate" class="form-label">${t('birthDate')} *</label>
                                <input type="date" class="form-control" id="birthDate" value="" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="litterRemarks" class="form-label">${t('remarks')} (voor het hele nest)</label>
                        <textarea class="form-control" id="litterRemarks" rows="2" placeholder="Opmerkingen over het nest"></textarea>
                    </div>
                </div>
            </div>
            
            <!-- Puppy's Sectie -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="bi bi-heart me-2"></i>Puppy's</h6>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="puppyCount" class="form-label">${t('puppyCount')}</label>
                            <select class="form-select" id="puppyCount">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                        </div>
                        <div class="col-md-6 d-flex align-items-end">
                            <button type="button" class="btn btn-outline-primary" id="generatePuppyFieldsBtn">
                                <i class="bi bi-plus-circle me-1"></i> ${t('addPuppy')}
                            </button>
                        </div>
                    </div>
                    
                    <div id="puppyFieldsContainer">
                        <!-- Puppy velden worden hier gegenereerd -->
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i> Selecteer eerst het aantal puppy's en klik op "${t('addPuppy')}"
                        </div>
                    </div>
                    
                    <div id="puppyList" class="mt-3" style="display: none;">
                        <h6>Puppy's die toegevoegd worden:</h6>
                        <div id="puppyListItems" class="list-group">
                            <!-- Puppy lijst items komen hier -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Opslaan Sectie -->
            <div class="text-end">
                <button type="button" class="btn btn-primary" id="saveLitterBtn">
                    <i class="bi bi-save me-1"></i> ${t('saveLitter')}
                </button>
            </div>
            
            <style>
                .puppy-field-group {
                    border: 1px solid #dee2e6;
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 15px;
                    background-color: #f8f9fa;
                }
                
                .puppy-field-group h6 {
                    color: #e74c3c;
                    margin-bottom: 15px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .puppy-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    margin-bottom: 5px;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                }
                
                .puppy-list-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: calc(100% - 2px);
                    margin-top: 2px;
                }
                
                .autocomplete-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: bold;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.85em;
                    color: #666;
                }
                
                .parent-input-wrapper {
                    position: relative;
                }
            </style>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager: setupEvents aangeroepen');
        
        if (!this.isInitialized) {
            console.error('LitterManager: Niet geïnitialiseerd! Roep eerst initialize() aan');
            return;
        }
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
        
        // Event listener voor puppy count
        const generateBtn = document.getElementById('generatePuppyFieldsBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generatePuppyFields();
            });
        }
        
        // Event listener voor save button
        const saveBtn = document.getElementById('saveLitterBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveLitter();
            });
        }
        
        // Event delegation voor recent breeds knoppen
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('recent-breed-btn')) {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('breed');
                if (breedInput) {
                    breedInput.value = breed;
                    console.log('LitterManager: Ras geselecteerd:', breed);
                }
            }
        });
        
        console.log('LitterManager: Alle events ingesteld');
    }
    
    setupParentAutocomplete() {
        console.log('LitterManager: setupParentAutocomplete aangeroepen');
        
        // Event listeners voor vader en moeder velden
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        
        if (fatherInput) {
            fatherInput.addEventListener('focus', () => {
                console.log('LitterManager: Vader input focus');
                // Zorg dat honden geladen zijn
                this.loadAllDogs();
            });
            
            fatherInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                this.showParentAutocomplete(searchTerm, 'father');
            });
            
            fatherInput.addEventListener('blur', () => {
                setTimeout(() => {
                    const dropdown = document.getElementById('fatherDropdown');
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            });
        }
        
        if (motherInput) {
            motherInput.addEventListener('focus', () => {
                console.log('LitterManager: Moeder input focus');
                this.loadAllDogs();
            });
            
            motherInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                this.showParentAutocomplete(searchTerm, 'mother');
            });
            
            motherInput.addEventListener('blur', () => {
                setTimeout(() => {
                    const dropdown = document.getElementById('motherDropdown');
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            });
        }
        
        // Klik buiten dropdown om te verbergen
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input-wrapper')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    showParentAutocomplete(searchTerm, parentInputId) {
        console.log('LitterManager: showParentAutocomplete voor', parentInputId, 'zoekterm:', searchTerm);
        
        const dropdownId = parentInputId + 'Dropdown';
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) {
            console.error('LitterManager: Dropdown niet gevonden voor', parentInputId);
            return;
        }
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        console.log('LitterManager: Aantal honden beschikbaar voor autocomplete:', this.allDogs.length);
        
        // Bepaal welk geslacht we zoeken
        const isFather = parentInputId === 'father';
        
        // Filter honden voor autocomplete
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam.toLowerCase();
            const matchesSearch = dogName.includes(searchTerm);
            
            // Filter op geslacht
            if (isFather) {
                return matchesSearch && dog.geslacht === 'reuen';
            } else {
                return matchesSearch && dog.geslacht === 'teven';
            }
        }).slice(0, 8); // Max 8 suggesties
        
        console.log('LitterManager: Aantal suggesties:', suggestions.length);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            html += `
                <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}" data-pedigree="${dog.stamboomnr || ''}">
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
                const dogId = item.getAttribute('data-id');
                const dogName = item.getAttribute('data-name');
                const input = document.getElementById(parentInputId);
                const idInput = document.getElementById(parentInputId + 'Id');
                
                if (input) {
                    input.value = dogName;
                }
                if (idInput) {
                    idInput.value = dogId;
                }
                
                dropdown.style.display = 'none';
                console.log('LitterManager: Ouder geselecteerd:', dogName, 'ID:', dogId);
            });
        });
    }
    
    generatePuppyFields() {
        const puppyCount = parseInt(document.getElementById('puppyCount').value);
        const puppyFieldsContainer = document.getElementById('puppyFieldsContainer');
        
        if (!puppyFieldsContainer) return;
        
        // Wis bestaande velden
        puppyFieldsContainer.innerHTML = '';
        
        // Genereer nieuwe velden
        for (let i = 1; i <= puppyCount; i++) {
            const puppyField = `
                <div class="puppy-field-group" data-puppy-index="${i}">
                    <h6><i class="bi bi-heart-fill me-2" style="color: #e74c3c;"></i>Puppy ${i}</h6>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="puppyName${i}" class="form-label">${this.t('puppyNameRequired')}</label>
                                <input type="text" class="form-control puppy-name" id="puppyName${i}" 
                                       data-index="${i}" placeholder="Bijv. Max" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="puppyPedigree${i}" class="form-label">${this.t('puppyPedigreeNumber')}</label>
                                <input type="text" class="form-control puppy-pedigree" id="puppyPedigree${i}" 
                                       data-index="${i}" placeholder="Stamboomnummer" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="puppyGender${i}" class="form-label">${this.t('gender')}</label>
                                <select class="form-select puppy-gender" id="puppyGender${i}" data-index="${i}">
                                    <option value="">${this.t('chooseGender')}</option>
                                    <option value="reuen">${this.t('male')}</option>
                                    <option value="teven">${this.t('female')}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="puppyRemarks${i}" class="form-label">${this.t('remarks')}</label>
                                <input type="text" class="form-control puppy-remarks" id="puppyRemarks${i}" 
                                       data-index="${i}" placeholder="Speciale kenmerken">
                            </div>
                        </div>
                    </div>
                    
                    <button type="button" class="btn btn-sm btn-outline-success add-puppy-to-list-btn" 
                            data-index="${i}" style="width: 100%;">
                        <i class="bi bi-check-circle me-1"></i> ${this.t('addPuppy')}
                    </button>
                </div>
            `;
            
            puppyFieldsContainer.insertAdjacentHTML('beforeend', puppyField);
        }
        
        // Voeg event listeners toe voor puppy toevoeg knoppen
        puppyFieldsContainer.querySelectorAll('.add-puppy-to-list-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                this.addPuppyToList(index);
            });
        });
    }
    
    addPuppyToList(index) {
        const name = document.getElementById(`puppyName${index}`).value.trim();
        const pedigree = document.getElementById(`puppyPedigree${index}`).value.trim();
        const gender = document.getElementById(`puppyGender${index}`).value;
        const remarks = document.getElementById(`puppyRemarks${index}`).value.trim();
        
        if (!name || !pedigree || !gender) {
            this.showError('Vul alle verplichte velden in voor puppy ' + index);
            return;
        }
        
        // Voeg puppy toe aan array
        this.puppies.push({
            index: parseInt(index),
            naam: name,
            stamboomnr: pedigree,
            geslacht: gender,
            opmerkingen: remarks,
            added: true
        });
        
        // Update puppy lijst
        this.updatePuppyList();
        
        // Markeer veld als toegevoegd
        const fieldGroup = document.querySelector(`.puppy-field-group[data-puppy-index="${index}"]`);
        if (fieldGroup) {
            fieldGroup.style.borderColor = '#28a745';
            fieldGroup.style.backgroundColor = '#f0fff4';
            
            const addBtn = fieldGroup.querySelector('.add-puppy-to-list-btn');
            if (addBtn) {
                addBtn.disabled = true;
                addBtn.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> ${this.t('puppyAdded')}`;
                addBtn.classList.remove('btn-outline-success');
                addBtn.classList.add('btn-success');
            }
        }
        
        this.showSuccess(`Puppy "${name}" toegevoegd aan nest`);
    }
    
    updatePuppyList() {
        const puppyList = document.getElementById('puppyList');
        const puppyListItems = document.getElementById('puppyListItems');
        
        if (!puppyList || !puppyListItems) return;
        
        // Toon puppy lijst
        puppyList.style.display = 'block';
        
        // Update lijst
        puppyListItems.innerHTML = '';
        
        this.puppies.forEach(puppy => {
            const genderIcon = puppy.geslacht === 'reuen' ? '♂' : '♀';
            const genderClass = puppy.geslacht === 'reuen' ? 'text-primary' : 'text-danger';
            
            const listItem = `
                <div class="puppy-list-item">
                    <div>
                        <strong>${puppy.naam}</strong> 
                        <span class="badge ${genderClass} ms-2">${genderIcon}</span>
                        <div class="text-muted small">${puppy.stamboomnr}</div>
                        ${puppy.opmerkingen ? `<div class="text-muted small">${puppy.opmerkingen}</div>` : ''}
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-danger remove-puppy-btn" data-index="${puppy.index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            
            puppyListItems.insertAdjacentHTML('beforeend', listItem);
        });
        
        // Voeg event listeners toe voor verwijder knoppen
        puppyListItems.querySelectorAll('.remove-puppy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remove-puppy-btn').getAttribute('data-index'));
                this.removePuppyFromList(index);
            });
        });
    }
    
    removePuppyFromList(index) {
        // Verwijder puppy uit array
        this.puppies = this.puppies.filter(puppy => puppy.index !== index);
        
        // Reset veld styling
        const fieldGroup = document.querySelector(`.puppy-field-group[data-puppy-index="${index}"]`);
        if (fieldGroup) {
            fieldGroup.style.borderColor = '#dee2e6';
            fieldGroup.style.backgroundColor = '#f8f9fa';
            
            const addBtn = fieldGroup.querySelector('.add-puppy-to-list-btn');
            if (addBtn) {
                addBtn.disabled = false;
                addBtn.innerHTML = `<i class="bi bi-check-circle me-1"></i> ${this.t('addPuppy')}`;
                addBtn.classList.remove('btn-success');
                addBtn.classList.add('btn-outline-success');
            }
        }
        
        // Update lijst
        this.updatePuppyList();
    }
    
    async saveLitter() {
        console.log('LitterManager: saveLitter aangeroepen');
        
        if (!this.auth) {
            console.error('LitterManager: Auth niet beschikbaar!');
            this.showError('Authenticatie niet beschikbaar');
            return;
        }
        
        if (!this.auth.isAdmin()) {
            console.log('LitterManager: Gebruiker is geen admin');
            this.showError(this.t('adminOnly'));
            return;
        }
        
        if (!this.db) {
            console.error('LitterManager: Database niet beschikbaar!');
            this.showError('Database niet beschikbaar');
            return;
        }
        
        // Valideer ouders
        const father = document.getElementById('father').value.trim();
        const fatherId = document.getElementById('fatherId').value;
        const mother = document.getElementById('mother').value.trim();
        const motherId = document.getElementById('motherId').value;
        const breed = document.getElementById('breed').value.trim();
        const birthDate = document.getElementById('birthDate').value;
        const litterRemarks = document.getElementById('litterRemarks').value.trim();
        
        if (!father || !fatherId) {
            this.showError('Selecteer een vader voor het nest');
            return;
        }
        
        if (!mother || !motherId) {
            this.showError('Selecteer een moeder voor het nest');
            return;
        }
        
        if (!breed) {
            this.showError('Ras is verplicht');
            return;
        }
        
        if (!birthDate) {
            this.showError('Geboortedatum is verplicht');
            return;
        }
        
        if (this.puppies.length === 0) {
            this.showError('Voeg minstens één puppy toe aan het nest');
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(breed);
        
        this.showProgress(this.t('savingDog'));
        
        try {
            let savedCount = 0;
            
            // Sla elke puppy op
            for (const puppy of this.puppies) {
                const dogData = {
                    naam: puppy.naam,
                    stamboomnr: puppy.stamboomnr,
                    ras: breed,
                    geslacht: puppy.geslacht,
                    vader: father,
                    vaderId: parseInt(fatherId),
                    moeder: mother,
                    moederId: parseInt(motherId),
                    geboortedatum: birthDate,
                    heupdysplasie: '',
                    elleboogdysplasie: '',
                    patella: '',
                    ogen: '',
                    ogenVerklaring: '',
                    dandyWalker: '',
                    schildklier: '',
                    schildklierVerklaring: '',
                    land: '',
                    postcode: '',
                    opmerkingen: puppy.opmerkingen || litterRemarks,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                console.log('LitterManager: Puppy data:', dogData);
                await this.db.voegHondToe(dogData);
                savedCount++;
            }
            
            this.hideProgress();
            this.showSuccess(`${this.t('litterSaved')}! ${savedCount} puppy's opgeslagen.`);
            
            // Reset formulier
            this.resetForm();
            
        } catch (error) {
            console.error('LitterManager: Fout bij opslaan nest:', error);
            this.hideProgress();
            this.showError(`${this.t('addFailed')}${error.message}`);
        }
    }
    
    resetForm() {
        // Reset alle formulier velden
        document.getElementById('father').value = '';
        document.getElementById('fatherId').value = '';
        document.getElementById('mother').value = '';
        document.getElementById('motherId').value = '';
        document.getElementById('breed').value = '';
        document.getElementById('birthDate').value = '';
        document.getElementById('litterRemarks').value = '';
        document.getElementById('puppyCount').value = '1';
        
        // Reset puppy velden
        document.getElementById('puppyFieldsContainer').innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> Selecteer eerst het aantal puppy's en klik op "${this.t('addPuppy')}"
            </div>
        `;
        
        // Reset puppy lijst
        document.getElementById('puppyList').style.display = 'none';
        document.getElementById('puppyListItems').innerHTML = '';
        
        // Reset puppy array
        this.puppies = [];
        
        // Reset dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
    
    addToLastBreeds(breed) {
        if (!breed || breed.trim() === '') return;
        
        const breedStr = breed.trim();
        
        // Initialiseer this.lastBreeds als het niet bestaat
        if (!this.lastBreeds) {
            this.lastBreeds = [];
        }
        
        const index = this.lastBreeds.indexOf(breedStr);
        
        if (index > -1) {
            this.lastBreeds.splice(index, 1);
        }
        
        this.lastBreeds.unshift(breedStr);
        
        if (this.lastBreeds.length > 5) {
            this.lastBreeds = this.lastBreeds.slice(0, 5);
        }
        
        localStorage.setItem('lastBreeds', JSON.stringify(this.lastBreeds));
        console.log('LitterManager: Ras toegevoegd aan recente rassen:', breedStr);
    }
    
    async loadAllDogs() {
        console.log('LitterManager: loadAllDogs aangeroepen');
        
        if (!this.db) {
            console.error('LitterManager: Database niet beschikbaar voor loadAllDogs!');
            return;
        }
        
        try {
            console.log('LitterManager: Laad honden van database...');
            this.allDogs = await this.db.getHonden();
            console.log('LitterManager: Aantal honden geladen:', this.allDogs.length);
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
        } catch (error) {
            console.error('LitterManager: Fout bij laden honden voor autocomplete:', error);
        }
    }
    
    showProgress(message) {
        console.log('LitterManager showProgress:', message);
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        } else {
            // Fallback
            alert(message);
        }
    }
    
    hideProgress() {
        console.log('LitterManager hideProgress');
        if (window.uiHandler && window.uiHandler.hideProgress) {
            window.uiHandler.hideProgress();
        }
    }
    
    showSuccess(message) {
        console.log('LitterManager showSuccess:', message);
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message);
        } else {
            alert(message);
        }
    }
    
    showError(message) {
        console.error('LitterManager showError:', message);
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message);
        } else {
            alert(message);
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}