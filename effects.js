// Efectos dinámicos para la página principal

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar efectos de parallax para tarjetas
    initParallaxEffect();
    
    // Inicializar contador de estadísticas animado
    initCounters();
    
    // Inicializar efecto de typing para títulos
    initTypingEffect();
    
    // Inicializar animaciones al hacer scroll
    initScrollAnimations();
    
    // Inicializar carrusel de testimonios
    initTestimonialCarousel();
    
    // Inicializar efecto de partículas en el fondo
    initParticlesBackground();
    
    // Inicializar partículas específicas para secciones
    initHeroParticles();
    initCTAParticles();
    
    // Inicializar partículas para páginas generales
    initPageParticles();
    
    // Inicializar botones de llamada a la acción
    initCTAButtons();
    
    // Inicializar animaciones para el widget de WhatsApp
    initWhatsAppAnimations();
    
    // Inicializar efectos hover para enlaces del footer
    initFooterHoverEffects();
});

// Efecto parallax para tarjetas
function initParallaxEffect() {
    const cards = document.querySelectorAll('.parallax');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            
            card.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateX(0) translateY(0)';
        });
    });
}

// Contador animado para estadísticas
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Iniciar contador cuando el elemento sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Efecto de typing para títulos
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.classList.add('animate-typing');
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Iniciar efecto cuando el elemento sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

// Animaciones al hacer scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Carrusel de testimonios
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let currentSlide = 0;
    
    // Crear indicadores
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        let index = currentSlide + 1;
        if (index >= slides.length) index = 0;
        goToSlide(index);
    }
    
    // Auto avance cada 5 segundos
    setInterval(nextSlide, 5000);
}

