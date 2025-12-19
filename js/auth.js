/**
 * Authenticatie Manager
 * Beheert login, logout en gebruikersrechten
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Laad opgeslagen gebruiker uit localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('Ingelogde gebruiker geladen:', this.currentUser);
            } catch (error) {
                console.error('Fout bij laden gebruiker:', error);
                localStorage.removeItem('currentUser');
            }
        }
    }

    /**
     * Inloggen met gebruikersnaam en wachtwoord
     * @param {string} username - Gebruikersnaam
     * @param {string} password - Wachtwoord
     * @returns {boolean} - True als login succesvol
     */
    login(username, password) {
        // Test accounts voor demo
        const validCredentials = [
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'user', password: 'user123', role: 'user' }
        ];

        // Zoek matching credentials
        const userCreds = validCredentials.find(
            cred => cred.username === username && cred.password === password
        );

        if (userCreds) {
            this.currentUser = {
                username: userCreds.username,
                role: userCreds.role,
                loginTime: new Date().toISOString()
            };

            // Sla gebruiker op in localStorage
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            console.log('Login succesvol:', this.currentUser);
            return true;
        }

        console.log('Login mislukt voor:', username);
        return false;
    }

    /**
     * Uitloggen
     */
    logout() {
        console.log('Uitloggen:', this.currentUser?.username);
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    /**
     * Controleer of gebruiker is ingelogd
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Backwards compatibility - sommige code gebruikt isLoggedIn()
    isLoggedIn() {
        return this.isAuthenticated();
    }

    /**
     * Controleer of huidige gebruiker admin is
     * @returns {boolean}
     */
    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    /**
     * Haal huidige gebruiker op
     * @returns {object|null}
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Controleer toegang tot module
     * @param {string} moduleName - Module naam
     * @returns {boolean}
     */
    hasAccessTo(moduleName) {
        if (!this.isAuthenticated()) return false;
        
        const adminModules = ['dataManagement', 'addDog', 'breedingPlan', 'privateInfo'];
        const userModules = ['search', 'photoGallery'];
        
        // Admins hebben toegang tot alles
        if (this.isAdmin()) return true;
        
        // Users hebben alleen toegang tot bepaalde modules
        return userModules.includes(moduleName);
    }

    /**
     * Forceer authenticatie - redirect naar login als niet ingelogd
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    /**
     * Forceer admin rechten - redirect naar dashboard als geen admin
     */
    requireAdmin() {
        if (!this.requireAuth()) return false;
        
        if (!this.isAdmin()) {
            alert('Alleen administrators hebben toegang tot deze functie');
            return false;
        }
        return true;
    }

    /**
     * Update gebruiker informatie
     * @param {object} userData - Nieuwe gebruiker data
     */
    updateUser(userData) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...userData };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }
}

// Maak globale instantie
if (typeof window !== 'undefined') {
    window.auth = new AuthManager();
}