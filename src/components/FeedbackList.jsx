// src/components/FeedbackList.jsx
import { useState } from 'react';
import EditFeedbackModal from './EditFeedbackModal;';

function FeedbackList({ feedbacks, loading, onFeedbackUpdated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [sortBy, setSortBy] = useState('timestamp'); // Default sort by timestamp
  const [sortOrder, setSortOrder] = useState('desc'); // Default newest first
  
  // Sort feedbacks
  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    const direction = sortOrder === 'asc' ? 1 : -1;
    
    if (sortBy === 'timestamp') {
      return direction * (new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sortBy === 'name') {
      return direction * a.name.localeCompare(b.name);
    } else if (sortBy === 'email') {
      return direction * a.email.localeCompare(b.email);
    }
    
    return 0;
  });
  
  // Filter feedbacks
  const filteredFeedbacks = sortedFeedbacks.filter(feedback => 
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleEditClick = (feedback) => {
    setCurrentFeedback(feedback);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      setDeleteLoading(id);
      try {
        const response = await fetch(`/api/feedbacks/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          onFeedbackUpdated();
        } else {
          alert('Failed to delete feedback');
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Error deleting feedback');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    
    return sortOrder === 'asc' 
      ? <i className="bi bi-arrow-up-short"></i> 
      : <i className="bi bi-arrow-down-short"></i>;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading feedbacks...</p>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No feedback submissions yet.
      </div>
    );
  }

  return (
    <div className="feedback-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-0">Total Feedback: {feedbacks.length}</h5>
        </div>
        <div className="d-flex align-items-center">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search feedbacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      
      {filteredFeedbacks.length === 0 ? (
        <div className="alert alert-info">
          No matching feedbacks found for "{searchTerm}".
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th 
                    className="cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name {renderSortIcon('name')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    Email {renderSortIcon('email')}
                  </th>
                  <th>Message</th>
                  <th 
                    className="cursor-pointer"
                    onClick={() => handleSort('timestamp')}
                  >
                    Date {renderSortIcon('timestamp')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((feedback) => (
                  <tr key={feedback._id}>
                    <td>{feedback.name}</td>
                    <td>{feedback.email}</td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '250px' }}>
                        {feedback.message}
                      </div>
                    </td>
                    <td>{formatDate(feedback.timestamp)}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditClick(feedback)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteClick(feedback._id)}
                          disabled={deleteLoading === feedback._id}
                        >
                          {deleteLoading === feedback._id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                              <span className="visually-hidden">Deleting...</span>
                            </>
                          ) : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="row mt-4">
            <div className="col-12">
              <h4>Feedback Cards</h4>
              <hr />
            </div>
            {filteredFeedbacks.map((feedback) => (
              <div className="col-md-6 col-lg-4 mb-4" key={`card-${feedback._id}`}>
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{feedback.name}</h5>
                    <div className="badge bg-primary">{new Date(feedback.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">{feedback.email}</h6>
                    <p className="card-text">{feedback.message}</p>
                  </div>
                  <div className="card-footer">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {formatDate(feedback.timestamp)}
                      </small>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={() => handleEditClick(feedback)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDeleteClick(feedback._id)}
                          disabled={deleteLoading === feedback._id}
                        >
                          {deleteLoading === feedback._id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                              Deleting...
                            </>
                          ) : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {showEditModal && currentFeedback && (
        <EditFeedbackModal 
          feedback={currentFeedback}
          onClose={() => {
            setShowEditModal(false);
            setCurrentFeedback(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setCurrentFeedback(null);
            onFeedbackUpdated();
          }}
        />
      )}
    </div>
  );
}

export default FeedbackList;