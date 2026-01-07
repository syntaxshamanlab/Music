import React, { useEffect, useState } from "react";
import axios from "axios";
import Charts from "./components/Charts";

export default function App() {
  const [index, setIndex] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/index")
      .then(res => setIndex(res.data))
      .catch(err => console.error("API error", err));
  }, []);

  if (!index) return <div style={{padding:20}}>Loading index...</div>;

  return (
    <div style={{padding:20}}>
      <h1>Music Indexer</h1>
      <p>Items indexed: <strong>{index.items.length}</strong></p>
      <Charts items={index.items} />
    </div>
  );
}