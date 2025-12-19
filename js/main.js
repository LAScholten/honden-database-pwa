/**
 * Hoofd initialisatie bestand voor Hondendatabase
 * ZONDER Service Worker
 */

// Wacht tot DOM volledig geladen is
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Hondendatabase initialiseren...');
    
    // FIX VOOR MODAL PROBLEEM - moet als eerste!
    fixModalIssues();
    
    // Controleer of we in een browser zijn die IndexedDB ondersteunt
    if (!window.indexedDB) {
        showBrowserError('Uw browser ondersteunt geen IndexedDB. Deze applicatie vereist een moderne browser zoals Chrome, Firefox of Edge.');
        return;
    }
    
    try {
        // Start connectivity monitoring
        checkInternetConnection();
        
        // Setup PWA installatie
        setupPWAInstallation();
        
        // Toon welkomstbericht
        console.log('Hondendatabase is klaar voor gebruik!');
        
    } catch (error) {
        console.error('Initialisatie mislukt:', error);
        showError('Fout bij initialiseren van de applicatie. Probeer de pagina te verversen.');
    }
});

/**
 * FIX voor Bootstrap modal problemen (scherm donker en vast)
 */
function fixModalIssues() {
    console.log('Modal fixes geïnstalleerd');
    
    // 1. Luister naar modal sluiting
    document.addEventListener('hidden.bs.modal', function(event) {
        console.log('Modal gesloten:', event.target.id);
        
        // Verwijder alle backdrops behalve de laatste als er meerdere modals zijn
        const backdrops = document.querySelectorAll('.modal-backdrop');
        const openModals = document.querySelectorAll('.modal.show');
        
        if (openModals.length === 0 && backdrops.length > 0) {
            // Laatste backdrop verwijderen
            backdrops[backdrops.length - 1].remove();
            
            // Body classes resetten
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    });
    
    // 2. Forceer cleanup als er iets misgaat
    document.addEventListener('keydown', function(event) {
        // Ctrl+Shift+M voor emergency modal cleanup
        if (event.ctrlKey && event.shiftKey && event.key === 'M') {
            emergencyModalCleanup();
        }
    });
    
    // 3. Zorg dat modals goed sluiten bij page unload
    window.addEventListener('beforeunload', function() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
        });
    });
}

/**
 * Noodoplossing voor vastzittende modals
 */
function emergencyModalCleanup() {
    console.log('Emergency modal cleanup uitgevoerd');
    
    // 1. Verberg alle modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
    
    // 2. Verwijder alle backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
        backdrop.remove();
    });
    
    // 3. Reset body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    alert('Modals zijn gefixt. Scherm zou nu normaal moeten werken.');
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
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.innerHTML = errorHTML;
}

/**
 * Toon algemene foutmelding
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
                    <p class="mb-0">U werkt momenteel zonder internetverbinding.</p>
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
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('PWA geïnstalleerd');
        const installBtn = document.getElementById('installPWAButton');
        if (installBtn) installBtn.remove();
        deferredPrompt = null;
    });
    
    function showInstallButton() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }
        
        if (document.getElementById('installPWAButton')) {
            return;
        }
        
        const installBtn = document.createElement('button');
        installBtn.id = 'installPWAButton';
        installBtn.className = 'btn btn-success position-fixed bottom-0 end-0 m-3';
        installBtn.innerHTML = '<i class="bi bi-download"></i> Installeer App';
        installBtn.style.zIndex = '1000';
        
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                installBtn.innerHTML = '<i class="bi bi-check"></i> Geïnstalleerd!';
                installBtn.disabled = true;
            }
            
            deferredPrompt = null;
        });
        
        document.body.appendChild(installBtn);
    }
}

// CLEANUP: Verwijder alle Service Workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
            registration.unregister();
            console.log('Service Worker verwijderd');
        });
    });
}

// Exporteer functies
export {
    checkInternetConnection,
    setupPWAInstallation,
    emergencyModalCleanup
};