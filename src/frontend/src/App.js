import React, { useState, useEffect, useMemo } from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, documents: 0, lyrics: 0 });
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    loadIndex();
  }, []);

  const loadIndex = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/index');
      if (!response.ok) throw new Error('Failed to load index');
      const data = await response.json();
      setItems(data.data);

      // Calculate stats
      const total = data.data.length;
      const documents = data.data.filter(item => item.source === 'document').length;
      const lyrics = data.data.filter(item => item.source === 'lyrics').length;
      setStats({ total, documents, lyrics });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter === 'all' ||
        (categoryFilter === 'documents' && item.source === 'document') ||
        (categoryFilter === 'lyrics' && item.source === 'lyrics');

      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  const exportData = () => {
    const dataStr = JSON.stringify(filteredItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `music-index-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) return <div className="loading">Loading Music Index...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content View
        </button>
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
      </div>

      <header className="header">
        <h1>Music Index Command Center</h1>
        <div className="stats">
          <span>Total: {stats.total}</span>
          <span>Documents: {stats.documents}</span>
          <span>Lyrics: {stats.lyrics}</span>
        </div>
      </header>

      {activeTab === 'content' ? (
        <>
          <div className="controls">
            <div className="search-section">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search titles, content, collaborators..."
                className="search-input"
              />
            </div>

            <div className="filter-section">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="documents">Documents</option>
                <option value="lyrics">Lyrics</option>
              </select>

              <button onClick={exportData} className="export-btn">
                Export Results
              </button>
            </div>
          </div>

          <div className="results-info">
            Showing {filteredItems.length} of {items.length} items
          </div>

          <div className="results-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <h3 className="item-title">{item.title}</h3>
                  <span className={`item-badge ${item.source}`}>
                    {item.source}
                  </span>
                </div>

                <div className="item-meta">
                  {item.collaborators && item.collaborators.length > 0 && (
                    <div className="collaborators">
                      {item.collaborators.join(', ')}
                    </div>
                  )}
                  <div className="created-date">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="item-content">
                  {item.content.substring(0, 200)}...
                </div>

                {item.sections && Object.keys(item.sections).length > 0 && (
                  <div className="item-sections">
                    <details>
                      <summary>Sections ({Object.keys(item.sections).length})</summary>
                      <div className="sections-list">
                        {Object.entries(item.sections).map(([key, value]) => (
                          <div key={key} className="section">
                            <strong>{key.replace(/_/g, ' ')}:</strong>
                            <p>{value.substring(0, 100)}...</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <Dashboard items={items} onCategoryFilter={setCategoryFilter} />
      )}
    </div>
  );
}

export default App;