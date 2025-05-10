document.addEventListener('DOMContentLoaded', () => {
    // --- SELECTORES GLOBALES ---
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sideMenuPanel = document.getElementById('side-menu-panel');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const mainContentArea = document.getElementById('main-content-area');
    const navLinks = document.querySelectorAll('.side-menu .nav-link');
    const pages = document.querySelectorAll('.page');
    const emojiBackgroundContainer = document.getElementById('emoji-background-container');
    const flyingRocket = document.createElement('div'); // Crearemos el cohete con JS

    // --- ESTADO Y CONFIGURACIÓN ---
    let menuOpen = false;
    let menuClickCount = 0;
    let menuClickTimer = null;
    const EMOJIS_FOR_BACKGROUND = ['💧', '✨', '💻', '🚀', '💡', '🌟', '💙', '🔮', '📈', '🎯'];
    const EMOJIS_FOR_MENU_LINK_CLICK = ['✨', '💫', '⭐', '🔹'];

    // --- FUNCIONES DEL MENÚ LATERAL ---
    function openMenu() {
        menuOpen = true;
        menuToggleBtn.classList.add('active');
        menuToggleBtn.setAttribute('aria-expanded', 'true');
        sideMenuPanel.classList.add('open');
        sideMenuPanel.setAttribute('aria-hidden', 'false');
        menuOverlay.classList.add('active');
        mainContentArea.classList.add('menu-open-blur');
        document.body.style.overflow = 'hidden'; // Evitar scroll del body cuando el menú está abierto
    }

    function closeMenu() {
        menuOpen = false;
        menuToggleBtn.classList.remove('active');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        sideMenuPanel.classList.remove('open');
        sideMenuPanel.setAttribute('aria-hidden', 'true');
        menuOverlay.classList.remove('active');
        mainContentArea.classList.remove('menu-open-blur');
        document.body.style.overflow = ''; 
    }

    menuToggleBtn.addEventListener('click', () => {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }

        // Lógica del confeti por clicks rápidos en el toggle
        menuClickCount++;
        clearTimeout(menuClickTimer);
        menuClickTimer = setTimeout(() => {
            menuClickCount = 0; // Resetear contador después de un tiempo
        }, 800); // 800ms para considerar clicks "rápidos"

        if (menuClickCount >= 3) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.1, x: 0.9 }, // Origen cerca del botón de menú
                colors: ['#41A0E0', '#77DFFF', '#FFFFFF', '#E0E6E8']
            });
            menuClickCount = 0; // Resetear para no lanzar confeti continuamente
        }
    });

    closeMenuBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) {
            closeMenu();
        }
    });

    // --- NAVEGACIÓN DE PÁGINAS ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = link.dataset.page;

            pages.forEach(page => {
                page.classList.remove('current-page');
            });

            const targetPageElement = document.getElementById(targetPageId);
            if (targetPageElement) {
                targetPageElement.classList.add('current-page');
            }

            navLinks.forEach(nav => nav.classList.remove('active-link'));
            link.classList.add('active-link');

            // Efecto de partículas al hacer click en el enlace
            createMenuLinkParticles(link);

            closeMenu(); // Cerrar el menú después de seleccionar una opción
            window.scrollTo(0, 0); // Volver al inicio de la página
        });
    });

    function createMenuLinkParticles(clickedElement) {
        const rect = clickedElement.getBoundingClientRect();
        for (let i = 0; i < 8; i++) { // Crear 8 partículas
            const particle = document.createElement('div');
            particle.classList.add('menu-link-particles'); // Usa la clase CSS definida
            particle.textContent = EMOJIS_FOR_MENU_LINK_CLICK[Math.floor(Math.random() * EMOJIS_FOR_MENU_LINK_CLICK.length)];
            
            const size = Math.random() * 10 + 5; // Tamaño entre 5px y 15px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.fontSize = `${size * 0.8}px`; // Ajustar tamaño del emoji
            
            // Posición inicial en el centro del elemento clickeado
            particle.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2 - size / 2}px`;

            // Dirección aleatoria de dispersión
            const angle = Math.random() * 360;
            const distance = Math.random() * 50 + 30; // Distancia de dispersión
            particle.style.setProperty('--tx', `${Math.cos(angle * Math.PI / 180) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle * Math.PI / 180) * distance}px`);
            
            document.body.appendChild(particle); // Añadir al body para posicionamiento absoluto global

            setTimeout(() => {
                particle.remove();
            }, 600); // Duración de la animación de la partícula
        }
    }


    // --- EMOJIS DE FONDO CAYENDO ---
    function createFallingEmoji() {
        const emoji = document.createElement('div');
        emoji.classList.add('falling-emoji');
        emoji.textContent = EMOJIS_FOR_BACKGROUND[Math.floor(Math.random() * EMOJIS_FOR_BACKGROUND.length)];
        
        emoji.style.left = `${Math.random() * 100}vw`; // Posición horizontal aleatoria
        emoji.style.fontSize = `${Math.random() * 1 + 0.8}rem`; // Tamaño aleatorio
        emoji.style.animationDuration = `${Math.random() * 5 + 5}s`; // Duración de caída aleatoria (5-10s)
        emoji.style.animationDelay = `${Math.random() * 3}s`; // Retraso inicial aleatorio
        
        emojiBackgroundContainer.appendChild(emoji);

        // Remover emoji después de que termine su animación para no sobrecargar el DOM
        // La animación tiene 'infinite' en CSS, así que esto es más para control
        setTimeout(() => {
            // Si se deja el infinite en CSS, esta remoción puede no ser necesaria o
            // se necesitaría una lógica para recrearlos si la cantidad disminuye.
            // Por ahora, la animación 'infinite' CSS los gestiona visualmente.
            // Para un control estricto del DOM:
            // emoji.remove(); 
        }, parseFloat(emoji.style.animationDuration) * 1000 + parseFloat(emoji.style.animationDelay) * 1000 + 100);
    }

    // Generar un lote inicial de emojis de fondo
    for (let i = 0; i < 30; i++) { // Ajusta la cantidad de emojis
        createFallingEmoji();
    }
    // Opcional: generar más emojis periódicamente si los anteriores se eliminan del DOM
    // setInterval(createFallingEmoji, 2000); // Cada 2 segundos, por ejemplo


    // --- COHETE VOLADOR ---
    flyingRocket.classList.add('flying-rocket-emoji');
    flyingRocket.textContent = '🚀';
    document.body.appendChild(flyingRocket); // Añadir el cohete al cuerpo del documento


    // --- LÓGICA DE LA CALCULADORA ---
    const calculateBtn = document.getElementById('calculateBtn');
    const jobForm = document.getElementById('jobForm');
    const resultArea = document.getElementById('resultArea');
    const resultText = document.getElementById('resultText');
    const progressBar = document.getElementById('progressBar');
    const finalProbabilityText = document.getElementById('finalProbabilityText');
    const rankSuggestion = document.getElementById('rankSuggestion');

    const BASE_PROBABILITY = 5;
    const MAX_CHECKBOX_PROBABILITY = 90; // 15 variables * 6%
    
    const rankLevels = [
        { name: "🐒 Aspirante Remoto", min: 0, max: 24, emoji: "🐒", fruit: "🍌" },
        { name: "🦊 Aprendiz Remoto", min: 25, max: 45, emoji: "🦊", fruit: "🍇" },
        { name: "🦉 Colaborador Élite", min: 46, max: 65, emoji: "🦉", fruit: "🍒" },
        { name: "🐺 Profesional Consolidado", min: 66, max: 85, emoji: "🐺", fruit: "🍓" },
        { name: "🦁 Maestro del Trabajo Remoto", min: 86, max: 100, emoji: "🦁", fruit: "🍉" }
    ];

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            let currentProbability = BASE_PROBABILITY;
            const checkboxes = jobForm.querySelectorAll('input[type="checkbox"]');
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    currentProbability += parseInt(checkbox.value);
                }
            });

            currentProbability = Math.min(currentProbability, BASE_PROBABILITY + MAX_CHECKBOX_PROBABILITY);

            resultText.textContent = "Analizando tu perfil Aero... 🔮";
            progressBar.style.width = '0%';
            progressBar.textContent = '';
            finalProbabilityText.classList.add('hidden');
            finalProbabilityText.classList.remove('visible'); // Asegurar reinicio
            rankSuggestion.classList.add('hidden');
            rankSuggestion.classList.remove('visible'); // Asegurar reinicio

            resultArea.classList.remove('hidden'); // Mostrar área antes de animación de barra
             setTimeout(() => resultArea.classList.add('visible'), 10); // Pequeño delay para transición CSS

            // Simular cálculo y animar barra de progreso
            setTimeout(() => {
                progressBar.style.width = currentProbability + '%';
                progressBar.textContent = currentProbability + '%';
            }, 150); // Un poco de retraso para que el contenedor ya sea visible

            // Retraso para mostrar resultado final después de que la barra se llene
            setTimeout(() => {
                resultText.textContent = "¡Resultado Aero Revelado! ✨";
                finalProbabilityText.textContent = `Tu probabilidad: ${currentProbability}%`;
                finalProbabilityText.classList.remove('hidden');
                setTimeout(() => finalProbabilityText.classList.add('visible'), 10);


                const currentRank = rankLevels.find(r => currentProbability >= r.min && currentProbability <= r.max);
                if (currentRank) {
                    rankSuggestion.textContent = `Rango Sugerido: ${currentRank.name} ${currentRank.emoji}`;
                    rankSuggestion.classList.remove('hidden');
                    setTimeout(() => rankSuggestion.classList.add('visible'), 10);
                }

                // Lanzar confeti del resultado
                if (currentProbability > 20) { 
                    confetti({
                        particleCount: 70 + currentProbability, // Más partículas si la probabilidad es alta
                        spread: 60 + (currentProbability / 1.5),
                        origin: { y: 0.7 },
                        colors: ['#41A0E0', '#77DFFF', '#E0E6E8', '#FFFFFF', '#2a3b4e'] // Colores Aero
                    });
                }
            }, 2300); // Debe ser > duración de transición de la barra (2.2s en CSS) + delay inicial
        });
    }

    // --- Placeholder para funcionalidad de RANGOS INTERACTIVOS (se desarrollará más a fondo después) ---
    const rankItemsPlaceholders = document.querySelectorAll('.rank-item-placeholder');
    rankItemsPlaceholders.forEach(item => {
        item.addEventListener('click', () => {
            const animal = item.dataset.animal;
            console.log(`Has clickeado el rango del ${animal}. Próximamente: sonido y frutas!`);
            // Aquí iría la lógica para sonido y frutas que implementaremos después
        });
    });


    // --- INICIALIZACIÓN ADICIONAL SI ES NECESARIA ---
    // Asegurar que la página de inicio sea la activa al cargar
    const homePage = document.getElementById('home-page');
    if (homePage && !homePage.classList.contains('current-page')) {
        pages.forEach(p => p.classList.remove('current-page'));
        homePage.classList.add('current-page');
        navLinks.forEach(nl => nl.classList.remove('active-link'));
        const homeLink = document.querySelector('.nav-link[data-page="home-page"]');
        if (homeLink) homeLink.classList.add('active-link');
    }

    console.log("Calculadora Aero iniciada con éxito! 🚀");
});
