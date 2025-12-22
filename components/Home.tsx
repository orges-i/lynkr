import React from 'react';
import Hero from './Hero';
import ProductPreview from './ProductPreview';
import HowItWorks from './HowItWorks';
import Features from './Features';
import LiveDemo from './LiveDemo';
import Pricing from './Pricing';
import Testimonials from './Testimonials';

const Home: React.FC = () => {
  return (
    <div className="relative">
      <section id="hero"><Hero /></section>
      <section id="product"><ProductPreview /></section>
      <section id="how-it-works"><HowItWorks /></section>
      <section id="features"><Features /></section>
      <section id="demo"><LiveDemo /></section>
      <section id="pricing"><Pricing /></section>
      <section id="testimonials"><Testimonials /></section>
    </div>
  );
};

export default Home;
