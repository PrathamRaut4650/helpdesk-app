import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const navigate = useNavigate();
    const handleRegister = async (e)=>{
        e.preventDefault();
        try{
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/register`,
                {
                    username,
                    email,
                    password,
                }
            );
            console.log(response.data);
            alert("Regsitration successful.please login");
            navigate("/login");
        }catch(error){
            alert("Registration Failed")
        }
    };
    return(
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username</label>
                    <input 
                    type="text"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
export default Register