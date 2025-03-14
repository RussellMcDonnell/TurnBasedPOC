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
import BattlefieldCombat from './features/BattlefieldCombat';
import SelectPlay from './features/SelectPlay';
import CampaignMenu from './features/CampaignMenu';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TeamProvider>
      <Router>
        <Routes>
          <Route path="/team" element={<Team />} />
          <Route path="/team-editor/:teamId" element={<TeamEditor />} />
          <Route path="/store" element={<Store />} />
          <Route path="/select-play" element={<SelectPlay />} />
          <Route path="/battlefield" element={<BattlefieldCombat />} />
          <Route path="/campaign" element={<CampaignMenu />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </TeamProvider>
  </React.StrictMode>
);

reportWebVitals();
