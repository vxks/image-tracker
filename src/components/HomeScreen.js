import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';

import * as MediaUtils from './../utils/MediaUtils';
import ImagesToUpload from './ImagesToUpload';
import Recents from './Recents';

import { useContext, useEffect, useState } from 'react';

import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../context/context';
import { getTags } from '../service/TagsService';

import { PrimaryButton } from './common/buttons';

const initialImagesToUpload: MediaUtils.ImageToUpload[] = []

export const HomeScreen = ({ navigation }) => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [media, setMedia] = useState([]);
    const [imagesToUpload, setImagesToUpload] = useState(initialImagesToUpload)

    const [album, setAlbum] = useState(null);
    const [tags, setTags] = useState([]);

    const { auth } = useContext(AuthContext)

    const theme = useTheme();


    useEffect(() => {
        getTags(auth.currentUser).then(setTags)
    }, [])

    //TODO: MOVE TO ROOT
    useEffect(() => {
        requestPermission().then(r => {
            if (!r.granted) {
                console.log("oops");
                return;
            }
        })

        MediaUtils.createAlbumIfNotExists()
            .then(a => {
                setAlbum(a);
                updateMedia(a)
                return a;
            })
    }, [])

    const updateMedia = (alb) => {
        const numberToFetch = 20
        MediaLibrary.getAssetsAsync({ first: numberToFetch, sortBy: [["modificationTime", false]], album: alb.id })
            .then(pagedInfo => pagedInfo.assets)
            .then(setMedia)
    }

    const handleSignOut = () => {
        navigation.navigate("Login")
    };

    const handleClearAll = () => {
        MediaUtils.clearAlbum(album.id)
            .then(a => {
                setAlbum(a);
                updateMedia(a)
                return a;
            })
            .catch(err => {
                console.error("Could not clear album")
                throw err;
            })
    }
    const handleUploadImage = () => {
        MediaUtils.pickImage().then(toUpload => {
            setImagesToUpload(prev => [
                ...prev,
                ...toUpload
            ])
        })
    }

    const handleStoreImages = () => {
        MediaUtils.addToMainAlbum(imagesToUpload, album).then((isAdded) => {
            console.log("added", isAdded)
            updateMedia(album)

            if (isAdded) setImagesToUpload([])
            else console.error("could not add images to album")
        }).catch((err) => {
            throw new Error(err)
        })
    }

    const handleNewImage = () => {
        MediaUtils.takePhoto().then(toUpload => {
            setImagesToUpload(prev => [
                ...prev,
                ...toUpload
            ])
        })
    }

    return (
        <ScrollView
            contentContainerStyle={{
                backgroundColor: theme.colors.background,
                flex: 1,
            }}>
            <PrimaryButton
                title="Clear all"
                onPress={() => handleClearAll()}
            />

            <Recents media={media.slice(0, 9)} />

            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
                backgroundColor: theme.colors.background,
            }}>
                <View
                    style={{
                        margin: 5,
                    }}
                >
                    {
                        imagesToUpload.length > 0 && <PrimaryButton
                            title="Store"
                            onPress={() => handleStoreImages()}
                        />
                    }
                </View>

                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.colors.background,
                        borderWidth: 5,
                        borderRadius: 5,
                        borderColor: theme.colors.card,
                        width: "100%",
                        height: "60%"
                    }}
                >
                    <ImagesToUpload
                        images={imagesToUpload}
                        setImages={setImagesToUpload}
                        tags={tags}
                    />
                </View>

                <View style={{ width: 150, margin: 5 }}>
                    <PrimaryButton
                        title="New"
                        onPress={() => handleNewImage()}
                    />
                </View>

                <View style={{ width: 150, margin: 5 }}>
                    <PrimaryButton
                        title="Upload"
                        onPress={() => handleUploadImage()}
                    />
                </View>
                <PrimaryButton title='Tags' onPress={() => navigation.navigate("Tags")} />

                <PrimaryButton
                    title='Sign Out'
                    onPress={handleSignOut}
                />
                <StatusBar style="auto" hidden={false} />
            </View>
        </ScrollView>

    );
};