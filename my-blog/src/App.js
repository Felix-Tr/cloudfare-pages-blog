import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import GraphVisualization from './GraphVisualization';
import logo from './assets/images/android-chrome-512x512.png';
import linkedinIcon from './assets/images/linkedin-icon.png'; // Import LinkedIn icon
import githubIcon from './assets/images/github-icon-black.svg'; // Import GitHub icon

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
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/about" element={<About />} />
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
      <h1>Welcome to My Website</h1>
      <h2>About Me</h2>
      <p>
        My name is Felix Treutwein, and I recently started working as a project coordinator at the Mobility Department of the City of Munich. My career journey has taken me through various roles that have provided me with valuable experience and skills in IT and data analysis. Previously, I worked for six months as a Java Backend Developer for a company developing a Data Governance Tool as a SaaS solution. Other positions in my career include a year as a working student at Stadtwerke München, where I worked as a Cloud Engineer, and two years as a working student at Allianz consultancy subsidiary metafinanz, focusing on data science and small AI Proof of Concepts (PoCs).
      </p>
      <h2>My Motivation</h2>
      <p>
        My passion for Artificial Intelligence (AI) and its potential to solve complex problems is the driving force behind my career. With a master's degree in Robotics, Cognition, and Intelligence from the Technical University of Munich and a bachelor's degree in Physics, supplemented by a year in Computer Science, I have developed a deep understanding of both the theoretical and practical aspects of AI. My initial interest in AI was sparked by the question of how intelligence develops in the human neural network of our brain. I am particularly fascinated by the insights from neuroscience and how they can contribute to developing more efficient and resource-saving AI models.
      </p>
      <h2>My Goals</h2>
      <p>
        My goal is to leverage my knowledge and experience in AI to develop innovative solutions that can be applied in both administration and industry. I am particularly excited about the possibilities that GPT agents offer to streamline processes in companies. With my background and passion for AI, I strive to build services based on the latest technologies that provide real value.
      </p>
      <h2>Knowledge Sharing and Documentation</h2>
      <p>
        This website serves to document and share my knowledge. Based on the tech podcasts and content I consume, I will provide all sources in a graph to transparently showcase how I form my opinions. The goal is to additionally use Microsoft's graphRAG for chatting with my knowledge in the future. I hope this website provides enough insight into my work to obtain the necessary approvals.
      </p>
      <h2>Freelancing and Personal Projects</h2>
      <p>
        In addition to my role at the Mobility Department, I am also active as a freelancer. My goal is to build my own services using AI Services, including a chat that integrates and utilizes my documented sources.
      </p>
      <p>
        Thank you for visiting my website. If you have any questions or are interested in collaborating, please feel free to reach out.
      </p>
      <div className="social-icons-container">
        <a href="https://www.linkedin.com/in/felix-treutwein-059163176" target="_blank" rel="noopener noreferrer">
          <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
        </a>
        <a href="https://github.com/Felix-Tr" target="_blank" rel="noopener noreferrer">
          <img src={githubIcon} alt="GitHub" className="social-icon" />
        </a>
      </div>
    </div>
  );
}

function About() {
  return (
    <div>
       <h1>About This Website</h1>
        
        <p>Welcome to my personal project website! This platform is an evolving space where I share my work, experiments, and ideas related to web development, AI, and various other interests. As I continually enhance my skills and explore new technologies, this site will reflect those changes and growth.</p>
        <p>Please note that this website is perpetually under construction. I work on it whenever I have time, so you might notice frequent updates and changes. Currently, it’s a simple React application hosted with Cloudflare Pages.</p>
        
        <h2>Goals and Vision</h2>
        <p>The primary purpose of this website is to serve as a sandbox for testing new ideas and technologies. I aim to create a dynamic and interactive space that showcases my projects and provides useful resources for visitors. Whether it’s experimenting with new front-end frameworks, integrating AI-driven features, or optimizing performance, this site is where I bring those ideas to life.</p>
        
        <h2>Future Plans</h2>
        <p>I have some updates planned for this website, including:</p>
        <ul>
            <li><strong>Add reads to the graph </strong>: Filling the graph with the currated and consumed tech podcasts, newsletter reads, documents, papers, and so on</li>
            <li><strong>GraphRAG chat functionality</strong>: Adding chat functionalities over all the content in the graph using <a href="https://microsoft.github.io/graphrag/" target="_blank" rel="noopener noreferrer">Microsoft's GraphRAG</a>, which currently seems most promising to me even if it has some customization effort.</li>
        </ul>
        
        <h2>Contact Information</h2>
        <p>Feel free to reach out:</p>
        
        <div class="contact-info">
            <p><strong>Email</strong>: <a href="mailto:felix@treutwein.de">felix@treutwein.de</a></p>
            <p><strong>Location</strong>: Munich, Germany</p>
        </div>
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
