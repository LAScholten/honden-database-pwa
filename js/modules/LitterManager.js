/**
 * Litter Management Module
 * Werkende versie met volledige functionaliteit
 */

class LitterManager extends BaseModule {
    constructor() {
        super('littermanager', 'Nest Beheer');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
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
                saveDog: "Hond Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                choose: "Kies...",
                close: "Sluiten",
                back: "Terug",
                
                // Alerts
                adminOnly: "Alleen administrators mogen honden toevoegen/bewerken",
                fieldsRequired: "Naam, stamboomnummer en ras zijn verplichte velden",
                savingDog: "Hond opslaan...",
                dogAdded: "Hond succesvol toegevoegd!",
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
                back: "Back",
                
                // Alerts
                adminOnly: "Only administrators can add/edit dogs",
                fieldsRequired: "Name, pedigree number and breed are required fields",
                savingDog: "Saving dog...",
                dogAdded: "Dog successfully added!",
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
                dandyFreeParents: "Frei auf ouders",
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
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                choose: "Wählen...",
                close: "Schließen",
                back: "Zurück",
                
                // Meldungen
                adminOnly: "Nur Administratoren können Hunde hinzufügen/bearbeiten",
                fieldsRequired: "Name, Stammbaum-Nummer und Rasse sind Pflichtfelder",
                savingDog: "Hund wird gespeichert...",
                dogAdded: "Hund erfolgreich hinzugefügt!",
                photoAdded: "Foto hinzugefügt",
                photoError: "Fehler beim Hochladen des Fotos: "
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        this.translateForm();
    }
    
