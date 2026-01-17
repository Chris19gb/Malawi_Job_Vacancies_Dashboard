// Utility functions for the dashboard
(function() {
    'use strict';
    
    // Navigation functionality
    window.setupNavigation = function() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        
        // Set active link based on scroll position
        function setActiveLink() {
            let current = '';
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Add click event to nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            });
        });
        
        // Listen for scroll events
        window.addEventListener('scroll', setActiveLink);
        setActiveLink(); // Initialize on load
    };
    
    // Export functionality
    window.setupExport = function() {
        const exportBtn = document.getElementById('exportBtn');
        const exportModal = document.getElementById('exportModal');
        const modalClose = document.querySelectorAll('.modal-close');
        const exportOptions = document.querySelectorAll('.export-option');
        const confirmExport = document.getElementById('confirmExport');
        
        let selectedFormat = 'png';
        
        // Open modal
        if (exportBtn && exportModal) {
            exportBtn.addEventListener('click', () => {
                exportModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        // Close modal
        if (modalClose.length > 0) {
            modalClose.forEach(btn => {
                btn.addEventListener('click', () => {
                    exportModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            });
        }
        
        // Close modal on outside click
        if (exportModal) {
            exportModal.addEventListener('click', (e) => {
                if (e.target === exportModal) {
                    exportModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        // Select export format
        if (exportOptions.length > 0) {
            exportOptions.forEach(option => {
                option.addEventListener('click', () => {
                    exportOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    selectedFormat = option.dataset.format;
                });
            });
            
            // Select first option by default
            exportOptions[0].classList.add('selected');
        }
        
        // Confirm export
        if (confirmExport) {
            confirmExport.addEventListener('click', () => {
                exportModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                switch(selectedFormat) {
                    case 'png':
                        exportAsPNG();
                        break;
                    case 'pdf':
                        exportAsPDF();
                        break;
                    case 'excel':
                        exportAsExcel();
                        break;
                }
            });
        }
    };
    
    // Export as PNG
    function exportAsPNG() {
        const dashboard = document.querySelector('.dashboard');
        
        if (!dashboard) {
            showNotification('Dashboard element not found', 'error');
            return;
        }
        
        showNotification('Generating PNG image...', 'info');
        
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        html2canvas(dashboard, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: true,
            foreignObjectRendering: false,
            imageTimeout: 15000
        }).then(canvas => {
            try {
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().split('T')[0];
                link.download = `Malawi-Vacancies-Dashboard-${timestamp}.png`;
                link.href = canvas.toDataURL('image/png', 1.0);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification('Dashboard exported as PNG successfully!', 'success');
            } catch (error) {
                console.error('Error exporting PNG:', error);
                showNotification('Error exporting PNG. Please try again.', 'error');
            } finally {
                document.body.style.overflow = originalOverflow;
            }
        }).catch(error => {
            console.error('HTML2Canvas error:', error);
            showNotification('Error generating image. Please try again.', 'error');
            document.body.style.overflow = originalOverflow;
        });
    }
    
    // Export as PDF
    function exportAsPDF() {
        const dashboard = document.querySelector('.dashboard');
        
        if (!dashboard) {
            showNotification('Dashboard element not found', 'error');
            return;
        }
        
        if (typeof jsPDF === 'undefined') {
            showNotification('PDF library not loaded. Please refresh the page.', 'error');
            return;
        }
        
        showNotification('Generating PDF document...', 'info');
        
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        html2canvas(dashboard, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            try {
                const { jsPDF } = window.jspdf;
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 190;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                
                const timestamp = new Date().toISOString().split('T')[0];
                pdf.save(`Malawi-Vacancies-Dashboard-${timestamp}.pdf`);
                
                showNotification('Dashboard exported as PDF successfully!', 'success');
            } catch (error) {
                console.error('Error exporting PDF:', error);
                showNotification('Error exporting PDF. Please try again.', 'error');
            } finally {
                document.body.style.overflow = originalOverflow;
            }
        }).catch(error => {
            console.error('Error generating PDF:', error);
            showNotification('Error generating PDF. Please try again.', 'error');
            document.body.style.overflow = originalOverflow;
        });
    }
    
    // Export as Excel
    function exportAsExcel() {
        try {
            const data = [
                ['Malawi Job Vacancies Dashboard - Regional Distribution'],
                ['Generated: ' + new Date().toLocaleString()],
                [''],
                ['Region', 'Monthly Average', 'Range', 'Market Share', 'Performance', 'Growth Potential'],
                ['Northern (Mzuzu)', '0-10 (Avg: 3)', '3 vacancies', '20.0%', 'Limited', 'High'],
                ['Central (Lilongwe)', '5.6', '5-6 vacancies', '37.3%', 'Stable', 'Medium'],
                ['Southern (Blantyre)', '6.4', '6-7 vacancies', '42.7%', 'Strong', 'Low'],
                [''],
                ['Total Market Distribution: 100%'],
                ['Data Source: Malawi Job Vacancies Advert Sharing']
            ];
            
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Regional Data');
            
            // Auto-size columns
            const wscols = [
                {wch: 25},
                {wch: 20},
                {wch: 15},
                {wch: 15},
                {wch: 15},
                {wch: 15}
            ];
            ws['!cols'] = wscols;
            
            // Style the header row
            if (!ws['!merges']) ws['!merges'] = [];
            ws['!merges'].push({s: {r: 0, c: 0}, e: {r: 0, c: 5}});
            ws['!merges'].push({s: {r: 1, c: 0}, e: {r: 1, c: 5}});
            
            const timestamp = new Date().toISOString().split('T')[0];
            XLSX.writeFile(wb, `Malawi-Vacancies-Data-${timestamp}.xlsx`);
            
            showNotification('Data exported as Excel successfully!', 'success');
        } catch (error) {
            console.error('Error exporting Excel:', error);
            showNotification('Error exporting Excel. Please try again.', 'error');
        }
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    background: white;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid;
                    max-width: 400px;
                    min-width: 300px;
                }
                
                .notification-success {
                    border-left-color: #27ae60;
                }
                
                .notification-info {
                    border-left-color: #3498db;
                }
                
                .notification-warning {
                    border-left-color: #f39c12;
                }
                
                .notification-error {
                    border-left-color: #e74c3c;
                }
                
                .notification i:first-child {
                    font-size: 1.25rem;
                }
                
                .notification-success i:first-child {
                    color: #27ae60;
                }
                
                .notification-info i:first-child {
                    color: #3498db;
                }
                
                .notification-warning i:first-child {
                    color: #f39c12;
                }
                
                .notification-error i:first-child {
                    color: #e74c3c;
                }
                
                .notification span {
                    flex: 1;
                    font-size: 0.875rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #6c757d;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .notification-close:hover {
                    background: rgba(0, 0, 0, 0.05);
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                @media (max-width: 768px) {
                    .notification {
                        left: 20px;
                        right: 20px;
                        max-width: none;
                        min-width: auto;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Refresh button functionality
    document.addEventListener('DOMContentLoaded', function() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                this.classList.add('rotating');
                this.disabled = true;
                
                // Simulate refresh delay
                setTimeout(() => {
                    this.classList.remove('rotating');
                    this.disabled = false;
                    
                    // Update date in footer
                    const dateElement = document.getElementById('currentDate');
                    if (dateElement) {
                        dateElement.textContent = new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    }
                    
                    showNotification('Dashboard refreshed successfully!', 'success');
                }, 1000);
            });
        }
        
        // Add CSS for rotating animation
        if (!document.querySelector('#refresh-animation')) {
            const style = document.createElement('style');
            style.id = 'refresh-animation';
            style.textContent = `
                .rotating {
                    animation: rotate 1s linear infinite;
                }
                
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @media (prefers-reduced-motion: reduce) {
                    .rotating {
                        animation: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Contact analytics
        setupContactAnalytics();
    });
    
    // Contact analytics
    function setupContactAnalytics() {
        // Track WhatsApp clicks
        document.querySelectorAll('a[href*="whatsapp"]').forEach(link => {
            link.addEventListener('click', function() {
                console.log('WhatsApp contact clicked: Christopher Gama (+265 990 373 438)');
                // Here you could add Google Analytics or other tracking
            });
        });
        
        // Track Email clicks
        document.querySelectorAll('a[href*="mailto"]').forEach(link => {
            link.addEventListener('click', function() {
                console.log('Email contact clicked: macdalfchristopher@gmail.com');
            });
        });
        
        // Track Phone clicks
        document.querySelectorAll('a[href*="tel"]').forEach(link => {
            link.addEventListener('click', function() {
                console.log('Phone contact clicked: +265 990 373 438');
            });
        });
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Check for required elements
        const requiredElements = ['mainChart', 'exportBtn', 'refreshBtn'];
        let allElementsFound = true;
        
        requiredElements.forEach(id => {
            if (!document.getElementById(id)) {
                console.warn(`Required element #${id} not found`);
                allElementsFound = false;
            }
        });
        
        if (!allElementsFound) {
            console.warn('Some required elements not found. Dashboard may not work correctly.');
        }
    });
    
})();