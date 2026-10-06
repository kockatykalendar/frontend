const CONSTANTS = {
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
		'other': 'iné',
	},
	type_combinations: [
		"olympiada sutaz",
		"seminar",
		"sustredenie tabor vikendovka",
		"other prednasky"
	],
	contestant_types: {
		'zs': 'ZŠ',
		'ss': 'SŠ',
	},
	sciences: {
		'mat': 'MAT',
		'fyz': 'FYZ',
		'inf': 'INF',
		'bio': 'BIO',
		'chem': "CHEM",
		'other': 'iné',
		'any': 'všetky',
	},
	countries: {
		"sk": "Slovensko",
		"cz": "Česko",
  },
	any_country_flag: "international",
	colors: {
		'red': '#E53E3E',
		'orange': '#ED8936',
		'yellow': '#FDC700',
		'green': '#7CB342',
		'blue': '#4299E1',
		'purple': '#8E24AA',
	},
	science_color: {
		'mat': 'blue',
		'fyz': 'orange',
		'inf': 'green',
		'bio': 'yellow',
		'chem': 'purple',
		'other': 'red',
		'any': 'red',
	},
}

CONSTANTS.school_years = [
	'Mladší',
	...Array(9).fill().map( (x, i) => `${CONSTANTS.contestant_types['zs']} ${i+1}`),
	...Array(4).fill().map( (x, i) => `${CONSTANTS.contestant_types['ss']} ${i+1}`),
	'Starší'
]
const FORCE_SCIENCE_COLOR = "force-science-color"
const FORCE_DESCRIPTION_VISIBLE_PC = "force-description-visible-pc"
const FORCE_DESCRIPTION_VISIBLE_MOBILE = "force-description-visible-mobile"

const DATA_URL_PREFIX = 'https://data.kockatykalendar.sk/'
const DEFAULT_STYLE = [FORCE_SCIENCE_COLOR, FORCE_DESCRIPTION_VISIBLE_PC]
const DEFAULT_ORGANIZERS = ['trojsten', 'p-mat', 'sezam', 'strom', 'riesky', 'nivam']
let ORGANIZERS = []
let DATA = []
let DATA_INDEX = []
let min_loaded_year = 0;
let max_loaded_year = 0;

const ONE_DAY = 86400000

function load_default_filter() {
	return {
		school: [0, CONSTANTS.school_years.length-1],
		sciences: Object.keys(CONSTANTS.sciences),
		countries: Object.keys(CONSTANTS.countries),
		types: CONSTANTS.type_combinations,
		organizers: [...DEFAULT_ORGANIZERS, '*'],
    default_organizers: DEFAULT_ORGANIZERS,
    style: DEFAULT_STYLE,
	}
}
// Embedding: terminy.html?organizers=trojsten,fykos&sciences=mat&school=ss&search=olympiáda
// A filter from the URL or inside an iframe is never saved, so it can't overwrite the visitor's own settings
const URL_PARAMS = new URLSearchParams(location.search)
const IN_IFRAME = window.self !== window.top
const PERSIST = !IN_IFRAME && !['organizers', 'sciences', 'school', 'search'].some(key => URL_PARAMS.has(key))

const save_setting = (key, value) => {
	if (PERSIST) localStorage.setItem(key, value)
}

// Once the visitor changes the filter, the URL's query string no longer describes the page
const drop_url_filter = () => {
	if (!location.search) return
	history.replaceState(null, '', location.pathname)
	document.getElementById('open-page').href = location.href
}

const save_filter = () => {
	drop_url_filter()
	save_setting('filter', JSON.stringify(FILTER))
}

const filter_from_params = (params) => {
	const filter = load_default_filter()
	if (params.get('organizers')) filter.organizers = params.get('organizers').split(',')
	if (params.get('sciences')) filter.sciences = params.get('sciences').split(',')
	if (params.get('school') === 'zs') filter.school = [0, 9]
	if (params.get('school') === 'ss') filter.school = [10, CONSTANTS.school_years.length - 1]
	return filter
}

let FILTER = PERSIST ? JSON.parse(localStorage.getItem('filter')) ?? load_default_filter() : filter_from_params(URL_PARAMS)

const new_possible_filter = load_default_filter();
for (const key in FILTER) {
	if (!Object.hasOwn(new_possible_filter, key)){
		delete FILTER[key];
		continue;
	}
}

