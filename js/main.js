/**
 * Hoofd initialisatie bestand voor Hondendatabase PWA
 * Registreer Service Worker en initialiseer applicatie
 */

// Wacht tot DOM volledig geladen is
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Hondendatabase PWA initialiseren...');
    
    // Controleer of we in een browser zijn die IndexedDB ondersteunt
    if (!window.indexedDB) {
        showBrowserError('Uw browser ondersteunt geen IndexedDB. Deze applicatie vereist een moderne browser zoals Chrome, Firefox of Edge.');
        return;
    }
    
    try {
        // Registreer Service Worker voor PWA functionaliteit
        await registerServiceWorker();
        
        // Start connectivity monitoring
        checkInternetConnection();
        
        // Setup PWA installatie
        setupPWAInstallation();
        
        // Initialiseer database en managers
        await initializeApplication();
        
        // Setup applicatie events
        setupApplicationEvents();
        
        // Toon welkomstbericht
        console.log('Hondendatabase PWA is klaar voor gebruik!');
        
        // Log app informatie
        showAppInfo();
        
    } catch (error) {
        console.error('Initialisatie mislukt:', error);
        showError('Fout bij initialiseren van de applicatie. Probeer de pagina te verversen.');
    }
});

/**
 * Initialiseer de hele applicatie
 */
async function initializeApplication() {
    console.log('Applicatie initialiseren...');
    
    try {
        // Controleer of database bestaat
        if (typeof db === 'undefined') {
            throw new Error('Database niet geladen. Controleer of database.js correct is ingeladen.');
        }
        
        // Initialiseer database
        await db.init();
        console.log('✅ Database geïnitialiseerd');
        
        // Controleer of BaseModule bestaat
        if (typeof BaseModule === 'undefined') {
            console.warn('BaseModule niet gevonden. Sommige functionaliteit werkt mogelijk niet.');
        }
        
        // Initialiseer auth manager als die er is
        if (typeof AuthManager !== 'undefined' && !window.auth) {
            window.auth = new AuthManager();
            await window.auth.init();
            console.log('✅ AuthManager geïnitialiseerd');
        }
        
        // Initialiseer managers in de juiste volgorde
        await initializeManagers();
        
        // Initialiseer UIHandler als die beschikbaar is
        if (typeof UIHandler !== 'undefined') {
            const uiHandler = new UIHandler();
            window.uiHandler = uiHandler;
            
            // Wacht even zodat DOM volledig geladen is
            setTimeout(() => {
                uiHandler.init();
                console.log('✅ UIHandler geïnitialiseerd');
            }, 100);
        } else {
            console.warn('⚠️ UIHandler niet beschikbaar. Basis UI functionaliteit wordt gebruikt.');
            setupBasicUI();
        }
        
    } catch (error) {
        console.error('Fout bij initialiseren applicatie:', error);
        throw error;
    }
}

/**
 * Initialiseer alle managers
 */
async function initializeManagers() {
    console.log('Initialiseren managers...');
    
    // Maak managers aan als de klassen beschikbaar zijn
    if (typeof DogManager !== 'undefined') {
        window.dogManager = new DogManager();
        console.log('✅ DogManager geïnitialiseerd');
    } else {
        console.warn('⚠️ DogManager niet beschikbaar');
    }
    
    if (typeof SearchManager !== 'undefined') {
        window.searchManager = new SearchManager();
        console.log('✅ SearchManager geïnitialiseerd');
    } else {
        console.warn('⚠️ SearchManager niet beschikbaar');
    }
    
    if (typeof PrivateInfoManager !== 'undefined') {
        window.privateInfoManager = new PrivateInfoManager();
        console.log('✅ PrivateInfoManager geïnitialiseerd');
    } else {
        console.warn('⚠️ PrivateInfoManager niet beschikbaar');
    }
    
    // Controleer of alle managers beschikbaar zijn
    if (!window.dogManager || !window.searchManager) {
        console.warn('⚠️ Niet alle managers zijn beschikbaar. Controleer of bestanden correct zijn ingeladen.');
    }
}

/**
 * Setup basis UI als UIHandler niet beschikbaar is
 */
