import { useTheme } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { Image, View, Text, ScrollView } from 'react-native';
import * as MediaUtils from "./../utils/MediaUtils"
import { useEffect } from "react";


type RecentsPropTypes = {
    media: MediaLibrary.Asset[]
}

export default Recents = ({ media }: RecentsPropTypes) => {
    const theme = useTheme();

    useEffect(() => {
        console.debug(media[0])
        media.length > 0 && MediaUtils.renameItem(media[0].uri, "MY_NEW_NAME")
    }, [])


    const renderImage = (asset: MediaLibrary.Asset, index) => {
        return <View key={index} style={{
            margin: 5,
        }}>
            <Image
                source={{ uri: asset.uri }}
                style={{
                    width: "100%",
                    minHeight: 80,
                }}
            />
            <View>
                <Text
                    numberOfLines={1}
                    style={{
                        width: 100,
                        color: theme.colors.text,
                        padding: 2,
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 5
                    }}
                >{asset.filename}</Text>
            </View>
        </View>
    }

    return (
        <View style={{
            height: "20%",
            margin: 10,
            borderWidth: 2,
            borderRadius: 5,
            borderColor: theme.colors.card,
        }}>
            <ScrollView
                horizontal={true}
            >
                {
                    media.map(renderImage)
                }
            </ScrollView>
        </View>
    )
}
