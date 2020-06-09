import React, { Component, Fragment } from 'react';

import './index.css';

interface IErrorLabelProps {
    errorMessage: string;
}

class ErrorLabel extends Component<IErrorLabelProps> {
    render() {
        return (
            <div className='error-label'>{this.props.errorMessage}</div>
        )
    }
}

export default ErrorLabel;