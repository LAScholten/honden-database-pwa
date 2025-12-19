/**
 * Hoofd initialisatie bestand voor Hondendatabase
 * MET DEFINITIEVE MODAL FIX
 */

// EERSTE: Bootstrap Modal PATCH - moet voor ALLES
(function() {
    if (typeof bootstrap === 'undefined' || !bootstrap.Modal) return;
    
    console.log('Bootstrap Modal patch geïnstalleerd');
    
    // 1. Patch de _showElement methode
    const originalShowElement = bootstrap.Modal.prototype._showElement;
    bootstrap.Modal.prototype._showElement = function() {
        // Zet aria-hidden op false VOORDAT modal getoond wordt
        this._element.removeAttribute('aria-hidden');
        this._element.setAttribute('aria-modal', 'true');
        
        return originalShowElement.call(this);
    };
    
    // 2. Patch de hide methode
    const originalHide = bootstrap.Modal.prototype.hide;
    bootstrap.Modal.prototype.hide = function() {
        // Verwijder focus van ALLES in de modal
        if (this._element) {
            const focused = this._element.querySelector(':focus');
            if (focused) {
                focused.blur();
            }
            document.body.focus();
        }
        
        return originalHide.call(this);
    };
    
    // 3. Patch de _enforceFocus methode (dit zorgt voor focus problemen)
    const originalEnforceFocus = bootstrap.Modal.prototype._enforceFocus;
    bootstrap.Modal.prototype._enforceFocus = function() {
        // Alleen uitvoeren als modal echt getoond wordt
        if (this._element && this._element.classList.contains('show')) {
            return originalEnforceFocus.call(this);
        }
    };
})();

// Wacht tot DOM volledig geladen is
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hondendatabase initialiseren...');
    
    // INSTALLEER MODAL FIXES
    installModalFixes();
    
    // Controleer browser compatibiliteit
    if (!window.indexedDB) {
        showBrowserError('Uw browser ondersteunt geen IndexedDB. Deze applicatie vereist een moderne browser zoals Chrome, Firefox of Edge.');
        return;
    }
    
    // Start functionaliteit
    initApp();
});

/**
 * Installeer modal fixes
 */
function installModalFixes() {
    console.log('Installeer modal fixes');
    
    // 1. Verwijder aria-hidden van alle modals bij startup
    document.querySelectorAll('.modal').forEach(modal => {
        modal.removeAttribute('aria-hidden');
        modal.removeAttribute('tabindex');
        
        // Voeg data-bs-backdrop="static" toe om backdrop problemen te voorkomen
        if (!modal.hasAttribute('data-bs-backdrop')) {
            modal.setAttribute('data-bs-backdrop', 'static');
        }
    });
    
    // 2. Luister naar modal events
    document.addEventListener('show.bs.modal', function(event) {
        const modal = event.target;
        console.log('Modal wordt getoond:', modal.id);
        
        // Zet aria-hidden op false
        modal.removeAttribute('aria-hidden');
        modal.setAttribute('aria-modal', 'true');
    });
    
    document.addEventListener('shown.bs.modal', function(event) {
        const modal = event.target;
        console.log('Modal getoond:', modal.id);
        
        // Zorg dat focus niet op close button blijft
        setTimeout(() => {
            const closeBtn = modal.querySelector('.btn-close');
            if (closeBtn && document.activeElement === closeBtn) {
                closeBtn.blur();
                // Zet focus op eerste focusable element of modal zelf
                const firstInput = modal.querySelector('input, button, textarea, select');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        }, 100);
    });
    
    document.addEventListener('hide.bs.modal', function(event) {
        const modal = event.target;
        console.log('Modal wordt verborgen:', modal.id);
        
        // Verwijder focus
        const focused = modal.querySelector(':focus');
        if (focused) {
            focused.blur();
        }
    });
    
    document.addEventListener('hidden.bs.modal', function(event) {
        const modal = event.target;
        console.log('Modal verborgen:', modal.id);
        
        // Zet aria-hidden pas NA verbergen
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                modal.setAttribute('aria-hidden', 'true');
                modal.removeAttribute('aria-modal');
            }
        }, 50);
        
        // CLEANUP: Verwijder overbodige backdrops
        cleanupModalBackdrops();
    });
    
    // 3. Voeg emergency cleanup knop toe
    addEmergencyButton();
}

