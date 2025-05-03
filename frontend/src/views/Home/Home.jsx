import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import FootballLogo from '../../components/FootballLogo';
import MatchCarousel from './MatchCarousel';
import './styles/Home.css';


const Home = () => {
  const { user, accessToken } = useAuth();

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
      .catch(() => { });

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.user_id}/latest_matches_for_analyze_favorite_teams/`, config)
      .then(res => setLatestMatches(res.data))
      .catch(() => { });

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.user_id}/favorite_matches/`, config)
      .then(res => setFavoriteMatches(res.data))
      .catch(() => { });

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/${user.user_id}/top_analyzed_matches/`, config)
      .then(res => setTopAnalyzedMatches(res.data))
      .catch(() => { });
  }, [user, accessToken]);

  return (
    <div className="home-page fade-in">
      <header className="home-header">
        <Logo variant="footysage_black" width="70px" style={{ marginRight: "40px" }} />
        <h1>FootySage</h1>
        <Logo variant="footysage_black" width="70px" style={{ marginLeft: "40px" }} />
      </header>

      <section className="welcome-section">
        <p>¡¡ Bienvenido <strong style={{ fontWeight: "700" }}>{user?.username}</strong> !!</p>
        <div className="favorite-team-logos">
          {favoriteTeams.map((team, index) => (
            <FootballLogo key={index} src={team.football_crest_url} width="60px" height="60px" />
          ))}
        </div>
      </section>

      <section className="carousel-row">
        <MatchCarousel title="Último partido de tus equipos favoritos" matches={latestMatches} />
        <MatchCarousel title="Tus partidos favoritos" matches={favoriteMatches} />
        <MatchCarousel title="Tus tres partidos más analizados" matches={topAnalyzedMatches} />
      </section>
    </div>
  );
};


export default Home;
