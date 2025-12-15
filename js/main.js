/**
 * Hoofd initialisatie bestand voor Hondendatabase PWA
 * Registreert Service Worker en initialiseert applicatie
 */

// Wacht tot DOM volledig geladen is
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Hondendatabase PWA initialiseren...');
    
    // Controleer of we in een browser zijn die IndexedDB ondersteunt
    if (!window.indexedDB) {
        showBrowserError('Uw browser ondersteunt geen IndexedDB. Deze applicatie vereist een moderne browser zoals Chrome, Firefox of Edge.');
        return;
    }
    
    // Registreer Service Worker voor PWA functionaliteit
    await registerServiceWorker();
    
    // Toon welkomstbericht
    console.log('Hondendatabase PWA is klaar voor gebruik!');
});

/**
 * Registreer Service Worker voor offline functionaliteit
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('Service Worker geregistreerd met scope:', registration.scope);
            
            // Controleer of er een update beschikbaar is
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('Nieuwe Service Worker wordt geïnstalleerd...');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Nieuwe update beschikbaar
                        showUpdateNotification();
                    }
                });
            });
            
        } catch (error) {
            console.error('Service Worker registratie mislukt:', error);
        }
    } else {
        console.warn('Service Workers worden niet ondersteund door deze browser');
    }
}

/**
 * Toon update notificatie
 */
function showUpdateNotification() {
    // Je kunt hier een update melding tonen aan de gebruiker
    console.log('Nieuwe versie van de app beschikbaar! Vernieuw de pagina.');
}

/**
 * Toon browser compatibiliteit fout
 */
function showBrowserError(message) {
    const errorHTML = `
        <div class="alert alert-danger m-3">
            <h4><i class="bi bi-exclamation-triangle"></i> Browser Compatibiliteit</h4>
            <p>${message}</p>
            <p class="mb-0">
                <strong>Ondersteunde browsers:</strong><br>
                • Chrome 54+<br>
                • Firefox 52+<br>
                • Edge 79+<br>
                • Safari 11.1+<br>
                • Opera 41+
            </p>
        </div>
    `;
    
    // Voeg error toe aan body
    document.body.innerHTML = errorHTML + document.body.innerHTML;
}

/**
 * Controleer internet connectie
 */
function checkInternetConnection() {
    if (!navigator.onLine) {
        showOfflineNotification();
    }
    
    // Luister naar connectivity changes
    window.addEventListener('online', () => {
        console.log('Apparaat is weer online');
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
            <i class="bi bi-wifi-off"></i>
            <strong>Offline modus</strong> - U werkt momenteel zonder internetverbinding.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.prepend(notification);
    }
}

/**
 * Verberg offline notificatie
 */
function hideOfflineNotification() {
    const notification = document.getElementById('offlineNotification');
    if (notification) {
        notification.remove();
    }
}

/**
 * Installeer PWA
 */
function installPWA() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Voorkom dat de browser de install prompt toont
        e.preventDefault();
        // Bewaar het event voor later gebruik
        deferredPrompt = e;
        
        // Toon installatie knop
        showInstallButton();
    });
    
    function showInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.id = 'installPWAButton';
        installBtn.className = 'btn btn-success position-fixed bottom-0 end-0 m-3';
        installBtn.innerHTML = '<i class="bi bi-download"></i> Installeer App';
        installBtn.style.zIndex = '1000';
        
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            // Toon de install prompt
            deferredPrompt.prompt();
            
            // Wacht op gebruiker reactie
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Gebruiker keuze: ${outcome}`);
            
            // Reset de prompt
            deferredPrompt = null;
            
            // Verberg de knop
            installBtn.remove();
        });
        
        document.body.appendChild(installBtn);
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
        ]
    };
    
    console.table(info);
}

// Exporteer functies voor gebruik in andere bestanden
export {
    registerServiceWorker,
    checkInternetConnection,
    installPWA,
    showAppInfo
};

// Voer initialisatie taken uit
checkInternetConnection();
installPWA();
showAppInfo();