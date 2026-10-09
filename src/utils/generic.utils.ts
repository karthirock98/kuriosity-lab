import {parse} from 'tldts';

export const urlBreaker = (url: string) => {
    return parse(url)
}