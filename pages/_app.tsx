import App, {Container, NextAppContext} from 'next/app';
import Head from 'next/head';
import React from 'react';
import {Provider} from 'react-redux';

import store from '../store';
import {staticContext as StaticContext, staticSettings} from '../common/static-context';

import './app.css';

export default class MyApp extends App {
    static async getInitialProps({Component, ctx}: NextAppContext) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return {pageProps};
    }

    render() {
        const {Component, pageProps} = this.props;

        return (
            <Provider store={store}>
                <StaticContext.Provider value={staticSettings}>
                    <Container>
                        <Head>
                            <title>Awesome adventures</title>
                            <meta name="description" content="Awesome adventures"/>
                            <link
                                rel="shortcut icon"
                                href="//bolkonyashka-task-2018.surge.sh/favicon.png"
                                type="image/png"
                            />
                            <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"/>
                            <link href="https://fonts.googleapis.com/css?family=Gabriela" rel="stylesheet"/>
                        </Head>
                        <Component {...pageProps}/>
                    </Container>
                </StaticContext.Provider>
            </Provider>
        );
    }
}
