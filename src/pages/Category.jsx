import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/Sidebar';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;


const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

const queryMap = {
  gaming: 'gaming',
  music: 'music',
  news: 'latest news',
  sports: 'sports',
  trending: 'trending',
  entertainment: 'entertainment',
  technology: 'technology',
  blogs: 'blogs',
};

const otherCategory = [
  "all", "gaming", "cod", "live", "furniture", "minimalist",
  "fortnite", "pc", "music", "news", "vlogs", "fly",
  "bikes", "supercars", "aircrafts", "architecture"
];

const CategoryPage = () => {
  const { category } = useParams();
  const [videos, setVideos] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const query = queryMap[category] || category || 'trending';
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=12&key=${API_KEY}`
      );
      const data = await res.json();
      setVideos(data.items || []);
    };

    fetchVideos();
  }, [category]);

  const toggleSidebar = () => {
  if (window.innerWidth < 640) {
    setSidebarVisible(prev => !prev); // only control visibility on small screens
  } else {
    setIsSidebarCollapsed(prev => !prev); // collapse/expand on larger screens
  }
};

  return (
    <div id="MainPage" className="min-h-screen w-full">
      {/* Navbar with toggle */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex">
        {/* Sidebar with collapse state */}
        <Sidebar collapsed={window.innerWidth < 640 ? true : isSidebarCollapsed} visible={isSidebarVisible} />

        <div className="flex-1 px-6">
          {/* Filter Tabs */}
          {/* Filter Tabs */}
          <div className="flex gap-2 py-4 flex-wrap">
  {otherCategory.map((name, index) => (
    <Link
      key={name}
      to={`/${name}`}
      className={`
        flex-shrink-0 bg-gray-200 px-4 py-1.5 rounded-lg text-sm font-medium
        hover:bg-gray-300 transition

        ${
          index < 5
            ? 'inline-block'
            : index < 6
            ? 'hidden md:inline-block'
            : index < 9
            ? 'hidden lg:inline-block'
            : 'hidden xl:inline-block'
        }
      `}
    >
      {name}
    </Link>
  ))}

  <div className="w-5 flex items-center">
    <img src="/PNG/right-arrow.svg" alt="Right Arrow" />
  </div>
</div>




          {/* Header with Icon */}
          <div className="m-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={`/PNG/${category}.png`}
                alt={category}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <h2 className="text-3xl font-bold capitalize">{category}</h2>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-3 2xl:grid-cols-4">
              {videos.map((video) => (
                <Link
                  key={video.id.videoId}
                  to={`/watch/${video.id.videoId}`}
                  className="block"
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt="thumbnail"
                    className="rounded-lg w-full"
                  />
                  <p className="mt-2 text-sm font-semibold">
                    {video.snippet.title.length > 50
                      ? video.snippet.title.slice(0, 50) + '...'
                      : video.snippet.title}
                  </p>
                  <div className="flex text-xs text-gray-500 space-x-2">
                    <p>{video.snippet.channelTitle}</p>
                    <p>•</p>
                    <p>{timeAgo(video.snippet.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
