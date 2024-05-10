
# Cloudflare Pages Blog

## Introduction

Welcome to the Cloudflare Pages Blog repository. This project is designed to host a static blog using Cloudflare Pages, leveraging its seamless integration with GitHub for continuous deployment. This blog is built with Jekyll, a popular static site generator, allowing for easy content management and theme customization.

## Features

- **Fast and Secure**: Hosted on Cloudflare Pages, the blog benefits from fast CDN delivery and built-in SSL.
- **Easy to Update**: Add or update blog posts through Markdown files.
- **Responsive Design**: The template is fully responsive and works well on all devices.
- **SEO Optimized**: Basic SEO practices are implemented for better visibility.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Git
- Ruby (version 2.5 or above)
- Bundler (`gem install bundler`)

## Local Development

To set up and run the blog locally, follow these steps:

1. **Clone the repository**

   ```bash
   git clone https://github.com/Felix-Tr/cloudfare-pages-blog.git
   cd cloudfare-pages-blog
   ```

2. **Install dependencies**

   ```bash
   bundle install
   ```

3. **Run the development server**

   ```bash
   bundle exec jekyll serve
   ```
   This will start the Jekyll server, making the site accessible via `http://localhost:4000`.

## Adding Content

To add a new blog post, create a Markdown file in the `_posts` directory with the following naming convention:
```
YYYY-MM-DD-title-of-your-post.md
```
In the Markdown file, include the necessary front matter at the top:

```yaml
---
layout: post
title: "Title of Your Post"
date: YYYY-MM-DD HH:MM:SS
categories: [tutorial, demo]
---
```

Add your content below the front matter in Markdown format.

## Deployment

This project is configured to automatically deploy to Cloudflare Pages upon pushing to the main branch. Ensure you have connected your GitHub repository to Cloudflare Pages and configured the build settings:

- **Build command**: `jekyll build`
- **Build output directory**: `_site`

## Contributing

Contributions to this blog are welcome! Please read through the contribution guidelines before submitting pull requests or issues.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or concerns, please open an issue in the GitHub repository or contact [your-email@example.com](mailto:your-email@example.com).

---

This template should give you a good starting point for documenting your blog project hosted on Cloudflare Pages. Make sure to adjust the README as necessary to fit the specifics of your setup and the technologies you are using.
