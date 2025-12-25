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
                // Modal titels
                newDog: "Nieuw Nest Toevoegen",
                editDog: "Nest Bewerken",
                dogLitterChoice: "Hond of Nest Toevoegen",
                addNewDog: "Nieuwe Hond",
                addNewLitter: "Nieuw Nest",
                development: "In Ontwikkeling",
                
                // Form velden
                name: "Naam",
                nameRequired: "Naam *",
                kennelName: "Kennelnaam",
                pedigreeNumber: "Stamboomnummer *",
                breed: "Ras",
                breedRequired: "Ras *",
                recent: "Recent:",
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
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd",
                back: "Terug",
                
                // Toegangscontrole popup teksten
                insufficientPermissions: "Onvoldoende rechten",
                insufficientPermissionsText: "U heeft geen toestemming om nesten te bewerken. Alleen administrators kunnen deze functie gebruiken.",
                loggedInAs: "U bent ingelogd als:",
                user: "Gebruiker",
                availableFeatures: "Beschikbare functies voor gebruikers",
                searchDogs: "Honden zoeken en bekijken",
                viewGallery: "Foto galerij bekijken",
                managePrivateInfo: "Privé informatie beheren",
                importExport: "Data importeren/exporteren",
                
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
                photoError: "Fout bij uploaden foto: ",

                // Container titels
                parentDetails: "Ouderdetails",
                litterDetails: "Nestdetails",
                otherDetails: "Overige details"
            },
            en: {
                // Modal titles
                newDog: "Add New Litter",
                editDog: "Edit Litter",
                dogLitterChoice: "Add Dog or Litter",
                addNewDog: "New Dog",
                addNewLitter: "New Litter",
                development: "In Development",
                
                // Form fields
                name: "Name",
                nameRequired: "Name *",
                kennelName: "Kennel Name",
                pedigreeNumber: "Pedigree number *",
                breed: "Breed",
                breedRequired: "Breed *",
                recent: "Recent:",
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
                refresh: "Refresh Page",
                accessDenied: "Access Denied",
                back: "Back",
                
                // Access control popup texts
                insufficientPermissions: "Insufficient permissions",
                insufficientPermissionsText: "You do not have permission to edit litters. Only administrators can use this function.",
                loggedInAs: "You are logged in as:",
                user: "User",
                availableFeatures: "Available features for users",
                searchDogs: "Search and view dogs",
                viewGallery: "View photo gallery",
                managePrivateInfo: "Manage private information",
                importExport: "Import/export data",
                
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
                photoError: "Error uploading photo: ",

                // Container titles
                parentDetails: "Parent Details",
                litterDetails: "Litter Details",
                otherDetails: "Other Details"
            },
            de: {
                // Modal Titel
                newDog: "Neuen Wurf hinzufügen",
                editDog: "Wurf bearbeiten",
                dogLitterChoice: "Hund oder Wurf hinzufügen",
                addNewDog: "Neuer Hund",
                addNewLitter: "Neuer Wurf",
                development: "In Entwicklung",
                
                // Formular Felder
                name: "Name",
                nameRequired: "Name *",
                kennelName: "Kennelname",
                pedigreeNumber: "Stammbaum-Nummer *",
                breed: "Rasse",
                breedRequired: "Rasse *",
                recent: "Kürzlich:",
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
                elbowNB: "NB (Niet bekend)",
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
                requiredFields: "Felder mit * zijn Pflichtfelder",
                saveDog: "Wurf speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                choose: "Wählen...",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert",
                back: "Zurück",
                
                // Zugangskontrolle Popup Texte
                insufficientPermissions: "Unzureichende Berechtigungen",
                insufficientPermissionsText: "Sie haben keine Berechtigung, Würfe zu bearbeiten. Nur Administratoren können diese Funktion nutzen.",
                loggedInAs: "Sie sind eingeloggt als:",
                user: "Benutzer",
                availableFeatures: "Verfügbare Funktionen für Benutzer",
                searchDogs: "Hunde suchen und anzeigen",
                viewGallery: "Fotogalerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Daten importieren/exportieren",
                
                // Meldungen
                adminOnly: "Nur Administratoren können Würfe hinzufügen/bearbeiten",
                fieldsRequired: "Name, Stammbaum-Nummer en Rasse zijn Pflichtfelder",
                savingDog: "Wurf wordt gespeichert...",
                dogAdded: "Wurf erfolgreich hinzugefügt!",
                dogUpdated: "Wurf erfolgreich aktualisiert!",
                dogDeleted: "Wurf erfolgreich gelöscht!",
                addFailed: "Fehler beim Hinzufügen des Wurfes: ",
                updateFailed: "Fehler beim Aktualisieren des Wurfes: ",
                deleteFailed: "Fehler beim Löschen des Wurfes: ",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Wurf löschen möchten?",
                photoAdded: "Foto hinzugefügt",
                photoError: "Fehler beim Hochladen des Fotos: ",

                // Container Titel
                parentDetails: "Elterndetails",
                litterDetails: "Wurfdetails",
                otherDetails: "Weitere Details"
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
     * Haal de volledige modal HTML op voor nest toevoegen/bewerken
     * Dit is de methode die DogManager gebruikt om de modal te tonen
     */
    getModalHTML(isEdit = false, litterData = null) {
        console.log('LitterManager: getModalHTML aangeroepen');
        
        // Controleer of gebruiker admin is - zoals in DogManager
        const currentUser = this.auth?.getCurrentUser ? this.auth.getCurrentUser() : { username: 'unknown', role: 'user' };
        const isAdmin = this.auth?.isAdmin ? this.auth.isAdmin() : false;
        const userRole = currentUser.role === 'admin' ? 'Admin' : this.t('user');
        
        if (!isAdmin) {
            const modalId = 'addLitterModal';
            
            return `
                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="${modalId}Label">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <span class="module-title" data-key="accessDenied">${this.t('accessDenied')}</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
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
        
        // Als gebruiker admin is, toon het nest formulier
        const t = this.t.bind(this);
        const modalTitle = isEdit ? t('editDog') : t('newDog');
        const modalId = 'addLitterModal';
        
        return `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="${modalId}Label">
                                <i class="bi bi-plus-circle"></i> ${modalTitle}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                        </div>
                        <div class="modal-body">
                            ${this.getFormHTML(litterData)}
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
            
            <style>
                /* Mobiele optimalisaties */
                @media (max-width: 768px) {
                    .modal-dialog {
                        margin: 10px;
                        max-height: 90vh;
                    }
                    
                    .modal-content {
                        max-height: 90vh;
                        overflow-y: auto;
                    }
                    
                    .modal-body {
                        padding: 15px;
                        max-height: calc(90vh - 130px);
                        overflow-y: auto;
                    }
                    
                    .breed-container {
                        gap: 8px !important;
                    }
                    
                    .breed-input-container {
                        flex: 0 0 180px !important;
                        min-width: 180px !important;
                    }
                    
                    .recent-breeds-label {
                        font-size: 0.8em !important;
                    }
                    
                    .recent-breed-btn {
                        font-size: 0.75em !important;
                        padding: 3px 6px !important;
                    }
                    
                    /* Geboortedatum input styling voor mobiel */
                    .date-input-wrapper {
                        position: relative;
                    }
                    
                    .date-input-wrapper input[type="text"] {
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                    }
                    
                    .date-input-wrapper input[type="date"]::-webkit-calendar-picker-indicator,
                    .date-input-wrapper input[type="date"]::-webkit-inner-spin-button,
                    .date-input-wrapper input[type="date"]::-webkit-clear-button {
                        display: none;
                        -webkit-appearance: none;
                        appearance: none;
                    }
                    
                    .date-input-wrapper input[type="date"] {
                        -webkit-appearance: textfield;
                        -moz-appearance: textfield;
                        appearance: textfield;
                    }
                    
                    /* Container styling voor mobiel */
                    .form-container {
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 15px !important;
                        margin-bottom: 15px;
                    }
                    
                    .container-title {
                        font-size: 0.9em;
                        margin-bottom: 8px;
                    }
                }
                
                /* Desktop styling */
                @media (min-width: 769px) {
                    .form-container {
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 20px !important;
                        margin-bottom: 20px;
                        background-color: #f9f9f9;
                    }
                    
                    .container-title {
                        font-weight: 600;
                        color: #495057;
                        margin-bottom: 15px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #dee2e6;
                        font-size: 1.1em;
                    }
                    
                    /* Desktop layout voor ouderdetails container */
                    #ouders-container .row > div {
                        margin-bottom: 10px;
                    }
                    
                    #ouders-container .row {
                        align-items: center;
                    }
                }
                
                /* Algemene styling voor containers */
                .form-container {
                    transition: all 0.3s ease;
                }
                
                .form-container:hover {
                    border-color: #b3d7ff;
                    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
                }
                
                .container-title {
                    display: flex;
                    align-items: center;
                }
                
                .container-title i {
                    margin-right: 8px;
                    font-size: 1.2em;
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
                
                /* Breed container voor 1-lijn layout - nu altijd op 1 regel */
                .breed-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: nowrap;
                    width: 100%;
                }
                
                .breed-input-container {
                    flex: 0 0 220px;
                    min-width: 220px;
                }
                
                .recent-breeds-container {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    flex: 1;
                    min-width: 0;
                    overflow: visible;
                }
                
                .recent-breeds-label {
                    font-size: 0.875em;
                    color: #6c757d;
                    white-space: nowrap;
                    margin-bottom: 0;
                    flex-shrink: 0;
                }
                
                .recent-breeds-buttons {
                    display: flex;
                    flex-wrap: nowrap;
                    gap: 4px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding-bottom: 2px;
                    flex: 1;
                    min-width: 0;
                }
                
                .recent-breed-btn {
                    white-space: nowrap;
                    flex-shrink: 0;
                    font-size: 0.8em;
                    padding: 4px 8px;
                }
                
                /* Custom scrollbar voor recent breed buttons */
                .recent-breeds-buttons::-webkit-scrollbar {
                    height: 4px;
                }
                
                .recent-breeds-buttons::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 2px;
                }
                
                .recent-breeds-buttons::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 2px;
                }
                
                .recent-breeds-buttons::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
                
                /* Datum input styling - gebruik text input voor alle apparaten */
                .date-input-wrapper {
                    position: relative;
                }
                
                .date-input-wrapper .form-control {
                    padding-right: 12px;
                }
                
                /* Verberg kalender picker voor alle apparaten */
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-clear-button {
                    display: none;
                    -webkit-appearance: none;
                    appearance: none;
                }
                
                input[type="date"] {
                    -webkit-appearance: textfield;
                    -moz-appearance: textfield;
                    appearance: textfield;
                }
                
                /* Placeholder styling voor datum velden */
                input[type="date"]::placeholder {
                    color: #6c757d;
                    opacity: 0.7;
                }
            </style>
        `;
    }
    
    /**
     * Haal alleen het formulier HTML op (zonder modal wrapper)
     * Dit wordt gebruikt door DogManager in het keuzescherm
     */
    getFormHTML(litterData = null) {
        console.log('LitterManager: getFormHTML aangeroepen');
        
        const t = this.t.bind(this);
        const data = litterData || {};
        
        // Genereer recente rassen knoppen
        let recentBreedsHTML = '';
        if (this.lastBreeds && this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="recent-breeds-container">
                    <div class="recent-breeds-label">${t('recent')}</div>
                    <div class="recent-breeds-buttons">
            `;
            this.lastBreeds.forEach(breed => {
                recentBreedsHTML += `
                    <button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">
                        ${breed}
                    </button>
                `;
            });
            recentBreedsHTML += `
                    </div>
                </div>
            `;
        }
        
        return `
            <form id="litterForm">
                <input type="hidden" id="fatherId" value="${data.vaderId || ''}">
                <input type="hidden" id="motherId" value="${data.moederId || ''}">
                
                <!-- CONTAINER 1: OUDERDETAILS -->
                <div class="form-container" id="ouders-container">
                    <div class="container-title">
                        <i class="bi bi-people"></i> ${t('parentDetails')}
                    </div>
                    
                    <!-- RIJ 1: Vader en Moeder -->
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
                    
                    <!-- RIJ 2: Kennelnaam en Ras -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="kennelName" class="form-label">${t('kennelName')}</label>
                                <input type="text" class="form-control" id="kennelName" value="${data.kennelnaam || ''}">
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="mb-3">
                                <label for="breed" class="form-label">${t('breedRequired')}</label>
                                <div class="breed-container">
                                    <div class="breed-input-container">
                                        <input type="text" class="form-control" id="breed" value="${data.ras || ''}" required>
                                    </div>
                                    ${recentBreedsHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- RIJ 3: Geboortedatum -->
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3 date-input-wrapper">
                                <label for="birthDate" class="form-label">${t('birthDate')}</label>
                                <input type="date" class="form-control" id="birthDate" 
                                       value="${data.geboortedatum || ''}"
                                       placeholder="DD-MM-JJJJ"
                                       onfocus="this.type='text'"
                                       onblur="this.type='date'">
                                <small class="form-text text-muted">Voer datum in als DD-MM-JJJJ (bijv. 15-01-2023)</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- CONTAINER 2: NESTDETAILS -->
                <div class="form-container" id="nest-container">
                    <div class="container-title">
                        <i class="bi bi-house"></i> ${t('litterDetails')}
                    </div>
                    
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="name" class="form-label">${t('nameRequired')}</label>
                                <input type="text" class="form-control" id="name" value="${data.naam || ''}" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="pedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                                <input type="text" class="form-control" id="pedigreeNumber" value="${data.stamboomnr || ''}" required>
                            </div>
                        </div>
                        <div class="col-md-4">
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
                </div>
                
                <!-- CONTAINER 3: OVERIGE DETAILS -->
                <div class="form-container" id="details-container">
                    <div class="container-title">
                        <i class="bi bi-card-checklist"></i> ${t('otherDetails')}
                    </div>
                    
                    <!-- Overlijdensdatum -->
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3 date-input-wrapper">
                                <label for="deathDate" class="form-label">${t('deathDate')}</label>
                                <input type="date" class="form-control" id="deathDate" 
                                       value="${data.overlijdensdatum || ''}"
                                       placeholder="DD-MM-JJJJ"
                                       onfocus="this.type='text'"
                                       onblur="this.type='date'">
                                <small class="form-text text-muted">Voer datum in als DD-MM-JJJJ (bijv. 15-01-2023)</small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Gezondheid: Heupdysplasie, Elleboogdysplasie, Patella Luxatie -->
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
                    
                    <!-- Ogen en Dandy Walker -->
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
                    
                    <!-- Schildklier en Land/Postcode -->
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
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="country" class="form-label">${t('country')}</label>
                                        <input type="text" class="form-control" id="country" value="${data.land || ''}">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="zipCode" class="form-label">${t('zipCode')}</label>
                                        <input type="text" class="form-control" id="zipCode" value="${data.postcode || ''}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Foto uploaden -->
                    <div class="mb-3">
                        <label for="photo" class="form-label">${t('addPhoto')}</label>
                        <div class="input-group">
                            <input type="file" class="form-control" id="photo" accept="image/*">
                            <label class="input-group-text" for="photo">${t('chooseFile')}</label>
                        </div>
                        <div class="form-text">${t('noFileChosen')}</div>
                    </div>
                    
                    <!-- Opmerkingen -->
                    <div class="mb-3">
                        <label for="remarks" class="form-label">${t('remarks')}</label>
                        <textarea class="form-control" id="remarks" rows="3">${data.opmerkingen || ''}</textarea>
                    </div>
                </div>
                
                <!-- Verplichte velden info -->
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    ${t('requiredFields')}
                </div>
                
                <!-- Opslaan knop -->
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
    
    /**
     * Setup events voor wanneer de modal wordt getoond
     * Deze methode wordt aangeroepen door DogManager wanneer het nest formulier wordt geladen
     */
    setupEvents() {
        console.log('LitterManager: setupEvents aangeroepen');
        
        // Controleer of gebruiker admin is - net zoals in DogManager
        const isAdmin = this.auth?.isAdmin ? this.auth.isAdmin() : false;
        
        if (!isAdmin) {
            console.log('LitterManager: Gebruiker is geen admin, toegang geweigerd popup wordt getoond');
            
            // Voeg event listeners toe voor de knoppen in de modal
            const modal = document.getElementById('addLitterModal');
            if (modal) {
                modal.addEventListener('shown.bs.modal', () => {
                    console.log('LitterManager modal is nu zichtbaar (toegang geweigerd)');
                });
            }
            return;
        }
        
        // Alleen verder gaan als gebruiker admin is
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Event listeners voor formulier
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            console.log('LitterManager: Save button gevonden');
            saveBtn.addEventListener('click', () => {
                console.log('LitterManager: Save button geklikt');
                this.saveDog();
            });
        } else {
            console.error('LitterManager: Save button niet gevonden!');
            // Probeer opnieuw na korte vertraging
            setTimeout(() => {
                const retryBtn = document.getElementById('saveDogBtn');
                if (retryBtn) {
                    console.log('LitterManager: Save button gevonden na retry');
                    retryBtn.addEventListener('click', () => {
                        this.saveDog();
                    });
                }
            }, 500);
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
        } else {
            console.log('LitterManager: Eyes select niet gevonden');
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
        } else {
            console.log('LitterManager: Thyroid select niet gevonden');
        }
        
        // Recente rassen knoppen - Delegatie gebruiken
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
        
        // Setup autocomplete voor ouders - zoals in DogManager
        this.setupParentAutocomplete();
        
        // Setup datum velden voor tekst invoer
        this.setupDateFields();
        
        console.log('LitterManager: Alle events ingesteld');
    }
    
    /**
     * Setup datum velden om als tekst veld te werken op mobiel
     */
    setupDateFields() {
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        
        if (birthDateInput) {
            // Verander type naar text wanneer gebruiker focust
            birthDateInput.addEventListener('focus', function() {
                this.type = 'text';
                this.placeholder = 'DD-MM-JJJJ';
            });
            
            // Valideer en converteer naar juiste formaat wanneer gebruiker blurt
            birthDateInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value) {
                    // Converteer DD-MM-JJJJ naar YYYY-MM-DD voor date input
                    const parts = value.split('-');
                    if (parts.length === 3) {
                        const day = parts[0].padStart(2, '0');
                        const month = parts[1].padStart(2, '0');
                        const year = parts[2];
                        if (day.length === 2 && month.length === 2 && year.length === 4) {
                            this.value = `${year}-${month}-${day}`;
                        }
                    }
                }
                this.type = 'date';
            });
            
            // Input event voor real-time formatteer hulp
            birthDateInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^0-9-]/g, '');
                
                // Auto-format naar DD-MM-JJJJ
                if (value.length > 2 && value.length <= 4 && !value.includes('-')) {
                    value = value.substring(0, 2) + '-' + value.substring(2);
                } else if (value.length > 5 && value.length <= 8 && value.split('-').length === 2) {
                    const parts = value.split('-');
                    if (parts[1].length > 2) {
                        value = parts[0] + '-' + parts[1].substring(0, 2) + '-' + parts[1].substring(2);
                    }
                }
                
                e.target.value = value;
            });
        }
        
        if (deathDateInput) {
            // Zelfde logica voor deathDate
            deathDateInput.addEventListener('focus', function() {
                this.type = 'text';
                this.placeholder = 'DD-MM-JJJJ';
            });
            
            deathDateInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value) {
                    const parts = value.split('-');
                    if (parts.length === 3) {
                        const day = parts[0].padStart(2, '0');
                        const month = parts[1].padStart(2, '0');
                        const year = parts[2];
                        if (day.length === 2 && month.length === 2 && year.length === 4) {
                            this.value = `${year}-${month}-${day}`;
                        }
                    }
                }
                this.type = 'date';
            });
            
            deathDateInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^0-9-]/g, '');
                
                if (value.length > 2 && value.length <= 4 && !value.includes('-')) {
                    value = value.substring(0, 2) + '-' + value.substring(2);
                } else if (value.length > 5 && value.length <= 8 && value.split('-').length === 2) {
                    const parts = value.split('-');
                    if (parts[1].length > 2) {
                        value = parts[0] + '-' + parts[1].substring(0, 2) + '-' + parts[1].substring(2);
                    }
                }
                
                e.target.value = value;
            });
        }
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
        
        // Verwijder bestaande dropdowns (voor het geval dat)
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            if (dropdown.parentElement && dropdown.parentElement.classList.contains('parent-input-wrapper')) {
                // Laat dropdowns staan die al goed zijn opgebouwd
            } else {
                dropdown.remove();
            }
        });
        
        // Maak nieuwe dropdown containers zoals in DogManager
        const fatherInputWrapper = document.querySelector('#father')?.closest('.parent-input-wrapper');
        const motherInputWrapper = document.querySelector('#mother')?.closest('.parent-input-wrapper');
        
        if (fatherInputWrapper) {
            // Controleer of er al een dropdown is
            let fatherDropdown = fatherInputWrapper.querySelector('.autocomplete-dropdown');
            if (!fatherDropdown) {
                fatherDropdown = document.createElement('div');
                fatherDropdown.className = 'autocomplete-dropdown';
                fatherDropdown.id = 'fatherDropdown';
                fatherDropdown.style.display = 'none';
                fatherInputWrapper.appendChild(fatherDropdown);
            }
        }
        
        if (motherInputWrapper) {
            // Controleer of er al een dropdown is
            let motherDropdown = motherInputWrapper.querySelector('.autocomplete-dropdown');
            if (!motherDropdown) {
                motherDropdown = document.createElement('div');
                motherDropdown.className = 'autocomplete-dropdown';
                motherDropdown.id = 'motherDropdown';
                motherDropdown.style.display = 'none';
                motherInputWrapper.appendChild(motherDropdown);
            }
        }
        
        // Event listeners voor vader en moeder velden - net zoals in DogManager
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
        
        // Klik buiten dropdown om te verbergen - net zoals in DogManager
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input-wrapper')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    showParentAutocomplete(searchTerm, parentType) {
        console.log('LitterManager: showParentAutocomplete voor', parentType, 'zoekterm:', searchTerm);
        
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) {
            console.error('LitterManager: Dropdown niet gevonden:', `${parentType}Dropdown`);
            return;
        }
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        console.log('LitterManager: Aantal honden beschikbaar voor autocomplete:', this.allDogs.length);
        
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
        
        // Event listeners voor autocomplete items - net zoals in DogManager
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
                console.log('LitterManager: Ouder geselecteerd:', dogName, 'ID:', dogId);
            });
        });
    }
    
    async saveDog() {
        console.log('LitterManager: saveDog aangeroepen');
        
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
            naam: document.getElementById('name')?.value.trim() || '',
            kennelnaam: document.getElementById('kennelName')?.value.trim() || '',
            stamboomnr: document.getElementById('pedigreeNumber')?.value.trim() || '',
            ras: document.getElementById('breed')?.value.trim() || '',
            geslacht: document.getElementById('gender')?.value || '',
            vader: document.getElementById('father')?.value.trim() || '',
            vaderId: document.getElementById('fatherId')?.value ? parseInt(document.getElementById('fatherId').value) : null,
            moeder: document.getElementById('mother')?.value.trim() || '',
            moederId: document.getElementById('motherId')?.value ? parseInt(document.getElementById('motherId').value) : null,
            geboortedatum: document.getElementById('birthDate')?.value || '',
            overlijdensdatum: document.getElementById('deathDate')?.value || '',
            heupdysplasie: document.getElementById('hipDysplasia')?.value || '',
            elleboogdysplasie: document.getElementById('elbowDysplasia')?.value || '',
            patella: document.getElementById('patellaLuxation')?.value || '',
            ogen: document.getElementById('eyes')?.value || '',
            ogenVerklaring: document.getElementById('eyesExplanation')?.value.trim() || '',
            dandyWalker: document.getElementById('dandyWalker')?.value || '',
            schildklier: document.getElementById('thyroid')?.value || '',
            schildklierVerklaring: document.getElementById('thyroidExplanation')?.value.trim() || '',
            land: document.getElementById('country')?.value.trim() || '',
            postcode: document.getElementById('zipCode')?.value.trim() || '',
            opmerkingen: document.getElementById('remarks')?.value.trim() || '',
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
            const photoInput = document.getElementById('photo');
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
        document.getElementById('fatherId').value = '';
        document.getElementById('motherId').value = '';
        
        // Reset dropdowns
        const dropdowns = document.querySelectorAll('.autocomplete-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        
        // Reset datum velden
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        if (birthDateInput) {
            birthDateInput.type = 'date';
            birthDateInput.placeholder = 'DD-MM-JJJJ';
        }
        if (deathDateInput) {
            deathDateInput.type = 'date';
            deathDateInput.placeholder = 'DD-MM-JJJJ';
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