import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BestSelling from '../components/BestSelling';
import ProductList from '../components/ProductList';
import ContactSection from '../components/ContactSection';
import BlackFridayBanner from '../components/BlackFridayBanner/BlackFridayBanner';
import Loading from '../components/Loading/Loading';
import api from '../api/api';
import './Home.css';
import TimerDisplay from '../components/Admin/TimerDisplay';
import DiscountedProducts from '../components/DiscountedProducts';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [blackFridayData, setBlackFridayData] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const [heroSettings, setHeroSettings] = useState({
    type: 'image',
    mediaUrl: '/uploads/hero/hero.jpg',
    title: 'Welcome to Our Store',
    subtitle: 'Discover Amazing Products'
  });

  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const response = await api.getSettings();
        if (response?.heroSection) {
          setHeroSettings({
            type: response.heroSection.type || 'image',
            mediaUrl: response.heroSection.mediaUrl || '/uploads/hero/hero.jpg',
            title: response.heroSection.title || 'Welcome to Our Store',
            subtitle: response.heroSection.subtitle || 'Discover Amazing Products'
          });
        }
      } catch (error) {
        console.error('Error fetching hero settings:', error);
      }
    };

    fetchHeroSettings();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsData = await api.getProducts();
        setProducts(productsData);

        const uniqueCategories = [...new Set(productsData.map(product => product.category))];
        setCategories(uniqueCategories);

        try {
          if (api.getBlackFridayData) {
            const blackFridayResponse = await api.getBlackFridayData();
            if (blackFridayResponse?.isActive) {
              setBlackFridayData({
                discount: blackFridayResponse.discountPercentage,
                endDate: blackFridayResponse.endDate
              });
            }
          }
        } catch (blackFridayError) {
          console.log('Black Friday data not available');
        }

      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home-container">
      {blackFridayData && (
        <BlackFridayBanner
          endDate={blackFridayData.endDate}
          discount={blackFridayData.discount}
        />
      )}

      <section className="hero-section">
        <div className="hero-overlay"></div>
        {heroSettings.type === 'video' ? (
          <video
            src={`${process.env.REACT_APP_API_URL}${heroSettings.mediaUrl}`}
            className="hero-media"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={`${process.env.REACT_APP_API_URL}${heroSettings.mediaUrl}`}
            alt="Hero"
            className="hero-media"
          />
        )}
        <div className="hero-content">
          <h1 className="hero-title">{heroSettings.title}</h1>
          <p className="hero-subtitle">{heroSettings.subtitle}</p>
        </div>
      </section>

      {!searchQuery && (
        <>
          <section className="py-5 bg-light">
            <div className="container">
              <DiscountedProducts />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Special Offers</h2>
                <TimerDisplay />
              </div>
            </div>
          </section>
          <section className="py-5">
            <div className="container">
              <BestSelling />
            </div>
          </section>
        </>
      )}

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Products'}
          </h2>

          {!searchQuery && (
            <div className="row justify-content-center mb-4">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <div className="text-center py-5">
              <h3>No products found</h3>
              {searchQuery && (
                <p>No results found for "{searchQuery}". Try a different search term or browse our categories.</p>
              )}
            </div>
          )}
        </div>
      </section>

      <ContactSection />
    </div>
  );
}

export default Home;