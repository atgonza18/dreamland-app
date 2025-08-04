// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

// Fix iOS PWA tab bar safe area
function fixIOSTabBar() {
    const tabBar = document.querySelector('.ios-tab-bar');
    if (!tabBar) return;
    
    // Check if running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true;
    
    if (isStandalone) {
        // Force the tab bar to extend beyond the bottom
        tabBar.style.bottom = '-50px';
        tabBar.style.height = '99px'; // 49px tab + 50px overflow
        tabBar.style.paddingBottom = '50px';
        
        // Create or update background extender
        let extender = document.getElementById('tab-bar-extender');
        if (!extender) {
            extender = document.createElement('div');
            extender.id = 'tab-bar-extender';
            extender.style.position = 'fixed';
            extender.style.bottom = '0';
            extender.style.left = '0';
            extender.style.right = '0';
            extender.style.height = '100px';
            extender.style.background = 'rgba(255, 255, 255, 0.95)';
            extender.style.zIndex = '99';
            document.body.appendChild(extender);
        }
        
        console.log('Tab bar extended to cover gap');
    }
}

// Run fix on load and orientation change
window.addEventListener('load', fixIOSTabBar);
window.addEventListener('orientationchange', fixIOSTabBar);
window.addEventListener('resize', fixIOSTabBar);

// Also run after a short delay to ensure CSS is loaded
setTimeout(fixIOSTabBar, 100);

// App State
const app = {
    currentView: 'homeView',
    transitioning: false
};

// DOM Elements
const tabItems = document.querySelectorAll('.tab-item');
const views = document.querySelectorAll('.view');

// Tab Navigation with iOS animations
tabItems.forEach((tab, index) => {
    tab.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (app.transitioning) return;
        
        const targetView = this.dataset.view;
        
        if (targetView === app.currentView) {
            // Bounce effect for current tab
            animateTabBounce(this);
            return;
        }
        
        switchView(targetView, this, index);
    });
    
    // Add touch feedback
    tab.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.92)';
    });
    
    tab.addEventListener('touchend', function() {
        this.style.transform = '';
    });
});

function animateTabBounce(tabElement) {
    const icon = tabElement.querySelector('.tab-icon');
    icon.style.animation = 'tabBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    setTimeout(() => {
        icon.style.animation = '';
    }, 400);
}

function switchView(targetViewId, tabElement, tabIndex) {
    app.transitioning = true;
    
    const currentView = document.getElementById(app.currentView);
    const targetView = document.getElementById(targetViewId);
    const currentTabIndex = Array.from(tabItems).findIndex(tab => tab.classList.contains('active'));
    
    // Animate tab bar icons
    animateTabSwitch(currentTabIndex, tabIndex);
    
    // Update tab states with animation
    tabItems.forEach((tab, idx) => {
        if (idx === tabIndex) {
            tab.classList.add('active');
            const icon = tab.querySelector('.tab-icon');
            const label = tab.querySelector('.tab-label');
            
            // Animate icon
            icon.style.animation = 'iconPop 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            // Animate label
            label.style.animation = 'labelFade 0.25s ease-out';
            
            setTimeout(() => {
                icon.style.animation = '';
                label.style.animation = '';
            }, 350);
        } else if (tab.classList.contains('active')) {
            tab.classList.remove('active');
            const icon = tab.querySelector('.tab-icon');
            icon.style.animation = 'iconShrink 0.2s ease-out';
            setTimeout(() => {
                icon.style.animation = '';
            }, 200);
        }
    });
    
    // Determine animation direction and style
    const goingForward = tabIndex > currentTabIndex;
    const distance = Math.abs(tabIndex - currentTabIndex);
    
    // Different animations based on distance
    if (distance === 1) {
        // Adjacent tabs - smooth slide
        performSlideTransition(currentView, targetView, goingForward);
    } else {
        // Non-adjacent tabs - fade through
        performFadeTransition(currentView, targetView);
    }
}

function performSlideTransition(currentView, targetView, goingForward) {
    // Store scroll positions
    const currentScroll = currentView.querySelector('.content-scroll').scrollTop;
    
    // Prepare views
    targetView.style.transition = 'none';
    targetView.style.transform = goingForward ? 'translateX(100%)' : 'translateX(-100%)';
    targetView.style.opacity = '1';
    targetView.style.visibility = 'visible';
    
    // Add depth effect
    currentView.style.transformOrigin = goingForward ? 'left center' : 'right center';
    targetView.style.transformOrigin = goingForward ? 'right center' : 'left center';
    
    // Force reflow
    targetView.offsetHeight;
    
    // Apply iOS spring animation
    const springTiming = 'cubic-bezier(0.36, 0.66, 0.04, 1)';
    const duration = '0.4s';
    
    targetView.style.transition = `transform ${duration} ${springTiming}, opacity ${duration} ease`;
    currentView.style.transition = `transform ${duration} ${springTiming}, opacity ${duration} ease, filter ${duration} ease`;
    
    // Animate
    requestAnimationFrame(() => {
        targetView.style.transform = 'translateX(0) scale(1)';
        targetView.style.opacity = '1';
        
        currentView.style.transform = goingForward ? 
            'translateX(-25%) scale(0.95)' : 
            'translateX(25%) scale(0.95)';
        currentView.style.opacity = '0';
        currentView.style.filter = 'blur(2px)';
    });
    
    setTimeout(() => {
        completeTransition(currentView, targetView);
    }, 400);
}

