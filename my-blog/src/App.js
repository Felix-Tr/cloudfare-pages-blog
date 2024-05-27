import React, { useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import BlogPostList from './BlogPostList';
import BlogPost from './BlogPost';
import GraphVisualization from './GraphVisualization';
import logo from './assets/images/android-chrome-512x512.png';

function App() {
  const [direction, setDirection] = useState('right');

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection((prevDirection) => (prevDirection === 'right' ? 'left' : 'right'));
    }, 20000); // Change direction every 20 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="App">
        <header>
          <div className={`logo-container ${direction}`}>
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/podcasts">Podcasts</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
          <Route exact path="/" element={<Home />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2023 FT's Website. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <BlogPostList />
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
      <p>This is the about page of my blog.</p>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h2>Contact</h2>
      <p>You can contact me at info@myblog.com.</p>
    </div>
  );
}

function Podcasts() {
  return (
    <div>
      <GraphVisualization />
    </div>
  );
}

export default App;