import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setuser, loading, setloading } = context


    const handleLogin = async ({ email, password }) => {
        setloading(true)
        try {
            const data = await login({ email, password })
            setuser(data.user)
            return data.user
        } catch (err) {
            setuser(null)
            throw err
        } finally {
            setloading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setloading(true)
        try {
            const data = await register({ username, email, password })
            setuser(data.user)
            return data.user
        } catch (err) {
            setuser(null)
            throw err
        } finally {
            setloading(false)
        }
    }

    const handleLogout = async () => {
        setloading(true)
        try {
            await logout()
            setuser(null)
            return true
        } catch (err) {
            throw err
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()

                if (data?.user) {
                    setuser(data.user)
                } else {
                    setuser(null)
                }
            } catch (err) {
                setuser(null)
            } finally {
                setloading(false)
            }
        }

        getAndSetUser()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}