import React, { useState } from 'react';

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const testimonials = [
    <div className="testimonial-slide" key={0}>
      <div className="testimonial-img"><img src="https://www.alpha-sense.com/wp-content/uploads/2024/11/oddo-bhf-case-study-hero-250x250.jpg"></img> </div>
      <div className="testimonial-info">
        <div className="testimonial-logo"><img src="https://www.alpha-sense.com/wp-content/uploads/2024/11/oddo-bhf-logo.png"/></div>
        <p className="testimonial-quote">“AlphaSense's Generative Search is the next big thing for us
           in how we use the platform. It saves us a lot of work and time in out research process, especially in the beginning stages of investigating a company.”</p>
        <div className="testimonial-author">
          <span className="testimonial-name">JONAS EISCH</span>
          <span className="testimonial-title">Portfolio Manager at ODDO BHF</span>
        </div>
      </div>
    </div>,
    <div className="testimonial-slide" key={1}>
      <div className="testimonial-img"><img src="https://www.alpha-sense.com/wp-content/uploads/2022/11/Salesforce-CaseStudy-250x250.jpg"></img></div>
      <div className="testimonial-info">
        <div className="testimonial-logo"><img src="https://www.alpha-sense.com/wp-content/uploads/2022/11/Salesforce-color.png"/></div>
        <p className="testimonial-quote">“I don't think we do our job as effectively as a competitive team if we didn't have AlphaSense
          . One of my favorite things that AlphaSense has done over the last couple years is introduce Expert Insights. Thr quality of the expert call interviews
          , the quantity of them, it's just absolutely incredible.”</p>
        <div className="testimonial-author">
          <span className="testimonial-name">DAN HAMILTON</span>
          <span className="testimonial-title">VP of Competitive Intelligene</span>
        </div>
      </div>
    </div>,
    <div className="testimonial-slide" key={2}>
      <div className="testimonial-img"><img src="https://www.alpha-sense.com/wp-content/uploads/2022/10/AS-Case-Study-papyruscapital-250x250.jpeg"></img> </div>
      <div className="testimonial-info">
        <div className="testimonial-logo"><img src="https://www.alpha-sense.com/wp-content/uploads/2022/10/papyruscapital-logo-bk.png"/></div>
        <p className="testimonial-quote">“[Expert Insights] helps us go mile-wide a lot faster, easier, and more flexibly-
          and then helps us figure out when to zero in.”</p>
        <div className="testimonial-author">
          <span className="testimonial-name">NITIN SACHETI</span>
          <span className="testimonial-title">Founder, Papyrus Capital GP LLC</span>
        </div>
      </div>
    </div>,
    <div className="testimonial-slide" key={3}>
      <div className="testimonial-img"><img src="https://www.alpha-sense.com/wp-content/uploads/2022/09/case-study-wendel-feature-250x250.jpg"/></div>
      <div className="testimonial-info">
        <div className="testimonial-logo"><img src="https://www.alpha-sense.com/wp-content/uploads/2022/09/wendel-logo-2.png"/></div>
        <p className="testimonial-quote">“AlphaSense is the kind of magic and a fantastic time-saver for any
          analyst or investor. The number of uses is almost unlimited. After you leverage AlphaSense
          , you'll never again use Google to find financial data. It's a real game-changer.”</p>
        <div className="testimonial-author">
          <span className="testimonial-name">OLIVER ALLOT</span>
          <span className="testimonial-title">Head of IR & Data Intelligence</span>
        </div>
      </div>
    </div>,
    <div className="testimonial-slide" key={4}>
      <div className="testimonial-img"><img src="https://www.alpha-sense.com/wp-content/uploads/2021/02/AS_Case_Study_RenMac-250x250.png"></img></div>
      <div className="testimonial-info">
        <div className="testimonial-logo"><img src="https://www.alpha-sense.com/wp-content/uploads/2021/03/renmac-logo-black.png"/></div>
        <p className="testimonial-quote">“This analyst likens the way AlphaSense automates his equity research process
          to how Google automated the process of going to the library”</p>
        <div className="testimonial-author">
          <span className="testimonial-name">MICHEAL OTTO</span>
          <span className="testimonial-title">Director of Investor Relations and Sustainability</span>
        </div>
      </div>
    </div>,
  ];

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((current + 1) % testimonials.length);

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-heading">
        Find out how real companies make real decisions with AlphaSense
      </h2>
      <div className="testimonial-carousel" style={{ position: 'relative', width: '800px', margin: '0 auto' }}>
        <button
          className="carousel-btn left"
          onClick={next}
          aria-label="Previous testimonial"
          style={{ display: current === testimonials.length - 1 ? 'none' : 'flex' }}
        >
          <span className="arrow-icon">&lt;</span>
        </button>
        <div className="testimonial-slider">
          {testimonials.map((slide, idx) => (
            <div
              key={idx}
              className={`testimonial-slide-wrapper${idx === current ? ' active' : ''}`}
              style={{
                transform: `translateX(${100 * (idx - current)}%)`,
                transition: 'transform 0.5s cubic-bezier(.77,0,.18,1)',
                position: idx === current ? 'relative' : 'absolute',
                width: '100%',
                top: 0,
                left: 0,
                opacity: idx === current ? 1 : 0,
                zIndex: idx === current ? 1 : 0,
              }}
            >
              {slide}
            </div>
          ))}
        </div>
        <button
          className="carousel-btn right"
          onClick={prev}
          aria-label="Next testimonial"
          style={{ display: current === 0 ? 'none' : 'flex' }}
        >
          <span className="arrow-icon">&gt;</span>
        </button>
      </div>
      <div className="carousel-dots">
        {testimonials.map((_, idx) => (
          <span
            key={idx}
            className={`dot${idx === current ? ' active' : ''}`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>
      <center><h2 className="customer-review-heading">What our customers are saying</h2></center>
      <div className="customer-review-flex">
        <div className="customer-image">
          <img src="https://www.alpha-sense.com/wp-content/uploads/2024/10/winter-2025-badges-1.png" alt="Badges" />
        </div>
        <div className="customer-right-side">
          <div className="customer-featured-review">
            <div className="customer-stars">★★★★★</div>
            <div className="customer-review-title">AlphaSense: Transforming Market Insights</div>
            <div className="customer-review-text">
              AlphaSense helps me to efficiently search for information on companies and their products for my strategy consulting business. I was looking for a reliable revenue estimate of a private company so I could make a punchy company profile slide for my client. Upon, searching AlphaSense, I not only got crunchbase/owler estimates, I was able to find Moddy's investor rating on the company's outlook....
              <a href="https://www.trustradius.com/reviews/alphasense-2024-05-01-09-00-00" target="_blank" rel="noopener noreferrer" className="customer-review-link">
                Read the full review on TrustRadius
              </a>
            </div>
            <div className="customer-review-author">
              -Aruna Rajan, Founder and CEO
            </div>
            <div className="customer-review-links">
              <a href="https://www.trustradius.com/products/alphasense/reviews" target="_blank" rel="noopener noreferrer">
                See all TrustRadius reviews &rarr;
              </a>
              <a href="https://www.g2.com/products/alphasense/reviews" target="_blank" rel="noopener noreferrer">
                See all G2 reviews &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 