// src/App.jsx
// Optional wrapper if a top-level context/provider is needed across all routes.
// If not using global UI providers here, Router.jsx can be the single entry.

import React from 'react';
import Router from './routes/Router.jsx';
import ToastProvider from './components/UI/ToastProvider.jsx';
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function App() {
  return(
    <ToastProvider>
      <SpeedInsights/>
    <Router />
    </ToastProvider>

  );
 }