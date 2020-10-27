const LANG = {
	months: [
		'jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sept', 'okt', 'nov', 'dec'
	],
	types: {
		'sutaz': 'súťaž',
		'seminar': 'seminár',
		'sustredenie': 'sústredenie',
		'vikendovka': 'víkendovka',
		'tabor': 'tábor',
		'olympiada': 'olympiáda',
		'prednasky': 'prednášky',
	},
	contestant_types: {
		'zs': 'ZŠ',
		'ss': 'SŠ',
	},
	sciences: {
		'mat': 'matematika',
		'fyz': 'fyzika',
		'inf': 'informatika',
		'other': 'iné',
	},
	colors: {
		'red': '#E53E3E',
		'orange': '#ED8936',
		'yellow': '#F6BF26',
		'green': '#7CB342',
		'blue': '#4299E1',
		'purple': '#8E24AA',
	},
	science_color: {
		'mat': 'blue',
		'fyz': 'orange',
		'inf': 'green',
		'other': 'red',
	}
}

const DATA_URL = 'https://raw.githubusercontent.com/kockatykalendar/data/master/build/2019_20.json'
let DATA = []

const load_data = () => {
	let xhr = new XMLHttpRequest()
	xhr.open('GET', DATA_URL)
	xhr.responseType = 'json'
	xhr.send()

	xhr.onload = function() {
		DATA = xhr.response
		DATA.sort((a, b) => {
			return new Date(a.date.start) - new Date(b.date.start)
		})

		render()
	}
}

// Formatting utilities
const fmt = {
	places: function (event) {
		return event.places.join(', ')
	},

	date: function (event) {
		if (event.date.text) {
			return event.date.text
		}

		let date_start = new Date(event.date.start)
		let result = date_start.getDate() + '. ' + LANG.months[date_start.getMonth()]

		if (event.date.end) {
			let date_end = new Date(event.date.end)
			result += ' – ' + date_end.getDate() + '. ' + LANG.months[date_end.getMonth()]
		}

		return result
	},

	type: function (event) {
		return LANG.types[event.type]
	},

	contestants: function (event) {
		let min_type = event.contestants.min.substr(0, 2)
		let min_year = event.contestants.min.substr(2)
		let max_type = event.contestants.max.substr(0, 2)
		let max_year = event.contestants.max.substr(2)

		let result = LANG.contestant_types[min_type] + ' ' + min_year

		if (event.contestants.min == event.contestants.max) {
			return result
		}

		result += ' – '

		if (min_type != max_type) {
			result += LANG.contestant_types[max_type] + ' '
		}

		result += max_year

		return result
	},

	sciences: function (event) {
		return event.sciences.map((x) => LANG.sciences[x]).join(', ')
	},

	color: function (event) {
		return LANG.colors?.[event.color] ?? event.color ?? LANG.colors[LANG.science_color[event.sciences[0]]]
	}
}

const TEMPLATE = document.getElementById('template-main').innerHTML;
const PARTIAL_TEMPLATE = document.getElementById('template-event-item').innerHTML;

Mustache.parse(TEMPLATE)
Mustache.parse(PARTIAL_TEMPLATE)

const render = () => {
	let event_list = document.getElementById('event-list')
	event_list.innerHTML = ''

	DATA.forEach(event => {
		event.color = fmt.color(event)
		event.places = fmt.places(event)
		event.date = fmt.date(event)
		event.type = fmt.type(event)
		event.contestants = fmt.contestants(event)
		event.sciences = fmt.sciences(event)
	})

	event_list.innerHTML = Mustache.render(TEMPLATE, {data: DATA}, {partial : PARTIAL_TEMPLATE});

	[...document.getElementsByClassName("event-header")].forEach(node => {
		node.addEventListener("click", () => {
			node.parentElement.classList.toggle("close")
		})
	})
}

const insert_event = (node, color) => {
	let event_dot = document.createElement("span")
	event_dot.innerHTML = "●"
	event_dot.style.color = color;
	//event_dot.setAttribute("class", `w-2 h-2 ${color} rounded-full mr-1 mb-1`)
	node.appendChild(event_dot)
}

const setup_calendar = () => {

	let calendar = jsCalendar.new({
		target: '#calendar',
		firstDayOfTheWeek: "2",
		monthFormat: "month YYYY",
		language : "sk"
	});
	let rendered = false;

	// Render header
	calendar.onMonthRender(function(index, element, info) {
		if(!rendered) {
			rendered = true;
			let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
			icon.setAttribute("viewBox", "0 0 24 24")
			icon.setAttribute("width", "24")
			icon.setAttribute("height", "24")
			icon.setAttribute("fill", "none")
			icon.setAttribute("stroke", "currentColor")
			icon.setAttribute("stroke-width", "2")
			icon.setAttribute("stroke-linecap", "round")
			icon.setAttribute("stroke-linejoin", "round")
			// Setup arrows & filter
			//filter icon
			let filter = icon.cloneNode()
			filter.setAttribute("class", "calendar-filter")
			filter.innerHTML = '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>';
			element.parentElement.getElementsByClassName("jsCalendar-title-right")[0].appendChild(filter)
			//right arrow
			let right_arrow = icon.cloneNode()
			right_arrow.innerHTML = '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>';
			element.parentElement.getElementsByClassName("jsCalendar-nav-right")[0].appendChild(right_arrow)
			//left arrow
			let left = icon.cloneNode()
			left.innerHTML = '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>';
			element.parentElement.getElementsByClassName("jsCalendar-nav-left")[0].appendChild(left)
		}
	});

	// Render day names ( P U S Š P S N )
	calendar.onDayRender(function(index, element, info) {
		if (index == 0 || index == 6) {
			element.style.color = '#c32525'
		}
	});

	// Render individual days
	calendar.onDateRender(function(date, element, info) {
		if (!info.isCurrent && (date.getDay() == 0 || date.getDay() == 6)) {
			element.style.color = (info.isCurrentMonth) ? '#c32525' : '#c3252577'
		}

		// Insert event container
		let event_container = document.createElement("br")
		//event_container.setAttribute("class", "calendar-event-container")
		element.appendChild(event_container)

		// TODO: Load from data
		// Example:
		let event_dates = [
			jsCalendar.tools.stringToDate("15-10-2020"),
			jsCalendar.tools.stringToDate("18-10-2020")
		]

		event_dates.forEach(event_date => {
			if (event_date.getTime() === date.getTime()) {
				insert_event(element, "#E53E3E")
				insert_event(element, "#4299E1")
				insert_event(element, "#4299E1")
			}
		});
	});

	calendar.onDateClick(function(event, date){
		// TODO: scroll to events around clicked date
		// Test:
		document.getElementById("scroll").scrollTo(0, 5000)
		// maybe add smooth scroll
	});

	// Refresh layout
	calendar.refresh()
}

load_data()
setup_calendar()
