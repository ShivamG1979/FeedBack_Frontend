// src/components/AdminView.jsx
import { useState, useEffect } from 'react';
import FeedbackList from './FeedbackList';

function AdminView({ onSwitchView }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null); 
    
    try {
      const response = await fetch('https://feedback-backeng.onrender.com/api/feedbacks');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch feedbacks: ${response.status}`);
      }
      
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedback data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="admin-view">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button 
          className="btn btn-primary" 
          onClick={onSwitchView}
        >
          Back to Submission Form
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchFeedbacks}
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="card-title mb-0">Feedback Submissions</h5>
        </div>
        <div className="card-body">
          <FeedbackList 
            feedbacks={feedbacks} 
            loading={loading} 
            onFeedbackUpdated={fetchFeedbacks}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminView;