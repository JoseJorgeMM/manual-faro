// Sidebar Navigation
class SidebarNavigation {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.sidebarToggle = document.querySelector('.sidebar-toggle');
        this.overlay = document.querySelector('.overlay');
        this.sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        this.sections = document.querySelectorAll('section[id]');
        this.scrollPosition = window.scrollY;
        this.lastScrollPosition = 0;
        
        this.init();
    }
    
    init() {
        // Toggle sidebar on mobile
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Close sidebar when clicking overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeSidebar());
        }
        
        // Close sidebar when clicking a link
        this.sidebarLinks.forEach(link => {
            link.addEventListener('click', () => this.closeSidebar());
        });
        
        // Highlight active section in sidebar
        window.addEventListener('scroll', () => this.highlightActiveSection());
        
        // Initial highlight
        this.highlightActiveSection();
    }
    
    toggleSidebar() {
        this.sidebar.classList.toggle('active');
        this.overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    closeSidebar() {
        this.sidebar.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    highlightActiveSection() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = `#${section.getAttribute('id')}`;
            }
        });
        
        this.sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
                
                // Scroll the active link into view if it's not visible
                const sidebar = document.querySelector('.sidebar');
                const linkRect = link.getBoundingClientRect();
                const sidebarRect = sidebar.getBoundingClientRect();
                
                if (linkRect.bottom > sidebarRect.bottom || linkRect.top < sidebarRect.top) {
                    link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sidebarNav = new SidebarNavigation();
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            document.querySelector('.overlay').classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                document.querySelector('.overlay').classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    });
    
    // Set current year in footer
    const currentYear = document.querySelector('.current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});

// Back to top button
class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        
        if (this.button) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', (e) => this.scrollToTop(e));
    }
    
    toggleVisibility() {
        if (window.pageYOffset > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
    
    scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', () => {
    new BackToTop();
});
