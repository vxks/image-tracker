import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { AuthContext } from "./context";

export const AuthProvider = ({ auth, children }) => {
    const [user, setUser] = useState()

    //TODO: dev only
    useEffect(() => {
        !user && signIn("vxksoftware@gmail.com", "password");
    }, [])

    return (
        <AuthContext.Provider value={{
            user: user,
            signIn: signIn,
            signOut: signOut
        }}>
            {children}
        </AuthContext.Provider>
    )

    function signOut() {
        firebaseSignOut(auth).then(() => setUser(null))
    }

    function signIn(username, password) {
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.debug("signed in as", user.email)
                setUser(user)
            })
            .catch((error) => {
                alert("Unable to sign in with provided credentials")
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
            });
    }
}