    translateForm() {
        const form = document.getElementById('litterFormContainer') || document.querySelector('#litterFormContainer form');
        if (!form) return;
        
        const t = this.t.bind(this);
        
        // Vertaal labels
        const labels = form.querySelectorAll('label');
        labels.forEach(label => {
            const text = label.textContent.trim();
            switch(text) {
                case 'Naam *': label.textContent = t('nameRequired'); break;
                case 'Stamboomnummer *': label.textContent = t('pedigreeNumber'); break;
                case 'Ras *': label.textContent = t('breedRequired'); break;
                case 'Reu/Teef *': label.textContent = t('gender'); break;
                case 'Vader': label.textContent = t('father'); break;
                case 'Moeder': label.textContent = t('mother'); break;
                case 'Geboortedatum': label.textContent = t('birthDate'); break;
                case 'Overlijdensdatum': label.textContent = t('deathDate'); break;
                case 'Heupdysplasie': label.textContent = t('hipDysplasia'); break;
                case 'Elleboogdysplasie': label.textContent = t('elbowDysplasia'); break;
                case 'Patella Luxatie': label.textContent = t('patellaLuxation'); break;
                case 'Ogen': label.textContent = t('eyes'); break;
                case 'Verklaring overig': label.textContent = t('eyesExplanation'); break;
                case 'Dandy Walker Malformation': label.textContent = t('dandyWalker'); break;
                case 'Schildklier': label.textContent = t('thyroid'); break;
                case 'Toelichting schildklier': label.textContent = t('thyroidExplanation'); break;
                case 'Land': label.textContent = t('country'); break;
                case 'Postcode': label.textContent = t('zipCode'); break;
                case 'Foto toevoegen': label.textContent = t('addPhoto'); break;
                case 'Opmerkingen': label.textContent = t('remarks'); break;
            }
        });
        
        // Vertaal placeholder teksten
        const inputs = form.querySelectorAll('input[placeholder]');
        inputs.forEach(input => {
            const placeholder = input.placeholder;
            switch(placeholder) {
                case 'Begin met typen om te zoeken...':
                    input.placeholder = t('choose');
                    break;
            }
        });
        
        // Vertaal select opties
        const selects = form.querySelectorAll('select');
        selects.forEach(select => {
            const firstOption = select.querySelector('option[value=""]');
            if (firstOption) {
                const text = firstOption.textContent.trim();
                switch(text) {
                    case 'Selecteer geslacht...': firstOption.textContent = t('chooseGender'); break;
                    case 'Selecteer graad...': firstOption.textContent = t('hipGrades'); break;
                    case 'Kies...': firstOption.textContent = t('choose'); break;
                    case 'Selecteer status...': firstOption.textContent = t('dandyOptions'); break;
                }
            }
            
            // Vertaal specifieke opties
            const options = select.querySelectorAll('option');
            options.forEach(option => {
                const value = option.value;
                const text = option.textContent;
                switch(text) {
                    case 'Reu': if (value === 'reuen') option.textContent = t('male'); break;
                    case 'Teef': if (value === 'teven') option.textContent = t('female'); break;
                    case 'A': option.textContent = t('hipA'); break;
                    case 'B': option.textContent = t('hipB'); break;
                    case 'C': option.textContent = t('hipC'); break;
                    case 'D': option.textContent = t('hipD'); break;
                    case 'E': option.textContent = t('hipE'); break;
                    case '0': option.textContent = t('elbow0'); break;
                    case '1': option.textContent = t('elbow1'); break;
                    case '2': option.textContent = t('elbow2'); break;
                    case '3': option.textContent = t('elbow3'); break;
                    case 'NB (Niet bekend)': option.textContent = t('elbowNB'); break;
                    case 'Vrij': option.textContent = t('eyesFree'); break;
                    case 'Distichiasis': option.textContent = t('eyesDistichiasis'); break;
                    case 'Overig': option.textContent = t('eyesOther'); break;
                    case 'Vrij op DNA': option.textContent = t('dandyFreeDNA'); break;
                    case 'Vrij op ouders': option.textContent = t('dandyFreeParents'); break;
                    case 'Drager': option.textContent = t('dandyCarrier'); break;
                    case 'Lijder': option.textContent = t('dandyAffected'); break;
                    case 'Tgaa Negatief': option.textContent = t('thyroidNegative'); break;
                    case 'Tgaa Positief': option.textContent = t('thyroidPositive'); break;
                }
            });
        });
        
        // Vertaal button tekst
        const button = form.querySelector('#saveDogBtn');
        if (button) button.textContent = t('saveDog');
        
        // Vertaal formulier tekst
        const recentBreeds = form.querySelector('.form-text');
        if (recentBreeds && recentBreeds.textContent.includes('Recent gebruikte rassen')) {
            recentBreeds.textContent = t('recentBreeds');
        }
        
        const fileText = form.querySelector('.form-text:last-child');
        if (fileText && fileText.textContent.includes('Geen bestand gekozen')) {
            fileText.textContent = t('noFileChosen');
        }
        
        const fileLabel = form.querySelector('.input-group-text');
        if (fileLabel && fileLabel.textContent.includes('Kies bestand')) {
            fileLabel.textContent = t('chooseFile');
        }
        
        const alert = form.querySelector('.alert');
        if (alert) {
            const icon = alert.querySelector('i');
            if (icon) {
                alert.textContent = t('requiredFields');
                alert.prepend(icon);
            }
        }
    }
    
