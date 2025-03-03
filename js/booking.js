document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const seatsContainer = document.getElementById('seatsContainer');
    const totalAmount = document.getElementById('totalAmount');
    
    let selectedSeats = [];
    const TICKET_PRICE = 10; // Price per ticket in dollars

    // Generate seats
    function generateSeats() {
        for (let i = 1; i <= 48; i++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.setAttribute('data-seat', i);
            seat.innerHTML = i;
            
            seat.addEventListener('click', function() {
                seat.classList.toggle('selected');
                updateSelectedSeats();
            });
            
            seatsContainer.appendChild(seat);
        }
    }

    function updateSelectedSeats() {
        selectedSeats = Array.from(document.querySelectorAll('.seat.selected'))
            .map(seat => seat.getAttribute('data-seat'));
        
        totalAmount.textContent = (selectedSeats.length * TICKET_PRICE).toFixed(2);
        document.getElementById('selectedSeats').value = selectedSeats.join(',');
    }

    // Handle form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (selectedSeats.length === 0) {
                alert('Please select at least one seat');
                return;
            }

            const formData = new FormData(bookingForm);
            const bookingDetails = {
                movie: formData.get('movie'),
                date: formData.get('date'),
                seats: selectedSeats,
                total: selectedSeats.length * TICKET_PRICE
            };

            // Store booking in localStorage (in real app, this would be a server call)
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push(bookingDetails);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            alert('Booking successful!');
            bookingForm.reset();
            document.querySelectorAll('.seat.selected').forEach(seat => {
                seat.classList.remove('selected');
            });
            updateSelectedSeats();
        });
    }

    // Initialize seats if we're on the booking page
    if (seatsContainer) {
        generateSeats();
    }
});
