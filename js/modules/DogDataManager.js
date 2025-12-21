// js/modules/DogDataManager.js

/**
 * DogDataManager - Module voor het bewerken en verwijderen van honden
 */
class DogDataManager extends BaseModule {
    constructor() {
        super('dogdata', 'Data Hond Bewerken');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = []; // Voor autocomplete
        this.selectedDog = null; // Geselecteerde hond voor bewerking
        this.currentDogId = null; // ID van de huidige hond die wordt bewerkt
        
        console.log('DogDataManager geïnitialiseerd');
        
        this.translations = {
            nl: {
                // Modal titels
                editDogData: "Data Hond Bewerken",
                searchDog: "Zoek Hond",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd",
                
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
                saveChanges: "Wijzigingen Opslaan",
                cancel: "Annuleren",
                deleteDog: "Hond Verwijderen",
                choose: "Kies...",
                searchPlaceholder: "Typ naam of stamboomnummer...",
                
                // Toegangscontrole popup teksten
                insufficientPermissions: "Onvoldoende rechten",
                insufficientPermissionsText: "U heeft geen toestemming om honden te bewerken. Alleen administrators kunnen deze functie gebruiken.",
                loggedInAs: "U bent ingelogd als:",
                user: "Gebruiker",
                availableFeatures: "Beschikbare functies voor gebruikers",
                searchDogs: "Honden zoeken en bekijken",
                viewGallery: "Foto galerij bekijken",
                managePrivateInfo: "Privé informatie beheren",
                importExport: "Data importeren/exporteren",
                
                // Zoekveld
                loadingDogs: "Honden laden...",
                noResults: "Geen honden gevonden",
                selectDogToEdit: "Selecteer een hond om te bewerken",
                
                // Status berichten
                searchResults: "Zoekresultaten",
                dogSelected: "Hond geselecteerd",
                editingDog: "Bewerken hond",
                savingChanges: "Wijzigingen opslaan...",
                changesSaved: "Wijzigingen opgeslagen!",
                dogDeleted: "Hond succesvol verwijderd!",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                updatingDog: "Hond bijwerken...",
                dogUpdated: "Hond bijgewerkt!",
                deleting: "Verwijderen...",
                
                // Foutmeldingen
                searchFailed: "Fout bij zoeken: ",
                loadFailed: "Fout bij laden honden: ",
                updateFailed: "Fout bij bijwerken hond: ",
                deleteFailed: "Fout bij verwijderen hond: ",
                photoError: "Fout bij uploaden foto: ",
                fieldsRequired: "Naam, stamboomnummer en ras zijn verplichte velden",
                dogNotFound: "Hond niet gevonden",
                adminOnly: "Alleen administrators mogen honden bewerken",
                invalidId: "Ongeldig hond ID"
            },
            en: {
                // Modal titles
                editDogData: "Edit Dog Data",
                searchDog: "Search Dog",
                close: "Close",
                refresh: "Refresh Page",
                accessDenied: "Access Denied",
                
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
                saveChanges: "Save Changes",
                cancel: "Cancel",
                deleteDog: "Delete Dog",
                choose: "Choose...",
                searchPlaceholder: "Type name or pedigree number...",
                
                // Access control popup texts
                insufficientPermissions: "Insufficient permissions",
                insufficientPermissionsText: "You do not have permission to edit dogs. Only administrators can use this function.",
                loggedInAs: "You are logged in as:",
                user: "User",
                availableFeatures: "Available features for users",
                searchDogs: "Search and view dogs",
                viewGallery: "View photo gallery",
                managePrivateInfo: "Manage private information",
                importExport: "Import/export data",
                
                // Search field
                loadingDogs: "Loading dogs...",
                noResults: "No dogs found",
                selectDogToEdit: "Select a dog to edit",
                
                // Status messages
                searchResults: "Search results",
                dogSelected: "Dog selected",
                editingDog: "Editing dog",
                savingChanges: "Saving changes...",
                changesSaved: "Changes saved!",
                dogDeleted: "Dog successfully deleted!",
                confirmDelete: "Are you sure you want to delete this dog?",
                photoAdded: "Photo added",
                updatingDog: "Updating dog...",
                dogUpdated: "Dog updated!",
                deleting: "Deleting...",
                
                // Error messages
                searchFailed: "Error searching: ",
                loadFailed: "Error loading dogs: ",
                updateFailed: "Error updating dog: ",
                deleteFailed: "Error deleting dog: ",
                photoError: "Error uploading photo: ",
                fieldsRequired: "Name, pedigree number and breed are required fields",
                dogNotFound: "Dog not found",
                adminOnly: "Only administrators can edit dogs",
                invalidId: "Invalid dog ID"
            },
            de: {
                // Modal Titel
                editDogData: "Hundedaten bearbeiten",
                searchDog: "Hund suchen",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert",
                
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
                saveChanges: "Änderungen speichern",
                cancel: "Abbrechen",
                deleteDog: "Hund löschen",
                choose: "Wählen...",
                searchPlaceholder: "Name oder Stammbaum-Nummer eingeben...",
                
                // Zugangskontrolle Popup Texte
                insufficientPermissions: "Unzureichende Berechtigungen",
                insufficientPermissionsText: "Sie haben keine Berechtigung, Hunde zu bearbeiten. Nur Administratoren können diese Funktion nutzen.",
                loggedInAs: "Sie sind eingeloggt als:",
                user: "Benutzer",
                availableFeatures: "Verfügbare Funktionen für Benutzer",
                searchDogs: "Hunde suchen und anzeigen",
                viewGallery: "Fotogalerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Daten importieren/exportieren",
                
                // Suchfeld
                loadingDogs: "Hunde laden...",
                noResults: "Keine Hunde gefunden",
                selectDogToEdit: "Wählen Sie einen Hund zum Bearbeiten",
                
                // Status Meldungen
                searchResults: "Suchergebnisse",
                dogSelected: "Hund ausgewählt",
                editingDog: "Hund bearbeiten",
                savingChanges: "Änderungen speichern...",
                changesSaved: "Änderungen gespeichert!",
                dogDeleted: "Hund erfolgreich gelöscht!",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Hund löschen möchten?",
                photoAdded: "Foto hinzugefügt",
                updatingDog: "Hund aktualisieren...",
                dogUpdated: "Hund aktualisiert!",
                deleting: "Löschen...",
                
                // Fehlermeldungen
                searchFailed: "Fehler bei der Suche: ",
                loadFailed: "Fehler beim Laden der Hunde: ",
                updateFailed: "Fehler beim Aktualisieren des Hundes: ",
                deleteFailed: "Fehler beim Löschen des Hundes: ",
                photoError: "Fehler beim Hochladen des Fotos: ",
                fieldsRequired: "Name, Stammbaum-Nummer en Rasse sind Pflichtfelder",
                dogNotFound: "Hund nicht gefunden",
                adminOnly: "Nur Administratoren können Hunde bearbeiten",
                invalidId: "Ungültige Hunde-ID"
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
     * Render de module interface
     */
    getModalHTML() {
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        const currentUser = auth.getCurrentUser();
        const userRole = currentUser.role === 'admin' ? 'Admin' : this.t('user');
        
        if (!isAdmin) {
            return `
                <div class="modal fade" id="dogDataModal" tabindex="-1" aria-labelledby="dogDataModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="dogDataModalLabel">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <span class="module-title" data-key="accessDenied">${this.t('accessDenied')}</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-danger">
                                    <h5><i class="bi bi-shield-lock"></i> ${this.t('insufficientPermissions')}</h5>
                                    <p>${this.t('insufficientPermissionsText')}</p>
                                    <p class="mb-0">${this.t('loggedInAs')}: <strong>${currentUser.username}</strong> (${userRole})</p>
                                </div>
                                
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h6><i class="bi bi-info-circle text-primary"></i> ${this.t('availableFeatures')}</h6>
                                        <ul>
                                            <li>${this.t('searchDogs')}</li>
                                            <li>${this.t('viewGallery')}</li>
                                            <li>${this.t('managePrivateInfo')}</li>
                                            <li>${this.t('importExport')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-1"></i>
                                    <span class="module-text" data-key="close">${this.t('close')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const t = this.t.bind(this);
        
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
            <div class="modal fade" id="dogDataModal" tabindex="-1" aria-labelledby="dogDataModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="dogDataModalLabel">
                                <i class="bi bi-pencil-square me-2"></i>
                                <span class="module-title" data-key="editDogData">${t('editDogData')}</span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Zoek gedeelte -->
                            <div id="searchSection" class="mb-4">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <i class="bi bi-search me-2"></i>${t('searchDog')}
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label for="dogSearch" class="form-label fw-semibold">${t('searchPlaceholder')}</label>
                                            <input type="text" class="form-control form-control-lg" id="dogSearch" 
                                                   placeholder="${t('searchPlaceholder')}"
                                                   autocomplete="off">
                                            <div class="form-text mt-1">${t('selectDogToEdit')}</div>
                                        </div>
                                        <div id="searchResults" style="max-height: 400px; overflow-y: auto;"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Bewerk gedeelte (verborgen initieel) -->
                            <div id="editSection" style="display: none;">
                                <form id="editDogForm">
                                    <input type="hidden" id="dogId">
                                    <input type="hidden" id="fatherId" value="">
                                    <input type="hidden" id="motherId" value="">
                                    
                                    <div class="alert alert-info mb-3">
                                        <i class="bi bi-pencil"></i> 
                                        <span class="fw-semibold">${t('editingDog')}:</span> 
                                        <span id="editingDogName" class="fw-bold text-primary"></span>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="dogName" class="form-label fw-semibold">${t('nameRequired')}</label>
                                                <input type="text" class="form-control" id="dogName" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="pedigreeNumber" class="form-label fw-semibold">${t('pedigreeNumber')}</label>
                                                <input type="text" class="form-control" id="pedigreeNumber" required>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="breed" class="form-label fw-semibold">${t('breedRequired')}</label>
                                                <input type="text" class="form-control" id="breed" required>
                                                ${recentBreedsHTML}
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="gender" class="form-label fw-semibold">${t('gender')}</label>
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
                                            <div class="mb-3">
                                                <label for="father" class="form-label fw-semibold">${t('father')}</label>
                                                <input type="text" class="form-control parent-input" id="father" 
                                                       placeholder="${t('searchPlaceholder')}"
                                                       data-parent-type="father"
                                                       autocomplete="off">
                                                <div class="autocomplete-dropdown" id="fatherDropdown" style="display: none;"></div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="mother" class="form-label fw-semibold">${t('mother')}</label>
                                                <input type="text" class="form-control parent-input" id="mother" 
                                                       placeholder="${t('searchPlaceholder')}"
                                                       data-parent-type="mother"
                                                       autocomplete="off">
                                                <div class="autocomplete-dropdown" id="motherDropdown" style="display: none;"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="birthDate" class="form-label fw-semibold">${t('birthDate')}</label>
                                                <input type="date" class="form-control" id="birthDate">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="deathDate" class="form-label fw-semibold">${t('deathDate')}</label>
                                                <input type="date" class="form-control" id="deathDate">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="hipDysplasia" class="form-label fw-semibold">${t('hipDysplasia')}</label>
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
                                                <label for="elbowDysplasia" class="form-label fw-semibold">${t('elbowDysplasia')}</label>
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
                                                <label for="patellaLuxation" class="form-label fw-semibold">${t('patellaLuxation')}</label>
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
                                                <label for="eyes" class="form-label fw-semibold">${t('eyes')}</label>
                                                <select class="form-select" id="eyes">
                                                    <option value="">${t('choose')}</option>
                                                    <option value="Vrij">${t('eyesFree')}</option>
                                                    <option value="Distichiasis">${t('eyesDistichiasis')}</option>
                                                    <option value="Overig">${t('eyesOther')}</option>
                                                </select>
                                            </div>
                                            <div class="mb-3" id="eyesExplanationContainer" style="display: none;">
                                                <label for="eyesExplanation" class="form-label fw-semibold">${t('eyesExplanation')}</label>
                                                <input type="text" class="form-control" id="eyesExplanation">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="dandyWalker" class="form-label fw-semibold">${t('dandyWalker')}</label>
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
                                                <label for="thyroid" class="form-label fw-semibold">${t('thyroid')}</label>
                                                <select class="form-select" id="thyroid">
                                                    <option value="">${t('choose')}</option>
                                                    <option value="Negatief">${t('thyroidNegative')}</option>
                                                    <option value="Positief">${t('thyroidPositive')}</option>
                                                </select>
                                            </div>
                                            <div class="mb-3" id="thyroidExplanationContainer" style="display: none;">
                                                <label for="thyroidExplanation" class="form-label fw-semibold">${t('thyroidExplanation')}</label>
                                                <input type="text" class="form-control" id="thyroidExplanation">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="country" class="form-label fw-semibold">${t('country')}</label>
                                                <input type="text" class="form-control" id="country">
                                            </div>
                                            <div class="mb-3">
                                                <label for="zipCode" class="form-label fw-semibold">${t('zipCode')}</label>
                                                <input type="text" class="form-control" id="zipCode">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="dogPhoto" class="form-label fw-semibold">${t('addPhoto')}</label>
                                        <div class="input-group">
                                            <input type="file" class="form-control" id="dogPhoto" accept="image/*">
                                            <label class="input-group-text" for="dogPhoto">${t('chooseFile')}</label>
                                        </div>
                                        <div class="form-text">${t('noFileChosen')}</div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="remarks" class="form-label fw-semibold">${t('remarks')}</label>
                                        <textarea class="form-control" id="remarks" rows="3"></textarea>
                                    </div>
                                    
                                    <div class="alert alert-warning">
                                        <i class="bi bi-exclamation-triangle me-2"></i>
                                        ${t('requiredFields')}
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" id="cancelEditBtn" style="display: none;">
                                <i class="bi bi-arrow-left me-1"></i>${t('cancel')}
                            </button>
                            <button type="button" class="btn btn-danger" id="deleteDogBtn" style="display: none;">
                                <i class="bi bi-trash me-1"></i>${t('deleteDog')}
                            </button>
                            <button type="button" class="btn btn-success" id="saveChangesBtn" style="display: none;">
                                <i class="bi bi-check-circle me-1"></i>${t('saveChanges')}
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i>
                                <span class="module-text" data-key="close">${t('close')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .search-result-item {
                    padding: 12px;
                    border-bottom: 1px solid #dee2e6;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    border-radius: 6px;
                    margin-bottom: 6px;
                    border: 1px solid transparent;
                }
                
                .search-result-item:hover {
                    background-color: #f8f9fa;
                    border-color: #dee2e6;
                }
                
                .search-result-item.selected {
                    background-color: #e3f2fd;
                    border-color: #0d6efd;
                    border-left: 4px solid #0d6efd;
                }
                
                .search-result-item .dog-name {
                    font-weight: 600;
                    font-size: 1rem;
                    color: #212529;
                }
                
                .search-result-item .dog-info {
                    font-size: 0.85rem;
                    color: #6c757d;
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    margin-top: 4px;
                }
                
                .search-stats {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #dee2e6;
                    font-weight: 500;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    width: calc(100% - 30px);
                    z-index: 1050;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                
                .autocomplete-item {
                    padding: 10px 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background-color 0.2s;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.8rem;
                    color: #666;
                }
                
                .parent-input {
                    position: relative;
                }
                
                #dogSearch {
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: border-color 0.3s;
                }
                
                #dogSearch:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }
                
                #editDogForm .form-control:focus,
                #editDogForm .form-select:focus {
                    border-color: #198754;
                    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
                }
            </style>
        `;
    }
    
    /**
     * Setup event listeners voor deze module
     */
    setupEvents() {
        console.log('DogDataManager setupEvents called');
        
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        
        if (!isAdmin) {
            // Voeg event listeners toe voor de knoppen in de modal
            const modal = document.getElementById('dogDataModal');
            if (modal) {
                modal.addEventListener('shown.bs.modal', () => {
                    console.log('DogDataModal is nu zichtbaar (toegang geweigerd)');
                });
            }
            return;
        }
        
        // Alleen verder gaan als gebruiker admin is
        
        // Laad alle honden voor autocomplete
        this.loadAllDogs();
        
        // Zoekveld event listener
        const searchInput = document.getElementById('dogSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
            
            searchInput.addEventListener('focus', () => {
                this.loadAllDogs();
                if (searchInput.value.length > 0) {
                    this.performSearch(searchInput.value);
                }
            });
        }
        
        // Cancel knop
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.showSearchSection();
            });
        }
        
        // Save knop
        const saveBtn = document.getElementById('saveChangesBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveDogChanges();
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
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
        
        // Vertaal de modal tekst
        setTimeout(() => {
            this.translateModal();
        }, 100);
    }
    
    /**
     * Laad alle honden voor autocomplete
     */
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                this.allDogs = await this.db.getHonden();
                this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
                console.log(`DogDataManager: ${this.allDogs.length} honden geladen voor zoeken`);
            } catch (error) {
                console.error('Fout bij laden honden voor zoeken:', error);
                this.showError(this.t('loadFailed') + error.message);
            }
        }
    }
    
    /**
     * Voer zoekactie uit
     */
    performSearch(searchTerm) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;
        
        const term = searchTerm.toLowerCase().trim();
        
        if (!term || term.length < 1) {
            searchResults.innerHTML = '';
            return;
        }
        
        // Filter honden op naam, stamboomnummer en ras
        const filteredDogs = this.allDogs.filter(dog => {
            const naam = dog.naam ? dog.naam.toLowerCase() : '';
            const stamboomnr = dog.stamboomnr ? dog.stamboomnr.toLowerCase() : '';
            const ras = dog.ras ? dog.ras.toLowerCase() : '';
            
            return naam.includes(term) || 
                   stamboomnr.includes(term) || 
                   ras.includes(term);
        }).slice(0, 20); // Max 20 resultaten
        
        if (filteredDogs.length === 0) {
            searchResults.innerHTML = `
                <div class="alert alert-light text-center py-4">
                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${this.t('noResults')}</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-stats">
                <i class="bi bi-info-circle me-1"></i>
                ${this.t('searchResults')}: <strong>${filteredDogs.length}</strong> ${this.t('found')}
            </div>
        `;
        
        filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                             dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
            
            html += `
                <div class="search-result-item" data-id="${dog.id}">
                    <div class="dog-name">${dog.naam || 'Onbekend'}</div>
                    <div class="dog-info">
                        ${dog.ras ? `
                        <span><i class="bi bi-tag me-1"></i>${dog.ras}</span>
                        ` : ''}
                        
                        ${dog.stamboomnr ? `
                        <span><i class="bi bi-hash me-1"></i>${dog.stamboomnr}</span>
                        ` : ''}
                        
                        <span><i class="bi bi-gender-ambiguous me-1"></i>${genderText}</span>
                    </div>
                </div>
            `;
        });
        
        searchResults.innerHTML = html;
        
        // Voeg click event listeners toe aan zoekresultaten
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = parseInt(item.getAttribute('data-id'));
                this.selectDogForEditing(dogId);
            });
        });
    }
    
    /**
     * Selecteer hond voor bewerking
     */
    async selectDogForEditing(dogId) {
        try {
            console.log(`Selecting dog with ID: ${dogId}`);
            
            // Controleer of ID geldig is
            if (!dogId || isNaN(dogId)) {
                this.showError(this.t('invalidId'));
                return;
            }
            
            // Markeer geselecteerd item in zoekresultaten
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.classList.remove('selected');
                if (parseInt(item.getAttribute('data-id')) === dogId) {
                    item.classList.add('selected');
                }
            });
            
            // Zoek in lokale cache eerst
            let dog = this.allDogs.find(d => d.id === dogId);
            
            if (!dog) {
                // Probeer opnieuw te laden uit database
                this.showProgress(this.t('loading') + '...');
                await this.loadAllDogs();
                dog = this.allDogs.find(d => d.id === dogId);
                this.hideProgress();
            }
            
            if (!dog) {
                this.showError(this.t('dogNotFound'));
                return;
            }
            
            this.selectedDog = dog;
            this.currentDogId = dogId;
            
            // Vul formulier met hond data
            this.fillFormWithDogData(dog);
            
            // Toon bewerk sectie en knoppen
            this.showEditSection();
            
            this.showSuccess(`${this.t('dogSelected')}: ${dog.naam}`);
            
        } catch (error) {
            this.hideProgress();
            console.error('Fout bij selecteren hond:', error);
            this.showError(`${this.t('searchFailed')}${error.message}`);
        }
    }
    
    /**
     * Vul formulier met hond data
     */
    fillFormWithDogData(dog) {
        console.log('Filling form with dog data:', dog);
        
        // Basis velden
        document.getElementById('dogId').value = dog.id || '';
        document.getElementById('dogName').value = dog.naam || '';
        document.getElementById('pedigreeNumber').value = dog.stamboomnr || '';
        document.getElementById('breed').value = dog.ras || '';
        document.getElementById('gender').value = dog.geslacht || '';
        
        // Ouders
        document.getElementById('father').value = dog.vader || '';
        document.getElementById('fatherId').value = dog.vaderId || '';
        document.getElementById('mother').value = dog.moeder || '';
        document.getElementById('motherId').value = dog.moederId || '';
        
        // Datums
        document.getElementById('birthDate').value = dog.geboortedatum || '';
        document.getElementById('deathDate').value = dog.overlijdensdatum || '';
        
        // Gezondheidsinformatie
        document.getElementById('hipDysplasia').value = dog.heupdysplasie || '';
        document.getElementById('elbowDysplasia').value = dog.elleboogdysplasie || '';
        document.getElementById('patellaLuxation').value = dog.patella || '';
        document.getElementById('eyes').value = dog.ogen || '';
        document.getElementById('eyesExplanation').value = dog.ogenVerklaring || '';
        document.getElementById('dandyWalker').value = dog.dandyWalker || '';
        document.getElementById('thyroid').value = dog.schildklier || '';
        document.getElementById('thyroidExplanation').value = dog.schildklierVerklaring || '';
        
        // Locatie
        document.getElementById('country').value = dog.land || '';
        document.getElementById('zipCode').value = dog.postcode || '';
        
        // Opmerkingen
        document.getElementById('remarks').value = dog.opmerkingen || '';
        
        // Toon titel
        const dogNameElement = document.getElementById('editingDogName');
        if (dogNameElement) {
            dogNameElement.textContent = dog.naam || this.t('unknown');
        }
        
        // Toon/verberg uitleg velden
        const eyesExplanationContainer = document.getElementById('eyesExplanationContainer');
        const thyroidExplanationContainer = document.getElementById('thyroidExplanationContainer');
        
        if (eyesExplanationContainer) {
            eyesExplanationContainer.style.display = (dog.ogen === 'Overig') ? 'block' : 'none';
        }
        if (thyroidExplanationContainer) {
            thyroidExplanationContainer.style.display = (dog.schildklier === 'Positief') ? 'block' : 'none';
        }
    }
    
    /**
     * Toon bewerk sectie
     */
    showEditSection() {
        document.getElementById('searchSection').style.display = 'none';
        document.getElementById('editSection').style.display = 'block';
        
        document.getElementById('cancelEditBtn').style.display = 'inline-block';
        document.getElementById('saveChangesBtn').style.display = 'inline-block';
        document.getElementById('deleteDogBtn').style.display = 'inline-block';
    }
    
    /**
     * Toon zoek sectie
     */
    showSearchSection() {
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('editSection').style.display = 'none';
        
        document.getElementById('cancelEditBtn').style.display = 'none';
        document.getElementById('saveChangesBtn').style.display = 'none';
        document.getElementById('deleteDogBtn').style.display = 'none';
        
        // Wis formulier
        const form = document.getElementById('editDogForm');
        if (form) {
            form.reset();
        }
        
        // Wis hidden inputs
        document.getElementById('dogId').value = '';
        document.getElementById('fatherId').value = '';
        document.getElementById('motherId').value = '';
        
        this.selectedDog = null;
        this.currentDogId = null;
        
        // Herlaad zoekresultaten
        const searchInput = document.getElementById('dogSearch');
        if (searchInput && searchInput.value) {
            this.performSearch(searchInput.value);
        }
    }
    
    /**
     * Opslaan wijzigingen - FIXED VERSION
     */
    async saveDogChanges() {
        if (!auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        const dogId = document.getElementById('dogId').value;
        if (!dogId) {
            this.showError(this.t('dogNotFound'));
            return;
        }
        
        // Parse ID als getal
        const parsedId = parseInt(dogId);
        if (isNaN(parsedId)) {
            this.showError(this.t('invalidId'));
            return;
        }
        
        const dogData = {
            id: parsedId, // Zorg dat dit een getal is
            naam: document.getElementById('dogName').value.trim(),
            stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
            ras: document.getElementById('breed').value.trim(),
            geslacht: document.getElementById('gender').value,
            vader: document.getElementById('father').value.trim(),
            vaderId: document.getElementById('fatherId').value ? parseInt(document.getElementById('fatherId').value) : null,
            moeder: document.getElementById('mother').value.trim(),
            moederId: document.getElementById('motherId').value ? parseInt(document.getElementById('motherId').value) : null,
            geboortedatum: document.getElementById('birthDate').value || null,
            overlijdensdatum: document.getElementById('deathDate').value || null,
            heupdysplasie: document.getElementById('hipDysplasia').value || '',
            elleboogdysplasie: document.getElementById('elbowDysplasia').value || '',
            patella: document.getElementById('patellaLuxation').value || '',
            ogen: document.getElementById('eyes').value || '',
            ogenVerklaring: document.getElementById('eyesExplanation')?.value.trim() || '',
            dandyWalker: document.getElementById('dandyWalker').value || '',
            schildklier: document.getElementById('thyroid').value || '',
            schildklierVerklaring: document.getElementById('thyroidExplanation')?.value.trim() || '',
            land: document.getElementById('country').value.trim() || '',
            postcode: document.getElementById('zipCode').value.trim() || '',
            opmerkingen: document.getElementById('remarks').value.trim() || '',
            updatedAt: new Date().toISOString()
        };
        
        // Valideer verplichte velden
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        console.log('Saving dog data:', dogData);
        this.showProgress(this.t('savingChanges'));
        
        try {
            // Controleer of updateHond methode bestaat - gebruik de methode van je DogManager
            if (this.db && typeof this.db.updateHond === 'function') {
                console.log('Calling updateHond with ID:', dogData.id);
                await this.db.updateHond(dogData);
            } 
            // Als updateHond niet bestaat, probeer updateDog of pasPut
            else if (this.db && typeof this.db.updateDog === 'function') {
                console.log('Calling updateDog with ID:', dogData.id);
                await this.db.updateDog(dogData);
            }
            // Fallback: gebruik put method
            else if (this.db && typeof this.db.put === 'function') {
                console.log('Calling put with ID:', dogData.id);
                await this.db.put('honden', dogData);
            }
            else {
                throw new Error('Geen geschikte update methode gevonden in database');
            }
            
            this.hideProgress();
            this.showSuccess(this.t('dogUpdated'));
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput && photoInput.files.length > 0) {
                await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
            }
            
            // Update lokale cache
            const index = this.allDogs.findIndex(d => d.id === dogData.id);
            if (index !== -1) {
                this.allDogs[index] = { ...this.allDogs[index], ...dogData };
            } else {
                // Voeg toe als niet gevonden
                this.allDogs.push(dogData);
            }
            
            // Refresh zoekresultaten als nodig
            const searchInput = document.getElementById('dogSearch');
            if (searchInput && searchInput.value) {
                this.performSearch(searchInput.value);
            }
            
            // Terug naar zoeken na succes
            setTimeout(() => {
                this.showSearchSection();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('Error updating dog:', error);
            console.error('Error details:', {
                id: dogData.id,
                type: typeof dogData.id,
                errorName: error.name,
                errorMessage: error.message
            });
            this.showError(`${this.t('updateFailed')}${error.message}`);
        }
    }
    
    /**
     * Verwijder hond - FIXED VERSION
     */
    async deleteDog() {
        if (!auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        const dogId = document.getElementById('dogId').value;
        if (!dogId) {
            this.showError(this.t('dogNotFound'));
            return;
        }
        
        const parsedId = parseInt(dogId);
        if (isNaN(parsedId)) {
            this.showError(this.t('invalidId'));
            return;
        }
        
        const dogName = document.getElementById('dogName').value;
        
        if (!confirm(`${this.t('confirmDelete')}\n\n${dogName} (ID: ${parsedId})`)) {
            return;
        }
        
        this.showProgress(this.t('deleting'));
        
        try {
            // Probeer verschillende delete methodes
            let deleted = false;
            
            if (this.db && typeof this.db.verwijderHond === 'function') {
                console.log('Calling verwijderHond with ID:', parsedId);
                await this.db.verwijderHond(parsedId);
                deleted = true;
            }
            else if (this.db && typeof this.db.deleteDog === 'function') {
                console.log('Calling deleteDog with ID:', parsedId);
                await this.db.deleteDog(parsedId);
                deleted = true;
            }
            else if (this.db && typeof this.db.delete === 'function') {
                console.log('Calling delete with ID:', parsedId);
                await this.db.delete('honden', parsedId);
                deleted = true;
            }
            
            if (!deleted) {
                throw new Error('Geen geschikte delete methode gevonden in database');
            }
            
            this.hideProgress();
            this.showSuccess(`${this.t('dogDeleted')}: ${dogName}`);
            
            // Update lokale cache
            this.allDogs = this.allDogs.filter(d => d.id !== parsedId);
            
            // Terug naar zoeken
            setTimeout(() => {
                this.showSearchSection();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('Error deleting dog:', error);
            this.showError(`${this.t('deleteFailed')}${error.message}`);
        }
    }
    
    /**
     * Upload foto
     */
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
                            this.showSuccess(this.t('photoAdded'));
                            resolve();
                        } else {
                            console.warn('voegFotoToe methode niet beschikbaar');
                            resolve();
                        }
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
    
    /**
     * Setup autocomplete voor ouders
     */
    setupParentAutocomplete() {
        document.querySelectorAll('.parent-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.dataset.parentType;
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', (e) => {
                setTimeout(() => {
                    const dropdown = document.getElementById(`${parentType}Dropdown`);
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input') && !e.target.closest('.autocomplete-dropdown')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    /**
     * Toon parent autocomplete
     */
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
        
        // Positioneer dropdown
        const input = document.getElementById(parentType);
        if (input) {
            const rect = input.getBoundingClientRect();
            dropdown.style.top = `${rect.bottom}px`;
            dropdown.style.left = `${rect.left}px`;
            dropdown.style.width = `${rect.width}px`;
        }
        
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
    
    /**
     * Voeg ras toe aan recente rassen
     */
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
    
    /**
     * Vertaal de modal tekst
     */
    translateModal() {
        const currentLang = localStorage.getItem('appLanguage') || 'nl';
        const translations = {
            nl: {
                editDogData: "Data Hond Bewerken",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd"
            },
            en: {
                editDogData: "Edit Dog Data",
                close: "Close",
                refresh: "Refresh Page",
                accessDenied: "Access Denied"
            },
            de: {
                editDogData: "Hundedaten bearbeiten",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert"
            }
        };
        
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[currentLang] && translations[currentLang][key]) {
                element.textContent = translations[currentLang][key];
            }
        });
    }
    
    /**
     * Initialiseer de module
     */
    async init() {
        console.log('DogDataManager geïnitialiseerd');
        return true;
    }
}

// Maak globaal beschikbaar voor debug doeleinden
if (typeof window !== 'undefined') {
    window.DogDataManager = DogDataManager;
}