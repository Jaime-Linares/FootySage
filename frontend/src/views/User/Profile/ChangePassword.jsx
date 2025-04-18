import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import MessageBanner from '../../../components/MessageBanner';
import './styles/ChangePassword.css';


const ChangePassword = () => {
    const navigate = useNavigate();

    const { accessToken, user } = useAuth();
    const [form, setForm] = useState({ new_password: '', new_password2: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

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
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.id}/change_password/`,
                {
                    new_password: form.new_password,
                    new_password2: form.new_password2
                },
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );
            setMessage({ text: 'Contraseña actualizada correctamente', type: 'success' });
            setForm({ new_password: '', new_password2: '' });
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            const error = err.response?.data;
            const firstError =
                typeof error === 'object' ? Object.values(error).flat()[0] : 'Error al cambiar la contraseña';
            setMessage({ text: firstError, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-container change-password-fade-in">
            <h2 className="change-password-title">Cambiar contraseña</h2>
            <MessageBanner message={message.text} type={message.type} />

            <form className="change-password-form" onSubmit={handleSubmit}>
                <label className="change-password-label">Introduce tu nueva contraseña</label>
                <CustomTextInput
                    placeholder="Nueva contraseña"
                    containerStyle={{ marginBottom: '15px' }}
                    style={{ textAlign: 'center' }}
                    showPasswordToggle={true}
                    value={form.new_password}
                    onChange={handleInputChange('new_password')}
                />

                <label className="change-password-label">Repite tu nueva contraseña</label>
                <CustomTextInput
                    placeholder="Repite la nueva contraseña"
                    containerStyle={{ marginBottom: '15px' }}
                    style={{ textAlign: 'center' }}
                    showPasswordToggle={true}
                    value={form.new_password2}
                    onChange={handleInputChange('new_password2')}
                />

                <CustomButton
                    title={loading ? 'Cargando...' : 'Confirmar'}
                    onPress={handleSubmit}
                    disabled={loading}
                    buttonStyle={{ width: '33%', marginTop: '25px', marginBottom: '35px' }}
                    textStyle={{ fontSize: '17px' }}
                />
            </form>
        </div>
    );
};


export default ChangePassword;
