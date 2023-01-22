import { useContext, useEffect, useState } from "react"
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AuthContext } from "../context/context.js"
import * as TagsService from "./../service/TagsService"

const intitialNewTagState: Tag = {
    label: "",
    description: ""
}

const initialTagsState: Tag[] = []

const renderTag = (tag, index) => {
    return <TouchableOpacity style={{
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        margin: 5
    }}
        key={index}>
        <Text>{tag.label}</Text>
    </TouchableOpacity>
}

const Tags = ({ tags }) => {
    return <View style={{
        justifyContent: "center",
        alignItems: "center"
    }}>
        <Text
            style={{
                fontSize: 25
            }}
        >My Tags</Text>
        <View style={{
            flexDirection: "row",
            flexWrap: "wrap"
        }}>
            {
                tags && tags.map(renderTag)
            }
        </View>
    </View>
}

export const TagsScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext)
    const [tags, setTags] = useState(initialTagsState)
    const [newTag, setNewTag] = useState(intitialNewTagState)

    const [showNewForm, setShowNewForm] = useState(false)

    const updateTags = () => {
        TagsService
            .getTags(user)
            .then(tags => {
                setTags(tags)
            })
    }

    useEffect(() => {
        updateTags()
    }, [])

    const handleCreateTag = () => {
        if (!newTag.label) {
            alert("Tag needs a label")
            return
        }
        console.log("creating", JSON.stringify(newTag));
        TagsService.addTag(user, newTag)
            .then(() => {
                setNewTag(intitialNewTagState)
                updateTags()
            })
            .catch(error => {
                alert(error)
            })
    }

    const handleClearTags = () => {
        TagsService.clearTags(user).then(() => {
            updateTags()
        })
    }

    return (
        <View>
            <Tags tags={tags} />
            <Button title="New" onPress={() => setShowNewForm(!showNewForm)} />

            {showNewForm && <View>
                <TextInput
                    placeholder="Label"
                    value={newTag.label}
                    onChangeText={text => {
                        setNewTag({
                            ...newTag,
                            label: text
                        })
                    }}
                />
                <TextInput
                    placeholder="Description"
                    value={newTag.description}
                    onChangeText={text => {
                        setNewTag({
                            ...newTag,
                            description: text
                        })
                    }}
                />
                <Button title="Create" onPress={() => handleCreateTag()} />
            </View>}

            <Button title="Clear All" onPress={() => handleClearTags()} />
        </View>
    )
}
