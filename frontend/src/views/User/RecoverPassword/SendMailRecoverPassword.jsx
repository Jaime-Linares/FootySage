import React, { useState } from 'react';
import axios from 'axios';
import CustomButton from '../../../components/CustomButton';
import CustomTextInput from '../../../components/CustomTextInput';
import MessageBanner from '../../../components/MessageBanner';
import './styles/SendMailRecoverPassword.css';


const SendMailRecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    if (!isValidEmail(email)) {
      setMessage({ text: 'Introduce un correo electrónico válido', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/password_reset/`, { email });
      setMessage({
        text: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.',
        type: 'success',
      });
    } catch (err) {
      setMessage({
        text: 'Error al enviar el correo. Intenta de nuevo más tarde.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-container">
      <h2 className="recover-title">Recuperar contraseña</h2>
      
      <MessageBanner message={message.text} type={message.type} />

      <p className="recover-text">
        Introduce el correo con el que te has registrado, te llegará un mensaje al correo para que
        te permita cambiar tu contraseña.<br />El correo puede tardar en llegar unos segundos.
      </p>

      <form className="recover-form" onSubmit={handleSubmit}>
        <CustomTextInput
          placeholder="ejemplo@gmail.com"
          containerStyle={{ marginBottom: '10px', marginTop: '30px' }}
          style={{ textAlign: 'center' }}
          showPasswordToggle={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CustomButton
          title={loading ? 'Enviando...' : 'Confirmar'}
          onPress={handleSubmit}
          disabled={loading || email.trim() === ''}
          buttonStyle={{ width: '33%', marginTop: '25px', marginBottom: '35px' }}
          textStyle={{ fontSize: '17px' }}
        />
      </form>
    </div>
  );
};


export default SendMailRecoverPassword;
