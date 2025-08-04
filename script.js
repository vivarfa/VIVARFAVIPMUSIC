document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const dynamicContentContainer = document.getElementById('dynamic-content');
    const staticContentContainer = document.getElementById('static-content');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    let appData = null; // Almacenará los datos de los JSON

    // --- MANEJADOR DEL MENÚ MÓVIL ---
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    // --- FUNCIÓN PARA CARGAR TODOS LOS DATOS .JSON ---
    const fetchData = async () => {
        if (appData) return appData; // Evitar recargar si ya tenemos los datos
        try {
            const [memberships, audioPacks, videoPacks, backups, freeContent, contactInfo] = await Promise.all([
                fetch('./data/memberships.json').then(res => res.json()),
                fetch('./data/audio-packs.json').then(res => res.json()),
                fetch('./data/video-packs.json').then(res => res.json()),
                fetch('./data/backups.json').then(res => res.json()),
                fetch('./data/free-content.json').then(res => res.json()),
                fetch('./data/contact-info.json').then(res => res.json())
            ]);
            appData = { memberships, audioPacks, videoPacks, backups, freeContent, contactInfo };
            return appData;
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            if(dynamicContentContainer) dynamicContentContainer.innerHTML = `<p class="text-center text-red-500 p-10">Error al cargar el contenido. Por favor, intente de nuevo más tarde.</p>`;
            return null;
        }
    };

    // --- PLANTILLAS DE TARJETAS ---
    const createMembershipCard = (product) => {
        const planSelectorId = `plan-selector-${product.id}`; const paymentButtonId = `payment-button-${product.id}`;
        const optionsHtml = product.prices.map(p => `<option value="${p.price}" data-link="${p.paymentLink || '#'}">${p.period}</option>`).join('');
        const isRecommended = product.id === 'completo';
        return `<div class="relative bg-white dark:bg-gray-800 border-2 ${isRecommended ? 'border-purple-500 shadow-2xl shadow-purple-500/20' : 'border-gray-200 dark:border-gray-700'} rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full group">
            ${isRecommended ? '<div class="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg z-20 transform hover:scale-105 transition-all duration-300 border border-purple-400"><i class="fas fa-crown mr-1"></i>RECOMENDADO</div>' : ''}
            <div class="relative overflow-hidden">
                <img src="./images/${product.image}" alt="${product.title}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null;this.src=\'./images/placeholder.jpg\';">
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-8 flex flex-col flex-grow bg-white dark:bg-gray-800">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${product.title}</h3>
                    <div class="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
                </div>
                <div class="space-y-4 mb-8 flex-grow">
                    ${product.description.map(line => `
                        <div class="flex items-start">
                            <div class="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <i class="fas fa-check text-white text-xs"></i>
                            </div>
                            <span class="text-gray-800 dark:text-gray-100 text-sm leading-relaxed">${line.substring(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="border-t border-gray-100 dark:border-gray-700 pt-6">
                    <div class="mb-6">
                        <label for="${planSelectorId}" class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Selecciona tu plan:</label>
                        <select id="${planSelectorId}" class="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium" onchange="const selectedOption = this.options[this.selectedIndex]; const price = selectedOption.value; const link = selectedOption.getAttribute('data-link'); const button = document.getElementById('${paymentButtonId}'); button.href = link; button.innerHTML = '<i class=\\'fas fa-crown mr-2\\'></i>Suscribirse por <span class=\\'font-bold\\'>' + price + '</span>';">
                            ${optionsHtml}
                        </select>
                    </div>
                    <a id="${paymentButtonId}" href="${product.prices[0]?.paymentLink || '#'}" target="_blank" rel="noopener noreferrer" class="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <i class="fas fa-crown mr-2"></i>Suscribirse por <span class="font-bold">${product.prices[0]?.price}</span>
                    </a>
                </div>
            </div>
        </div>`;
    };
    const createProductCard = (product, type) => {
        const priceHtml = `<div class="text-center mb-4"><span class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">${product.price}</span></div>`;
        const descriptionHtml = product.description.map(line => `<div class="flex items-start mb-3"><div class="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3 mt-0.5"><i class="fas fa-check text-white text-xs"></i></div><span class="text-gray-800 dark:text-gray-100 text-sm leading-relaxed">${line.substring(2)}</span></div>`).join('');
        const buttonText = type === 'free' ? '<i class="fas fa-download mr-2"></i>Descargar Gratis' : '<i class="fas fa-shopping-cart mr-2"></i>Comprar Ahora';
        const buttonGradient = type === 'free' ? 'from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700' : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700';
        return `<div class="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full group">
            <div class="relative overflow-hidden">
                <img src="./images/${product.image}" alt="${product.title}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null;this.src=\'./images/placeholder.jpg\';">
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <div class="text-center mb-4">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${product.title}</h3>
                    <div class="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
                </div>
                <div class="flex-grow mb-6">${descriptionHtml}</div>
                <div class="border-t border-gray-100 dark:border-gray-700 pt-6">
                    ${priceHtml}
                    <a href="${product.paymentLink || product.downloadLink}" target="_blank" rel="noopener noreferrer" class="block w-full text-center bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        ${buttonText}
                    </a>
                </div>
            </div>
        </div>`;
    };

    // --- LÓGICA Y PLANTILLAS PARA LA SECCIÓN "GRATIS" ---
    const freeContentHTML = `<div id="free-content-container" class="w-full fade-in"><div id="free-loading"><div class="free-loading-spinner"></div><div id="loading-subtext" class="text-lg text-gray-300">Cargando...</div></div><div class="free-page-wrapper"><div class="free-main-content"><div class="free-controls-section"><h3 class="free-section-title">Packs Gratis Exclusivos</h3><div class="relative"><i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i><input type="text" id="search-input" class="free-search-input" placeholder="Buscar packs, archivos..."></div><div class="flex items-center justify-between gap-4 mt-6 flex-wrap"><div class="flex items-center gap-4"><label for="type-filter" class="text-sm text-gray-400">Tipo:</label><select id="type-filter" class="free-filter-select"><option value="all">Todos</option><option value="folder">Carpetas</option><option value="audio">Audio</option><option value="video">Video</option></select></div><div class="flex items-center gap-4"><label for="sort-filter" class="text-sm text-gray-400">Ordenar:</label><select id="sort-filter" class="free-filter-select"><option value="name">Nombre A-Z</option><option value="name-desc">Nombre Z-A</option><option value="date">Más reciente</option><option value="date-desc">Más antiguo</option></select></div></div></div><div class="free-stats-bar"><div class="free-stats-item"><div class="free-stats-value" id="total-items">0</div><div class="text-sm uppercase text-gray-400">Total</div></div><div class="free-stats-item"><div class="free-stats-value" id="packs-count">0</div><div class="text-sm uppercase text-gray-400">Carpetas</div></div><div class="free-stats-item"><div class="free-stats-value" id="files-count">0</div><div class="text-sm uppercase text-gray-400">Archivos</div></div><div class="free-stats-item"><div class="free-stats-value" id="filtered-count">0</div><div class="text-sm uppercase text-gray-400">Mostrando</div></div></div><div class="flex justify-between items-center mb-4 min-h-[44px]"><div id="breadcrumb" class="free-breadcrumb flex items-center gap-2 text-gray-400 flex-wrap"></div><a id="download-all-btn" class="hidden items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white free-download-all-btn" target="_blank"><i class="fas fa-download"></i> Descargar Pack</a></div><div id="list-header" class="hidden justify-between p-4 text-gray-400 text-sm uppercase border-b-2 border-gray-700 mb-4"><span>Nombre</span><span class="hidden md:block">Última Modificación</span></div><div id="content-list" class="flex flex-col gap-2 mb-8"></div><div id="empty-state" class="hidden text-center p-16 text-gray-500"><i class="fas fa-search fa-3x mb-4"></i><h3>No se encontraron resultados</h3></div></div></div></div>`;
    
    const initFreeContentExplorer = () => {
        const apiUrl = 'https://script.google.com/macros/s/AKfycbxoykeSAThO3q36tta49-BGU1fbDpD1eHw6v0HltNuUwAoADjCXYp8JRy4FXyx_l-eg/exec'; const rootFolderId = "1ZTgkPuwUQBbt1Dor409S5zh2E_7jj90q";
        let currentData = [], filteredData = [], folderHistory = []; let currentFolder = { id: rootFolderId, name: "Packs Free Exclusivos" };
        const ui = { loading: document.getElementById('free-loading'), list: document.getElementById('content-list'), header: document.getElementById('list-header'), emptyState: document.getElementById('empty-state'), searchInput: document.getElementById('search-input'), typeFilter: document.getElementById('type-filter'), sortFilter: document.getElementById('sort-filter'), downloadAllBtn: document.getElementById('download-all-btn'), breadcrumb: document.getElementById('breadcrumb'), stats: { total: document.getElementById('total-items'), packs: document.getElementById('packs-count'), files: document.getElementById('files-count'), filtered: document.getElementById('filtered-count') } };
        
        function showLoading(show) { ui.loading.style.opacity = show ? '1' : '0'; ui.loading.style.pointerEvents = show ? 'all' : 'none'; }
        const animateCounter = (el, end) => { let start = parseInt(el.textContent) || 0; if(start === end) return; const duration = 400; let startTime = null; const step = (currentTime) => { if (!startTime) startTime = currentTime; const progress = Math.min((currentTime - startTime) / duration, 1); el.textContent = Math.floor(progress * (end - start) + start); if (progress < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
        function applyFilters() {
            const searchTerm = ui.searchInput.value.toLowerCase(), typeValue = ui.typeFilter.value, sortValue = ui.sortFilter.value;
            filteredData = currentData.filter(item => (item.name.toLowerCase().includes(searchTerm)) && (typeValue === 'all' || (typeValue === 'folder' && item.type === 'folder') || (typeValue === 'audio' && item.type === 'file' && item.fileType === 'audio') || (typeValue === 'video' && item.type === 'file' && item.fileType === 'video')));
            filteredData.sort((a, b) => { switch (sortValue) { case 'name-desc': return b.name.localeCompare(a.name); case 'date': return new Date(b.dateModified || 0) - new Date(a.dateModified || 0); case 'date-desc': return new Date(a.dateModified || 0) - new Date(b.dateModified || 0); default: return a.name.localeCompare(b.name); } });
            renderContent(); animateCounter(ui.stats.filtered, filteredData.length);
        }
        function renderContent() {
            ui.list.innerHTML = ''; const hasResults = filteredData.length > 0; ui.emptyState.classList.toggle('hidden', !hasResults); ui.header.classList.toggle('hidden', !hasResults); ui.header.classList.toggle('flex', hasResults);
            filteredData.forEach((item, index) => { const itemElement = createListItem(item); itemElement.style.animationDelay = `${index * 30}ms`; ui.list.appendChild(itemElement); });
        }
        function createListItem(item) {
            const isFolder = item.type === 'folder'; const element = document.createElement('div'); element.className = `flex items-center justify-between p-4 rounded-lg free-list-item list-item-stagger ${isFolder ? 'cursor-pointer' : ''}`;
            if (isFolder) element.onclick = () => handleFolderClick(item.id, item.name);
            const iconHTML = isFolder ? `<span class="w-8 text-xl text-center free-item-icon-wrapper"><i class="fas fa-folder"></i></span>` : `<span class="w-8 text-xl text-center free-item-icon-wrapper"><i class="fas ${item.fileType === 'audio' ? 'fa-music' : 'fa-video'}"></i></span>`;
            const dateText = item.dateModified ? new Date(item.dateModified).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
            const actionsHTML = isFolder ? '' : `<a href="${item.fileUrl}" class="p-2 free-download-btn-item" download target="_blank" onclick="event.stopPropagation();" title="Descargar"><i class="fas fa-download"></i></a>`;
            element.innerHTML = `<div class="flex items-center gap-4 flex-grow min-w-0">${iconHTML}<div class="flex-grow min-w-0"><div class="font-semibold truncate">${item.name}</div></div></div><div class="flex items-center gap-4 flex-shrink-0"><span class="hidden md:block text-sm text-gray-400 w-32 text-right">${dateText}</span>${actionsHTML}</div>`;
            return element;
        }
        function handleFolderClick(folderId, folderName) { folderHistory.push(currentFolder); loadView({ id: folderId, name: folderName }); }
        async function loadView(folder) {
            showLoading(true); currentFolder = folder;
            try { const url = folder.id === rootFolderId ? apiUrl : `${apiUrl}?folderId=${folder.id}`; const response = await fetch(url); const data = await response.json(); if (data.status === 'success') { currentData = data.items || []; updateUI(data); applyFilters(); } } catch (error) { console.error('Error:', error); } finally { setTimeout(() => showLoading(false), 300); }
        }
        function navigateToHistory(index) { const targetFolder = folderHistory[index]; folderHistory.splice(index); loadView(targetFolder); }
        function renderBreadcrumbs() {
            ui.breadcrumb.innerHTML = `<a class="hover:text-white" onclick="F_initFreeContentExplorer_loadRoot()">Packs Free</a>`;
            folderHistory.forEach((folder, index) => { ui.breadcrumb.innerHTML += `<span class="mx-2 text-gray-500">></span><a class="hover:text-white" onclick="F_initFreeContentExplorer_navigateToHistory(${index})">${folder.name}</a>`; });
            if (currentFolder.id !== rootFolderId) ui.breadcrumb.innerHTML += `<span class="mx-2 text-gray-500">></span><span class="font-semibold text-white cursor-default">${currentFolder.name}</span>`;
        }
        function updateUI(data) {
            renderBreadcrumbs();
            const hasSubfolders = currentData.some(item => item.type === 'folder');
            const showDownloadButton = currentFolder.id !== rootFolderId && !hasSubfolders && currentData.length > 0;
            ui.downloadAllBtn.classList.toggle('hidden', !showDownloadButton);
            ui.downloadAllBtn.classList.toggle('flex', showDownloadButton);
            if (data.currentFolderId) ui.downloadAllBtn.href = `https://drive.google.com/drive/folders/${data.currentFolderId}`;
            ui.searchInput.value = ''; ui.typeFilter.value = 'all'; ui.sortFilter.value = 'name';
            animateCounter(ui.stats.total, currentData.length); animateCounter(ui.stats.packs, currentData.filter(i => i.type === 'folder').length); animateCounter(ui.stats.files, currentData.filter(i => i.type === 'file').length);
        }
        window.F_initFreeContentExplorer_navigateToHistory = navigateToHistory;
        window.F_initFreeContentExplorer_loadRoot = () => { folderHistory = []; loadView({ id: rootFolderId, name: "Packs Free Exclusivos" }); };
        ui.searchInput.addEventListener('input', applyFilters); ui.typeFilter.addEventListener('change', applyFilters); ui.sortFilter.addEventListener('change', applyFilters);
        try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { console.error("AdSense error: ", e); }
        loadView({ id: rootFolderId, name: "Packs Free Exclusivos" });
    };

    // --- PLANTILLA PARA BOTÓN DE DEMOS ---
    const createDemosButton = (url) => `
        <div class="text-center mb-12">
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-block bg-gradient-to-r from-teal-400 to-blue-500 text-white px-10 py-4 rounded-lg font-semibold hover:from-teal-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 text-lg shadow-lg">
                <i class="fas fa-play-circle mr-2"></i> Ver Demos
            </a>
        </div>`;

    // --- OBJETO CON TODAS LAS SECCIONES DEL SITIO ---
    const sections = {
        home: () => {
            if (staticContentContainer) staticContentContainer.style.display = 'block';
            return '';
        },
        memberships: (data) => `<section class="min-h-screen section-background py-20 fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <div class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                        <i class="fas fa-star mr-2"></i>MEMBRESÍAS EXCLUSIVAS
                    </div>
                    <h2 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6">
                        Planes VIP Premium
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Accede a contenido exclusivo de la más alta calidad. Elige el plan perfecto para llevar tu música al siguiente nivel.
                    </p>
                    <div class="flex justify-center items-center gap-8 mt-8 text-sm text-gray-500 flex-wrap">
                        <div class="flex items-center">
                            <i class="fas fa-shield-alt text-green-500 mr-2"></i>
                            <span>Contenido 100% Original</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-download text-blue-500 mr-2"></i>
                            <span>Descargas Ilimitadas</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-headset text-purple-500 mr-2"></i>
                            <span>Soporte 24/7</span>
                        </div>
                    </div>
                </div>
                ${createDemosButton('membresias.html')}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    ${data.memberships.map(p => createMembershipCard(p)).join('')}
                </div>
                <div class="text-center mt-16">
                    <!-- Contenedor principal con fondo oscuro, borde y efecto de desenfoque -->
                    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto border border-gray-700">
                        
                        <!-- Título con gradiente para llamar la atención -->
                        <h3 class="text-3xl font-bold gradient-text mb-4">¿Necesitas ayuda para elegir?</h3>
                        
                        <!-- Párrafo con texto claro -->
                        <p class="text-gray-300 text-lg mb-8">Nuestro equipo está aquí para ayudarte a encontrar el plan perfecto.</p>
                        
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <!-- Botón de Chat en Vivo (estilo fantasma) -->
                            <a href="https://wa.me/51917776934" target="_blank" class="inline-flex items-center justify-center px-6 py-3 border-2 border-purple-500 text-white rounded-xl font-semibold hover:bg-purple-500 hover:border-purple-500 transition-all duration-300 transform hover:scale-105">
                                <i class="fab fa-whatsapp mr-3"></i>Chat en Vivo
                            </a>
                            
                            <!-- Botón de Llamar (estilo gradiente, más llamativo) -->
                            <a href="tel:+51917776934" class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                                <i class="fas fa-phone mr-3"></i>Llamar Ahora
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>`,
        'audio-packs': (data) => `<section class="min-h-screen section-background py-20 fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <div class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                        <i class="fas fa-music mr-2"></i>AUDIO PREMIUM
                    </div>
                    <h2 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent mb-6">
                        Packs de Audio HD
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Descubre nuestra colección premium de packs de audio profesionales para elevar tus producciones musicales.
                    </p>
                </div>
                ${createDemosButton('demospacks.html')}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    ${data.audioPacks.map(p => createProductCard(p, 'audio')).join('')}
                </div>
            </div>
        </section>`,
        'video-packs': (data) => `<section class="min-h-screen section-background py-20 fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <div class="inline-block bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                        <i class="fas fa-video mr-2"></i>VIDEO PREMIUM
                    </div>
                    <h2 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6">
                        Packs de Video en HD
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Contenido visual de alta calidad para crear experiencias audiovisuales impactantes en tus eventos.
                    </p>
                </div>
                ${createDemosButton('demospacks.html')}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    ${data.videoPacks.map(p => createProductCard(p, 'video')).join('')}
                </div>
            </div>
        </section>`,
        backups: (data) => `<section class="min-h-screen section-background py-20 fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <div class="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                        <i class="fas fa-shield-alt mr-2"></i>BACKUPS SEGUROS
                    </div>
                    <h2 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-800 bg-clip-text text-transparent mb-6">
                        Backups Profesionales
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Protege tu música con nuestros sistemas de backup profesionales. Nunca pierdas tu contenido valioso.
                    </p>
                </div>
                ${createDemosButton('demospacks.html')}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    ${data.backups.map(p => createProductCard(p, 'backup')).join('')}
                </div>
            </div>
        </section>`,
        free: () => freeContentHTML
    };

    // --- LÓGICA DE NAVEGACIÓN Y RENDERIZADO ---
    const renderSection = (sectionName, data) => {
        if (!dynamicContentContainer) return;

        if (staticContentContainer) {
            staticContentContainer.style.display = (sectionName === 'home') ? 'block' : 'none';
        }

        if (sections[sectionName]) {
            dynamicContentContainer.innerHTML = sections[sectionName](data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            allNavLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === sectionName);
            });

            dynamicContentContainer.querySelectorAll('.nav-link-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const targetSection = e.currentTarget.dataset.section;
                    window.location.hash = targetSection;
                });
            });

            if (mobileMenu && !mobileMenu.classList.contains('hidden')) { mobileMenu.classList.add('hidden'); }
            if (sectionName === 'free') { setTimeout(initFreeContentExplorer, 50); }
        }
    };
    
    // --- MANEJADOR DE CAMBIOS DE HASH ---
    const handleHashChange = async () => {
        const data = await fetchData();
        if (!data) return;

        const hash = window.location.hash.substring(1);
        const sectionName = hash && sections[hash] ? hash : 'home';
        renderSection(sectionName, data);
    };

    // --- LÓGICA DEL MINI-CHAT DE WHATSAPP ---
    const initWhatsAppChat = (contactInfo) => {
        const widget = document.getElementById('whatsapp-chat-widget');
        const toggleButton = document.getElementById('whatsapp-chat-toggle');
        const sendButton = document.getElementById('whatsapp-send-btn');
        const messageInput = document.getElementById('whatsapp-message-input');
        if (!widget || !toggleButton || !sendButton || !messageInput) return;
        const phoneNumber = contactInfo.whatsapp.replace(/\D/g, '');

        toggleButton.addEventListener('click', () => {
            widget.classList.toggle('open');
        });

        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank', 'noopener,noreferrer');
                messageInput.value = '';
                widget.classList.remove('open');
            }
        });
    };
    
    // --- FUNCIONALIDAD DEL CARRUSEL DE TESTIMONIOS MEJORADO ---
    const initTestimonialsCarousel = () => {
        const testimonials = [
            { name: "Marco Paredes", role: "DJ de Club Residente", rating: 5, text: "La Membresía Completa de VIVARFA es una locura. Tener acceso a todos los remixes de Europa, Latin y Cracks 4 DJs, más los videos de Provideos y Remix MP4, todo en un solo lugar y actualizado cada viernes, es game changer. Mi sets están siempre a la vanguardia. ¡Más de 50 GB semanales es brutal!" },
            { name: "Sofía Ramírez", role: "VJ de Festivales", rating: 5, text: "Los videos de VIVARFA son de otro nivel. Recibir más de 100 videos semanales de Provideos, Remix MP4 y Fashion Remix me asegura tener el visual perfecto para cada track. La Membresía de Video es mi herramienta secreta." },
            { name: "Alejandro Torres", role: "DJ de Eventos Corporativos", rating: 5, text: "Con la Membresía de Audio, siempre tengo la música perfecta para cualquier ambiente. Desde los Latin Remixes hasta los Extended Latino, cubren todos mis eventos. La actualización semanal me mantiene fresco." },
            { name: "Valeria Castro", role: "Productora de Remixes", rating: 5, text: "Los packs de música de VIVARFA son oro puro. La calidad de audio es impecable y la variedad de géneros me da infinitas posibilidades para mis producciones." },
            { name: "Juan Pablo Gómez", role: "DJ de Bodas", rating: 5, text: "Antes, buscar música era un caos. Ahora, con la Membresía Ordenada por Género, tengo todo clasificado. ¡Más de 10 GB semanales listos para usar! Ahorro muchísimo tiempo y siempre encuentro lo que busco." },
            { name: "Camila Herrera", role: "DJ Móvil con Pantallas LED", rating: 5, text: "La Membresía Completa es una gran decisión. Poder ofrecer a mis clientes lo último en audio y video, con esa cantidad de contenido semanal, me diferencia. ¡El precio es una ganga para todo lo que recibes!" },
            { name: "Ricardo Díaz", role: "Dueño de Discoteca", rating: 5, text: "Mis DJs ya no pierden tiempo buscando. Con los backups de VIVARFA, tienen todo lo esencial y más, listo para pinchar. ¡Profesionalismo garantizado!" },
            { name: "Valentina Salazar", role: "DJ de Radio Online", rating: 5, text: "La actualización de los viernes es mi día favorito. Siempre hay material nuevo y fresco para mis programas. La cobertura de remixes de Europa y Latin es fantástica para mi audiencia." },
            { name: "Benjamín Ríos", role: "VJ de Sesiones Streaming", rating: 5, text: "Los videos de Cuba Remixes y Latinos Unidos Videos son un hit en mis transmisiones. La calidad y la cantidad de la Membresía de Video es imbatible para mis sesiones en vivo." },
            { name: "Emilia Pérez", role: "DJ de Fiestas Temáticas", rating: 5, text: "Con la Membresía Ordenada por Género, montar una fiesta temática es pan comido. Todos los estilos musicales que necesito, perfectamente organizados. ¡Un tesoro!" },
            { name: "Santiago Morales", role: "DJ de Bares y Pubs", rating: 5, text: "La versatilidad de la Membresía Completa me permite adaptarme a cualquier ambiente. Desde la música más comercial hasta los remixes más underground. ¡Mis clientes siempre están contentos!" },
            { name: "Ana López", role: "Estudiante de DJing", rating: 5, text: "Empecé con los packs de música de VIVARFA y son una excelente base para aprender. Ahora, con la Membresía de Audio, mi colección crece a pasos agigantados. ¡Muy recomendable!" },
            { name: "Daniel García", role: "DJ de Conciertos", rating: 5, text: "Necesito lo último para mis intros y pausas. Los BPM Latino y Dale Más Bajo Videos de la Membresía Completa me dan ese toque profesional que busco. ¡La actualización semanal es clave!" },
            { name: "Laura Martínez", role: "Creadora de Contenido para Redes", rating: 5, text: "Los videos de VIVARFA son perfectos para mis reels y TikToks. La Membresía de Video me da acceso a contenido visual de alta calidad que se sincroniza genial con la música." },
            { name: "Pablo Silva", role: "DJ de Gimnasios", rating: 5, text: "Música con energía para cada rutina. La Membresía de Audio me asegura un flujo constante de tracks motivadores. ¡Mis alumnos no paran!" }
        ];

        const testimonialsContainer = document.getElementById('testimonials-container');
        if (!testimonialsContainer) return;

        // Mezclar testimonios de forma aleatoria cada vez
        const shuffledTestimonials = [...testimonials].sort(() => Math.random() - 0.5);

        const createCardHTML = (testimonial) => {
            const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
            return `
                <div class="testimonial-card bg-white dark:bg-gray-800 rounded-xl p-6 mx-4 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[350px] max-w-[400px] border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            ${testimonial.name.charAt(0)}
                        </div>
                        <div class="ml-4">
                            <h4 class="font-bold text-gray-900 dark:text-white">${testimonial.name}</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${testimonial.role}</p>
                        </div>
                    </div>
                    <div class="text-yellow-400 mb-3 text-lg">${stars}</div>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed italic">"${testimonial.text}"</p>
                </div>
            `;
        };

        // Crear múltiples copias para el efecto infinito
        const content = shuffledTestimonials.map(createCardHTML).join('');
        testimonialsContainer.innerHTML = content + content + content;

        // Aplicar solo la clase flex (la animación está en CSS)
        testimonialsContainer.className = 'flex';

        // Pausar animación al hacer hover
        const carouselWrapper = document.getElementById('testimonial-carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => {
                testimonialsContainer.style.animationPlayState = 'paused';
            });
            carouselWrapper.addEventListener('mouseleave', () => {
                testimonialsContainer.style.animationPlayState = 'running';
            });
        }

        // Reiniciar con orden aleatorio cada 30 segundos
        setInterval(() => {
            const newShuffled = [...testimonials].sort(() => Math.random() - 0.5);
            const newContent = newShuffled.map(createCardHTML).join('');
            testimonialsContainer.innerHTML = newContent + newContent + newContent;
        }, 30000);
    };

    // --- FUNCIÓN PARA SCROLL SUAVE A LA SIGUIENTE SECCIÓN ---
    const scrollToNextSection = () => {
        const heroSection = document.querySelector('section');
        if (heroSection) {
            const nextSection = heroSection.nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // --- FUNCIÓN DE INICIALIZACIÓN ---
    const init = async () => {
        const data = await fetchData();
        if (!data) return;

        const { contactInfo } = data;
        
        // Configurar enlaces de redes sociales
        const socialContainer = document.getElementById('social-links-container');
        if (socialContainer) {
            socialContainer.innerHTML = '';
            const socialIcons = { facebook: 'fab fa-facebook-f', instagram: 'fab fa-instagram', tiktok: 'fab fa-tiktok', youtubeMain: 'fab fa-youtube' };
            for (const [key, url] of Object.entries(contactInfo.socialMedia)) {
                if (socialIcons[key]) {
                    socialContainer.innerHTML += `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors"><i class="${socialIcons[key]} fa-lg"></i></a>`;
                }
            }
        }
        
        // Inicializar el chat de WhatsApp
        initWhatsAppChat(contactInfo);
        
        // Configurar scroll suave para el indicador "Explorar más"
        const scrollIndicator = document.querySelector('.absolute.bottom-8');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', scrollToNextSection);
        }
        
        // Configurar scroll suave para el botón "Explorar Membresías" cuando esté en home
        const exploreButton = document.querySelector('button[data-section="memberships"]');
        if (exploreButton) {
            exploreButton.addEventListener('click', (e) => {
                e.preventDefault();
                const currentHash = window.location.hash.substring(1);
                if (!currentHash || currentHash === 'home') {
                    scrollToNextSection();
                } else {
                    window.location.hash = 'memberships';
                }
            });
        }
        
        // Configurar navegación y manejar carga inicial
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                if(section) window.location.hash = section;
            });
        });

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        // Inicializar carrusel
        if (document.getElementById('testimonials-container')) {
            initTestimonialsCarousel();
        }
    };

    // --- MANEJADOR DEL MODAL DE CONTACTO ---
    const contactSupportBtn = document.getElementById('contactSupportBtn');
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');
    const contactForm = document.getElementById('contactForm');

    if (contactSupportBtn && contactModal) {
        // Abrir modal
        contactSupportBtn.addEventListener('click', () => {
            contactModal.classList.remove('hidden');
        });

        // Cerrar modal
        closeModal.addEventListener('click', () => {
            contactModal.classList.add('hidden');
        });

        // Cerrar modal al hacer clic fuera
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.add('hidden');
            }
        });

        // Manejar envío del formulario
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userName = document.getElementById('userName').value;
            const userMessage = document.getElementById('userMessage').value;
            
            if (userName && userMessage) {
                const whatsappMessage = `Hola, soy ${userName}. ${userMessage}`;
                const whatsappUrl = `https://wa.me/51917776934?text=${encodeURIComponent(whatsappMessage)}`;
                
                // Abrir WhatsApp en nueva ventana
                window.open(whatsappUrl, '_blank');
                
                // Cerrar modal y limpiar formulario
                contactModal.classList.add('hidden');
                contactForm.reset();
            }
        });
    }

    // Iniciar la aplicación
    init();
});