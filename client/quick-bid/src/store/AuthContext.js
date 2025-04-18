import { useState, createContext } from 'react'


export const AuthContext = createContext({
    user: {},
    setUser: () => { },
    accessToken: null,
    csrftoken: null,
    setAccessToken: () => { },
    setCSRFToken: () => { },
    loggedIn: null,
    setLoggedIn: () => { },
})

export default AuthContext
