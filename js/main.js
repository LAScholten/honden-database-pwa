/**
 * HOOFD INITIALISATIE - MET DEFINITIEVE MODAL FIX
 */

// ========== DEEL 1: SERVICE WORKER CLEANUP ==========
(function cleanupServiceWorkers() {
    console.log('Service Worker cleanup...');
    
    if ('serviceWorker' in navigator) {
        // 1. Verwijder alle registraties
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                console.log('Unregister SW:', registration.scope);
                registration.unregister();
            });
            
            // 2. Herlaad als er SWs waren
            if (registrations.length > 0) {
                console.log('Herladen na SW cleanup');
                setTimeout(() => {
                    window.location.search = '?nocache=' + Date.now();
                }, 100);
            }
        }).catch(err => {
            console.warn('SW cleanup error:', err);
        });
        
        // 3. Block toekomstige registraties
        const originalRegister = navigator.serviceWorker.register;
        navigator.serviceWorker.register = function() {
            console.log('SW registratie geblokkeerd');
            return Promise.reject(new Error('Service Workers zijn uitgeschakeld'));
        };
    }
})();

// ========== DEEL 2: BOOTSTRAP MODAL PATCH ==========
(function patchBootstrapModals() {
    if (typeof bootstrap === 'undefined' || !bootstrap.Modal) return;
    
    console.log('Bootstrap Modal patch geïnstalleerd');
    
    // PATCH 1: Verwijder aria-hidden van ALLE modals bij aanmaak
    const Modal = bootstrap.Modal;
    const originalConstructor = Modal;
    
    // PATCH 2: Fix voor modal show
    Modal.prototype._showElement = (function(original) {
        return function() {
            // Verwijder aria-hidden VOORDAT modal getoond wordt
            this._element.removeAttribute('aria-hidden');
            this._element.setAttribute('aria-modal', 'true');
            
            // Verwijder tabindex (veroorzaakt focus problemen)
            this._element.removeAttribute('tabindex');
            
            return original.apply(this, arguments);
        };
    })(Modal.prototype._showElement);
    
    // PATCH 3: Fix voor modal hide
    Modal.prototype.hide = (function(original) {
        return function() {
            // 1. Verwijder focus van ALLE elementen
            if (this._element) {
                const focused = this._element.querySelector(':focus');
                if (focused) {
                    focused.blur();
                }
                document.body.focus();
            }
            
            // 2. Roep originele hide aan
            const result = original.apply(this, arguments);
            
            // 3. Zet aria-hidden pas NA hide
            setTimeout(() => {
                if (this._element && !this._element.classList.contains('show')) {
                    this._element.setAttribute('aria-hidden', 'true');
                    this._element.removeAttribute('aria-modal');
                }
            }, 100);
            
            return result;
        };
    })(Modal.prototype.hide);
    
    // PATCH 4: Fix focus trapping
    Modal.prototype._enforceFocus = (function(original) {
        return function() {
            try {
                return original.apply(this, arguments);
            } catch (e) {
                console.warn('Focus enforcement error:', e);
            }
        };
    })(Modal.prototype._enforceFocus);
})();

// ========== DEEL 3: DOM INITIALISATIE ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM geladen - initialiseren');
    
    // FASE 1: Fix ALLE modals op de pagina
    fixAllModals();
    
    // FASE 2: Voeg event listeners toe
    setupModalEventListeners();
    
    // FASE 3: Voeg emergency button toe
    addEmergencyFixButton();
    
    // FASE 4: Init andere functionaliteit
    initAppFunctionality();
});

/**
 * FIX ALLE MODALS OP DE PAGINA
 */
function fixAllModals() {
    console.log('Alle modals fixen...');
    
    const modals = document.querySelectorAll('.modal');
    console.log(`Gevonden ${modals.length} modals`);
    
    modals.forEach((modal, index) => {
        const modalId = modal.id || `modal-${index}`;
        console.log(`Fix modal: ${modalId}`);
        
        // 1. Verwijder problematische attributes
        modal.removeAttribute('aria-hidden');
        modal.removeAttribute('tabindex');
        
        // 2. Zet correcte attributes
        modal.setAttribute('aria-modal', 'false');
        
        // 3. Voeg inert attribute toe indien ondersteund
        if ('inert' in HTMLElement.prototype) {
            modal.inert = true;
        }
        
        // 4. Voeg data-bs-backdrop="static" toe als die niet bestaat
        if (!modal.hasAttribute('data-bs-backdrop')) {
            modal.setAttribute('data-bs-backdrop', 'static');
        }
        
        // 5. Patch de close buttons
        const closeButtons = modal.querySelectorAll('.btn-close, [data-bs-dismiss="modal"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Verwijder focus van deze knop
                setTimeout(() => {
                    if (document.activeElement === this) {
                        this.blur();
                        document.body.focus();
                    }
                }, 50);
            });
        });
    });
}

/**
 * SETUP MODAL EVENT LISTENERS
 */