function setupBasicUI() {
    console.log('Setup basis UI...');
    
    // Taal switcher
    const languageSwitcher = document.getElementById('languageSwitcher');
    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', function(e) {
            const selectedLang = e.target.value;
            localStorage.setItem('appLanguage', selectedLang);
            
            // Update managers
            if (window.dogManager) window.dogManager.updateLanguage(selectedLang);
            if (window.searchManager) window.searchManager.updateLanguage(selectedLang);
            if (window.privateInfoManager) window.privateInfoManager.updateLanguage(selectedLang);
            
            // Herlaad pagina
            window.location.reload();
        });
    }
    
    // Basis event delegation voor menu knoppen
    document.addEventListener('click', function(e) {
        // Hond toevoegen knop
        if (e.target.id === 'addDogBtn' || e.target.closest('#addDogBtn')) {
            e.preventDefault();
            showBasicAddDogModal();
        }
        
        // Hond zoeken knop
        if (e.target.id === 'searchDogBtn' || e.target.closest('#searchDogBtn')) {
            e.preventDefault();
            showBasicSearchModal();
        }
        
        // Privé info knop
        if (e.target.id === 'privateInfoBtn' || e.target.closest('#privateInfoBtn')) {
            e.preventDefault();
            showBasicPrivateInfoModal();
        }
    });
}

/**
 * Basis modal functies voor als UIHandler niet beschikbaar is
 */