const CALENDAR = jsCalendar.new({
	target: '#calendar',
	firstDayOfTheWeek: '2',
	monthFormat: 'month YYYY',
	language : 'sk'
})

const open_modal = () => {
	document.getElementById('filter-modal').classList.remove('hidden')
}

const close_modal = () => {
	document.getElementById('filter-modal').classList.add('hidden')
}

let calendar_pinned = false

// The scroll area moves when the calendar above it shows/hides; shift it back so visible events stay put
const toggle_calendar_keeping_scroll = (show) => {
	const scroll = document.getElementById('scroll')
	const top_before = scroll.getBoundingClientRect().top
	document.getElementById('js-calendar-placeholder').classList.toggle('hidden', show)
	document.getElementById('js-calendar-holder').classList.toggle('hidden', !show)
	scroll.scrollTop += scroll.getBoundingClientRect().top - top_before
}

const open_calendar = () => {
	toggle_calendar_keeping_scroll(true)
	last_scroll = document.getElementById('scroll').scrollTop
}

const close_calendar = () => {
	if (document.getElementById('js-calendar-holder').classList.contains('hidden')) return
	toggle_calendar_keeping_scroll(false)
}

const toggle_calendar_pin = (icon) => {
	calendar_pinned = !calendar_pinned
	icon.setAttribute('fill', calendar_pinned ? 'currentColor' : 'none')
	last_scroll = document.getElementById('scroll').scrollTop
}

const open_search = () => {
	const anim = document.getElementById('search-modal').animate(
		[{transform: "translateY(5rem)"}],
		{ duration: 200, fill: 'both', easing: 'ease' },
	);
	anim.addEventListener('finish', () => {
		anim.commitStyles();
		anim.cancel();
	});
	let search_input = document.getElementById('search-input');
	search_input.focus();
	if (PERSIST) search_input.value = localStorage.getItem('search');
	render();
	CALENDAR.refresh();
}

const close_search = () => {
	const anim = document.getElementById('search-modal').animate(
		[{transform: "translateY(0)"}],
		{ duration: 200, fill: 'both', easing: 'ease' },
	);
	anim.addEventListener('finish', () => {
		anim.commitStyles();
		anim.cancel();
	});
	let search_input = document.getElementById('search-input');
	save_setting('search', search_input.value);
	document.getElementById('mobile-search-input').value = "";
	search_input.value = URL_PARAMS.get('search') ?? "";
	render();
	CALENDAR.refresh();
}

const school_to_int = (school, max) => {
	return (parseInt(school?.slice(-1), 10) + (school?.slice(0,2) === 'ss')*9) || max*14;
}

const load_json = async (url) => {
	if (url == DATA_URL_PREFIX + "undefined") return []; // Hotfix to get rid of GET-erros
	else {
		const response = await fetch(url);
		if (response.ok) {
			const jsonValue = await response.json();
			return Promise.resolve(jsonValue);
		} else {
			return [];
		}
	}
}

const load_organizers = async () => {
	ORGANIZERS = await load_json(DATA_URL_PREFIX+"organizers.json")
}

const load_data = async () => {
	await load_organizers()
	await render_filter()
	DATA_INDEX = await load_json(DATA_URL_PREFIX+"index.json")
	min_loaded_year = new Date().getFullYear() - (new Date().getMonth() < 8)
  max_loaded_year = min_loaded_year
	let old_length = DATA.length ?? 0
  DATA = await load_events(min_loaded_year)
  if (DATA.length > old_length) {
		await render()
		CALENDAR.refresh()
	}
}

const get_representative_date = (event) => {
  if (!event.date.end) return event.date.start
  if (event.type == "seminar") return event.date.end
  if (event.type == "sustredenie" || event.type == "tabor" || event.type == "vikendovka" || event.type == "prednasky") return event.date.start
  // olympiada (end pre dlhé kolá, start pre napr. celoštátka), súťaž (podobne), other
  if (new Date(event.date.end).getTime() - new Date(event.date.start).getTime() <= ONE_DAY * 13) return event.date.start
  return event.date.end
}

