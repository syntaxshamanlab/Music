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

  useEffect(() => {
    (async () => {
      const errorData = await window.checkJSErrors();
      if (errorData && errorData.jsErrors.length > 0) {
        console.error("JavaScript errors detected:", errorData.jsErrors);
        // Optionally send to backend for logging
        // axios.post("http://localhost:8000/api/errors", errorData);
      }
    })();
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