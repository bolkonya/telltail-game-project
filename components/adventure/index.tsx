import Link from 'next/link';
import React, {Component} from 'react';

import {IAdventureData} from '../../common/types';
import {staticContext} from '../../common/static-context';

import './index.css';

interface IAdventureProps {
    data: IAdventureData;
}

class Adventure extends Component<IAdventureProps> {
    render() {
        const {id, name, image, description, tags, firstSceneId} = this.props.data;
        const linkHref = `/adventures/${id}/scenes/${firstSceneId}`;

        return (
            <section className="adventure">
                <div className="adventure__image">
                    <Link href={linkHref}>
                        <a>
                            <img src={this.context.staticPath + (image || this.context.defaultAdventureImage)}/>
                        </a>
                    </Link>
                </div>
                <div className="adventure__info">
                    <div className="adventure__name">
                        <Link href={linkHref}>
                            <a>
                                {name}
                            </a>
                        </Link>
                    </div>
                    <div className="adventure__description">
                        {description}
                    </div>
                    <div className="adventure__tags">
                        {
                            tags.map(({id: tagId, name: tagName, slug}) => (
                                <a key={tagId} href={`/tag/${tagName}`} className="adventure__tag">{`#${slug}`}</a>
                            ))
                        }
                    </div>
                </div>
            </section>
        );
    }
}

Adventure.contextType = staticContext;

export default Adventure;