function performFadeTransition(currentView, targetView) {
    // For non-adjacent tabs, use a crossfade
    targetView.style.transition = 'none';
    targetView.style.transform = 'scale(0.92)';
    targetView.style.opacity = '0';
    targetView.style.visibility = 'visible';
    
    // Force reflow
    targetView.offsetHeight;
    
    // Animate with spring
    targetView.style.transition = 'transform 0.35s cubic-bezier(0.36, 0.66, 0.04, 1), opacity 0.25s ease-out';
    currentView.style.transition = 'transform 0.25s ease-in, opacity 0.25s ease-in';
    
    requestAnimationFrame(() => {
        targetView.style.transform = 'scale(1)';
        targetView.style.opacity = '1';
        
        currentView.style.transform = 'scale(1.05)';
        currentView.style.opacity = '0';
    });
    
    setTimeout(() => {
        completeTransition(currentView, targetView);
    }, 350);
}

function completeTransition(currentView, targetView) {
    currentView.classList.remove('active');
    targetView.classList.add('active');
    
    // Reset current view
    currentView.style.transition = 'none';
    currentView.style.transform = 'translateX(100%)';
    currentView.style.opacity = '0';
    currentView.style.visibility = 'hidden';
    currentView.style.filter = '';
    currentView.style.transformOrigin = '';
    
    // Reset target view
    targetView.style.transformOrigin = '';
    
    app.currentView = targetView.id;
    app.transitioning = false;
    
    // Subtle haptic feedback
    if (window.navigator.vibrate) {
        window.navigator.vibrate([2, 1, 2]);
    }
}

function animateTabSwitch(fromIndex, toIndex) {
    const tabBar = document.querySelector('.ios-tab-bar');
    const indicator = document.createElement('div');
    indicator.className = 'tab-indicator';
    
    // Calculate positions
    const fromTab = tabItems[fromIndex];
    const toTab = tabItems[toIndex];
    
    if (fromTab && toTab) {
        const fromRect = fromTab.getBoundingClientRect();
        const toRect = toTab.getBoundingClientRect();
        const barRect = tabBar.getBoundingClientRect();
        
        // Create sliding indicator
        indicator.style.cssText = `
            position: absolute;
            bottom: 2px;
            left: ${fromRect.left - barRect.left + fromRect.width / 2 - 15}px;
            width: 30px;
            height: 3px;
            background: var(--ios-blue);
            border-radius: 2px;
            transition: left 0.3s cubic-bezier(0.36, 0.66, 0.04, 1);
            z-index: 1;
        `;
        
        tabBar.appendChild(indicator);
        
        // Animate to new position
        requestAnimationFrame(() => {
            indicator.style.left = `${toRect.left - barRect.left + toRect.width / 2 - 15}px`;
        });
        
        // Remove after animation
        setTimeout(() => {
            indicator.remove();
        }, 300);
    }
}


// Booking State
let currentBooking = {
    package: 'reserved',
    price: 10,
    packageName: 'Reserved Time',
    isParty: false
};

// Form Functions
function incrementValue() {
    const input = document.getElementById('numChildren');
    if (input) {
        input.value = Math.min(parseInt(input.value) + 1, 20);
        updateTotal();
    }
}

function decrementValue() {
    const input = document.getElementById('numChildren');
    if (input) {
        input.value = Math.max(parseInt(input.value) - 1, 1);
        updateTotal();
    }
}

