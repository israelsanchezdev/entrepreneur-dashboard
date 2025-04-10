import React, { createContext, useContext, useState, useEffect } from 'react';

const EntrepreneurContext = createContext();

export const EntrepreneurProvider = ({ children }) => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('entrepreneurs');
    if (stored) {
      setEntrepreneurs(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('entrepreneurs', JSON.stringify(entrepreneurs));
  }, [entrepreneurs]);

  const addEntrepreneur = (data) => {
    setEntrepreneurs((prev) => [...prev, { id: Date.now(), ...data }]);
  };

  const updateEntrepreneur = (id, updatedData) => {
    setEntrepreneurs((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
    );
  };

  const deleteEntrepreneur = (id) => {
    setEntrepreneurs((prev) => prev.filter((e) => e.id !== id));
  };

  const getEntrepreneur = (id) => {
    return entrepreneurs.find((e) => e.id === id);
  };

  return (
    <EntrepreneurContext.Provider
      value={{
        entrepreneurs,
        addEntrepreneur,
        updateEntrepreneur,
        deleteEntrepreneur,
        getEntrepreneur,
      }}
    >
      {children}
    </EntrepreneurContext.Provider>
  );
};

export const useEntrepreneurs = () => useContext(EntrepreneurContext);
