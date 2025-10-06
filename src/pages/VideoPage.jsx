import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";

const API_KEY = 'AIzaSyBnLEBoOr0dhOMOfiVDNi_x3OtNgoa7BZE';

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

const formatCount = (num) => {
  if (!num) return '0';
  const n = Number(num);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const VideoPage = () => {
  const { videoId } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [comments, setComments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`
        );
        const videoJson = await videoRes.json();
        if (!videoJson.items || videoJson.items.length === 0) return;
        const video = videoJson.items[0];
        setVideoData(video);

        const channelId = video.snippet.channelId;
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
        );
        const channelJson = await channelRes.json();
        if (!channelJson.items || channelJson.items.length === 0) return;
        setChannelData(channelJson.items[0]);

        const commentRes = await fetch(
          `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=5&key=${API_KEY}`
        );
        const commentJson = await commentRes.json();
        setComments(commentJson.items || []);

        const relatedUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&key=${API_KEY}`;
        const relatedRes = await fetch(relatedUrl);
        const relatedJson = await relatedRes.json();

        if (relatedJson.items && relatedJson.items.length > 0) {
          setRecommended(relatedJson.items);
        } else {
          const fallbackRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=trending&type=video&maxResults=10&key=${API_KEY}`
          );
          const fallbackJson = await fallbackRes.json();
          setRecommended(fallbackJson.items || []);
        }
      } catch (error) {
        console.error("Failed to load video data:", error);
      }
    };

    fetchData();
  }, [videoId]);

  if (!videoData || !channelData) return <div>Loading...</div>;

  const { snippet, statistics } = videoData;

  return (
    <div>
      <Navbar />
      <div className="flex flex-col xl:flex-row px-4 py-6 gap-6">
        {/* Left Column */}
        <div className="w-full xl:w-[70%]">
          {/* Video */}
          <div className="w-full">
            <iframe
              className="w-full aspect-video rounded-xl"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold mt-4">{snippet.title}</h1>

          {/* Views and Actions */}
          <div className="text-sm text-gray-600 mt-1 flex justify-between flex-wrap">
            <span>{formatCount(statistics.viewCount)} views · {timeAgo(snippet.publishedAt)}</span>
            <div className="flex gap-3 items-center mt-2 sm:mt-0">
              <div className="flex gap-1 items-center">
                <img className="w-5" src="/PNG/like.png" alt="like" />
                <span>{formatCount(statistics.likeCount)} likes</span>
              </div>
              <img className="w-5" src="/PNG/dislike.png" alt="dislike" />
              <div className="flex gap-1 items-center">
                <img className="w-5" src="/PNG/share.png" alt="share" />
                <p>Share</p>
              </div>
              <div className="flex gap-1 items-center">
                <img className="w-5" src="/PNG/music.png" alt="playlist" />
                <p>Save</p>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex items-center gap-3 mt-4 border-b pb-4 border-gray-300">
            <img
              src={channelData.snippet.thumbnails.default.url}
              className="w-12 h-12 rounded-full"
              alt="channel"
            />
            <div>
              <p className="font-semibold">{channelData.snippet.title}</p>
              <p className="text-sm text-gray-500">{formatCount(channelData.statistics.subscriberCount)} subscribers</p>
            </div>
            <Link className="border rounded-2xl w-22 flex justify-center ml-3 text-white bg-black items-center pb-1 pt-0.5 text-sm font-semibold">
              Subscribe
            </Link>
          </div>

          {/* Description */}
          <div className="text-sm mt-4 whitespace-pre-wrap bg-gray-200 rounded-2xl p-2">
            {showFullDescription ? snippet.description : snippet.description.slice(0, 200) + '...'}
            <button
              className="text-blue-600 ml-1 font-medium"
              onClick={() => setShowFullDescription((prev) => !prev)}
            >
              {showFullDescription ? "Show less" : "Show more"}
            </button>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Top Comments</h2>
            {comments.map((comment) => {
              const c = comment.snippet.topLevelComment.snippet;
              return (
                <div key={comment.id} className="mb-6">
                  <div className="flex items-center gap-2">
                    <img src={c.authorProfileImageUrl} className="w-6 h-6 rounded-full" />
                    <span className="font-medium text-sm">{c.authorDisplayName}</span>
                    <span className="text-xs text-gray-500">{timeAgo(c.publishedAt)}</span>
                  </div>
                  <p className="ml-8 text-sm mt-1">{c.textDisplay}</p>
                  <div className="flex gap-3 items-center ml-8 mt-1">
                    <div className="flex gap-1 items-center">
                      <img className="w-4 h-4" src="/PNG/like.png" alt="like" />
                      <span>{formatCount(c.likeCount)} likes</span>
                    </div>
                    <img className="w-4 h-4" src="/PNG/dislike.png" alt="dislike" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full xl:w-[30%] mt-6 xl:mt-0">
          <h2 className="text-lg font-semibold mb-3">Recommended Videos</h2>
          <div className="flex flex-col gap-4">
            {recommended.map((video) => {
              const vidId = video.id.videoId || video.id;
              return (
                <Link
                  to={`/watch/${vidId}`}
                  key={vidId}
                  className="flex gap-3 hover:bg-gray-100 rounded-xl p-2"
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    className="w-[180px] h-[100px] object-cover rounded-lg"
                    alt="thumbnail"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm line-clamp-2">{video.snippet.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{video.snippet.channelTitle}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
