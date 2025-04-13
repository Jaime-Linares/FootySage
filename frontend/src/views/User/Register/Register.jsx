import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import CustomSelectDropdown from '../../../components/CustomSelectDropdown';
import MessageBanner from '../../../components/MessageBanner';
import { useAuth } from '../../../context/AuthContext';
import './styles/Register.css';


const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/teams/`);
        const formatted = res.data.map(team => ({
          label: team.name,
          value: team.id.toString(),
          image: team.football_crest_url,
        }));
        setTeams(formatted);
      } catch (err) {
        setMessage({ message: 'Error al cargar los equipos', type: 'error' });
      }
    };

    fetchTeams();
  }, []);

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleTeamChange = (selected) => {
    setFavoriteTeams(selected.map(team => team.value));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ message: '', type: '' });
    // validación: campos vacíos
    const emptyField = Object.entries(form).find(([key, value]) => value.trim() === '');
    if (emptyField) {
      setMessage({ message: 'Por favor, rellena todos los campos.', type: 'error' });
      return;
    }
    // validación: email con formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMessage({ message: 'Introduce un correo electrónico válido.', type: 'error' });
      return;
    }
    // validación: contraseñas coinciden
    if (form.password !== form.password2) {
      setMessage({ message: 'Las contraseñas no coinciden.', type: 'error' });
      return;
    }
    // validación: al menos un equipo favorito
    if (favoriteTeams.length === 0) {
      setMessage({ message: 'Selecciona al menos un equipo favorito.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/register/`, {
        ...form,
        favorite_teams: favoriteTeams,
      });
      const loginRes = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/login/`, {
        username: form.username,
        password: form.password,
      });
      const { access, refresh } = loginRes.data;
      login({ access, refresh });
      setMessage({ message: 'Registro exitoso. Redirigiendo...', type: 'success' });
      setTimeout(() => {
        navigate('/home');
      }, 1200);
    } catch (err) {
      const errors = err.response?.data;
      const firstError = typeof errors === 'object'
        ? Object.values(errors).flat()[0]
        : 'Error al registrarse. Inténtalo de nuevo.';
      setMessage({ message: firstError, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container register-fade-in">
      <h2 className="register-title">Crea tu cuenta</h2>
      <MessageBanner message={message.message} type={message.type} />

      <form className="register-form" onSubmit={handleRegister}>
        <div className="input-row">
          <div className="input-group">
            <label className="register-label">Introduce tu nombre</label>
            <CustomTextInput
              placeholder="Nombre"
              value={form.first_name}
              style={{ textAlign: 'center' }}
              onChange={handleInputChange('first_name')}
            />
          </div>
          <div className="input-group">
            <label className="register-label">Introduce tus apellidos</label>
            <CustomTextInput
              placeholder="Apellidos"
              value={form.last_name}
              style={{ textAlign: 'center' }}
              onChange={handleInputChange('last_name')}
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label className="register-label">Introduce tu username</label>
            <CustomTextInput
              placeholder="Username"
              value={form.username}
              style={{ textAlign: 'center' }}
              onChange={handleInputChange('username')}
            />
          </div>
          <div className="input-group">
            <label className="register-label">Introduce tu correo electrónico</label>
            <CustomTextInput
              placeholder="Correo electrónico"
              value={form.email}
              style={{ textAlign: 'center' }}
              onChange={handleInputChange('email')}
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label className="register-label">Introduce una contraseña</label>
            <CustomTextInput
              placeholder="Contraseña"
              value={form.password}
              style={{ textAlign: 'center' }}
              onChange={handleInputChange('password')}
              showPasswordToggle={true}
            />
          </div>
          <div className="input-group">
            <label className="register-label">Repite de nuevo la contraseña</label>
            <CustomTextInput
              placeholder="Repite la contraseña"
              value={form.password2}
              style={{ textAlign: 'center' }}
              onChange={handleInputChange('password2')}
              showPasswordToggle={true}
            />
          </div>
        </div>

        <label className="register-label">Selecciona tu/s equipo/s favorito/s</label>
        <CustomSelectDropdown
          options={teams}
          multi={true}
          onChange={handleTeamChange}
          placeholder="---"
          style={{ width: '50%', marginBottom: '15px', textAlign: 'center' }}
        />

        <CustomButton
          title={loading ? 'Cargando...' : 'Registrarse'}
          onPress={handleRegister}
          disabled={loading}
          buttonStyle={{ width: '15%', marginTop: '30px', marginBottom: '25px' }}
          textStyle={{ fontSize: '17px' }}
        />
      </form>

      <div className="login-links">
        <p>
          ¿Ya tienes una cuenta? <a href="/login">Pulsa aquí</a>
        </p>
      </div>
    </div>
  );
};


export default Register;
