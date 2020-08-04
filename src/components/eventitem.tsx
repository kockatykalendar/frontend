import React from "react"
import { Event } from "../utils/types"
import { Users, Book, MapPin, ChevronDown, ChevronUp, Info } from "react-feather"


const EventItem = ({ event }: Event) => {
  const scienceMap = {
    "mat": "matematika",
    "fyz": "fyzika",
    "inf": "informatika",
    "other": "iné",
  }

  const typeMap = {
    "sutaz": "súťaž",
    "seminar": "seminár",
    "sustredenie": "sústredenie",
    "vikendovka": "víkendovka",
    "tabor": "tábor",
    "olympiada": "olympiáda",
    "prednasky": "prednášky",
  }

  const sciences = event.sciences.map((x) => scienceMap[x]).join(', ')

  let datesForHuman = ""
  if (event.date.text) {
    datesForHuman = event.date.text
  } else {
    let date = new Date(event.date.start)
    datesForHuman = date.getDate() + ". " + (date.getMonth() + 1) + "."

    if (event.date.end) {
      date = new Date(event.date.end)
      datesForHuman += " – " + date.getDate() + ". " + (date.getMonth() + 1) + "."
    }
  }

  let contestantsForHuman = ""
  if (event.contestants.min == 'zs1' && event.contestants.max == 'zs9') {
    contestantsForHuman = "ZŠ"
  } else if (event.contestants.min == 'ss1' && event.contestants.max == 'ss4') {
    contestantsForHuman = "SŠ"
  } else {
    if (event.contestants.min.substr(0, 2) == event.contestants.max.substr(0, 2)) {
      contestantsForHuman = (event.contestants.min.substr(0, 2) == "zs" ? "ZŠ" : "SŠ")
      contestantsForHuman += " " + event.contestants.min.substr(2) + " – " + event.contestants.max.substr(2)
    } else {
      contestantsForHuman = (event.contestants.min.substr(0, 2) == "zs" ? "ZŠ" : "SŠ")
      contestantsForHuman += " " + event.contestants.min.substr(2) + " – "
      contestantsForHuman += (event.contestants.max.substr(0, 2) == "zs" ? "ZŠ" : "SŠ")
      contestantsForHuman += " " + event.contestants.max.substr(2)
    }
  }

  return (
    <div className="mb-2 md:mb-4">
      <div className="flex items-center">
        <div>
          <div className="flex items-center">
            <div>{ datesForHuman }</div>
            <div className="inline-block mx-2 w-3 h-3 bg-red-600 rounded-full"></div>
            <h2 className="font-bold text-xl">{ event.name }</h2>
          </div>
          <div className="flex text-gray-600 mb-1 flex-wrap items-center text-sm">
            <div className="flex items-center mr-5 rounded-md">
              <Info className="w-4 mr-2" />
              <span>{ typeMap[event.type] }</span>
            </div>

            <div className="flex items-center mr-5">
              <Users className="w-4 mr-2" />
              <span>{ contestantsForHuman }</span>
            </div>

            <div className="flex items-center mr-5">
              <Book className="w-4 mr-2" />
              <span>{ sciences }</span>
            </div>

            <div className="flex items-center mr-5">
              <MapPin className="w-4 mr-2" />
              <span>{ event.places.join(', ') }</span>
            </div>
          </div>
        </div>

        <div className="flex rounded-full border-gray-400 text-gray-700 md:hidden">
          <ChevronDown />
        </div>
      </div>

      <div className="hidden md:block">
        <p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil blanditiis, nulla modi, natus doloribus temporibus. Natus tempore, tempora quam doloribus.</p>

        {event.link && <a href={event.link} className="rounded-lg bg-gray-300 text-gray-700 font-bold px-3 py-2 hover:bg-gray-400 text-xs">Viac informácií &raquo;</a>}
      </div>
    </div>
  )
}

export default EventItem
