import { createContext, useState} from "react"; 
export const AuthContext = createContext();
export function AuthProvider({ children }) {
    const [ user, setUser] = useState(null);
    const [token, setToken]= useState (
        localStorage.getItem("token")
    );
    
    function loginUser(data) {
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    }

    function logoutUser() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{user, token, loginUser, logoutUser}}
        >
        {children}
        </AuthContext.Provider>
    );
}
