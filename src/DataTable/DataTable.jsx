import React, { useState, useEffect } from "react";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Datatbl = () => {
    const [ReciveData, setReaciveData] = useState([]);
    // console.log(loginuser);

    const [loginuser, setloginuser] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        _id: '',
        name: '',
        username: '',
        profilelist: ''
    })
    const [image, setimage] = useState(null);
    const navigate = useNavigate();
    const update = event => {
        const { target } = event
        setState({
            ...state,
            [target.name]: target.value,
        })
    }
    const handleimagechange = (e) => {
        setimage(e.target.files[0])
    }


    const token = localStorage.getItem('token');

    const fetchData = async () => {


        try {
            setLoading(true)
            await fetch('http://localhost:5001/users', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token
                }
            })
                .then(response => {
                    if (!response.ok) {
                        navigate('/login');
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // setProfileData(data.data.profiledata);
                    setReaciveData(data.data.data);
                })
            setLoading(false)
        }

        catch (error) {
            console.log('Error:', error);
        }

    };


    const userprofile = async () => {
        const loginuser = JSON.parse(localStorage.getItem('currentuser'));
        setloginuser(loginuser);


        try {
            await fetch('http://localhost:5001/users/profileGet', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    currentuserid: loginuser.currentuserid
                }
            })
                .then(responce => {
                    if (!responce.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return responce.json();
                })
                .then(data => {
                    setImageUrl(imgurl(data.data.contentType, data.data.binarydata));
                })
        } catch (error) {
            console.error(error)
        }
    }
    const imgurl = (contentType, binarydata) => {
        if (contentType && binarydata) {
            return `data:${contentType};base64,${binarydata}`;

        }
    }
    useEffect(() => {
        fetchData();
        userprofile();
    }, []);

    const updatestate = (data) => {
        setimage(null);
        const { _id, name, username } = data
        const profilelist = data.profilelist[0]
        setState({ _id, name, username, profilelist })
    }
    const editdata = async () => {
        // localStorage.setItem
        const formData = new FormData();
        formData.append('image',image);
        formData.append('name', state.name);
        formData.append('username',state.username);

        const headers = {
            'Content-Type': 'multipart/form-data',
            'authorization': `${token}`, // Include any additional headers as needed
        };

        try {
            const response = await axios.put(`http://localhost:5001/users/${state._id}`, formData, {
                headers
            })

            if (response.status === 200) {
                
                fetchData()
                return
            }
            if (response.status === 401 || response.status === 400) {
                alert('Unauthorised User')
                navigate('/login')
                return
            }
        }

        catch (err) {
            console.error(err);

        }
    }

    const deletedata = async (id) => {
        try {
            const responce = await axios.delete(`http://localhost:5001/users/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                }
            })
            if (responce.status === 200) {
                fetchData()
                return
            }
            else if (responce.status === 400 || responce.status === 401) {
                alert('Unauthorised User')
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleDownload = () => {
        const data = ReciveData.map(row => {
            return [row.name, row.username].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + data.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'table-data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (loading ? <Loader /> :
        <div>
            <div className="nav">
                <div className="user-lable">
                    <div className="profile-pic-upload">
                        <label className="profile-pic-label">
                            <img
                                src={imageUrl}
                                alt="Profile"
                                className="profile-pic"
                            />
                        </label>
                    </div>
                    <label className="label">{loginuser.currentusername}</label>
                </div>
                <div className="table-nav d-flex justify-content-center align-items-center">
                    <h3>User-Data</h3>
                </div>
                <div className="table-nav-button">
                    <button type="button" onClick={handleDownload} >Download</button>
                    <button type="button" onClick={() => navigate('/login')}> Logout</button>
                </div>
            </div>
            <table className="table table-hover">
                <thead className="thead-light" >
                    <tr>
                        <th scope="col" className="text-center">No.</th>
                        <th scope="col" className="text-center">profilepic</th>
                        <th scope="col" className="text-center">id</th>
                        <th scope="col" className="text-center">Name</th>
                        <th scope="col" className="text-center">username</th>
                        <th scope="col" className="text-center">Edit</th>
                        <th scope="col" className="text-center">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {ReciveData.map((row, index) =>
                        <tr key={row._id}>
                            <th scope="row" className="text-center">{++index}</th>
                            <td className="text-center"><img src={imgurl(row.profilelist[0].contentType, row.profilelist[0].data)} alt="profileimg" className="profile-pic" /></td>
                            <td className="text-center">{row._id}</td>
                            <td className="text-center">{row.name}</td>
                            <td className="text-center">{row.username}</td>
                            <td className="text-center">
                                <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => updatestate(row)} >Edit</button>
                            </td>
                            <td className="text-center"><button type="button" onClick={() => deletedata(row._id)}>Delete</button></td>
                        </tr>)
                    }
                </tbody>
            </table>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Data</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="model-box">

                                <div className="profile-pic-upload">
                                    <label htmlFor="profile-pic" className="profile-pic-label">
                                        <img
                                            src={image ? URL.createObjectURL(image) : imgurl(state.profilelist.contentType, state.profilelist.data)}
                                            alt="Profile"
                                            className="profile-pic"
                                        />
                                        <input
                                            type="file"
                                            id="profile-pic"
                                            className="profile-pic-input"
                                            onChange={handleimagechange}
                                            accept="image/*"
                                            name="profilelist"
                                        />
                                    </label>
                                </div>
                                <input type="text" name="name" placeholder="Enter a Name" value={state.name || ''} onChange={update} />
                                <input type="text" name="username" placeholder="Enter a username" value={state.username || ''} onChange={update} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => { editdata() }}>Save</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Datatbl;
