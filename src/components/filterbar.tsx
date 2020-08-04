import React from "react"
import { ChevronDown } from "react-feather"

const FilterBar = () => {
  return (
    <div className="hidden md:block bg-gray-100 border-b text-gray-700 sticky">
	    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center flex-row flex-wrap">
	      <div className="flex mr-4">
	        <i data-feather="filter" className="mr-2"></i> Filter:
	      </div>

	      <div className="relative">
	        <button className="flex bg-white border px-3 rounded-md py-1 text-black mr-2 focus:shadow-outline focus:border-blue-500 focus:bg-gray-400">
	          <span>ZŠ</span>
	          <ChevronDown className="w-4 ml-1" />
	        </button>

	        <div className="hidden absolute mt-1 bg-white border border-gray-500 rounded-md shadow-md">
	          <ul className="py-2 px-2 -mb-1">
	            <li className="whitespace-no-wrap py-1 bg-blue-500 text-white px-3 rounded-md mb-1">Základná škola</li>
	            <li className="whitespace-no-wrap py-1 text-black hover:bg-blue-500 hover:text-white px-3 rounded-md mb-1">Stredná škola</li>
	          </ul>
	        </div>
	      </div>

	      <div className="relative">
	        <button className="flex bg-white border px-3 rounded-md py-1 text-black mr-2 focus:shadow-outline focus:border-blue-500 focus:bg-gray-400">
	          <span>matematika</span>
	          <ChevronDown className="w-4 ml-1" />
	        </button>

	        <div className="hidden absolute mt-1 bg-white border border-gray-500 rounded-md shadow-md">
	          <ul className="py-2 px-2 -mb-1">
	            <li className="whitespace-no-wrap py-1 bg-blue-500 text-white px-3 rounded-md mb-1">Stredná škola</li>
	            <li className="whitespace-no-wrap py-1 text-black hover:bg-blue-500 hover:text-white px-3 rounded-md mb-1">Základná škola</li>
	          </ul>
	        </div>
	      </div>
	    </div>
	  </div>
  )
}

export default FilterBar
