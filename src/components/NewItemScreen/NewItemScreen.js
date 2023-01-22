
import { useNavigation, useTheme } from '@react-navigation/native'
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

export const NewItemScreen = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const navigation = useNavigation()

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

    return (
        <View style={style.container}>
            {renderCameraButton()}
            {renderAddExisting()}
        </View>
    )

    function handleUploadImage() {
        MediaUtils.pickImage().then(toUpload => {
            if (toUpload?.length < 1) {
                console.log("Nothing to stage... idk")
                return
            }

            navigation.navigate("Stage", {
                toUpload: toUpload[0]
            })
        })
    }

    function handleNewImage() {
        MediaUtils.takePhoto().then(toUpload => {
            if (toUpload?.length < 1) {
                console.log("Nothing to stage... idk")
                return
            }

            navigation.navigate("Stage", {
                toUpload: toUpload[0]
            })
        })
    }

    function renderCameraButton() {
        return <View style={style.bigButtonContainer}>
            <TouchableOpacity
                style={style.bigButton}
                onPress={handleNewImage}
            >
                <Text style={style.text}>New Item</Text>
            </TouchableOpacity>
        </View>
    }

    function renderAddExisting() {
        return <View style={style.bigButtonContainer}>
            <TouchableOpacity
                style={style.bigButton}
                onPress={handleUploadImage}
            >
                <Text style={style.text}>Add existing</Text>
            </TouchableOpacity>
        </View>
    }
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