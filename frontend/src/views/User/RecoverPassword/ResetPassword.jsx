import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import MessageBanner from '../../../components/MessageBanner';
import './styles/ResetPassword.css';


const ResetPassword = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({ new_password: '', new_password2: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!uid || !token) {
            setMessage({ text: 'El enlace no es válido.', type: 'error' });
        }
    }, [uid, token]);

    const handleInputChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!form.new_password || !form.new_password2) {
            setMessage({ text: 'Por favor, rellena ambos campos', type: 'error' });
            return;
        }

        if (form.new_password !== form.new_password2) {
            setMessage({ text: 'Las contraseñas no coinciden', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/password_reset/confirm/`, {
                uid,
                token,
                new_password: form.new_password,
            });
            setMessage({ text: 'Contraseña restablecida con éxito', type: 'success' });
            setForm({ new_password: '', new_password2: '' });
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const error = err.response?.data;
            const firstError =
                typeof error === 'object' ? Object.values(error).flat()[0] : 'Error al restablecer la contraseña';
            setMessage({ text: firstError, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container reset-password-fade-in">
            <h2 className="reset-password-title">Establecer nueva contraseña</h2>
            <MessageBanner message={message.text} type={message.type} />

            <form className="reset-password-form" onSubmit={handleSubmit}>
                <label className="reset-password-label">Introduce tu nueva contraseña</label>
                <CustomTextInput
                    placeholder="Nueva contraseña"
                    containerStyle={{ marginBottom: '15px' }}
                    style={{ textAlign: 'center' }}
                    showPasswordToggle={true}
                    value={form.new_password}
                    onChange={handleInputChange('new_password')}
                />

                <label className="reset-password-label">Repite tu nueva contraseña</label>
                <CustomTextInput
                    placeholder="Repite la nueva contraseña"
                    containerStyle={{ marginBottom: '15px' }}
                    style={{ textAlign: 'center' }}
                    showPasswordToggle={true}
                    value={form.new_password2}
                    onChange={handleInputChange('new_password2')}
                />

                <CustomButton
                    title={loading ? 'Guardando...' : 'Confirmar'}
                    onPress={handleSubmit}
                    disabled={loading}
                    buttonStyle={{ width: '33%', marginTop: '25px', marginBottom: '35px' }}
                    textStyle={{ fontSize: '17px' }}
                />
            </form>
        </div>
    );
};


export default ResetPassword;
