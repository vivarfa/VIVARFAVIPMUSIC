/**
 * Theme Switcher - VIVARFA VIP MUSIC
 * Permite cambiar entre tema claro y oscuro
 */

document.addEventListener('DOMContentLoaded', function() {
    // Crear el botón de cambio de tema
    createThemeSwitcher();
    
    // Inicializar el tema basado en la preferencia guardada o la preferencia del sistema
    initializeTheme();
});

/**
 * Crea el botón de cambio de tema mejorado y lo añade al DOM
 */
function createThemeSwitcher() {
    const switcherContainer = document.createElement('div');
    switcherContainer.id = 'theme-switcher';
    switcherContainer.className = 'fixed z-[1001] bottom-[100px] right-5 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700';
    
    const switcherButton = document.createElement('button');
    switcherButton.id = 'theme-toggle';
    switcherButton.className = 'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-700';
    switcherButton.setAttribute('aria-label', 'Cambiar tema');
    switcherButton.setAttribute('title', 'Cambiar tema');
    
    // Iconos para modo claro y oscuro con animaciones
    switcherButton.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 icon-sun">
            <i class="fas fa-sun text-2xl text-yellow-500"></i>
        </div>
        <div class="absolute inset-0 flex items-center justify-center transition-all duration-500 icon-moon">
            <i class="fas fa-moon text-2xl text-blue-400"></i>
        </div>
    `;
    
    switcherButton.addEventListener('click', toggleTheme);
    switcherContainer.appendChild(switcherButton);
    document.body.appendChild(switcherContainer);

    // Estilos mejorados para los iconos
    const style = document.createElement('style');
    style.innerHTML = `
        .icon-sun { 
            opacity: 0;
            transform: rotate(180deg) scale(0.5);
        }
        .icon-moon { 
            opacity: 1;
            transform: rotate(0deg) scale(1);
        }
        html.dark .icon-sun { 
            opacity: 1;
            transform: rotate(0deg) scale(1);
        }
        html.dark .icon-moon { 
            opacity: 0;
            transform: rotate(-180deg) scale(0.5);
        }
        #theme-switcher:hover .icon-sun,
        #theme-switcher:hover .icon-moon {
            transform: scale(1.1) rotate(10deg);
        }
        #theme-switcher {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        html.dark #theme-switcher {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Inicializa el tema mejorado
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('vivarfa-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    // Aplicar tema inicial sin transición
    document.documentElement.classList.toggle('dark', shouldUseDark);
    
    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('vivarfa-theme')) {
            document.documentElement.classList.toggle('dark', e.matches);
        }
    });
}

/**
 * Cambia entre tema claro y oscuro con transiciones mejoradas
 */
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('vivarfa-theme', isDark ? 'dark' : 'light');
    
    // Añadir feedback visual al botón
    const button = document.getElementById('theme-toggle');
    button.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Añadir una animación de transición suave
    const elementsToTransition = document.querySelectorAll('body, header, footer, section, div, p, h1, h2, h3, a, button, input, select, textarea, .testimonial-card');
    elementsToTransition.forEach(el => {
        el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });
    
    // Limpiar las transiciones después de completarse
    setTimeout(() => {
        elementsToTransition.forEach(el => {
            el.style.transition = '';
        });
    }, 300);
    
    // Disparar evento personalizado para otros componentes
    window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { isDark, theme: isDark ? 'dark' : 'light' }
    }));
}