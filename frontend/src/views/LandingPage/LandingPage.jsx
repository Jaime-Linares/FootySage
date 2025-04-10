import React from 'react';
import CustomButton from '../../components/CustomButton';
import landingIllustration from '../../assets/images/landing_illustration.png';
import './styles/LandingPage.css';


const LandingPage = () => {
    return (
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
    );
};


export default LandingPage;
