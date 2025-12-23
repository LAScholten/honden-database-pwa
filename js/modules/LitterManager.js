/**
 * Litter Management Module
 * Beheert toevoegen en bewerken van nesten
 */

class LitterManager extends BaseModule {
    constructor() {
        super('littermanager', 'Nest Beheer');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.savedPups = [];
        this.currentPupData = null;
        
        // Vertalingen
        this.translations = {
            nl: {
                // Modal titels
                litterTitle: "Nest Toevoegen",
                newLitter: "Nieuw Nest",
                editLitter: "Nest Bewerken",
                
                // Form velden
                motherDog: "Moederhond *",
                fatherDog: "Vaderhond *",
                kennelName: "Kennelnaam",
                birthDate: "Geboortedatum (DD/MM/JJJJ) *",
                dogName: "Naam hond *",
                pedigreeNumber: "Stamboomnummer *",
                gender: "Reu/Teef *",
                chooseGender: "Selecteer geslacht...",
                male: "Reu",
                female: "Teef",
                healthDataKnown: "Gezondheidsgegevens bekend?",
                yes: "Ja",
                no: "Nee",
                addAnotherPup: "Nog een pup toevoegen",
                finishLitter: "Nest Afronden",
                back: "Terug",
                choose: "Kies...",
                close: "Sluiten",
                save: "Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                requiredFields: "Velden met * zijn verplicht",
                savedPups: "Opgeslagen Pups",
                
                // Gezondheidsgegevens (zelfde als DogManager)
                breed: "Ras *",
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
                
                // Notificaties
                motherRequired: "Moederhond is verplicht",
                fatherRequired: "Vaderhond is verplicht",
                birthDateRequired: "Geboortedatum is verplicht",
                invalidDate: "Ongeldige datum. Gebruik formaat DD/MM/JJJJ",
                pupNameRequired: "Naam hond is verplicht",
                pedigreeRequired: "Stamboomnummer is verplicht",
                genderRequired: "Geslacht is verplicht",
                pupSaved: "Pup succesvol opgeslagen!",
                litterSaved: "Nest succesvol afgerond!",
                saveError: "Fout bij opslaan: ",
                motherMustBeFemale: "Moederhond moet een teef zijn",
                fatherMustBeMale: "Vaderhond moet een reu zijn",
                selectMother: "Selecteer eerst een moederhond",
                selectFather: "Selecteer eerst een vaderhond",
                saved: "Opgeslagen"
            },
            en: {
                // Modal titles
                litterTitle: "Add Litter",
                newLitter: "New Litter",
                editLitter: "Edit Litter",
                
                // Form fields
                motherDog: "Mother Dog *",
                fatherDog: "Father Dog *",
                kennelName: "Kennel Name",
                birthDate: "Birth Date (DD/MM/YYYY) *",
                dogName: "Dog Name *",
                pedigreeNumber: "Pedigree Number *",
                gender: "Male/Female *",
                chooseGender: "Select gender...",
                male: "Male",
                female: "Female",
                healthDataKnown: "Health data known?",
                yes: "Yes",
                no: "No",
                addAnotherPup: "Add Another Pup",
                finishLitter: "Finish Litter",
                back: "Back",
                choose: "Choose...",
                close: "Close",
                save: "Save",
                cancel: "Cancel",
                delete: "Delete",
                requiredFields: "Fields with * are required",
                savedPups: "Saved Pups",
                
                // Health data
                breed: "Breed *",
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
                
                // Notifications
                motherRequired: "Mother dog is required",
                fatherRequired: "Father dog is required",
                birthDateRequired: "Birth date is required",
                invalidDate: "Invalid date. Use format DD/MM/YYYY",
                pupNameRequired: "Dog name is required",
                pedigreeRequired: "Pedigree number is required",
                genderRequired: "Gender is required",
                pupSaved: "Pup successfully saved!",
                litterSaved: "Litter successfully finished!",
                saveError: "Error saving: ",
                motherMustBeFemale: "Mother dog must be female",
                fatherMustBeMale: "Father dog must be male",
                selectMother: "Select a mother dog first",
                selectFather: "Select a father dog first",
                saved: "Saved"
            },
            de: {
                // Modal Titel
                litterTitle: "Wurf Hinzufügen",
                newLitter: "Neuer Wurf",
                editLitter: "Wurf Bearbeiten",
                
                // Formular Felder
                motherDog: "Mutterhund *",
                fatherDog: "Vaterhund *",
                kennelName: "Kennelname",
                birthDate: "Geburtsdatum (TT/MM/JJJJ) *",
                dogName: "Hund Name *",
                pedigreeNumber: "Stammbaum-Nummer *",
                gender: "Rüde/Hündin *",
                chooseGender: "Geschlecht wählen...",
                male: "Rüde",
                female: "Hündin",
                healthDataKnown: "Gesundheitsdaten bekannt?",
                yes: "Ja",
                no: "Nein",
                addAnotherPup: "Noch einen Welpen hinzufügen",
                finishLitter: "Wurf Abschließen",
                back: "Zurück",
                choose: "Wählen...",
                close: "Schließen",
                save: "Speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                requiredFields: "Felder mit * sind Pflichtfelder",
                savedPups: "Gespeicherte Welpen",
                
                // Gesundheitsdaten
                breed: "Rasse *",
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
                
                // Meldungen
                motherRequired: "Mutterhund ist erforderlich",
                fatherRequired: "Vaterhund ist erforderlich",
                birthDateRequired: "Geburtsdatum ist erforderlich",
                invalidDate: "Ungültiges Datum. Verwenden Sie das Format TT/MM/JJJJ",
                pupNameRequired: "Hund Name ist erforderlich",
                pedigreeRequired: "Stammbaum-Nummer ist erforderlich",
                genderRequired: "Geschlecht ist erforderlich",
                pupSaved: "Welpe erfolgreich gespeichert!",
                litterSaved: "Wurf erfolgreich abgeschlossen!",
                saveError: "Fehler beim Speichern: ",
                motherMustBeFemale: "Mutterhund muss eine Hündin sein",
                fatherMustBeMale: "Vaterhund muss ein Rüde sein",
                selectMother: "Wählen Sie zuerst einen Mutterhund",
                selectFather: "Wählen Sie zuerst einen Vaterhund",
                saved: "Gespeichert"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                if (this.db && typeof this.db.getHonden === 'function') {
                    this.allDogs = await this.db.getHonden();
                } else if (window.db && typeof window.db.getHonden === 'function') {
                    this.allDogs = await window.db.getHonden();
                }
                this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            } catch (error) {
                console.error('Fout bij laden honden voor autocomplete:', error);
            }
        }
    }
    
    getFormHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm back-to-choice-btn">
                    <i class="bi bi-arrow-left me-1"></i> ${t('back')}
                </button>
            </div>
            
            <div id="litterFormContainer">
                <h5 class="mb-3"><i class="bi bi-people"></i> ${t('litterTitle')}</h5>
                
                <!-- Moeder & Vader -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="motherDog" class="form-label">${t('motherDog')}</label>
                            <input type="text" class="form-control" id="motherDog" 
                                   placeholder="Begin met typen om te zoeken..."
                                   autocomplete="off" required>
                            <input type="hidden" id="motherId">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="fatherDog" class="form-label">${t('fatherDog')}</label>
                            <input type="text" class="form-control" id="fatherDog" 
                                   placeholder="Begin met typen om te zoeken..."
                                   autocomplete="off" required>
                            <input type="hidden" id="fatherId">
                        </div>
                    </div>
                </div>
                
                <!-- Kennelnaam & Geboortedatum -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="kennelName" class="form-label">${t('kennelName')}</label>
                            <input type="text" class="form-control" id="kennelName">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="birthDate" class="form-label">${t('birthDate')}</label>
                            <input type="text" class="form-control" id="birthDate" 
                                   placeholder="DD/MM/JJJJ" 
                                   maxlength="10"
                                   required>
                        </div>
                    </div>
                </div>
                
                <hr class="my-4">
                
                <!-- Pup toevoegen sectie -->
                <h6 class="mb-3"><i class="bi bi-heart"></i> Pup Toevoegen</h6>
                
