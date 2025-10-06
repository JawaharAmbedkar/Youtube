import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryPage from './pages/Category';
import VideoPage from './pages/VideoPage';
import './App.css';
import { Homepage } from './pages/Homepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/:category" element={<CategoryPage />} />
        <Route path="/watch/:videoId" element={<VideoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
