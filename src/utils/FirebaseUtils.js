// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyDk5gyUZgiQzm67vDuW6-sB69v5KhbX9-k",
//     authDomain: "tracktor-2c38b.firebaseapp.com",
//     databaseURL: 'https://tracktor-2c38b.firebaseio.com',
//     projectId: "tracktor-2c38b",
//     storageBucket: "tracktor-2c38b.appspot.com",
//     messagingSenderId: "325744909198",
//     appId: "1:325744909198:web:bd5c831877e19b58f422df"
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// const provider = new GoogleAuthProvider();

// const auth = getAuth(firebaseApp);


// export const signInWithGoogle = () => {
//     signInWithPopup(auth, provider)
//         .then((result) => {
//             // This gives you a Google Access Token. You can use it to access the Google API.
//             const credential = GoogleAuthProvider.credentialFromResult(result);
//             const token = credential.accessToken;
//             // The signed-in user info.
//             const user = result.user;
//             console.debug(user)
//             return user;
//             // ...
//         })
//         .catch((error) => {
//             // Handle Errors here.
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // The email of the user's account used.
//             const email = error.customData.email;
//             // The AuthCredential type that was used.
//             const credential = GoogleAuthProvider.credentialFromError(error);
//             // ...
//         });
// }