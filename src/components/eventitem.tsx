import React from "react"
import { Event } from "../utils/types"
import { scienceTexts, eventTexts } from "../constants"
import { Users, Book, MapPin, ChevronDown, Info } from "react-feather"
import { formatContestants, formatDates } from "../utils/textFormatting"

type Props = {
  event: Event
}

// TODO: real event descriptions instead of lipsum.
// TODO: add stories to test common cases of event data.

const EventItem = ({ event }: Props) => (
  <div className="mb-2 md:mb-4">
    <div className="flex items-center">
      <div>
        <div className="flex items-center">
          <div>{formatDates(event)}</div>
          <div className="inline-block mx-2 w-3 h-3 bg-red-600 rounded-full"></div>
          <h2 className="font-bold text-xl">{event.name}</h2>
        </div>
        <div className="flex text-gray-600 mb-1 flex-wrap items-center text-sm">
          <div className="flex items-center mr-5 rounded-md">
            <Info className="w-4 mr-2" />
            <span>{eventTexts[event.type]}</span>
          </div>

          <div className="flex items-center mr-5">
            <Users className="w-4 mr-2" />
            <span>{formatContestants(event)}</span>
          </div>

          <div className="flex items-center mr-5">
            <Book className="w-4 mr-2" />
            <span>{event.sciences.map(x => scienceTexts[x]).join(", ")}</span>
          </div>

          <div className="flex items-center mr-5">
            <MapPin className="w-4 mr-2" />
            <span>{event.places.join(", ")}</span>
          </div>
        </div>
      </div>

      <div className="flex rounded-full border-gray-400 text-gray-700 md:hidden">
        <ChevronDown />
      </div>
    </div>

    <div className="hidden md:block">
      <p className="mb-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil
        blanditiis, nulla modi, natus doloribus temporibus. Natus tempore,
        tempora quam doloribus.
      </p>

      {event.link && (
        <a
          href={event.link}
          className="rounded-lg bg-gray-300 text-gray-700 font-bold px-3 py-2 hover:bg-gray-400 text-xs"
        >
          Viac informácií &raquo;
        </a>
      )}
    </div>
  </div>
)

export default EventItem
