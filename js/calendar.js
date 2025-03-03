document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    
    const events = [
        // Fall Semester 2024
        { id: 1, date: new Date(2024, 7, 7), name: 'Registration - Fall 2024', type: 'academic' },
        { id: 2, date: new Date(2024, 7, 8), name: 'Classes Begin - Fall 2024', type: 'academic' },
        { id: 3, date: new Date(2024, 8, 11), name: 'Minor I Exams - ECSOE/IMSOE/SOC', type: 'exam', endDate: new Date(2024, 8, 14) },
        { id: 4, date: new Date(2024, 8, 30), name: 'Fractal & Mid Term Exams - SOM/SOL', type: 'exam', endDate: new Date(2024, 9, 5) },
        { id: 5, date: new Date(2024, 9, 23), name: 'Minor II Exams - ECSOE/IMSOE/SOC', type: 'exam', endDate: new Date(2024, 9, 26) },
        { id: 6, date: new Date(2024, 9, 28), name: 'Fall Semester Break', type: 'break', endDate: new Date(2024, 10, 1) },
        { id: 7, date: new Date(2024, 11, 9), name: 'Buffer Days', type: 'academic', endDate: new Date(2024, 11, 11) },
        { id: 8, date: new Date(2024, 11, 12), name: 'Major & Supplementary Exams', type: 'exam', endDate: new Date(2024, 11, 28) },

        // Spring Semester 2025
        { id: 9, date: new Date(2025, 0, 16), name: 'Registration - Spring 2025', type: 'academic' },
        { id: 10, date: new Date(2025, 0, 17), name: 'Classes Begin - Spring 2025', type: 'academic' },
        { id: 11, date: new Date(2025, 1, 24), name: 'Minor I Exams - ECSOE/IMSOE/SOC', type: 'exam', endDate: new Date(2025, 1, 28) },
        { id: 12, date: new Date(2025, 2, 17), name: 'Fractal & Mid Term Exams - SOM/SOL', type: 'exam', endDate: new Date(2025, 2, 22) },
        { id: 13, date: new Date(2025, 2, 24), name: 'Spring Semester Break', type: 'break', endDate: new Date(2025, 2, 28) },
        { id: 14, date: new Date(2025, 3, 15), name: 'Minor II Exams - ECSOE/IMSOE/SOC', type: 'exam', endDate: new Date(2025, 3, 19) },
        { id: 15, date: new Date(2025, 4, 22), name: 'Buffer Days', type: 'academic', endDate: new Date(2025, 4, 23) },
        { id: 16, date: new Date(2025, 4, 26), name: 'Major & Supplementary Exams', type: 'exam', endDate: new Date(2025, 5, 7) },

        // Holidays
        { id: 17, date: new Date(2024, 7, 15), name: 'Independence Day', type: 'holiday' },
        { id: 18, date: new Date(2024, 7, 25), name: 'Janmashtami', type: 'holiday' },
        { id: 19, date: new Date(2024, 8, 7), name: 'Ganesh Chaturthi', type: 'holiday' },
        { id: 20, date: new Date(2024, 9, 2), name: 'Mahatma Gandhi Jayanthi', type: 'holiday' },
        { id: 21, date: new Date(2024, 9, 11), name: 'Maha Ashtami', type: 'holiday' },
        { id: 22, date: new Date(2024, 9, 12), name: 'Dussehra', type: 'holiday' },
        { id: 23, date: new Date(2024, 10, 1), name: 'Diwali', type: 'holiday' },
        { id: 24, date: new Date(2024, 10, 15), name: 'Guru Nanak Jayanthi', type: 'holiday' },
        { id: 25, date: new Date(2024, 11, 25), name: 'Christmas', type: 'holiday' },
        { id: 26, date: new Date(2025, 0, 14), name: 'Makar Sankranti', type: 'holiday' },
        { id: 27, date: new Date(2025, 0, 26), name: 'Republic Day', type: 'holiday' },
        { id: 28, date: new Date(2025, 1, 26), name: 'Maha Shivaratri', type: 'holiday' },
        { id: 29, date: new Date(2025, 2, 14), name: 'Holi', type: 'holiday' },
        { id: 30, date: new Date(2025, 2, 30), name: 'Ugadi', type: 'holiday' },
        { id: 31, date: new Date(2025, 2, 31), name: 'Eid', type: 'holiday' },
        { id: 32, date: new Date(2025, 3, 6), name: 'Rama Navami', type: 'holiday' },
        { id: 33, date: new Date(2025, 3, 14), name: 'Ambedkar Jayanthi', type: 'holiday' },
        { id: 34, date: new Date(2025, 3, 18), name: 'Good Friday', type: 'holiday' }
    ];

    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateView(button.textContent.toLowerCase());
        });
    });

    function updateView(viewType) {
        switch(viewType) {
            case 'month':
                renderCalendar();
                break;
            case 'week':
                renderWeekView();
                break;
            case 'day':
                renderDayView();
                break;
            case 'year':
                renderYearView();
                break;
        }
    }

    function isDateInRange(date, event) {
        const eventStart = new Date(event.date);
        const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
        return date >= eventStart && date <= eventEnd;
    }

    function isHoliday(date) {
        // Check if it's a Sunday (0 is Sunday in JavaScript)
        if (date.getDay() === 0) return true;
        
        return events.some(event => 
            event.type === 'holiday' && 
            date.toDateString() === event.date.toDateString()
        );
    }

    function adjustEventForHolidays(event, date) {
        // If it's not an exam, no adjustment needed
        if (event.type !== 'exam') return event;

        // If it's a single-day exam and falls on a holiday or Sunday, return null
        if (!event.endDate && isHoliday(date)) {
            return null;
        }

        // If it's a multi-day exam
        if (event.endDate) {
            const eventStart = new Date(event.date);
            const eventEnd = new Date(event.endDate);
            
            // If the current date is a holiday or Sunday
            if (isHoliday(date)) {
                // If this is the start date, adjust the start date forward
                if (date.toDateString() === eventStart.toDateString()) {
                    let newStart = new Date(date);
                    // Find next available day that's not a holiday or Sunday
                    while (newStart <= eventEnd && isHoliday(newStart)) {
                        newStart.setDate(newStart.getDate() + 1);
                    }
                    if (newStart > eventEnd) return null;
                    
                    // Create new event with adjusted start date
                    return {
                        ...event,
                        date: newStart,
                        name: `${event.name} (Rescheduled)`
                    };
                }
                return null; // Skip this day
            }
        }

        return event;
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        document.getElementById('currentMonth').textContent = 
            `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        // Previous month days
        const prevLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const dayDiv = createDayElement(prevLastDay - i, 'other-month');
            calendarDays.appendChild(dayDiv);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === new Date().toDateString();
            const dayDiv = createDayElement(day, isToday ? 'today' : '');
            
            // Check for events on this day
            events.forEach(event => {
                if (isDateInRange(date, event)) {
                    // Adjust event if it conflicts with a holiday
                    const adjustedEvent = adjustEventForHolidays(event, date);
                    if (adjustedEvent) {
                        const eventDiv = createEventElement(adjustedEvent);
                        
                        // Add classes for start and end dates
                        const isStartDate = date.toDateString() === adjustedEvent.date.toDateString();
                        const isEndDate = adjustedEvent.endDate && 
                                        date.toDateString() === adjustedEvent.endDate.toDateString();
                        
                        if (isStartDate) eventDiv.classList.add('event-start');
                        if (isEndDate) eventDiv.classList.add('event-end');
                        if (!isStartDate && !isEndDate) eventDiv.classList.add('event-middle');
                        
                        dayDiv.appendChild(eventDiv);
                    }
                }
            });

            calendarDays.appendChild(dayDiv);
        }

        // Next month days
        const remainingDays = 42 - (startingDay + daysInMonth);
        for (let day = 1; day <= remainingDays; day++) {
            const dayDiv = createDayElement(day, 'other-month');
            calendarDays.appendChild(dayDiv);
        }

        // Add click handlers for events
        document.querySelectorAll('.event').forEach(event => {
            event.addEventListener('click', (e) => {
                e.stopPropagation();
                showEventDetails(event.dataset.eventId);
            });
        });

        // Add click handlers for days
        document.querySelectorAll('.calendar-day').forEach(day => {
            if (!day.classList.contains('other-month')) {
                day.addEventListener('click', () => {
                    showDayDetails(day.dataset.date);
                });
            }
        });
    }

    function createDayElement(day, className = '') {
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${className}`;
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        
        dayDiv.appendChild(dayNumber);
        return dayDiv;
    }

    function createEventElement(event) {
        const eventDiv = document.createElement('div');
        eventDiv.className = `event ${event.type}`;
        eventDiv.textContent = event.name;
        eventDiv.dataset.eventId = event.id;
        
        // Add tooltip with date range for multi-day events
        if (event.endDate) {
            const startDate = event.date.toLocaleDateString();
            const endDate = event.endDate.toLocaleDateString();
            eventDiv.title = `${event.name}\n${startDate} - ${endDate}`;
        } else {
            eventDiv.title = `${event.name}\n${event.date.toLocaleDateString()}`;
        }
        
        return eventDiv;
    }

    function showEventDetails(eventId) {
        // Implement event details modal
        console.log('Show event details:', eventId);
    }

    function showDayDetails(date) {
        // Implement day details modal
        console.log('Show day details:', date);
    }

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.event').forEach(event => {
            const eventText = event.textContent.toLowerCase();
            event.style.display = eventText.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Navigation handlers
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById('today').addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
    });

    // Initial render
    renderCalendar();
});
