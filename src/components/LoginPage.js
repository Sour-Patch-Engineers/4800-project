// src/components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            
            // Store token correctly in localStorage
            const token = response.data.token;
            localStorage.setItem('token', `Bearer ${token}`); // Fixed storage issue
            onLoginSuccess();
            navigate('/');
        } catch (error) {
            alert('Invalid login credentials');
        }
    };
    
    
    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Login</h2>
            
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            
            {/* Styled Login Button */}
            <button onClick={handleLogin} style={styles.loginButton}>
                Login
            </button>

            {/* New Register Section with Styled Link */}
            <p style={styles.registerText}>Don't have an account?</p>
            <Link to="/register">
                <button style={styles.registerButton}>Create an Account</button>
            </Link>
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
    loginButton: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '10px',
        transition: 'background 0.3s ease',
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
    },
    registerText: {
        marginTop: '15px',
    }
};

export default LoginPage;