/**
 * Cleanup modal backdrops
 */
function cleanupModalBackdrops() {
    setTimeout(() => {
        const openModals = document.querySelectorAll('.modal.show');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        
        console.log(`Cleanup: ${openModals.length} modals open, ${backdrops.length} backdrops`);
        
        // Verwijder backdrops als er geen modals open zijn
        if (openModals.length === 0 && backdrops.length > 0) {
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
            
            // Reset body styles
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        
        // Verwijder extra backdrops
        if (backdrops.length > openModals.length) {
            const extras = backdrops.length - openModals.length;
            for (let i = 0; i < extras; i++) {
                if (backdrops[i]) {
                    backdrops[i].remove();
                }
            }
        }
    }, 100);
}

/**
 * Voeg emergency button toe
 */
function addEmergencyButton() {
    const btn = document.createElement('button');
    btn.id = 'emergencyFixBtn';
    btn.innerHTML = '🚨 Fix';
    btn.title = 'Klik als scherm vastzit';
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 99999;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 8px 15px;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: none;
        font-weight: bold;
    `;
    
    btn.addEventListener('click', function() {
        console.log('EMERGENCY FIX geactiveerd');
        
        // 1. Verwijder alle backdrops
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.remove();
        });
        
        // 2. Sluit alle modals
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
            
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
        
        // 3. Reset body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // 4. Forceer reflow
        document.body.offsetHeight;
        
        alert('Emergency fix uitgevoerd! Scherm zou nu moeten werken.');
    });
    
    document.body.appendChild(btn);
    
    // Toon knop als er modals open zijn
    setInterval(() => {
        const hasModals = document.querySelectorAll('.modal.show').length > 0;
        btn.style.display = hasModals ? 'block' : 'none';
    }, 500);
}

/**
 * Initialiseer app
 */
function initApp() {
    try {
        checkInternetConnection();
        setupPWAInstallation();
        console.log('Hondendatabase is klaar voor gebruik!');
    } catch (error) {
        console.error('Initialisatie mislukt:', error);
        showError('Fout bij initialiseren van de applicatie. Probeer de pagina te verversen.');
    }
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
    const notification = document.createElement('div');
    notification.id = 'offlineNotification';
    notification.className = 'alert alert-warning alert-dismissible fade show m-3';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-wifi-off me-2"></i>
            <div class="flex-grow-1">
                <strong>Offline modus</strong>
                <p class="mb-0">U werkt zonder internetverbinding.</p>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertAdjacentElement('afterbegin', notification);
}

/**
 * Toon online notificatie
 */
function showOnlineNotification() {
    const notificationHTML = `
        <div id="onlineNotification" class="alert alert-success alert-dismissible fade show m-3">
            <div class="d-flex align-items-center">
                <i class="bi bi-wifi me-2"></i>
                <div class="flex-grow-1">
                    <strong>Weer online!</strong>
                    <p class="mb-0">Internetverbinding hersteld.</p>
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

/**
 * Toon browser fout
 */
function showBrowserError(message) {
    const errorHTML = `
        <div class="container mt-5">
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ${message}
            </div>
        </div>
    `;
    
    document.body.innerHTML = errorHTML;
}

/**
 * Toon algemene fout
 */
function showError(message) {
    const errorHTML = `
        <div class="alert alert-danger alert-dismissible fade show m-3">
            <i class="bi bi-exclamation-octagon me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertAdjacentHTML('afterbegin', errorHTML);
}

// CLEANUP: Verwijder Service Workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
            registration.unregister();
            console.log('Service Worker verwijderd');
        });
    });
}

// Export
export {
    checkInternetConnection,
    setupPWAInstallation
};