                <div class="row mb-3">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="dogName" class="form-label">${t('dogName')}</label>
                            <input type="text" class="form-control" id="dogName" required>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="pedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                            <input type="text" class="form-control" id="pedigreeNumber" required>
                        </div>
                    </div>
                    <div class="col-md-4">
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
                
                <!-- Gezondheidsgegevens keuze -->
                <div class="row mb-3">
                    <div class="col-12">
                        <label class="form-label">${t('healthDataKnown')}</label>
                        <div class="btn-group w-100" role="group">
                            <input type="radio" class="btn-check" name="healthData" id="healthYes" value="yes" autocomplete="off">
                            <label class="btn btn-outline-success" for="healthYes">
                                <i class="bi bi-check-circle"></i> ${t('yes')}
                            </label>
                            
                            <input type="radio" class="btn-check" name="healthData" id="healthNo" value="no" autocomplete="off" checked>
                            <label class="btn btn-outline-danger" for="healthNo">
                                <i class="bi bi-x-circle"></i> ${t('no')}
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Gezondheidsgegevens formulier (verborgen initieel) -->
                <div id="healthDataForm" style="display: none;">
                    <h6 class="mt-4 mb-3">${t('healthDataKnown')}</h6>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="breed" class="form-label">${t('breed')}</label>
                                <input type="text" class="form-control" id="breed" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="country" class="form-label">${t('country')}</label>
                                <input type="text" class="form-control" id="country">
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
                                <input type="text" class="form-control" id="eyesExplanation">
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
                                <input type="text" class="form-control" id="thyroidExplanation">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="zipCode" class="form-label">${t('zipCode')}</label>
                                <input type="text" class="form-control" id="zipCode">
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="remarks" class="form-label">${t('remarks')}</label>
                        <textarea class="form-control" id="remarks" rows="2"></textarea>
                    </div>
                    
                    <div class="mb-3">
                        <label for="dogPhoto" class="form-label">${t('addPhoto')}</label>
                        <div class="input-group">
                            <input type="file" class="form-control" id="dogPhoto" accept="image/*">
                            <label class="input-group-text" for="dogPhoto">${t('chooseFile')}</label>
                        </div>
                        <div class="form-text">${t('noFileChosen')}</div>
                    </div>
                </div>
                
                <!-- Opslaan knoppen -->
                <div class="alert alert-info mb-3">
                    <i class="bi bi-info-circle"></i>
                    ${t('requiredFields')}
                </div>
                
                <div class="text-end mb-4">
                    <button type="button" class="btn btn-primary" id="savePupBtn">
                        <i class="bi bi-save me-1"></i> ${t('save')}
                    </button>
                </div>
                
                <!-- Opgeslagen pups -->
                <div id="savedPupsSection" style="${this.savedPups.length > 0 ? '' : 'display: none;'}">
                    <hr class="my-4">
                    <h6 class="mb-3"><i class="bi bi-list-ul"></i> ${t('savedPups')}</h6>
                    <div id="savedPupsList" class="mb-3"></div>
                    
                    <div class="text-end">
                        <button type="button" class="btn btn-success me-2" id="addAnotherPupBtn">
                            <i class="bi bi-plus-circle me-1"></i> ${t('addAnotherPup')}
                        </button>
                        <button type="button" class="btn btn-primary" id="finishLitterBtn">
                            <i class="bi bi-check-circle me-1"></i> ${t('finishLitter')}
                        </button>
                    </div>
                </div>
            </div>
            
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
                    width: calc(100% - 2px);
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
                
                .saved-pup-card {
                    background-color: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    padding: 12px;
                    margin-bottom: 8px;
                }
                
                .saved-pup-card .pup-info {
                    font-size: 0.9em;
                }
                
                @media (max-width: 768px) {
                    .btn-group.w-100 {
                        flex-wrap: wrap;
                    }
                    
                    .btn-group.w-100 .btn {
                        flex: 1;
                        min-width: 100px;
                    }
                }
            </style>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager setupEvents called');
        
