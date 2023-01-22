import { View } from "react-native"

export const Center = ({ children, style, ...props }) => {
    return <View style={[{
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }, style]} {...props}>
        {children}
    </View>
}