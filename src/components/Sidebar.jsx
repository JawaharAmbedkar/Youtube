import { Link, useLocation } from "react-router-dom";

const youtubers = [
  "PewDiePie", "MrBeast", "Justin Bieber", "5-Minute Crafts", "Linus Tech Tips"
];

const Sidebar = ({ collapsed, visible }) => {
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: "home" },
    { label: "Gaming", path: "/gaming", icon: "gaming" },
    { label: "Sports", path: "/sports", icon: "sports" },
    { label: "Entertainment", path: "/entertainment", icon: "entertainment" },
    { label: "Technology", path: "/technology", icon: "technology" },
    { label: "Music", path: "/music", icon: "music" },
    { label: "Blogs", path: "/blogs", icon: "blogs" },
    { label: "News", path: "/news", icon: "news" },
  ];

  return (
    <div
      className={`
        bg-white border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-60"}
        
        // Positioning
        ${visible ? "absolute top-16 left-0 z-40" : "hidden"} 
        sm:relative sm:block
      `}
    >
      {/* Navigation Links */}
      <div className={`mt-5 ${collapsed ? "flex flex-col items-center" : "ml-5"}`}>
        <div className="flex flex-col space-y-6">
          {navItems.map(({ label, path, icon }) => {
            const isActive = location.pathname === path;

            return (
              <Link to={path} key={path} className="flex items-center gap-3 group">
                <div className="relative">
                  <img src={`/PNG/${icon}.png`} alt={label} className="w-6 h-6" />
                  {isActive && (
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-full" />
                  )}
                </div>
                {!collapsed && (
                  <span className="text-sm font-medium group-hover:text-red-500 transition">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6" />

      {/* Youtuber Avatars */}
      <div className={`flex flex-col gap-4 ${collapsed ? "items-center" : "ml-6"}`}>
        {youtubers.map((name) => (
          <div key={name} className="flex items-center gap-3">
            <img
              src={`/PNG/${name}.png`}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">{name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
