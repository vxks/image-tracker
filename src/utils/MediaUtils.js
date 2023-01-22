import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const appAlbumTitle = "Tracktor"

export type ImageToUpload = {
    name: string,
    assetId: string | undefined,
    uri: string
}

export const getAssets: Promise<MediaLibrary.Asset[]> = async (numberToFetch = 10) => {
    const maybeAlbum = await getAlbum();
    if (!maybeAlbum) throw new Error("No album to get assets from")

    return MediaLibrary.getAssetsAsync({
        first: numberToFetch,
        sortBy: [["modificationTime", false]],
        album: maybeAlbum
    }).then(pagedInfo => pagedInfo.assets)
}

export const getAsset: Promise<MediaLibrary.Asset[]> = async (id) => {
    const maybeAlbum = await getAlbum();
    if (!maybeAlbum) throw new Error("No album to get assets from")

    return getAssets(100).then(assets => assets.find(a => a.id === id))
}

export const clearAlbum = async (albumId) => {
    console.log("clearing album", albumId);
    return MediaLibrary.deleteAlbumsAsync(albumId, true)
        .then(r => {
            if (r)
                return createAlbumIfNotExists()
            else {
                console.log("could not clear album", albumId);
                return Promise.reject("could not clear album");
            }
        })
}

export const getAlbum = async () => MediaLibrary.getAlbumAsync(appAlbumTitle);

export const createAlbumIfNotExists = async () => {
    const maybeAlbum = await getAlbum();

    if (!!maybeAlbum) {
        console.log("album", JSON.stringify(maybeAlbum));
        console.log("already created album", maybeAlbum.title)
        return maybeAlbum;
    };

    const assetInfos = await MediaLibrary.getAssetsAsync({ first: 1 })
    const asset = assetInfos.assets[0]

    const album = await MediaLibrary.createAlbumAsync(appAlbumTitle, asset)
    if (!album) {
        console.log("could not create album", album.title);
        throw new Error("Could not create main album");
    }
    return album;
}

export const pickImage: () => Promise<ImageToUpload[]> = async () => {
    // No permissions request is necessary for launching the image library
    return ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
    }).then(result => {
        if (result.canceled) return [];

        const toUpload = result.assets.map(asset => {
            return {
                name: asset.fileName ? asset.fileName : "",
                assetId: asset.assetId,
                uri: asset.uri
            }
        });

        return toUpload;
    })
};

export const takePhoto: () => Promise<ImageToUpload[]> = async () => {
    await ImagePicker.getCameraPermissionsAsync().then(r => {
        if (!r.granted) {
            return ImagePicker.requestCameraPermissionsAsync()
        }
    })

    return ImagePicker.launchCameraAsync()
        .then(result => {
            if (result.canceled) return [];

            return Promise.all([
                ...result.assets.map(pickerAsset => MediaLibrary.createAssetAsync(pickerAsset.uri))
            ])
        })
        .then(assets => {
            const toUpload = assets.map(asset => {
                return {
                    name: asset.filename ? asset.filename : "",
                    assetId: asset.id,
                    uri: asset.uri
                }
            });

            return toUpload;
        })
}

export const addToMainAlbum = async (images: ImageToUpload[], album: MediaLibrary.AlbumRef) => {
    console.log("adding images to album");

    const withAssets = images.filter(i => !!i.assetId)
    const withOutAssets = images.filter(i => !i.assetId)


    // Create local image
    // Rename it
    // Create album asset


    const newAssetsPromise = () => {
        if (!!withOutAssets) {
            return Promise.all(
                withOutAssets.map(i => {
                    console.log("creating new asset");
                    return MediaLibrary.createAssetAsync(i.uri);
                })
            )
        } else {
            return Promise.resolve([])
        }
    }

    return newAssetsPromise().then(newAssets => {
        return MediaLibrary.addAssetsToAlbumAsync([
            ...withAssets.map(i => i.assetId),
            ...newAssets.map(i => i.id)
        ], album)
    })
}

export const renameItem = async (uri: string, newName: string) => {
    const folderUri = uri.split("/")
    // !!! side effects - pop(), push()
    const extension = folderUri.pop().split(".")[1]
    folderUri.push(newName + "." + extension)
    const newUri = folderUri.join("/")

    console.log("new path", newUri)


    // return FileSystem.copyAsync({
    //     from: uri,
    //     to: newUri
    // })

    // return Promise.resolve(true)
    // return FileSystem.moveAsync({
    //     from: uri,
    //     to: newUri
    // })
}