import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AuthApp';
import { QuestionBankProvider } from './lib/question-bank';
import './profile.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QuestionBankProvider><App /></QuestionBankProvider>
  </React.StrictMode>
);
