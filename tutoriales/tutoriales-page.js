// Tutoriales Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Cargar y mostrar tutoriales
    loadTutoriales();
    
    // Configurar modal de video
    setupVideoModal();
    
    // Configurar menú móvil
    setupMobileMenu();
    
    // Configurar WhatsApp widget
    setupWhatsAppWidget();
});

// Función para cargar tutoriales desde el archivo JSON
function loadTutoriales() {
    // Verificar si los datos están disponibles
    if (typeof tutorialesData === 'undefined') {
        console.error('Datos de tutoriales no encontrados');
        return;
    }
    
    const container = document.getElementById('tutoriales-container');
    if (!container) return;
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Iterar sobre cada categoría
    tutorialesData.categorias.forEach((categoria, index) => {
        const categoriaElement = createCategoriaElement(categoria, index);
        container.appendChild(categoriaElement);
    });
}

// Función para crear elemento de categoría
function createCategoriaElement(categoria, index) {
    const categoriaDiv = document.createElement('div');
    categoriaDiv.className = 'mb-16 animate-fadeInUp';
    categoriaDiv.style.animationDelay = `${index * 0.1}s`;
    
    categoriaDiv.innerHTML = `
        <div class="mb-8">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center">
                <i class="fas fa-play-circle text-purple-500 mr-4"></i>
                ${categoria.nombre}
            </h2>
            <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${categoria.tutoriales.map(tutorial => createTutorialCard(tutorial)).join('')}
        </div>
    `;
    
    return categoriaDiv;
}

