/**
 * ============================================
 * PARTICLE CONSTELLATION BACKGROUND
 * Creates floating particles with connection lines
 * Lightweight and performant
 * ============================================
 */

(function() {
    'use strict';
    
    // Wait for config to be available
    const config = window.SITE_CONFIG?.particles || {
        enabled: true,
        count: 80,
        color: "rgba(255, 255, 255, 0.5)",
        lineColor: "rgba(255, 255, 255, 0.1)",
        connectionDistance: 150,
        speed: 0.3,
        sizeRange: [1, 2],
        mouseInteraction: true,
        mouseRadius: 100
    };
    
    // Exit if particles are disabled
    if (!config.enabled) {
        const canvas = document.getElementById('particle-canvas');
        if (canvas) canvas.style.display = 'none';
        return;
    }
    
    // Canvas setup
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let isVisible = true;
    
    // Mouse position tracking
    const mouse = {
        x: null,
        y: null,
        radius: config.mouseRadius
    };
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (config.sizeRange[1] - config.sizeRange[0]) + config.sizeRange[0];
            this.speedX = (Math.random() - 0.5) * config.speed;
            this.speedY = (Math.random() - 0.5) * config.speed;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            // Basic movement
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Boundary check with wrap-around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            
            // Mouse interaction - particles move away from cursor
            if (config.mouseInteraction && mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const forceX = (dx / distance) * force * 0.5;
                    const forceY = (dy / distance) * force * 0.5;
                    this.x += forceX;
                    this.y += forceY;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.color.replace('0.5', String(this.opacity));
            ctx.fill();
        }
    }
    
    // Initialize particles
    function initParticles() {
        particles = [];
        const count = Math.min(config.count, Math.floor((canvas.width * canvas.height) / 15000));
        
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    
    // Draw connection lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.connectionDistance) {
                    const opacity = 1 - (distance / config.connectionDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = config.lineColor.replace('0.1', String(opacity * 0.15));
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        if (!isVisible) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connection lines
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Resize handler with debounce
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }, 100);
    }
    
    // Mouse event handlers
    function handleMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
    
    function handleMouseLeave() {
        mouse.x = null;
        mouse.y = null;
    }
    
    // Visibility change handler (pause when tab is hidden)
    function handleVisibilityChange() {
        isVisible = !document.hidden;
    }
    
    // Touch support
    function handleTouchMove(e) {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }
    
    function handleTouchEnd() {
        mouse.x = null;
        mouse.y = null;
    }
    
    // Initialize
    function init() {
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create particles
        initParticles();
        
        // Add event listeners
        window.addEventListener('resize', handleResize, { passive: true });
        
        if (config.mouseInteraction) {
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
            window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
            window.addEventListener('touchmove', handleTouchMove, { passive: true });
            window.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Start animation
        animate();
    }
    
    // Cleanup function (for potential future use)
    function destroy() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        particles = [];
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose for potential external control
    window.ParticleSystem = {
        init,
        destroy,
        reinit: () => {
            destroy();
            init();
        }
    };
})();
