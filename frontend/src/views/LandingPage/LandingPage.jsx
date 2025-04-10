import React from 'react';
import CustomButton from '../../components/CustomButton';
import landingIllustration from '../../assets/images/landing_illustration.png';
import calendarLogo from '../../assets/images/calendar.png';
import clockLogo from '../../assets/images/clock.png';
import profileLogo from '../../assets/images/profile.png';
import graphLogo from '../../assets/images/graph.png';
import FeatureCard from './FeatureCard';
import './styles/LandingPage.css';


const LandingPage = () => {
  return (
    <div className="landing-fade-in">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>FootySage, el sabio del fútbol</h1>
            <p>
              Analiza competiciones y partidos, simula encuentros en tiempo real y
              predice el equipo ganador como nunca antes lo habías visto con IA.
            </p>
            <p>
              Domina el juego con análisis visuales, datos en tiempo real y estadísticas avanzadas.
            </p>
            <CustomButton
              title="Ver demo"
              onPress={() => console.log('Demo clicked')}
              buttonStyle={{ marginTop: '22px', fontSize: '20px', padding: '13px 30px', borderRadius: '40px' }}
              textStyle={{ fontSize: '20px' }}
            />
          </div>
          <div className="hero-image">
            <img src={landingIllustration} alt="IA fútbol análisis" />
          </div>
        </div>
      </section>
      <section className="features-section">
        <h2 className="features-title">Todo el fútbol bajo tu control</h2>
        <div className="features-grid">
          <FeatureCard
            icon={graphLogo}
            title="Análisis de ligas y partidos"
            description="Compara equipos, partidos y competiciones con gráficos interactivos"
          />
          <FeatureCard
            icon={clockLogo}
            title="Simulación en tiempo real"
            description="Sigue un partido simulado minuto a minuto, con eventos, alineaciones y mucha más información"
          />
          <FeatureCard
            icon={calendarLogo}
            title="Próximos partidos"
            description="Mantente al día con la fecha, hora y localización de los próximos partidos"
          />
          <FeatureCard
            icon={profileLogo}
            title="Tu perfil personalizado"
            description="Recibe información personalizada de los análisis de tu equipo favorito"
          />
        </div>
      </section>
      <section className="cta-section">
        <h2 className="cta-title">¿Estás listo para ver el fútbol como nunca antes?</h2>
        <p className="cta-subtitle">Únete gratis y empieza a explorar la sabiduría del balón</p>
        <CustomButton
          title="Crear cuenta gratis"
          onPress={() => console.log('Crear cuenta')}
          buttonStyle={{
            marginTop: '5px',
            padding: '12px 28px',
            borderRadius: '999px',
          }}
          textStyle={{ fontSize: '18px' }}
        />
      </section>
    </div>
  );
};


export default LandingPage;
