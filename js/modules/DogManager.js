/**
 * Hond Management Module
 * Beheert toevoegen, zoeken en bewerken van honden
 */

class DogManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.translations = {
            nl: {
                // Modal titels
                newDog: "Nieuwe Hond Toevoegen",
                editDog: "Hond Bewerken",
                searchDog: "Hond Zoeken",
                
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
                
                // Zoek velden
                searchName: "Naam",
                searchPedigree: "Stamboomnummer",
                searchBreed: "Ras",
                searchCountry: "Land",
                searchGender: "Geslacht",
                allGenders: "Alle geslachten",
                enterName: "Voer naam in...",
                enterPedigree: "Voer stamboomnummer in...",
                enterBreed: "Voer ras in...",
                enterCountry: "Voer land in...",
                search: "Zoeken",
                reset: "Reset",
                enterCriteria: "Voer zoekcriteria in en klik op zoeken",
                
                // Resultaten
                searchResults: "Zoekresultaten",
                found: "gevonden",
                exportResults: "Exporteer",
                actions: "Acties",
                view: "Bekijken",
                edit: "Bewerken",
                
                // Details
                details: "Details",
                dogInfo: "Hond Informatie",
                healthInfo: "Gezondheidsinformatie",
                locationInfo: "Locatie informatie",
                pedigreeInfo: "Stamboom informatie",
                createdAt: "Aangemaakt",
                updatedAt: "Laatst bijgewerkt",
                
                // Alerts
                adminOnly: "Alleen administrators mogen honden toevoegen/bewerken",
                fieldsRequired: "Naam, stamboomnummer en ras zijn verplichte velden",
                savingDog: "Hond opslaan...",
                dogAdded: "Hond succesvol toegevoegd!",
                dogUpdated: "Hond succesvol bijgewerkt!",
                dogDeleted: "Hond succesvol verwijderd!",
                addFailed: "Fout bij toevoegen hond: ",
                updateFailed: "Fout bij bijwerken hond: ",
                deleteFailed: "Fout bij verwijderen hond: ",
                enterCriteriaError: "Voer minstens één zoekcriterium in",
                searching: "Zoeken...",
                searchFailed: "Zoeken mislukt: ",
                resetForm: "Zoekformulier gereset",
                noDogsFound: "Geen honden gevonden met de opgegeven criteria",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                exportSearch: "Zoekresultaten geëxporteerd!",
                exportFailed: "Export mislukt: ",
                photoAdded: "Foto toegevoegd",
                photoError: "Fout bij uploaden foto: "
            },
            en: {
                // Modal titles
                newDog: "Add New Dog",
                editDog: "Edit Dog",
                searchDog: "Search Dog",
                
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
                
                // Search fields
                searchName: "Name",
                searchPedigree: "Pedigree number",
                searchBreed: "Breed",
                searchCountry: "Country",
                searchGender: "Gender",
                allGenders: "All genders",
                enterName: "Enter name...",
                enterPedigree: "Enter pedigree number...",
                enterBreed: "Enter breed...",
                enterCountry: "Enter country...",
                search: "Search",
                reset: "Reset",
                enterCriteria: "Enter search criteria and click search",
                
                // Results
                searchResults: "Search Results",
                found: "found",
                exportResults: "Export",
                actions: "Actions",
                view: "View",
                edit: "Edit",
                
                // Details
                details: "Details",
                dogInfo: "Dog Information",
                healthInfo: "Health Information",
                locationInfo: "Location Information",
                pedigreeInfo: "Pedigree Information",
                createdAt: "Created",
                updatedAt: "Last updated",
                
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
                enterCriteriaError: "Enter at least one search criterion",
                searching: "Searching...",
                searchFailed: "Search failed: ",
                resetForm: "Search form reset",
                noDogsFound: "No dogs found with the specified criteria",
                confirmDelete: "Are you sure you want to delete this dog?",
                exportSearch: "Search results exported!",
                exportFailed: "Export failed: ",
                photoAdded: "Photo added",
                photoError: "Error uploading photo: "
            },
            de: {
                // Modal Titel
                newDog: "Neuen Hund hinzufügen",
                editDog: "Hund bearbeiten",
                searchDog: "Hund suchen",
                
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
                dandyFreeParents: "Frei auf Eltern",
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
                
                // Suchfelder
                searchName: "Name",
                searchPedigree: "Stammbaum-Nummer",
                searchBreed: "Rasse",
                searchCountry: "Land",
                searchGender: "Geschlecht",
                allGenders: "Alle Geschlechter",
                enterName: "Name eingeben...",
                enterPedigree: "Stammbaum-Nummer eingeben...",
                enterBreed: "Rasse eingeben...",
                enterCountry: "Land eingeben...",
                search: "Suchen",
                reset: "Zurücksetzen",
                enterCriteria: "Suchkriterien eingeben und auf Suchen klicken",
                
                // Ergebnisse
                searchResults: "Suchergebnisse",
                found: "gefunden",
                exportResults: "Exportieren",
                actions: "Aktionen",
                view: "Ansehen",
                edit: "Bearbeiten",
                
                // Details
                details: "Details",
                dogInfo: "Hund Information",
                healthInfo: "Gesundheitsinformation",
                locationInfo: "Standort Information",
                pedigreeInfo: "Stammbaum Information",
                createdAt: "Erstellt",
                updatedAt: "Zuletzt aktualisiert",
                
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
                enterCriteriaError: "Geben Sie mindestens ein Suchkriterium ein",
                searching: "Suche läuft...",
                searchFailed: "Suche fehlgeschlagen: ",
                resetForm: "Suchformular zurückgesetzt",
                noDogsFound: "Keine Hunde mit den angegebenen Kriterien gefunden",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Hund löschen möchten?",
                exportSearch: "Suchergebnisse exportiert!",
                exportFailed: "Export fehlgeschlagen: ",
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
    
    getModalHTML(isEdit = false, dogData = null) {
        const t = this.t.bind(this);
        const modalTitle = isEdit ? t('editDog') : t('newDog');
        const modalId = isEdit ? 'editDogModal' : 'addDogModal';
        
        const data = dogData || {};
        
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
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="${modalId}Label">
                                <i class="bi bi-plus-circle"></i> ${modalTitle}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <form id="${isEdit ? 'editDogForm' : 'addDogForm'}">
                                <input type="hidden" id="dogId" value="${data.id || ''}">
                                
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
                                        <div class="mb-3">
                                            <label for="father" class="form-label">${t('father')}</label>
                                            <input type="text" class="form-control" id="father" value="${data.vader || ''}">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="mother" class="form-label">${t('mother')}</label>
                                            <input type="text" class="form-control" id="mother" value="${data.moeder || ''}">
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
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('cancel')}</button>
                            ${isEdit ? `
                            <button type="button" class="btn btn-danger" id="deleteDogBtn">
                                <i class="bi bi-trash"></i> ${t('delete')}
                            </button>
                            ` : ''}
                            <button type="button" class="btn btn-primary" id="saveDogBtn">
                                ${t('saveDog')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getSearchModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search"></i> ${t('searchDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-3">
                                            <label for="searchNaam" class="form-label">${t('searchName')}</label>
                                            <input type="text" class="form-control" id="searchNaam" placeholder="${t('enterName')}">
                                        </div>
                                        <div class="col-md-3">
                                            <label for="searchStamboomnr" class="form-label">${t('searchPedigree')}</label>
                                            <input type="text" class="form-control" id="searchStamboomnr" placeholder="${t('enterPedigree')}">
                                        </div>
                                        <div class="col-md-3">
                                            <label for="searchRas" class="form-label">${t('searchBreed')}</label>
                                            <input type="text" class="form-control" id="searchRas" placeholder="${t('enterBreed')}">
                                        </div>
                                        <div class="col-md-3">
                                            <label for="searchLand" class="form-label">${t('searchCountry')}</label>
                                            <input type="text" class="form-control" id="searchLand" placeholder="${t('enterCountry')}">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="searchGeslacht" class="form-label">${t('searchGender')}</label>
                                            <select class="form-select" id="searchGeslacht">
                                                <option value="">${t('allGenders')}</option>
                                                <option value="reuen">${t('male')}</option>
                                                <option value="teven">${t('female')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <button class="btn btn-info" id="searchBtn">
                                            <i class="bi bi-search"></i> ${t('search')}
                                        </button>
                                        <button class="btn btn-secondary" id="resetSearchBtn">
                                            <i class="bi bi-arrow-clockwise"></i> ${t('reset')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="searchResultsContainer">
                                <div class="text-center py-5">
                                    <i class="bi bi-search display-1 text-muted"></i>
                                    <p class="mt-3 text-muted">${t('enterCriteria')}</p>
                                </div>
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
    }
    
    setupSearchEvents() {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }
        
        const resetBtn = document.getElementById('resetSearchBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSearchForm();
            });
        }
    }
    
