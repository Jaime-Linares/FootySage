import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import FootballLogo from '../../components/FootballLogo';
import fieldImage from '../../assets/images/football_pitch_home.png';
import './styles/Home.css';


const Home = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [latestMatches, setLatestMatches] = useState([]);
  const [favoriteMatches, setFavoriteMatches] = useState([]);
  const [topAnalyzedMatches, setTopAnalyzedMatches] = useState([]);

  useEffect(() => {
    if (!user || !accessToken) return;

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.user_id}/favorite_teams/`, config)
      .then(res => setFavoriteTeams(res.data))
      .catch(() => {});

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.user_id}/latest_matches_for_analyze_favorite_teams/`, config)
      .then(res => setLatestMatches(res.data))
      .catch(() => {});

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.user_id}/favorite_matches/`, config)
      .then(res => setFavoriteMatches(res.data))
      .catch(() => {});

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.user_id}/top_analyzed_matches/`, config)
      .then(res => setTopAnalyzedMatches(res.data))
      .catch(() => {});
  }, [user, accessToken]);

  const renderMatchCarousel = (title, matches) => {
    return (
      <div className="carousel-section">
        <h3>{title}</h3>
        <div className="carousel-wrapper">
          <button className="arrow-button">◀</button>
          <div className="carousel-content">
            {matches.map((match, index) => (
              <div
                key={index}
                className="match-card"
                onClick={() => navigate(`/match/${match.id}`)}
              >
                <p>{match.home_team} vs {match.away_team}</p>
                <img src={fieldImage} alt="campo" className="field-img" />
                <p>Fecha: {new Date(match.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <button className="arrow-button">▶</button>
        </div>
      </div>
    );
  };

  return (
    <div className="home-page fade-in">
      <header className="home-header">
        <Logo variant="footysage_black" width="70px" style={{ marginRight: "40px" }} />
        <h1>FootySage</h1>
        <Logo variant="footysage_black" width="70px" style={{ marginLeft: "40px" }} />
      </header>

      <section className="welcome-section">
        <p>¡¡ Bienvenido <strong style={{ fontWeight: "700" }}>{user?.username}</strong> !!</p>
        <div className="team-logos">
          {favoriteTeams.map((team, index) => (
            <FootballLogo key={index} src={team.football_crest_url} width="60px" height="60px" />
          ))}
        </div>
      </section>

      {renderMatchCarousel('Últimos partidos de tus equipos favoritos ⚽', latestMatches)}
      {renderMatchCarousel('Tus partidos favoritos ⭐', favoriteMatches)}
      {renderMatchCarousel('Tus partidos más analizados 🔥', topAnalyzedMatches)}
    </div>
  );
};


export default Home;
