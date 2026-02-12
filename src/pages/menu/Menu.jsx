import { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductCard from '../../components/product-card/ProductCard';
import { bobaProducts, categories } from '../../data/products-data';
import './Menu.css';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? bobaProducts
      : bobaProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="app-container">
      <Header />
      <main className="menu-main">
        <section className="menu-intro">
          <h1 className="menu-title">Our menu</h1>
          <p className="menu-desc">
            Customise your drink: sugar level (0–100%), ice (none/normal/extra) and extra toppings.
            Order in store only.
          </p>
        </section>

        <div className="menu-filters">
          <button
            type="button"
            className={`filter-btn ${activeCategory === 'all' ? 'filter-btn-active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-btn ${activeCategory === cat.id ? 'filter-btn-active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <section className="menu-grid-wrap">
          <div className="product-grid menu-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="menu-empty">No drinks in this category.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
