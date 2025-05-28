// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarClose = document.querySelector('#sidebarClose');
const overlay = document.querySelector('#sidebarOverlay');
const backToTopBtn = document.querySelector('.back-to-top-button');
const searchInput = document.querySelector('#searchInput');
const searchResults = document.querySelector('.search-results');
const themeToggle = document.querySelector('.theme-toggle-button');
const currentYear = document.querySelector('.current-year');
const navLinks = document.querySelectorAll('.nav-link');

// Set current year in footer
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'true');
    });
}

// Close sidebar with close button
if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
}

// Close mobile menu when clicking overlay
if (overlay) {
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
}

// Close sidebar when clicking a nav link on mobile
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 1200) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Back to top button
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Theme toggle
if (themeToggle) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    // Check for saved theme preference or use OS preference
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// Search functionality
if (searchInput && searchResults) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('show');
        }
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
        searchResults.classList.remove('show');
        return;
    }
    
    // Search through all section headings and content
    const sections = document.querySelectorAll('.content-section');
    const results = [];
    
    sections.forEach(section => {
        // Search in headings
        const headings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const sectionId = section.id;
        
        headings.forEach(heading => {
            const text = heading.textContent.toLowerCase();
            if (text.includes(query)) {
                results.push({
                    title: heading.textContent.trim(),
                    url: `#${sectionId}`,
                    excerpt: `Encontrado en la sección: ${sectionId}`
                });
            }
        });
        
        // Search in paragraphs
        const paragraphs = section.querySelectorAll('p');
        paragraphs.forEach(p => {
            const text = p.textContent.toLowerCase();
            if (text.includes(query)) {
                results.push({
                    title: `Encontrado en ${sectionId}`,
                    url: `#${sectionId}`,
                    excerpt: p.textContent.trim().substring(0, 120) + '...'
                });
            }
        });
        
        // Search in lists
        const listItems = section.querySelectorAll('li');
        listItems.forEach(li => {
            const text = li.textContent.toLowerCase();
            if (text.includes(query)) {
                results.push({
                    title: `Elemento de lista en ${sectionId}`,
                    url: `#${sectionId}`,
                    excerpt: li.textContent.trim().substring(0, 120) + '...'
                });
            }
        });
    });
    
    // Remove duplicates
    const uniqueResults = [...new Map(results.map(item => 
        [item.url + item.title, item])).values()];
    
    // Only keep the first 10 results
    displaySearchResults(uniqueResults.slice(0, 10));
}

// Display search results
function displaySearchResults(results) {
    if (!searchResults) return;
    
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No se encontraron resultados</div>';
    } else {
        results.slice(0, 5).forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.href = result.url;
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <h4>${result.title}</h4>
                <p>${result.excerpt}</p>
            `;
            searchResults.appendChild(resultItem);
        });
    }
    
    searchResults.classList.add('show');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    });
});

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Lazy loading images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Form validation
const forms = document.querySelectorAll('.needs-validation');
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    }, false);
});
