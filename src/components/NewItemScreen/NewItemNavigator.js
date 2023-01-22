import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NewItemScreen } from './NewItemScreen';
import { StageItemScreen } from './StageItemScreen';

const Stack = createNativeStackNavigator();

export const NewItemNavigator = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="New"
                options={{ headerShown: false }}
                component={NewItemScreen}
            />
            <Stack.Screen
                name="Stage"
                options={{ headerShown: false }}
                component={StageItemScreen}
            />
        </Stack.Navigator>
    )
}