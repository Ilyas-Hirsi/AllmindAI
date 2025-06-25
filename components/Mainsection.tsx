import React from 'react';

export function Mainsection() {
  return (
    <section className="Mainsection">
      <video autoPlay loop muted playsInline src="https://www.alpha-sense.com/wp-content/uploads/2025/06/AlphaSense_DeepResearch.mp4"></video>
      <div className="Main-container">
        <h2 className="mainh2">Market Intelligence and Research Platform</h2>
        <h1 className="mainh1">
          AI insights that drive <span className="mainh1-break">business forward</span>
        </h1>
        <p className="mainp1"> Unlock critical insights on companies, topics, 
          and industries across an extensive universe of 
          content—including your own.</p>
        <p className="mainp2"> • No credit card required    • Access to premium content</p>
        <button className="trialbutton">Start my free trial</button>
        <a className="interactive-link"> Interactive tour →</a>
      </div>
    </section>
  );
} 