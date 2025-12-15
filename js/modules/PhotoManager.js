/**
 * Foto Management Module
 * Beheert foto upload, galerij en statistieken
 */

class PhotoManager extends BaseModule {
    constructor() {
        super();
    }
    
    getModalHTML() {
        return `
            <div class="modal fade" id="photoGalleryModal" tabindex="-1" aria-labelledby="photoGalleryModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-white">
                            <h5 class="modal-title" id="photoGalleryModalLabel">
                                <i class="bi bi-images"></i> Foto Galerij
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-4">
                                <i class="bi bi-info-circle"></i>
                                Bekijk en beheer foto's van honden. Upload nieuwe foto's of verwijder bestaande foto's.
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-upload"></i> Foto Uploaden</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="photoHondSelect" class="form-label">Selecteer Hond</label>
                                                <select class="form-select" id="photoHondSelect">
                                                    <option value="">Kies een hond...</option>
                                                    <!-- Hond opties worden hier ingeladen -->
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label for="photoFile" class="form-label">Selecteer Foto</label>
                                                <input class="form-control" type="file" id="photoFile" accept="image/*">
                                                <div class="form-text">Maximale grootte: 5MB. Ondersteunde formaten: JPG, PNG, GIF</div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="photoDescription" class="form-label">Beschrijving (optioneel)</label>
                                                <textarea class="form-control" id="photoDescription" rows="2" placeholder="Beschrijf de foto..."></textarea>
                                            </div>
                                            <button class="btn btn-warning w-100" id="uploadPhotoBtn">
                                                <i class="bi bi-upload"></i> Foto Uploaden
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-graph-up"></i> Foto Statistieken</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="text-center">
                                                <div class="display-4 text-warning mb-2" id="totalPhotosCount">0</div>
                                                <div class="text-muted">Totaal aantal foto's</div>
                                            </div>
                                            <hr>
                                            <div class="small">
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span>Foto's per hond:</span>
                                                    <span id="photosPerDog">...</span>
                                                </div>
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span>Laatste upload:</span>
                                                    <span id="lastUploadDate">...</span>
                                                </div>
                                                <div class="d-flex justify-content-between">
                                                    <span>Totale grootte:</span>
                                                    <span id="totalPhotosSize">...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="bi bi-search"></i> Zoek Foto's</h6>
                                </div>
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-8">
                                            <input type="text" class="form-control" id="searchPhotosInput" placeholder="Zoek foto's op hondennaam of beschrijving...">
                                        </div>
                                        <div class="col-md-4">
                                            <button class="btn btn-warning w-100" type="button" id="searchPhotosBtn">
                                                <i class="bi bi-search"></i> Zoeken
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <h6 class="mb-3">Foto Overzicht</h6>
                                <div id="photosContainer" class="row">
                                    <div class="col-12 text-center py-5">
                                        <i class="bi bi-images display-1 text-muted"></i>
                                        <p class="mt-3 text-muted">Er zijn nog geen foto's geüpload</p>
                                        <button class="btn btn-warning" id="loadAllPhotosBtn">
                                            <i class="bi bi-arrow-clockwise"></i> Laad alle foto's
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
        try {
            // Laad honden voor dropdown
            const honden = await this.db.getHonden();
            const hondSelect = document.getElementById('photoHondSelect');
            if (hondSelect) {
                hondSelect.innerHTML = '<option value="">Kies een hond...</option>';
                honden.forEach(hond => {
                    const option = document.createElement('option');
                    option.value = hond.id;
                    option.textContent = `${hond.naam} (${hond.ras})`;
                    hondSelect.appendChild(option);
                });
            }
            
            // Laad foto statistieken
            const fotos = await this.db.getAllFotos();
            await this.updatePhotoStats(fotos);
            
            // Toon foto's
            this.displayPhotos(fotos);
            
        } catch (error) {
            console.error('Fout bij laden foto data:', error);
        }
    }
    
    async updatePhotoStats(fotos) {
        const totalPhotos = document.getElementById('totalPhotosCount');
        const photosPerDog = document.getElementById('photosPerDog');
        const lastUploadDate = document.getElementById('lastUploadDate');
        const totalPhotosSize = document.getElementById('totalPhotosSize');
        
        if (!fotos || fotos.length === 0) {
            if (totalPhotos) totalPhotos.textContent = '0';
            if (photosPerDog) photosPerDog.textContent = '0';
            if (lastUploadDate) lastUploadDate.textContent = 'Nooit';
            if (totalPhotosSize) totalPhotosSize.textContent = '0 MB';
            return;
        }
        
        // Bereken statistieken
        const hondenCount = new Set(fotos.map(f => f.hondId)).size;
        const avgPhotosPerDog = (fotos.length / hondenCount).toFixed(1);
        
        const latestPhoto = fotos.reduce((latest, current) => {
            return new Date(current.uploadDatum) > new Date(latest.uploadDatum) ? current : latest;
        });
        
        const totalSize = fotos.reduce((sum, foto) => sum + (foto.grootte || 0), 0);
        const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
        
        // Update UI
        if (totalPhotos) totalPhotos.textContent = fotos.length;
        if (photosPerDog) photosPerDog.textContent = avgPhotosPerDog;
        if (lastUploadDate) {
            const date = new Date(latestPhoto.uploadDatum);
            lastUploadDate.textContent = date.toLocaleDateString('nl-NL');
        }
        if (totalPhotosSize) totalPhotosSize.textContent = `${sizeInMB} MB`;
    }
    
    async uploadPhoto() {
        const hondId = document.getElementById('photoHondSelect').value;
        const fileInput = document.getElementById('photoFile');
        const description = document.getElementById('photoDescription').value.trim();
        
        if (!hondId) {
            this.showError('Selecteer eerst een hond');
            return;
        }
        
        if (!fileInput || !fileInput.files.length) {
            this.showError('Selecteer eerst een foto');
            return;
        }
        
        const file = fileInput.files[0];
        
        // Valideer bestand
        if (file.size > 5 * 1024 * 1024) { // 5MB
            this.showError('Bestand is te groot (maximaal 5MB)');
            return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            this.showError('Ongeldig bestandstype. Alleen JPG, PNG en GIF zijn toegestaan');
            return;
        }
        
        this.showProgress('Foto uploaden...');
        
        // Lees bestand als DataURL voor preview
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
                    dataUrl: e.target.result // Base64 encoded afbeelding
                };
                
                await this.db.voegFotoToe(fotoData);
                
                this.hideProgress();
                this.showSuccess('Foto succesvol geüpload!');
                
                // Formulier resetten
                document.getElementById('photoDescription').value = '';
                fileInput.value = '';
                
                // Foto's herladen
                await this.loadPhotosData();
                
            } catch (error) {
                this.hideProgress();
                this.showError(`Upload mislukt: ${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.hideProgress();
            this.showError('Fout bij lezen bestand');
        };
        
        reader.readAsDataURL(file);
    }
    
