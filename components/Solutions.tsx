import React from 'react';

export function Solutions() {
  return (
    <section className="solutions-section">
      <div className="solutions-container">
        <h2 className="solutions-title">Trusted by thousands of the world's top financial institutions and corporations</h2>
        <div className="solutions-content">
          <div className="solution-item">
            <h3 className="solution-item-title">Financial Services</h3>
            <p className="solution-item-desc">
              There's a reason we're rated <a>#1 in Financial Research</a>. 
              In an increasingly uncertain market, the last thing you need is FOMO. 
              Be the first to strike on critical changes or market-impacting trends 
              affecting private and public companies.
            </p>
            <a href="#" className="solution-explore-link">Explore our financial services solutions</a>
            <div className="solution-categories">
              <div className="solution-category">Asset Management<div className="arrow">→</div></div>
              <div className="solution-category">Hedge Funds<div className="arrow">→</div></div>
              <div className="solution-category">Private Markets<div className="arrow">→</div></div>
              <div className="solution-category">Investment & Corporate Banking<div className="arrow">→</div></div>
              <div className="solution-category">Sell-Side Research<div className="arrow">→</div></div>
            </div>
          </div>
          <div className="solution-item">
            <h3 className="solution-item-title">Corporate</h3>
            <p className="solution-item-desc">
              Legacy research tools are littered with blind spots. Whether you're 
              launching a new product, providing intel to key executives, or making 
              pipeline decisions, our proprietary AI technology ensures you make 
              moves with confidence and ease.
            </p>
            <a href="#" className="solution-explore-link">Explore our corporate solutions</a>
            <div className="solution-categories">
              <div className="solution-category">Competitive Intelligence <div className="arrow">→</div></div>
              <div className="solution-category">Corporate Strategy <div className="arrow">→</div></div>
              <div className="solution-category">Investor Relations <div className="arrow">→</div></div>
              <div className="solution-category">Corporate Development <div className="arrow">→</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 