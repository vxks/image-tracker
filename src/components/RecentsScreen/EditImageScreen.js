import { useNavigation, useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from "react";
import {
    FlatList, Image, ScrollView, Text,
    TouchableOpacity, View, TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,

} from 'react-native';
import { AuthContext } from '../../context/context';
import { PrimaryButton } from "../common/buttons";
import { Tag } from '../common/tag';
import * as ItemsService from "./../../service/ItemsService";
import * as TagsService from "./../../service/TagsService";
import * as MediaUtils from "./../../utils/MediaUtils";


export const EditImageScreen = ({ route }) => {
    const theme = useTheme()
    const style = styles(theme);

    const { item, allTags } = route.params;
    const [tagIds, setTagIds] = useState(item.tagIds)

    const [name, setName] = useState(item.name)
    const [tags, setTags] = useState([])

    const { user } = useContext(AuthContext)
    const navigation = useNavigation()

    useEffect(() => {
        TagsService.getTags(user).then(setTags)
    }, [])

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={Keyboard.dismiss}
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View style={{
                flex: 4,
                width: "90%",
                marginTop: 5,
            }}>

                <Image
                    source={{ uri: item.uri }}
                    resizeMode="contain"
                    style={{
                        flex: 1,
                    }}
                />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "position"}
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View>
                    <TextInput
                        placeholder="Name"
                        placeholderTextColor={theme.colors.text}
                        style={style.modal.nameInput}
                        value={name}
                        onChangeText={setName}
                    />
                </View>
            </KeyboardAvoidingView>
            <View style={{
                flex: 1
            }}>
                {renderAllTags()}
            </View>
            <View style={{
                width: "100%",
                height: 60,
            }}>
                <PrimaryButton title="Save" onPress={handleSubmit} />
            </View>
        </TouchableOpacity>
    )

    function handleSubmit() {
        const updatedItem: ItemsService.Item = {
            ...item,
            name: name,
            tagIds: tagIds
        }

        ItemsService.editItem(user, updatedItem)
            .then(() => {
                navigation.navigate("All")
            })
    }

    function renderTag(tag, isActive, index) {
        return <View
            key={index}
            style={{ margin: 2 }}>
            <Tag
                tag={tag}
                isActive={isActive}
                onPress={() => {
                    if (isActive) {
                        const newTagIds = tagIds.filter(t => t !== tag.id)
                        setTagIds(newTagIds)
                    } else {
                        const newTagIds = [...tagIds, tag.id]
                        setTagIds(newTagIds)
                    }
                }}
            />
        </View>;
    }


    function isTagActive(tag) {
        return tagIds.includes(tag.id)
    }

    function renderAllTags() {
        return <ScrollView
            horizontal={true}
            style={{
                maxHeight: 80,
            }}
        >
            {
                tags.map((tag, index) => renderTag(tag, isTagActive(tag), index))
            }
        </ScrollView>
    }
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
                backgroundColor: "lightpink",
                margin: 10,
                width: 250,
                fontSize: 30,
                borderColor: "white",
                borderWidth: 2,
            }
        }
    }
}