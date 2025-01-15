// src/components/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        email: ''
    });
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!formData.name || !formData.username || !formData.password || !formData.email) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/register', formData);
            alert('Registration successful!');
            navigate('/login');
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Create an Account</h2>

            {/* Name Field */}
            <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
            />

            {/* Username Field */}
            <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                style={styles.input}
            />

            {/* Password Field */}
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={styles.input}
            />

            {/* Email Field */}
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={styles.input}
            />

            {/* Register Button */}
            <button onClick={handleRegister} style={styles.registerButton}>
                Register
            </button>

            {/* Link to Login Page */}
            <p style={styles.redirectText}>Already have an account?</p>
            <button 
                onClick={() => navigate('/login')} 
                style={styles.loginButton}
            >
                Go to Login
            </button>
        </div>
    );
}

// CSS-in-JS Styling Object
const styles = {
    container: {
        maxWidth: '400px',
        margin: '100px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    },
    input: {
        width: '90%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '16px',
    },
    registerButton: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#28a745',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
        marginBottom: '10px',
    },
    loginButton: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
    },
    redirectText: {
        marginTop: '15px',
        fontSize: '16px',
    }
};

export default RegisterPage;
