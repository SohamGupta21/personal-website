/**
 * Personal Website - Main JavaScript
 * Handles interactivity, smooth transitions, and dynamic content
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializePostCards();
    initializeParallax();
    initializeProjects();
});

/**
 * Navigation - Active state handling
 */
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && href === 'index.html') {
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

/**
 * Load and render projects from JSON file
 */
async function initializeProjects() {
    // Only run on projects page
    if (!document.querySelector('#builds-grid')) {
        return;
    }

    try {
        const response = await fetch('projects.json');
        if (!response.ok) {
            throw new Error('Failed to load projects.json');
        }
        const data = await response.json();
        
        renderProjects('builds-grid', data.builds);
        renderProjects('research-grid', data.research);
        renderProjects('music-grid', data.music);
        
        // Show "Coming soon" message if music section is empty
        const musicEmpty = document.getElementById('music-empty');
        if (data.music.length === 0 && musicEmpty) {
            musicEmpty.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

/**
 * Render projects into a grid container
 */
function renderProjects(containerId, projects) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = projects.map(project => createProjectCard(project)).join('');
}

/**
 * Create HTML for a single project card
 */
function createProjectCard(project) {
    const linksHtml = createProjectLinks(project.links || {});
    
    const tagsHtml = project.tags.map(tag => 
        `<span class="project-tag">${escapeHtml(tag)}</span>`
    ).join('');
    
    return `
        <article class="project-card">
            <div class="project-header">
                <span class="project-year">${escapeHtml(project.year)}</span>
                <div class="project-links">
                    ${linksHtml}
                </div>
            </div>
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-tags">
                ${tagsHtml}
            </div>
        </article>
    `;
}

/**
 * Create HTML for project links based on link types
 */
function createProjectLinks(links) {
    const linkIcons = {
        github: {
            svg: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
            label: 'GitHub'
        },
        external: {
            svg: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
            label: 'External link'
        },
        demo: {
            svg: '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
            label: 'Demo'
        },
        live: {
            svg: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
            label: 'Live site'
        },
        paper: {
            svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>',
            label: 'Paper'
        },
        pdf: {
            svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>',
            label: 'PDF'
        }
    };
    
    let linksHtml = '';
    for (const [type, url] of Object.entries(links)) {
        if (url && linkIcons[type]) {
            const icon = linkIcons[type];
            const targetAttr = url !== '#' ? 'target="_blank" rel="noopener"' : '';
            linksHtml += `
                <a href="${escapeHtml(url)}" class="project-link" aria-label="${icon.label}" ${targetAttr}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${icon.svg}
                    </svg>
                </a>
            `;
        }
    }
    
    return linksHtml;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
