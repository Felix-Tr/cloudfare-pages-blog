// src/BlogPost.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Octokit } from '@octokit/core';
import ReactMarkdown from 'react-markdown';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_PAT });
      const owner = 'Felix-Tr';
      const repo = 'cloudfare-pages-blog';
      const path = `posts/${slug}.md`;

      try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path,
        });

        const content = atob(response.data.content);
        setPost({ content });
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };

    loadPost();
  }, [slug]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
};

export default BlogPost;