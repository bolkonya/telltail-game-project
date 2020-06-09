import React, {Component, Fragment} from 'react';

import Adventure from '../components/adventure';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loading-animation';
import ErrorLabel from '../components/error-label';

import {ITagPageState} from '../common/types';

import './tag.css';

interface ITagPageProps {
     tagName: string;
}

class TagPage extends Component<ITagPageProps> {
    static getInitialProps({req}: any) {
        const tagName = req.params.tagname;
        return {tagName};
    }

    state: ITagPageState = {
        hasError: false,
        errorMessage: '',
        adventures: [],
        tagSlug: '',
        loadingAdventures: true
    };

    loadAdventuresByTag() {
        this.setState({loadingAdventures: true});
        fetch(`/api/tag/${this.props.tagName}/adventures`)
            .then(
                (response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Ошибка ${response.status}`);
                    }
                },
                (error) => console.error('An error occurred.', error)
            )
            .then(({slug, adventures}) =>
                this.setState({
                    adventures,
                    tagSlug: slug,
                    loadingAdventures: false
                }),
                (error) => this.setState({ hasError: true, errorMessage: error.message })
            );
    }

    componentDidMount() {
        this.loadAdventuresByTag();
    }

    tryToShowLoadingAnimation() {
        if (this.state.loadingAdventures) {
            return (<LoadingAnimation/>);
        }
    }

    formContent() {
        return this.state.hasError ? <ErrorLabel errorMessage={this.state.errorMessage} /> :
            this.state.loadingAdventures ? (<LoadingAnimation />) : (
                <Fragment>
                    <div className="filter-tag-name">
                        {`#${this.state.tagSlug}`}
                    </div>
                    <article className="adventures-list" id="adventures-list">
                        {this.state.adventures.map((adventure) => (<Adventure key={adventure.id} data={adventure} />))}
                    </article>
                </Fragment>
            )
    }

    render() {
        return (
            <Layout>
                {this.formContent()}
            </Layout>
        );
    }
}

export default TagPage;
