import React from 'react';
import PropTypes from 'prop-types';
import './styles/FeatureCard.css';


const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="feature">
            <div className="feature-icon">
                <img src={icon} alt={title} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

FeatureCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};


export default FeatureCard;
