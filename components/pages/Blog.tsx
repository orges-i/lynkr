import React from 'react';
import { Reveal } from '../ui/Reveal';

const articles = [
  {
    title: 'Why your link in bio is your most important asset',
    excerpt: 'In a fragmented social media landscape, owning your traffic has never been more critical.',
    date: 'April 2, 2024',
    readTime: '5 min read',
    image: 'https://picsum.photos/600/400?random=10'
  },
  {
    title: 'Design principles for high-converting bio pages',
    excerpt: 'We analyzed 10,000 profiles. Here is what the top 1% do differently.',
    date: 'March 28, 2024',
    readTime: '8 min read',
    image: 'https://picsum.photos/600/400?random=11'
  },
  {
    title: 'Introducing LYNKR Analytics 2.0',
    excerpt: 'A deep dive into our new tracking engine and how it helps you grow.',
    date: 'March 15, 2024',
    readTime: '4 min read',
    image: 'https://picsum.photos/600/400?random=12'
  },
  {
    title: 'Creator Spotlight: How Sarah grew to 100k subs',
    excerpt: 'An interview with one of our power users about her journey and tools.',
    date: 'March 1, 2024',
    readTime: '10 min read',
    image: 'https://picsum.photos/600/400?random=13'
  }
];

const Blog: React.FC = () => {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
      <Reveal className="mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">The Blog</h1>
        <p className="text-zinc-400 text-xl">Thoughts on design, creator economy, and product updates.</p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {articles.map((article, index) => (
          <Reveal key={index} delay={index * 100}>
            <article className="group cursor-pointer">
              <div className="overflow-hidden rounded-2xl mb-6 border border-white/10">
                <img src={article.image} alt={article.title} className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                 <span>{article.date}</span>
                 <span>•</span>
                 <span>{article.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">{article.title}</h2>
              <p className="text-zinc-400 leading-relaxed">{article.excerpt}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Blog;