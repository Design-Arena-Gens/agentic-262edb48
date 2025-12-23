/**
 * ============================================
 * MAIN SITE FUNCTIONALITY
 * Handles content population, music system, and interactions
 * ============================================
 */

(function() {
    'use strict';
    
    // Get configuration
    const config = window.SITE_CONFIG || {};
    
    // DOM Elements
    const elements = {
        name: document.getElementById('display-name'),
        role: document.getElementById('display-role'),
        steamLink: document.getElementById('link-steam'),
        spotifyLink: document.getElementById('link-spotify'),
        discordProfileLink: document.getElementById('link-discord-profile'),
        discordServerLink: document.getElementById('link-discord-server'),
        musicToggle: document.getElementById('music-toggle'),
        bgMusic: document.getElementById('bg-music'),
        musicSource: document.getElementById('music-source')
    };
    
    /**
     * ========== CONTENT POPULATION ==========
     * Apply configuration values to the page
     */
    function populateContent() {
        // Set name and role
        if (elements.name && config.name) {
            elements.name.textContent = config.name;
        }
        if (elements.role && config.role) {
            elements.role.textContent = config.role;
        }
        
        // Set social links (hide if empty)
        const links = config.links || {};
        
        setLink(elements.steamLink, links.steam);
        setLink(elements.spotifyLink, links.spotify);
        setLink(elements.discordProfileLink, links.discordProfile);
        setLink(elements.discordServerLink, links.discordServer);
    }
    
    /**
     * Set a link's href or hide it if empty
     */
    function setLink(element, url) {
        if (!element) return;
        
        if (url && url.trim() !== '') {
            element.href = url;
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    }
    
    /**
     * ========== MUSIC SYSTEM ==========
     * Background music with user-initiated toggle
     */
    const MusicSystem = {
        isPlaying: false,
        isEnabled: false,
        hasInteracted: false,
        
        init() {
            const musicConfig = config.music || {};
            
            // Check if music is enabled and has a source
            if (!musicConfig.enabled || !musicConfig.src) {
                this.disable();
                return;
            }
            
            this.isEnabled = true;
            
            // Set music source and volume
            if (elements.musicSource) {
                elements.musicSource.src = musicConfig.src;
            }
            if (elements.bgMusic) {
                elements.bgMusic.volume = musicConfig.volume || 0.3;
                elements.bgMusic.load();
            }
            
            // Set up toggle button
            if (elements.musicToggle) {
                elements.musicToggle.addEventListener('click', () => this.toggle());
                
                // Keyboard accessibility
                elements.musicToggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle();
                    }
                });
            }
            
            // Handle audio events
            if (elements.bgMusic) {
                elements.bgMusic.addEventListener('play', () => this.updateUI(true));
                elements.bgMusic.addEventListener('pause', () => this.updateUI(false));
                elements.bgMusic.addEventListener('ended', () => this.updateUI(false));
                
                // Error handling
                elements.bgMusic.addEventListener('error', (e) => {
                    console.warn('Music failed to load:', e);
                    this.disable();
                });
            }
        },
        
        toggle() {
            if (!this.isEnabled || !elements.bgMusic) return;
            
            this.hasInteracted = true;
            
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },
        
        play() {
            if (!elements.bgMusic) return;
            
            const playPromise = elements.bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.isPlaying = true;
                        this.updateUI(true);
                    })
                    .catch((error) => {
                        // Autoplay was prevented - this is expected
                        console.log('Playback requires user interaction');
                        this.updateUI(false);
                    });
            }
        },
        
        pause() {
            if (!elements.bgMusic) return;
            
            elements.bgMusic.pause();
            this.isPlaying = false;
            this.updateUI(false);
        },
        
        updateUI(playing) {
            if (!elements.musicToggle) return;
            
            if (playing) {
                elements.musicToggle.classList.add('playing');
                elements.musicToggle.setAttribute('aria-label', 'Pause background music');
            } else {
                elements.musicToggle.classList.remove('playing');
                elements.musicToggle.setAttribute('aria-label', 'Play background music');
            }
        },
        
        disable() {
            this.isEnabled = false;
            if (elements.musicToggle) {
                elements.musicToggle.style.display = 'none';
            }
        },
        
        setVolume(value) {
            if (elements.bgMusic) {
                elements.bgMusic.volume = Math.max(0, Math.min(1, value));
            }
        }
    };
    
    /**
     * ========== ACCESSIBILITY ENHANCEMENTS ==========
     */
    function setupAccessibility() {
        // Skip link for keyboard users (optional enhancement)
        const skipLink = document.createElement('a');
        skipLink.href = '#display-name';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -100px;
            left: 0;
            padding: 8px 16px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            z-index: 1000;
            transition: top 0.3s;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-100px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Announce page load for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(announcement);
        
        // Announce when page is ready
        setTimeout(() => {
            announcement.textContent = `${config.name || 'Personal'} site loaded. ${config.role || ''}`;
        }, 1500);
    }
    
    /**
     * ========== KEYBOARD NAVIGATION ==========
     */
    function setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // M key toggles music
            if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                const activeElement = document.activeElement;
                const isInputElement = activeElement.tagName === 'INPUT' || 
                                      activeElement.tagName === 'TEXTAREA' ||
                                      activeElement.isContentEditable;
                
                if (!isInputElement) {
                    MusicSystem.toggle();
                }
            }
        });
    }
    
    /**
     * ========== INITIALIZE ==========
     */
    function init() {
        populateContent();
        MusicSystem.init();
        setupAccessibility();
        setupKeyboardNav();
        
        // Log initialization (for debugging, remove in production)
        console.log('%c✨ Site initialized', 'color: #888; font-style: italic;');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose music system for external control
    window.MusicSystem = MusicSystem;
})();