function showBasicAddDogModal() {
    if (!window.dogManager) {
        showError('DogManager niet beschikbaar. Herlaad de pagina.');
        return;
    }
    
    // Verwijder bestaande modal
    const existingModal = document.getElementById('addDogModal');
    if (existingModal) existingModal.remove();
    
    // Genereer modal HTML
    const modalHTML = window.dogManager.getModalHTML();
    const modalsContainer = getModalsContainer();
    modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
    
    // Toon modal
    const modalElement = document.getElementById('addDogModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Setup events
        window.dogManager.setupEvents();
        
        // Cleanup
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
}

function showBasicSearchModal() {
    if (!window.searchManager) {
        showError('SearchManager niet beschikbaar. Herlaad de pagina.');
        return;
    }
    
    // Verwijder bestaande modal
    const existingModal = document.getElementById('searchModal');
    if (existingModal) existingModal.remove();
    
    // Genereer modal HTML
    const modalHTML = window.searchManager.getSearchModalHTML();
    const modalsContainer = getModalsContainer();
    modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
    
    // Toon modal
    const modalElement = document.getElementById('searchModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Setup events
        window.searchManager.setupSearchEvents();
        
        // Cleanup
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
}

function showBasicPrivateInfoModal() {
    if (!window.privateInfoManager) {
        showError('PrivateInfoManager niet beschikbaar. Herlaad de pagina.');
        return;
    }
    
    // Verwijder bestaande modal
    const existingModal = document.getElementById('privateInfoModal');
    if (existingModal) existingModal.remove();
    
    // Genereer modal HTML
    const modalHTML = window.privateInfoManager.getModalHTML();
    const modalsContainer = getModalsContainer();
    modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
    
    // Toon modal
    const modalElement = document.getElementById('privateInfoModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Setup events en laad data
        window.privateInfoManager.setupEvents();
        window.privateInfoManager.loadPrivateInfoData();
        
        // Cleanup
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
}

/**
 * Helper om modals container te krijgen
 */
function getModalsContainer() {
    let container = document.getElementById('modalsContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'modalsContainer';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Setup applicatie events
 */
function setupApplicationEvents() {
    console.log('Setup applicatie events...');
    
    // Laad dashboard bij start
    loadDashboard();
    
    // Hash change listener voor SPA navigatie
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial hash handling
    handleHashChange();
}

/**
 * Laad dashboard
 */
function loadDashboard() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="container-fluid mt-3">
                <h2><i class="bi bi-speedometer2"></i> Dashboard</h2>
                <div class="row mt-4">
                    <div class="col-md-4 mb-4">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="bi bi-plus-circle display-4 text-primary mb-3"></i>
                                <h5 class="card-title">Hond Toevoegen</h5>
                                <p class="card-text">Voeg een nieuwe hond toe aan de database</p>
                                <button class="btn btn-primary" id="addDogBtn">
                                    <i class="bi bi-plus-circle"></i> Toevoegen
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="bi bi-search display-4 text-info mb-3"></i>
                                <h5 class="card-title">Hond Zoeken</h5>
                                <p class="card-text">Zoek honden in de database</p>
                                <button class="btn btn-info" id="searchDogBtn">
                                    <i class="bi bi-search"></i> Zoeken
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="bi bi-lock display-4 text-dark mb-3"></i>
                                <h5 class="card-title">Privé Informatie</h5>
                                <p class="card-text">Vertrouwelijke informatie over honden</p>
                                <button class="btn btn-dark" id="privateInfoBtn">
                                    <i class="bi bi-lock"></i> Openen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Handle hash change voor SPA navigatie
 */
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    switch(hash) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'add-dog':
            if (window.uiHandler) {
                window.uiHandler.showAddDogModal();
            } else {
                showBasicAddDogModal();
            }
            break;
        case 'search-dog':
            if (window.uiHandler) {
                window.uiHandler.showSearchModal();
            } else {
                showBasicSearchModal();
            }
            break;
        case 'private-info':
            if (window.uiHandler) {
                window.uiHandler.showPrivateInfoModal();
            } else {
                showBasicPrivateInfoModal();
            }
            break;
        default:
            // Doe niets voor onbekende hash
            break;
    }
}

/**
 * Laad hoofdcontent (voor SearchManager terug knop)
 */
function loadMainContent() {
    window.location.hash = '#dashboard';
    loadDashboard();
}

// Exporteer loadMainContent voor SearchManager
window.loadMainContent = loadMainContent;

/**
 * Toon foutmelding in UI
 */
function showError(message) {
    const errorHTML = `
        <div class="alert alert-danger alert-dismissible fade show m-3" role="alert">
            <i class="bi bi-exclamation-octagon me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertAdjacentHTML('afterbegin', errorHTML);
}

/**
 * Toon succesmelding in UI
 */
function showSuccess(message) {
    const successHTML = `
        <div class="alert alert-success alert-dismissible fade show m-3" role="alert">
            <i class="bi bi-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertAdjacentHTML('afterbegin', successHTML);
}

/**
 * Registreer Service Worker voor offline functionaliteit
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // Verwijder eerst eventuele problematische service workers
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                if (registration.active?.scriptURL.includes('sw.js')) {
                    console.log('Bestaat al SW gevonden, controleren...');
                }
            }
            
            const registration = await navigator.serviceWorker.register('./sw.js', {
                scope: './',
                updateViaCache: 'none'
            });
            
            console.log('Service Worker geregistreerd met scope:', registration.scope);
            
            // Controleer op updates
            if (registration.waiting) {
                showUpdateNotification(registration);
            }
            
            // Luister voor updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('Nieuwe Service Worker wordt geïnstalleerd...');
                
                newWorker.addEventListener('statechange', () => {
                    console.log('Service Worker status:', newWorker.state);
                    
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification(registration);
                    }
                    
                    if (newWorker.state === 'activated') {
                        console.log('Nieuwe Service Worker geactiveerd');
                    }
                });
            });
            
            // Luister voor controller change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Nieuwe Service Worker heeft controle over pagina');
            });
            
            return registration;
            
        } catch (error) {
            console.error('Service Worker registratie mislukt:', error);
            
            if (error.message.includes('MIME type') || error.message.includes('script')) {
                console.warn('Service Worker MIME type probleem. Controleer server configuratie.');
            }
            
            return null;
        }
    } else {
        console.warn('Service Workers worden niet ondersteund door deze browser');
        return null;
    }
}

/**
 * Toon update notificatie en vraag om te herladen
 */
function showUpdateNotification(registration) {
    if (document.getElementById('updateNotification')) return;
    
    const notificationHTML = `
        <div id="updateNotification" class="alert alert-info alert-dismissible fade show m-3" role="alert">
            <div class="d-flex align-items-center">
                <i class="bi bi-arrow-clockwise me-3 fs-4"></i>
                <div class="flex-grow-1">
                    <strong>Nieuwe versie beschikbaar!</strong>
                    <p class="mb-0">Er is een nieuwe versie van de app beschikbaar.</p>
                </div>
                <div>
                    <button id="reloadPageBtn" class="btn btn-sm btn-outline-info me-2">
                        Nu bijwerken
                    </button>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </div>
        </div>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertAdjacentHTML('afterbegin', notificationHTML);
    
    document.getElementById('reloadPageBtn').addEventListener('click', () => {
        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        window.location.reload();
    });
    
    setTimeout(() => {
        const notif = document.getElementById('updateNotification');
        if (notif) {
            const bsAlert = new bootstrap.Alert(notif);
            bsAlert.close();
        }
    }, 30000);
}

/**
 * Toon browser compatibiliteit fout
 */
function showBrowserError(message) {
    const errorHTML = `
        <div class="container mt-5">
            <div class="alert alert-danger">
                <div class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle-fill me-3 fs-1"></i>
                    <div>
                        <h4 class="alert-heading">Browser Compatibiliteit</h4>
                        <p class="mb-3">${message}</p>
                        <div class="mb-3">
                            <strong>Ondersteunde browsers:</strong><br>
                            <div class="row mt-2">
                                <div class="col-md-6">
                                    <i class="bi bi-browser-chrome text-primary"></i> Chrome 54+<br>
                                    <i class="bi bi-browser-firefox text-warning"></i> Firefox 52+<br>
                                    <i class="bi bi-browser-edge text-primary"></i> Edge 79+
                                </div>
                                <div class="col-md-6">
                                    <i class="bi bi-browser-safari text-primary"></i> Safari 11.1+<br>
                                    <i class="bi bi-browser-opera text-danger"></i> Opera 41+<br>
                                    <i class="bi bi-phone"></i> Moderne mobiele browsers
                                </div>
                            </div>
                        </div>
                        <hr>
                        <p class="mb-0">
                            <small>
                                Probeer een andere browser of update uw huidige browser naar de laatste versie.
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.innerHTML = errorHTML;
}

/**
 * Controleer internet connectie
 */
function checkInternetConnection() {
    if (!navigator.onLine) {
        showOfflineNotification();
    }
    
    window.addEventListener('online', () => {
        console.log('Apparaat is weer online');
        showOnlineNotification();
        hideOfflineNotification();
    });
    
    window.addEventListener('offline', () => {
        console.log('Apparaat is offline');
        showOfflineNotification();
    });
}

/**
 * Toon offline notificatie
 */
function showOfflineNotification() {
    let notification = document.getElementById('offlineNotification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'offlineNotification';
        notification.className = 'alert alert-warning alert-dismissible fade show m-3';
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-wifi-off me-2 fs-5"></i>
                <div class="flex-grow-1">
                    <strong>Offline modus</strong>
                    <p class="mb-0">U werkt momenteel zonder internetverbinding. Sommige functies zijn mogelijk beperkt.</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const container = document.querySelector('.container') || document.body;
        container.insertAdjacentElement('afterbegin', notification);
    }
}

/**
 * Toon online notificatie
 */
function showOnlineNotification() {
    const notificationHTML = `
        <div id="onlineNotification" class="alert alert-success alert-dismissible fade show m-3">
            <div class="d-flex align-items-center">
                <i class="bi bi-wifi me-2 fs-5"></i>
                <div class="flex-grow-1">
                    <strong>Weer online!</strong>
                    <p class="mb-0">Uw internetverbinding is hersteld.</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </div>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertAdjacentHTML('afterbegin', notificationHTML);
    
    setTimeout(() => {
        const notif = document.getElementById('onlineNotification');
        if (notif) {
            const bsAlert = new bootstrap.Alert(notif);
            bsAlert.close();
        }
    }, 5000);
}

/**
 * Verberg offline notificatie
 */
function hideOfflineNotification() {
    const notification = document.getElementById('offlineNotification');
    if (notification) {
        const bsAlert = new bootstrap.Alert(notification);
        bsAlert.close();
    }
}

/**
 * Setup PWA installatie
 */
function setupPWAInstallation() {
    let deferredPrompt;
    let installBtn;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    window.addEventListener('appinstalled', (evt) => {
        console.log('PWA succesvol geïnstalleerd');
        if (installBtn) {
            installBtn.remove();
        }
        deferredPrompt = null;
    });
    
    function showInstallButton() {
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            console.log('App is al geïnstalleerd');
            return;
        }
        
        if (document.getElementById('installPWAButton')) {
            return;
        }
        
        installBtn = document.createElement('button');
        installBtn.id = 'installPWAButton';
        installBtn.className = 'btn btn-success btn-lg shadow position-fixed bottom-0 end-0 m-3';
        installBtn.innerHTML = '<i class="bi bi-download me-2"></i>Installeer App';
        installBtn.style.zIndex = '1050';
        installBtn.setAttribute('title', 'Installeer als app op je apparaat');
        
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            try {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Gebruiker keuze: ${outcome}`);
                
                if (outcome === 'accepted') {
                    console.log('Gebruiker heeft PWA geïnstalleerd');
                    installBtn.classList.remove('btn-success');
                    installBtn.classList.add('btn-secondary');
                    installBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Geïnstalleerd!';
                    installBtn.disabled = true;
                    
                    setTimeout(() => {
                        if (installBtn) installBtn.remove();
                    }, 3000);
                }
                
            } catch (error) {
                console.error('Installatie mislukt:', error);
                showError('Installatie mislukt. Probeer het opnieuw.');
            }
            
            deferredPrompt = null;
        });
        
        document.body.appendChild(installBtn);
        
        setTimeout(() => {
            if (installBtn && installBtn.parentNode) {
                installBtn.remove();
            }
        }, 24 * 60 * 60 * 1000);
    }
}

