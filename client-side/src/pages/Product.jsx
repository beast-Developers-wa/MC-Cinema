import React from 'react';
import '../styles/product.css';


import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';

const products = [
  {
    id: 1,
    name: 'ShadowPods',
    description: 'Deep bass, sleek matte finish, noise-cancellation.',
    image: img1,  
    price: '$129',
  },
  {
    id: 2,
    name: 'NeoPods',
    description: 'Crystal clear audio with futuristic design.',
    image: img2,
    price: '$149',
  },
  {
    id: 3,
    name: 'SonicEdge',
    description: 'High performance audio tuned for pros.',
    image: img3,
    price: '$179',
  },
];

const Product = () => {
  return (
    <section className="product-section" id="products">
      <h2 className="section-title">Our Products</h2>
      <div className="product-grid">
        {products.map(({ id, name, description, image, price }) => (
          <div className="product-card" key={id}>
            <img src={image} alt={name} className="product-image" />
            <h3 className="product-name">{name}</h3>
            <p className="product-description">{description}</p>
            <p className="product-price">{price}</p>
            <button className="buy-btn">Buy Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Product;
