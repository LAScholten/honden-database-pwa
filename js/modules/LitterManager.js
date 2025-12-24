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
                dandyFreeDNA: "Frei op ouders",
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
        this.isInitialized = false;
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
    
    getFormHTML(litterData = null) {
        console.log('LitterManager: getFormHTML aangeroepen');
        
        const t = this.t.bind(this);
        const data = litterData || {};
        
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
            <form id="litterForm">
                <input type="hidden" id="litterFatherId" value="${data.vaderId || ''}">
                <input type="hidden" id="litterMotherId" value="${data.moederId || ''}">
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="litterName" class="form-label">${t('nameRequired')}</label>
                            <input type="text" class="form-control" id="litterName" value="${data.naam || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="litterPedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                            <input type="text" class="form-control" id="litterPedigreeNumber" value="${data.stamboomnr || ''}" required>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="litterBreed" class="form-label">${t('breedRequired')}</label>
                            <input type="text" class="form-control" id="litterBreed" value="${data.ras || ''}" required>
                            ${recentBreedsHTML}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="litterGender" class="form-label">${t('gender')}</label>
                            <select class="form-select" id="litterGender">
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
                            <label for="litterFather" class="form-label">${t('father')}</label>
                            <input type="text" class="form-control" id="litterFather" 
                                   value="${data.vader || ''}" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="father"
                                   autocomplete="off">
                            <div class="autocomplete-dropdown" id="litterFatherDropdown" style="display: none;"></div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="litterMother" class="form-label">${t('mother')}</label>
                            <input type="text" class="form-control" id="litterMother" 
                                   value="${data.moeder || ''}" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="mother"
                                   autocomplete="off">
                            <div class="autocomplete-dropdown" id="litterMotherDropdown" style="display: none;"></div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="litterBirthDate" class="form-label">${t('birthDate')}</label>
                            <input type="date" class="form-control" id="litterBirthDate" value="${data.geboortedatum || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="litterDeathDate" class="form-label">${t('deathDate')}</label>
                            <input type="date" class="form-control" id="litterDeathDate" value="${data.overlijdensdatum || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="litterHipDysplasia" class="form-label">${t('hipDysplasia')}</label>
                            <select class="form-select" id="litterHipDysplasia">
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
                            <label for="litterElbowDysplasia" class="form-label">${t('elbowDysplasia')}</label>
                            <select class="form-select" id="litterElbowDysplasia">
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
                            <label for="litterPatellaLuxation" class="form-label">${t('patellaLuxation')}</label>
                            <select class="form-select" id="litterPatellaLuxation">
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
                            <label for="litterEyes" class="form-label">${t('eyes')}</label>
                            <select class="form-select" id="litterEyes">
                                <option value="">${t('choose')}</option>
                                <option value="Vrij" ${data.ogen === 'Vrij' ? 'selected' : ''}>${t('eyesFree')}</option>
                                <option value="Distichiasis" ${data.ogen === 'Distichiasis' ? 'selected' : ''}>${t('eyesDistichiasis')}</option>
                                <option value="Overig" ${data.ogen === 'Overig' ? 'selected' : ''}>${t('eyesOther')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="litterEyesExplanationContainer" style="${data.ogen === 'Overig' ? '' : 'display: none;'}">
                            <label for="litterEyesExplanation" class="form-label">${t('eyesExplanation')}</label>
                            <input type="text" class="form-control" id="litterEyesExplanation" value="${data.ogenVerklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="litterDandyWalker" class="form-label">${t('dandyWalker')}</label>
                            <select class="form-select" id="litterDandyWalker">
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
                            <label for="litterThyroid" class="form-label">${t('thyroid')}</label>
                            <select class="form-select" id="litterThyroid">
                                <option value="">${t('choose')}</option>
                                <option value="Negatief" ${data.schildklier === 'Negatief' ? 'selected' : ''}>${t('thyroidNegative')}</option>
                                <option value="Positief" ${data.schildklier === 'Positief' ? 'selected' : ''}>${t('thyroidPositive')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="litterThyroidExplanationContainer" style="${data.schildklier === 'Positief' ? '' : 'display: none;'}">
                            <label for="litterThyroidExplanation" class="form-label">${t('thyroidExplanation')}</label>
                            <input type="text" class="form-control" id="litterThyroidExplanation" value="${data.schildklierVerklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="litterCountry" class="form-label">${t('country')}</label>
                            <input type="text" class="form-control" id="litterCountry" value="${data.land || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="litterZipCode" class="form-label">${t('zipCode')}</label>
                            <input type="text" class="form-control" id="litterZipCode" value="${data.postcode || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="litterPhoto" class="form-label">${t('addPhoto')}</label>
                    <div class="input-group">
                        <input type="file" class="form-control" id="litterPhoto" accept="image/*">
                        <label class="input-group-text" for="litterPhoto">${t('chooseFile')}</label>
                    </div>
                    <div class="form-text">${t('noFileChosen')}</div>
                </div>
                
                <div class="mb-3">
                    <label for="litterRemarks" class="form-label">${t('remarks')}</label>
                    <textarea class="form-control" id="litterRemarks" rows="3">${data.opmerkingen || ''}</textarea>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    ${t('requiredFields')}
                </div>
                
                <div class="text-end">
                    <button type="button" class="btn btn-primary" id="saveLitterBtn">
                        ${t('saveDog')}
                    </button>
                </div>
            </form>
        `;
    }
    
    setupEvents() {
        console.log('LitterManager: setupEvents aangeroepen');
        
        if (!this.isInitialized) {
            console.error('LitterManager: Niet geïnitialiseerd! Roep eerst initialize() aan');
            return;
        }
        
        // Event listeners voor formulier
        const saveBtn = document.getElementById('saveLitterBtn');
        if (saveBtn) {
            console.log('LitterManager: Save button gevonden');
            saveBtn.addEventListener('click', () => {
                console.log('LitterManager: Save button geklikt');
                this.saveLitter();
            });
        } else {
            console.error('LitterManager: Save button niet gevonden!');
            // Probeer opnieuw na korte vertraging
            setTimeout(() => {
                const retryBtn = document.getElementById('saveLitterBtn');
                if (retryBtn) {
                    console.log('LitterManager: Save button gevonden na retry');
                    retryBtn.addEventListener('click', () => {
                        this.saveLitter();
                    });
                }
            }, 500);
        }
        
        // Eyes dropdown handler
        const eyesSelect = document.getElementById('litterEyes');
        if (eyesSelect) {
            eyesSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('litterEyesExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Overig' ? 'block' : 'none';
                }
            });
        } else {
            console.log('LitterManager: Eyes select niet gevonden');
        }
        
        // Thyroid dropdown handler
        const thyroidSelect = document.getElementById('litterThyroid');
        if (thyroidSelect) {
            thyroidSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('litterThyroidExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Positief' ? 'block' : 'none';
                }
            });
        } else {
            console.log('LitterManager: Thyroid select niet gevonden');
        }
        
        // Recente rassen knoppen - Delegatie gebruiken
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('recent-breed-btn')) {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('litterBreed');
                if (breedInput) {
                    breedInput.value = breed;
                    console.log('LitterManager: Ras geselecteerd:', breed);
                }
            }
        });
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
        
        console.log('LitterManager: Alle events ingesteld');
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
    
    setupParentAutocomplete() {
        console.log('LitterManager: setupParentAutocomplete aangeroepen');
        
        // Event listeners voor vader en moeder velden
        const fatherInput = document.getElementById('litterFather');
        const motherInput = document.getElementById('litterMother');
        
        if (fatherInput) {
            fatherInput.addEventListener('focus', () => {
                console.log('LitterManager: Vader input focus');
                // Zorg dat honden geladen zijn
                this.loadAllDogs();
            });
            
            fatherInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                this.showParentAutocomplete(searchTerm, 'litterFather');
            });
            
            fatherInput.addEventListener('blur', () => {
                setTimeout(() => {
                    const dropdown = document.getElementById('litterFatherDropdown');
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
                this.showParentAutocomplete(searchTerm, 'litterMother');
            });
            
            motherInput.addEventListener('blur', () => {
                setTimeout(() => {
                    const dropdown = document.getElementById('litterMotherDropdown');
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
        const isFather = parentInputId === 'litterFather';
        
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
        
        // Verzamel formulier data
        const dogData = {
            naam: document.getElementById('litterName')?.value.trim() || '',
            stamboomnr: document.getElementById('litterPedigreeNumber')?.value.trim() || '',
            ras: document.getElementById('litterBreed')?.value.trim() || '',
            geslacht: document.getElementById('litterGender')?.value || '',
            vader: document.getElementById('litterFather')?.value.trim() || '',
            vaderId: document.getElementById('litterFatherId')?.value ? parseInt(document.getElementById('litterFatherId').value) : null,
            moeder: document.getElementById('litterMother')?.value.trim() || '',
            moederId: document.getElementById('litterMotherId')?.value ? parseInt(document.getElementById('litterMotherId').value) : null,
            geboortedatum: document.getElementById('litterBirthDate')?.value || '',
            overlijdensdatum: document.getElementById('litterDeathDate')?.value || '',
            heupdysplasie: document.getElementById('litterHipDysplasia')?.value || '',
            elleboogdysplasie: document.getElementById('litterElbowDysplasia')?.value || '',
            patella: document.getElementById('litterPatellaLuxation')?.value || '',
            ogen: document.getElementById('litterEyes')?.value || '',
            ogenVerklaring: document.getElementById('litterEyesExplanation')?.value.trim() || '',
            dandyWalker: document.getElementById('litterDandyWalker')?.value || '',
            schildklier: document.getElementById('litterThyroid')?.value || '',
            schildklierVerklaring: document.getElementById('litterThyroidExplanation')?.value.trim() || '',
            land: document.getElementById('litterCountry')?.value.trim() || '',
            postcode: document.getElementById('litterZipCode')?.value.trim() || '',
            opmerkingen: document.getElementById('litterRemarks')?.value.trim() || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('LitterManager: Dog data verzameld:', dogData);
        
        // Validatie
        if (!dogData.naam) {
            this.showError('Naam is verplicht');
            return;
        }
        
        if (!dogData.stamboomnr) {
            this.showError('Stamboomnummer is verplicht');
            return;
        }
        
        if (!dogData.ras) {
            this.showError('Ras is verplicht');
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress(this.t('savingDog'));
        
        try {
            console.log('LitterManager: Probeer hond op te slaan via db...');
            const result = await this.db.voegHondToe(dogData);
            console.log('LitterManager: Hond opgeslagen met ID:', result);
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('litterPhoto');
            if (photoInput && photoInput.files.length > 0) {
                console.log('LitterManager: Foto uploaden...');
                await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
            }
            
            this.hideProgress();
            this.showSuccess(this.t('dogAdded'));
            
            // Reset formulier
            this.resetForm();
            
        } catch (error) {
            console.error('LitterManager: Fout bij opslaan hond:', error);
            this.hideProgress();
            this.showError(`${this.t('addFailed')}${error.message}`);
        }
    }
    
    resetForm() {
        // Reset alle formulier velden
        const form = document.getElementById('litterForm');
        if (form) {
            form.reset();
        }
        
        // Reset hidden inputs
        document.getElementById('litterFatherId').value = '';
        document.getElementById('litterMotherId').value = '';
        
        // Reset dropdowns
        const dropdowns = document.querySelectorAll('.autocomplete-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
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