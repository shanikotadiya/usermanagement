import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from '../componentpic/upload.png';
import axios from 'axios';



const Registrean = () => {

    const [Name, setName] = useState("");
    const [Username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [image, setimage] = useState(null);
    const navigate = useNavigate();

   


    const handleimagechange = (event) => {
        setimage(event.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if ((password === ConfirmPassword) && (password && ConfirmPassword != null)) {
                const formdata = new FormData();
                if (image) {
                    formdata.append('image', image)
                }
                formdata.append('name', Name);
                formdata.append('username', Username)
                formdata.append('password', password);
                
                axios.post('http://localhost:5001/users', formdata,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    }
                })
                    .then(res => {
                        console.log(res.data.message);
                    })
                    .catch(err => {
                        console.error('Upload error:', err);
                    });

                // const responce = await fetch('http://localhost:5000/users', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'multipart/form-data',
                //     },
                //     body: formdata
                // })

                // const result = await responce.json();
                // console.log(result);
                // if (result.status === 401) {
                    // alert("Username is already avaliable")
                // }
                // alert("Register Successfull");
                navigate('/login');

            }
            else {
                alert("input invalid")
            }
        } catch (error) {
            console.log('Error:', error);
        }


    };

    return (
        <div className="body">
            <form onSubmit={handleSubmit}>
                <div className="registrean-box">
                    <h2>Registration Box</h2>
                    <div className="profile-pic-upload">
                        <label htmlFor="profile-pic" className="profile-pic-label">
                            <img
                                src={image ? URL.createObjectURL(image) : img}
                                alt="Profile"
                                className="profile-pic"
                            />
                            <input
                                type="file"
                                id="profile-pic"
                                className="profile-pic-input"
                                onChange={handleimagechange}
                                accept="image/*"
                            />
                        </label>
                    </div>
                    <input type="text" placeholder="Name" onChange={(event) => setName(event.target.value)} />
                    <input type="text" placeholder="Username" onChange={(event) => setUsername(event.target.value)} />
                    <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
                    <input type="password" placeholder="Confirm Password" onChange={(event) => setConfirmPassword(event.target.value)} />
                    <button type="submit" value="submit">Submit</button>
                    <div className="reg-login-route">
                        <label className="reg-login-label"> if you have already an account <a href="/login">login</a> here</label>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Registrean;