import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '../teams/TeamContext';
import './adventure-shop.css';

const AdventureShop = () => {
    const navigate = useNavigate();
    const { getActiveCampaignTeam, updateCampaignTeamStats } = useTeams();

    const handleBuffSelection = (buffType) => {
        const campaignTeam = getActiveCampaignTeam();
        if (!campaignTeam) {
            alert("No active team found!");
            return;
        }

        const currentStats = campaignTeam.campaignStats.unitHealthStatus;
        const updatedStats = { ...currentStats };

        // Apply the selected buff to all units
        Object.keys(updatedStats).forEach(unitId => {
            if (buffType === 'attack') {
                updatedStats[unitId] = {
                    ...updatedStats[unitId],
                    damage: updatedStats[unitId].damage + 1
                };
            } else if (buffType === 'health') {
                const newMaxHP = updatedStats[unitId].maxHP + 1;
                updatedStats[unitId] = {
                    ...updatedStats[unitId],
                    maxHP: newMaxHP,
                    currentHP: Math.min(updatedStats[unitId].currentHP + 1, newMaxHP)
                };
            }
        });

        // Update the team stats with the new buffs
        updateCampaignTeamStats({
            unitHealthStatus: updatedStats
        });

        // Show success message and return to campaign
        alert(`All units have received +1 ${buffType === 'attack' ? 'Attack' : 'HP'}!`);
        navigate('/campaign');
    };

    const handleBackClick = () => {
        navigate('/campaign');
    };

    return (
        <div className="adventure-shop">
            <button className="back-button" onClick={handleBackClick}>
                Back to Campaign
            </button>
            
            <div className="shop-content">
                <h1>Mysterious Merchant</h1>
                <p>Choose one blessing for your team:</p>
                
                <div className="buff-options">
                    <div className="buff-card" onClick={() => handleBuffSelection('attack')}>
                        <h2>Blessing of Strength</h2>
                        <p>Grant all your units +1 Attack</p>
                    </div>
                    
                    <div className="buff-card" onClick={() => handleBuffSelection('health')}>
                        <h2>Blessing of Vitality</h2>
                        <p>Grant all your units +1 HP</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdventureShop;