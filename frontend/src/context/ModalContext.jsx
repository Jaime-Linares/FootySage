import React, { createContext, useContext, useState } from 'react';


const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showTerms, setShowTerms] = useState(false);

  const openTerms = () => setShowTerms(true);
  const closeTerms = () => setShowTerms(false);

  return (
    <ModalContext.Provider value={{ showTerms, openTerms, closeTerms }}>
      {children}
    </ModalContext.Provider>
  );
};


export const useModal = () => useContext(ModalContext);
