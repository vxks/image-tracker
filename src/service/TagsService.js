import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';

export type Tag = {
    id?: number | null | undefined,
    label: string,
    description?: string | undefined
}

const key = (uid) => `${uid}_tags`

function setItem(user: User, updated) {
    return AsyncStorage.setItem(key(user.uid), updated)
}

function removeItem(user: User) {
    return AsyncStorage.removeItem(key(user.uid))
}

function getItem(user: User) {
    return AsyncStorage.getItem(key(user.uid))
}

export const addTag = (user: User, tag: Tag) => {
    if (!!tag.id) throw new Error("Can't create new tag with custom ID")
    
    return getTags(user).then(maybeTags => {
        const tags = maybeTags ? maybeTags : []
        const lastId = tags.length
        const newId = lastId + 1
        const newTag = {
            ...tag,
            id: newId
        }

        const updated = JSON.stringify([...tags, newTag])
        console.log("adding new tag", JSON.stringify(newTag));
        return setItem(user, updated)
    })
}

export const removeTag = (user: User, tagId: number) => {
    console.log("removing tag", JSON.stringify(tag));
    return getTags(user).then(maybeTags => {
        const tags = maybeTags ? maybeTags : []
        const maybeTag=  maybeTags.find(t => t.id === tagId)

        if (!maybeTag)
            throw new Error(`No Tag with id ${tagId} exists. Cannot remove tag`)

        const newTags = tags.filter(t => t.id !== tagId)
        const updated = JSON.stringify(newTags)
        return setItem(user, updated)
    })
}

export const clearTags = (user: User) => {
    console.log("clearing all tags for", user.email);
    return removeItem(user)
}

export const getTags: (user: User) => Promise<Tag[]> = async (user: User) => {
    return getItem(user).then(value => {
        return JSON.parse(value) || []
    })
}