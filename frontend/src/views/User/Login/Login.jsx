import React, { useState } from 'react';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import axios from 'axios';
import './style/Login.css';


const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    setCredentials({ ...credentials, [field]: e.target.value });
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/login/', credentials);
      const { access, refresh } = res.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      window.location.href = '/home';
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Accede a tu cuenta</h2>

      <label className="login-label">Introduce tu username o correo electrónico</label>
      <CustomTextInput
        placeholder="Username o correo electrónico"
        containerStyle={{ marginBottom: '20px'}}
        style={{ textAlign: 'center' }}
        showPasswordToggle={false}
        value={credentials.username}
        onChange={handleInputChange('username')}
      />

      <label className="login-label">Introduce tu contraseña</label>
      <CustomTextInput
        placeholder="Contraseña"
        containerStyle={{ marginBottom: '20px' }}
        style={{ textAlign: 'center' }}
        showPasswordToggle={true}
        value={credentials.password}
        onChange={handleInputChange('password')}
      />

      {error && <p className="login-error">{error}</p>}

      <CustomButton
        title={loading ? 'Cargando...' : 'Iniciar sesión'}
        onPress={handleLogin}
        disabled={loading}
        buttonStyle={{ width: '33%', marginTop: '25px', marginBottom: '35px' }}
        textStyle={{ fontSize: '17px' }}
      />

      <div className="login-links">
        <p>
          ¿Has olvidado tu contraseña?{' '}
          <a href="/">Pulsa aquí</a>
        </p>
        <p>
          ¿Aún no tienes una cuenta?{' '}
          <a href="/">Pulsa aquí</a>
        </p>
      </div>
    </div>
  );
};


export default Login;
