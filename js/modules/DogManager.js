/**
 * Hond Management Module
 * Beheert toevoegen, zoeken en bewerken van honden
 */

class DogManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.currentSearchResults = []; // Houdt huidige zoekresultaten bij
        this.debugMode = true; // Debug modus aan
        this.translations = {
            nl: {
                // Modal titels
                newDog: "Nieuwe Hond Toevoegen",
                editDog: "Hond Bewerken",
                searchDog: "Hond Zoeken",
                searchResults: "Zoekresultaten",
                
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
                enterCriteria: "Voer minstens een hondennaam in en klik op zoeken",
                
                // Resultaten
                found: "gevonden",
                exportResults: "Exporteer",
                actions: "Acties",
                view: "Bekijken",
                edit: "Bewerken",
                deleteResult: "Verwijderen",
                showAllResults: "Toon alle resultaten",
                closeResults: "Sluit resultaten",
                
                // Details
                details: "Details",
                dogInfo: "Hond Informatie",
                healthInfo: "Gezondheidsinformatie",
                locationInfo: "Locatie informatie",
                pedigreeInfo: "Stamboom informatie",
                createdAt: "Aangemaakt",
                updatedAt: "Laatst bijgewerkt",
                backToSearch: "Terug naar zoeken",
                noResultsFound: "Geen resultaten gevonden",
                
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
                enterCriteriaError: "Voer minstens een hondennaam in",
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
                searchResults: "Search Results",
                
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
                enterCriteria: "Enter at least a dog name and click search",
                
                // Results
                found: "found",
                exportResults: "Export",
                actions: "Actions",
                view: "View",
                edit: "Edit",
                deleteResult: "Delete",
                showAllResults: "Show all results",
                closeResults: "Close results",
                
                // Details
                details: "Details",
                dogInfo: "Dog Information",
                healthInfo: "Health Information",
                locationInfo: "Location Information",
                pedigreeInfo: "Pedigree Information",
                createdAt: "Created",
                updatedAt: "Last updated",
                backToSearch: "Back to search",
                noResultsFound: "No results found",
                
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
                enterCriteriaError: "Enter at least a dog name",
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
                searchResults: "Suchergebnisse",
                
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
                enterCriteria: "Geben Sie mindestens einen Hundenamen ein und klicken Sie auf Suchen",
                
                // Ergebnisse
                found: "gefunden",
                exportResults: "Exportieren",
                actions: "Aktionen",
                view: "Ansehen",
                edit: "Bearbeiten",
                deleteResult: "Löschen",
                showAllResults: "Alle Ergebnisse anzeigen",
                closeResults: "Ergebnisse schließen",
                
                // Details
                details: "Details",
                dogInfo: "Hund Information",
                healthInfo: "Gesundheitsinformation",
                locationInfo: "Standort Information",
                pedigreeInfo: "Stammbaum Information",
                createdAt: "Erstellt",
                updatedAt: "Zuletzt aktualisiert",
                backToSearch: "Zurück zur Suche",
                noResultsFound: "Keine Ergebnisse gefunden",
                
                // Meldungen
                adminOnly: "Nur Administratoren können Hunde hinzufügen/bearbeiten",
                fieldsRequired: "Name, Stammbaum-Nummer en Rasse sind Pflichtfelder",
                savingDog: "Hund wird gespeichert...",
                dogAdded: "Hund erfolgreich hinzugefügt!",
                dogUpdated: "Hund erfolgreich aktualisiert!",
                dogDeleted: "Hund erfolgreich gelöscht!",
                addFailed: "Fehler beim Hinzufügen des Hundes: ",
                updateFailed: "Fehler beim Aktualisieren des Hundes: ",
                deleteFailed: "Fehler beim Löschen des Hundes: ",
                enterCriteriaError: "Geben Sie mindestens einen Hundenamen ein",
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
    
    // DEBUG FUNCTIE: Toon alle honden in database
    async debugShowAllDogs() {
        try {
            const allDogs = await this.db.getHonden();
            console.log('=== DEBUG: Alle honden in database ===');
            console.log(`Aantal honden: ${allDogs.length}`);
            
            if (allDogs.length === 0) {
                console.log('Database is leeg!');
                this.showError('DEBUG: Database is leeg!');
                return;
            }
            
            allDogs.forEach((dog, index) => {
                console.log(`${index + 1}. ID: ${dog.id}, Naam: "${dog.naam}", Stamboomnr: "${dog.stamboomnr}", Ras: "${dog.ras}"`);
                console.log(`   Geslacht: "${dog.geslacht}", Land: "${dog.land}"`);
            });
            console.log('=== EINDE DEBUG ===');
            
            this.showInfo(`DEBUG: ${allDogs.length} honden gevonden in database. Check console voor details.`);
        } catch (error) {
            console.error('DEBUG Fout:', error);
            this.showError(`DEBUG Fout: ${error.message}`);
        }
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
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search"></i> ${t('searchDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            ${this.debugMode ? `
                            <div class="alert alert-warning mb-3">
                                <i class="bi bi-bug"></i> <strong>DEBUG MODE</strong>
                                <button class="btn btn-sm btn-outline-dark float-end" id="debugShowAllBtn">
                                    Toon alle honden
                                </button>
                            </div>
                            ` : ''}
                            
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h6 class="mb-3">${t('searchDog')}</h6>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label for="searchNaam" class="form-label">${t('searchName')} *</label>
                                            <input type="text" class="form-control" id="searchNaam" placeholder="${t('enterName')}" required>
                                            <div class="form-text">Voer (een deel van) de hondennaam in</div>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="searchStamboomnr" class="form-label">${t('searchPedigree')}</label>
                                            <input type="text" class="form-control" id="searchStamboomnr" placeholder="${t('enterPedigree')}">
                                            <div class="form-text">Optioneel: stamboomnummer</div>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="searchRas" class="form-label">${t('searchBreed')}</label>
                                            <input type="text" class="form-control" id="searchRas" placeholder="${t('enterBreed')}">
                                            <div class="form-text">Optioneel: ras</div>
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
                                    <div class="mt-4">
                                        <button class="btn btn-info btn-lg" id="searchBtn">
                                            <i class="bi bi-search"></i> ${t('search')}
                                        </button>
                                        <button class="btn btn-secondary" id="resetSearchBtn">
                                            <i class="bi bi-arrow-clockwise"></i> ${t('reset')}
                                        </button>
                                        ${this.debugMode ? `
                                        <button class="btn btn-warning" id="testSearchBtn">
                                            <i class="bi bi-flask"></i> Test Zoeken
                                        </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                            
                            <div id="searchResultsContainer" style="display: none;">
                                <!-- Resultaten worden hier ingevoegd -->
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
    
    getResultsPageHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="container-fluid mt-3">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        <i class="bi bi-search"></i> ${t('searchResults')}
                        <span class="badge bg-info fs-6">${this.currentSearchResults.length} ${t('found')}</span>
                    </h2>
                    <div>
                        <button class="btn btn-outline-secondary" id="backToSearchBtn">
                            <i class="bi bi-arrow-left"></i> ${t('backToSearch')}
                        </button>
                        <button class="btn btn-outline-info" id="exportResultsBtn">
                            <i class="bi bi-download"></i> ${t('exportResults')}
                        </button>
                    </div>
                </div>
                
                <div class="row" id="searchResultsGrid">
                    <!-- Resultaten worden hier ingevoegd -->
                </div>
                
                ${this.currentSearchResults.length === 0 ? `
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <h4 class="mt-3 text-muted">${t('noResultsFound')}</h4>
                </div>
                ` : ''}
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
                this.performSearchImproved(); // Gebruik de verbeterde zoekfunctie
            });
        }
        
        const resetBtn = document.getElementById('resetSearchBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSearchForm();
            });
        }
        
        // Debug knop
        const debugBtn = document.getElementById('debugShowAllBtn');
        if (debugBtn) {
            debugBtn.addEventListener('click', () => {
                this.debugShowAllDogs();
            });
        }
        
        // Test zoek knop
        const testSearchBtn = document.getElementById('testSearchBtn');
        if (testSearchBtn) {
            testSearchBtn.addEventListener('click', () => {
                this.testSearchFunction();
            });
        }
    }
    
    // Test functie voor zoeken
    async testSearchFunction() {
        try {
            console.log('=== TEST ZOEKFUNCTIE ===');
            
            // Test 1: Toon alle honden
            const allDogs = await this.db.getHonden();
            console.log('Test 1 - Totaal honden:', allDogs.length);
            
            // Test 2: Zoek op lege criteria (moet alle honden teruggeven)
            console.log('\nTest 2 - Zoek met lege criteria:');
            const emptySearch = await this.db.zoekHonden({});
            console.log('Resultaten:', emptySearch.length);
            
            // Test 3: Zoek op een bekende naam (als er honden zijn)
            if (allDogs.length > 0) {
                console.log('\nTest 3 - Zoek op eerste hond naam:');
                const firstDog = allDogs[0];
                console.log('Zoekterm:', firstDog.naam);
                const nameSearch = await this.db.zoekHonden({ naam: firstDog.naam });
                console.log('Resultaten:', nameSearch.length);
                
                // Test 4: Zoek op deel van de naam
                console.log('\nTest 4 - Zoek op deel van naam:');
                if (firstDog.naam.length > 3) {
                    const partialName = firstDog.naam.substring(0, 3);
                    console.log('Zoekterm:', partialName);
                    const partialSearch = await this.db.zoekHonden({ naam: partialName });
                    console.log('Resultaten:', partialSearch.length);
                }
            }
            
            // Test 5: Handmatig filteren
            console.log('\nTest 5 - Handmatig filteren:');
            const searchTerm = document.getElementById('searchNaam').value.trim().toLowerCase();
            console.log('Ingevoerde zoekterm:', searchTerm);
            
            const manualResults = allDogs.filter(dog => {
                const dogName = (dog.naam || '').toLowerCase();
                return dogName.includes(searchTerm);
            });
            
            console.log('Handmatige resultaten:', manualResults.length);
            manualResults.forEach(dog => {
                console.log(`- ${dog.naam} (${dog.naam.toLowerCase()}) bevat "${searchTerm}": ${dog.naam.toLowerCase().includes(searchTerm)}`);
            });
            
            this.showInfo(`Test voltooid. Check console voor details. ${manualResults.length} handmatige resultaten gevonden.`);
            
        } catch (error) {
            console.error('Test mislukt:', error);
            this.showError(`Test mislukt: ${error.message}`);
        }
    }
    
    // Verbeterde zoekfunctie die werkt
    async performSearchImproved() {
        const naam = document.getElementById('searchNaam').value.trim();
        
        if (!naam) {
            this.showError(this.t('enterCriteriaError'));
            return;
        }
        
        this.showProgress(this.t('searching'));
        
        try {
            // Haal ALLE honden op
            const allDogs = await this.db.getHonden();
            
            // Debug info
            console.log('=== VERBETERD ZOEKEN ===');
            console.log('Zoekterm:', naam);
            console.log('Totaal honden in database:', allDogs.length);
            
            // Filter lokaal voor betere debugging
            const criteria = {
                naam: naam.toLowerCase(),
                stamboomnr: document.getElementById('searchStamboomnr').value.trim().toLowerCase(),
                ras: document.getElementById('searchRas').value.trim().toLowerCase(),
                geslacht: document.getElementById('searchGeslacht').value
            };
            
            console.log('Zoekcriteria:', criteria);
            
            // HANDMATIG FILTEREN (betrouwbaarder)
            const results = allDogs.filter(dog => {
                let match = true;
                
                // Naam: gedeeltelijke match (niet hoofdlettergevoelig)
                if (criteria.naam) {
                    const dogNaam = (dog.naam || '').toLowerCase();
                    if (!dogNaam.includes(criteria.naam)) {
                        match = false;
                    }
                }
                
                // Stamboomnr: gedeeltelijke match
                if (match && criteria.stamboomnr) {
                    const dogStamboom = (dog.stamboomnr || '').toLowerCase();
                    if (!dogStamboom.includes(criteria.stamboomnr)) {
                        match = false;
                    }
                }
                
                // Ras: gedeeltelijke match
                if (match && criteria.ras) {
                    const dogRas = (dog.ras || '').toLowerCase();
                    if (!dogRas.includes(criteria.ras)) {
                        match = false;
                    }
                }
                
                // Geslacht: exacte match
                if (match && criteria.geslacht) {
                    if (dog.geslacht !== criteria.geslacht) {
                        match = false;
                    }
                }
                
                return match;
            });
            
            console.log('Gevonden resultaten:', results.length);
            results.forEach(dog => {
                console.log(`- ${dog.naam} (ID: ${dog.id})`);
            });
            
            this.currentSearchResults = results;
            this.hideProgress();
            
            if (results.length === 0) {
                // Toon suggesties als er geen exacte match is
                const suggestions = allDogs.filter(dog => {
                    const dogNaam = (dog.naam || '').toLowerCase();
                    return dogNaam.includes(criteria.naam.toLowerCase()) || 
                           criteria.naam.toLowerCase().includes(dogNaam);
                });
                
                if (suggesties.length > 0) {
                    this.showInfo(`Geen exacte match gevonden. Suggesties: ${suggestions.map(s => s.naam).join(', ')}`);
                } else {
                    this.showInfo(this.t('noDogsFound'));
                }
                return;
            }
            
            // Sluit modal en toon resultaten
            const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
            if (searchModal) searchModal.hide();
            
            this.showSearchResultsPage();
            
        } catch (error) {
            this.hideProgress();
            console.error('Zoeken mislukt:', error);
            this.showError(`${this.t('searchFailed')}${error.message}`);
        }
    }
    
    // Originele zoekfunctie (voor debugging)
    async performSearch() {
        const naam = document.getElementById('searchNaam').value.trim();
        
        if (!naam) {
            this.showError(this.t('enterCriteriaError'));
            return;
        }
        
        // DEBUG: Toon zoekcriteria
        if (this.debugMode) {
            console.log('=== ZOEK CRITERIA ===');
            console.log('Naam:', naam);
            console.log('Stamboomnr:', document.getElementById('searchStamboomnr').value.trim());
            console.log('Ras:', document.getElementById('searchRas').value.trim());
            console.log('Geslacht:', document.getElementById('searchGeslacht').value);
        }
        
        this.showProgress(this.t('searching'));
        
        try {
            // Verzamel alle zoekcriteria
            const criteria = {
                naam: naam,
                stamboomnr: document.getElementById('searchStamboomnr').value.trim(),
                ras: document.getElementById('searchRas').value.trim(),
                geslacht: document.getElementById('searchGeslacht').value
            };
            
            // DEBUG: Toon criteria object
            if (this.debugMode) {
                console.log('Criteria object:', criteria);
            }
            
            // Verwijder lege velden
            Object.keys(criteria).forEach(key => {
                if (!criteria[key]) delete criteria[key];
            });
            
            // DEBUG: Toon gefilterd criteria object
            if (this.debugMode) {
                console.log('Gefilterd criteria object:', criteria);
            }
            
            // DEBUG: Toon alle honden voor vergelijking
            if (this.debugMode) {
                const allDogs = await this.db.getHonden();
                console.log('=== Voor zoeken: Alle honden ===');
                allDogs.forEach(dog => {
                    console.log(`- "${dog.naam}" (ID: ${dog.id})`);
                });
            }
            
            // Voer zoekopdracht uit via database
            const results = await this.db.zoekHonden(criteria);
            this.currentSearchResults = results;
            
            // DEBUG: Toon zoekresultaten
            if (this.debugMode) {
                console.log('=== ZOEKRESULTATEN ===');
                console.log(`Aantal gevonden: ${results.length}`);
                results.forEach((dog, index) => {
                    console.log(`${index + 1}. "${dog.naam}" (ID: ${dog.id})`);
                });
            }
            
            this.hideProgress();
            
            if (results.length === 0) {
                this.showInfo(this.t('noDogsFound'));
                return;
            }
            
            // Sluit de zoekmodal
            const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
            if (searchModal) {
                searchModal.hide();
            }
            
            // Toon de resultaten
            this.showSearchResultsPage();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('searchFailed')}${error.message}`);
        }
    }
    
    showSearchResultsPage() {
        const t = this.t.bind(this);
        
        // Haal de hoofdcontent container op
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;
        
        // Genereer de resultaten pagina HTML
        const html = this.getResultsPageHTML();
        mainContent.innerHTML = html;
        
        // Toon de resultaten
        this.displaySearchResultsGrid();
        
        // Event listeners voor resultaten pagina
        const backBtn = document.getElementById('backToSearchBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showMainContent();
            });
        }
        
        const exportBtn = document.getElementById('exportResultsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportSearchResults(this.currentSearchResults);
            });
        }
    }
    
    displaySearchResultsGrid() {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsGrid');
        if (!container) return;
        
        if (this.currentSearchResults.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <h4 class="mt-3 text-muted">${t('noResultsFound')}</h4>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        this.currentSearchResults.forEach(hond => {
            const genderText = hond.geslacht === 'reuen' ? t('male') : 
                             hond.geslacht === 'teven' ? t('female') : 'Onbekend';
            
            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-header bg-light">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">
                                    <i class="bi bi-dog"></i> ${hond.naam}
                                </h5>
                                <span class="badge bg-${hond.geslacht === 'reuen' ? 'primary' : 'danger'}">
                                    ${genderText}
                                </span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="mb-2">
                                <strong><i class="bi bi-tag"></i> ${t('breed')}:</strong>
                                ${hond.ras || 'Onbekend'}
                            </div>
                            <div class="mb-2">
                                <strong><i class="bi bi-hash"></i> ${t('pedigreeNumber')}:</strong>
                                ${hond.stamboomnr ? `<code>${hond.stamboomnr}</code>` : 'Niet bekend'}
                            </div>
                            ${hond.geboortedatum ? `
                            <div class="mb-2">
                                <strong><i class="bi bi-calendar"></i> ${t('birthDate')}:</strong>
                                ${new Date(hond.geboortedatum).toLocaleDateString(this.currentLang)}
                            </div>
                            ` : ''}
                            ${hond.land ? `
                            <div class="mb-2">
                                <strong><i class="bi bi-globe"></i> ${t('country')}:</strong>
                                ${hond.land}
                            </div>
                            ` : ''}
                            ${hond.vader || hond.moeder ? `
                            <div class="mt-3">
                                <strong><i class="bi bi-diagram-3"></i> ${t('pedigreeInfo')}:</strong>
                                <div class="small">
                                    ${hond.vader ? `${t('father')}: ${hond.vader}<br>` : ''}
                                    ${hond.moeder ? `${t('mother')}: ${hond.moeder}` : ''}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        <div class="card-footer bg-white">
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-sm btn-outline-primary view-dog-btn" data-id="${hond.id}">
                                    <i class="bi bi-eye"></i> ${t('view')}
                                </button>
                                ${this.auth.isAdmin() ? `
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-warning edit-dog-btn" data-id="${hond.id}">
                                        <i class="bi bi-pencil"></i> ${t('edit')}
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger delete-dog-btn" data-id="${hond.id}" data-name="${hond.naam}">
                                        <i class="bi bi-trash"></i> ${t('deleteResult')}
                                    </button>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Event listeners voor knoppen
        this.setupResultsPageEvents();
    }
    
    setupResultsPageEvents() {
        // View knoppen
        document.querySelectorAll('.view-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.view-dog-btn').dataset.id;
                this.viewDogDetails(hondId);
            });
        });
        
        // Edit knoppen
        document.querySelectorAll('.edit-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.edit-dog-btn').dataset.id;
                this.editDog(hondId);
            });
        });
        
        // Delete knoppen
        document.querySelectorAll('.delete-dog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hondId = e.target.closest('.delete-dog-btn').dataset.id;
                const hondNaam = e.target.closest('.delete-dog-btn').dataset.name;
                this.deleteDogDirect(hondId, hondNaam);
            });
        });
    }
    
    async deleteDogDirect(hondId, hondNaam) {
        if (!this.auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        if (!confirm(`${this.t('confirmDelete')}\n\n"${hondNaam}"`)) {
            return;
        }
        
        this.showProgress("Hond verwijderen...");
        
        try {
            // Verwijder ook gerelateerde foto's
            const hond = await this.getHondById(parseInt(hondId));
            if (hond && hond.stamboomnr) {
                const fotos = await this.db.getFotosVoorStamboomnr(hond.stamboomnr);
                for (const foto of fotos) {
                    try {
                        await this.db.verwijderFoto(foto.id);
                    } catch (fotoError) {
                        console.log(`Foto ${foto.id} kon niet verwijderd worden:`, fotoError);
                    }
                }
            }
            
            // Verwijder de hond
            await this.db.verwijderHond(parseInt(hondId));
            this.hideProgress();
            this.showSuccess(`${hondNaam} ${this.t('dogDeleted').toLowerCase()}`);
            
            // Vernieuw de resultaten
            setTimeout(() => {
                // Verwijder de hond uit huidige resultaten
                this.currentSearchResults = this.currentSearchResults.filter(h => h.id !== parseInt(hondId));
                this.displaySearchResultsGrid();
            }, 500);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${this.t('deleteFailed')}${error.message}`);
        }
    }
    
    resetSearchForm() {
        document.getElementById('searchNaam').value = '';
        document.getElementById('searchStamboomnr').value = '';
        document.getElementById('searchRas').value = '';
        document.getElementById('searchGeslacht').value = '';
        
        const resultsContainer = document.getElementById('searchResultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
        }
        
        this.showSuccess(this.t('resetForm'));
    }
    
    showMainContent() {
        // Laad de hoofdcontent opnieuw
        if (typeof loadMainContent === 'function') {
            loadMainContent();
        } else {
            // Fallback: ga terug naar dashboard
            window.location.hash = '#dashboard';
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
        const dogName = document.getElementById('dogName').value;
        
        if (!dogId) return;
        
        if (!confirm(`${this.t('confirmDelete')}\n\n"${dogName}"`)) {
            return;
        }
        
        this.showProgress("Hond verwijderen...");
        
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
    
    async getHondById(hondId) {
        try {
            const honden = await this.db.getHonden();
            return honden.find(h => h.id === hondId);
        } catch (error) {
            console.error('Fout bij ophalen hond:', error);
            return null;
        }
    }
    
    // Helper method voor bestandsdownload
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
