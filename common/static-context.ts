import {createContext} from 'react';

const staticContext = createContext({
    staticPath: '',
    defaultAdventureImage: '',
    loadingGif: ''
});

const staticSettings = {
    staticPath: '//bolkonyashka-task-2018.surge.sh/',
    defaultAdventureImage: 'images/adventures/default.jpg',
    loadingGif: '/loading.gif'
};

export {staticContext, staticSettings};
