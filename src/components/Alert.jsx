import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

// Base Alert class component
class Alert extends Component {
    constructor(props) {
        super(props);
        this.color = null;
        this.bgColor = null;
    }

    getStyle = () => {
        return {
            color: this.color,
            backgroundColor: this.bgColor,
            border: `2px solid ${this.color}`,
            fontSize: '12px',
            margin: '10px 0',
            padding: '10px',
            borderRadius: '7px',
            textAlign: 'center'
        };
    };

    getInlineStyle = () => {
        return {
            color: this.color,
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '14px',
            margin: '0',
            padding: '0',
            borderRadius: '0',
            textAlign: 'left',
            display: 'block',
            width: '100%',
            boxSizing: 'border-box'
        };
    };

    render() {
        const style = this.props.inline ? this.getInlineStyle() : this.getStyle();
        return (
            <div className={`Alert ${this.props.inline ? 'inline-alert' : ''}`}>
                <p style={style}>{this.props.text}</p>
            </div>
        );
    }
}

Alert.propTypes = {
    text: PropTypes.string,
    inline: PropTypes.bool
};

// InfoAlert subclass
class InfoAlert extends Alert {
    constructor(props) {
        super(props);
        this.color = 'rgb(0, 0, 255)'; // blue
        this.bgColor = 'rgb(220, 220, 255)'; // light blue
    }
}

// ErrorAlert subclass
class ErrorAlert extends Alert {
    constructor(props) {
        super(props);
        this.color = '#d32f2f'; // darker red
        this.bgColor = '#ffebee'; // very light red
    }
}

// WarningAlert subclass
class WarningAlert extends Alert {
    constructor(props) {
        super(props);
        this.color = 'rgb(255, 165, 0)'; // orange
        this.bgColor = 'rgb(255, 248, 220)'; // light orange
    }
}

export { InfoAlert, ErrorAlert, WarningAlert };