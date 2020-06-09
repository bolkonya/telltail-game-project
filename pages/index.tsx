import React, {Component, Fragment} from 'react';

import Adventure from '../components/adventure';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loading-animation';

import checkVisibility from '../common/visibility-checker';
import separateTextbyFirstMatch from '../common/by-match-separator';
import {KEY_CODES, IIndexPageState} from '../common/types';

import './index.css';

class IndexPage extends Component {
    state: IIndexPageState = {
        adventures: [],
        loadingAdventures: true,
        offset: 0,
        count: 5,
        keyword: '',
        tagInputValue: '',
        focusedTagTipNum: 0,
        selectedTags: [],
        tags: [],
        noMoreData: false,
        showTips: false,
        tagsForTips: [],
        tagsForFiltering: [],
        keyworfForFiltering: ''
    };

    loadAdventures() {
        const {count, offset, keyworfForFiltering: keyword, tagsForFiltering: tags} = this.state;
        this.setState({loadingAdventures: true});

        fetch(`/api/adventures?count=${count}&offset=${offset}&keyword=${keyword}&tags=${tags.join(',')}`)
            .then(
                (response) => response.json(),
                (error) => console.error('An error occurred.', error)
            )
            .then((adventures) =>
                this.setState((prevState) => {
                    const typedPrevState = prevState as IIndexPageState;
                    return {
                        adventures: typedPrevState.adventures.concat(adventures),
                        loadingAdventures: false,
                        offset: typedPrevState.offset + adventures.length,
                        noMoreData: adventures.length < typedPrevState.count
                    };
                })
            )
            .then(() => this.tryToLoadMoreAdventures());
    }

    tryToLoadMoreAdventures() {
        const adventuresListElem = document.getElementById('adventures-list');

        if (!this.state.loadingAdventures &&
            !this.state.noMoreData &&
            adventuresListElem &&
            adventuresListElem.lastElementChild) {
            if (checkVisibility(adventuresListElem.lastElementChild)) {
                this.loadAdventures();
            }
        }
    }

    loadTags() {
        fetch('/api/tags')
            .then(
                (response) => response.json(),
                (error) => console.error('An error occurred.', error)
            )
            .then((tags) =>
                this.setState({tags})
            );
    }

    loadData() {
        this.loadTags();
        this.loadAdventures();
    }

    componentDidMount() {
        this.loadData();

        window.addEventListener('scroll', this.tryToLoadMoreAdventures.bind(this));
        window.addEventListener('resize', this.tryToLoadMoreAdventures.bind(this));

        const tagInput = (document.getElementById('tag-input') as HTMLInputElement);
        const keywordInput = (document.getElementById('keyword-input') as HTMLInputElement);
        const searchButton = document.getElementById('search-button');

        if (tagInput && keywordInput && searchButton) {
            tagInput.addEventListener('focus', () => {
                this.setState({showTips: true});
                this.prepareTagTips();
            });
            tagInput.addEventListener('blur', () => {
                this.setState({showTips: false});
            });
            tagInput.addEventListener('input', () => {
                if (this.state.showTips) {
                    const query = tagInput.value.trim();
                    this.setState({tagInputValue: query});
                    this.prepareTagTips();
                }
            });

            keywordInput.addEventListener('input', () => {
                const query = keywordInput.value.trim();
                this.setState({keyword: query});
            });

            searchButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.setState({adventures: [], offset: 0});
                this.setState((prevState) => {
                    const typedPrevState = prevState as IIndexPageState;
                    return {
                        tagsForFiltering: typedPrevState.selectedTags,
                        keyworfForFiltering: typedPrevState.keyword
                    };
                });
                this.loadAdventures();
            });

