import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FeedbackForm from './components/FeedbackForm';
import AdminView from './components/AdminView';
import './App.css';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  return (
    <div className={`app ${theme}`}>
      <div className="container py-4">
        <header className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="text-center">Feedback Collector</h1>
            <div>
              {!showAdmin && (
                <button 
                  className="btn btn-outline-primary me-2 mb-2" 
                  onClick={() => setShowAdmin(true)}
                >
                  View Submitted Feedback
                
                </button>
              )}
              <button 
                className={`btn ${theme === 'light' ? 'btn-dark' : 'btn-light'} d-flex align-items-center gap-2`} 
                onClick={toggleTheme}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  fill="currentColor" 
                  viewBox="0 0 16 16"
                  className={theme === 'light' ? 'd-none' : 'd-block'}
                >
                  <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                </svg>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  fill="currentColor" 
                  viewBox="0 0 16 16"
                  className={theme === 'light' ? 'd-block' : 'd-none'}
                >
                  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
                </svg>
                <span className="d-none d-sm-inline">
                  {theme === 'light' ? 'Dark' : 'Light'} Mode
                </span>
              </button>
            </div>
          </div>
          <hr />
        </header>

        <main>
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {showAdmin ? (
                <AdminView onSwitchView={() => setShowAdmin(false)} />
              ) : (
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">Submit Your Feedback</h5>
                  </div>
                  <div className="card-body">
                    <FeedbackForm 
                      onFeedbackSubmitted={() => setShowAdmin(true)} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="mt-5 text-center text-muted">
          <p>Feedback Collector © 2025 - Created by Shivam Gupta - Candidate Submission</p>
        </footer>
      </div>
    </div>
  );
}

export default App;