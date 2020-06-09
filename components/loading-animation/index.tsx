import React, {Component} from 'react';

import {staticContext} from '../../common/static-context';

import './index.css';

class LoadingAnimation extends Component {
    render() {
        return (
            <img className="loading-animation" src={`${this.context.staticPath}${this.context.loadingGif}`}/>
        );
    }
}

LoadingAnimation.contextType = staticContext;

export default LoadingAnimation;
