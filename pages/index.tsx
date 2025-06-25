import React from 'react';
import { Mainsection } from "../components/Mainsection";
import { FeatureSection } from "../components/Featuresection";
import { Platform } from "../components/Platform";
import { Solutions } from "../components/Solutions"
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Testimonials } from '../components/Testimonials';

export default function Home() {
    return (
        <>
  
        <div className="wrapper" style={{ maxWidth: '100vw', width: '100%' }}>
        <Navbar />
        <main className="flex-grow">
          <Mainsection />
          <FeatureSection />
          <Platform />
          <Solutions/>
          <Testimonials/>
        </main>
        <Footer />
      </div>
        </>
    )
}