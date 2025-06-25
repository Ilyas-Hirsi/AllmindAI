import React, { useState } from 'react';

export function Platform() {
  const tabData = [
    {
      name: 'MARKET INTELLIGENCE',
      image: 'https://www.alpha-sense.com/wp-content/uploads/2024/02/dashboard-2024.png',
      description: 'Search any company, industry, trend, or topic across company filings, broker research, expert calls, regulatory docs, press, and more to get all the market perspectives you need.'
    },
    {
      name: 'ENTERPRISE INTELLIGENCE',
      image: 'https://www.alpha-sense.com/wp-content/uploads/2023/10/Hero-Enterprise-with-Internal-doc-3.png',
      description: 'Our secure, end-to-end platform powered by generative AI allows you to centralize your market intelligence by integrating proprietary internal content alongside our premium external content.'
    },
    {
      name: 'WALL STREET INSIGHTS®',
      image: 'https://www.alpha-sense.com/wp-content/uploads/2022/11/wall-street-insight-C.png',
      description: "Our Wall Street Insights® offering provides the world's leading equity research from all of Wall Street's leading firms, including Goldman Sachs, Bank of America, J.P Morgan, Morgan Stanley, Citi, and more."
    },
    {
      name: 'EXPERT INSIGHTS',
      image: 'https://www.alpha-sense.com/wp-content/uploads/2022/11/Expert-Calls-A.png',
      description: "Get a firsthand look at what's going on behind the scenes of a company or market with access to tens of thousands of expert call transcripts or conduct your own expert calls for less."
    }
  ];

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  
  return (
    <section className="platform-section">
      <div className="platform-why">
        <div className="platform-why-left">
          <h4 className="platform-why-label">WHY ALPHASENSE?</h4>
          <h2 className="platform-why-title">A powerful platform that works for you</h2>
          <p className="platform-why-desc">
            Information is overwhelming—but it doesn't have to be. We've spent over a decade refining our proprietary AI and NLP technology, so you can easily surface and track insights from millions of documents across earnings, broker research, expert calls, company documents, and even your own proprietary internal content——all in one place.
          </p>
        </div>
        <div className="platform-why-right">
          <div className="platform-feature">
            <div className="platform-feature-icon">
              <img className="PlatformImage" src="https://www.alpha-sense.com/wp-content/uploads/2022/12/Company-doc-new.png"></img>
            </div>
            <div>
              <h3 className="platform-feature-title">EXTENSIVE CONTENT LIBRARY</h3>
              <p className="platform-feature-desc">Search any company, industry, trend, or topic across 500M+ premium external documents or your firms proprietary internal content.</p>
            </div>
          </div>
          <div className="platform-feature">
            <div className="platform-feature-icon">
              <img className="PlatformImage" src="https://www.alpha-sense.com/wp-content/uploads/2022/12/Time-savings-1.png"></img>
            </div>
            <div>
              <h3 className="platform-feature-title">TIME SAVINGS</h3>
              <p className="platform-feature-desc">Let our AI technology do the work for you. Spend less time on time-consuming, manual tasks and more time on analysis.</p>
            </div>
          </div>
          <div className="platform-feature">
            <div className="platform-feature-icon">
                <img className="PlatformImage" src="https://www.alpha-sense.com/wp-content/uploads/2022/12/Avoid-blind-sports.png"></img>
            </div>
            <div>
              <h3 className="platform-feature-title">AVOID BLIND SPOTS</h3>
              <p className="platform-feature-desc">Easily monitor and surface critical insights on everything you're tracking in real time.</p>
            </div>
          </div>
          <div className="platform-feature">
            <div className="platform-feature-icon">
                <img src="https://www.alpha-sense.com/wp-content/uploads/2020/12/global-security-16c15712.svg"></img>
            </div>
            <div>
              <h3 className="platform-feature-title">ENTERPRISE-GRADE SECURITY</h3>
              <p className="platform-feature-desc">Protect your company's data with the highest industry standards—including zero trust security model, modern authentication practices, and secure data encryptions.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="platform-perspectives">
        <h3 className="platform-perspectives-surtitle"> Platform</h3>
        <h2 className="platform-perspectives-title">All the perspectives you need in one place</h2>
        <div className="platform-tabs">
          {tabData.map((tab, index) => (
            <a 
              key={index}
              className={`platform-tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}
              style={{ cursor: 'pointer' }}
            >
              {tab.name}
            </a>
          ))}
        </div>
        <div className="platform-perspectives-content">
          <div className="platform-perspectives-left">
            <h3 className="platform-perspectives-subtitle">{tabData[activeTab].name}</h3>
            <p className="platform-perspectives-desc">{tabData[activeTab].description}</p>
            <a className="platform-learn-more" href="">Learn more →</a>
          </div>
          <div className="platform-perspectives-right">
            <div className="platform-perspectives-image">
              <div className="platform-dashboard-placeholder">
                <img src={tabData[activeTab].image} alt={tabData[activeTab].name}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="get-started">
        <h3>Get started today</h3>
        <p>The world's leading corporations and financial institutions—including
           <b> a majority of the S&P 500, over 85% of the S&P 100, and 80% of the top asset management
            firms</b>—trust AlphaSense for smarter, faster decisions.</p>
        <button className="trialbutton">Start my free trial</button>
      </div>
    </section>
  );
} 