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
        const registration = await registerServiceWorker();
        
        // Start connectivity monitoring
        checkInternetConnection();
        
        // Setup PWA installatie
        setupPWAInstallation();
        
        // Toon welkomstbericht
        console.log('Hondendatabase PWA is klaar voor gebruik!');
        
        // Log app informatie
        showAppInfo();
        
        // CHECK OP UPDATE BIJ START
        if (registration && registration.waiting) {
            console.log('Update beschikbaar bij start');
            setTimeout(() => showBackupWarningNotification(registration), 2000);
        }
        
    } catch (error) {
        console.error('Initialisatie mislukt:', error);
        showError('Fout bij initialiseren van de applicatie. Probeer de pagina te verversen.');
    }
});

/**
 * Registreer Service Worker voor offline functionaliteit
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js', {
                scope: './',
                updateViaCache: 'none'
            });
            
            console.log('Service Worker geregistreerd met scope:', registration.scope);
            
            // CHECK OP WACHTENDE UPDATE
            if (registration.waiting) {
                return registration;
            }
            
            // LUISTER VOOR UPDATE
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('Nieuwe update beschikbaar');
                        showBackupWarningNotification(registration);
                    }
                    
                    if (newWorker.state === 'activated') {
                        console.log('Nieuwe Service Worker geactiveerd');
                    }
                });
            });
            
            return registration;
            
        } catch (error) {
            console.error('Service Worker registratie mislukt:', error);
            return null;
        }
    } else {
        console.warn('Service Workers worden niet ondersteund door deze browser');
        return null;
    }
}

/**
 * Toon BACKUP WAARSCHUWING voordat update wordt uitgevoerd
 */
function showBackupWarningNotification(registration) {
    // Controleer of we al een notificatie hebben
    if (document.getElementById('backupWarningNotification')) return;
    
    console.log('Toon backup waarschuwing banner');
    
    const notificationHTML = `
        <div id="backupWarningNotification" class="alert alert-warning alert-dismissible fade show m-3" role="alert" style="z-index: 9999;">
            <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill me-3 fs-4 text-danger"></i>
                <div class="flex-grow-1">
                    <strong class="text-danger">UPDATE BESCHIKBAAR - MAAK EERST BACKUP!</strong>
                    <p class="mb-1">Er is een nieuwe versie van de app beschikbaar.</p>
                    <p class="mb-2"><strong>Belangrijk:</strong> Maak eerst een backup van uw gegevens voordat u update!</p>
                    <div class="mt-2">
                        <button id="goToBackupBtn" class="btn btn-sm btn-outline-danger me-2">
                            <i class="bi bi-download me-1"></i>Maak Backup
                        </button>
                        <button id="updateNowBtn" class="btn btn-sm btn-success me-2">
                            <i class="bi bi-arrow-clockwise me-1"></i>Nu Updaten
                        </button>
                        <button id="laterBtn" class="btn btn-sm btn-secondary">
                            <i class="bi bi-clock me-1"></i>Later
                        </button>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </div>
    `;
    
    // Voeg notificatie toe bovenaan de pagina
    const container = document.querySelector('.container') || document.body;
    container.insertAdjacentHTML('afterbegin', notificationHTML);
    
    // Setup knoppen
    document.getElementById('goToBackupBtn').addEventListener('click', () => {
        // Navigeer naar backup functie
        if (window.uiHandler && window.uiHandler.showModal) {
            window.uiHandler.showModal('data');
        }
        hideBackupWarning();
    });
    
    document.getElementById('updateNowBtn').addEventListener('click', () => {
        console.log('Start update proces');
        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            // Wacht even en herlaad
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    });
    
    document.getElementById('laterBtn').addEventListener('click', hideBackupWarning);
}

/**
 * Verberg backup waarschuwing
 */
function hideBackupWarning() {
    const notif = document.getElementById('backupWarningNotification');
    if (notif) {
        const bsAlert = new bootstrap.Alert(notif);
        bsAlert.close();
    }
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
    
    // Vervang volledige body inhoud
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
    // Initial check
    if (!navigator.onLine) {
        showOfflineNotification();
    }
    
    // Luister naar connectivity changes
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
        
        // Toon bovenaan de pagina
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
    
    // Auto-verberg na 5 seconden
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