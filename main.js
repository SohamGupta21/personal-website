/**
 * Personal Website - Main JavaScript
 * Handles interactivity, smooth transitions, and dynamic content
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializePostCards();
    initializeParallax();
});

/**
 * Navigation - Active state handling
 */
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'blog.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && href === 'blog.html') {
            link.classList.add('active');
        }
    });
}

/**
 * Post Cards - Hover effects and click handling
 */
function initializePostCards() {
    const cards = document.querySelectorAll('.post-card');
    
    cards.forEach(card => {
        // Add subtle mouse tracking effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/**
 * Parallax effect for background - disabled to keep background static
 */
function initializeParallax() {
    // Parallax disabled - background stays fixed/static
    return;
}

/**
 * Smooth page transitions (for future multi-page setup)
 */
function navigateTo(url) {
    const content = document.querySelector('.content-wrapper');
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

/**
 * Project cards - filter functionality
 */
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
    
    projects.forEach(project => {
        const projectCategory = project.dataset.category;
        
        if (category === 'all' || projectCategory === category) {
            project.style.display = 'block';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, 50);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'translateY(10px)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

/**
 * Initialize project filters if on projects page
 */
if (document.querySelector('.filter-btn')) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterProjects(btn.dataset.filter);
        });
    });
}

