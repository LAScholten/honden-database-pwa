/**
 * Dog Manager Module
 * Beheert het toevoegen van nieuwe honden
 */

class DogManager extends BaseModule {
    constructor() {
        super();
        console.log('DogManager constructor aangeroepen');
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
                saveDog: "Hond Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                choose: "Kies...",
                close: "Sluiten",
                
                // Alerts
                adminOnly: "Alleen administrators mogen honden toevoegen/bewerken",
                fieldsRequired: "Naam, stamboomnummer en ras zijn verplichte velden",
                savingDog: "Hond opslaan...",
                dogAdded: "Hond succesvol toegevoegd!",
                dogUpdated: "Hond succesvol bijgewerkt!",
                dogDeleted: "Hond succesvol verwijderen!",
                addFailed: "Fout bij toevoegen hond: ",
                updateFailed: "Fout bij bijwerken hond: ",
                deleteFailed: "Fout bij verwijderen hond: ",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                photoError: "Fout bij uploaden foto: ",
                
                // Modal titels
                addDogTitle: "Nieuwe Hond Toevoegen",
                editDogTitle: "Hond Bewerken"
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
                
                // Alerts
                adminOnly: "Only administrators can add/edit dogs",
                fieldsRequired: "Name, pedigree number and breed are required fields",
                savingDog: "Saving dog...",
                dogAdded: "Dog successfully added!",
                dogUpdated: "Dog successfully updated!",
                dogDeleted: "Dog successfully deleted!",
                addFailed: "Error adding dog: ",
                updateFailed: "Error updating dog: ",
                deleteFailed: "Error deleting dog: ",
                confirmDelete: "Are you sure you want to delete this dog?",
                photoAdded: "Photo added",
                photoError: "Error uploading photo: ",
                
                // Modal titles
                addDogTitle: "Add New Dog",
                editDogTitle: "Edit Dog"
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
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                choose: "Wählen...",
                close: "Schließen",
                
                // Meldungen
                adminOnly: "Nur Administratoren können Hunde hinzufügen/bearbeiten",
                fieldsRequired: "Name, Stammbaum-Nummer und Rasse sind Pflichtfelder",
                savingDog: "Hund wird gespeichert...",
                dogAdded: "Hund erfolgreich hinzugefügt!",
                dogUpdated: "Hund erfolgreich aktualisiert!",
                dogDeleted: "Hund erfolgreich gelöscht!",
                addFailed: "Fehler beim Hinzufügen des Hundes: ",
                updateFailed: "Fehler beim Aktualisieren des Hundes: ",
                deleteFailed: "Fehler beim Löschen des Hundes: ",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Hund löschen möchten?",
                photoAdded: "Foto hinzugefügt",
                photoError: "Fehler beim Hochladen des Fotos: ",
                
                // Modal titel
                addDogTitle: "Neuen Hund Hinzufügen",
                editDogTitle: "Hund Bearbeiten"
            }
        };
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
        console.log('DogManager: injectDependencies aangeroepen');
        this.db = db;
        this.auth = auth;
        this.isInitialized = true;
        console.log('DogManager: Dependencies geïnjecteerd - db:', !!this.db, 'auth:', !!this.auth);
    }
    
    /**
     * Initialiseer DogManager
     */
    async initialize() {
        console.log('DogManager: initialize aangeroepen');
        
        if (!this.db || !this.auth) {
            console.error('DogManager: Dependencies niet geïnjecteerd!');
            throw new Error('DogManager is niet geïnitialiseerd met dependencies');
        }
        
        // Laad honden voor autocomplete
        await this.loadAllDogs();
        
        console.log('DogManager: Initialisatie voltooid');
        return true;
    }
    
    /**
     * GET MODAL HTML
     * Retourneert het HTML voor de "Nieuwe Hond" modal
     */
    getModalHTML() {
        console.log('DogManager: getModalHTML aangeroepen');
        
        // Controleer rechten
        if (!this.auth || !this.auth.isAdmin()) {
            console.log('DogManager: Gebruiker is geen admin, toon toegang geweigerd');
            return this.getAccessDeniedHTML();
        }
        
        const formHTML = this.getFormHTML();
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="addDogModal" tabindex="-1" aria-labelledby="addDogModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="addDogModalLabel">
                                <i class="bi bi-plus-circle me-2"></i> ${t('addDogTitle')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            ${formHTML}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i> ${t('cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getFormHTML(dogData = null) {
        console.log('DogManager: getFormHTML aangeroepen');
        
        const t = this.t.bind(this);
        const data = dogData || {};
        
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
            <form id="dogForm">
                <input type="hidden" id="dogFatherId" value="${data.vaderId || ''}">
                <input type="hidden" id="dogMotherId" value="${data.moederId || ''}">
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogName" class="form-label">${t('nameRequired')}</label>
                            <input type="text" class="form-control" id="dogName" value="${data.naam || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogPedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                            <input type="text" class="form-control" id="dogPedigreeNumber" value="${data.stamboomnr || ''}" required>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogBreed" class="form-label">${t('breedRequired')}</label>
                            <input type="text" class="form-control" id="dogBreed" value="${data.ras || ''}" required>
                            ${recentBreedsHTML}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogGender" class="form-label">${t('gender')}</label>
                            <select class="form-select" id="dogGender">
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
                            <label for="dogFather" class="form-label">${t('father')}</label>
                            <input type="text" class="form-control" id="dogFather" 
                                   value="${data.vader || ''}" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="father"
                                   autocomplete="off">
                            <div class="autocomplete-dropdown" id="dogFatherDropdown" style="display: none;"></div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="dogMother" class="form-label">${t('mother')}</label>
                            <input type="text" class="form-control" id="dogMother" 
                                   value="${data.moeder || ''}" 
                                   placeholder="Begin met typen om te zoeken..."
                                   data-parent-type="mother"
                                   autocomplete="off">
                            <div class="autocomplete-dropdown" id="dogMotherDropdown" style="display: none;"></div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogBirthDate" class="form-label">${t('birthDate')}</label>
                            <input type="date" class="form-control" id="dogBirthDate" value="${data.geboortedatum || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogDeathDate" class="form-label">${t('deathDate')}</label>
                            <input type="date" class="form-control" id="dogDeathDate" value="${data.overlijdensdatum || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="dogHipDysplasia" class="form-label">${t('hipDysplasia')}</label>
                            <select class="form-select" id="dogHipDysplasia">
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
                            <label for="dogElbowDysplasia" class="form-label">${t('elbowDysplasia')}</label>
                            <select class="form-select" id="dogElbowDysplasia">
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
                            <label for="dogPatellaLuxation" class="form-label">${t('patellaLuxation')}</label>
                            <select class="form-select" id="dogPatellaLuxation">
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
                            <label for="dogEyes" class="form-label">${t('eyes')}</label>
                            <select class="form-select" id="dogEyes">
                                <option value="">${t('choose')}</option>
                                <option value="Vrij" ${data.ogen === 'Vrij' ? 'selected' : ''}>${t('eyesFree')}</option>
                                <option value="Distichiasis" ${data.ogen === 'Distichiasis' ? 'selected' : ''}>${t('eyesDistichiasis')}</option>
                                <option value="Overig" ${data.ogen === 'Overig' ? 'selected' : ''}>${t('eyesOther')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="dogEyesExplanationContainer" style="${data.ogen === 'Overig' ? '' : 'display: none;'}">
                            <label for="dogEyesExplanation" class="form-label">${t('eyesExplanation')}</label>
                            <input type="text" class="form-control" id="dogEyesExplanation" value="${data.ogenVerklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogDandyWalker" class="form-label">${t('dandyWalker')}</label>
                            <select class="form-select" id="dogDandyWalker">
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
                            <label for="dogThyroid" class="form-label">${t('thyroid')}</label>
                            <select class="form-select" id="dogThyroid">
                                <option value="">${t('choose')}</option>
                                <option value="Negatief" ${data.schildklier === 'Negatief' ? 'selected' : ''}>${t('thyroidNegative')}</option>
                                <option value="Positief" ${data.schildklier === 'Positief' ? 'selected' : ''}>${t('thyroidPositive')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="dogThyroidExplanationContainer" style="${data.schildklier === 'Positief' ? '' : 'display: none;'}">
                            <label for="dogThyroidExplanation" class="form-label">${t('thyroidExplanation')}</label>
                            <input type="text" class="form-control" id="dogThyroidExplanation" value="${data.schildklierVerklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogCountry" class="form-label">${t('country')}</label>
                            <input type="text" class="form-control" id="dogCountry" value="${data.land || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="dogZipCode" class="form-label">${t('zipCode')}</label>
                            <input type="text" class="form-control" id="dogZipCode" value="${data.postcode || ''}">
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
                    <label for="dogRemarks" class="form-label">${t('remarks')}</label>
                    <textarea class="form-control" id="dogRemarks" rows="3">${data.opmerkingen || ''}</textarea>
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
        `;
    }
    
    getAccessDeniedHTML() {
        return `
            <div class="modal fade" id="addDogModal" tabindex="-1" aria-labelledby="addDogModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-danger text-white">
                            <h5 class="modal-title" id="addDogModalLabel">
                                <i class="bi bi-shield-exclamation me-2"></i> Toegang Geweigerd
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger">
                                <h5><i class="bi bi-exclamation-triangle-fill"></i> Geen toegang</h5>
                                <p>Alleen administrators mogen nieuwe honden toevoegen.</p>
                                <p>Log in als administrator of vraag een administrator om een nieuwe hond voor u toe te voegen.</p>
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
        console.log('DogManager setupEvents called');
        
        if (!this.isInitialized) {
            console.error('DogManager: Niet geïnitialiseerd! Roep eerst initialize() aan');
            return;
        }
        
        // Setup form events
        this.setupFormEvents();
        
        console.log('DogManager: Events ingesteld');
    }
    
    setupFormEvents() {
        console.log('DogManager: setupFormEvents aangeroepen');
        
        // Event listeners voor formulier
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            console.log('DogManager: Save button gevonden');
            saveBtn.addEventListener('click', () => {
                console.log('DogManager: Save button geklikt');
                this.saveDog();
            });
        } else {
            console.error('DogManager: Save button niet gevonden!');
            setTimeout(() => {
                const retryBtn = document.getElementById('saveDogBtn');
                if (retryBtn) {
                    console.log('DogManager: Save button gevonden na retry');
                    retryBtn.addEventListener('click', () => {
                        this.saveDog();
                    });
                }
            }, 500);
        }
        
        // Eyes dropdown handler
        const eyesSelect = document.getElementById('dogEyes');
        if (eyesSelect) {
            eyesSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('dogEyesExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Overig' ? 'block' : 'none';
                }
            });
        } else {
            console.log('DogManager: Eyes select niet gevonden');
        }
        
        // Thyroid dropdown handler
        const thyroidSelect = document.getElementById('dogThyroid');
        if (thyroidSelect) {
            thyroidSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('dogThyroidExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Positief' ? 'block' : 'none';
                }
            });
        } else {
            console.log('DogManager: Thyroid select niet gevonden');
        }
        
        // Recente rassen knoppen
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('recent-breed-btn')) {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('dogBreed');
                if (breedInput) {
                    breedInput.value = breed;
                    console.log('DogManager: Ras geselecteerd:', breed);
                }
            }
        });
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
    }
    
    addToLastBreeds(breed) {
        if (!breed || breed.trim() === '') return;
        
        const breedStr = breed.trim();
        
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
        console.log('DogManager: Ras toegevoegd aan recente rassen:', breedStr);
    }
    
    async loadAllDogs() {
        console.log('DogManager: loadAllDogs aangeroepen');
        
        if (!this.db) {
            console.error('DogManager: Database niet beschikbaar voor loadAllDogs!');
            return;
        }
        
        try {
            console.log('DogManager: Laad honden van database...');
            this.allDogs = await this.db.getHonden();
            console.log('DogManager: Aantal honden geladen:', this.allDogs.length);
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
        } catch (error) {
            console.error('DogManager: Fout bij laden honden voor autocomplete:', error);
        }
    }
    
    setupParentAutocomplete() {
        console.log('DogManager: setupParentAutocomplete aangeroepen');
        
        // Event listeners voor vader en moeder velden
        const fatherInput = document.getElementById('dogFather');
        const motherInput = document.getElementById('dogMother');
        
        if (fatherInput) {
            fatherInput.addEventListener('focus', () => {
                console.log('DogManager: Vader input focus');
                this.loadAllDogs();
            });
            
            fatherInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                this.showParentAutocomplete(searchTerm, 'father');
            });
            
            fatherInput.addEventListener('blur', () => {
                setTimeout(() => {
                    const dropdown = document.getElementById('dogFatherDropdown');
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            });
        }
        
        if (motherInput) {
            motherInput.addEventListener('focus', () => {
                console.log('DogManager: Moeder input focus');
                this.loadAllDogs();
            });
            
            motherInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                this.showParentAutocomplete(searchTerm, 'mother');
            });
            
            motherInput.addEventListener('blur', () => {
                setTimeout(() => {
                    const dropdown = document.getElementById('dogMotherDropdown');
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
    
    showParentAutocomplete(searchTerm, parentType) {
        console.log('DogManager: showParentAutocomplete voor', parentType, 'zoekterm:', searchTerm);
        
        const dropdownId = 'dog' + parentType.charAt(0).toUpperCase() + parentType.slice(1) + 'Dropdown';
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) {
            console.error('DogManager: Dropdown niet gevonden voor', dropdownId);
            return;
        }
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        console.log('DogManager: Aantal honden beschikbaar voor autocomplete:', this.allDogs.length);
        
        // Bepaal welk geslacht we zoeken
        const isFather = parentType === 'father';
        
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
        
        console.log('DogManager: Aantal suggesties:', suggestions.length);
        
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
                const input = document.getElementById('dog' + parentType.charAt(0).toUpperCase() + parentType.slice(1));
                const idInput = document.getElementById('dog' + parentType.charAt(0).toUpperCase() + parentType.slice(1) + 'Id');
                
                if (input) {
                    input.value = dogName;
                }
                if (idInput) {
                    idInput.value = dogId;
                }
                
                dropdown.style.display = 'none';
                console.log('DogManager: Ouder geselecteerd:', dogName, 'ID:', dogId);
            });
        });
    }
    
    async saveDog() {
        console.log('DogManager: saveDog aangeroepen');
        
        if (!this.auth) {
            console.error('DogManager: Auth niet beschikbaar!');
            this.showError('Authenticatie niet beschikbaar');
            return;
        }
        
        if (!this.auth.isAdmin()) {
            console.log('DogManager: Gebruiker is geen admin');
            this.showError(this.t('adminOnly'));
            return;
        }
        
        if (!this.db) {
            console.error('DogManager: Database niet beschikbaar!');
            this.showError('Database niet beschikbaar');
            return;
        }
        
        // Verzamel formulier data
        const dogData = {
            naam: document.getElementById('dogName')?.value.trim() || '',
            stamboomnr: document.getElementById('dogPedigreeNumber')?.value.trim() || '',
            ras: document.getElementById('dogBreed')?.value.trim() || '',
            geslacht: document.getElementById('dogGender')?.value || '',
            vader: document.getElementById('dogFather')?.value.trim() || '',
            vaderId: document.getElementById('dogFatherId')?.value ? parseInt(document.getElementById('dogFatherId').value) : null,
            moeder: document.getElementById('dogMother')?.value.trim() || '',
            moederId: document.getElementById('dogMotherId')?.value ? parseInt(document.getElementById('dogMotherId').value) : null,
            geboortedatum: document.getElementById('dogBirthDate')?.value || '',
            overlijdensdatum: document.getElementById('dogDeathDate')?.value || '',
            heupdysplasie: document.getElementById('dogHipDysplasia')?.value || '',
            elleboogdysplasie: document.getElementById('dogElbowDysplasia')?.value || '',
            patella: document.getElementById('dogPatellaLuxation')?.value || '',
            ogen: document.getElementById('dogEyes')?.value || '',
            ogenVerklaring: document.getElementById('dogEyesExplanation')?.value.trim() || '',
            dandyWalker: document.getElementById('dogDandyWalker')?.value || '',
            schildklier: document.getElementById('dogThyroid')?.value || '',
            schildklierVerklaring: document.getElementById('dogThyroidExplanation')?.value.trim() || '',
            land: document.getElementById('dogCountry')?.value.trim() || '',
            postcode: document.getElementById('dogZipCode')?.value.trim() || '',
            opmerkingen: document.getElementById('dogRemarks')?.value.trim() || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('DogManager: Dog data verzameld:', dogData);
        
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
            console.log('DogManager: Probeer hond op te slaan via db...');
            const result = await this.db.voegHondToe(dogData);
            console.log('DogManager: Hond opgeslagen met ID:', result);
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput && photoInput.files.length > 0) {
                console.log('DogManager: Foto uploaden...');
                await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
            }
            
            this.hideProgress();
            this.showSuccess(this.t('dogAdded'));
            
            // Reset formulier
            this.resetForm();
            
        } catch (error) {
            console.error('DogManager: Fout bij opslaan hond:', error);
            this.hideProgress();
            this.showError(`${this.t('addFailed')}${error.message}`);
        }
    }
    
    resetForm() {
        // Reset alle formulier velden
        const form = document.getElementById('dogForm');
        if (form) {
            form.reset();
        }
        
        // Reset hidden inputs
        document.getElementById('dogFatherId').value = '';
        document.getElementById('dogMotherId').value = '';
        
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
        console.log('DogManager showProgress:', message);
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        } else {
            alert(message);
        }
    }
    
    hideProgress() {
        console.log('DogManager hideProgress');
        if (window.uiHandler && window.uiHandler.hideProgress) {
            window.uiHandler.hideProgress();
        }
    }
    
    showSuccess(message) {
        console.log('DogManager showSuccess:', message);
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message);
        } else {
            alert(message);
        }
    }
    
    showError(message) {
        console.error('DogManager showError:', message);
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message);
        } else {
            alert(message);
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.DogManager = DogManager;
}