// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize charts
    initializeCharts();
    
    // Load recent bookings
    loadRecentBookings();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set current date in header if needed
    updateHeaderDate();
}

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue ($)',
                data: [32000, 35000, 38000, 42000, 39000, 45000],
                borderColor: '#1a472a',
                backgroundColor: 'rgba(26, 71, 42, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Occupancy Chart
    const occupancyCtx = document.getElementById('occupancyChart').getContext('2d');
    const occupancyChart = new Chart(occupancyCtx, {
        type: 'bar',
        data: {
            labels: ['Standard', 'Deluxe', 'Suite', 'Villa'],
            datasets: [{
                label: 'Occupancy Rate (%)',
                data: [75, 82, 68, 90],
                backgroundColor: [
                    'rgba(26, 71, 42, 0.7)',
                    'rgba(212, 175, 55, 0.7)',
                    'rgba(46, 139, 87, 0.7)',
                    'rgba(52, 58, 64, 0.7)'
                ],
                borderColor: [
                    '#1a472a',
                    '#d4af37',
                    '#2e8b57',
                    '#343a40'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function loadRecentBookings() {
    // Sample booking data
    const bookings = [
        {
            id: 'PR001234',
            guestName: 'John Smith',
            roomType: 'Deluxe Room',
            checkIn: '2025-03-15',
            checkOut: '2025-03-18',
            status: 'confirmed',
            amount: '$897'
        },
        {
            id: 'PR001235',
            guestName: 'Emma Johnson',
            roomType: 'Executive Suite',
            checkIn: '2025-03-16',
            checkOut: '2025-03-20',
            status: 'checked-in',
            amount: '$1,996'
        },
        {
            id: 'PR001236',
            guestName: 'Michael Brown',
            roomType: 'Standard Room',
            checkIn: '2025-03-12',
            checkOut: '2025-03-14',
            status: 'completed',
            amount: '$398'
        },
        {
            id: 'PR001237',
            guestName: 'Sarah Davis',
            roomType: 'Luxury Villa',
            checkIn: '2025-03-20',
            checkOut: '2025-03-25',
            status: 'pending',
            amount: '$3,995'
        },
        {
            id: 'PR001238',
            guestName: 'Robert Wilson',
            roomType: 'Deluxe Room',
            checkIn: '2025-03-18',
            checkOut: '2025-03-21',
            status: 'confirmed',
            amount: '$897'
        }
    ];

    const tableBody = document.getElementById('bookingsTableBody');
    tableBody.innerHTML = '';

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        
        // Determine status class and text
        let statusClass = '';
        let statusText = '';
        
        switch(booking.status) {
            case 'confirmed':
                statusClass = 'status-confirmed';
                statusText = 'Confirmed';
                break;
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Pending';
                break;
            case 'checked-in':
                statusClass = 'status-checked-in';
                statusText = 'Checked In';
                break;
            case 'completed':
                statusClass = 'status-confirmed';
                statusText = 'Completed';
                break;
            case 'cancelled':
                statusClass = 'status-cancelled';
                statusText = 'Cancelled';
                break;
        }
        
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.guestName}</td>
            <td>${booking.roomType}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td>${formatDate(booking.checkOut)}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${booking.amount}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline view-booking" data-id="${booking.id}">View</button>
                <button class="btn btn-sm btn-primary edit-booking" data-id="${booking.id}">Edit</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    // Add event listeners to booking action buttons
    document.querySelectorAll('.view-booking').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            viewBookingDetails(bookingId);
        });
    });

    document.querySelectorAll('.edit-booking').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            editBooking(bookingId);
        });
    });
}

function setupEventListeners() {
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Navigation items
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            this.parentElement.classList.add('active');
            
            // Update main header title
            const sectionName = this.querySelector('span').textContent;
            document.querySelector('.main-header h1').textContent = sectionName;
            
            // In a real app, you would load the appropriate content here
            console.log(`Loading ${sectionName} section...`);
        });
    });

    // Logout button
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                // In a real app, this would redirect to logout endpoint
                alert('Logging out...');
                window.location.href = 'index.html'; // Redirect to main site
            }
        });
    }

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

function viewBookingDetails(bookingId) {
    // In a real app, this would fetch booking details from an API
    const bookingDetails = {
        id: bookingId,
        guestName: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        roomType: 'Deluxe Room',
        checkIn: '2025-03-15',
        checkOut: '2025-03-18',
        nights: 3,
        guests: {
            adults: 2,
            children: 0
        },
        specialRequests: 'Early check-in requested if possible',
        status: 'confirmed',
        amount: '$897',
        paymentStatus: 'paid'
    };

    const modal = document.getElementById('bookingModal');
    const detailsContainer = document.getElementById('bookingDetails');
    
    detailsContainer.innerHTML = `
        <div class="booking-detail">
            <div class="detail-row">
                <div class="detail-item">
                    <strong>Guest Name:</strong> ${bookingDetails.guestName}
                </div>
                <div class="detail-item">
                    <strong>Email:</strong> ${bookingDetails.email}
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item">
                    <strong>Phone:</strong> ${bookingDetails.phone}
                </div>
                <div class="detail-item">
                    <strong>Room Type:</strong> ${bookingDetails.roomType}
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item">
                    <strong>Check-in:</strong> ${formatDate(bookingDetails.checkIn)}
                </div>
                <div class="detail-item">
                    <strong>Check-out:</strong> ${formatDate(bookingDetails.checkOut)}
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item">
                    <strong>Nights:</strong> ${bookingDetails.nights}
                </div>
                <div class="detail-item">
                    <strong>Guests:</strong> ${bookingDetails.guests.adults} adults, ${bookingDetails.guests.children} children
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item">
                    <strong>Status:</strong> <span class="status-badge status-confirmed">${bookingDetails.status}</span>
                </div>
                <div class="detail-item">
                    <strong>Payment:</strong> <span class="status-badge status-confirmed">${bookingDetails.paymentStatus}</span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item full-width">
                    <strong>Special Requests:</strong> ${bookingDetails.specialRequests}
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item full-width">
                    <strong>Total Amount:</strong> ${bookingDetails.amount}
                </div>
            </div>
        </div>
        <div class="modal-actions" style="margin-top: 1.5rem; display: flex; gap: 10px;">
            <button class="btn btn-primary" onclick="editBooking('${bookingId}')">Edit Booking</button>
            <button class="btn btn-outline" onclick="sendConfirmation('${bookingId}')">Send Confirmation</button>
            <button class="btn btn-outline" onclick="printInvoice('${bookingId}')">Print Invoice</button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function editBooking(bookingId) {
    // In a real app, this would open an edit form
    alert(`Edit booking ${bookingId} - This would open an edit form in a real application`);
}

function sendConfirmation(bookingId) {
    // In a real app, this would send a confirmation email
    alert(`Confirmation email sent for booking ${bookingId}`);
}

function printInvoice(bookingId) {
    // In a real app, this would generate and print an invoice
    alert(`Printing invoice for booking ${bookingId}`);
}

function updateHeaderDate() {
    // Optionally update header with current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // You could add this to the header if desired
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(notificationStyles);