            window.addEventListener('keydown', (event) => {
                if (this.state.showTips) {
                    if (
                        event.keyCode === KEY_CODES.ARROW_DOWN &&
                        this.state.focusedTagTipNum < this.state.tagsForTips.length - 1
                    ) {
                        event.preventDefault();
                        this.setState((prevState) => {
                            const typedPrevState = (prevState as IIndexPageState);
                            return {
                                focusedTagTipNum: ++typedPrevState.focusedTagTipNum
                            };
                        });
                    } else if (event.keyCode === KEY_CODES.ARROW_UP && this.state.focusedTagTipNum > 0) {
                        event.preventDefault();
                        this.setState((prevState) => {
                            const typedPrevState = (prevState as IIndexPageState);
                            return {
                                focusedTagTipNum: --typedPrevState.focusedTagTipNum
                            };
                        });
                    } else if (event.keyCode === KEY_CODES.ENTER) {
                        event.preventDefault();
                        this.selectTag(this.state.tagsForTips[this.state.focusedTagTipNum]);
                        tagInput.blur();
                    }
                }
            });
        }
    }

    renderTipsText(slug: string) {
        if (this.state.tagInputValue) {
            const parts = separateTextbyFirstMatch(slug, this.state.tagInputValue);
            return (
                <Fragment>
                    {parts[0]}
                    <span className="filters__tip-text_bold">
                        {parts[1]}
                    </span>
                    {parts[2]}
                </Fragment>
            );
        }

        return slug;
    }

    selectTag(slug: string) {
        this.setState((prevState) => {
            const typedPrevState = prevState as IIndexPageState;
            return {
                selectedTags: typedPrevState.selectedTags.concat(slug)
            };
        });
    }

    removeSelectedTag(slug: string) {
        this.setState((prevState) => {
            const typedPrevState = prevState as IIndexPageState;
            return {
                selectedTags: typedPrevState.selectedTags.filter((itemSlug) => itemSlug !== slug)
            };
        });
    }

    prepareTagTips() {
        this.setState((prevState) => {
            const typedPrevState = prevState as IIndexPageState;
            return {
                focusedTagTipNum: 0,
                tagsForTips: typedPrevState.tags
                    .map(({slug}) => slug)
                    .filter((slug) =>
                        slug.includes(typedPrevState.tagInputValue) && !typedPrevState.selectedTags.includes(slug)
                    )
            };
        });
    }

    tryToShowLoadingAnimation() {
        if (this.state.loadingAdventures) {
            return (<LoadingAnimation/>);
        }
    }

    render() {
        const content = this.state.adventures.map((adventure) => (<Adventure key={adventure.id} data={adventure}/>));

        return (
            <Layout>
                <main className="main-page">
                    <form className="filters" id="filters-box">
                        <div className="filters__search-bar">
                            <input
                                className="filters__query-input"
                                type="text"
                                placeholder="Текст запроса"
                                id="keyword-input"
                            />
                            <button type="button" className="filters__button" id="search-button">Найти</button>
                        </div>
                        <div className="filters__tags-bar">
                            <div className="filters__selected-tags" id="selected-tag-box">
                                {this.state.selectedTags.map((slug, index) => (
                                    <div key={index} className="filters__selected-tag">
                                        <span>{`#${slug}`}</span>
                                        <div
                                            className="filters__tag-remove-button"
                                            onClick={() => this.removeSelectedTag(slug)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="filters__tag-input-wrapper" id="tag-input-wrapper">
                                <input
                                    className="filters__tag-input"
                                    id="tag-input"
                                    type="text"
                                    placeholder="Хештег"
                                    autoComplete="off"
                                />
                                <div
                                    className={
                                        this.state.showTips ? 'filters__search-tips' : 'filters__search-tips hide'
                                    }
                                    id="tips-box"
                                >
                                    {this.state.tagsForTips.map((slug, index) => (
                                        <div
                                            key={index}
                                            className={
                                                index === this.state.focusedTagTipNum ?
                                                    'filters__tip filters__tip_selected' : 'filters__tip'
                                            }
                                            onMouseDown={() => this.selectTag(slug)}
                                        >
                                            {this.renderTipsText(slug)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>
                    <article className="adventures-list" id="adventures-list">
                        {content}
                        {this.tryToShowLoadingAnimation()}
                    </article>
                </main>
            </Layout>
        );
    }
}

export default IndexPage;
