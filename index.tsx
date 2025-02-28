import React from 'react';
import ReactDOM from 'react-dom/client';
import AuditRiskCalculator from './AuditRiskCalculator';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuditRiskCalculator />
  </React.StrictMode>
);