    async searchPhotos() {
        const searchTerm = document.getElementById('searchPhotosInput').value.trim().toLowerCase();
        
        if (!searchTerm) {
            await this.loadAllPhotos();
            return;
        }
        
        this.showProgress('Foto\'s zoeken...');
        
        try {
            const fotos = await this.db.getAllFotos();
            const honden = await this.db.getHonden();
            
            // Zoek foto's op basis van hondennaam of beschrijving
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
            this.showError(`Zoeken mislukt: ${error.message}`);
        }
    }
    
    async loadAllPhotos() {
        this.showProgress('Foto\'s laden...');
        
        try {
            const fotos = await this.db.getAllFotos();
            this.hideProgress();
            this.displayPhotos(fotos);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Laden mislukt: ${error.message}`);
        }
    }
    
    async displayPhotos(fotos) {
        const container = document.getElementById('photosContainer');
        if (!container) return;
        
        if (!fotos || fotos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-images display-1 text-muted"></i>
                    <p class="mt-3 text-muted">Er zijn nog geen foto's geüpload</p>
                    <button class="btn btn-warning" id="loadAllPhotosBtn">
                        <i class="bi bi-arrow-clockwise"></i> Laad alle foto's
                    </button>
                </div>
            `;
            
            // Voeg event listener opnieuw toe
            const loadBtn = document.getElementById('loadAllPhotosBtn');
            if (loadBtn) {
                loadBtn.addEventListener('click', () => {
                    this.loadAllPhotos();
                });
            }
            
            return;
        }
        
        // Laad hondennamen voor referentie
        const honden = await this.db.getHonden();
        
        let html = '';
        
        fotos.forEach(foto => {
            const hond = honden.find(h => h.id === foto.hondId);
            const hondNaam = hond ? hond.naam : 'Onbekende hond';
            const uploadDatum = new Date(foto.uploadDatum).toLocaleDateString('nl-NL');
            
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
                                ${foto.beschrijving || 'Geen beschrijving'}
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">${uploadDatum}</small>
                                <div>
                                    <button class="btn btn-sm btn-outline-danger delete-photo-btn" data-id="${foto.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-info view-photo-btn" data-id="${foto.id}">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Voeg event listeners toe
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
        if (!confirm('Weet je zeker dat je deze foto wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
            return;
        }
        
        this.showProgress('Foto verwijderen...');
        
        try {
            await this.db.verwijderFoto(parseInt(fotoId));
            this.hideProgress();
            this.showSuccess('Foto succesvol verwijderd!');
            
            // Herlaad foto's
            await this.loadPhotosData();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`Verwijderen mislukt: ${error.message}`);
        }
    }
    
    async viewPhoto(fotoId) {
        try {
            const fotos = await this.db.getAllFotos();
            const foto = fotos.find(f => f.id === parseInt(fotoId));
            
            if (!foto) {
                this.showError('Foto niet gevonden');
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
                                    <i class="bi bi-image"></i> Foto Details
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
                                                    <p class="mt-3 text-muted">Geen afbeelding beschikbaar</p>
                                                </div>`
                                            }
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <h6 class="border-bottom pb-2">Foto Informatie</h6>
                                        <table class="table table-sm">
                                            <tr>
                                                <th style="width: 40%">Hond:</th>
                                                <td>${hond ? hond.naam : 'Onbekend'}</td>
                                            </tr>
                                            <tr>
                                                <th>Bestandsnaam:</th>
                                                <td><small>${foto.bestandsnaam}</small></td>
                                            </tr>
                                            <tr>
                                                <th>Grootte:</th>
                                                <td>${(foto.grootte / 1024).toFixed(1)} KB</td>
                                            </tr>
                                            <tr>
                                                <th>Type:</th>
                                                <td>${foto.type}</td>
                                            </tr>
                                            <tr>
                                                <th>Geüpload op:</th>
                                                <td>${new Date(foto.uploadDatum).toLocaleString('nl-NL')}</td>
                                            </tr>
                                            <tr>
                                                <th>Door:</th>
                                                <td>${foto.geuploadDoor || 'Onbekend'}</td>
                                            </tr>
                                        </table>
                                        
                                        ${foto.beschrijving ? `
                                        <h6 class="border-bottom pb-2 mt-3">Beschrijving</h6>
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
                                    <i class="bi bi-trash"></i> Verwijderen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Toon modal
            const container = document.getElementById('modalsContainer');
            container.insertAdjacentHTML('beforeend', html);
            
            const modalElement = document.getElementById('viewPhotoModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Voeg event listener voor verwijderen toe
            const deleteBtn = document.getElementById('deletePhotoFromViewBtn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async () => {
                    modal.hide();
                    await this.deletePhoto(foto.id);
                });
            }
            
            // Cleanup na sluiten
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
        } catch (error) {
            this.showError(`Fout bij laden foto details: ${error.message}`);
        }
    }
}