// Booking Functions
function selectBooking(type, element) {
    // Remove selected class from all options
    document.querySelectorAll('.booking-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Visual feedback
    element.style.transform = 'scale(0.97)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
    
    // Update booking state
    const price = element.dataset.price;
    currentBooking.package = type;
    currentBooking.price = parseFloat(price);
    currentBooking.isParty = type === 'party';
    
    // Update package name
    const packageNames = {
        'walkin': 'Walk-In Play',
        'reserved': 'Reserved Time',
        'party': 'Birthday Party'
    };
    currentBooking.packageName = packageNames[type];
    
    // Update summary
    const summaryName = document.querySelector('.package-name');
    const summaryPrice = document.querySelector('.package-price');
    if (summaryName && summaryPrice) {
        summaryName.textContent = currentBooking.packageName;
        if (currentBooking.isParty) {
            summaryPrice.textContent = `Starting at $${currentBooking.price}`;
        } else {
            summaryPrice.textContent = `$${currentBooking.price} per child`;
        }
    }
    
    // Update total
    updateTotal();
    
    // Scroll to form
    const formSection = document.querySelector('.booking-form').closest('.section');
    if (formSection) {
        setTimeout(() => {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }
}

function updateTotal() {
    const numChildren = parseInt(document.getElementById('numChildren')?.value || 1);
    const totalElement = document.getElementById('totalAmount');
    
    if (totalElement) {
        let total;
        if (currentBooking.isParty) {
            // For parties, show base price
            total = currentBooking.price;
        } else {
            // For regular bookings, multiply by children
            total = currentBooking.price * numChildren;
        }
        totalElement.textContent = `$${total}`;
    }
}

function proceedToCheckout() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const numChildren = document.getElementById('numChildren').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // Store booking details
    const bookingDetails = {
        package: currentBooking.packageName,
        date: date,
        time: time,
        children: numChildren,
        total: document.getElementById('totalAmount').textContent
    };
    
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    
    // Show confirmation
    showBookingConfirmation(bookingDetails);
}

function showBookingConfirmation(details) {
    const modal = document.createElement('div');
    modal.className = 'ios-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <button class="modal-close">Cancel</button>
                <h2>Confirm Booking</h2>
                <button class="modal-done">Confirm</button>
            </div>
            <div class="modal-body">
                <div class="confirmation-details">
                    <div class="detail-row">
                        <span class="detail-label">Package:</span>
                        <span class="detail-value">${details.package}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${new Date(details.date).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${details.time}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Children:</span>
                        <span class="detail-value">${details.children}</span>
                    </div>
                    <div class="detail-row total">
                        <span class="detail-label">Total:</span>
                        <span class="detail-value">${details.total}</span>
                    </div>
                </div>
                <p class="confirmation-note">You will receive a confirmation email shortly after booking.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add confirmation styles
    const style = document.createElement('style');
    style.textContent = `
        .confirmation-details {
            background: var(--bg);
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 20px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid var(--separator);
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-row.total {
            font-weight: 600;
            font-size: 18px;
            color: var(--primary);
            margin-top: 8px;
            padding-top: 16px;
        }
        .detail-label {
            color: var(--text-secondary);
        }
        .detail-value {
            font-weight: 500;
        }
        .confirmation-note {
            text-align: center;
            color: var(--text-secondary);
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
    
    // Close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.querySelector('.modal-done').addEventListener('click', () => {
        alert('Booking confirmed! Check your email for details.');
        modal.remove();
        style.remove();
    });
    
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
}

function showBookingModal() {
    // Create iOS-style modal
    const modal = document.createElement('div');
    modal.className = 'ios-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <button class="modal-close">Cancel</button>
                <h2>Book Play Time</h2>
                <button class="modal-done">Done</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" class="ios-input">
                </div>
                <div class="form-group">
                    <label>Time</label>
                    <select class="ios-select">
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                        <option>1:00 PM</option>
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Children</label>
                    <input type="number" value="1" min="1" max="20" class="ios-input">
                </div>
                <div class="form-group">
                    <label>Your Name</label>
                    <input type="text" class="ios-input" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" class="ios-input" placeholder="(555) 123-4567">
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .ios-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            display: flex;
            align-items: flex-end;
        }
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            animation: fadeIn 0.3s;
        }
        .modal-content {
            position: relative;
            background: var(--card-bg);
            border-radius: 12px 12px 0 0;
            width: 100%;
            max-height: 90vh;
            animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 0.5px solid var(--separator);
        }
        .modal-header h2 {
            font-size: 17px;
            font-weight: 600;
        }
        .modal-close, .modal-done {
            background: none;
            border: none;
            color: var(--ios-blue);
            font-size: 17px;
            font-weight: 500;
        }
        .modal-body {
            padding: 20px;
            overflow-y: auto;
            max-height: calc(90vh - 60px);
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.querySelector('.modal-done').addEventListener('click', () => {
        alert('Booking confirmed!');
        modal.remove();
        style.remove();
    });
    
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
}

// Location Functions
function openMaps() {
    window.open('https://maps.google.com/?q=520+N+Broadway+St+Suite+A+Joshua+TX+76058', '_blank');
}

function callUs() {
    window.location.href = 'tel:+18175550123';
}

function emailUs() {
    window.location.href = 'mailto:hello@dreamlandplaycafe.com';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Add iOS bounce effect prevention
    document.body.addEventListener('touchmove', function(e) {
        if (!e.target.closest('.content-scroll')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add pull-to-refresh prevention
    let startY = 0;
    document.addEventListener('touchstart', e => {
        startY = e.touches[0].pageY;
    });
    
    document.addEventListener('touchmove', e => {
        const y = e.touches[0].pageY;
        const scrollTop = document.querySelector('.view.active .content-scroll')?.scrollTop || 0;
        
        if (scrollTop === 0 && y > startY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Set initial view
    document.getElementById(app.currentView).classList.add('active');
});