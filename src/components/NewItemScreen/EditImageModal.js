import { useTheme } from '@react-navigation/native'
import { useContext } from 'react'
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, TextInput, View } from "react-native"
import { AuthContext } from '../../context/context.js'
import { PrimaryButton } from '../common/buttons.js'
import { Tag } from '../common/tag'
import { ACTIONS } from './reducer.js'

export const EditImageModal = ({
    toUpload,
    tags,
    isVisible,
    dispatch
}) => {
    const theme = useTheme()
    const style = styles(theme);
    const { auth } = useContext(AuthContext)

    const image = toUpload.image
    const imageTags = toUpload.tags

    const name = toUpload.image.name
    const setName = (value) => dispatch({
        type: ACTIONS.SET_NAME_FOR_IMAGE,
        payload: {
            assetId: image.assetId,
            name: value
        }
    })

    const renderTag = (tag, isActive, index) => {
        return <View style={{ margin: 2 }}>
            <Tag
                tag={tag}
                isActive={isActive}
                key={index}
                onPress={() => {
                    if (!isActive) {
                        dispatch({
                            type: ACTIONS.ADD_TAG_TO_IMAGE,
                            payload: {
                                tagId: tag.id,
                                assetId: image?.assetId
                            }
                        })
                    }
                    else {
                        dispatch({
                            type: ACTIONS.REMOVE_TAG_FROM_IMAGE,
                            payload: {
                                tagId: tag.id,
                                assetId: image?.assetId
                            }
                        })
                    }
                }}
            />
        </View>;
    }

    const renderImage = () => {
        return image && <Image
            source={{ uri: image.uri }}
            style={style.modal.imageToUpload}
        />
    }

    const renderAllTags = () => {
        return <ScrollView
            horizontal={true}
            style={{
                maxHeight: 80,
            }}
        >
            {
                tags.map((tag, index) => renderTag(tag, imageTags.includes(tag), index))
            }
        </ScrollView>
    }

    const renderNameInput = () => {
        return <TextInput
            placeholder="Name"
            placeholderTextColor={theme.colors.text}
            style={style.modal.nameInput}
            value={name}
            onChangeText={setName}
        />
    }

    const closeModal = () => dispatch({
        type: ACTIONS.EDIT_IMAGE,
        payload: { assetId: image.assetId, isEdit: false }
    })

    const handleSubmit = () => {
        closeModal()
    }

    return <Modal
        transparent={true}
        visible={isVisible}
        animationType="slide"
        onRequestClose={closeModal}
    >
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={style.modal.container}
        >
            <View style={style.modal.imageContainer}>
                {renderImage()}
                {renderAllTags()}
                {renderNameInput()}
                <View style={{height: 50}}>
                    <PrimaryButton
                        title="Save"
                        onPress={handleSubmit}
                        buttonStyle={{
                            marginBottom: 15
                        }}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    </Modal>
}

const styles = (theme) => {
    return {
        modal: {
            container: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            },
            imageContainer: {
                height: "100%",
                width: "100%",
                padding: 5,
                zIndex: 3,
                borderWidth: 5,
                borderRadius: 15,
                borderColor: "white",
                backgroundColor: theme.colors.primary
            },
            imageToUpload: {
                height: "70%",
                resizeMode: 'contain',
            },
            tagsContainer: {
                zIndex: 3,
                elevation: 3,
                flexDirection: "row",
            },
            nameInput: {
                color: theme.colors.text,
                margin: 10,
                width: 250,
                fontSize: 30,
                borderColor: "white",
                borderWidth: 2,
            }
        }
    }
}