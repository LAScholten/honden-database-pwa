/**
 * Foto Management Module
 * Beheert foto upload, galerij en statistieken
 */

class PhotoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = {
            nl: {
                // Modal titels
                photoGallery: "Foto Galerij",
                photoInfo: "Foto Galerij - Bekijk en beheer foto's van honden. Upload nieuwe foto's of verwijder bestaande foto's.",
                
                // Upload sectie
                photoUpload: "Foto Uploaden",
                selectDog: "Selecteer Hond",
                chooseDog: "Kies een hond...",
                selectPhoto: "Selecteer Foto",
                maxSize: "Maximale grootte: 5MB. Ondersteunde formaten: JPG, PNG, GIF",
                description: "Beschrijving (optioneel)",
                describePhoto: "Beschrijf de foto...",
                uploadPhoto: "Foto Uploaden",
                
                // Statistieken
                photoStatistics: "Foto Statistieken",
                totalPhotos: "Totaal aantal foto's",
                photosPerDog: "Foto's per hond",
                lastUpload: "Laatste upload",
                totalSize: "Totale grootte",
                
                // Zoek sectie
                searchPhotos: "Zoek Foto's",
                searchPlaceholder: "Zoek foto's op hondennaam of beschrijving...",
                search: "Zoeken",
                
                // Overzicht
                photoOverview: "Foto Overzicht",
                noPhotos: "Er zijn nog geen foto's geüpload",
                loadAllPhotos: "Laad alle foto's",
                unknownDog: "Onbekende hond",
                noDescription: "Geen beschrijving",
                delete: "Verwijderen",
                view: "Bekijken",
                
                // Foto details
                photoDetails: "Foto Details",
                dog: "Hond",
                filename: "Bestandsnaam",
                size: "Grootte",
                type: "Type",
                uploadedOn: "Geüpload op",
                by: "Door",
                
                // Alerts
                selectDogFirst: "Selecteer eerst een hond",
                selectPhotoFirst: "Selecteer eerst een foto",
                fileTooLarge: "Bestand is te groot (maximaal 5MB)",
                invalidType: "Ongeldig bestandstype. Alleen JPG, PNG en GIF zijn toegestaan",
                uploading: "Foto uploaden...",
                uploadSuccess: "Foto succesvol geüpload!",
                uploadFailed: "Upload mislukt: ",
                fileReadError: "Fout bij lezen bestand",
                searching: "Foto's zoeken...",
                searchFailed: "Zoeken mislukt: ",
                loading: "Foto's laden...",
                loadFailed: "Laden mislukt: ",
                deleteConfirm: "Weet je zeker dat je deze foto wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
                deleting: "Foto verwijderen...",
                deleteSuccess: "Foto succesvol verwijderd!",
                deleteFailed: "Verwijderen mislukt: ",
                photoNotFound: "Foto niet gevonden",
                loadDetailsFailed: "Fout bij laden foto details: "
            },
            en: {
                // Modal titles
                photoGallery: "Photo Gallery",
                photoInfo: "Photo Gallery - View and manage dog photos. Upload new photos or delete existing ones.",
                
                // Upload section
                photoUpload: "Photo Upload",
                selectDog: "Select Dog",
                chooseDog: "Choose a dog...",
                selectPhoto: "Select Photo",
                maxSize: "Maximum size: 5MB. Supported formats: JPG, PNG, GIF",
                description: "Description (optional)",
                describePhoto: "Describe the photo...",
                uploadPhoto: "Upload Photo",
                
                // Statistics
                photoStatistics: "Photo Statistics",
                totalPhotos: "Total photos",
                photosPerDog: "Photos per dog",
                lastUpload: "Last upload",
                totalSize: "Total size",
                
                // Search section
                searchPhotos: "Search Photos",
                searchPlaceholder: "Search photos by dog name or description...",
                search: "Search",
                
                // Overview
                photoOverview: "Photo Overview",
                noPhotos: "No photos uploaded yet",
                loadAllPhotos: "Load all photos",
                unknownDog: "Unknown dog",
                noDescription: "No description",
                delete: "Delete",
                view: "View",
                
                // Photo details
                photoDetails: "Photo Details",
                dog: "Dog",
                filename: "Filename",
                size: "Size",
                type: "Type",
                uploadedOn: "Uploaded on",
                by: "By",
                
                // Alerts
                selectDogFirst: "Select a dog first",
                selectPhotoFirst: "Select a photo first",
                fileTooLarge: "File is too large (maximum 5MB)",
                invalidType: "Invalid file type. Only JPG, PNG and GIF are allowed",
                uploading: "Uploading photo...",
                uploadSuccess: "Photo uploaded successfully!",
                uploadFailed: "Upload failed: ",
                fileReadError: "Error reading file",
                searching: "Searching photos...",
                searchFailed: "Search failed: ",
                loading: "Loading photos...",
                loadFailed: "Loading failed: ",
                deleteConfirm: "Are you sure you want to delete this photo? This cannot be undone.",
                deleting: "Deleting photo...",
                deleteSuccess: "Photo successfully deleted!",
                deleteFailed: "Delete failed: ",
                photoNotFound: "Photo not found",
                loadDetailsFailed: "Error loading photo details: "
            },
            de: {
                // Modal Titel
                photoGallery: "Foto Galerie",
                photoInfo: "Foto Galerie - Hunderfotos ansehen und verwalten. Laden Sie neue Fotos hoch oder löschen Sie vorhandene.",
                
                // Upload Bereich
                photoUpload: "Foto Upload",
                selectDog: "Hund auswählen",
                chooseDog: "Wählen Sie einen Hund...",
                selectPhoto: "Foto auswählen",
                maxSize: "Maximale Größe: 5MB. Unterstützte Formate: JPG, PNG, GIF",
                description: "Beschreibung (optional)",
                describePhoto: "Beschreiben Sie das Foto...",
                uploadPhoto: "Foto hochladen",
                
                // Statistiken
                photoStatistics: "Foto Statistiken",
                totalPhotos: "Gesamtanzahl Fotos",
                photosPerDog: "Fotos pro Hund",
                lastUpload: "Letzter Upload",
                totalSize: "Gesamtgröße",
                
                // Suchbereich
                searchPhotos: "Fotos suchen",
                searchPlaceholder: "Fotos nach Hundenamen oder Beschreibung suchen...",
                search: "Suchen",
                
                // Übersicht
                photoOverview: "Foto Übersicht",
                noPhotos: "Noch keine Fotos hochgeladen",
                loadAllPhotos: "Alle Fotos laden",
                unknownDog: "Unbekannter Hund",
                noDescription: "Keine Beschreibung",
                delete: "Löschen",
                view: "Ansehen",
                
                // Foto Details
                photoDetails: "Foto Details",
                dog: "Hund",
                filename: "Dateiname",
                size: "Größe",
                type: "Typ",
                uploadedOn: "Hochgeladen am",
                by: "Von",
                
                // Meldungen
                selectDogFirst: "Wählen Sie zuerst einen Hund",
                selectPhotoFirst: "Wählen Sie zuerst ein Foto",
                fileTooLarge: "Datei ist zu groß (maximal 5MB)",
                invalidType: "Ungültiger Dateityp. Nur JPG, PNG und GIF sind erlaubt",
                uploading: "Foto wird hochgeladen...",
                uploadSuccess: "Foto erfolgreich hochgeladen!",
                uploadFailed: "Upload fehlgeschlagen: ",
                fileReadError: "Fehler beim Lesen der Datei",
                searching: "Suche Fotos...",
                searchFailed: "Suche fehlgeschlagen: ",
                loading: "Lade Fotos...",
                loadFailed: "Laden fehlgeschlagen: ",
                deleteConfirm: "Sind Sie sicher, dass Sie dieses Foto löschen möchten? Dies kann nicht rückgängig gemacht werden.",
                deleting: "Foto wird gelöscht...",
                deleteSuccess: "Foto erfolgreich gelöscht!",
                deleteFailed: "Löschen fehlgeschlagen: ",
                photoNotFound: "Foto nicht gefunden",
                loadDetailsFailed: "Fehler beim Laden der Fotodetails: "
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('photoGalleryModal')) {
            this.loadPhotosData();
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="photoGalleryModal" tabindex="-1" aria-labelledby="photoGalleryModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-white">
                            <h5 class="modal-title" id="photoGalleryModalLabel">
                                <i class="bi bi-images"></i> ${t('photoGallery')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-4">
                                <i class="bi bi-info-circle"></i>
                                ${t('photoInfo')}
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-upload"></i> ${t('photoUpload')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="photoHondSelect" class="form-label">${t('selectDog')}</label>
                                                <select class="form-select" id="photoHondSelect">
                                                    <option value="">${t('chooseDog')}</option>
                                                    <!-- Hond opties worden hier ingeladen -->
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label for="photoFile" class="form-label">${t('selectPhoto')}</label>
                                                <input class="form-control" type="file" id="photoFile" accept="image/*">
                                                <div class="form-text">${t('maxSize')}</div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="photoDescription" class="form-label">${t('description')}</label>
                                                <textarea class="form-control" id="photoDescription" rows="2" placeholder="${t('describePhoto')}"></textarea>
                                            </div>
                                            <button class="btn btn-warning w-100" id="uploadPhotoBtn">
                                                <i class="bi bi-upload"></i> ${t('uploadPhoto')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-graph-up"></i> ${t('photoStatistics')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="text-center">
                                                <div class="display-4 text-warning mb-2" id="totalPhotosCount">0</div>
                                                <div class="text-muted">${t('totalPhotos')}</div>
                                            </div>
                                            <hr>
                                            <div class="small">
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span>${t('photosPerDog')}:</span>
                                                    <span id="photosPerDog">...</span>
                                                </div>
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span>${t('lastUpload')}:</span>
                                                    <span id="lastUploadDate">...</span>
                                                </div>
                                                <div class="d-flex justify-content-between">
                                                    <span>${t('totalSize')}:</span>
                                                    <span id="totalPhotosSize">...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="bi bi-search"></i> ${t('searchPhotos')}</h6>
                                </div>
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-8">
                                            <input type="text" class="form-control" id="searchPhotosInput" placeholder="${t('searchPlaceholder')}">
                                        </div>
                                        <div class="col-md-4">
                                            <button class="btn btn-warning w-100" type="button" id="searchPhotosBtn">
                                                <i class="bi bi-search"></i> ${t('search')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <h6 class="mb-3">${t('photoOverview')}</h6>
                                <div id="photosContainer" class="row">
                                    <div class="col-12 text-center py-5">
                                        <i class="bi bi-images display-1 text-muted"></i>
                                        <p class="mt-3 text-muted">${t('noPhotos')}</p>
                                        <button class="btn btn-warning" id="loadAllPhotosBtn">
                                            <i class="bi bi-arrow-clockwise"></i> ${t('loadAllPhotos')}
                                        </button>
                                    </div>
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
        const uploadBtn = document.getElementById('uploadPhotoBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.uploadPhoto();
            });
        }
        
        const searchBtn = document.getElementById('searchPhotosBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.searchPhotos();
            });
        }
        
