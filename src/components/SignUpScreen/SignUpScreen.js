import { StatusBar } from 'expo-status-bar';
import { Button, TextInput, View } from 'react-native';

import { useContext, useState } from 'react';


// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from '../../context/context';


const createUser = (auth, email, password) => createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.debug(user);
        return user;
    })
    .catch((error) => {
        const inUse = "auth/email-already-in-use"
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error)
    });

export const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { auth } = useContext(AuthContext)

    const handleSignUp = () => {
        if (password.length < 6)
            alert("what are you thinking?! WEAK PASSWORD")

        createUser(auth, email, password)
            .then(user => console.log("user created", user.email))
            .then(() => {
                navigation.navigate("Home")
            })
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
            <View style={{
                margin: 5,
                padding: 2,
                minWidth: 100
            }}>
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
            </View>
            <View style={{
                margin: 5,
                padding: 2,
                minWidth: 100
            }}>
                <TextInput
                    secureTextEntry={true}
                    keyboardType="default"
                    autoCapitalize={'none'}
                    placeholder='Confirm Password'
                    textContentType={'password'}
                    autoCorrect={false}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View>

            <Button title="Sign Up" onPress={handleSignUp} />

            <StatusBar style="auto" />
        </View>
    );
}