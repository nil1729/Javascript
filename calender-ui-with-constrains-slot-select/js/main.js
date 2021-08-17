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
	updateScheduledDateSlots();
	showSectionColorWise();
}

let scheduledEvents = getSavedEvents();

document.addEventListener('click', (e) => {
	if (e.target && e.target.id && e.target.classList.contains('day-slot')) {
		let [y, m, d] = e.target.id.split('-');

		let newMn = parseInt(m);
		let today = new Date();
		let nextMn = (new Date().getMonth() + 1) % 12;
		// let next2Mn = (nextMn + 1) % 12;

		if (today.getMonth() > 0 && today.getMonth() > newMn) {
			return showWarning('You can only select from ongoing or following month');
		}
		if (newMn !== nextMn && today.getMonth() !== newMn) {
			return showWarning('You can only select from ongoing or following month');
		}
		if (e.target.classList.contains('selected')) {
			return deleteEvent(e.target);
		}

		if (monthIsScheduled(y, m)) {
			if (isLimitReached(y, m)) {
				return showWarning('Maximum limit for a month is reached!');
			}
			if (
				!e.target.classList.contains('type-2-unselected') &&
				!e.target.classList.contains('type-3-unselected')
			) {
				return showWarning('This is not valid selection slot');
			}
			scheduledNewEvent(e.target);
		} else {
			scheduledNewEvent(e.target);
		}
		saveEvents();
	}

	if (e.target && e.target.id && e.target.id.startsWith('close:')) {
	}
});

document.getElementById('submit-btn').addEventListener('click', async function (e) {
	document.getElementById('submit-btn').textContent = 'Saving Selections ...';
	document.getElementById('submit-btn').setAttribute('disabled', 'disabled');
	const resp = await fetch('http://httpbin.org/post', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', accept: 'application/json' },
		body: JSON.stringify(scheduledEvents),
	});
	const data = await resp.json();
	console.log(data);
	document.getElementById('submit-btn').textContent = 'Selection Saved';
	document.getElementById('submit-btn').classList.add('btn-outline-success');
	setTimeout(() => {
		document.getElementById('submit-btn').removeAttribute('disabled');
		document.getElementById('submit-btn').textContent = 'Submit';
		document.getElementById('submit-btn').classList.remove('btn-outline-success');
	}, 2000);
});

function deleteEvent(elem) {
	let [y, m, d] = elem.id.split('-');
	let sectionAttr = elem.getAttribute('section');
	let dates = [];
	document.querySelectorAll('#calendar-body tr td').forEach(function (node) {
		if (node.getAttribute('section') === sectionAttr) {
			dates.push(node);
		}
	});

	let sectionId = dateToYMD(parseDate(dates[0].id));
	// Next Month Check
	let newMn = (parseInt(m) + 1) % 12;
	let newYr = newMn === 0 ? parseInt(y) + 1 : parseInt(y);

	scheduledEvents = scheduledEvents.map(function (it) {
		if (monthIsScheduled(y, m).id === it.id || it.id === `${newYr}-${newMn}`) {
			let mn = monthIsScheduled(y, m);
			mn.sections = mn.sections.filter((sc) => sc.id !== sectionId);
			return mn;
		} else return it;
	});

	scheduledEvents = scheduledEvents.filter((month) => month.sections.length > 0);
	saveEvents();
	updateScheduledDateSlots();
	showEventOnUI();
}

function firstValidWeek() {
	let firstWeekIndex = -1;
	document.querySelectorAll('#calendar-body tr').forEach((node, index) => {
		if (firstWeekIndex === -1 && node.childNodes[1].textContent !== '') {
			firstWeekIndex = index;
		}
	});
	return firstWeekIndex;
}

function monthIsScheduled(y, m) {
	return scheduledEvents.find((sc) => sc.id === `${y}-${m}`);
}

function findClickedWeek(elem) {
	return parseInt(elem.getAttribute('week'));
}

function isLimitReached(y, m) {
	let requiredMonth = scheduledEvents.find((sc) => sc.id === `${y}-${m}`);

	if (!requiredMonth) return false;
	return requiredMonth.sections.length === 4;
}

