import { useTheme } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';

export const PrimaryButton = ({ title, buttonStyle, textStyle, ...props }) => {
    const theme = useTheme()
    return <TouchableOpacity {...props} style={[{
        height: "100%",
        width: "100%",
        color: theme.colors.primary,
        backgroundColor: theme.colors.primary,
        paddingTop: 5,
        paddingRight: 15,
        paddingBottom: 5,
        paddingLeft: 15,
        borderRadius: 2,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }, buttonStyle || {}]}>
        <Text
            style={[{
                color: theme.colors.text,
                fontSize: 17,
                fontWeight: "500",
            }, textStyle || {}]}
        >{title?.toUpperCase()}</Text>
    </TouchableOpacity>;
}