    async saveDog(formType) {
        if (!this.auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
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
            moeder: document.getElementById('mother').value.trim(),
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
            updatedAt: new Date().toISOString()
        };
        
        // Alleen bij toevoegen
        if (!isEdit) {
            dogData.createdAt = new Date().toISOString();
        }
        
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress(this.t('savingDog'));
        
        try {
            if (isEdit && dogId) {
                await this.db.updateHond(parseInt(dogId), dogData);
                this.hideProgress();
                this.showSuccess(this.t('dogUpdated'));
            } else {
                await this.db.voegHondToe(dogData);
                this.hideProgress();
                this.showSuccess(this.t('dogAdded'));
            }
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput.files.length > 0) {
                await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
            }
            
            // Modal sluiten
            const modalId = isEdit ? 'editDogModal' : 'addDogModal';
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
                if (modal) modal.hide();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            const errorMsg = isEdit ? this.t('updateFailed') : this.t('addFailed');
            this.showError(`${errorMsg}${error.message}`);
        }
    }
    
    async deleteDog() {
        if (!this.auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        const dogId = document.getElementById('dogId').value;
        if (!dogId) return;
        
        if (!confirm(this.t('confirmDelete'))) {
            return;
        }
        
        this.showProgress("Verwijderen...");
        
        try {
            await this.db.verwijderHond(parseInt(dogId));
            this.hideProgress();
            this.showSuccess(this.t('dogDeleted'));
            
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('editDogModal'));
                if (modal) modal.hide();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('deleteFailed')}${error.message}`);
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
    
    async performSearch() {
        const criteria = {
            naam: document.getElementById('searchNaam').value.trim(),
            stamboomnr: document.getElementById('searchStamboomnr').value.trim(),
            ras: document.getElementById('searchRas').value.trim(),
            land: document.getElementById('searchLand').value.trim(),
            geslacht: document.getElementById('searchGeslacht').value
        };
        
        Object.keys(criteria).forEach(key => {
            if (!criteria[key]) delete criteria[key];
        });
        
        if (Object.keys(criteria).length === 0) {
            this.showError(this.t('enterCriteriaError'));
            return;
        }
        
        this.showProgress(this.t('searching'));
        
        try {
            const results = await this.db.zoekHonden(criteria);
            this.hideProgress();
            this.displaySearchResults(results);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('searchFailed')}${error.message}`);
        }
    }
    
    resetSearchForm() {
        document.getElementById('searchNaam').value = '';
        document.getElementById('searchStamboomnr').value = '';
        document.getElementById('searchRas').value = '';
        document.getElementById('searchLand').value = '';
        document.getElementById('searchGeslacht').value = '';
        
        const resultsContainer = document.getElementById('searchResultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <p class="mt-3 text-muted">${this.t('enterCriteria')}</p>
                </div>
            `;
        }
        
        this.showSuccess(this.t('resetForm'));
    }
    
    displaySearchResults(results) {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <p class="mt-3 text-muted">${t('noDogsFound')}</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${t('searchResults')} (${results.length} ${t('found')})</h6>
                        <button class="btn btn-sm btn-outline-info" id="exportSearchResultsBtn">
                            <i class="bi bi-download"></i> ${t('exportResults')}
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>${t('name')}</th>
                                    <th>${t('breed')}</th>
                                    <th>${t('pedigreeNumber')}</th>
                                    <th>${t('gender')}</th>
                                    <th>${t('country')}</th>
                                    <th>${t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        results.forEach(hond => {
            const genderText = hond.geslacht === 'reuen' ? t('male') : 
                             hond.geslacht === 'teven' ? t('female') : '-';
            
            html += `
                <tr>
                    <td><strong>${hond.naam}</strong></td>
                    <td>${hond.ras || '-'}</td>
                    <td><code>${hond.stamboomnr || '-'}</code></td>
                    <td>${genderText}</td>
                    <td>${hond.land || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-dog-btn" data-id="${hond.id}">
                            <i class="bi bi-eye"></i> ${t('view')}
                        </button>
                        ${this.auth.isAdmin() ? `
                        <button class="btn btn-sm btn-outline-warning edit-dog-btn" data-id="${hond.id}">
                            <i class="bi bi-pencil"></i> ${t('edit')}
                        </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        });
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Event listeners voor knoppen
        document.querySelectorAll('.view-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.view-dog-btn').dataset.id;
                this.viewDogDetails(hondId);
            });
        });
        
        document.querySelectorAll('.edit-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.edit-dog-btn').dataset.id;
                this.editDog(hondId);
            });
        });
        
        const exportBtn = document.getElementById('exportSearchResultsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportSearchResults(results);
            });
        }
    }
    
    async viewDogDetails(hondId) {
        const t = this.t.bind(this);
        
        try {
            const honden = await this.db.getHonden();
            const hond = honden.find(h => h.id === parseInt(hondId));
            
            if (!hond) {
                this.showError('Hond niet gevonden');
                return;
            }
            
            const genderText = hond.geslacht === 'reuen' ? t('male') : 
                             hond.geslacht === 'teven' ? t('female') : '-';
            
            const html = `
                <div class="modal fade" id="viewDogModal" tabindex="-1" aria-labelledby="viewDogModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-info text-white">
                                <h5 class="modal-title" id="viewDogModalLabel">
                                    <i class="bi bi-eye"></i> ${hond.naam} - ${t('details')}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="border-bottom pb-2">${t('dogInfo')}</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th style="width: 40%">${t('name')}:</th>
                                                <td>${hond.naam}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('breed')}:</th>
                                                <td>${hond.ras || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('pedigreeNumber')}:</th>
                                                <td><code>${hond.stamboomnr || '-'}</code></td>
                                            </tr>
                                            <tr>
                                                <th>${t('gender')}:</th>
                                                <td>${genderText}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('birthDate')}:</th>
                                                <td>${hond.geboortedatum ? new Date(hond.geboortedatum).toLocaleDateString(this.currentLang) : '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('deathDate')}:</th>
                                                <td>${hond.overlijdensdatum ? new Date(hond.overlijdensdatum).toLocaleDateString(this.currentLang) : '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('country')}:</th>
                                                <td>${hond.land || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('zipCode')}:</th>
                                                <td>${hond.postcode || '-'}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="border-bottom pb-2">${t('pedigreeInfo')}</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th style="width: 40%">${t('father')}:</th>
                                                <td>${hond.vader || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('mother')}:</th>
                                                <td>${hond.moeder || '-'}</td>
                                            </tr>
                                        </table>
                                        
                                        <h6 class="border-bottom pb-2 mt-4">${t('locationInfo')}</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th>${t('createdAt')}:</th>
                                                <td>${new Date(hond.createdAt).toLocaleString(this.currentLang)}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('updatedAt')}:</th>
                                                <td>${new Date(hond.updatedAt).toLocaleString(this.currentLang)}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                
                                <div class="row mt-4">
                                    <div class="col-12">
                                        <h6 class="border-bottom pb-2">${t('healthInfo')}</h6>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <strong>${t('hipDysplasia')}:</strong><br>
                                                ${hond.heupdysplasie || '-'}
                                            </div>
                                            <div class="col-md-3">
                                                <strong>${t('elbowDysplasia')}:</strong><br>
                                                ${hond.elleboogdysplasie || '-'}
                                            </div>
                                            <div class="col-md-3">
                                                <strong>${t('patellaLuxation')}:</strong><br>
                                                ${hond.patella || '-'}
                                            </div>
                                            <div class="col-md-3">
                                                <strong>${t('eyes')}:</strong><br>
                                                ${hond.ogen || '-'}
                                                ${hond.ogenVerklaring ? ` (${hond.ogenVerklaring})` : ''}
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <strong>${t('dandyWalker')}:</strong><br>
                                                ${hond.dandyWalker || '-'}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>${t('thyroid')}:</strong><br>
                                                ${hond.schildklier || '-'}
                                                ${hond.schildklierVerklaring ? ` (${hond.schildklierVerklaring})` : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                ${hond.opmerkingen ? `
                                <div class="mt-4">
                                    <h6 class="border-bottom pb-2">${t('remarks')}</h6>
                                    <div class="bg-light p-3 rounded">
                                        ${hond.opmerkingen}
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const container = document.getElementById('modalsContainer');
            container.insertAdjacentHTML('beforeend', html);
            
            const modalElement = document.getElementById('viewDogModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
        } catch (error) {
            this.showError(`Fout bij laden hond details: ${error.message}`);
        }
    }
    
    async editDog(hondId) {
        if (!this.auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        try {
            const honden = await this.db.getHonden();
            const hond = honden.find(h => h.id === parseInt(hondId));
            
            if (!hond) {
                this.showError('Hond niet gevonden');
                return;
            }
            
            const html = this.getModalHTML(true, hond);
            const container = document.getElementById('modalsContainer');
            container.insertAdjacentHTML('beforeend', html);
            
            const modalElement = document.getElementById('editDogModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            this.setupEvents();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
        } catch (error) {
            this.showError(`Fout bij bewerken hond: ${error.message}`);
        }
    }
    
    async exportSearchResults(results) {
        if (!results || results.length === 0) {
            this.showError('Geen resultaten om te exporteren');
            return;
        }
        
        try {
            const jsonString = JSON.stringify(results, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `honden-export-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.showSuccess(this.t('exportSearch'));
            
        } catch (error) {
            this.showError(`${this.t('exportFailed')}${error.message}`);
        }
    }
}