const sorting_key = (event) => {
  return [
    event.is_past ? 0 : event.is_active ? 1 : 2,
    new Date(get_representative_date(event)).getTime(),
    new Date(event.date.end ?? event.date.start).getTime(),
    new Date(event.date.start).getTime()
  ]
}

const load_events = async year => {
	let ret = await load_json(DATA_URL_PREFIX+DATA_INDEX.find((data) => data.start_year == year)?.filename)
	ret.forEach((event, index) => {
		for (const key in fmt) {
			if (Object.hasOwn(fmt, key)) {
				event[key] = fmt[key](event)
			}
		}
	})

  ret.sort((a, b) => {
    let sa = sorting_key(a), sb = sorting_key(b)
    for (let i = 0; i < sa.length; i++) {
      if (sa[i] == sb[i]) continue
      return sa[i] - sb[i]
    }
    return 0
	})
	return ret;
}

const FILTER_TEMPLATE = document.getElementById('template-filter-organization').innerHTML;
const render_filter = async () => {
	let html = DEFAULT_ORGANIZERS.reduce((html, org) => html + Mustache.render(FILTER_TEMPLATE, {key: org, name: ORGANIZERS[org].name, logo: DATA_URL_PREFIX+ORGANIZERS[org].icon}), '')
	html += Mustache.render(FILTER_TEMPLATE, {key: "*", name: "Ostatní"})
	document.getElementById('org-filter-aside').insertAdjacentHTML('afterend', html)
	document.getElementById('org-filter-modal').insertAdjacentHTML('afterend', html)

	filter_update_checked()
	document.querySelectorAll('.js-filter-checkbox').forEach((elem) => elem.onchange = (event) => {
		const filter_type = event.currentTarget.dataset.filter
		const value = event.currentTarget.value
		const checked = event.currentTarget.checked

		if (checked && FILTER[filter_type].indexOf(value) === -1) {
			FILTER[filter_type].push(value)
			save_filter();
			filter_update_checked()
		}

		if (!checked && FILTER[filter_type].indexOf(value) !== -1) {
			FILTER[filter_type] = FILTER[filter_type].filter((x) => x != value)
			save_filter();
			filter_update_checked()
		}

		render()
		CALENDAR.refresh()
	})
}

const select_deselect_all = (filter_type) => {
	let constants = undefined;
	if (filter_type === 'organizers') constants = [...DEFAULT_ORGANIZERS, '*'];
	else if (filter_type === 'types') constants = CONSTANTS.type_combinations;
	else constants = Object.keys(CONSTANTS[filter_type]);

	if (FILTER[filter_type].length === constants.length) FILTER[filter_type] = [];
	else FILTER[filter_type] = constants;

	save_filter();
	filter_update_checked();
	render();
	CALENDAR.refresh();
}

// Formatting utilities
const fmt_contestant = (contestant, prev_contestant) => {
	if (prev_contestant && prev_contestant.slice(0, 2) === contestant.slice(0, 2)) {
		return contestant.slice(2)
	}

	return CONSTANTS.contestant_types[contestant.slice(0, 2)] + ' ' + contestant.slice(2)
}

