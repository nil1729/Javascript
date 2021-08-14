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

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
				const weekDayIndex = new Date(year, month, date).getDay();
				cellText = document.createTextNode(date);
				cell = document.createElement('td');
				cell.id = `${year}-${month}-${date}`;
				cell.setAttribute('week', i);

				if (weekDayIndex === 0 || weekDayIndex === 6) {
					cell.classList.add('border', 'weekend');
				} else {
					cell.classList.add('border', 'day-slot');
				}

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
	showSectionColorWise();
	updateScheduledDateSlots();
}

let scheduledEvents = getSavedEvents();

document.addEventListener('click', (e) => {
	if (e.target && e.target.id && e.target.classList.contains('day-slot')) {
		let [y, m, d] = e.target.id.split('-');
		const weekIndex = e.target.getAttribute('week');
		let currDate = new Date(y, m, d);

		if (isNaN(currDate)) return;

		if (monthIsScheduled(y, m)) {
			if (isLimitReached(y, m)) return showWarning('Maximum Limit for a month is reached!');
			// Further Checks
			const scheduledWeeks = monthIsScheduled(y, m).dates.map((obj) => obj.weekIndex);
			if (scheduledWeeks.includes(weekIndex)) return;

			let selectedSlotDateStr = monthIsScheduled(y, m).dates[0].date;
			let selectedSlotWeekIndex = parseInt(monthIsScheduled(y, m).dates[0].weekIndex);
			let selectedSlotDate = new Date(selectedSlotDateStr);
			const isEven = selectedSlotDate.getDay() % 2 === 0;
			const availableDateSlots = [];
			document.querySelectorAll('#calendar-body tr td').forEach((node) => {
				if (node && node.getAttribute('week'))
					availableDateSlots.push({
						dateStr: node.id,
						weekIndex: parseInt(node.getAttribute('week')),
					});
			});

			const desiredWeekSlot = availableDateSlots.filter((slot) => {
				let [yy, mm, dd] = slot.dateStr.split('-');
				const slotIsEven = new Date(yy, mm, dd).getDay() % 2 === 0;

				if (Math.abs(selectedSlotWeekIndex - slot.weekIndex) % 2 === 0) {
					return isEven === slotIsEven;
				} else {
					return isEven !== slotIsEven;
				}
			});
			const isValidClickedSlot = desiredWeekSlot.find((slot) => slot.dateStr === e.target.id);
			if (isValidClickedSlot) scheduledNewEvent(y, m, d, weekIndex);
		} else {
			scheduledNewEvent(y, m, d, weekIndex);
		}
		saveEvents();
		showEventOnUI();
	}
});

function monthIsScheduled(y, m) {
	return scheduledEvents.find((sc) => sc.id === `${y}-${m}`);
}

function isLimitReached(y, m) {
	let requiredMonth = scheduledEvents.find((sc) => sc.id === `${y}-${m}`);

	if (!requiredMonth) return false;
	return requiredMonth.dates.length === 4;
}

function scheduledNewEvent(y, m, d, weekIndex) {
	let currDate = new Date(y, m, d);
	if (monthIsScheduled(y, m)) {
		scheduledEvents = scheduledEvents.map((sc) => {
			if (sc.id === `${y}-${m}`) {
				return { ...sc, dates: [...sc.dates, { date: currDate, weekIndex }] };
			} else {
				return sc;
			}
		});
	} else {
		let ev = {
			id: `${y}-${m}`,
			title: `${months[m]} ${y}`,
			dates: [{ date: currDate, weekIndex }],
		};
		scheduledEvents.push(ev);
	}

	updateScheduledDateSlots();
}

function sortEvents() {
	scheduledEvents.sort(function (a, b) {
		const [y1, m1] = a.id.split('-');
		const [y2, m2] = b.id.split('-');

		var keyA = new Date(y1, m1),
			keyB = new Date(y2, m2);

		// Compare the 2 dates
		if (keyA > keyB) return -1;
		if (keyA < keyB) return 1;
		return 0;
	});
	scheduledEvents.forEach(function (month) {
		month.dates.sort(function (a, b) {
			var keyA = new Date(a.date),
				keyB = new Date(b.date);

			// Compare the 2 dates
			if (keyA > keyB) return -1;
			if (keyA < keyB) return 1;
			return 0;
		});
	});
}

