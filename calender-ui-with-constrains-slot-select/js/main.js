let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedYear = document.getElementById('selected-year');
let selectedMonth = document.getElementById('selected-month');
let calendarTitle = document.getElementById('calendar-title');
let monthChoices = document.querySelectorAll('.dropdown-menu.month-select .dropdown-item');
let yearChoices = document.querySelectorAll('.dropdown-menu.year-select .dropdown-item');

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

monthChoices.forEach(function (month) {
	month.addEventListener('click', function (e) {
		currentMonth = parseInt(this.getAttribute('index'));
		showCalendar(currentMonth, currentYear);
	});
});

yearChoices.forEach(function (year) {
	year.addEventListener('click', function (e) {
		currentYear = parseInt(this.textContent);
		showCalendar(currentMonth, currentYear);
	});
});

function next() {
	currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
	currentMonth = (currentMonth + 1) % 12;
	showCalendar(currentMonth, currentYear);
}

function previous() {
	currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
	currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
	showCalendar(currentMonth, currentYear);
}

function daysInMonth(iMonth, iYear) {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

function showCalendar(month, year) {
	let firstDay = new Date(year, month).getDay();

	tbl = document.getElementById('calendar-body'); // body of the calendar

	// clearing all previous cells
	tbl.innerHTML = '';

	// filing data about month and in the page via DOM.
	calendarTitle.innerHTML = months[month] + ' ' + year;
	selectedYear.textContent = year;
	selectedMonth.textContent = months[month];

	// active State
	monthChoices.forEach((m) => {
		m.classList.remove('active');
		if (parseInt(m.getAttribute('index')) === month) {
			m.classList.add('active');
		}
	});

	yearChoices.forEach((y) => {
		y.classList.remove('active');
		if (parseInt(y.text) === year) {
			y.classList.add('active');
		}
	});

	// creating all cells
	let date = 1;
	for (let i = 0; i < 6; i++) {
		// creates a table row
		let row = document.createElement('tr');

		//creating individual cells, filing them up with data.
		for (let j = 0; j < 7; j++) {
			if (i === 0 && j < firstDay) {
				cell = document.createElement('td');
				cellText = document.createTextNode('');
				cell.appendChild(cellText);
				row.appendChild(cell);
			} else if (date > daysInMonth(month, year)) {
				break;
			} else {
				cell = document.createElement('td');
				cell.classList.add('border', 'day-slot');
				cellText = document.createTextNode(date);
				if (
					date === today.getDate() &&
					year === today.getFullYear() &&
					month === today.getMonth()
				) {
					cell.classList.add('bg-grey');
				} // color today's date
				cell.appendChild(cellText);
				row.appendChild(cell);
				date++;
			}
		}

		tbl.appendChild(row); // appending each row into calendar body.
	}
}

showCalendar(currentMonth, currentYear);