const fmt = {
	places_defined: function (event) {
		return Object.hasOwn(event, "places") && event.places.length != 0
	},

	pretty_places: function (event) {
		return event.places?.join(', ')
	},

	date_verbose: function (event) {
		if (event.date.text) {
			return event.date.text
		}

		let date_start = new Date(event.date.start)
    let result = date_start.getDate()

		if (event.date.end) {
      let date_end = new Date(event.date.end)
      if (date_start.getFullYear() != date_end.getFullYear()) result += '. ' + CONSTANTS.months[date_start.getMonth()] + ' ' + date_start.getFullYear()
			else if (date_start.getMonth() != date_end.getMonth()) result += '. ' + CONSTANTS.months[date_start.getMonth()]

      result += ' – ' + date_end.getDate() + '. ' + CONSTANTS.months[date_end.getMonth()]
			if (date_end.getFullYear() != new Date().getFullYear()) result += ' ' + date_end.getFullYear()
    } else {
      result += '. ' + CONSTANTS.months[date_start.getMonth()]
      if (date_start.getFullYear() != new Date().getFullYear()) result += ' ' + date_start.getFullYear()
    }

		return result
	},

	pretty_type: function (event) {
		return CONSTANTS.types[event.type]
	},

	pretty_organizers: function(event) {
		return event.organizers.map((x) => ({'logo': DATA_URL_PREFIX+ORGANIZERS[x].icon, 'name': ORGANIZERS[x].name || x, 'web': ORGANIZERS[x].web || '#'}))
	},

	pretty_contestants: function (event) {
		if (!event.contestants.min && !event.contestants.max) {
			return 'ktokoľvek'
		}

		if (!event.contestants.min && event.contestants.max) {
			return fmt_contestant(event.contestants.max) + ' a mladší'
		}

		if (event.contestants.min && !event.contestants.max) {
			return fmt_contestant(event.contestants.min) + ' a starší'
		}

		if (event.contestants.min == event.contestants.max) {
			return fmt_contestant(event.contestants.min)
		}

		return fmt_contestant(event.contestants.min) + ' – ' + fmt_contestant(event.contestants.max, event.contestants.min)
	},

	pretty_sciences: function (event) {
		return event.sciences.map((x) => CONSTANTS.sciences[x]).join(', ')
	},

	color: function (event) {
		return CONSTANTS.colors?.[event.color] ?? event.color ?? CONSTANTS.colors[CONSTANTS.science_color[event.sciences[0]]]
	},

	background_color: function(event) {
		const date_end = new Date(event.date.end || event.date.start).getTime() + ONE_DAY
		return date_end <= new Date().getTime() ? 'opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out' : ''
  },

  is_past: function (event) {
    return new Date(event.date.end || event.date.start).getTime() + ONE_DAY < new Date().getTime()
  },

	is_active: function (event) {
		if (event.cancelled) return false
		return new Date(event.date.start).getTime() <= new Date().getTime() && new Date().getTime() < new Date(event.date.end ?? event.date.start).getTime() + ONE_DAY
  }
}

const EVENT_TEMPLATE = document.getElementById('template-main').innerHTML;
const PARTIAL_EVENT_TEMPLATE = document.getElementById('template-event-item').innerHTML;
let visible_events = DATA
let is_initial_scroll = false		// used to prevent calendar from hiding during initial scroll
let nudge_timer = null
let first_id = 0
let last_id = 0

const normalize_string = (str) => { // Remove diacritics and special chars and turn lowercase; used in the search; part from https://stackoverflow.com/a/37511463
   return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();}

const filter_events = (events) => {
	// School filter
	events = events.filter((event) => {
		return Math.max(FILTER.school[0], FILTER.school[1]) >= Math.min(school_to_int(event.contestants.min, 0), school_to_int(event.contestants.max, 1)) && Math.min(FILTER.school[0], FILTER.school[1]) <= Math.max(school_to_int(event.contestants.max, 1), school_to_int(event.contestants.min, 0));
	})

	// Sciences filter
	events = events.filter((event) => {
		for (let i = FILTER.sciences.length - 1; i >= 0; i--) {
			if (event.sciences.indexOf(FILTER.sciences[i]) !== -1) return true
		}
		return false
	})

	// Organizers filter
	events = events.filter((event) => {
		for (let i = FILTER.organizers.length - 1; i >= 0; i--) {
			if (event.organizers.indexOf(FILTER.organizers[i]) !== -1) return true
		}

		// Ostatni organizatori
		if (FILTER.organizers.indexOf('*') !== -1) {
			if (event.organizers.length === 0) { return true }
			for (let i = event.organizers.length - 1; i >= 0; i--) {
				if (FILTER.default_organizers.indexOf(event.organizers[i]) === -1) return true
			}
		}
		return false
	})

	// Country filter
	events = events.filter((event) => {
		for (let i = FILTER.countries.length - 1; i >= 0; i--) {
			for (let j = event.organizers.length - 1; j >= 0; j--){
        if (ORGANIZERS[event.organizers[j]].country == FILTER.countries[i]) return true
        if (ORGANIZERS[event.organizers[j]].country == CONSTANTS.any_country_flag) return true
			}
		}
		return false
	})

	// Type filter
	events = events.filter((event) => {
		for (let i = FILTER.types.length - 1; i >= 0; i--) {
			if (FILTER.types[i].indexOf(event.type) !== -1) return true
		}
		return false
	})

	// Filter search
	events = events.filter(x => normalize_string(JSON.stringify(x)).includes(normalize_string(document.getElementById('search-input').value)))
	// Filter search -- mobile
	events = events.filter(x => normalize_string(JSON.stringify(x)).includes(normalize_string(document.getElementById('mobile-search-input').value)))
	return events
}

