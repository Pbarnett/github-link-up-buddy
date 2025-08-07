import React from 'react';
import { createRoot } from 'react-dom/client';
import FlightBookingApp from './App.simple.tsx';
import './index.css';

// Simple production-ready entry point
console.log('🚀 Parker Flight - Starting Flight Booking Application');

// Render the simple app
createRoot(document.getElementById('root')!).render(<FlightBookingApp />);
