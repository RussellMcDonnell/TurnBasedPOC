import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Team from './Team';
import TeamEditor from './TeamEditor';
import Store from './Store';
import { TeamProvider } from './TeamContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TeamProvider>
      <Router>
        <Routes>
          <Route path="/team" element={<Team />} />
          <Route path="/team-editor/:teamId" element={<TeamEditor />} />
          <Route path="/store" element={<Store />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </TeamProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