const event_of_card = (card) => visible_events[card.id.slice('event-item-'.length)]

const render = (move_focus = true) => {
	let event_list = document.getElementById('event-list')
	event_list.innerHTML = ''

	visible_events = filter_events(DATA)

	visible_events.forEach((event, index) => {
		event.id = index
		event.display_color = FILTER.style?.includes(FORCE_SCIENCE_COLOR) ? CONSTANTS.colors[CONSTANTS.science_color[event.sciences[0]]] : event.color
	})

	const event = visible_events.find(event =>
		new Date(event.date.end || event.date.start) >= new Date()
	) ?? visible_events[visible_events.length - 1]

	if (move_focus) {
		first_id = Math.max(parseInt(event?.id, 10) - 10, 0)
		last_id = Math.min(parseInt(event?.id, 10) + 20, visible_events.length)
	}

	if (first_id > visible_events.length) first_id = visible_events.length
	if (last_id > visible_events.length) last_id = visible_events.length

  // Render
  event_list.innerHTML = Mustache.render(EVENT_TEMPLATE, {data: visible_events.slice(first_id, last_id)}, {partial : PARTIAL_EVENT_TEMPLATE});

  // Add description toggle listeners
  add_description_toggle_listeners(first_id, last_id);

	if (move_focus) {
		if (event) {
			is_initial_scroll = true
			// Instant: a smooth scroll may never run in an off-screen iframe, leaving the list at older events
			scroll_to_id(event.id, 'instant')
		}
	}
}

const add_description_toggle_listeners = (min_index, max_index) => {
  for (let i = min_index; i < max_index; i++) {
    let node = document.getElementById(`event-item-${i}`)
    if (!FILTER.style?.includes(FORCE_DESCRIPTION_VISIBLE_PC)) {
      node.querySelector(".js-event-description-pc")?.classList.add("hidden")
    } else {
      node.classList.remove("cursor-pointer")
    }
    if (!FILTER.style?.includes(FORCE_DESCRIPTION_VISIBLE_MOBILE)) node.querySelector(".js-event-description-mobile")?.classList.add("hidden")

    node.addEventListener('click', (e) => {
      follow_touched_event(event_of_card(node))  // taps only; drags don't fire click
      if (e.target.closest('a')) return
      if (!FILTER.style?.includes(FORCE_DESCRIPTION_VISIBLE_PC)) node.querySelector(".js-event-description-pc")?.classList.toggle("hidden")
      if (!FILTER.style?.includes(FORCE_DESCRIPTION_VISIBLE_MOBILE)) node.querySelector(".js-event-description-mobile")?.classList.toggle("hidden")
    })
  }
}

const insert_event = (node, color) => {
	let event_dot = document.createElement('div')
	event_dot.setAttribute('class', 'w-2 h-2 rounded-full')
	event_dot.style.backgroundColor = color
	event_dot.style.margin = '.1rem'
	node.appendChild(event_dot)
}