function saveEvents() {
	localStorage.setItem('SCHEDULED_EVENTS', JSON.stringify(scheduledEvents));
}

function getSavedEvents() {
	if (localStorage.getItem('SCHEDULED_EVENTS')) {
		return JSON.parse(localStorage.getItem('SCHEDULED_EVENTS'));
	} else return [];
}

function showEventOnUI() {
	sortEvents();
	const eventContainer = document.getElementById('scroll-event-container');
	eventContainer.innerHTML = '';
	scheduledEvents.forEach(function (month) {
		const monthlyContainer = document.createElement('div');
		const header = document.createElement('p');
		const headerTitle = document.createTextNode(month.title);
		header.appendChild(headerTitle);
		header.classList.add('lead', 'bg-light', 'px-2', 'py-1', 'mb-0', 'border');
		monthlyContainer.appendChild(header);

		// Event Showing
		const listContainer = document.createElement('ol');
		listContainer.classList.add('list-group', 'list-group-numbered');

		month.dates.forEach((obj, index) => {
			const listItem = document.createElement('li');
			listItem.classList.add(
				'list-group-item',
				'd-flex',
				'justify-content-between',
				'align-items-start'
			);
			const date = new Date(obj.date);
			const oddOrEven = date.getDay() % 2 === 0 ? 'Even' : 'Odd';
			const weekday = weekDays[date.getDay()];

			listItem.innerHTML = `
				<div class="ms-2 me-auto">
					<div class="fw-bold">${oddOrEven} Schedule</div>
						${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} - ${weekday}
					</div>
					<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
				</div>
			`;
			listContainer.appendChild(listItem);
		});

		// Last
		monthlyContainer.appendChild(listContainer);
		monthlyContainer.classList.add('mb-2');
		eventContainer.appendChild(monthlyContainer);
	});
}

function updateScheduledDateSlots() {
	scheduledEvents.forEach(function (month) {
		month.dates.forEach(function (obj) {
			const dateObj = new Date(obj.date);
			const requiredSlotId = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
			const elem = document.getElementById(requiredSlotId);
			if (elem) {
				elem.classList.add('scheduled-day-slot');
			}
		});
	});
}

let prevWarning = null;
function showWarning(msg) {
	window.clearTimeout(prevWarning);

	const toast = document.getElementById('liveToast');
	const messageElement = document.getElementById('notification-message');
	messageElement.textContent = msg;
	toast.classList.remove('hide');

	prevWarning = window.setTimeout(() => {
		toast.classList.add('hide');
	}, 5000);
}

function showSectionColorWise() {
	const weeks = [];
	document.querySelectorAll('#calendar-body tr').forEach((node) => {
		if (node.children.length === 7 && node.firstChild.textContent !== '') {
			weeks.push(node);
		}
	});

	let startType = 3;
	let otherType = 2;

	for (let i = 0; i < weeks.length; i++) {
		// let [fy, fm, fd] = weeks[i].firstChild.id.split('-');
		// let firstDate = new Date(fy, fm, fd);
		const childs = [];
		weeks[i].childNodes.forEach((child) => childs.push(child));
		if (i % 2 === 0) {
			let firstGroup = childs.slice(1, startType + 1);
			let secondGroup = childs.slice(startType + 1, 6);
			firstGroup.forEach((node) => {
				node.classList.add(`type-${startType}`);
			});
			secondGroup.forEach((node) => {
				node.classList.add(`type-${otherType}`);
			});
		} else {
			let firstGroup = childs.slice(1, otherType + 1);
			let secondGroup = childs.slice(otherType + 1, 6);
			firstGroup.forEach((node) => {
				node.classList.add(`type-${otherType}`);
			});
			secondGroup.forEach((node) => {
				node.classList.add(`type-${startType}`);
			});
		}
	}
}

showCalendar(currentMonth, currentYear);
showEventOnUI();
