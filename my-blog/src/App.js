import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import BlogPostList from './BlogPostList';
import BlogPost from './BlogPost';
import GraphVisualization from './GraphVisualization';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>My Blog</h1>
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
          <p>&copy; 2023 My Blog. All rights reserved.</p>
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