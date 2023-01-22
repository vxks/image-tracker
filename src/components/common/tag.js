import { useTheme } from '@react-navigation/native'
import { Text, TouchableOpacity, View } from "react-native"

export const Tag = ({ tag, isActive, onPress, ...props }) => {
    const theme = useTheme()

    const onActive = [
        {
            transform: [
                {
                    scale: isActive ? 1.1 : 1
                }
            ]
        },
        {
            backgroundColor: isActive ? theme.colors.primary : theme.colors.card,
        }
    ]

    return <TouchableOpacity
        style={[{
            alignItems: "center",
            backgroundColor: theme.colors.card,
            minWidth: 100,
            minHeight: 50,
            padding: 10,
            marginLeft: 5,
            marginRight: 5,
            borderRadius: 40,
        }, ...onActive, props.style && props.style]}
        onPress={onPress}
    >
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Text style={{ color: theme.colors.text }}>{tag.label}</Text>
        </View>
    </TouchableOpacity>
}