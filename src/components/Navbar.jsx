import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="w-full bg-white shadow-md px-1 py-1 sm:px-4 sm:py-2 flex justify-between items-center">
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-0.5 sm:gap-3">
        <img
          src="/PNG/sidebar.svg"
          alt="Sidebar"
          className="w-6 h-6 cursor-pointer"
          onClick={toggleSidebar}
        />
        <Link to="/">
          <img src="/PNG/Youtube-black.png" alt="YouTube Logo" className="w-20 h-5 sm:w-28 sm:h-7" />
        </Link>
      </div>

      {/* Center: Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="h-8 w-32 sm:w-80 rounded-full border border-gray-300 pl-3 pr-8 focus:outline-none text-sm sm:text-lg" 
          />
          <img
            src="/PNG/Search.svg"
            alt="Search Icon"
            className="w-4 absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>
        <div className="rounded-full bg-gray-200 p-2">
          <img src="/PNG/mic.svg" alt="Mic" className="w-4 sm:w-5" />
        </div>
      </div>

      {/* Right: Profile */}
      <div>
        <img src="/PNG/MrBeast.png" alt="Channel Logo" className="w-7 h-7 sm:w-10 sm:h-10 mt-0.5 rounded-full" />
      </div>
    </div>
  );
};

export default Navbar;
