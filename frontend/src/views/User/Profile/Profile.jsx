import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import MessageBanner from '../../../components/MessageBanner';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import CustomSelectDropdown from '../../../components/CustomSelectDropdown';
import AvatarUnknown from '../../../assets/images/players/unknown.png';
import './styles/Profile.css';


const Profile = () => {
    const { user, accessToken } = useAuth();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        favorite_teams: [],
    });
    const [teams, setTeams] = useState([]);
    const [message, setMessage] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);

    const getAvatarImage = (avatarName) => {
        try {
            return require(`../../../assets/images/players/${avatarName}`);
        } catch {
            return AvatarUnknown;
        }
    };

    const showMessage = (msg, type = 'info') => {
        setMessage({ message: msg, type });
        setTimeout(() => setMessage({ message: '', type: '' }), 2000);
    };

    useEffect(() => {
        const fetchProfileAndTeams = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${accessToken}` }
                };
                // cargamos todos los equipos
                const teamsRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/teams/`, config);
                const formattedTeams = teamsRes.data.map(t => ({
                    label: t.name,
                    value: t.id.toString(),
                    image: t.football_crest_url
                }));
                setTeams(formattedTeams);
                // cargamos los datos del perfil
                const profileRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.id}/profile/`, config);
                const profile = profileRes.data;
                setForm((prev) => ({
                    ...prev,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    username: profile.username,
                    email: profile.email
                }));
                // cargamos los equipos favoritos
                const favRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.id}/favorite_teams/`, config);
                const selected = favRes.data.map(t => ({
                    label: t.name,
                    value: t.id.toString(),
                    image: t.football_crest_url
                }));
                setForm((prev) => ({
                    ...prev,
                    favorite_teams: selected
                }));
                setIsLoading(false);
            } catch {
                showMessage('Error al cargar datos del perfil', 'error');
                setTimeout(() => window.location.reload(), 1000);
            }
        };

        fetchProfileAndTeams();
    }, [user.id, accessToken]);


    const handleInputChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleTeamChange = (selected) => {
        setForm({ ...form, favorite_teams: selected });
    };

    const handleSave = async () => {
        const emptyField = Object.entries(form)
            .filter(([key]) => key !== 'favorite_teams')
            .find(([_, value]) => typeof value === 'string' && value.trim() === '');
        if (emptyField) {
            showMessage('Por favor, rellena todos los campos', 'error');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            showMessage('Introduce un correo electrónico válido', 'error');
            return;
        }
        if (form.favorite_teams.length === 0) {
            showMessage('Selecciona al menos un equipo favorito', 'error');
            return;
        }

        try {
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.id}/profile/`, {
                first_name: form.first_name,
                last_name: form.last_name,
                username: form.username,
                email: form.email,
                favorite_teams: form.favorite_teams.map(t => parseInt(t.value))
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            showMessage('Perfil actualizado correctamente', 'success');
        } catch (err) {
            const error = err.response?.data;
            const firstError = typeof error === 'object'
                ? Object.values(error).flat()[0]
                : 'Error al actualizar el perfil';
            showMessage(firstError, 'error');
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    return (
        <div className="profile-container profile-fade-in">
            <h2 className="profile-title">Mi perfil</h2>
            <MessageBanner message={message.message} type={message.type} />

            {isLoading && <p className="profile-loading">Cargando perfil...</p>}

            {!isLoading &&
                <div className="profile-card-row">
                    <div className="profile-main-info">
                        <div className="profile-left">
                            <img
                                src={getAvatarImage(user.avatar_name || 'unknown.png')}
                                alt="Avatar"
                                className="profile-avatar"
                            />
                        </div>

                        <div className="profile-right">
                            <div className="profile-row">
                                <div className="profile-column">
                                    <label className="profile-label">Nombre</label>
                                    <CustomTextInput
                                        value={form.first_name}
                                        onChange={handleInputChange('first_name')}
                                        placeholder="Nombre"
                                        style={{ textAlign: 'center' }}
                                    />
                                </div>
                                <div className="profile-column">
                                    <label className="profile-label">Apellidos</label>
                                    <CustomTextInput
                                        value={form.last_name}
                                        onChange={handleInputChange('last_name')}
                                        placeholder="Apellidos"
                                        style={{ textAlign: 'center' }}
                                    />
                                </div>
                            </div>

                            <div className="profile-row">
                                <div className="profile-column">
                                    <label className="profile-label">Username</label>
                                    <CustomTextInput
                                        value={form.username}
                                        onChange={handleInputChange('username')}
                                        placeholder="Username"
                                        style={{ textAlign: 'center' }}
                                    />
                                </div>
                                <div className="profile-column">
                                    <label className="profile-label">Correo electrónico</label>
                                    <CustomTextInput
                                        value={form.email}
                                        onChange={handleInputChange('email')}
                                        placeholder="Correo electrónico"
                                        style={{ textAlign: 'center' }}
                                    />
                                </div>
                            </div>

                            <div className="profile-teams">
                                <label className="profile-label">Equipos favoritos</label>
                                <CustomSelectDropdown
                                    options={teams}
                                    multi={true}
                                    onChange={handleTeamChange}
                                    placeholder="Selecciona equipos"
                                    style={{ width: '70%', margin: '0 auto' }}
                                    value={form.favorite_teams}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="profile-buttons">
                        <CustomButton
                            title="Eliminar cuenta"
                            onPress={() => { }}
                            color="var(--color-error)"
                        />
                        <CustomButton
                            title="Cambiar contraseña"
                            onPress={() => { }}
                            color="var(--color-info)"
                        />
                        <CustomButton
                            title="Guardar cambios"
                            onPress={handleSave}
                        />
                    </div>
                </div>
            }
        </div>
    );
};


export default Profile;
