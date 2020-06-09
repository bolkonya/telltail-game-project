import React, {Component, Fragment} from 'react';

import Layout from '../components/layout';
import LoadingAnimation from '../components/loading-animation';
import ErrorLabel from '../components/error-label';

import {staticContext} from '../common/static-context';

import {IScenePageState} from '../common/types';

import './scene.css';

interface IScenePageProps {
    adventureId: number;
    sceneId: number;
}

class ScenePage extends Component<IScenePageProps> {
    static getInitialProps({req}: any) {
        const {adventureid: adventureId, sceneid: sceneId} = req.params;
        return {adventureId, sceneId};
    }

    state: IScenePageState = {
        loadingData: true,
        hasError: false,
        errorMessage: '',
        description: '',
        image: '',
        position: '',
        actions: [],
        achievements: [],
        adventureId: -1,
        firstSceneId: -1
    };

    componentDidMount() {
        this.setState({loadingData: true});
        fetch(`/api/adventures/${this.props.adventureId}/scenes/${this.props.sceneId}`)
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
            .then(({description, image, position, actions, achievements, adventureId, adventure: {firstSceneId}}) =>
                this.setState({
                    description,
                    image,
                    position,
                    actions,
                    achievements,
                    adventureId,
                    loadingData: false,
                    firstSceneId
                }),
                (error) => this.setState({hasError: true, errorMessage: error.message})
            );
    }

    getDescription() {
        if (this.state.image) {
            const backroundStyle = {
                backgroundImage: `url(${this.context.staticPath}${this.state.image})`
            };
            return (
                <section
                    className={`scene__description scene__description_text-position_${this.state.position}`}
                    style={backroundStyle}
                >
                    <div className="description__text">
                        {this.state.description}
                    </div>
                </section>
            );
        }

        const blackTextColor = {
            color: '#000'
        };
        return (
            <section
                className="scene__description scene__description_text-position_left-up"
            >
                <div className="description__text" style={blackTextColor}>
                    {this.state.description}
                </div>
            </section>
        );
    }

    getAchievements() {
        if (this.state.achievements.length) {
            return (
                <section className="scene__achievements">
                    {this.state.achievements.map(({id, name, image}) => (
                        <div key={id} className="achievement">
                            <img className="achievement_image" src={`${this.context.staticPath}${image}`}/>
                            <div className="achievement__info">
                                <div className="achievement__label">Достижение получено</div>
                                <div className="achievement__name">{name}</div>
                            </div>
                        </div>
                    ))}
                </section>
            );
        }
    }

    getActions() {
        return this.state.actions.length ? (
            <section className="scene__actions">
                {this.state.actions.map(({id, name, targetSceneId}) => (
                    <a
                        key={id}
                        href={`/adventures/${this.state.adventureId}/scenes/${targetSceneId}`}
                        className="scene__action-button"
                    >
                        {name}
                    </a>
                ))}
            </section>
        ) : (
            <section className="scene__actions">
                <a
                    href={`/adventures/${this.state.adventureId}/scenes/${this.state.firstSceneId}`}
                    className="scene__action-button"
                >
                    Начать заново
                </a>
            </section>
        );
    }

    formContent() {
        return this.state.hasError ? <ErrorLabel errorMessage={this.state.errorMessage} /> :
            this.state.loadingData ? (<LoadingAnimation/>) : (
            <article className="scene">
                {this.getDescription()}
                {this.getAchievements()}
                {this.getActions()}
            </article>
        );
    }

    render() {
        return (
            <Layout>
                {this.formContent()}
            </Layout>
        );
    }
}

ScenePage.contextType = staticContext;

export default ScenePage;
