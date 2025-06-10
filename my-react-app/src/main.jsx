import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import App2 from './App2.jsx';
import LandingPage from './LandingPage.jsx';

// Create a wrapper component to manage which app to show
function RootComponent() {
  const [selectedApp, setSelectedApp] = useState(null);

  if (selectedApp === 'app1') {
    return <App />;
  } else if (selectedApp === 'app2') {
    return <App2 />;
  } else {
    return <LandingPage onSelectApp={setSelectedApp} />;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
);
