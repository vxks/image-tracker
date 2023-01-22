import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { AuthContext } from '../../context/context';
import * as MediaLibrary from 'expo-media-library';
import * as MediaUtils from '../../utils/MediaUtils';

export const LoginScreen = ({ navigation }) => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { user, signIn } = useContext(AuthContext)

    useEffect(() => {
        requestPermission().then(r => {
            if (!r.granted) {
                console.log("oops");
                return;
            }
        })

        MediaUtils.createAlbumIfNotExists()
    }, [])

    useEffect(() => {
        if (!!user) navigation.navigate("Recents")
    }, [user])

    const handleSignIn = () => {
        signIn(email, password)
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <TextInput
                keyboardType="email-address"
                autoCapitalize={'none'}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                secureTextEntry={true}
                keyboardType="default"
                autoCapitalize={'none'}
                placeholder='Password'
                textContentType={'password'}
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Sign In" onPress={handleSignIn} />

            <Button title="Sign Up" onPress={() => navigation.navigate("Sign Up")} />

            <StatusBar style="auto" />
        </View>
    );

}