function scheduledNewEvent(elem) {
	let [y, m, d] = elem.id.split('-');
	if (monthIsScheduled(y, m)) {
		scheduledEvents = scheduledEvents.map((sc) => {
			if (sc.id === `${y}-${m}`) {
				const weekIndex = parseInt(elem.getAttribute('week'));
				const cls = elem.className.split(' ').filter((it) => it.endsWith('unselected'));
				const slotType = cls[0].split('-')[1];
				let dates = [];
				document.querySelectorAll(`.${cls[0]}`).forEach((node) => {
					if (parseInt(node.getAttribute('week')) === weekIndex) {
						dates.push(parseDate(node.id));
					}
				});
				if (parseInt(slotType) > dates.length) {
					let rem = parseInt(slotType) - dates.length;
				}
				let newGroup = { id: `${dateToYMD(dates[0])}`, dates: dates, type: slotType };

				if (parseInt(slotType) > dates.length) {
					let rem = parseInt(slotType) - dates.length;
					let lastGroupDate = new Date(dates[dates.length - 1]);
					while (rem > 0) {
						newGroup.dates.push(new Date(lastGroupDate.setDate(lastGroupDate.getDate() + 1)));
						rem--;
					}
				}

				// Next Month
				let newMn = (parseInt(m) + 1) % 12;
				let newYr = newMn === 0 ? parseInt(y) + 1 : parseInt(y);
				let newEv = {
					id: `${newYr}-${newMn}`,
					title: `${months[newMn]} ${newYr}`,
					sections: [newGroup],
				};
				if (new Date(newGroup.dates[newGroup.dates.length - 1]).getMonth() === newMn) {
					scheduledEvents.push(newEv);
				}

				sc.sections.push(newGroup);
				return sc;
			} else {
				return sc;
			}
		});
	} else {
		let ev = {
			id: `${y}-${m}`,
			title: `${months[m]} ${y}`,
			sections: [],
		};
		const weekIndex = parseInt(elem.getAttribute('week'));
		const cls = elem.className.split(' ').filter((it) => it.endsWith('unselected'));
		const slotType = cls[0].split('-')[1];
		let dates = [];
		document.querySelectorAll(`.${cls[0]}`).forEach((node) => {
			if (parseInt(node.getAttribute('week')) === weekIndex) {
				dates.push(parseDate(node.id));
			}
		});
		let newGroup = { id: `${dateToYMD(dates[0])}`, dates: dates, type: slotType };

		if (parseInt(slotType) > dates.length) {
			let rem = parseInt(slotType) - dates.length;
			let lastGroupDate = new Date(dates[dates.length - 1]);
			while (rem > 0) {
				newGroup.dates.push(new Date(lastGroupDate.setDate(lastGroupDate.getDate() + 1)));
				rem--;
			}
		}

		ev.sections.push(newGroup);
		scheduledEvents.push(ev);

		// Next Month
		let newMn = (parseInt(m) + 1) % 12;
		let newYr = newMn === 0 ? parseInt(y) + 1 : parseInt(y);
		let newEv = {
			id: `${newYr}-${newMn}`,
			title: `${months[newMn]} ${newYr}`,
			sections: [newGroup],
		};
		if (new Date(newGroup.dates[newGroup.dates.length - 1]).getMonth() === newMn) {
			scheduledEvents.push(newEv);
		}
	}
	updateScheduledDateSlots();
	showEventOnUI();
}

function parseDate(id, arg) {
	let [y, m, d] = id.split('-');
	return new Date(y, m, d);
}

function dateToYMD(date) {
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
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
}

function saveEvents() {
	localStorage.setItem('SCHEDULED_EVENTS_V10', JSON.stringify(scheduledEvents));
}

function getSavedEvents() {
	if (localStorage.getItem('SCHEDULED_EVENTS_V10')) {
		return JSON.parse(localStorage.getItem('SCHEDULED_EVENTS_V10'));
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
		header.classList.add('bg-light', 'px-2', 'py-1', 'mb-0', 'border');
		monthlyContainer.appendChild(header);

		// Event Showing
		const listContainer = document.createElement('ol');
		listContainer.classList.add('list-group', 'list-group-numbered');

		month.sections.forEach((obj, index) => {
			const listItem = document.createElement('li');
			listItem.classList.add(
				'list-group-item',
				'd-flex',
				'justify-content-between',
				'align-items-start'
			);

			let datesStr = ``;
			obj.dates.forEach((dtStr) => {
				const date = new Date(dtStr);
				const weekday = weekDays[date.getDay()];
				datesStr += `
					${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} - ${weekday}
					<br/>
				`;
			});

			listItem.innerHTML = `
				<div class="ms-2 me-auto">
					<div class="fw-bold date-str-selected-events-header">${obj.dates.length} Days Schedule</div>
					<div class="date-str-selected-events">
						${datesStr}
					</div>
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
	document.querySelectorAll('#calendar-body tr td').forEach((node) => {
		node.classList.remove('selected', 'type-3', 'type-2');
		node.removeAttribute('slot-type');
	});
	let currMnObj = monthIsScheduled(currentYear, currentMonth);
	if (currMnObj) {
		currMnObj.sections.forEach((sc) => {
			let groupId = -1;
			sc.dates.forEach((dt, index) => {
				if (groupId === -1) {
					groupId = dateToYMD(new Date(dt));
				}
				let el = document.getElementById(`${dateToYMD(new Date(dt))}`);
				if (el) {
					el.setAttribute('slot-type', `type-${sc.type}`);
					el.setAttribute('section', `${groupId}`);
					el.classList.add('selected', `type-${sc.type}`);
				}
			});
		});
	}
}

function showSectionColorWise() {
	const weeks = [];
	document.querySelectorAll('#calendar-body tr').forEach((node) => {
		if (node.children.length >= 1 && node.firstChild.textContent !== '') {
			weeks.push(node);
		}
	});

	weeks.forEach((w, index) => {
		const childs = [];
		w.childNodes.forEach((child) => childs.push(child));
		if (index === 0) {
			let firstGroup = childs.slice(1, 4);
			firstGroup.forEach((node) => {
				node.classList.add(`type-3-unselected`);
			});
		} else if (index === 1) {
			let firstGroup = childs.slice(1, 3);
			firstGroup.forEach((node) => {
				node.classList.add(`type-2-unselected`);
			});
		} else if (index === 2) {
			let firstGroup = childs.slice(4, 6);
			firstGroup.forEach((node) => {
				node.classList.add(`type-2-unselected`);
			});
		} else {
			let firstGroup = childs.slice(3, 6);
			firstGroup.forEach((node) => {
				node.classList.add(`type-3-unselected`);
			});
		}
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

showCalendar(currentMonth, currentYear);
showEventOnUI();
