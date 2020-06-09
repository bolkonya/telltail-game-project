import React, {Component} from 'react';

import Header from '../header';

interface ILayoutProps {
    children: any;
}

export default class Layout extends Component<ILayoutProps> {
    render() {
        return (
            <div className="container">
                <Header/>
                {this.props.children}
            </div>
        );
    }
}
