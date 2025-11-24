// Booking functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBookingForm();
});

function initializeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const adults = document.getElementById('adults').value;
        const children = document.getElementById('children').value;
        const roomType = document.getElementById('roomType').value;
        
        // Validate dates
        if (!checkin || !checkout) {
            showNotification('Please select check-in and check-out dates', 'error');
            return;
        }
        
        if (new Date(checkin) >= new Date(checkout)) {
            showNotification('Check-out date must be after check-in date', 'error');
            return;
        }
        
        // Calculate number of nights
        const nights = calculateNights(checkin, checkout);
        
        // Show loading state
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Checking Availability...';
        submitButton.disabled = true;
        
        // Simulate API call to check availability
        setTimeout(() => {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Show availability results
            showAvailabilityResults({
                checkin,
                checkout,
                nights,
                adults,
                children,
                roomType,
                available: true,
                price: calculatePrice(roomType, nights)
            });
        }, 2000);
    });
}

function calculateNights(checkin, checkout) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(checkin);
    const secondDate = new Date(checkout);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

function calculatePrice(roomType, nights) {
    const prices = {
        standard: 199,
        deluxe: 299,
        suite: 499,
        villa: 799
    };
    
    return prices[roomType] * nights;
}

function showAvailabilityResults(bookingDetails) {
    const roomNames = {
        standard: 'Standard Room',
        deluxe: 'Deluxe Room',
        suite: 'Executive Suite',
        villa: 'Luxury Villa'
    };
    
    if (bookingDetails.available) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2 style="margin-bottom: 1rem; color: var(--primary);">Room Available!</h2>
                <div style="margin-bottom: 1.5rem;">
                    <p><strong>Room:</strong> ${roomNames[bookingDetails.roomType]}</p>
                    <p><strong>Check-in:</strong> ${formatDate(bookingDetails.checkin)}</p>
                    <p><strong>Check-out:</strong> ${formatDate(bookingDetails.checkout)}</p>
                    <p><strong>Nights:</strong> ${bookingDetails.nights}</p>
                    <p><strong>Guests:</strong> ${bookingDetails.adults} adults, ${bookingDetails.children} children</p>
                    <p><strong>Total Price:</strong> $${bookingDetails.price}</p>
                </div>
                <button class="btn btn-primary" id="proceedToPayment" style="width: 100%; margin-bottom: 1rem;">Proceed to Payment</button>
                <button class="btn btn-outline" id="modifyBooking" style="width: 100%;">Modify Booking</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#proceedToPayment').addEventListener('click', () => {
            document.body.removeChild(modal);
            showPaymentForm(bookingDetails);
        });
        
        modal.querySelector('#modifyBooking').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    } else {
        showNotification('Sorry, the selected room is not available for those dates', 'error');
    }
}

function showPaymentForm(bookingDetails) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 style="margin-bottom: 1.5rem; color: var(--primary);">Complete Your Booking</h2>
            <form id="paymentForm">
                <div class="form-group">
                    <label for="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="expiryDate">Expiry Date</label>
                        <input type="text" id="expiryDate" placeholder="MM/YY" required>
                    </div>
                    <div class="form-group">
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" placeholder="123" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="cardName">Name on Card</label>
                    <input type="text" id="cardName" required>
                </div>
                <div class="form-group">
                    <label for="billingEmail">Billing Email</label>
                    <input type="email" id="billingEmail" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Pay $${bookingDetails.price}</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#paymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        processPayment(bookingDetails, modal);
    });
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function processPayment(bookingDetails, modal) {
    const submitButton = modal.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing Payment...';
    submitButton.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        document.body.removeChild(modal);
        showBookingConfirmation(bookingDetails);
    }, 2000);
}

function showBookingConfirmation(bookingDetails) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="text-align: center;">
            <span class="close-modal">&times;</span>
            <div style="color: var(--secondary); font-size: 4rem; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="margin-bottom: 1rem; color: var(--primary);">Booking Confirmed!</h2>
            <p style="margin-bottom: 1.5rem;">Thank you for your booking. A confirmation email has been sent to your email address.</p>
            <div style="background: var(--light); padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem;">
                <p><strong>Booking Reference:</strong> PR${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <button class="btn btn-primary" id="closeConfirmation" style="width: 100%;">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#closeConfirmation').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}