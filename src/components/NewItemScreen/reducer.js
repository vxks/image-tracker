import { Tag } from '../../service/TagsService'
import * as MediaUtils from "../../utils/MediaUtils.js"
import * as ItemsService from '../../service/ItemsService'

export const ACTIONS = {
    SET_ALL_TAGS: "set_all_tags",
    ADD_TAG_TO_IMAGE: "add_tag",
    SET_NAME_FOR_IMAGE: "set_name_for_image",
    REMOVE_TAG_FROM_IMAGE: "remove_tag",
    ADD_IMAGES_TO_UPLOAD: "add_images_to_upload",
    REMOVE_IMAGE_TO_UPLOAD: "remove_image_to_upload",
    EDIT_IMAGE: "edit_image",
    CLEAR_ITEMS_TO_UPLOAD: "clear_items_to_upload",
}

export type ToUpload = {
    image: MediaUtils.ImageToUpload,
    tags: Tag[],
    isEdit: boolean
}

export type StateType = {
    toUpload: ToUpload[],
    tags: Tag[],
}

const intitialToUpload: ToUpload[] = []
const initialTags: Tag[] = []

export const initialState: StateType = {
    toUpload: intitialToUpload,
    tags: initialTags,
}

export const reducer = (state: StateType, action): StateType => {
    switch (action.type) {
        case ACTIONS.SET_ALL_TAGS:
            return setAllTags(state, action.payload);

        case ACTIONS.ADD_TAG_TO_IMAGE:
            return addTagToImage(state, action.payload);

        case ACTIONS.REMOVE_TAG_FROM_IMAGE:
            return removeTagFromImage(state, action.payload);

        case ACTIONS.ADD_IMAGES_TO_UPLOAD:
            return addImagesToUpload(state, action.payload);

        case ACTIONS.REMOVE_IMAGE_TO_UPLOAD:
            return removeImageToUpload(state, action.payload);

        case ACTIONS.EDIT_IMAGE:
            return editImage(state, action.payload);

        case ACTIONS.CLEAR_ITEMS_TO_UPLOAD:
            return clearItemsToUpload(state);

        case ACTIONS.SET_NAME_FOR_IMAGE:
            return setNameForImage(state, action.payload);

        default:
            throw new Error(`Unknown action type ${action.type}`);
    }
}

function setAllTags(state: StateType, payload): StateType {
    console.log(ACTIONS.SET_ALL_TAGS)
    const { tags } = payload
    if (!tags) throw new Error(`No tags field provided in payload`)
    return {
        ...state,
        tags: tags
    };
}

function setNameForImage(state: StateType, payload): StateType {
    console.log(ACTIONS.SET_NAME_FOR_IMAGE)

    const { assetId, name } = payload
    if (!assetId && (name == null || name == undefined))
        throw new Error("ACTIONS.ADD_TAG_TO_IMAGE needs both name value and assetId");

    const toUpload = state.toUpload.find(tu => tu.image.assetId === assetId)
    if (!toUpload) throw new Error(`No image to upload found with assetId=${assetId}`)

    const toUploadRemoved: ToUpload[] = state.toUpload.filter(tu => tu.image.assetId !== assetId)
    const newToUpload: ToUpload = {
        ...toUpload,
        image: {
            ...toUpload.image,
            name: name
        }
    }
    return {
        ...state,
        toUpload: [...toUploadRemoved, newToUpload]
    };
}

function addTagToImage(state: StateType, payload): StateType {
    console.log(ACTIONS.ADD_TAG_TO_IMAGE)
    const { tagId, assetId } = payload
    if (!(tagId && assetId)) throw new Error("ACTIONS.ADD_TAG_TO_IMAGE needs both tagId and assetId")
    const toUpload = state.toUpload.find(tu => tu.image.assetId === assetId)
    const tag = state.tags.find(t => t.id === tagId)
    if (!toUpload) throw new Error(`No image to upload found with assetId=${assetId}`)
    if (!tag) throw new Error(`No tag found with id=${tagId}`)
    const toUploadRemoved: ToUpload[] = state.toUpload.filter(tu => tu.image.assetId !== assetId)
    const newToUpload: ToUpload = {
        ...toUpload,
        tags: [...toUpload.tags, tag]
    }
    return {
        ...state,
        toUpload: [...toUploadRemoved, newToUpload]
    };
}

function removeTagFromImage(state: StateType, payload): StateType {
    console.log(ACTIONS.REMOVE_TAG_FROM_IMAGE)
    const { tagId, assetId } = payload
    if (!(tagId && assetId)) throw new Error("ACTIONS.REMOVE_TAG_FROM_IMAGE needs both tagId and assetId")
    const toUpload = state.toUpload.find(tu => tu.image.assetId === assetId)
    if (!toUpload) throw new Error(`No image to upload found with assetId=${assetId}`)
    const toUploadRemoved: ToUpload[] = state.toUpload.filter(tu => tu.image.assetId !== assetId)
    const newToUpload: ToUpload = {
        ...toUpload,
        tags: toUpload.tags.filter(t => t.id !== tagId)
    }
    return {
        ...state,
        toUpload: [...toUploadRemoved, newToUpload]
    };
}

function addImagesToUpload(state: StateType, payload): StateType {
    console.log(ACTIONS.ADD_IMAGES_TO_UPLOAD)
    if (!payload.images) throw new Error("No images provided to upload")
    const imagesToUpload: MediaUtils.ImageToUpload[] = payload.images
    const toUploads: ToUpload[] = imagesToUpload.map(itu => {
        return {
            image: itu,
            tags: [],
            isEdit: false
        }
    })
    return {
        ...state,
        toUpload: [...state.toUpload, ...toUploads]
    }
}

function removeImageToUpload(state: StateType, payload): StateType {
    console.log(ACTIONS.REMOVE_IMAGE_TO_UPLOAD)
    const { assetId } = payload
    if (!assetId) throw new Error("No assetId provided to remove image to upload")
    const toUploadsRemoved = state.toUpload.filter(tu => tu.image.assetId !== assetId)
    return {
        ...state,
        toUpload: toUploadsRemoved
    }
}

function editImage(state: StateType, payload): StateType {
    const { assetId, isEdit } = payload
    console.log(ACTIONS.EDIT_IMAGE + " for [assetId, isEdit]", assetId, isEdit)
    if (!(assetId && payload !== undefined)) throw new Error("assetId and isEdit fields need to be provided to toggle edit image to upload")
    const toUpload = state.toUpload.find(tu => tu.image.assetId === assetId)
    if (!toUpload) throw new Error(`No image to upload found with assetId=${assetId}`)
    const toUploadRemoved: ToUpload[] = state.toUpload.filter(tu => tu.image.assetId !== assetId)
    const newToUpload: ToUpload = {
        ...toUpload,
        isEdit: isEdit
    }
    return {
        ...state,
        toUpload: [...toUploadRemoved, newToUpload]
    };
}

function clearItemsToUpload(state: StateType): StateType {
    console.log(ACTIONS.CLEAR_ITEMS_TO_UPLOAD)

    return {
        ...state,
        toUpload: []
    };
}