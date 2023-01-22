import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
    FlatList, Image, ScrollView, TouchableOpacity, View
} from 'react-native';
import { AuthContext } from '../../context/context';
import { PrimaryButton } from "../common/buttons";
import { Tag } from '../common/tag';
import * as ItemsService from "./../../service/ItemsService";
import * as TagsService from "./../../service/TagsService";
import * as MediaUtils from "./../../utils/MediaUtils";

export const RecentsScreen = () => {

    const [assets, setAssets] = useState([])
    const [items, setItems] = useState([])
    const [tags, setTags] = useState([])
    const [activeTagIds, setActiveTagIds] = useState([])
    const [loading, setLoading] = useState(true)

    const taggedItems = items.filter((i: ItemsService.Item) => activeTagIds.every(tagId => i.tagIds.includes(tagId)))
    const userAssets = assets.filter(a => items.map(i => i.assetId).includes(a.id))
    const taggedAssets = activeTagIds.length > 0
        ? userAssets.filter(a => taggedItems.map(i => i.assetId).includes(a.id))
        : userAssets

    const navigation = useNavigation()

    const { user } = useContext(AuthContext)

    useEffect(() => {
        TagsService.getTags(user).then(setTags)
    }, [])

    useEffect(() => {
        fetchItemsAssets()
    }, [])

    return <View
        style={{
            opacity: loading ? 0.5 : 1
        }}
    >
        <View
            style={{
                maxHeight: 150
            }}
        >
            <View
                style={{
                    height: 50
                }}
            >
                <PrimaryButton
                    title="Refresh"
                    onPress={() => fetchItemsAssets()}
                />
            </View>

            <ScrollView
                horizontal={true}
                contentContainerStyle={{
                    margin: 10,
                }}
            >
                {
                    tags.map((tag) => {
                        const isActive = activeTagIds.includes(tag.id)
                        return <Tag
                            key={tag.id}
                            tag={tag}
                            isActive={isActive}
                            onPress={() => {
                                isActive ? unapplyTag(tag.id) : applyTag(tag.id)
                            }}
                        />

                    })
                }
            </ScrollView>
        </View>

        <FlatList
            data={taggedAssets}
            renderItem={({ item }) => renderAsset(item)}
            numColumns={4}
        />
    </View>

    function fetchItemsAssets() {
        setLoading(true)
        ItemsService.getItems(user)
            .then(items => {
                setItems(items)
                return fetchAssets()
            })
            .then(() => setLoading(false))
    }

    function fetchAssets() {
        MediaUtils.getAssets(20)
            .then(ass => {
                // console.log("ass", ass)
                setAssets(ass)
            })
    }

    function renderAsset(asset) {
        const { id, filename } = asset

        const maybeItem = items.find(i => i.assetId === id)
        const maybeTagIds = maybeItem?.tagIds || []
        const name = maybeItem?.name || filename
        const maybeImageTags = tags.filter(t => maybeTagIds && maybeTagIds.includes(t.id))

        return <View
            style={{
                maxWidth: "23%",
                margin: 2
            }}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate("Edit", {
                    item: maybeItem,
                    allTags: tags,
                })}
            >
                <Image
                    source={{ uri: asset.uri }}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                        borderRadius: 21,
                    }}
                />
            </TouchableOpacity>
        </View>
    }

    /**
     * Only searches 50 recent items
     * 
     * @param {*} tagId 
     */
    function applyTag(tagId) {
        setActiveTagIds([...activeTagIds, tagId])
    }

    function unapplyTag(tagId) {
        setActiveTagIds(activeTagIds.filter(id => id !== tagId))
    }
}