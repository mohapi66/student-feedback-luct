import React, { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('form');
  const [refreshKey, setRefreshKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFeedbackSubmitted = () => {
    setRefreshKey(prev => prev + 1);
    setCurrentView('list');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderView = () => {
    switch (currentView) {
      case 'form':
        return <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />;
      case 'list':
        return <FeedbackList refresh={refreshKey} />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Student Feedback App</h1>
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={`nav-menu ${mobileMenuOpen ? 'nav-menu-open' : ''}`}>
            <button 
              onClick={() => handleNavClick('form')}
              className={currentView === 'form' ? 'active' : ''}
            >
              Submit Feedback
            </button>
            <button 
              onClick={() => handleNavClick('list')}
              className={currentView === 'list' ? 'active' : ''}
            >
              View Feedback
            </button>
            <button 
              onClick={() => handleNavClick('dashboard')}
              className={currentView === 'dashboard' ? 'active' : ''}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>
      
      <main className="App-main">
        {renderView()}
      </main>
    </div>
  );
}

export default App;