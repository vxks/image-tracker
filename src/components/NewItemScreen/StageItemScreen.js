import { useTheme } from '@react-navigation/native'
import { useContext, useEffect, useState, useRef } from 'react'
import {
    Image, KeyboardAvoidingView, Modal, Platform, ScrollView, TextInput, View, Dimensions, ImageBackground, TouchableOpacity, Keyboard,
    Animated,
    FlatList
} from "react-native"
import { AuthContext } from '../../context/context.js'
import { PrimaryButton } from '../common/buttons.js'
import { Tag as TagC } from '../common/tag'
import { ACTIONS } from './reducer.js'
import * as MediaUtils from "../../utils/MediaUtils.js"
import { getTags, Tag } from '../../service/TagsService.js'
import { itemRemoved } from '../../utils/ArrayUtils.js'
import { Center } from '../common/Center.js'
import ItemsService from "./../../service/ItemsService"

function cleanedName(assetName: string | undefined) {
    if (!assetName) return "";

    return assetName.replace(".jpeg", "");
}

export const StageItemScreen = ({
    route,
    dispatch
}) => {
    const theme = useTheme()
    const style = styles(theme);
    const { user } = useContext(AuthContext)

    const image: MediaUtils.ImageToUpload | undefined = route.params.toUpload

    const [name, setName] = useState(cleanedName(image?.name))
    const [note, setNote] = useState("")

    const [allTags, setAllTags] = useState([])
    const [imageTagIds, setImageTagIds] = useState([])

    useEffect(() => {
        getTags(user).then(tags => setAllTags(tags))
            .catch(err => console.error("Error fetching tags", err))
    }, [])

    useEffect(() => {
        Image.getSize(image.uri, (width, height) => {
            setAspectRatio(width / height)
        })
    }, [image])

    // width from [aspectRatio * Dimensions.get("window").height] -> window width
    // blur from 15 -> 0
    const DURATION = 200
    const [aspectRatio, setAspectRatio] = useState(1)
    const screenWidth = Dimensions.get("window").width
    const maintainedWidth = aspectRatio * Dimensions.get("window").height
    const widthAnimation = useRef(new Animated.Value(maintainedWidth)).current
    const opacityAnimation = useRef(new Animated.Value(1)).current
    const [blur, setBlur] = useState(10)
    const [opacity, setOpacity] = useState(0.8)

    function scaleImage(width) {
        Animated.timing(widthAnimation, {
            toValue: width,
            duration: DURATION,
            useNativeDriver: false,
        }).start()
    }

    function opaqueForm(opacity) {
        Animated.timing(opacityAnimation, {
            toValue: opacity,
            duration: DURATION,
            useNativeDriver: true,
        }).start()
    }

    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Animated.View
                style={{
                    width: widthAnimation,
                    position: "absolute",
                    top: 0
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    delayLongPress={200}
                    onPress={() => {
                        Keyboard.dismiss()
                    }}
                    onLongPress={() => {
                        Keyboard.dismiss()
                        setOpacity(1)
                        setBlur(0)
                        opaqueForm(0)
                        scaleImage(screenWidth)
                    }}
                    onPressOut={() => {
                        setOpacity(0.8)
                        setBlur(10)
                        opaqueForm(1)
                        scaleImage(aspectRatio * Dimensions.get("window").height)
                    }}
                    style={{
                        zIndex: -1,
                        position: "absolute",
                        width: "100%"
                    }}
                >
                    <Image
                        source={{ uri: image.uri }}
                        blurRadius={blur}
                        style={{
                            opacity: opacity,
                            aspectRatio,
                            width: "100%"
                        }} />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View
                style={{
                    opacity: opacityAnimation,
                    maxHeight: 350,
                    flex: 1,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "space-around"
                    }}
                >
                    <View style={{
                        maxHeight: 100,
                        width: "100%",
                        padding: 10,
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {renderAllTags()}
                    </View>
                    <View style={style.nameInputContainer}>
                        {renderNameInput()}
                    </View>
                    <Center style={style.noteContainer}>
                        {renderNote()}
                    </Center>
                    <View style={style.buttonContainer}>
                        <PrimaryButton
                            title="Save"
                            onPress={handleSubmit}
                            textStyle={{
                                fontSize: 21
                            }}
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    )


    function renderTag(tag, isActive) {
        return <TagC
            tag={tag}
            isActive={isActive}
            style={{
                height: 50,
                elevation: 5
            }}
            onPress={() => {
                if (!isActive) { // add tag
                    setImageTagIds(prev => [...prev, tag.id])
                }
                else { // remove tag
                    setImageTagIds(prev => prev.filter(id => id !== tag.id))
                }
            }}
        />;
    }

    function renderAllTags() {
        return (
            <FlatList
                horizontal={true}
                data={allTags}
                renderItem={({ item }) => renderTag(item, imageTagIds.includes(item.id))}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
            />
        )
    }

    function renderNameInput() {
        return <TextInput
            autoCorrect={false}
            style={style.nameInput}
            onChangeText={setName}
            value={name}
            placeholder="Name"
            placeholderTextColor={"white"}
        />
    }

    function renderNote() {
        return <TextInput
            placeholder="Note"
            placeholderTextColor={"white"}
            multiline={true}
            numberOfLines={3}
            style={style.noteInput}
            value={note}
            onChangeText={setNote}
        />
    }

    function handleSubmit() {
        console.log("subitting")

        const item: ItemsService.Item = {
            assetId: tu.image.assetId,
            uri: tu.image.uri,
            name: tu.image.name,
            tagIds: tu.tags.map(t => t.id)
        }

        ItemsService.addItems(user, [item])
            .then(() => {
                dispatch({
                    type: ACTIONS.CLEAR_ITEMS_TO_UPLOAD
                })
            })

    }
}

const styles = (theme) => {
    return {
        container: {
            height: "100%",
            width: "100%",
            flex: 1,
            justifyContent: "space-between",
        },
        nameInputContainer: {
            height: 50,
            width: 200,
            justifyContent: "center",
            alignItems: "center"
        },
        nameInput: {
            width: "100%",

            backgroundColor: theme.colors.primary,

            borderColor: theme.colors.primary,
            borderRadius: 15,

            padding: 3,

            textAlign: "center",

            fontSize: 27,
            fontWeight: "500",
            color: "white",

            textShadowColor: 'black',
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 20,
        },
        noteContainer: {
            height: 70,
            width: 300,
            margin: 5,
            marginBottom: 15,

            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",

            backgroundColor: theme.colors.primary,
        },
        noteInput: {
            margin: 10,
            padding: 9,

            height: "100%",
            width: "100%",

            borderColor: theme.colors.primary,

            fontSize: 23,
            color: "white",

            textShadowColor: 'black',
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 20,
        },
        imageContainer: {
            flex: 1,
            minHeight: Dimensions.get('window').height / 2,
            justifyContent: "center",
            alignItems: "center",
        },
        image: {
            height: "100%",
            width: "100%",
            resizeMode: "contain",
        },
        buttonContainer: {
            height: 60,
            width: "100%",
        }
    }
}