        // Event listeners voor de terug knop
        const backBtn = document.querySelector('.back-to-choice-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            });
        }
        
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Formaat validator voor geboortedatum
        const birthDateInput = document.getElementById('birthDate');
        if (birthDateInput) {
            birthDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 2 && value.length <= 4) {
                    value = value.substring(0, 2) + '/' + value.substring(2);
                } else if (value.length > 4 && value.length <= 8) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
                }
                
                e.target.value = value;
            });
        }
        
        // Radio buttons voor gezondheidsgegevens
        const healthYes = document.getElementById('healthYes');
        const healthNo = document.getElementById('healthNo');
        const healthDataForm = document.getElementById('healthDataForm');
        
        if (healthYes && healthNo && healthDataForm) {
            healthYes.addEventListener('change', (e) => {
                if (e.target.checked) {
                    healthDataForm.style.display = 'block';
                }
            });
            
            healthNo.addEventListener('change', (e) => {
                if (e.target.checked) {
                    healthDataForm.style.display = 'none';
                }
            });
        }
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
        
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
        
        // Save pup button
        const savePupBtn = document.getElementById('savePupBtn');
        if (savePupBtn) {
            savePupBtn.addEventListener('click', () => {
                this.savePup();
            });
        }
        
        // Add another pup button
        const addAnotherPupBtn = document.getElementById('addAnotherPupBtn');
        if (addAnotherPupBtn) {
            addAnotherPupBtn.addEventListener('click', () => {
                this.resetPupForm();
            });
        }
        
        // Finish litter button
        const finishLitterBtn = document.getElementById('finishLitterBtn');
        if (finishLitterBtn) {
            finishLitterBtn.addEventListener('click', () => {
                this.finishLitter();
            });
        }
        
        // Update saved pups list
        this.updateSavedPupsList();
    }
    
    setupParentAutocomplete() {
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak nieuwe dropdown containers
        const motherInputWrapper = document.querySelector('#motherDog')?.closest('.parent-input-wrapper');
        const fatherInputWrapper = document.querySelector('#fatherDog')?.closest('.parent-input-wrapper');
        
        if (!motherInputWrapper || !fatherInputWrapper) return;
        
        const motherDropdown = document.createElement('div');
        motherDropdown.className = 'autocomplete-dropdown';
        motherDropdown.id = 'motherDropdown';
        motherDropdown.style.display = 'none';
        motherInputWrapper.appendChild(motherDropdown);
        
        const fatherDropdown = document.createElement('div');
        fatherDropdown.className = 'autocomplete-dropdown';
        fatherDropdown.id = 'fatherDropdown';
        fatherDropdown.style.display = 'none';
        fatherInputWrapper.appendChild(fatherDropdown);
        
        // Event listeners voor vader en moeder velden
        document.querySelectorAll('.parent-input-wrapper input').forEach(input => {
            input.addEventListener('focus', () => {
                this.loadAllDogs();
            });
            
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'motherDog' ? 'mother' : 'father';
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
        
        // Filter honden voor autocomplete (filter op geslacht)
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam.toLowerCase();
            const matchesSearch = dogName.includes(searchTerm);
            
            // Filter op geslacht
            if (parentType === 'mother') {
                return matchesSearch && dog.geslacht === 'teven';
            } else if (parentType === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
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
                const input = document.getElementById(`${parentType}Dog`);
                const idInput = document.getElementById(`${parentType}Id`);
                
                if (input) input.value = dogName;
                if (idInput) idInput.value = dogId;
                
                dropdown.style.display = 'none';
                
                // Valideer geslacht
                const selectedDog = this.allDogs.find(d => d.id == dogId);
                if (selectedDog) {
                    if (parentType === 'mother' && selectedDog.geslacht !== 'teven') {
                        this.showAlert('warning', this.t('motherMustBeFemale'));
                    }
                    if (parentType === 'father' && selectedDog.geslacht !== 'reuen') {
                        this.showAlert('warning', this.t('fatherMustBeMale'));
                    }
                }
            });
        });
    }
    
    async savePup() {
        try {
            // Valideer verplichte velden van nest
            const motherDog = document.getElementById('motherDog').value.trim();
            const fatherDog = document.getElementById('fatherDog').value.trim();
            const birthDate = document.getElementById('birthDate').value.trim();
            
            if (!motherDog) {
                this.showAlert('error', this.t('motherRequired'));
                return;
            }
            
            if (!fatherDog) {
                this.showAlert('error', this.t('fatherRequired'));
                return;
            }
            
            if (!birthDate) {
                this.showAlert('error', this.t('birthDateRequired'));
                return;
            }
            
            // Valideer datum formaat
            const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            if (!dateRegex.test(birthDate)) {
                this.showAlert('error', this.t('invalidDate'));
                return;
            }
            
            // Valideer pup gegevens
            const pupName = document.getElementById('dogName').value.trim();
            const pedigreeNumber = document.getElementById('pedigreeNumber').value.trim();
            const gender = document.getElementById('gender').value;
            
            if (!pupName) {
                this.showAlert('error', this.t('pupNameRequired'));
                return;
            }
            
            if (!pedigreeNumber) {
                this.showAlert('error', this.t('pedigreeRequired'));
                return;
            }
            
            if (!gender) {
                this.showAlert('error', this.t('genderRequired'));
                return;
            }
            
            // Bereid pup data voor
            const pupData = {
                naam: pupName,
                stamboomnr: pedigreeNumber,
                geslacht: gender,
                vader: fatherDog,
                vaderId: document.getElementById('fatherId').value ? parseInt(document.getElementById('fatherId').value) : null,
                moeder: motherDog,
                moederId: document.getElementById('motherId').value ? parseInt(document.getElementById('motherId').value) : null,
                geboortedatum: this.formatDateForStorage(birthDate),
                kennelnaam: document.getElementById('kennelName').value.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Controleer gezondheidsgegevens
            const healthYes = document.getElementById('healthYes');
            if (healthYes && healthYes.checked) {
                // Voeg gezondheidsgegevens toe
                pupData.ras = document.getElementById('breed').value.trim();
                pupData.heupdysplasie = document.getElementById('hipDysplasia').value;
                pupData.elleboogdysplasie = document.getElementById('elbowDysplasia').value;
                pupData.patella = document.getElementById('patellaLuxation').value;
                pupData.ogen = document.getElementById('eyes').value;
                pupData.ogenVerklaring = document.getElementById('eyesExplanation')?.value.trim() || '';
                pupData.dandyWalker = document.getElementById('dandyWalker').value;
                pupData.schildklier = document.getElementById('thyroid').value;
                pupData.schildklierVerklaring = document.getElementById('thyroidExplanation')?.value.trim() || '';
                pupData.land = document.getElementById('country').value.trim();
                pupData.postcode = document.getElementById('zipCode').value.trim();
                pupData.opmerkingen = document.getElementById('remarks').value.trim();
                
                if (!pupData.ras) {
                    this.showAlert('error', this.t('breedRequired'));
                    return;
                }
            } else {
                // Gebruik ras van moeder als standaard
                const motherId = document.getElementById('motherId').value;
                if (motherId) {
                    try {
                        const mother = await this.getDogById(motherId);
                        pupData.ras = mother.ras || '';
                    } catch (error) {
                        console.error('Fout bij ophalen moederras:', error);
                    }
                }
                
                if (!pupData.ras) {
                    this.showAlert('error', this.t('breedRequired'));
                    return;
                }
            }
            
            // Toon loading indicator
            this.showAlert('info', 'Pup opslaan...');
            
            // Sla pup op in database
            let savedPup;
            if (this.db && typeof this.db.voegHondToe === 'function') {
                savedPup = await this.db.voegHondToe(pupData);
            } else if (window.db && typeof window.db.voegHondToe === 'function') {
                savedPup = await window.db.voegHondToe(pupData);
            } else {
                throw new Error('Database method voegHondToe niet beschikbaar');
            }
            
            // Voeg toe aan lijst van opgeslagen pups
            this.savedPups.push({
                ...savedPup,
                displayIndex: this.savedPups.length + 1
            });
            
            this.showAlert('success', this.t('pupSaved'));
            
            // Update lijst met opgeslagen pups
            this.updateSavedPupsList();
            
            // Reset pup formulier voor volgende pup
            this.resetPupForm();
            
            // Toon sectie met opgeslagen pups
            document.getElementById('savedPupsSection').style.display = 'block';
            
        } catch (error) {
            this.showAlert('error', `${this.t('saveError')}${error.message}`);
        }
    }
    
    async getDogById(dogId) {
        if (this.db && typeof this.db.getHond === 'function') {
            return await this.db.getHond(dogId);
        } else if (window.db && typeof window.db.getHond === 'function') {
            return await window.db.getHond(dogId);
        }
        return null;
    }
    
    resetPupForm() {
        // Reset pup velden
        document.getElementById('dogName').value = '';
        document.getElementById('pedigreeNumber').value = '';
        document.getElementById('gender').value = '';
        
        // Reset gezondheidsgegevens
        document.getElementById('breed').value = '';
        document.getElementById('country').value = '';
        document.getElementById('hipDysplasia').value = '';
        document.getElementById('elbowDysplasia').value = '';
        document.getElementById('patellaLuxation').value = '';
        document.getElementById('eyes').value = '';
        document.getElementById('eyesExplanation').value = '';
        document.getElementById('dandyWalker').value = '';
        document.getElementById('thyroid').value = '';
        document.getElementById('thyroidExplanation').value = '';
        document.getElementById('zipCode').value = '';
        document.getElementById('remarks').value = '';
        document.getElementById('dogPhoto').value = '';
        
        // Verberg uitleg velden
        document.getElementById('eyesExplanationContainer').style.display = 'none';
        document.getElementById('thyroidExplanationContainer').style.display = 'none';
        
        // Reset gezondheidskeuze
        document.getElementById('healthNo').checked = true;
        document.getElementById('healthDataForm').style.display = 'none';
        
        // Focus op naam veld
        document.getElementById('dogName').focus();
    }
    
    updateSavedPupsList() {
        const savedPupsList = document.getElementById('savedPupsList');
        if (!savedPupsList) return;
        
        if (this.savedPups.length === 0) {
            savedPupsList.innerHTML = '<div class="text-muted">Nog geen pups toegevoegd</div>';
            return;
        }
        
        let html = '';
        this.savedPups.forEach((pup, index) => {
            html += `
                <div class="saved-pup-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${pup.displayIndex}. ${pup.naam}</strong>
                            <div class="pup-info">
                                Stamboom: ${pup.stamboomnr} | 
                                Geslacht: ${pup.geslacht === 'reuen' ? this.t('male') : this.t('female')} | 
                                Ras: ${pup.ras || 'Onbekend'}
                            </div>
                        </div>
                        <div>
                            <span class="badge bg-success">${this.t('saved')}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        savedPupsList.innerHTML = html;
    }
    
    async finishLitter() {
        try {
            if (this.savedPups.length === 0) {
                const confirmAdd = confirm("Je hebt nog geen pups toegevoegd. Wil je toch doorgaan?");
                if (!confirmAdd) return;
            }
            
            this.showAlert('success', this.t('litterSaved'));
            
            // Wacht even en ga terug naar keuze scherm
            setTimeout(() => {
                if (window.dogManager && window.dogManager.showChoiceScreen) {
                    window.dogManager.showChoiceScreen();
                }
            }, 1500);
            
        } catch (error) {
            this.showAlert('error', `${this.t('saveError')}${error.message}`);
        }
    }
    
    formatDateForStorage(dateString) {
        // Converteer DD/MM/YYYY naar YYYY-MM-DD
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateString;
    }
    
    showAlert(type, message) {
        // Gebruik dezelfde alert functie als DogManager als beschikbaar
        if (window.dogManager && window.dogManager.showError && type === 'error') {
            window.dogManager.showError(message);
        } else if (window.dogManager && window.dogManager.showSuccess && type === 'success') {
            window.dogManager.showSuccess(message);
        } else if (window.dogManager && window.dogManager.showProgress && type === 'info') {
            window.dogManager.showProgress(message);
        } else {
            // Fallback naar browser alert
            if (type === 'error') {
                alert('❌ ' + message);
            } else if (type === 'success') {
                alert('✅ ' + message);
            } else {
                console.log(message);
            }
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}