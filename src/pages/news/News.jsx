import { useState, useEffect } from 'react';
import Footer from '../../components/footer/Footer';
import './News.css';

const News = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const YOUR_FIREBASE_URL = 'https://bubbly-369ad.web.app';
        
        const response = await fetch(`${YOUR_FIREBASE_URL}/feed.xml`);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const items = xmlDoc.querySelectorAll('item');
        const parsedItems = [];
        
        items.forEach((item) => {
          const title = item.querySelector('title')?.textContent || 'No title';
          const link = item.querySelector('link')?.textContent || '#';
          const description = item.querySelector('description')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          
          parsedItems.push({
            title,
            link,
            description,
            pubDate
          });
        });
        
        setFeedItems(parsedItems);
        setLoading(false);
      } catch (err) {
        console.error('Error loading RSS:', err);
        setError('Could not load feed');
        setLoading(false);
      }
    };

    fetchRSS();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="app-container">
      <main className="news-main">
        <h1 className="news-title">News about our Bubbly Shop</h1>
        
        <div className="rss-link-container">
          <a 
            href="https://bubbly-369ad.web.app/feed.xml" 
            target="_blank" 
            rel="noreferrer"
            className="rss-link"
          >
            <span className="rss-icon"></span> Subscribe!
          </a>
        </div>

        {loading && <div className="news-loading">Loading News...</div>}
        
        {error && (
          <div className="news-error">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && feedItems.length > 0 && (
          <div className="news-grid">
            {feedItems.map((item, index) => (
              <article key={index} className="news-card">
                <h2 className="news-card-title">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                </h2>
                
                <div className="news-card-meta">
                  <span className="news-date">
                    {formatDate(item.pubDate)}
                  </span>
                </div>
                
                <p className="news-card-description">
                  {item.description}
                </p>
                
              </article>
            ))}
          </div>
        )}

        {!loading && !error && feedItems.length === 0 && (
          <div className="news-empty">
            <p>No available news</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default News;