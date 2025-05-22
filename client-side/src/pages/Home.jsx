import React, { useState, useEffect } from 'react';
import '../styles/home.css';

const bgImages = [
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2x0c2d5Y2E5ZzJrZXkzOWE5eHd2YWFvZndoMGcxMG1hejB6b2R5YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Sb7z05GQV4WR9q2mMW/giphy.webp",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2pibDg0bHYxbGxpMDM0Y3I1MXpxNXF1cnR2cGgxeWJva2NzemlmeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cafl8C4fBXRLtbWpIz/giphy.gif"
];

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
  const [bgImage, setBgImage] = useState(bgImages[0]);

  useEffect(() => {
    // Pick a random background image on mount (page load)
    const randomIndex = Math.floor(Math.random() * bgImages.length);
    setBgImage(bgImages[randomIndex]);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className="home-hero"
      id="home"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="home-container">
        <div className="text-content">
          <p className="sub-title">Next-Gen Audio Experience</p>
          <h1 className="main-title">AirPods</h1>
          <p className="description">
            Step into the sound of tomorrow. Engineered for immersive clarity and sleek performance.
          </p>
          <p className="description">
            Pure black finish. Precision-tuned bass. Absolute comfort.
          </p>
          <a href="#products" className="see-more">Explore Now ↗</a>
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
