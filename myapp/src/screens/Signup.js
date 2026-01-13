import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
export default function Signup() {
    const [credentials, setcredentials] = useState({ name: "", email: "", password: "", geolocation: "" })
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, location: credentials.geolocation })
        });
        const json = await response.json()
        console.log(json);
        if (!json.success) {
            alert("Enter valid credentials")
        }
        else{
            alert("Account created");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    }
    const onChange = (event) => {
        setcredentials({ ...credentials, [event.target.name]: event.target.value })
    }
    return (
        <>
        <div><Navbar/></div>
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "500px" }}>
                    <h3 className="mb-4 text-center">Create Account</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" placeholder="Enter name" name='name' value={credentials.name} onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} id="exampleInputPassword1" placeholder="Password" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputAddress">Address</label>
                            <input type="text" className="form-control" name='geolocation' value={credentials.geolocation} onChange={onChange} />
                        </div>
                        <button type="submit" className="m-3 btn btn-success">Submit</button>
                        <Link to="/login" className='m-3 btn btn-danger'>Already a user</Link>
                    </form>
                </div>
            </div>
        </>
    )
}
