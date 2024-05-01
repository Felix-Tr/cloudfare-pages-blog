import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>My Blog</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route exact path="/" element={<Home />} />
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
      <section className="post">
        <h2 className="post-title"><Link to="/post1">My First Blog Post</Link></h2>
        <p className="post-date">July 1, 2023</p>
        <div className="post-content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, magna a bibendum bibendum, augue magna tincidunt enim, eget ultricies magna augue eget est. Maecenas vestibulum urna vitae pellentesque iaculis.</p>
          <Link to="/post1" className="read-more">Read More</Link>
        </div>
      </section>

      <section className="post">
        <h2 className="post-title"><Link to="/post2">Another Blog Post</Link></h2>
        <p className="post-date">June 28, 2023</p>
        <div className="post-content">
          <p>Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet.</p>
          <Link to="/post2" className="read-more">Read More</Link>
        </div>
      </section>
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

export default App;