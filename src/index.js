import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Team from './features/teams/Team';
import TeamEditor from './features/teams/TeamEditor';
import Store from './features/store/Store';
import { TeamProvider } from './features/teams/TeamContext';
import BattlefieldCombat from './features/battlefield/BattlefieldCombat';
import SelectPlay from './features/select-play/SelectPlay';
import CampaignMenu from './features/campaign/CampaignMenu';
import AdventureShop from './features/adventure-shop/adventure-shop';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <TeamProvider>
      <Router>
        <Routes>
          <Route path="/team" element={<Team />} />
          <Route path="/team-editor/:teamId" element={<TeamEditor />} />
          <Route path="/store" element={<Store />} />
          <Route path="/select-play" element={<SelectPlay />} />
          <Route path="/battlefield" element={<BattlefieldCombat />} />
          <Route path="/campaign" element={<CampaignMenu />} />
          <Route path="/shop" element={<AdventureShop />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </TeamProvider>
);

reportWebVitals();