const setup_calendar = () => {

	let rendered = false;

	// Render header
	CALENDAR.onMonthRender(function(index, element, info) {
		document.getElementById('js-calendar-placeholder-month').innerText = element.innerText

		if(!rendered) {
			rendered = true;
			let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			icon.setAttribute('viewBox', '0 0 24 24')
			icon.setAttribute('width', '24')
			icon.setAttribute('height', '24')
			icon.setAttribute('fill', 'none')
			icon.setAttribute('stroke', 'currentColor')
			icon.setAttribute('stroke-width', '2')
			icon.setAttribute('stroke-linecap', 'round')
			icon.setAttribute('stroke-linejoin', 'round')
			const title = element.parentElement
			const left_side = title.getElementsByClassName('jsCalendar-title-left')[0]
			const right_side = title.getElementsByClassName('jsCalendar-title-right')[0]
			// Floats come before the month name, so on narrow screens the name wraps instead of pushing icons out
			left_side.after(right_side)
			// jsCalendar's own nav buttons are replaced by arrow icons consistent with the others
			for (const nav of title.querySelectorAll('.jsCalendar-nav-left, .jsCalendar-nav-right')) nav.remove()

			// Floated icons, outermost first; the right ones occupy the same spots as the filter/open icons of the closed calendar bar (7px/9px margins offset the table's 1px border)
			// We can't use tailwind for margins, because .jsCalendar * sets everything to 0 and takes precedence.
			const add_icon = (side, paths, on_click, mobile_only) => {
				const el = icon.cloneNode()
				if (mobile_only) el.setAttribute('class', 'md:hidden')
				el.setAttribute('style', side === left_side ? 'margin: 10px 8px; float: left;' : 'margin: 10px 7px 10px 9px; float: right;')
				el.innerHTML = paths
				el.addEventListener('click', on_click)
				side.appendChild(el)
				return el
			}
			const pin = add_icon(left_side, '<line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>', () => toggle_calendar_pin(pin), true)
			add_icon(left_side, '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>', () => { browse_calendar(); CALENDAR.previous() })
			add_icon(right_side, '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>', open_modal, true)
			add_icon(right_side, '<polyline points="18 15 12 9 6 15"></polyline>', close_calendar, true)
			add_icon(right_side, '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>', () => { browse_calendar(); CALENDAR.next() })
		}
	});

	// Render day names ( P U S Š P S N )
	CALENDAR.onDayRender(function(index, element, info) {
		if (index == 0 || index == 6) {
			element.style.color = '#c32525'
		}
	});

	// Render individual days
	CALENDAR.onDateRender(function(date, element, info) {
		if (!info.isCurrent && (date.getDay() == 0 || date.getDay() == 6)) {
			// We could use info.isCurrentMonth but it has bugs (10/2020)
			element.style.color = (CALENDAR._date.getMonth() == date.getMonth()) ? '#c32525' : '#c3252577'
		}

		// Insert event container
		let event_container = document.createElement('div')
		event_container.setAttribute('class', 'flex justify-center flex-wrap')
		event_container.style.maxHeight = '20px';
		element.appendChild(event_container)

		for (const color of calendar_dots(day_key(date))) insert_event(event_container, color)
	});

	CALENDAR.onDateClick(function(event, date){
		browse_calendar()
		// Scroll to events around clicked date
		const e = visible_events.find(event => get_representative_date(event) === day_key(date))
		if (e) scroll_to_id(e.id)
	});
	CALENDAR.refresh()
}

// Calendar dates are local Dates; event dates are 'YYYY-MM-DD' strings
const day_key = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

// Dot colors per day, rebuilt only when visible_events changes instead of scanning all events for every rendered day
let dots_by_day = new Map()
let dots_source = null
const calendar_dots = (day) => {
  if (dots_source !== visible_events) {
    dots_source = visible_events
    dots_by_day = new Map()
    for (const event of visible_events) {
      const key = get_representative_date(event)
      if (!dots_by_day.has(key)) dots_by_day.set(key, [])
      dots_by_day.get(key).push(event.display_color)
    }
  }
  return dots_by_day.get(day) ?? []
}

const align_calendar_to_event = (event) => {
  if (!event) return
  CALENDAR.set(new Date(get_representative_date(event)))
}

// The calendar follows the events on screen, unless the user is browsing it (arrows / date click) and hasn't touched the list since
let followed_event = null
let calendar_browsed = false
const FOLLOW_INTERVAL = 200
let follow_timer = null
let last_follow = 0

// Throttled: updates at most once per FOLLOW_INTERVAL, always ending on the latest event
const follow_event_in_calendar = (event) => {
  if (calendar_browsed || !event || event === followed_event) return
  followed_event = event
  clearTimeout(follow_timer)
  follow_timer = setTimeout(() => {
    last_follow = Date.now()
    align_calendar_to_event(followed_event)
  }, Math.max(0, last_follow + FOLLOW_INTERVAL - Date.now()))
}

const browse_calendar = () => {
  clearTimeout(follow_timer)
  calendar_browsed = true
  followed_event = null
}

const follow_list_again = () => {
  calendar_browsed = false
}

const follow_touched_event = (event) => {
  follow_list_again()
  follow_event_in_calendar(event)
}

const align_calendar_to_top_event = () => {
  const rect = document.getElementById('scroll').getBoundingClientRect()
  const node = document.elementFromPoint(rect.left + rect.width / 2, rect.top + 16)?.closest('[id^="event-item-"]')
  follow_event_in_calendar(node && event_of_card(node))
}

