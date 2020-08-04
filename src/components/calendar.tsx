import React from "react"

const Calendar = () => {
  return (
    <div className="bg-gray-100 py-2 border-b md:border-b-0 md:border-r">

      <div className="px-4 md:px-6 flex items-center justify-between md:py-2 flex-row flex-wrap text-gray-700">
        <div className="flex-1">
          <i data-feather="arrow-left"></i>
        </div>
        <h2 className="text-xl text-center font-bold flex-shrink-0">Január 2020</h2>
        <div className="flex flex-1 justify-end">
          <i data-feather="filter" className="mr-2 md:hidden"></i>
          <i data-feather="arrow-right"></i>
        </div>
      </div>

      <div className="grid grid-cols-7 border border-gray-400 mx-2 my-2 text-center" style={{gridAutoRows: "1fr"}}>
        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">1</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">2</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">3</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">4</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">5</div>
          <div className="flex justify-center -mr-1 flex-wrap">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-1 mb-1"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1 mb-1"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1 mb-1"></div>
          </div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-red-700 text-xs">6</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-red-700 text-xs">7</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">8</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">9</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">10</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">11</div>
          <div className="flex justify-center -mr-1 flex-wrap">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 mb-1"></div>
          </div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">12</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-red-700 text-xs">13</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-red-700 text-xs">14</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">15</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">16</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">17</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">18</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">19</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-red-700 text-xs">20</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-red-700 text-xs">21</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">22</div>
          <div className="flex justify-center -mr-1 flex-wrap">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1 mb-1"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1 mb-1"></div>
          </div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">23</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">24</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">25</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">26</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-red-700 text-xs">27</div>
        </div>

        <div className="border-b border-gray-400 px-2 py-1">
          <div className="font-bold text-red-700 text-xs">28</div>
        </div>

        <div className="border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">29</div>
        </div>

        <div className="border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">30</div>
        </div>

        <div className="border-gray-400 px-2 py-1">
          <div className="font-bold text-gray-600 text-xs">31</div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
