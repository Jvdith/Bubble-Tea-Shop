import { Link } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductCard from '../../components/product-card/ProductCard';
import { bobaProducts } from '../../data/products-data';
import './Home.css';
import heroBg from '../../assets/bubble-background.jpg';


const Home = () => {
  console.log(bobaProducts);

  const featuredIds = new Set([1, 2, 3]);
  const featured = bobaProducts.filter((p) => featuredIds.has(p.id));

  return (
    <div className="app-container">
      <Header />
      <main className="home-main">
        <section
          className="hero"
          style={{ backgroundImage: `url(${heroBg})` }}
        >

          <div className="hero-content">
            <p className="hero-label">Fresh bubble tea</p>
            <h1 className="hero-title">
              Slow down.<br />Sip something special.
            </h1>
            <p className="hero-desc">
              Handcrafted with natural ingredients, topped with our signature pearl pop.
            </p>
            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary">
                View menu
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Find us
              </Link>
            </div>
          </div>
        </section>

        <section className="section section-stars">
          <h2 className="section-title">Our favourites</h2>
          <p className="section-desc">Best-sellers. Try these three and tell us which one you like best.</p>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
          <Link to="/menu" className="section-link">
            View full menu →
          </Link>
        </section>

        <section className="section section-cta">
          <div className="cta-box">
            <h2 className="cta-title">Fancy customising?</h2>
            <p className="cta-desc">
              On our menu you can choose sugar level, ice and extra toppings.
              Come and try, and create your perfect combination.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Get in touch or visit us
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