// Función para crear tarjeta de tutorial
function createTutorialCard(tutorial) {
    const thumbnailUrl = `https://img.youtube.com/vi/${tutorial.id_youtube}/mqdefault.jpg`;
    const fallbackThumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMzc0MTUxIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjkwIiByPSIzMCIgZmlsbD0iI0Y1OUU0MiIvPgo8cGF0aCBkPSJNMTUwIDc1TDE3NSA5MEwxNTAgMTA1Vjc1WiIgZmlsbD0id2hpdGUiLz4KPHRleHQgeD0iMTYwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VmlkZW8gVHV0b3JpYWw8L3RleHQ+Cjwvc3ZnPgo=';
    
    return `
        <div class="tutorial-card bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer" 
             data-video-id="${tutorial.id_youtube}" 
             data-video-title="${tutorial.titulo}">
            <div class="relative group">
                <img src="${thumbnailUrl}" 
                     alt="${tutorial.titulo}" 
                     class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                     loading="lazy"
                     onerror="this.src='${fallbackThumbnail}'; this.classList.add('fallback-thumbnail');">
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="bg-purple-600 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <i class="fas fa-play text-white text-2xl"></i>
                    </div>
                </div>
                <div class="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    <i class="fas fa-video mr-1"></i>HD
                </div>
                <div class="absolute top-3 left-3 bg-blue-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded flex items-center">
                    <i class="fab fa-youtube mr-1"></i>
                    YouTube
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    ${tutorial.titulo}
                </h3>
                <div class="flex items-center justify-between text-sm text-gray-400">
                    <span class="flex items-center">
                        <i class="fas fa-graduation-cap mr-2"></i>
                        Tutorial
                    </span>
                    <div class="flex items-center space-x-2">
                        <span class="flex items-center text-purple-400">
                            <i class="fas fa-play mr-1"></i>
                            Ver aquí
                        </span>
                        <span class="text-gray-500">|</span>
                        <a href="https://www.youtube.com/watch?v=${tutorial.id_youtube}" 
                           target="_blank" 
                           class="flex items-center text-red-400 hover:text-red-300 transition-colors"
                           onclick="event.stopPropagation();">
                            <i class="fab fa-youtube mr-1"></i>
                            YouTube
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Configurar modal de video
function setupVideoModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    const title = document.getElementById('video-title');
    const closeBtn = document.getElementById('close-modal');
    
    if (!modal || !iframe || !title || !closeBtn) return;
    
    let currentVideoId = null;
    let loadTimeout = null;
    
    // Función para mostrar mensaje de error
    function showErrorMessage(videoId, videoTitle) {
        const errorHtml = `
            <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-8">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle text-yellow-500 text-6xl mb-4"></i>
                    <h3 class="text-2xl font-bold mb-4">El video no está disponible</h3>
                    <p class="text-gray-300 mb-6">Este video incluye contenido que no se puede mostrar en este sitio web.</p>
                    <div class="space-y-3">
                        <a href="https://www.youtube.com/watch?v=${videoId}" 
                           target="_blank" 
                           class="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300">
                            <i class="fab fa-youtube mr-2"></i>
                            Ver en YouTube
                        </a>
                        <br>
                        <button onclick="location.reload()" 
                                class="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300">
                            <i class="fas fa-redo mr-2"></i>
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        `;
        iframe.style.display = 'none';
        const errorContainer = document.createElement('div');
        errorContainer.innerHTML = errorHtml;
        errorContainer.className = 'absolute inset-0';
        errorContainer.id = 'video-error-container';
        iframe.parentNode.appendChild(errorContainer);
    }
    
    // Función para limpiar error
    function clearError() {
        const errorContainer = document.getElementById('video-error-container');
        if (errorContainer) {
            errorContainer.remove();
        }
        iframe.style.display = 'block';
    }
    
    // Función para mostrar logo en el video
    function showVideoLogo() {
        // Remover logo existente si hay uno
        const existingLogo = document.getElementById('video-logo-overlay');
        if (existingLogo) {
            existingLogo.remove();
        }
        
        // Crear el logo overlay
        const logoOverlay = document.createElement('div');
        logoOverlay.id = 'video-logo-overlay';
        logoOverlay.className = 'absolute top-4 left-4 z-50 pointer-events-none';
        logoOverlay.innerHTML = `
            <img src="../logo.png" alt="VivarFavip Music" class="w-12 h-12 rounded-lg shadow-lg">
        `;
        
        // Agregar el logo al contenedor del iframe
        const iframeContainer = iframe.parentNode;
        iframeContainer.style.position = 'relative';
        iframeContainer.appendChild(logoOverlay);
    }
    
    // Función para ocultar logo
    function hideVideoLogo() {
        const logoOverlay = document.getElementById('video-logo-overlay');
        if (logoOverlay) {
            logoOverlay.remove();
        }
    }
    
    // Función para abrir modal
    function openModal(videoId, videoTitle) {
        currentVideoId = videoId;
        clearError();
        hideVideoLogo(); // Ocultar logo inicialmente
        
        // Configurar timeout para detectar videos que no cargan
        loadTimeout = setTimeout(() => {
            showErrorMessage(videoId, videoTitle);
        }, 8000); // 8 segundos de timeout
        
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
        iframe.src = embedUrl;
        title.textContent = videoTitle;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Detectar cuando el iframe carga exitosamente
        iframe.onload = function() {
            if (loadTimeout) {
                clearTimeout(loadTimeout);
                loadTimeout = null;
                // Mostrar logo solo cuando el video carga correctamente
                setTimeout(() => {
                    showVideoLogo();
                }, 1000); // Esperar 1 segundo para asegurar que el video está cargado
            }
        };
        
        // Detectar errores de carga
        iframe.onerror = function() {
            if (loadTimeout) {
                clearTimeout(loadTimeout);
                loadTimeout = null;
            }
            hideVideoLogo(); // Asegurar que no se muestre el logo en caso de error
            showErrorMessage(videoId, videoTitle);
        };
    }
    
    // Función para cerrar modal
    function closeModal() {
        if (loadTimeout) {
            clearTimeout(loadTimeout);
            loadTimeout = null;
        }
        iframe.src = '';
        iframe.onload = null;
        iframe.onerror = null;
        clearError();
        hideVideoLogo(); // Ocultar logo al cerrar modal
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        currentVideoId = null;
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Delegación de eventos para las tarjetas de tutorial
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.tutorial-card');
        if (card) {
            const videoId = card.dataset.videoId;
            const videoTitle = card.dataset.videoTitle;
            if (videoId && videoTitle) {
                openModal(videoId, videoTitle);
            }
        }
    });
    
    // Manejar mensajes del iframe de YouTube para detectar errores
    window.addEventListener('message', function(event) {
        if (event.origin !== 'https://www.youtube.com') return;
        
        try {
            const data = JSON.parse(event.data);
            if (data.event === 'video-progress' && data.info && data.info.playerState === -1) {
                // Video no disponible o con restricciones
                if (currentVideoId && loadTimeout) {
                    clearTimeout(loadTimeout);
                    loadTimeout = null;
                    showErrorMessage(currentVideoId, title.textContent);
                }
            }
        } catch (e) {
            // Ignorar errores de parsing
        }
    });
}

// Configurar menú móvil
function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Configurar WhatsApp widget
function setupWhatsAppWidget() {
    const chatToggle = document.getElementById('whatsapp-chat-toggle');
    const chatWidget = document.getElementById('whatsapp-chat-widget');
    const messageInput = document.getElementById('whatsapp-message-input');
    const sendBtn = document.getElementById('whatsapp-send-btn');
    
    if (!chatToggle || !chatWidget) return;
    
    chatToggle.addEventListener('click', function() {
        chatWidget.classList.toggle('active');
    });
    
    // Función para enviar mensaje
    function sendWhatsAppMessage() {
        const message = messageInput?.value.trim();
        if (message) {
            const whatsappUrl = `https://wa.me/51917776934?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            if (messageInput) messageInput.value = '';
        }
    }
    
    // Event listeners para envío de mensaje
    if (sendBtn) {
        sendBtn.addEventListener('click', sendWhatsAppMessage);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendWhatsAppMessage();
            }
        });
    }
}

// Función para manejar errores de carga de imágenes
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' && e.target.src.includes('youtube.com')) {
        // Imagen de respaldo si falla la miniatura de YouTube
        e.target.src = '../images/video-placeholder.jpg';
        e.target.alt = 'Video no disponible';
    }
}, true);

// Función para lazy loading mejorado
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Función para animaciones de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.tutorial-card').forEach(card => {
        observer.observe(card);
    });
}

// Inicializar funciones adicionales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupLazyLoading();
    setupScrollAnimations();
});