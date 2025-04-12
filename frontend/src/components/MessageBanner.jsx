import React from 'react';
import PropTypes from 'prop-types';


const MessageBanner = ({ message, type = 'info' }) => {
    if (!message) return null;

    const baseColors = {
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
    };

    const backgroundColor = baseColors[type] || baseColors.info;

    return (
        <div style={{ ...styles.container, backgroundColor }}>
            <p style={styles.text}>{message}</p>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#1890ff',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '13px',
        fontWeight: 'bold',
        fontFamily: 'var(--font-family-base)',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        display: 'inline-block',
        alignSelf: 'center',
        marginBottom: '10px',
    },
    text: {
        margin: 0,
        fontSize: '15px',
    },
};

MessageBanner.propTypes = {
    message: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
};


export default MessageBanner;
