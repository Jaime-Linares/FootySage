import React, { useState } from 'react';
import Logo from './Logo';
import CustomModal from './CustomModal';
import { FaGithub } from 'react-icons/fa';


const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const footerStyle = {
    backgroundColor: 'var(--color-green)',
    color: '#fff',
    fontFamily: 'var(--font-family-base-footer)',
    fontSize: '14px',
    padding: '2px 0',
    width: '100%',
    marginTop: '40px',
  };

  const contentWrapper = {
    display: 'flex',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%',
  };

  const leftStyle = {
    maxWidth: '120px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    marginRight: '150px',
  };

  const centerStyle = {
    minWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1,
    fontSize: '16px',
  };

  const rightStyle = {
    maxWidth: '130px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    gap: '10px',
    marginLeft: '150px',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'underline',
    cursor: 'pointer',
    margin: '0 5px',
  };

  const getIconStyle = (key) => ({
    width: '40px',
    height: '40px',
    objectFit: 'contain',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    transform: hoveredIcon === key ? 'scale(1.1)' : 'scale(1)',
  });

  return (
    <>
      <div style={footerStyle}>
        <div style={contentWrapper}>
          <div style={leftStyle}>
            <a href="https://statsbomb.com/es/" target="_blank" rel="noopener noreferrer">
              <Logo variant="statsbomb_white" width="175px" height="auto" />
            </a>
          </div>

          <div style={centerStyle}>
            <p style={{ margin: 0 }}>© 2025 FootySage – Todos los derechos reservados</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={linkStyle} onClick={() => setShowTerms(true)}>
                Términos y condiciones de uso
              </span>
              <span style={{ margin: '0 5px' }}>·</span>
              <a href="mailto:info.footysage@gmail.com" style={linkStyle}>
                info.footysage@gmail.com
              </a>
            </div>
          </div>

          <div style={rightStyle}>
            <a
              href="https://github.com/Jaime-Linares/FootySage"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIcon('github')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <FaGithub
                style={getIconStyle('github')}
                size={35}
                color="#fff"
              />
            </a>
          </div>
        </div>
      </div>

      <CustomModal isOpen={showTerms} onClose={() => setShowTerms(false)} width="800px" >
        <h2 style={{ marginTop: 15, textAlign: "center" }}>Términos y condiciones de uso</h2>
        <p>
          Bienvenido a <strong style={{color: "var(--color-green)"}}>FootySage</strong>. Al acceder y utilizar esta aplicación web, declaras que has leído, entendido y 
          aceptado estos términos y condiciones. Si no estás de acuerdo con alguno de ellos, por favor, abstente de utilizar la plataforma.
        </p>
        <h3>1. Información general</h3>
        <p>
          <strong style={{color: "var(--color-green)"}}>FootySage</strong> es una aplicación web que proporciona herramientas de análisis estadístico, simulación de partidos 
          de fútbol, visualizaciones dinámicas e información sobre competiciones. El uso de esta plataforma está destinado exclusivamente a fines informativos, educativos y recreativos.
        </p>
        <h3>2. Acceso y uso de la plataforma</h3>
        <p>
          El acceso a <strong style={{color: "var(--color-green)"}}>FootySage</strong> es gratuito. Algunas funcionalidades requieren registro mediante una cuenta de usuario. 
          Como usuario, te comprometes a proporcionar información veraz y a mantenerla actualizada. Está prohibido el uso indebido del sitio, incluyendo accesos no 
          autorizados, alteración del contenido o interrupción del funcionamiento del sistema.
        </p>
        <h3>3. Propiedad intelectual e industrial</h3>
        <p>
          Todo el contenido presente en la aplicación, incluyendo pero no limitado a textos, gráficos, logos, simulaciones, código fuente y diseño visual, es propiedad 
          intelectual de <strong style={{color: "var(--color-green)"}}>FootySage</strong> o cuenta con las licencias correspondientes para su uso. Las marcas comerciales 
          como <strong>StatsBomb</strong> pertenecen a sus respectivos propietarios y son utilizadas únicamente con fines de visualización o integración de datos.
        </p>
        <h3>4. Datos de terceros y limitaciones</h3>
        <p>
          <strong style={{color: "var(--color-green)"}}>FootySage</strong> se nutre de datos proporcionados por fuentes externas (como APIs deportivas y proveedores de datos 
          como StatsBomb). No garantizamos la precisión, integridad o actualización de los datos en tiempo real. El uso de estos datos es exclusivamente bajo la responsabilidad 
          del usuario.
        </p>
        <h3>5. Privacidad y protección de datos</h3>
        <p>
          La aplicación recoge información básica del usuario como nombre, apellidos, correo electrónico, avatar y preferencias de equipos. Esta información se almacena de 
          forma segura y no será compartida con terceros sin consentimiento expreso. No se recoge ningún dato financiero ni de carácter especialmente sensible.
        </p>
        <p>
          Puedes solicitar la eliminación de tu cuenta y de todos tus datos personales en cualquier momento escribiendo a nuestro correo de contacto.
        </p>
        <h3>6. Responsabilidad</h3>
        <p>
          <strong style={{color: "var(--color-green)"}}>FootySage</strong> no se responsabiliza de los errores derivados del uso incorrecto de la aplicación, ni de los perjuicios causados por una interpretación errónea de 
          los análisis, simulaciones o predicciones. El usuario asume toda la responsabilidad por el uso de la información ofrecida.
        </p>
        <h3>7. Cambios y actualizaciones</h3>
        <p>
          Nos reservamos el derecho de modificar estos términos y condiciones sin previo aviso. Cualquier modificación significativa será comunicada dentro de la aplicación. 
          El uso continuado de la plataforma implica la aceptación de dichas modificaciones.
        </p>
        <h3>8. Jurisdicción y legislación aplicable</h3>
        <p>
          Estos términos se rigen por la legislación española. En caso de conflicto, ambas partes se someterán a los tribunales de Sevilla (España), salvo disposición legal 
          en contrario.
        </p>
        <h3>9. Contacto</h3>
        <p>
          Si tienes cualquier duda, sugerencia o incidencia relacionada con el uso de la plataforma, puedes escribirnos a: <a href="mailto:info.footysage@gmail.com">info.footysage@gmail.com</a>
        </p>
      </CustomModal>
    </>
  );
};


export default Footer;
