/**
 * Authenticatie Systeem
 * Twee gebruikersrollen: Administrator en Gebruiker
 */

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 uur
        this.isInitializing = true;
        this.init();
    }
    
    init() {
        console.log('AuthSystem initialiseren...');
        
        try {
            // Controleer of er een actieve sessie is
            const savedUser = localStorage.getItem('currentUser');
            const savedTimestamp = localStorage.getItem('sessionTimestamp');
            
            console.log('Auth init - Opgeslagen data:', { savedUser, savedTimestamp });
            
            if (savedUser && savedTimestamp) {
                const sessionAge = Date.now() - parseInt(savedTimestamp);
                console.log('Sessie leeftijd:', sessionAge, 'timeout:', this.sessionTimeout);
                
                if (sessionAge < this.sessionTimeout) {
                    this.currentUser = JSON.parse(savedUser);
                    this.updateSessionTimestamp();
                    console.log('Sessie hersteld voor:', this.currentUser.username);
                } else {
                    console.log('Sessie verlopen, uitloggen');
                    this.cleanupSession();
                }
            } else {
                console.log('Geen actieve sessie gevonden');
            }
            
        } catch (error) {
            console.error('Fout bij auth initialisatie:', error);
            this.cleanupSession();
        } finally {
            this.isInitializing = false;
            console.log('AuthSystem initialisatie voltooid');
        }
    }
    
    login(username, password) {
        console.log('Login poging voor:', username);
        
        // Hardcoded gebruikers (in productie vervangen door server-side auth)
        const users = {
            'admin': { 
                username: 'admin', 
                password: 'admin123', 
                role: 'admin',
                displayName: 'Administrator'
            },
            'user': { 
                username: 'user', 
                password: 'user123', 
                role: 'user',
                displayName: 'Gebruiker'
            }
        };
        
        const user = users[username];
        
        if (user && user.password === password) {
            console.log('Login succesvol voor:', username);
            
            this.currentUser = {
                username: user.username,
                role: user.role,
                displayName: user.displayName,
                loginTime: new Date().toISOString()
            };
            
            // Sla sessie op
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateSessionTimestamp();
            
            // Audit log
            this.logAction('login', `Gebruiker ${username} ingelogd`);
            
            console.log('Login voltooid, gebruiker:', this.currentUser);
            return { success: true, user: this.currentUser };
        }
        
        console.log('Login mislukt voor:', username);
        this.logAction('login_failed', `Mislukte login poging voor ${username}`);
        return { success: false, error: 'Ongeldige gebruikersnaam of wachtwoord' };
    }
    
    logout() {
        console.log('Uitloggen...');
        
        if (this.currentUser) {
            this.logAction('logout', `Gebruiker ${this.currentUser.username} uitgelogd`);
        }
        
        this.cleanupSession();
        
        // Redirect naar login pagina
        console.log('Redirect naar login pagina');
        window.location.href = 'index.html';
    }
    
    cleanupSession() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimestamp');
        console.log('Sessie opgeschoond');
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
    
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    updateSessionTimestamp() {
        localStorage.setItem('sessionTimestamp', Date.now().toString());
    }
    
    checkSession() {
        if (!this.isAuthenticated()) {
            console.log('Geen geauthenticeerde gebruiker');
            return false;
        }
        
        const savedTimestamp = localStorage.getItem('sessionTimestamp');
        if (!savedTimestamp) {
            console.log('Geen sessie timestamp gevonden');
            this.cleanupSession();
            return false;
        }
        
        const sessionAge = Date.now() - parseInt(savedTimestamp);
        console.log('Sessie check - leeftijd:', sessionAge);
        
        if (sessionAge > this.sessionTimeout) {
            console.log('Sessie verlopen');
            this.cleanupSession();
            return false;
        }
        
        this.updateSessionTimestamp();
        return true;
    }
    
    logAction(action, details) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                user: this.currentUser ? this.currentUser.username : 'system',
                action: action,
                details: details,
                ip: 'local'
            };
            
            // Sla log op in localStorage
            const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
            logs.push(logEntry);
            
            // Beperk logs tot laatste 100 entries
            if (logs.length > 100) {
                logs.splice(0, logs.length - 100);
            }
            
            localStorage.setItem('auditLogs', JSON.stringify(logs));
            
        } catch (error) {
            console.error('Fout bij audit log:', error);
        }
    }
    
    getAuditLogs() {
        try {
            return JSON.parse(localStorage.getItem('auditLogs') || '[]');
        } catch (error) {
            console.error('Fout bij laden audit logs:', error);
            return [];
        }
    }
    
    getUserInfo() {
        if (!this.currentUser) {
            return null;
        }
        
        return {
            username: this.currentUser.username,
            role: this.currentUser.role,
            displayName: this.currentUser.displayName || this.currentUser.username,
            roleText: this.currentUser.role === 'admin' ? 'Administrator' : 'Gebruiker',
            loginTime: this.currentUser.loginTime,
            sessionDuration: Date.now() - parseInt(localStorage.getItem('sessionTimestamp') || '0')
        };
    }
    
    // Helper functie voor UI
    getWelcomeMessage(lang = 'nl') {
        if (!this.currentUser) return '';
        
        const userInfo = this.getUserInfo();
        const messages = {
            nl: `Welkom, ${userInfo.displayName}! (${userInfo.roleText})`,
            en: `Welcome, ${userInfo.displayName}! (${userInfo.roleText})`,
            de: `Willkommen, ${userInfo.displayName}! (${userInfo.roleText})`
        };
        
        return messages[lang] || messages.nl;
    }
}

// Maak globale auth instantie
console.log('AuthSystem globaal maken...');
const auth = new AuthSystem();

// Maak beschikbaar via window object
window.auth = auth;

// Debug: log auth status
setTimeout(() => {
    console.log('Auth status:', {
        isAuthenticated: auth.isAuthenticated(),
        isAdmin: auth.isAdmin(),
        currentUser: auth.getCurrentUser(),
        userInfo: auth.getUserInfo()
    });
}, 500);

// Sessie controle elke minuut
setInterval(() => {
    if (auth.isAuthenticated()) {
        const isValid = auth.checkSession();
        if (!isValid && window.location.pathname.includes('app.html')) {
            console.log('Sessie ongeldig, redirect naar login');
            window.location.href = 'index.html';
        }
    }
}, 60000);

// Voeg ook een onbeforeunload listener toe om sessie te updaten
window.addEventListener('beforeunload', () => {
    if (auth.isAuthenticated()) {
        auth.updateSessionTimestamp();
    }
});

console.log('AuthSystem script geladen');