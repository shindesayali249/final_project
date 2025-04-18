import axios from 'axios'

const baseURL = "http://127.0.0.1:8000/"

const AI = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

const AI2 = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export { AI, AI2 }
