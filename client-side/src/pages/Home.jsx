import React, { useState } from 'react';
import '../styles/home.css';

const images = [
  'src/assets/img1.png',
  'src/assets/img2.png',
  'src/assets/img3.png',
'src/assets/img4.png',
'src/assets/img5.png',
'src/assets/img6.png',
 
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="home-hero" id="home">
      <div className="home-container">
        <div className="text-content">
          <p className="sub-title">Design Slider</p>
          <h1 className="main-title">Airpod</h1>
          <p className="description">
            Experience the future of sound with crystal-clear audio and noise isolation.
          </p>
          <p className="description">
            Matte black elegance meets powerful performance.
          </p>
          <a href="#products" className="see-more">SEE MORE ↗</a>
        </div>

        <div className="image-content">
          <button onClick={prevSlide} className="carousel-btn prev" aria-label="Previous Slide">‹</button>
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="airpod-image"
            draggable={false}
          />
          <button onClick={nextSlide} className="carousel-btn next" aria-label="Next Slide">›</button>
        </div>
      </div>
    </section>
  );
};

export default Home;
