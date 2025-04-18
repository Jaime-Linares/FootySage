import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import MessageBanner from '../../../components/MessageBanner';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import CustomSelectDropdown from '../../../components/CustomSelectDropdown';
import CustomModal from '../../../components/CustomModal';
import './styles/Profile.css';


const Profile = () => {
    const navigate = useNavigate();

    const { user, accessToken, setUser, logout } = useAuth();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        favorite_teams: [],
        avatar_name: 'unknown.png',
    });
    const [originalForm, setOriginalForm] = useState(null);
    const [teams, setTeams] = useState([]);
    const [message, setMessage] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // importamos dinámicamente todos los avatares
    const importAllAvatars = (r) => {
        let images = {};
        r.keys().forEach((key) => {
            const fileName = key.replace('./', '');
            images[fileName] = r(key);
        });
        return images;
    };

    const avatarImages = importAllAvatars(require.context('../../../assets/images/players', false, /\.(png|jpe?g|svg)$/));
    const availableAvatars = Object.keys(avatarImages);

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

                const teamsRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/teams/`, config);
                const formattedTeams = teamsRes.data.map(t => ({
                    label: t.name,
                    value: t.id.toString(),
                    image: t.football_crest_url
                }));
                setTeams(formattedTeams);

                const profileRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.id}/profile/`, config);
                const profile = profileRes.data;

                const favRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.id}/favorite_teams/`, config);
                const selected = favRes.data.map(t => ({
                    label: t.name,
                    value: t.id.toString(),
                    image: t.football_crest_url
                }));

                const fullProfile = {
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    username: profile.username,
                    email: profile.email,
                    favorite_teams: selected,
                    avatar_name: profile.avatar_name || 'unknown.png',
                };

                setForm(fullProfile);
                setOriginalForm(fullProfile);
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

    const hasChanges = () => {
        if (!originalForm) return false;

        const isSameString = (a, b) => a.trim() === b.trim();

        const sameFields =
            isSameString(form.first_name, originalForm.first_name) &&
            isSameString(form.last_name, originalForm.last_name) &&
            isSameString(form.username, originalForm.username) &&
            isSameString(form.email, originalForm.email) &&
            form.avatar_name === originalForm.avatar_name;

        const currentTeamIds = form.favorite_teams.map(t => t.value).sort();
        const originalTeamIds = originalForm.favorite_teams.map(t => t.value).sort();
        const sameTeams = JSON.stringify(currentTeamIds) === JSON.stringify(originalTeamIds);

        return !(sameFields && sameTeams); // cambiado a ! para que devuelva true si hay cambios
    };

    const handleSave = async () => {
        if (originalForm) {
            const isSameString = (a, b) => a.trim() === b.trim();
            const sameFields =
                isSameString(form.first_name, originalForm.first_name) &&
                isSameString(form.last_name, originalForm.last_name) &&
                isSameString(form.username, originalForm.username) &&
                isSameString(form.email, originalForm.email) &&
                form.avatar_name === originalForm.avatar_name;

            const currentTeamIds = form.favorite_teams.map(t => t.value).sort();
            const originalTeamIds = originalForm.favorite_teams.map(t => t.value).sort();
            const sameTeams = JSON.stringify(currentTeamIds) === JSON.stringify(originalTeamIds);

            if (sameFields && sameTeams) {
                showMessage('No se han realizado cambios', 'info');
                return;
            }
        }

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
                avatar_name: form.avatar_name,
                favorite_teams: form.favorite_teams.map(t => parseInt(t.value))
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            setUser(prev => ({
                ...prev,
                username: form.username,
                email: form.email,
                avatar_name: form.avatar_name
            }));

            setOriginalForm({ ...form });

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

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.id}/delete/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            showMessage('Cuenta eliminada correctamente', 'success');
            setTimeout(() => {
                logout();
                navigate('/');
            }, 1500);
        } catch (err) {
            showMessage('Error al eliminar la cuenta', 'error');
        }
    };

    return (
        <>
            <div className="profile-container profile-fade-in">
                <h2 className="profile-title">Mi perfil</h2>
                <MessageBanner message={message.message} type={message.type} />

                {isLoading && <p className="profile-loading">Cargando perfil...</p>}

                {!isLoading &&
                    <div className="profile-card-row">
                        <div className="profile-main-info">
                            <div className="profile-left">
                                <img
                                    src={avatarImages[form.avatar_name] || avatarImages['unknown.png']}
                                    alt="Avatar"
                                    className="profile-avatar"
                                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                    style={{ cursor: 'pointer' }}
                                />
                                {showAvatarPicker && (
                                    <div className="avatar-picker">
                                        {availableAvatars.map((imgName) => (
                                            <img
                                                key={imgName}
                                                src={avatarImages[imgName]}
                                                alt={imgName}
                                                className={`avatar-option ${form.avatar_name === imgName ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setForm(prev => ({ ...prev, avatar_name: imgName }));
                                                    setShowAvatarPicker(false);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
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
                                onPress={() => setShowDeleteModal(true)}
                                color="var(--color-error)"
                                textStyle={{ color: 'white', fontWeight: 'bold', fontSize: '17px' }}
                            />
                            <CustomButton
                                title="Cambiar contraseña"
                                onPress={() => navigate('/change_password')}
                                color="var(--color-info)"
                                textStyle={{ color: 'white', fontWeight: 'bold', fontSize: '17px' }}
                            />
                            <CustomButton
                                title="Guardar cambios"
                                onPress={handleSave}
                                disabled={!hasChanges()}
                                textStyle={{ color: 'white', fontWeight: 'bold', fontSize: '17px' }}
                            />
                        </div>
                    </div>
                }
            </div>
            <CustomModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <h3 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
                    ¿Estás seguro de que deseas eliminar tu cuenta?
                </h3>
                <p style={{ textAlign: 'center', marginBottom: '25px' }}>
                    Esta acción no se puede deshacer. Tu perfil y toda tu información se eliminarán permanentemente.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <CustomButton
                        title="Cancelar"
                        onPress={() => setShowDeleteModal(false)}
                        color="#bbb"
                        textStyle={{ color: '#333' }}
                        buttonStyle={{ borderRadius: '8px' }}
                    />
                    <CustomButton
                        title="Sí, eliminar cuenta"
                        onPress={() => {
                            setShowDeleteModal(false);
                            handleDeleteUser();
                        }}
                        color="var(--color-error)"
                        buttonStyle={{ borderRadius: '8px' }}
                    />
                </div>
            </CustomModal>
        </>
    );
};


export default Profile;
