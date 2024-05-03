// src/BlogPostList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Octokit } from '@octokit/core';

const BlogPostList = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const loadBlogPosts = async () => {
      const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_PAT });
      const owner = 'Felix-Tr';
      const repo = 'cloudfare-pages-blog';
      const path = 'posts';

      try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path,
        });

        const posts = await Promise.all(
          response.data
            .filter((file) => file.name.endsWith('.md'))
            .map(async (file) => {
              const contentResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner,
                repo,
                path: file.path,
              });

              const content = atob(contentResponse.data.content);
              const [, metadata, ] = content.split('---');
              const { title, date } = parseMetadata(metadata);

              return {
                title,
                date,
                slug: file.name.replace('.md', ''),
              };
            })
        );

        setBlogPosts(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    loadBlogPosts();
  }, []);

  const parseMetadata = (metadata) => {
    const lines = metadata.split('\n');
    const metadataObj = {};

    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        metadataObj[key.trim()] = value.trim().replace(/"/g, '');
      }
    });

    return metadataObj;
  };

  return (
    <div>
      {blogPosts.map((post, index) => (
        <div key={index}>
          <h2>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p>{post.date}</p>
          <Link to={`/blog/${post.slug}`}>Read More</Link>
        </div>
      ))}
    </div>
  );
};

export default BlogPostList;