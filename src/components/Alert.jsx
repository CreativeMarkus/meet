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

    render() {
        return (
            <div className="Alert">
                <p style={this.getStyle()}>{this.props.text}</p>
            </div>
        );
    }
}

Alert.propTypes = {
    text: PropTypes.string
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
        this.color = 'red';
        this.bgColor = 'rgb(255, 220, 220)'; // light red
    }
}

export { InfoAlert, ErrorAlert };