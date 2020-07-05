import React from "react"
import { Event } from "../utils/types"

type ItemListProps = {
  events: Event[]
}

const EventList = ({ events }: ItemListProps) => {
  return (
    <div className="bg-white rounded-t-lg overflow-hidden border border-solid border-gray-400">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="bg-gray-100 font-bold border-b border-gray-400 text-left px-8 py-4">
              Udalosť
            </th>
            <th className="bg-gray-100 font-bold border-b border-gray-400 text-left px-8 py-4">
              Začiatok
            </th>
            <th className="bg-gray-100 font-bold border-b border-gray-400 text-left px-8 py-4">
              Koniec
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr
              key={event.id}
              className="border-solid border-b border-gray-200"
            >
              <td className="border px-8 py-3">{event.name}</td>
              <td className="border px-8 py-3">{event.date.start}</td>
              <td className="border px-8 py-3">{event.date.end || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EventList
