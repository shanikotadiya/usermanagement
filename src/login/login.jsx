import React, { useState } from "react";
import '../style.css';
import { useNavigate } from "react-router-dom";


const LoginApp = () => {

    const [state, setstate] = useState({
        username: '',
        password: ''
    })
    const navigate = useNavigate();

    const handleChange = (event) => {

        const target = event.target;
        setstate({
            ...state,
            [target.name]: target.value
        })
    }

    const handlelogin = async (e) => {
        e.preventDefault();
        try {
            const responce = await fetch('http://localhost:5001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state)
            })
            const data = await responce.json();
            if (data.status === 200) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('currentuser',JSON.stringify(data.data));
                navigate('/')
                
            }
            else{
                alert('Aunthication failed');
            }
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div className="body">
            <div className="login-box">
                <h2>login app</h2>
                <div className="input-items">
                    <input type="text" name="username" placeholder="username" onChange={handleChange} />
                    <input type="password" name="password" placeholder="password" onChange={handleChange} />
                    <a href="forgotpassword" className="forgotpassword"> Forgot Password</a>
                </div>
                <button className="login-button" onClick={handlelogin}>Login</button>
                <div className="reg-login-route">
                    <label className="reg-login-label">if you not have an account <a href="/Registrean"> registrean </a>here</label>
                </div>
            </div>
        </div>
    )
};
export default LoginApp;