const scroll_to_id = async (id, behavior = 'smooth') => {
  while (last_id <= id) await render_events_below()
  while (first_id > 0 && first_id > id - 10) {
    let old_len = visible_events.length
    await render_events_above()
    id += visible_events.length - old_len
  }

  let id_string = `event-item-${id}`
 	document.getElementById(id_string).animate([{
		'backgroundColor': 'rgb(254, 235, 200)',
		'boxShadow': 'inset 0 0 0 3px rgb(237, 137, 54)',
		offset: 0.5
		}], {
		duration: 1500,
		easing: 'cubic-bezier(.25, .75, .75, .25)',
		iterations: 2
	});
	document.getElementById('scroll').scrollTo({
		top: document.getElementById(id_string).getBoundingClientRect().top - window.innerHeight / 2 + document.getElementById('scroll').scrollTop,
		left: 0,
		behavior
	})
}

document.getElementById('search-input').value = URL_PARAMS.get('search') ?? ''
if (IN_IFRAME) {
	document.getElementById('site-header').classList.add('hidden')
	document.getElementById('open-page').href = location.href
	document.getElementById('open-page').classList.remove('hidden')
}

load_data()
setup_calendar()

// FILTERS
const filter_update_checked = () => {
	try {
		document.querySelectorAll('.js-filter-checkbox').forEach((elem) => {
			if (FILTER[elem.dataset.filter].indexOf(elem.value) !== -1) {
				elem.checked = true
			} else {
				elem.checked = false
			}
		})
	} catch {
		FILTER = load_default_filter();
		filter_update_checked();
	}
}

window.addEventListener('keydown', e => {
	if(!e.isComposing && e.key === 'Escape'){
		close_modal();
		close_search();
	}
	if (e.key === 'F3' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f')) {
		e.preventDefault();
		open_search();
	}
})

let search_timer = 0;
document.querySelectorAll('[type=search]').forEach( parent => {
	parent.addEventListener('input', e => {
		drop_url_filter();
		clearTimeout(search_timer);
		search_timer = setTimeout(() => {
			render();
			CALENDAR.refresh();
		}, 300);
	})
})

const render_events_below = async () => {
  let event_list = document.getElementById('event-list')
  let old_last_id = last_id;
		if (last_id > visible_events.length-10) {
			document.getElementById('scroll').removeEventListener('scroll', scroll_listener)
      max_loaded_year++
			let old_length = DATA.length ?? 0
      DATA = DATA.concat(await load_events(max_loaded_year))
			if (DATA.length > old_length) render(false)
			document.getElementById('scroll').addEventListener('scroll', scroll_listener)
		}
  last_id = Math.min(last_id + 5, visible_events.length)
  event_list.insertAdjacentHTML('beforeend', Mustache.render(EVENT_TEMPLATE, { data: visible_events.slice(old_last_id, last_id) }, { partial: PARTIAL_EVENT_TEMPLATE }));
  add_description_toggle_listeners(old_last_id, last_id);
}

// Adding events above the visible ones pushes them down (and a full re-render loses the browser's scroll anchoring),
// so the event at the top of the screen is put back where it was. update() is synchronous, so the jump is never painted.
const keep_top_event_in_place = (update) => {
  const scroll = document.getElementById('scroll')
  const top = scroll.getBoundingClientRect().top
  const card = [...document.querySelectorAll('#event-list section[id^="event-item-"]')].find(c => c.getBoundingClientRect().bottom > top)
  const event = card && event_of_card(card)
  const offset = card?.getBoundingClientRect().top
  update()
  // event.id is updated by render() when events are added above; where the browser's own scroll anchoring
  // already compensated, the difference is 0 and scrolling isn't touched
  const moved = event && document.getElementById(`event-item-${event.id}`)
  const difference = moved ? moved.getBoundingClientRect().top - offset : 0
  if (difference) {
    scroll.scrollTop += difference
    last_scroll += difference   // not the user scrolling, so it mustn't close the mobile calendar
  }
}

