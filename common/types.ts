export interface IFilterOptions {
    count: number;
    offset: number;
    tags: string[];
    keyword: string;
}

export interface ITagData {
    id: number;
    name: string;
    slug: string;
}

export interface IAdventureData {
    id: number;
    name: string;
    description: string;
    image: string;
    firstSceneId: number;
    tags: ITagData[];
}

export interface IAchievementData {
    id: number;
    name: string;
    image: string;
}

export interface IAction {
    id: number;
    name: string;
    targetSceneId: number;
}

export interface ISceneData {
    id: number;
    description: string;
    image: string;
    position: string;
    actions: IAction[];
    adventureId: number;
    achievements: IAchievementData[];
}

export interface IIndexPageState {
    adventures: IAdventureData[];
    loadingAdventures: boolean;
    offset: number;
    count: number;
    keyword: string;
    tagInputValue: string;
    focusedTagTipNum: number;
    selectedTags: string[];
    tags: ITagData[];
    noMoreData: boolean;
    showTips: boolean;
    tagsForTips: string[];
    tagsForFiltering: string[];
    keyworfForFiltering: string;
}

export interface ITagPageState {
    hasError: boolean;
    errorMessage: string;
    adventures: IAdventureData[];
    tagSlug: string;
    loadingAdventures: boolean;
}

export interface IScenePageState {
    loadingData: boolean;
    hasError: boolean;
    errorMessage: string;
    description: string;
    image: string;
    position: string;
    actions: IAction[];
    achievements: IAchievementData[];
    adventureId: number;
    firstSceneId: number;
}

export enum ACTIONS {

}

export enum KEY_CODES {
    ARROW_UP = 38,
    ARROW_DOWN = 40,
    ENTER = 13
}

export interface IAction {
    type: ACTIONS;
    payload: object;
}
