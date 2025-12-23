/**
 * ============================================
 * SITE CONFIGURATION
 * Edit these values to customize your site
 * ============================================
 */

const CONFIG = {
    // ========== PERSONAL INFO ==========
    // Your display name (shown in large text)
    name: "CIPHER",
    
    // Your role/title (shown below name)
    role: "Digital Architect",
    
    // ========== SOCIAL LINKS ==========
    // Set to empty string "" to hide a link
    links: {
        // Steam profile URL
        steam: "https://steamcommunity.com/id/yourprofile",
        
        // Spotify profile URL
        spotify: "https://open.spotify.com/user/yourprofile",
        
        // Discord profile URL (use discord.com/users/USERID)
        discordProfile: "https://discord.com/users/123456789",
        
        // Discord server invite link
        discordServer: "https://discord.gg/yourserver"
    },
    
    // ========== BACKGROUND MUSIC ==========
    music: {
        // URL to your music file (MP3, OGG, WAV supported)
        // Use a relative path for local files or full URL for external
        // Examples:
        //   - "music/ambient.mp3" (local file)
        //   - "https://example.com/music.mp3" (external)
        //   - "" (disable music)
        src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
        
        // Initial volume (0.0 to 1.0)
        volume: 0.3,
        
        // Enable/disable music feature entirely
        enabled: true
    },
    
    // ========== PARTICLE BACKGROUND ==========
    particles: {
        // Enable/disable particle animation
        enabled: true,
        
        // Number of particles (lower = better performance)
        count: 80,
        
        // Particle color (CSS color value)
        color: "rgba(255, 255, 255, 0.5)",
        
        // Connection line color
        lineColor: "rgba(255, 255, 255, 0.1)",
        
        // Maximum connection distance between particles
        connectionDistance: 150,
        
        // Particle movement speed (0.1 = slow, 1.0 = fast)
        speed: 0.3,
        
        // Particle size range [min, max]
        sizeRange: [1, 2],
        
        // Enable mouse interaction (particles move away from cursor)
        mouseInteraction: true,
        
        // Mouse interaction radius
        mouseRadius: 100
    },
    
    // ========== APPEARANCE ==========
    // Override CSS variables (optional)
    // Uncomment and modify as needed
    theme: {
        // Background colors
        // bgPrimary: "#0a0a0a",
        // bgSecondary: "#0f0f0f",
        
        // Text colors
        // textPrimary: "#e8e8e8",
        // textSecondary: "#888888",
        
        // Icon colors
        // iconColor: "#888888",
        // iconHover: "#ffffff",
        
        // Glow effect color
        // glowColor: "rgba(255, 255, 255, 0.4)"
    }
};

// ========== APPLY THEME OVERRIDES ==========
// This applies any custom theme colors from config
(function applyTheme() {
    const root = document.documentElement;
    const theme = CONFIG.theme;
    
    if (theme.bgPrimary) root.style.setProperty('--bg-primary', theme.bgPrimary);
    if (theme.bgSecondary) root.style.setProperty('--bg-secondary', theme.bgSecondary);
    if (theme.textPrimary) root.style.setProperty('--text-primary', theme.textPrimary);
    if (theme.textSecondary) root.style.setProperty('--text-secondary', theme.textSecondary);
    if (theme.iconColor) root.style.setProperty('--icon-color', theme.iconColor);
    if (theme.iconHover) root.style.setProperty('--icon-hover', theme.iconHover);
    if (theme.glowColor) root.style.setProperty('--glow-color', theme.glowColor);
})();

// Make config globally available
window.SITE_CONFIG = CONFIG;