function setupModalEventListeners() {
    // SHOW: Wanneer modal getoond wordt
    document.addEventListener('show.bs.modal', function(event) {
        const modal = event.target;
        console.log(`Modal show: ${modal.id}`);
        
        // Zet correcte attributes
        modal.removeAttribute('aria-hidden');
        modal.setAttribute('aria-modal', 'true');
        
        if ('inert' in HTMLElement.prototype) {
            modal.inert = false;
        }
    });
    
    // SHOWN: Wanneer modal volledig getoond is
    document.addEventListener('shown.bs.modal', function(event) {
        const modal = event.target;
        console.log(`Modal shown: ${modal.id}`);
        
        // Focus management: focus op modal, niet op close button
        setTimeout(() => {
            const closeBtn = modal.querySelector('.btn-close');
            if (closeBtn && document.activeElement === closeBtn) {
                closeBtn.blur();
                
                // Probeer eerste input te vinden, anders modal zelf
                const firstInput = modal.querySelector('input, button:not(.btn-close), textarea, select');
                if (firstInput) {
                    firstInput.focus();
                } else {
                    modal.focus();
                }
            }
        }, 150);
    });
    
    // HIDE: Wanneer modal verborgen wordt
    document.addEventListener('hide.bs.modal', function(event) {
        const modal = event.target;
        console.log(`Modal hide: ${modal.id}`);
        
        // Verwijder focus
        const focused = modal.querySelector(':focus');
        if (focused) {
            focused.blur();
        }
        document.body.focus();
    });
    
    // HIDDEN: Wanneer modal volledig verborgen is
    document.addEventListener('hidden.bs.modal', function(event) {
        const modal = event.target;
        console.log(`Modal hidden: ${modal.id}`);
        
        // Zet aria-hidden na verbergen
        setTimeout(() => {
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('aria-modal', 'false');
            
            if ('inert' in HTMLElement.prototype) {
                modal.inert = true;
            }
        }, 50);
        
        // Cleanup backdrops
        cleanupBackdrops();
    });
}

/**
 * CLEANUP BACKDROPS
 */
function cleanupBackdrops() {
    setTimeout(() => {
        const openModals = document.querySelectorAll('.modal.show');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        
        // Verwijder backdrops als er geen modals open zijn
        if (openModals.length === 0) {
            backdrops.forEach(backdrop => backdrop.remove());
            resetBodyStyles();
        }
        // Verwijder extra backdrops
        else if (backdrops.length > openModals.length) {
            const extraCount = backdrops.length - openModals.length;
            for (let i = 0; i < extraCount && i < backdrops.length; i++) {
                backdrops[i].remove();
            }
        }
    }, 100);
}

/**
 * RESET BODY STYLES
 */
function resetBodyStyles() {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

/**
 * ADD EMERGENCY FIX BUTTON
 */
function addEmergencyFixButton() {
    // Verwijder bestaande button
    const existingBtn = document.getElementById('globalEmergencyFix');
    if (existingBtn) existingBtn.remove();
    
    // Maak nieuwe button
    const btn = document.createElement('button');
    btn.id = 'globalEmergencyFix';
    btn.innerHTML = '🚨 FIX ALL';
    btn.title = 'Klik als modals vastzitten';
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 99999;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 3px 15px rgba(0,0,0,0.3);
        display: none;
        transition: all 0.3s;
    `;
    
    btn.addEventListener('click', function() {
        console.log('GLOBAL EMERGENCY FIX geactiveerd');
        
        // 1. Verwijder alle backdrops
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        
        // 2. Sluit alle modals
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                try { bsModal.hide(); } catch(e) {}
            }
        });
        
        // 3. Reset body
        resetBodyStyles();
        
        // 4. Forceer reflow
        document.body.offsetHeight;
        
        console.log('Global fix uitgevoerd');
        btn.style.display = 'none';
    });
    
    document.body.appendChild(btn);
    
    // Update button visibility
    setInterval(() => {
        const hasOpenModals = document.querySelectorAll('.modal.show').length > 0;
        btn.style.display = hasOpenModals ? 'block' : 'none';
    }, 500);
}

/**
 * INIT APP FUNCTIONALITY
 */
function initAppFunctionality() {
    console.log('App functionaliteit initialiseren');
    
    // Check internet
    if (!navigator.onLine) {
        showOfflineNotification();
    }
    
    // Event listeners voor online/offline
    window.addEventListener('online', () => {
        console.log('Online');
        showOnlineNotification();
    });
    
    window.addEventListener('offline', () => {
        console.log('Offline');
        showOfflineNotification();
    });
    
    // PWA installatie
    setupPWAInstallation();
    
    console.log('App klaar voor gebruik');
}

/**
 * OFFLINE/ONLINE NOTIFICATIES
 */
function showOfflineNotification() {
    const html = `
        <div class="alert alert-warning alert-dismissible fade show m-3">
            <i class="bi bi-wifi-off me-2"></i>
            <strong>Offline</strong> - U werkt zonder internet
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', html);
}

function showOnlineNotification() {
    const html = `
        <div class="alert alert-success alert-dismissible fade show m-3">
            <i class="bi bi-wifi me-2"></i>
            <strong>Online</strong> - Verbinding hersteld
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', html);
    
    setTimeout(() => {
        const alert = document.querySelector('.alert-success');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 3000);
}

/**
 * PWA INSTALLATIE
 */
function setupPWAInstallation() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    function showInstallButton() {
        if (window.matchMedia('(display-mode: standalone)').matches) return;
        if (document.getElementById('installBtn')) return;
        
        const btn = document.createElement('button');
        btn.id = 'installBtn';
        btn.className = 'btn btn-success position-fixed bottom-0 end-0 m-3';
        btn.innerHTML = '<i class="bi bi-download"></i> Installeer App';
        btn.style.zIndex = '1000';
        
        btn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                btn.innerHTML = '<i class="bi bi-check"></i> Geïnstalleerd!';
                btn.disabled = true;
            }
            
            deferredPrompt = null;
        });
        
        document.body.appendChild(btn);
    }
}

// Export (optioneel)
export { addEmergencyFixButton, cleanupBackdrops };