// Efecto de partículas en el fondo
function initParticlesBackground() {
    const particlesContainer = document.getElementById('particles-background');
    if (!particlesContainer) return;
    
    const maxParticles = 100;
    let particles = [];
    
    // Crear partícula individual
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posición aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Tamaño aleatorio
        const size = Math.random() * 4 + 1;
        
        // Velocidad aleatoria
        const speedX = (Math.random() - 0.5) * 0.3;
        const speedY = (Math.random() - 0.5) * 0.3;
        
        // Tiempo de vida aleatorio (3-8 segundos)
        const lifetime = Math.random() * 5000 + 3000;
        
        // Aplicar estilos iniciales
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = '0';
        
        // Guardar propiedades
        particle.dataset.speedX = speedX;
        particle.dataset.speedY = speedY;
        particle.dataset.maxOpacity = Math.random() * 0.6 + 0.2;
        particle.dataset.birthTime = Date.now();
        particle.dataset.lifetime = lifetime;
        
        particlesContainer.appendChild(particle);
        particles.push(particle);
        
        // Animación de aparición
        setTimeout(() => {
            particle.style.opacity = particle.dataset.maxOpacity;
        }, 50);
        
        return particle;
    }
    
    // Crear partículas iniciales
    for (let i = 0; i < maxParticles; i++) {
        setTimeout(() => createParticle(), Math.random() * 2000);
    }
    
    // Animar y gestionar partículas
    function animateParticles() {
        const currentTime = Date.now();
        
        particles.forEach((particle, index) => {
            const speedX = parseFloat(particle.dataset.speedX);
            const speedY = parseFloat(particle.dataset.speedY);
            const birthTime = parseFloat(particle.dataset.birthTime);
            const lifetime = parseFloat(particle.dataset.lifetime);
            const maxOpacity = parseFloat(particle.dataset.maxOpacity);
            
            let posX = parseFloat(particle.style.left);
            let posY = parseFloat(particle.style.top);
            
            // Mover partícula
            posX += speedX;
            posY += speedY;
            
            // Mantener dentro del contenedor
            if (posX > 100) posX = 0;
            if (posX < 0) posX = 100;
            if (posY > 100) posY = 0;
            if (posY < 0) posY = 100;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Calcular opacidad basada en tiempo de vida
            const age = currentTime - birthTime;
            const lifeProgress = age / lifetime;
            
            let opacity;
            if (lifeProgress < 0.2) {
                // Fase de aparición (0-20% de vida)
                opacity = maxOpacity * (lifeProgress / 0.2);
            } else if (lifeProgress < 0.8) {
                // Fase estable (20-80% de vida)
                opacity = maxOpacity;
            } else {
                // Fase de desvanecimiento (80-100% de vida)
                opacity = maxOpacity * (1 - (lifeProgress - 0.8) / 0.2);
            }
            
            particle.style.opacity = Math.max(0, opacity);
            
            // Eliminar partícula si ha completado su ciclo de vida
            if (age >= lifetime) {
                particle.remove();
                particles.splice(index, 1);
                
                // Crear nueva partícula para mantener el número
                setTimeout(() => createParticle(), Math.random() * 1000);
            }
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Partículas específicas para la sección hero
function initHeroParticles() {
    const heroContainer = document.getElementById('hero-particles');
    if (!heroContainer) return;
    
    const maxParticles = 25;
    let heroParticles = [];
    
    function createHeroParticle() {
        const particle = document.createElement('div');
        particle.classList.add('hero-particle');
        
        // Posición aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Tamaño variable
        const size = Math.random() * 5 + 2;
        
        // Velocidad muy lenta
        const speedX = (Math.random() - 0.5) * 0.15;
        const speedY = (Math.random() - 0.5) * 0.15;
        
        // Tiempo de vida (4-10 segundos)
        const lifetime = Math.random() * 6000 + 4000;
        
        // Aplicar estilos iniciales
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = '0';
        
        // Guardar propiedades
        particle.dataset.speedX = speedX;
        particle.dataset.speedY = speedY;
        particle.dataset.maxOpacity = Math.random() * 0.7 + 0.3;
        particle.dataset.birthTime = Date.now();
        particle.dataset.lifetime = lifetime;
        
        heroContainer.appendChild(particle);
        heroParticles.push(particle);
        
        // Animación de aparición
        setTimeout(() => {
            particle.style.opacity = particle.dataset.maxOpacity;
        }, 100);
        
        return particle;
    }
    
    // Crear partículas iniciales
    for (let i = 0; i < maxParticles; i++) {
        setTimeout(() => createHeroParticle(), Math.random() * 3000);
    }
    
    // Animar partículas hero
    function animateHeroParticles() {
        const currentTime = Date.now();
        
        heroParticles.forEach((particle, index) => {
            const speedX = parseFloat(particle.dataset.speedX);
            const speedY = parseFloat(particle.dataset.speedY);
            const birthTime = parseFloat(particle.dataset.birthTime);
            const lifetime = parseFloat(particle.dataset.lifetime);
            const maxOpacity = parseFloat(particle.dataset.maxOpacity);
            
            let posX = parseFloat(particle.style.left);
            let posY = parseFloat(particle.style.top);
            
            // Mover partícula
            posX += speedX;
            posY += speedY;
            
            // Mantener dentro del contenedor
            if (posX > 100) posX = 0;
            if (posX < 0) posX = 100;
            if (posY > 100) posY = 0;
            if (posY < 0) posY = 100;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Calcular opacidad con efecto de respiración
            const age = currentTime - birthTime;
            const lifeProgress = age / lifetime;
            const breathe = Math.sin(age * 0.002) * 0.3 + 0.7;
            
            let opacity;
            if (lifeProgress < 0.15) {
                opacity = maxOpacity * (lifeProgress / 0.15) * breathe;
            } else if (lifeProgress < 0.85) {
                opacity = maxOpacity * breathe;
            } else {
                opacity = maxOpacity * (1 - (lifeProgress - 0.85) / 0.15) * breathe;
            }
            
            particle.style.opacity = Math.max(0, opacity);
            
            // Eliminar y recrear partícula
            if (age >= lifetime) {
                particle.remove();
                heroParticles.splice(index, 1);
                setTimeout(() => createHeroParticle(), Math.random() * 1500);
            }
        });
        
        requestAnimationFrame(animateHeroParticles);
    }
    
    animateHeroParticles();
}

// Partículas específicas para la sección CTA
function initCTAParticles() {
    const ctaContainer = document.getElementById('cta-particles');
    if (!ctaContainer) return;
    
    const maxParticles = 30;
    let ctaParticles = [];
    
    function createCTAParticle() {
        const particle = document.createElement('div');
        particle.classList.add('cta-particle');
        
        // Posición aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Tamaño variable
        const size = Math.random() * 4 + 1;
        
        // Velocidad lenta
        const speedX = (Math.random() - 0.5) * 0.2;
        const speedY = (Math.random() - 0.5) * 0.2;
        
        // Tiempo de vida (3-7 segundos)
        const lifetime = Math.random() * 4000 + 3000;
        
        // Aplicar estilos iniciales
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = '0';
        
        // Guardar propiedades
        particle.dataset.speedX = speedX;
        particle.dataset.speedY = speedY;
        particle.dataset.maxOpacity = Math.random() * 0.4 + 0.1;
        particle.dataset.birthTime = Date.now();
        particle.dataset.lifetime = lifetime;
        
        ctaContainer.appendChild(particle);
        ctaParticles.push(particle);
        
        // Animación de aparición
        setTimeout(() => {
            particle.style.opacity = particle.dataset.maxOpacity;
        }, 75);
        
        return particle;
    }
    
    // Crear partículas iniciales
    for (let i = 0; i < maxParticles; i++) {
        setTimeout(() => createCTAParticle(), Math.random() * 2500);
    }
    
    // Animar partículas CTA
    function animateCTAParticles() {
        const currentTime = Date.now();
        
        ctaParticles.forEach((particle, index) => {
            const speedX = parseFloat(particle.dataset.speedX);
            const speedY = parseFloat(particle.dataset.speedY);
            const birthTime = parseFloat(particle.dataset.birthTime);
            const lifetime = parseFloat(particle.dataset.lifetime);
            const maxOpacity = parseFloat(particle.dataset.maxOpacity);
            
            let posX = parseFloat(particle.style.left);
            let posY = parseFloat(particle.style.top);
            
            // Mover partícula
            posX += speedX;
            posY += speedY;
            
            // Mantener dentro del contenedor
            if (posX > 100) posX = 0;
            if (posX < 0) posX = 100;
            if (posY > 100) posY = 0;
            if (posY < 0) posY = 100;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Calcular opacidad con efecto de parpadeo sutil
            const age = currentTime - birthTime;
            const lifeProgress = age / lifetime;
            const twinkle = Math.sin(age * 0.003) * 0.2 + 0.8;
            
            let opacity;
            if (lifeProgress < 0.25) {
                opacity = maxOpacity * (lifeProgress / 0.25) * twinkle;
            } else if (lifeProgress < 0.75) {
                opacity = maxOpacity * twinkle;
            } else {
                opacity = maxOpacity * (1 - (lifeProgress - 0.75) / 0.25) * twinkle;
            }
            
            particle.style.opacity = Math.max(0, opacity);
            
            // Eliminar y recrear partícula
            if (age >= lifetime) {
                particle.remove();
                ctaParticles.splice(index, 1);
                setTimeout(() => createCTAParticle(), Math.random() * 1200);
            }
        });
        
        requestAnimationFrame(animateCTAParticles);
    }
    
    animateCTAParticles();
}

// Partículas para páginas generales
function initPageParticles() {
    const pageContainer = document.getElementById('page-particles');
    if (!pageContainer) return;
    
    const maxParticles = 80;
    let pageParticles = [];
    
    function createPageParticle() {
        const particle = document.createElement('div');
        particle.classList.add('page-particle');
        
        // Posición aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Tamaño variable más grande
        const size = Math.random() * 5 + 2;
        
        // Velocidad muy lenta
        const speedX = (Math.random() - 0.5) * 0.1;
        const speedY = (Math.random() - 0.5) * 0.1;
        
        // Tiempo de vida (4-10 segundos)
        const lifetime = Math.random() * 6000 + 4000;
        
        // Aplicar estilos iniciales
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = '0';
        
        // Guardar propiedades
        particle.dataset.speedX = speedX;
        particle.dataset.speedY = speedY;
        particle.dataset.maxOpacity = Math.random() * 0.5 + 0.2;
        particle.dataset.birthTime = Date.now();
        particle.dataset.lifetime = lifetime;
        
        pageContainer.appendChild(particle);
        pageParticles.push(particle);
        
        // Animación de aparición gradual
        setTimeout(() => {
            particle.style.opacity = particle.dataset.maxOpacity;
        }, Math.random() * 200 + 50);
        
        return particle;
    }
    
    // Crear partículas iniciales escalonadas
    for (let i = 0; i < maxParticles; i++) {
        setTimeout(() => createPageParticle(), Math.random() * 2000);
    }
    
    // Animar partículas de página
    function animatePageParticles() {
        const currentTime = Date.now();
        
        pageParticles.forEach((particle, index) => {
            const speedX = parseFloat(particle.dataset.speedX);
            const speedY = parseFloat(particle.dataset.speedY);
            const birthTime = parseFloat(particle.dataset.birthTime);
            const lifetime = parseFloat(particle.dataset.lifetime);
            const maxOpacity = parseFloat(particle.dataset.maxOpacity);
            
            let posX = parseFloat(particle.style.left);
            let posY = parseFloat(particle.style.top);
            
            // Mover partícula muy lentamente
            posX += speedX;
            posY += speedY;
            
            // Mantener dentro del contenedor
            if (posX > 100) posX = 0;
            if (posX < 0) posX = 100;
            if (posY > 100) posY = 0;
            if (posY < 0) posY = 100;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Calcular opacidad con efecto de ondulación muy sutil
            const age = currentTime - birthTime;
            const lifeProgress = age / lifetime;
            const wave = Math.sin(age * 0.001) * 0.1 + 0.9;
            
            let opacity;
            if (lifeProgress < 0.3) {
                // Aparición lenta (0-30% de vida)
                opacity = maxOpacity * (lifeProgress / 0.3) * wave;
            } else if (lifeProgress < 0.7) {
                // Fase estable (30-70% de vida)
                opacity = maxOpacity * wave;
            } else {
                // Desvanecimiento lento (70-100% de vida)
                opacity = maxOpacity * (1 - (lifeProgress - 0.7) / 0.3) * wave;
            }
            
            particle.style.opacity = Math.max(0, opacity);
            
            // Eliminar y recrear partícula
            if (age >= lifetime) {
                particle.remove();
                pageParticles.splice(index, 1);
                // Recrear con delay aleatorio para mantener fluidez
                setTimeout(() => createPageParticle(), Math.random() * 1000 + 200);
            }
        });
        
        requestAnimationFrame(animatePageParticles);
    }
    
    animatePageParticles();
}

// Botones de llamada a la acción
function initCTAButtons() {
    // Esta función ya no es necesaria con la nueva estructura de navegación directa
    // Los botones CTA ahora usan enlaces directos en lugar de data-section
}

// Animaciones para el widget de WhatsApp
function initWhatsAppAnimations() {
    const whatsappButton = document.getElementById('whatsapp-chat-toggle');
    const whatsappWidget = document.getElementById('whatsapp-chat-widget');
    
    if (whatsappButton && whatsappWidget) {
        // Añadir un pequeño rebote al cargar la página
        setTimeout(() => {
            whatsappButton.classList.add('animate-bounce');
            setTimeout(() => {
                whatsappButton.classList.remove('animate-bounce');
            }, 1000);
        }, 3000);
        
        // Repetir el rebote cada cierto tiempo para llamar la atención
        setInterval(() => {
            if (!whatsappWidget.classList.contains('active')) {
                whatsappButton.classList.add('animate-bounce');
                setTimeout(() => {
                    whatsappButton.classList.remove('animate-bounce');
                }, 1000);
            }
        }, 15000);
    }
}

// Efectos hover para enlaces del footer
function initFooterHoverEffects() {
    const footerLinks = document.querySelectorAll('footer a');
    
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.textShadow = 'none';
        });
    });
}