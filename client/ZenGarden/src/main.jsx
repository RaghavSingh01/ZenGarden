// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Router from './routes/Router.jsx';
// import './styles/index.css';
import './theme/global.css';
import './theme/variables.css';
import App from './App.jsx';

// function AppRoot() {
//   return <Router />;
// }

const root = createRoot(document.getElementById('root'));
root.render(<App />);