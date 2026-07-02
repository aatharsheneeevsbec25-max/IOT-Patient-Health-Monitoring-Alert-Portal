/**
 * Vercel Speed Insights Initialization
 * This script initializes Vercel Speed Insights for the IoT Patient Health Monitoring Portal
 * 
 * For vanilla HTML/JavaScript projects, this uses the browser-compatible initialization approach
 */

(function() {
  'use strict';
  
  // Speed Insights queue initialization
  window.si = window.si || function() {
    (window.siq = window.siq || []).push(arguments);
  };

  // Detect if we're in development mode
  var isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';

  // Load the Speed Insights script
  var script = document.createElement('script');
  script.defer = true;
  
  // Use the debug script in development, production script otherwise
  if (isDevelopment) {
    script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.debug.js';
  } else {
    script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.js';
  }
  
  script.onerror = function() {
    console.warn('Vercel Speed Insights: Failed to load tracking script');
  };
  
  // Append to document head
  if (document.head) {
    document.head.appendChild(script);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.head.appendChild(script);
    });
  }
  
  if (isDevelopment) {
    console.log('Vercel Speed Insights: Initialized in debug mode');
  }
})();
