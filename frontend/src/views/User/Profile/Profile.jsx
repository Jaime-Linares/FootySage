import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import MessageBanner from '../../../components/MessageBanner';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomButton from '../../../components/CustomButton';
import './styles/Profile.css';


const Profile = () => {
    const { user, accessToken } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [message, setMessage] = useState({ message: '', type: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.id}/profile/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setPerfil(res.data);
            } catch (err) {
                setMessage({ message: 'Error al cargar el perfil', type: 'error' });
            }
        };

        fetchProfile();
    }, [user.id, accessToken]);

    if (!perfil) return <p className="profile-loading">Cargando perfil...</p>;

    return (
        <div className="profile-container profile-fade-in">
            <h2 className="profile-title">Mi perfil</h2>
            <MessageBanner message={message.message} type={message.type} />

            <div className="profile-card-row">
                <div className="profile-left">
                    <img
                        src={require(`../../../assets/images/players/${perfil.avatar_name}`)}
                        alt="Avatar"
                        className="profile-avatar"
                    />
                </div>
                <div className="profile-right">
                    <div className="profile-row">
                        <div className="profile-column">
                            <label className="profile-label">Nombre</label>
                            <CustomTextInput
                                value={perfil.first_name}
                                onChange={() => { }}
                                placeholder="Nombre"
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                        <div className="profile-column">
                            <label className="profile-label">Apellidos</label>
                            <CustomTextInput
                                value={perfil.last_name}
                                onChange={() => { }}
                                placeholder="Apellidos"
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                    </div>

                    <div className="profile-row">
                        <div className="profile-column">
                            <label className="profile-label">Username</label>
                            <CustomTextInput
                                value={perfil.username}
                                onChange={() => { }}
                                placeholder="Username"
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                        <div className="profile-column">
                            <label className="profile-label">Correo electrónico</label>
                            <CustomTextInput
                                value={perfil.email}
                                onChange={() => { }}
                                placeholder="Correo electrónico"
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                    </div>

                    <div className="profile-teams">
                        <label className="profile-label">Equipos favoritos</label>
                        <div className="profile-teams-list">
                            {perfil.favorite_teams.map(team => (
                                <div key={team.id} className="profile-team">
                                    <img src={team.football_crest_url} alt={team.name} className="team-crest" />
                                    <span className="team-name">{team.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CustomButton title="Cambiar contraseña" onPress={() => { }} color="var(--color-blue-link)" />
                        <CustomButton title="Guardar cambios" onPress={() => { }} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Profile;
