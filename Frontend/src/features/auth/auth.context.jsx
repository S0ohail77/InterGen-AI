import { useState } from "react";
import { createContext } from "react";


export const AuthContext = createContext();

export const AuthProvider =({children})=>{
    const [user, setuser] = useState(null)

    const [loading, setloading] = useState(true)



    return (
        <AuthContext.Provider value={{user, setuser, loading, setloading}}>

            {children}

        </AuthContext.Provider>
    )
}
