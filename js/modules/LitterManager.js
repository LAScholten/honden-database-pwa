/**
 * Nest Management Module
 * Beheert toevoegen en bewerken van nesten
 */

class LitterManager {
    constructor() {
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
                saveDog: "Nest Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                choose: "Kies...",
                close: "Sluiten",
                
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
                saveDog: "Save Litter",
                cancel: "Cancel",
                delete: "Delete",
                choose: "Choose...",
                close: "Close",
                
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
                thyroidPositive: "Tgaa Positiv",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                addPhoto: "Foto hinzufügen",
                chooseFile: "Datei wählen",
                noFileChosen: "Keine Datei gewählt",
                remarks: "Bemerkungen",
                requiredFields: "Felder mit * sind Pflichtfelder",
                saveDog: "Wurf speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                choose: "Wählen...",
                close: "Schließen",
                
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
        this.db = db;
        this.auth = auth;
    }
    
    getFormHTML(litterData = null) {
        const t = this.t.bind(this);
        const data = litterData || {};
        
        // Genereer recente rassen opties
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
            <form id="addDogForm">
                <input type="hidden" id="fatherId" value="${data.vaderId || ''}">
                <input type="hidden" id="motherId" value="${data.moederId || ''}">
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogName" class="form-label">${t('nameRequired')}</label>
                            <input type="text" class="form-control" id="dogName" value="${data.naam || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="pedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                            <input type="text" class="form-control" id="pedigreeNumber" value="${data.stamboomnr || ''}" required>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="breed" class="form-label">${t('breedRequired')}</label>
                            <input type="text" class="form-control" id="breed" value="${data.ras || ''}" required>
                            ${recentBreedsHTML}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="gender" class="form-label">${t('gender')}</label>
                            <select class="form-select" id="gender">
                                <option value="">${t('chooseGender')}</option>
                                <option value="reuen" ${data.geslacht === 'reuen' ? 'selected' : ''}>${t('male')}</option>
                                <option value="teven" ${data.geslacht === 'teven' ? 'selected' : ''}>${t('female')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="father" class="form-label">${t('father')}</label>
                            <input type="text" class="form-control" id="father" 
                                   value="${data.vader || ''}" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="father"
                                   autocomplete="off">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="mother" class="form-label">${t('mother')}</label>
                            <input type="text" class="form-control" id="mother" 
                                   value="${data.moeder || ''}" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="mother"
                                   autocomplete="off">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="birthDate" class="form-label">${t('birthDate')}</label>
                            <input type="date" class="form-control" id="birthDate" value="${data.geboortedatum || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="deathDate" class="form-label">${t('deathDate')}</label>
                            <input type="date" class="form-control" id="deathDate" value="${data.overlijdensdatum || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="hipDysplasia" class="form-label">${t('hipDysplasia')}</label>
                            <select class="form-select" id="hipDysplasia">
                                <option value="">${t('hipGrades')}</option>
                                <option value="A" ${data.heupdysplasie === 'A' ? 'selected' : ''}>${t('hipA')}</option>
                                <option value="B" ${data.heupdysplasie === 'B' ? 'selected' : ''}>${t('hipB')}</option>
                                <option value="C" ${data.heupdysplasie === 'C' ? 'selected' : ''}>${t('hipC')}</option>
                                <option value="D" ${data.heupdysplasie === 'D' ? 'selected' : ''}>${t('hipD')}</option>
                                <option value="E" ${data.heupdysplasie === 'E' ? 'selected' : ''}>${t('hipE')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="elbowDysplasia" class="form-label">${t('elbowDysplasia')}</label>
                            <select class="form-select" id="elbowDysplasia">
                                <option value="">${t('elbowGrades')}</option>
                                <option value="0" ${data.elleboogdysplasie === '0' ? 'selected' : ''}>${t('elbow0')}</option>
                                <option value="1" ${data.elleboogdysplasie === '1' ? 'selected' : ''}>${t('elbow1')}</option>
                                <option value="2" ${data.elleboogdysplasie === '2' ? 'selected' : ''}>${t('elbow2')}</option>
                                <option value="3" ${data.elleboogdysplasie === '3' ? 'selected' : ''}>${t('elbow3')}</option>
                                <option value="NB" ${data.elleboogdysplasie === 'NB' ? 'selected' : ''}>${t('elbowNB')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="patellaLuxation" class="form-label">${t('patellaLuxation')}</label>
                            <select class="form-select" id="patellaLuxation">
                                <option value="">${t('patellaGrades')}</option>
                                <option value="0" ${data.patella === '0' ? 'selected' : ''}>${t('patella0')}</option>
                                <option value="1" ${data.patella === '1' ? 'selected' : ''}>${t('patella1')}</option>
                                <option value="2" ${data.patella === '2' ? 'selected' : ''}>${t('patella2')}</option>
                                <option value="3" ${data.patella === '3' ? 'selected' : ''}>${t('patella3')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="eyes" class="form-label">${t('eyes')}</label>
                            <select class="form-select" id="eyes">
                                <option value="">${t('choose')}</option>
                                <option value="Vrij" ${data.ogen === 'Vrij' ? 'selected' : ''}>${t('eyesFree')}</option>
                                <option value="Distichiasis" ${data.ogen === 'Distichiasis' ? 'selected' : ''}>${t('eyesDistichiasis')}</option>
                                <option value="Overig" ${data.ogen === 'Overig' ? 'selected' : ''}>${t('eyesOther')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="eyesExplanationContainer" style="${data.ogen === 'Overig' ? '' : 'display: none;'}">
                            <label for="eyesExplanation" class="form-label">${t('eyesExplanation')}</label>
                            <input type="text" class="form-control" id="eyesExplanation" value="${data.ogenVerklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dandyWalker" class="form-label">${t('dandyWalker')}</label>
                            <select class="form-select" id="dandyWalker">
                                <option value="">${t('dandyOptions')}</option>
                                <option value="Vrij op DNA" ${data.dandyWalker === 'Vrij op DNA' ? 'selected' : ''}>${t('dandyFreeDNA')}</option>
                                <option value="Vrij op ouders" ${data.dandyWalker === 'Vrij op ouders' ? 'selected' : ''}>${t('dandyFreeParents')}</option>
                                <option value="Drager" ${data.dandyWalker === 'Drager' ? 'selected' : ''}>${t('dandyCarrier')}</option>
                                <option value="Lijder" ${data.dandyWalker === 'Lijder' ? 'selected' : ''}>${t('dandyAffected')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="thyroid" class="form-label">${t('thyroid')}</label>
                            <select class="form-select" id="thyroid">
                                <option value="">${t('choose')}</option>
                                <option value="Negatief" ${data.schildklier === 'Negatief' ? 'selected' : ''}>${t('thyroidNegative')}</option>
                                <option value="Positief" ${data.schildklier === 'Positief' ? 'selected' : ''}>${t('thyroidPositive')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="thyroidExplanationContainer" style="${data.schildklier === 'Positief' ? '' : 'display: none;'}">
                            <label for="thyroidExplanation" class="form-label">${t('thyroidExplanation')}</label>
                            <input type="text" class="form-control" id="thyroidExplanation" value="${data.schildklierVerklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="country" class="form-label">${t('country')}</label>
                            <input type="text" class="form-control" id="country" value="${data.land || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="zipCode" class="form-label">${t('zipCode')}</label>
                            <input type="text" class="form-control" id="zipCode" value="${data.postcode || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="dogPhoto" class="form-label">${t('addPhoto')}</label>
                    <div class="input-group">
                        <input type="file" class="form-control" id="dogPhoto" accept="image/*">
                        <label class="input-group-text" for="dogPhoto">${t('chooseFile')}</label>
                    </div>
                    <div class="form-text">${t('noFileChosen')}</div>
                </div>
                
                <div class="mb-3">
                    <label for="remarks" class="form-label">${t('remarks')}</label>
                    <textarea class="form-control" id="remarks" rows="3">${data.opmerkingen || ''}</textarea>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    ${t('requiredFields')}
                </div>
                
                <div class="text-end">
                    <button type="button" class="btn btn-primary" id="saveDogBtn">
                        ${t('saveDog')}
                    </button>
                </div>
            </form>
            
            <style>
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: 100%;
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
        console.log('LitterManager setupEvents called');
        
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Event listeners voor formulier
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveDog();
            });
        }
        
        // Eyes dropdown handler
        const eyesSelect = document.getElementById('eyes');
        if (eyesSelect) {
            eyesSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('eyesExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Overig' ? 'block' : 'none';
                }
            });
        }
        
        // Thyroid dropdown handler
        const thyroidSelect = document.getElementById('thyroid');
        if (thyroidSelect) {
            thyroidSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('thyroidExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Positief' ? 'block' : 'none';
                }
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
            } catch (error) {
                console.error('Fout bij laden honden voor autocomplete:', error);
            }
        }
    }
    
    setupParentAutocomplete() {
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak nieuwe dropdown containers
        const fatherInputWrapper = document.querySelector('#father').closest('.parent-input-wrapper');
        const motherInputWrapper = document.querySelector('#mother').closest('.parent-input-wrapper');
        
        const fatherDropdown = document.createElement('div');
        fatherDropdown.className = 'autocomplete-dropdown';
        fatherDropdown.id = 'fatherDropdown';
        fatherDropdown.style.display = 'none';
        fatherInputWrapper.appendChild(fatherDropdown);
        
        const motherDropdown = document.createElement('div');
        motherDropdown.className = 'autocomplete-dropdown';
        motherDropdown.id = 'motherDropdown';
        motherDropdown.style.display = 'none';
        motherInputWrapper.appendChild(motherDropdown);
        
        // Event listeners voor vader en moeder velden
        document.querySelectorAll('.parent-input-wrapper input').forEach(input => {
            input.addEventListener('focus', () => {
                this.loadAllDogs(); // Zorg dat honden geladen zijn
            });
            
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'father' ? 'father' : 'mother';
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', (e) => {
                // Wacht even voordat dropdown wordt verborgen (voor klikken op item)
                setTimeout(() => {
                    const dropdown = document.getElementById(`${input.id}Dropdown`);
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            });
        });
        
        // Klik buiten dropdown om te verbergen
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input-wrapper')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    showParentAutocomplete(searchTerm, parentType) {
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) return;
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        // Filter honden voor autocomplete (alleen reuen voor vader, teven voor moeder)
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam.toLowerCase();
            const matchesSearch = dogName.includes(searchTerm);
            
            // Filter op geslacht
            if (parentType === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
            } else if (parentType === 'mother') {
                return matchesSearch && dog.geslacht === 'teven';
            }
            return matchesSearch;
        }).slice(0, 8); // Max 8 suggesties
        
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
                const input = document.getElementById(parentType);
                const idInput = document.getElementById(`${parentType}Id`);
                
                if (input) {
                    input.value = dogName;
                }
                if (idInput) {
                    idInput.value = dogId;
                }
                
                dropdown.style.display = 'none';
            });
        });
    }
    
    async saveDog() {
        if (!this.auth.isAdmin()) {
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
            heupdysplasie: document.getElementById('hipDysplasia').value,
            elleboogdysplasie: document.getElementById('elbowDysplasia').value,
            patella: document.getElementById('patellaLuxation').value,
            ogen: document.getElementById('eyes').value,
            ogenVerklaring: document.getElementById('eyesExplanation')?.value.trim() || '',
            dandyWalker: document.getElementById('dandyWalker').value,
            schildklier: document.getElementById('thyroid').value,
            schildklierVerklaring: document.getElementById('thyroidExplanation')?.value.trim() || '',
            land: document.getElementById('country').value.trim(),
            postcode: document.getElementById('zipCode').value.trim(),
            opmerkingen: document.getElementById('remarks').value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress(this.t('savingDog'));
        
        try {
            await this.db.voegHondToe(dogData);
            this.hideProgress();
            this.showSuccess(this.t('dogAdded'));
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput.files.length > 0) {
                await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
            }
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('addFailed')}${error.message}`);
        }
    }
    
    async uploadPhoto(pedigreeNumber, file) {
        try {
            const reader = new FileReader();
            
            return new Promise((resolve, reject) => {
                reader.onload = async (e) => {
                    try {
                        const photoData = {
                            stamboomnr: pedigreeNumber,
                            data: e.target.result,
                            filename: file.name,
                            size: file.size,
                            type: file.type,
                            uploadedAt: new Date().toISOString()
                        };
                        
                        await this.db.voegFotoToe(photoData);
                        this.showSuccess(this.t('photoAdded'));
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };
                
                reader.onerror = () => {
                    reject(new Error('Fout bij lezen bestand'));
                };
                
                reader.readAsDataURL(file);
            });
        } catch (error) {
            this.showError(`${this.t('photoError')}${error.message}`);
        }
    }
    
    showProgress(message) {
        console.log('Progress:', message);
        // Implementeer progress indicator
    }
    
    hideProgress() {
        console.log('Hide progress');
        // Implementeer hide progress indicator
    }
    
    showSuccess(message) {
        console.log('Success:', message);
        // Implementeer success melding
    }
    
    showError(message) {
        console.error('Error:', message);
        // Implementeer error melding
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}