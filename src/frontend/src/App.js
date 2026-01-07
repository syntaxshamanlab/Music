import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/index')  // Assuming backend runs on 8000
      .then(res => res.json())
      .then(data => setItems(data.data));
  }, []);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Music Indexing Webapp</h1>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search titles or content..."
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      {filteredItems.map(item => (
        <div key={item.filename} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>{item.title}</h3>
          <p>{item.content.substring(0, 300)}...</p>
          <small>Category: {item.category}</small>
        </div>
      ))}
    </div>
  );
}

export default App;