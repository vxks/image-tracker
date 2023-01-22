import { uuidv4 } from '@firebase/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import { Tag } from './TagsService';
import * as MediaUtils from "./../utils/MediaUtils"
import * as MediaLibrary from "expo-media-library"
import { Platform } from "react-native";

export type Item = {
    uuid?: string,
    assetId: string,
    uri: string,
    name: string,
    tagIds: number[]
}

const key = (uid) => `${uid}_items`

async function setItem(user: User, updated: Item[]) {
    return AsyncStorage.setItem(key(user.uid), JSON.stringify(updated))
}

async function removeItem(user: User) {
    return AsyncStorage.removeItem(key(user.uid))
}

async function getItem(user: User) {
    return AsyncStorage.getItem(key(user.uid)).then(value => JSON.parse(value) || [])
}

export async function clearAllItems(user: User): Promise<void> {
    console.log("!!! CLEARING ALL ITEMS !!!")
    return setItem(user, [])
}

export async function editItem(user: User, item: Item) {
    const userItems = await getItems(user)
    const itemRemoved = userItems.filter(i => i.uuid !== item.uuid)
    const itemUpdated = [...itemRemoved, item]
    setItem(user, itemUpdated)
}

export async function addItems(user: User, items: Item[]): Promise<void> {
    const count = items.length
    console.log(`Saving ${count} items to storage`)

    if (items.length < 1) {
        console.log("No items to save")
        return;
    }

    const album = await MediaUtils.getAlbum()
    const currentItems = await getItems(user)

    const handleItem = async (item: Item) => {
        console.log("moving asset", item.assetId)

        // if iOS => the asset ID doesn't change
        if (Platform.OS === "ios") {
            const isSuccess = await MediaLibrary.addAssetsToAlbumAsync(item.assetId, album)
            if (!isSuccess) {
                console.error(`Could not add asset ${item.assetId} to album`)
                return;
            }

            const newUuid = uuidv4()
            const updatedItem = {
                ...item,
                uuid: newUuid
            }

            const updated = [...currentItems, updatedItem]
            return await setItem(user, updated)
        } else {
            // hacky way to get the new asset ID
            // asset ID changes when added to album
            const albumBefore = await MediaUtils.getAssets(3)
            console.log("albumBefore", albumBefore.map(a => a.id))

            const isSuccess = await MediaLibrary.addAssetsToAlbumAsync(item.assetId, album)
            if (!isSuccess) {
                console.error(`Could not add asset ${item.assetId} to album`)
                return;
            }

            const albumUpdated = await MediaUtils.getAssets(3)
            console.log("albumUpdated", albumUpdated.map(a => a.id))

            const newAsset = albumUpdated[0]
            console.log("newAsset", newAsset.id)

            const newUuid = uuidv4()
            const updatedItem = {
                ...item,
                uuid: newUuid,
                assetId: newAsset.id,
                uri: newAsset.uri
            }

            const updated = [...currentItems, updatedItem]
            await setItem(user, updated)
        }

    }

    await Promise.all(items.map(handleItem))
}

export async function getItems(user: User): Promise<Item[]> {
    console.log("Getting items from storage")
    return getItem(user)
}