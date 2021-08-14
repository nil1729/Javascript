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
		const weekIndex = parseInt(e.target.getAttribute('week'));
		let currDate = new Date(y, m, d);

		if (isNaN(currDate)) return;

		const validSection = e.target.className.split(' ').filter((it) => it.startsWith('group-'));
		if (validSection.length === 0) return showWarning('This is not a valid 3-days or 2-days');

		if (monthIsScheduled(y, m)) {
			if (isLimitReached(y, m)) return showWarning('Maximum Limit for a month is reached!');
			// Further Checks
			const scheduledSections = monthIsScheduled(y, m).sections;
			let lastSection = scheduledSections[scheduledSections.length - 1];

			// Finding Clicked Section Details
			const cls = document
				.getElementById(`${y}-${m}-${d}`)
				.className.split(' ')
				.filter((it) => it.startsWith('group-'));

			let selectedSectionLength = document.querySelectorAll(`.${cls[0]}`).length;
			let lastSectionWeekIndex = parseInt(
				document.querySelectorAll(`.${lastSection.id}`)[0].getAttribute('week')
			);
			let reqLength = lastSection.dates.length === 3 ? 2 : 3;

			if (lastSectionWeekIndex > weekIndex)
				return showWarning(`You must select in consecutive order`);

			if (lastSection.dates.length === selectedSectionLength)
				return showWarning(
					`You have to select one ${reqLength} Days section Which is different from last selection`
				);

			// if (countAvailableWeeks() - weekIndex )
			let [fI, lI] = countAvailableWeekIndex();
			let remCount = 4 - scheduledSections.length;

			if (lI - weekIndex > 2) {
				scheduledNewEvent(y, m, d, weekIndex);
			} else if (lI - weekIndex === 2) {
				if (remCount <= 3) {
					scheduledNewEvent(y, m, d, weekIndex);
				}
			} else if (lI - weekIndex == 1) {
				if (remCount === 3) {
					const cls = document
						.getElementById(`${y}-${m}-${d}`)
						.className.split(' ')
						.filter((it) => it.startsWith('group-'));
					let lastDay;
					document.querySelectorAll(`.${cls[0]}`).forEach((it) => {
						lastDay = parseDate(it.id);
					});
					if (lastDay.getDay() > 3)
						return showWarning(
							`You can't select this section now, because 4 sections have to be added for a month`
						);
					scheduledNewEvent(y, m, d, weekIndex);
				} else {
					scheduledNewEvent(y, m, d, weekIndex);
				}
			} else {
				if (remCount >= 2) {
					const cls = document
						.getElementById(`${y}-${m}-${d}`)
						.className.split(' ')
						.filter((it) => it.startsWith('group-'));
					let lastDay;
					document.querySelectorAll(`.${cls[0]}`).forEach((it) => {
						lastDay = parseDate(it.id);
					});
					if (lastDay.getDay() > 3)
						return showWarning(
							`You can't select this section now, because 4 sections have to be added for a month`
						);
					scheduledNewEvent(y, m, d, weekIndex);
				} else {
					scheduledNewEvent(y, m, d, weekIndex);
				}
			}
		} else {
			// if (countAvailableWeeks() - weekIndex )
			let [fI, lI] = countAvailableWeekIndex();

			if (lI - weekIndex > 2) {
				scheduledNewEvent(y, m, d, weekIndex);
			} else if (lI - weekIndex >= 1) {
				// Finding Clicked Section Details
				const cls = document
					.getElementById(`${y}-${m}-${d}`)
					.className.split(' ')
					.filter((it) => it.startsWith('group-'));
				let lastDay;
				document.querySelectorAll(`.${cls[0]}`).forEach((it) => {
					lastDay = parseDate(it.id);
				});
				if (lastDay.getDay() > 3)
					return showWarning(
						`You can't select this section as first selection, because 4 sections have to be added for a month`
					);
				scheduledNewEvent(y, m, d, weekIndex);
			} else {
				return showWarning(
					`You can't select this section as first selection, because 4 sections have to be added for a month`
				);
			}
		}
		saveEvents();
		showEventOnUI();
	}
	if (e.target && e.target.id && e.target.id.startsWith('close:')) {
		const [c, ym, grp] = e.target.id.split(':');
		let [y, m] = ym.split('-');
		let requiredMonth = monthIsScheduled(y, m);
		let grpIndex = requiredMonth.sections.findIndex((it) => it.id === grp);
		if (grpIndex < requiredMonth.sections.length - 1)
			return showWarning(`You must remove the last scheduled event of this month first`);
		scheduledEvents = scheduledEvents.map((sc) => {
			if (sc.id === ym) {
				sc.sections = sc.sections.filter((it) => it.id !== grp);
				return sc;
			} else {
				return sc;
			}
		});
		updateScheduledDateSlots();
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
	return requiredMonth.sections.length === 4;
}

