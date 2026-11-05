import React from 'react';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import ReactDOM from 'react-dom/client';
import App from './AuthApp';
import { QuestionBankProvider } from './lib/question-bank';
import './profile.css';
import './index.css';
import './dashboard.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary><QuestionBankProvider><App /></QuestionBankProvider></AppErrorBoundary>
  </React.StrictMode>
);
