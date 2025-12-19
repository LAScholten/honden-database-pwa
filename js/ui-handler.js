/**
 * UI Handler - Werkende versie
 */

class UIHandler {
    constructor() {
        console.log('UIHandler gestart');
        this.currentModal = null;
        this.init();
    }
    
    async init() {
        try {
            // Check auth
            if (!window.auth || !window.auth.isAuthenticated()) {
                window.location.href = 'index.html';
                return;
            }
            
            // Init database
            if (!window.db && window.HondenDatabase) {
                window.db = new HondenDatabase();
                await window.db.init();
            }
            
            // Setup UI
            this.setupButtons();
            this.updateWelcomeMessage();
            this.loadStats();
            
        } catch (error) {
            console.error('Init error:', error);
        }
    }
    
    setupButtons() {
        // Button configuration
        const buttons = [
            { id: 'dataManagementBtn', modal: 'data', admin: true },
            { id: 'addDogBtn', modal: 'dog', admin: true },
            { id: 'searchBtn', modal: 'search', admin: false },
            { id: 'photoGalleryBtn', modal: 'photo', admin: false },
            { id: 'breedingPlanBtn', modal: 'breeding', admin: true },
            { id: 'privateInfoBtn', modal: 'private', admin: true }
        ];
        
        buttons.forEach(btn => {
            const element = document.getElementById(btn.id);
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    if (btn.admin && !window.auth.isAdmin()) {
                        alert('Alleen administrators hebben toegang');
                        return;
                    }
                    
                    this.openModal(btn.modal);
                });
            }
        });
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.auth.logout();
            });
        }
    }
    
    openModal(type) {
        console.log(`Open modal: ${type}`);
        
        // Close current modal
        this.closeModal();
        
        // Get modal HTML based on type
        let html = '';
        let modalId = '';
        
        if (type === 'search') {
            html = this.getSearchModalHTML();
            modalId = 'searchModal';
        } else {
            html = this.getBasicModalHTML(type);
            modalId = type + 'Modal';
        }
        
        // Inject modal
        const container = document.getElementById('modalsContainer');
        if (container) {
            container.innerHTML = html;
            
            // Show modal
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                this.currentModal = modal;
                
                // Setup search events if needed
                if (type === 'search') {
                    this.setupSearchEvents();
                }
            }
        }
    }
    
    getSearchModalHTML() {
        return `
            <div class="modal fade" id="searchModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title"><i class="bi bi-search"></i> Hond Zoeken</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label>Zoek op naam:</label>
                                <input type="text" class="form-control" id="searchInput" placeholder="Bijv. 'Max' of 'Bella'">
                            </div>
                            <button class="btn btn-info w-100 mb-4" id="searchButton">
                                <i class="bi bi-search"></i> Zoeken
                            </button>
                            <div id="searchResults">
                                <div class="text-center text-muted py-4">
                                    <i class="bi bi-search display-6"></i>
                                    <p class="mt-2">Voer een zoekterm in</p>
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
    
    setupSearchEvents() {
        const searchBtn = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', async () => {
                const term = searchInput.value.trim();
                if (!term) {
                    alert('Voer een zoekterm in');
                    return;
                }
                
                await this.performSearch(term);
            });
        }
    }
    
    async performSearch(term) {
        try {
            if (!window.db) return;
            
            const allDogs = await window.db.getHonden();
            const results = allDogs.filter(dog => 
                dog.naam && dog.naam.toLowerCase().includes(term.toLowerCase())
            );
            
            this.displaySearchResults(results);
            
        } catch (error) {
            console.error('Search error:', error);
            alert('Zoeken mislukt');
        }
    }
    
    displaySearchResults(results) {
        const container = document.getElementById('searchResults');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    Geen honden gevonden met deze zoekterm.
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="card">
                <div class="card-header">
                    <strong>${results.length} hond(en) gevonden:</strong>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Naam</th>
                                    <th>Stamboomnr</th>
                                    <th>Ras</th>
                                    <th>Acties</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        results.forEach(dog => {
            html += `
                <tr>
                    <td>${dog.naam || '-'}</td>
                    <td><code>${dog.stamboomnr || '-'}</code></td>
                    <td>${dog.ras || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info view-dog-btn" data-id="${dog.id}">
                            <i class="bi bi-eye"></i>
                        </button>
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
    }
    
    getBasicModalHTML(name) {
        return `
            <div class="modal fade" id="${name}Modal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Deze functionaliteit wordt momenteel geladen...</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    closeModal() {
        if (this.currentModal) {
            this.currentModal.hide();
            this.currentModal = null;
        }
    }
    
    updateWelcomeMessage() {
        const user = window.auth.getCurrentUser();
        if (user) {
            const welcomeElement = document.getElementById('welcomeMessage');
            if (welcomeElement) {
                const roleText = user.role === 'admin' ? 'Administrator' : 'Gebruiker';
                welcomeElement.textContent = `Welkom, ${user.username} (${roleText})`;
            }
        }
    }
    
    async loadStats() {
        try {
            if (!window.db) return;
            
            const stats = await window.db.getStatistieken();
            document.getElementById('quickStatsHonden').textContent = stats.totaalHonden;
            document.getElementById('quickStatsFotos').textContent = stats.totaalFotos;
            
        } catch (error) {
            console.error('Stats error:', error);
        }
    }
}

// Start UIHandler
document.addEventListener('DOMContentLoaded', function() {
    if (!window.auth || !window.auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    window.uiHandler = new UIHandler();
});