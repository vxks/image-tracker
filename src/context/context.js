import { createContext, Context } from "react";

export const AuthContext = createContext({
    user: null,
    signIn: () => {},
    signOut: () => {}
});  