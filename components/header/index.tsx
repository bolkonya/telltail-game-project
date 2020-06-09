import React, {Component} from 'react';

import './index.css';

export default class Header extends Component {
    render() {
        return (
            <header className="header">
                <div className="header__icon"/>
                <div className="header__label">
                    <a href="/"><span className="header__text header__text_bold-pink">Telltail</span>Games</a>
                </div>
            </header>
        );
    }
}
