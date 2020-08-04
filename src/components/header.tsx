import { Link } from "gatsby"
import React from "react"

const Header = () => {
  return (
    <div className="bg-blue-500 text-white">
      <div className="px-4 md:px-6 flex justify-center md:justify-between items-center py-4 flex-col md:flex-row">
        <Link to="/" className="font-bold text-xl mb-1 md:mb-0">KockatýKalendár.sk</Link>

        <div className="font-medium px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-700 text-xs md:text-sm">Prihlásiť sa na odber noviniek</div>
      </div>
    </div>
  )
}

export default Header