const render_events_above = async () => {
  let new_data = []
	if (first_id < 10) {
		document.getElementById('scroll').removeEventListener('scroll', scroll_listener)
		min_loaded_year--
		new_data = await load_events(min_loaded_year)
		document.getElementById('scroll').addEventListener('scroll', scroll_listener)
	}
  keep_top_event_in_place(() => {
    let old_first_id = first_id
    if (new_data.length != 0) {
      // Indices point into the filtered visible_events, so shift only by the new events that pass the filter
      const added = filter_events(new_data).length
      first_id += added
      old_first_id += added
      last_id += added
      DATA = new_data.concat(DATA)
      render(false)
    }
    first_id = Math.max(first_id - 5, 0)
    document.getElementById('event-list').insertAdjacentHTML('afterbegin', Mustache.render(EVENT_TEMPLATE, { data: visible_events.slice(first_id, old_first_id) }, { partial: PARTIAL_EVENT_TEMPLATE }));
    add_description_toggle_listeners(first_id, old_first_id);
  })
}

let last_scroll = document.getElementById('scroll').scrollTop

const scroll_listener = async e => {
	const { scrollTop, scrollHeight, clientHeight } = document.getElementById('scroll')
	align_calendar_to_top_event()

	if (is_initial_scroll) {
		last_scroll = scrollTop
		setTimeout(() => {
			is_initial_scroll = false		// smooth scrolling can be still going on
			// At scrollTop 0 scrolling up fires no scroll event, so older events would never load
			nudge_timer ??= setInterval(() => {
				let scroll = document.getElementById('scroll')
				if(scroll.scrollTop == 0) scroll.scroll(0,2)
			}, 100)
		}, 500)
		return
	}

	last_scroll = Math.min(last_scroll, scrollTop)
	if (!calendar_pinned && Math.abs(scrollTop - last_scroll) > 200) close_calendar()

  if (clientHeight + scrollTop >= scrollHeight - 100) await render_events_below()
	if (scrollTop < 100) await render_events_above()
}
document.getElementById('scroll').addEventListener('scroll', scroll_listener)
for (const type of ['wheel', 'touchstart', 'pointerdown']) document.getElementById('scroll').addEventListener(type, follow_list_again, { passive: true })


document.getElementById('js-calendar-placeholder-filter').addEventListener('click', open_modal)
document.getElementById('js-calendar-placeholder-open').addEventListener('click', open_calendar)


let switched = false;
let slider_timer = 0;
document.querySelectorAll('.double-slider').forEach(parent => {
	parent.addEventListener('focusin', e => {
		if(e.target.className == 'va') {
			parent.classList.toggle('switched');
		}
	}, false);
	parent.addEventListener('focusout', e => {
		if(e.target.className == 'va') {
			parent.classList.toggle('switched');
		}
	}, false);
	parent.addEventListener('input', e => {
		document.querySelectorAll(`.${e.target.className}`).forEach( el => {
			el.parentNode.style.setProperty(`--${e.target.className}`, +e.target.value);
			el.value = e.target.value;
			el.nextElementSibling.firstElementChild.innerHTML = CONSTANTS.school_years[e.target.value];
		});

		if((parseInt(document.getElementById('v1').value) < parseInt(document.getElementById('v0').value)) && !switched) {
			e.target.parentNode.classList.toggle('switched');
			switched = true;
		} else if ((parseInt(document.getElementById('v1').value) > parseInt(document.getElementById('v0').value)) && switched) {
			e.target.parentNode.classList.toggle('switched');
			switched = false;
		}

		if (e.target.className == 'va') FILTER.school[0] = e.target.value;
		else FILTER.school[1] = e.target.value;
		save_filter();

		clearTimeout(slider_timer);
		slider_timer = setTimeout(() => {
			render();
			CALENDAR.refresh();
		}, 300);
	}, false);
});

document.querySelectorAll('.va').forEach( el => {
	el.parentNode.style.setProperty('--va', FILTER.school[0]);
	el.value = FILTER.school[0];
	el.nextElementSibling.firstElementChild.innerHTML = CONSTANTS.school_years[FILTER.school[0]];
});

document.querySelectorAll('.vb').forEach( el => {
	el.parentNode.style.setProperty('--vb', FILTER.school[1]);
	el.value = FILTER.school[1];
	el.nextElementSibling.firstElementChild.innerHTML = CONSTANTS.school_years[FILTER.school[1]];
});
