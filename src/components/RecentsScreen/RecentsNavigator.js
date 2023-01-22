import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditImageScreen } from "./EditImageScreen";
import { RecentsScreen } from "./RecentsScreen";


const Stack = createNativeStackNavigator();

export const RecentsNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            hideOnKeyboard: true
        }}>
            <Stack.Screen
                name="All"
                options={{ headerShown: false }}
                component={RecentsScreen}
            />
            <Stack.Screen
                name="Edit"
                options={{ headerShown: true }}
                component={EditImageScreen}
            />
        </Stack.Navigator>
    )
}