import React, { useState } from 'react';
import axios from 'axios';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import MessageBanner from '../../../components/MessageBanner';
import './styles/Login.css';


const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field) => (e) => {
        setCredentials({ ...credentials, [field]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setLoading(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/login/`, credentials);
            const { access, refresh } = res.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            setMessage({ text: 'Inicio de sesión exitoso', type: 'success' });
            setTimeout(() => {
                window.location.href = '/home';
            }, 200);
        } catch (err) {
            setMessage({ text: 'Credenciales incorrectas. Inténtalo de nuevo', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container login-fade-in">
            <h2 className="login-title">Accede a tu cuenta</h2>
            <MessageBanner message={message.text} type={message.type} />

            <form className="login-form" onSubmit={handleLogin}>
                <label className="login-label">Introduce tu username o correo electrónico</label>
                <CustomTextInput
                    placeholder="Username o correo electrónico"
                    containerStyle={{ marginBottom: '15px' }}
                    style={{ textAlign: 'center' }}
                    showPasswordToggle={false}
                    value={credentials.username}
                    onChange={handleInputChange('username')}
                />

                <label className="login-label">Introduce tu contraseña</label>
                <CustomTextInput
                    placeholder="Contraseña"
                    containerStyle={{ marginBottom: '15px' }}
                    style={{ textAlign: 'center' }}
                    showPasswordToggle={true}
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                />

                <CustomButton
                    title={loading ? 'Cargando...' : 'Iniciar sesión'}
                    onPress={handleLogin}
                    disabled={loading}
                    buttonStyle={{ width: '33%', marginTop: '25px', marginBottom: '35px' }}
                    textStyle={{ fontSize: '17px' }}
                />
            </form>

            <div className="login-links">
                <p>
                    ¿Has olvidado tu contraseña? <a href="/recover_password">Pulsa aquí</a>
                </p>
                <p>
                    ¿Aún no tienes una cuenta? <a href="/register">Pulsa aquí</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