function scheduledNewEvent(y, m, d, weekIndex) {
	let currDate = new Date(y, m, d);
	if (monthIsScheduled(y, m)) {
		scheduledEvents = scheduledEvents.map((sc) => {
			if (sc.id === `${y}-${m}`) {
				const cls = document
					.getElementById(`${y}-${m}-${d}`)
					.className.split(' ')
					.filter((it) => it.startsWith('group-'));
				let newGroup = { id: cls[0], dates: [] };
				document.querySelectorAll(`.${cls[0]}`).forEach((it) => {
					newGroup.dates.push(parseDate(it.id));
				});
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
		const cls = document
			.getElementById(`${y}-${m}-${d}`)
			.className.split(' ')
			.filter((it) => it.startsWith('group-'));
		let newGroup = { id: cls[0], dates: [] };
		document.querySelectorAll(`.${cls[0]}`).forEach((it) => {
			newGroup.dates.push(parseDate(it.id));
		});
		ev.sections.push(newGroup);
		scheduledEvents.push(ev);
	}
	updateScheduledDateSlots();
}

function parseDate(id) {
	let [y, m, d] = id.split('-');
	return new Date(y, m, d);
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
					<div class="fw-bold">${obj.dates.length} Days Schedule</div>
						${datesStr}
					</div>
					<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" id="close:${month.id}:${obj.id}"></button>
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
		node.classList.remove('selected');
	});
	scheduledEvents.forEach(function (month) {
		month.sections.forEach(function (obj) {
			obj.dates.forEach((dtStr) => {
				const dateObj = new Date(dtStr);
				const requiredSlotId = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
				const elem = document.getElementById(requiredSlotId);
				if (elem) {
					elem.classList.add('selected');
				}
			});
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

function countAvailableWeekIndex() {
	const weeks = [];
	document.querySelectorAll('#calendar-body tr').forEach((node) => {
		if (node.children.length === 7 && node.firstChild.textContent !== '') {
			weeks.push(node);
		}
	});
	return [
		parseInt(weeks[0].firstChild.getAttribute('week')),
		parseInt(weeks[weeks.length - 1].firstChild.getAttribute('week')),
	];
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

			let idFirstGr = firstGroup[0].id;
			let idSecondGr = secondGroup[0].id;

			firstGroup.forEach((node) => {
				node.classList.add(`type-${startType}`, `group-${idFirstGr}`);
			});
			secondGroup.forEach((node) => {
				node.classList.add(`type-${otherType}`, `group-${idSecondGr}`);
			});
		} else {
			let firstGroup = childs.slice(1, otherType + 1);
			let secondGroup = childs.slice(otherType + 1, 6);
			let idFirstGr = firstGroup[0].id;
			let idSecondGr = secondGroup[0].id;
			firstGroup.forEach((node) => {
				node.classList.add(`type-${otherType}`, `group-${idFirstGr}`);
			});
			secondGroup.forEach((node) => {
				node.classList.add(`type-${startType}`, `group-${idSecondGr}`);
			});
		}
	}
}

showCalendar(currentMonth, currentYear);
showEventOnUI();