/**
 * Toon app informatie
 */
function showAppInfo() {
    const info = {
        name: 'Hondendatabase PWA',
        version: '1.0.0',
        author: 'Hondendatabase Team',
        description: 'Interactieve hondendatabase applicatie',
        features: [
            'Offline werking',
            '3 gescheiden databases',
            'Import/Export functionaliteit',
            'Admin en gebruiker rollen',
            'Responsive design'
        ],
        storage: {
            indexedDB: 'Ondersteund',
            serviceWorker: navigator.serviceWorker ? 'Ondersteund' : 'Niet ondersteund',
            localStorage: 'Ondersteund',
            online: navigator.onLine ? 'Online' : 'Offline'
        },
        managers: {
            dogManager: window.dogManager ? '✅ Geladen' : '❌ Niet geladen',
            searchManager: window.searchManager ? '✅ Geladen' : '❌ Niet geladen',
            privateInfoManager: window.privateInfoManager ? '✅ Geladen' : '❌ Niet geladen',
            uiHandler: window.uiHandler ? '✅ Geladen' : '❌ Niet geladen'
        }
    };
    
    console.group('App Informatie');
    console.table(info);
    console.groupEnd();
    
    if (window.location.hash === '#debug') {
        const debugInfo = document.createElement('div');
        debugInfo.className = 'card mt-3';
        debugInfo.innerHTML = `
            <div class="card-header">
                <h6 class="mb-0">Debug Informatie</h6>
            </div>
            <div class="card-body">
                <pre class="mb-0">${JSON.stringify(info, null, 2)}</pre>
            </div>
        `;
        document.body.appendChild(debugInfo);
    }
}

/**
 * Unregister alle Service Workers (voor debug/development)
 */
async function unregisterServiceWorkers() {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            await registration.unregister();
            console.log('Service Worker unregistered:', registration.scope);
        }
    }
}

// Exporteer functies voor gebruik in andere bestanden
export {
    registerServiceWorker,
    checkInternetConnection,
    setupPWAInstallation,
    showAppInfo,
    unregisterServiceWorkers
};

// ========== MODAL FIX VOOR ALLE MODALS ==========

(function() {
    console.log('Modal fix installeren...');
    
    document.addEventListener('DOMContentLoaded', function() {
        const checkBootstrap = setInterval(function() {
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                clearInterval(checkBootstrap);
                
                const originalHide = bootstrap.Modal.prototype.hide;
                bootstrap.Modal.prototype.hide = function() {
                    const modal = this._element;
                    
                    if (modal) {
                        const focused = modal.querySelector(':focus');
                        if (focused) {
                            focused.blur();
                        }
                        
                        document.body.focus();
                        modal.removeAttribute('aria-hidden');
                    }
                    
                    return originalHide.call(this);
                };
                
                console.log('✅ Modal fix geïnstalleerd voor alle modals');
            }
        }, 100);
    });
})();