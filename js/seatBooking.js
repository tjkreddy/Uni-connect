document.addEventListener('DOMContentLoaded', function() {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O'];
    const seatsPerRow = 13;
    const sections = ['section1', 'section2', 'section3', 'section4', 'section5', 'section6'];
    const selectedSeats = new Set();

    function createRow(rowLabel, sectionId) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        
        // Add row label
        const label = document.createElement('div');
        label.className = 'row-label';
        label.textContent = rowLabel;
        rowDiv.appendChild(label);
        
        // Create seats container
        const seatsDiv = document.createElement('div');
        seatsDiv.className = 'seats-row';
        
        // Generate seats - all available
        for (let i = 1; i <= seatsPerRow; i++) {
            const seat = document.createElement('div');
            seat.className = 'seat available'; // All seats are available
            seat.dataset.id = `${sectionId}-${rowLabel}${i}`;
            seat.textContent = i;
            seat.addEventListener('click', () => toggleSeat(seat));
            seatsDiv.appendChild(seat);
        }
        
        rowDiv.appendChild(seatsDiv);
        return rowDiv;
    }

    function generateSection(sectionId) {
        const section = document.getElementById(sectionId);
        rows.forEach(rowLabel => {
            section.appendChild(createRow(rowLabel, sectionId));
        });
    }

    function toggleSeat(seat) {
        if (seat.classList.contains('sold')) return;

        // If the clicked seat is already selected, unselect it
        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            seat.classList.add('available');
            selectedSeats.delete(seat.dataset.id);
        } 
        // If trying to select a new seat
        else {
            // First unselect any previously selected seat
            const previouslySelected = document.querySelector('.seat.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
                previouslySelected.classList.add('available');
                selectedSeats.clear();
            }
            
            // Select the new seat
            seat.classList.remove('available');
            seat.classList.add('selected');
            selectedSeats.add(seat.dataset.id);
        }
        
        updateSummary();
    }

    function updateSummary() {
        const seatCount = document.getElementById('seatCount');
        const seatsList = document.getElementById('selectedSeatsList');
        const proceedBtn = document.getElementById('proceedBtn');
        
        seatCount.textContent = `${selectedSeats.size} Seat`;
        seatsList.textContent = Array.from(selectedSeats).join('');
        proceedBtn.disabled = selectedSeats.size === 0;

        // Add click handler for proceed button
        proceedBtn.onclick = () => {
            if (!proceedBtn.disabled) {
                // Store selected seat in localStorage for ticket page
                localStorage.setItem('selectedSeat', Array.from(selectedSeats)[0]);
                window.location.href = 'ticket.html';
            }
        };
    }

    // Generate all sections
    sections.forEach(generateSection);

    // Initial summary update
    updateSummary();
});
