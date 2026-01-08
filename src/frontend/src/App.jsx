import React, { useEffect, useState } from "react";
import axios from "axios";
import Charts from "./components/Charts";
import Dashboard from "./components/Dashboard";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

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
        // Send to backend for logging
        try {
          await axios.post("http://localhost:8000/api/errors", errorData);
          console.log("Errors sent to backend");
        } catch (err) {
          console.error("Failed to send errors to backend:", err);
        }
      }
    })();
  }, []);

  if (!index) return <div style={{padding:20}}>Loading index...</div>;

  return (
    <ErrorBoundary>
      <div style={{padding:20}}>
        <h1>Music Indexer</h1>
        <p>Items indexed: <strong>{index.items ? index.items.length : 0}</strong></p>
        <ErrorBoundary>
          <Charts items={index.items || []} />
        </ErrorBoundary>
        <ErrorBoundary>
          <Dashboard items={index.items || []} />
        </ErrorBoundary>
        <button onClick={() => { throw new Error("Test error for monitoring"); }}>
          Trigger Test Error
        </button>
      </div>
    </ErrorBoundary>
  );
}