        const loadBtn = document.getElementById('loadAllPhotosBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadAllPhotos();
            });
        }
    }
    
    async loadPhotosData() {
        const t = this.t.bind(this);
        
        try {
            const honden = await this.db.getHonden();
            const hondSelect = document.getElementById('photoHondSelect');
            if (hondSelect) {
                hondSelect.innerHTML = `<option value="">${t('chooseDog')}</option>`;
                honden.forEach(hond => {
                    const option = document.createElement('option');
                    option.value = hond.id;
                    option.textContent = `${hond.naam} (${hond.ras})`;
                    hondSelect.appendChild(option);
                });
            }
            
            const fotos = await this.db.getAllFotos();
            await this.updatePhotoStats(fotos);
            this.displayPhotos(fotos);
            
        } catch (error) {
            console.error('Fout bij laden foto data:', error);
        }
    }
    
    async updatePhotoStats(fotos) {
        const t = this.t.bind(this);
        const totalPhotos = document.getElementById('totalPhotosCount');
        const photosPerDog = document.getElementById('photosPerDog');
        const lastUploadDate = document.getElementById('lastUploadDate');
        const totalPhotosSize = document.getElementById('totalPhotosSize');
        
        if (!fotos || fotos.length === 0) {
            if (totalPhotos) totalPhotos.textContent = '0';
            if (photosPerDog) photosPerDog.textContent = '0';
            if (lastUploadDate) lastUploadDate.textContent = t('never');
            if (totalPhotosSize) totalPhotosSize.textContent = '0 MB';
            return;
        }
        
        const hondenCount = new Set(fotos.map(f => f.hondId)).size;
        const avgPhotosPerDog = (fotos.length / hondenCount).toFixed(1);
        
        const latestPhoto = fotos.reduce((latest, current) => {
            return new Date(current.uploadDatum) > new Date(latest.uploadDatum) ? current : latest;
        });
        
        const totalSize = fotos.reduce((sum, foto) => sum + (foto.grootte || 0), 0);
        const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
        
        if (totalPhotos) totalPhotos.textContent = fotos.length;
        if (photosPerDog) photosPerDog.textContent = avgPhotosPerDog;
        if (lastUploadDate) {
            const date = new Date(latestPhoto.uploadDatum);
            lastUploadDate.textContent = date.toLocaleDateString(this.currentLang);
        }
        if (totalPhotosSize) totalPhotosSize.textContent = `${sizeInMB} MB`;
    }
    
    async uploadPhoto() {
        const t = this.t.bind(this);
        const hondId = document.getElementById('photoHondSelect').value;
        const fileInput = document.getElementById('photoFile');
        const description = document.getElementById('photoDescription').value.trim();
        
        if (!hondId) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        if (!fileInput || !fileInput.files.length) {
            this.showError(t('selectPhotoFirst'));
            return;
        }
        
        const file = fileInput.files[0];
        
        if (file.size > 5 * 1024 * 1024) {
            this.showError(t('fileTooLarge'));
            return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            this.showError(t('invalidType'));
            return;
        }
        
        this.showProgress(t('uploading'));
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const fotoData = {
                    hondId: parseInt(hondId),
                    bestandsnaam: file.name,
                    type: file.type,
                    grootte: file.size,
                    datum: new Date().toISOString(),
                    beschrijving: description,
                    dataUrl: e.target.result
                };
                
                await this.db.voegFotoToe(fotoData);
                
                this.hideProgress();
                this.showSuccess(t('uploadSuccess'));
                
                document.getElementById('photoDescription').value = '';
                fileInput.value = '';
                await this.loadPhotosData();
                
            } catch (error) {
                this.hideProgress();
                this.showError(`${t('uploadFailed')}${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.hideProgress();
            this.showError(t('fileReadError'));
        };
        
        reader.readAsDataURL(file);
    }
    
    async searchPhotos() {
        const t = this.t.bind(this);
        const searchTerm = document.getElementById('searchPhotosInput').value.trim().toLowerCase();
        
        if (!searchTerm) {
            await this.loadAllPhotos();
            return;
        }
        
        this.showProgress(t('searching'));
        
        try {
            const fotos = await this.db.getAllFotos();
            const honden = await this.db.getHonden();
            
            const results = fotos.filter(foto => {
                const hond = honden.find(h => h.id === foto.hondId);
                const hondNaam = hond ? hond.naam.toLowerCase() : '';
                const beschrijving = foto.beschrijving ? foto.beschrijving.toLowerCase() : '';
                
                return hondNaam.includes(searchTerm) || 
                       beschrijving.includes(searchTerm) ||
                       (hond && hond.ras && hond.ras.toLowerCase().includes(searchTerm));
            });
            
            this.hideProgress();
            this.displayPhotos(results);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('searchFailed')}${error.message}`);
        }
    }
    
    async loadAllPhotos() {
        const t = this.t.bind(this);
        this.showProgress(t('loading'));
        
        try {
            const fotos = await this.db.getAllFotos();
            this.hideProgress();
            this.displayPhotos(fotos);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('loadFailed')}${error.message}`);
        }
    }
    
    async displayPhotos(fotos) {
        const t = this.t.bind(this);
        const container = document.getElementById('photosContainer');
        if (!container) return;
        
        if (!fotos || fotos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-images display-1 text-muted"></i>
                    <p class="mt-3 text-muted">${t('noPhotos')}</p>
                    <button class="btn btn-warning" id="loadAllPhotosBtn">
                        <i class="bi bi-arrow-clockwise"></i> ${t('loadAllPhotos')}
                    </button>
                </div>
            `;
            
            const loadBtn = document.getElementById('loadAllPhotosBtn');
            if (loadBtn) {
                loadBtn.addEventListener('click', () => {
                    this.loadAllPhotos();
                });
            }
            
            return;
        }
        
        const honden = await this.db.getHonden();
        
        let html = '';
        
        fotos.forEach(foto => {
            const hond = honden.find(h => h.id === foto.hondId);
            const hondNaam = hond ? hond.naam : t('unknownDog');
            const uploadDatum = new Date(foto.uploadDatum).toLocaleDateString(this.currentLang);
            
            html += `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card h-100">
                        <div class="card-img-top photo-thumbnail" 
                             style="height: 150px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            ${foto.dataUrl ? 
                                `<img src="${foto.dataUrl}" alt="${foto.beschrijving || hondNaam}" 
                                      style="max-width: 100%; max-height: 100%; object-fit: cover;">` :
                                `<i class="bi bi-image text-muted" style="font-size: 3rem;"></i>`
                            }
                        </div>
                        <div class="card-body">
                            <h6 class="card-title">${hondNaam}</h6>
                            <p class="card-text small text-muted">
                                ${foto.beschrijving || t('noDescription')}
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">${uploadDatum}</small>
                                <div>
                                    <button class="btn btn-sm btn-outline-danger delete-photo-btn" data-id="${foto.id}">
                                        <i class="bi bi-trash"></i> ${t('delete')}
                                    </button>
                                    <button class="btn btn-sm btn-outline-info view-photo-btn" data-id="${foto.id}">
                                        <i class="bi bi-eye"></i> ${t('view')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        document.querySelectorAll('.delete-photo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fotoId = e.target.closest('.delete-photo-btn').dataset.id;
                this.deletePhoto(fotoId);
            });
        });
        
        document.querySelectorAll('.view-photo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fotoId = e.target.closest('.view-photo-btn').dataset.id;
                this.viewPhoto(fotoId);
            });
        });
    }
    
    async deletePhoto(fotoId) {
        const t = this.t.bind(this);
        
        if (!confirm(t('deleteConfirm'))) {
            return;
        }
        
        this.showProgress(t('deleting'));
        
        try {
            await this.db.verwijderFoto(parseInt(fotoId));
            this.hideProgress();
            this.showSuccess(t('deleteSuccess'));
            await this.loadPhotosData();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('deleteFailed')}${error.message}`);
        }
    }
    
    async viewPhoto(fotoId) {
        const t = this.t.bind(this);
        
        try {
            const fotos = await this.db.getAllFotos();
            const foto = fotos.find(f => f.id === parseInt(fotoId));
            
            if (!foto) {
                this.showError(t('photoNotFound'));
                return;
            }
            
            const honden = await this.db.getHonden();
            const hond = honden.find(h => h.id === foto.hondId);
            
            const html = `
                <div class="modal fade" id="viewPhotoModal" tabindex="-1" aria-labelledby="viewPhotoModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-info text-white">
                                <h5 class="modal-title" id="viewPhotoModalLabel">
                                    <i class="bi bi-image"></i> ${t('photoDetails')}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="text-center mb-3">
                                            ${foto.dataUrl ? 
                                                `<img src="${foto.dataUrl}" alt="${foto.beschrijving}" 
                                                      class="img-fluid rounded" style="max-height: 400px;">` :
                                                `<div class="bg-light p-5 rounded text-center">
                                                    <i class="bi bi-image text-muted" style="font-size: 5rem;"></i>
                                                    <p class="mt-3 text-muted">${t('noImageAvailable') || 'Geen afbeelding beschikbaar'}</p>
                                                </div>`
                                            }
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <h6 class="border-bottom pb-2">${t('photoInformation') || 'Foto Informatie'}</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th style="width: 40%">${t('dog')}:</th>
                                                <td>${hond ? hond.naam : t('unknown')}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('filename')}:</th>
                                                <td><small>${foto.bestandsnaam}</small></td>
                                            </tr>
                                            <tr>
                                                <th>${t('size')}:</th>
                                                <td>${(foto.grootte / 1024).toFixed(1)} KB</td>
                                            </tr>
                                            <tr>
                                                <th>${t('type')}:</th>
                                                <td>${foto.type}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('uploadedOn')}:</th>
                                                <td>${new Date(foto.uploadDatum).toLocaleString(this.currentLang)}</td>
                                            </tr>
                                            <tr>
                                                <th>${t('by')}:</th>
                                                <td>${foto.geuploadDoor || t('unknown')}</td>
                                            </tr>
                                        </table>
                                        
                                        ${foto.beschrijving ? `
                                        <h6 class="border-bottom pb-2 mt-3">${t('description')}</h6>
                                        <div class="bg-light p-3 rounded small">
                                            ${foto.beschrijving}
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                                <button type="button" class="btn btn-danger" id="deletePhotoFromViewBtn" data-id="${foto.id}">
                                    <i class="bi bi-trash"></i> ${t('delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const container = document.getElementById('modalsContainer');
            container.insertAdjacentHTML('beforeend', html);
            
            const modalElement = document.getElementById('viewPhotoModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            const deleteBtn = document.getElementById('deletePhotoFromViewBtn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async () => {
                    modal.hide();
                    await this.deletePhoto(foto.id);
                });
            }
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
        } catch (error) {
            this.showError(`${t('loadDetailsFailed')}${error.message}`);
        }
    }
}