import React from "react"
import { Event } from "../utils/types"
import EventItem from "./eventitem"
import FilterBar from "./filterbar"

type ItemListProps = {
  events: Event[]
}

const EventList = ({ events }: ItemListProps) => (
  <div className="flex-1 overflow-y-scroll">
    <FilterBar />

    <div className="max-w-4xl mx-auto px-4 py-2">
      {events.map(event => (
        <EventItem event={event} />
      ))}
    </div>
  </div>
)

export default EventList
