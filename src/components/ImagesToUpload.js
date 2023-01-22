import { Image, TextInput, TouchableOpacity, View, ScrollView, Text } from 'react-native';
import { useState } from 'react';

import * as MediaUtils from './../utils/MediaUtils';
import { Tag } from '../service/TagsService';
import { useTheme } from '@react-navigation/native';

type ImagesToUploadPropTypes = {
    images: MediaUtils.ImageToUpload[],
    tags: Tag[],
    setImages: () => void
}

export default ImagesToUpload = ({
    images,
    tags,
    setImages
}: ImagesToUploadPropTypes) => {
    const theme = useTheme();

    const handleSetName = (text, assetId) => {
        const maybeImage = images.find(i => i.assetId === assetId)
        const newImage = {
            ...maybeImage,
            name: text
        }

        const removed = images.filter(i => i.assetId !== assetId)
        const updated = [...removed, newImage]

        setImages(updated)
    }

    return <ScrollView
        horizontal={true}
        style={{
            // flex: 1
            // width: "100%",
            // height: "100%",
        }}
        contentContainerStyle={{
            // width: "100%",
            // height: "100%",
            backgroundColor: theme.colors.card,
            position: "relative",
            // justifyContent: "center",
            // alignItems: "center",
        }}
    >
        {images.map((image, index) => {
            return <ImageToUpload
                key={index}
                image={image}
                handleSetName={handleSetName}
                tags={tags ? tags : []}
            />
        })}
    </ScrollView>
}

const ImageToUpload = ({
    image,
    handleSetName,
    tags
}) => {
    const [showTags, setShowTags] = useState(false)
    const [imageTags, setImageTags] = useState([])

    const { name, uri, assetId } = image

    const theme = useTheme();

    const renderTag = (tag, isRemovable, index) => {
        return <TouchableOpacity style={{
            alignItems: "center",
            backgroundColor: theme.colors.card,
            padding: 10,
            margin: 5,
        }}
            key={index}
            onPress={() => {
                if (!isRemovable) {
                    setImageTags(prev => [...prev, tag])
                }
                else {
                    setImageTags(prev => prev.filter(t => t.id !== tag.id))
                }
            }}
        >
            <Text style={{ color: theme.colors.primary }}>{tag.label}</Text>
            {isRemovable && <Text>-</Text>}
            {!isRemovable && <Text>+</Text>}
        </TouchableOpacity>
    }

    return <View
        style={{
            margin: 10,
            backgroundColor: theme.colors.background,
            width: "33%",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        {
            imageTags.length > 0 && <View style={{
                position: 'absolute',
                zIndex: 3,
                elevation: 3,
                flexDirection: "row"
            }}>
                {imageTags.map((tag, index) => renderTag(tag, true, index))}
            </View>
        }
        <TouchableOpacity
            onPress={() => setShowTags(prev => !prev)}
            activeOpacity={0.69}
            style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.colors.background,
                borderRadius: 55,
                width: "100%",
            }}
        >
            <Image
                source={{ uri: uri }}
                style={{
                    width: "100%",
                    height: undefined,
                    aspectRatio: 1,
                    borderRadius: 27,
                }}
            />
        </TouchableOpacity>
        {
            showTags && <View style={{ zIndex: 3, flexDirection: "row" }}>
                {
                    tags.filter(t => !imageTags.includes(t))
                        .map((tag, index) => renderTag(tag, false, index))
                }
            </View>
        }

        <TextInput
            placeholder='Name'
            value={name}
            onChangeText={text => handleSetName(text, assetId)}
        />
    </View>
}