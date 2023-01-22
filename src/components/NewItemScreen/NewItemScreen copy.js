
import { useTheme } from '@react-navigation/native'
import { useContext, useEffect, useReducer } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { AuthContext } from '../../context/context'
import { getTags } from '../../service/TagsService'
import * as MediaUtils from "../../utils/MediaUtils.js"
import { PrimaryButton } from '../common/buttons'
import EditImageModal from './EditImageModal.js'
import { ACTIONS, initialState, reducer, StateType } from "./reducer.js"
import * as ItemsService from '../../service/ItemsService'
import * as FileSystem from 'expo-file-system'

type Action = { type: string, payload: {} }

async function f() {
    const dir = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory)
    console.debug("dir", JSON.stringify(dir))
    const imagePickerDir = FileSystem.cacheDirectory + "/" + dir[0]
    const fileNames = await FileSystem.readDirectoryAsync(imagePickerDir)
    console.debug("fileNames", JSON.stringify(fileNames.length))
    const fileUri = imagePickerDir + "/" + fileNames[0]
    const info = await FileSystem.getInfoAsync(fileUri)
    console.debug("info", JSON.stringify(info))
}

export const NewItemScreen = () => {
    const [state, dispatch]: [StateType, (action: Action) => void] =
        useReducer(reducer, initialState)

    const theme = useTheme()
    const style = styles(theme)

    const { user } = useContext(AuthContext)

    useEffect(() => {
        getTags(user).then(tags =>
            dispatch({
                type: ACTIONS.SET_ALL_TAGS,
                payload: { tags: tags ? tags : [] }
            })
        )
    }, [])

    const handleUploadImage = () => {
        MediaUtils.pickImage().then(toUpload => {
            dispatch({
                type: ACTIONS.ADD_IMAGES_TO_UPLOAD,
                payload: { images: toUpload }
            })
        })
    }

    const handleNewImage = () => {
        MediaUtils.takePhoto().then(toUpload => {
            dispatch({
                type: ACTIONS.ADD_IMAGES_TO_UPLOAD,
                payload: { images: toUpload }
            })
        })
    }

    const renderCameraButton = () => {
        return <View style={style.bigButtonContainer}>
            <TouchableOpacity
                style={style.bigButton}
                onPress={handleNewImage}
            >
                <Text style={style.text}>New Item</Text>
            </TouchableOpacity>
        </View>
    }

    const renderAddExisting = () => {
        return <View style={style.bigButtonContainer}>
            <TouchableOpacity
                style={style.bigButton}
                onPress={handleUploadImage}
            >
                <Text style={style.text}>Add existing</Text>
            </TouchableOpacity>
        </View>
    }

    const toggleOpenModal = (image: MediaUtils.ImageToUpload, doShow: boolean) => {
        dispatch({
            type: ACTIONS.EDIT_IMAGE,
            payload: { assetId: image.assetId, isEdit: doShow }
        })
    }

    const renderImagesToUpload = () => {
        return state.toUpload.length > 0 && <ScrollView
            horizontal={true}
            style={style.uploadContainer}
        >
            {
                state.toUpload
                    .sort((a, b) => a.image.assetId > b.image.assetId)
                    .map(tu => tu.image)
                    .map((image, index) => {
                        return <View
                            key={index}
                            style={style.imageToUploadContainer}
                        ><TouchableOpacity
                            onPress={() => toggleOpenModal(image, true)}
                            activeOpacity={0.69}
                            style={style.imageToUploadTouchable}
                        >
                                <Image
                                    source={{ uri: image.uri }}
                                    style={style.imageToUpload}
                                />
                            </TouchableOpacity>
                        </View>
                    })
            }
        </ScrollView>
    }

    const renderEditImageModal = () => {
        const maybeToUpload = state.toUpload.find(tu => tu.isEdit)

        return maybeToUpload && <EditImageModal
            toUpload={maybeToUpload}
            tags={state.tags}
            isVisible={maybeToUpload.isEdit}
            dispatch={dispatch}
        />
    }

    const upload = () => {
        const items = state.toUpload.map(tu => {
            const item: ItemsService.Item = {
                assetId: tu.image.assetId,
                uri: tu.image.uri,
                name: tu.image.name,
                tagIds: tu.tags.map(t => t.id)
            }

            return item;
        })

        ItemsService.addItems(user, items)
            .then(() => {
                dispatch({
                    type: ACTIONS.CLEAR_ITEMS_TO_UPLOAD
                })
            })
    }

    return (
        <View style={style.container}>
            {renderEditImageModal()}
            {renderCameraButton()}
            {renderAddExisting()}
            {
                state.toUpload.length > 0 &&
                <View style={{height: 50, width: "100%"}}>
                    <PrimaryButton
                        title={"Save " + state.toUpload.length + " item(s)"}
                        onPress={upload}
                        buttonStyle={{
                            width: "100%",
                            marginTop: 15,
                            marginBottom: 5,
                        }}
                        textStyle={{
                            padding: 5
                        }}
                    />
                </View>
            }
            {renderImagesToUpload()}
        </View>
    )
}

const styles = (theme) => {
    return {
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "relative"
        },

        uploadContainer: {
            height: 200,
            width: "100%",
            marginTop: 20,
        },
        imageToUploadContainer: {
            flex: 1,
            borderWidth: 2,
            // minWidth: "30%",
            minWidth: 200,
            // width: "100%",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
        },
        imageToUploadTouchable: {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
            borderRadius: 55,
            width: "100%",
        },
        imageToUpload: {
            width: "100%",
            height: undefined,
            aspectRatio: 1,
            borderRadius: 27,
        },

        bigButtonContainer: {
            backgroundColor: theme.colors.primary,

            height: 180,
            width: 180,
            margin: 5,

            borderRadius: 15,

            // elevation: 10,
        },

        bigButton: {
            height: "100%",
            width: "100%",
            borderWidth: 1,
            borderRadius: 15,
            borderColor: theme.colors.text,
            borderStyle: "dashed",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },

        text: {
            fontSize: 20,
            color: theme.colors.text,
            // textShadowColor: 'rgba(0, 0, 0, 0.75)',
            // textShadowOffset: { width: -1, height: 1 },
            // textShadowRadius: 5,
            // textShadowColor: "white",
            fontWeight: "300"
        },

        modal: {
            container: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                opacity: 0.9
            },
            imageContainer: {
                minHeight: "70%",
                width: "90%",
                zIndex: 3,
            }
        }
    }
}