    getFormHTML() {
        const t = this.t.bind(this);
        
        // Genereer recente rassen opties
        let recentBreedsHTML = '';
        if (this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="form-text mb-2">${t('recentBreeds')}:</div>
                <div class="d-flex flex-wrap gap-2 mb-3 recent-breeds-container">
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
                            <select class="form-select" id="gender" required>
                                <option value="">${t('chooseGender')}</option>
                                <option value="reuen">${t('male')}</option>
                                <option value="teven">${t('female')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="father" class="form-label">${t('father')}</label>
                            <input type="text" class="form-control parent-input" id="father" 
                                   value="" 
                                   placeholder="${t('choose')}"
                                   data-parent-type="father"
                                   autocomplete="off">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="mother" class="form-label">${t('mother')}</label>
                            <input type="text" class="form-control parent-input" id="mother" 
                                   value="" 
                                   placeholder="${t('choose')}"
                                   data-parent-type="mother"
                                   autocomplete="off">
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
                
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="hipDysplasia" class="form-label">${t('hipDysplasia')}</label>
                            <select class="form-select" id="hipDysplasia">
                                <option value="">${t('hipGrades')}</option>
                                <option value="A">${t('hipA')}</option>
                                <option value="B">${t('hipB')}</option>
                                <option value="C">${t('hipC')}</option>
                                <option value="D">${t('hipD')}</option>
                                <option value="E">${t('hipE')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="elbowDysplasia" class="form-label">${t('elbowDysplasia')}</label>
                            <select class="form-select" id="elbowDysplasia">
                                <option value="">${t('elbowGrades')}</option>
                                <option value="0">${t('elbow0')}</option>
                                <option value="1">${t('elbow1')}</option>
                                <option value="2">${t('elbow2')}</option>
                                <option value="3">${t('elbow3')}</option>
                                <option value="NB">${t('elbowNB')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="patellaLuxation" class="form-label">${t('patellaLuxation')}</label>
                            <select class="form-select" id="patellaLuxation">
                                <option value="">${t('patellaGrades')}</option>
                                <option value="0">${t('patella0')}</option>
                                <option value="1">${t('patella1')}</option>
                                <option value="2">${t('patella2')}</option>
                                <option value="3">${t('patella3')}</option>
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
                                <option value="Vrij">${t('eyesFree')}</option>
                                <option value="Distichiasis">${t('eyesDistichiasis')}</option>
                                <option value="Overig">${t('eyesOther')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="eyesExplanationContainer" style="display: none;">
                            <label for="eyesExplanation" class="form-label">${t('eyesExplanation')}</label>
                            <input type="text" class="form-control" id="eyesExplanation" value="">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dandyWalker" class="form-label">${t('dandyWalker')}</label>
                            <select class="form-select" id="dandyWalker">
                                <option value="">${t('dandyOptions')}</option>
                                <option value="Vrij op DNA">${t('dandyFreeDNA')}</option>
                                <option value="Vrij op ouders">${t('dandyFreeParents')}</option>
                                <option value="Drager">${t('dandyCarrier')}</option>
                                <option value="Lijder">${t('dandyAffected')}</option>
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
                                <option value="Negatief">${t('thyroidNegative')}</option>
                                <option value="Positief">${t('thyroidPositive')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="thyroidExplanationContainer" style="display: none;">
                            <label for="thyroidExplanation" class="form-label">${t('thyroidExplanation')}</label>
                            <input type="text" class="form-control" id="thyroidExplanation" value="">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="country" class="form-label">${t('country')}</label>
                            <input type="text" class="form-control" id="country" value="">
                        </div>
                        <div class="mb-3">
                            <label for="zipCode" class="form-label">${t('zipCode')}</label>
                            <input type="text" class="form-control" id="zipCode" value="">
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
                    <textarea class="form-control" id="remarks" rows="3"></textarea>
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
        
        // Wacht even om DOM te laten renderen
        setTimeout(() => {
            this.setupFormEvents();
            this.translateForm();
        }, 100);
    }
    
    setupFormEvents() {
        console.log('Setting up LitterManager form events...');
        
        // Save dog button
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            console.log('Found save dog button');
            saveBtn.addEventListener('click', (e) => {
                console.log('Save button clicked');
                e.preventDefault();
                this.saveDog();
            });
        } else {
            console.error('Save dog button not found!');
        }
        
        // Recente rassen knoppen - belangrijke fix!
        const formContainer = document.querySelector('#litterFormContainer form');
        if (formContainer) {
            formContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('recent-breed-btn')) {
                    const breed = e.target.getAttribute('data-breed');
                    const breedInput = document.getElementById('breed');
                    if (breedInput) {
                        breedInput.value = breed;
                        console.log('Ras ingevuld:', breed);
                    }
                }
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
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
    }
    
    setupParentAutocomplete() {
        console.log('Setting up parent autocomplete...');
        
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak nieuwe dropdown containers
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        
        if (!fatherInput || !motherInput) {
            console.error('Parent inputs not found!');
            return;
        }
        
        const fatherInputWrapper = fatherInput.closest('.parent-input-wrapper');
        const motherInputWrapper = motherInput.closest('.parent-input-wrapper');
        
        if (!fatherInputWrapper || !motherInputWrapper) {
            console.error('Parent input wrappers not found!');
            return;
        }
        
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
        
        console.log('Created dropdowns');
        
        // Event listeners voor vader en moeder velden
        document.querySelectorAll('.parent-input').forEach(input => {
            input.addEventListener('focus', () => {
                this.loadAllDogs();
            });
            
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'father' ? 'father' : 'mother';
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', (e) => {
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
        
        // Filter honden voor autocomplete
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam ? dog.naam.toLowerCase() : '';
            const matchesSearch = dogName.includes(searchTerm);
            
            // Filter op geslacht
            if (parentType === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
            } else if (parentType === 'mother') {
                return matchesSearch && dog.geslacht === 'teven';
            }
            return matchesSearch;
        }).slice(0, 8);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            html += `
                <div class="autocomplete-item" data-id="${dog.id || ''}" data-name="${dog.naam || ''}" data-pedigree="${dog.stamboomnr || ''}">
                    <div class="dog-name">${dog.naam || 'Onbekend'}</div>
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
    
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                console.log('Loading all dogs for autocomplete...');
                if (this.db && typeof this.db.getHonden === 'function') {
                    this.allDogs = await this.db.getHonden();
                } else if (window.db && typeof window.db.getHonden === 'function') {
                    this.allDogs = await window.db.getHonden();
                } else {
                    // Fallback voor testen
                    this.allDogs = [];
                }
                this.allDogs.sort((a, b) => {
                    const nameA = a.naam || '';
                    const nameB = b.naam || '';
                    return nameA.localeCompare(nameB);
                });
                console.log('Loaded dogs for autocomplete:', this.allDogs.length);
            } catch (error) {
                console.error('Fout bij laden honden voor autocomplete:', error);
                this.allDogs = [];
            }
        }
    }
    
    async saveDog() {
        console.log('saveDog method called in LitterManager');
        
        // Valideer eerst of gebruiker admin is
        const isAdmin = auth.isAdmin();
        if (!isAdmin) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        // Verzamel alle data
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
        
        console.log('Dog data collected:', dogData);
        
        // Valideer basisvelden
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        // Toon voortgang
        this.showProgress(this.t('savingDog'));
        
        try {
            // Sla hond op in database
            let savedDog;
            if (this.db && typeof this.db.voegHondToe === 'function') {
                savedDog = await this.db.voegHondToe(dogData);
            } else if (window.db && typeof window.db.voegHondToe === 'function') {
                savedDog = await window.db.voegHondToe(dogData);
            } else {
                throw new Error('Database method voegHondToe niet beschikbaar');
            }
            
            console.log('Dog saved to database:', savedDog);
            
            this.hideProgress();
            this.showSuccess(this.t('dogAdded'));
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput.files.length > 0) {
                await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
            }
            
            // Reset formulier
            setTimeout(() => {
                this.resetForm();
                
                // Terug naar keuze scherm (via DogManager)
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('Error in saveDog:', error);
            this.showError('Fout bij opslaan: ' + error.message);
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
                        
                        if (this.db && typeof this.db.voegFotoToe === 'function') {
                            await this.db.voegFotoToe(photoData);
                        } else if (window.db && typeof window.db.voegFotoToe === 'function') {
                            await window.db.voegFotoToe(photoData);
                        }
                        
                        console.log('Foto toegevoegd');
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
            console.error('Fout bij uploaden foto:', error);
            this.showError(this.t('photoError') + error.message);
        }
    }
    
    resetForm() {
        // Reset alle velden
        const form = document.getElementById('addDogForm');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'file') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });
        
        // Reset verborgen velden
        document.getElementById('fatherId').value = '';
        document.getElementById('motherId').value = '';
        
        // Verberg uitleg velden
        const eyesExplanation = document.getElementById('eyesExplanationContainer');
        const thyroidExplanation = document.getElementById('thyroidExplanationContainer');
        if (eyesExplanation) eyesExplanation.style.display = 'none';
        if (thyroidExplanation) thyroidExplanation.style.display = 'none';
        
        // Focus op naam veld
        const nameInput = document.getElementById('dogName');
        if (nameInput) nameInput.focus();
    }
    
    // Helper methods voor UI feedback
    showError(message) {
        alert(message);
    }
    
    showSuccess(message) {
        alert(message);
    }
    
    showProgress(message) {
        // Eenvoudige progress indicator
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${message}`;
            saveBtn.disabled = true;
        }
    }
    
    hideProgress() {
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            saveBtn.innerHTML = this.t('saveDog');
            saveBtn.disabled = false;
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}