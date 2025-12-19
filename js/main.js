/**
 * EMERGENCY FIX VOOR BOOTSTRAP MODAL ARIA-HIDDEN PROBLEEM
 * Deze fix moet als ALLEREERSTE uitgevoerd worden
 */

// 1. Patch Bootstrap Modal _showElement() methode
if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    const originalShowElement = bootstrap.Modal.prototype._showElement;
    bootstrap.Modal.prototype._showElement = function() {
        // Roep originele functie aan
        originalShowElement.call(this);
        
        // Verwijder aria-hidden attribute direct na show
        setTimeout(() => {
            if (this._element && this._element.classList.contains('show')) {
                this._element.removeAttribute('aria-hidden');
            }
        }, 10);
    };
}

// 2. Patch Bootstrap Modal hide() methode
if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    const originalHide = bootstrap.Modal.prototype.hide;
    bootstrap.Modal.prototype.hide = function() {
        // Verwijder focus van ALLE elementen in modal
        if (this._element) {
            const focusedElement = this._element.querySelector(':focus');
            if (focusedElement) {
                focusedElement.blur();
            }
            
            // Forceer focus op body
            document.body.focus();
            
            // Zet aria-hidden pas na hide
            setTimeout(() => {
                if (this._element && !this._element.classList.contains('show')) {
                    this._element.setAttribute('aria-hidden', 'true');
                }
            }, 100);
        }
        
        return originalHide.call(this);
    };
}

/**
 * Hoofd initialisatie bestand voor Hondendatabase
 * ZONDER Service Worker
 */

// Wacht tot DOM volledig geladen is
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Hondendatabase initialiseren...');
    
    // FIX VOOR MODAL PROBLEEM - moet als eerste!
    installModalFixes();
    
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
 * COMPLETE FIX voor Bootstrap modal problemen
 */
function installModalFixes() {
    console.log('Modal fixes geïnstalleerd');
    
    // 1. Fix voor alle bestaande modals op de pagina
    document.querySelectorAll('.modal').forEach(modal => {
        // Verwijder problematische attributes
        modal.removeAttribute('tabindex');
        modal.removeAttribute('aria-hidden');
        
        // Voeg inert attribute toe (modern alternatief)
        if ('inert' in HTMLElement.prototype) {
            modal.inert = true;
        }
    });
    
    // 2. Patch voor modal show events
    document.addEventListener('show.bs.modal', function(event) {
        const modal = event.target;
        // Verwijder aria-hidden wanneer modal getoond wordt
        modal.removeAttribute('aria-hidden');
        
        // Verwijder inert wanneer modal getoond wordt
        if ('inert' in HTMLElement.prototype) {
            modal.inert = false;
        }
    });
    
    document.addEventListener('shown.bs.modal', function(event) {
        const modal = event.target;
        // Zorg dat focus niet op close button blijft
        setTimeout(() => {
            const closeBtn = modal.querySelector('.btn-close');
            if (closeBtn && document.activeElement === closeBtn) {
                closeBtn.blur();
            }
        }, 50);
    });
    
    document.addEventListener('hide.bs.modal', function(event) {
        const modal = event.target;
        // Verwijder focus van modal elementen
        const focused = modal.querySelector(':focus');
        if (focused) {
            focused.blur();
        }
        
        // Zet inert terug
        if ('inert' in HTMLElement.prototype) {
            modal.inert = true;
        }
    });
    
    document.addEventListener('hidden.bs.modal', function(event) {
        const modal = event.target;
        
        // Zet aria-hidden="true" alleen als modal echt verborgen is
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                modal.setAttribute('aria-hidden', 'true');
            }
        }, 10);
        
        // Cleanup backdrops en body classes
        cleanupModalBackdrops();
    });
    
    // 3. Noodknop voor emergency cleanup
    addEmergencyCleanupButton();
}

/**
 * Cleanup modal backdrops en body classes
 */
function cleanupModalBackdrops() {
    const openModals = document.querySelectorAll('.modal.show');
    const backdrops = document.querySelectorAll('.modal-backdrop');
    
    if (openModals.length === 0 && backdrops.length > 0) {
        // Verwijder alle backdrops
        backdrops.forEach(backdrop => {
            backdrop.remove();
        });
        
        // Reset body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    } else if (backdrops.length > openModals.length) {
        // Verwijder extra backdrops
        const extras = backdrops.length - openModals.length;
        for (let i = 0; i < extras; i++) {
            if (backdrops[i]) {
                backdrops[i].remove();
            }
        }
    }
}

/**
 * Noodknop voor emergency modal cleanup
 */
function addEmergencyCleanupButton() {
    const btn = document.createElement('button');
    btn.id = 'emergencyModalFix';
    btn.innerHTML = '🔄 Fix Screen';
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: none;
    `;
    
    btn.addEventListener('click', emergencyModalCleanup);
    document.body.appendChild(btn);
    
    // Toon knop als er modals open zijn
    setInterval(() => {
        const hasOpenModals = document.querySelectorAll('.modal.show').length > 0;
        btn.style.display = hasOpenModals ? 'block' : 'none';
    }, 1000);
}

/**
 * Emergency modal cleanup
 */
function emergencyModalCleanup() {
    console.log('Emergency modal cleanup uitgevoerd');
    
    // 1. Verwijder focus van alles
    document.activeElement.blur();
    document.body.focus();
    
    // 2. Sluit alle modals
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
            bsModal.hide();
        } else {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    });
    
    // 3. Forceer cleanup
    setTimeout(() => {
        // Verwijder alle backdrops
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.remove();
        });
        
        // Reset body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Verwijder aria-hidden van alle modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.removeAttribute('aria-hidden');
        });
        
        console.log('Emergency cleanup voltooid');
    }, 150);
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