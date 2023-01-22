import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { HomeScreen } from './src/components/HomeScreen';
import { LoginScreen } from './src/components/LoginScreen/LoginScreen';
import { NewItemScreen } from './src/components/NewItemScreen/NewItemScreen';
import { SignUpScreen } from './src/components/SignUpScreen/SignUpScreen';
import { TagsScreen } from './src/components/TagsScreen';
import { RecentsNavigator } from './src/components/RecentsScreen/RecentsNavigator';
import { firebaseConfig } from './src/config/firebase.js';
import { AuthContext } from './src/context/context';
import { AuthProvider } from './src/context/AuthProvider';
import { NewItemNavigator } from "./src/components/NewItemScreen/NewItemNavigator";
import { useContext } from 'react';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <AuthProvider auth={auth}>
      <TabNavigator />
    </AuthProvider>
  );
}

const TabNavigator = () => {

  const { user } = useContext(AuthContext)

  return (
    <NavigationContainer theme={BrightTheme}>
      <Tab.Navigator initialRouteName="Recents">
        <Tab.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
        {
          !!user &&
          <>
            <Tab.Screen name="Sign Up" component={SignUpScreen} />
            {/* <Tab.Screen name="Home" options={{ title: 'Tracktor' }} component={HomeScreen} /> */}
            {/* <Tab.Screen name="Tags" component={TagsScreen} /> */}
            {/* <Tab.Screen name="New Item" options={{ title: 'Tracktor' }} component={NewItemScreen} /> */}
            <Tab.Screen name="New Item" options={{ title: 'Tracktor' }} component={NewItemNavigator} />
            <Tab.Screen name="Recents" component={RecentsNavigator} />
          </>
        }
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const TracktorTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#6C4AB6",
    text: "#B9E0FF",
    // background: "#8D72E1",
    background: "#8D9EFF",
    // background: "white",
    // card: "#8D9EFF",
    card: "#8D72E1",
  }
}

const BrightTheme = {
  colors: {
    background: "#FFF8F3",
    primary: "#A3E4DB",
    secondary: "#1C6DD0",
    card: "#FED1EF",
    text: "#1C6DD0",
    textSecondary: "#0081B4",
  }
}