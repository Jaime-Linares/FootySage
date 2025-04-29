import React from 'react';


export const getGraphExplanation = () => (
  <div style={{ fontSize: '16px', lineHeight: '1.8' }}>
    <h2 style={{ fontSize: '20px', marginBottom: '12px', textAlign: 'center', fontWeight: '800' }}>
      ¿Qué significa cada gráfico?
    </h2>

    <ul style={{ paddingLeft: '20px' }}>
      <li>
        <strong>Resumen del aporte de las características a la predicción (SHAP):</strong> muestra cómo influyeron las características más relevantes
        en la predicción del modelo para este partido en concreto.
        <ul style={{ paddingLeft: '20px' }}>
          <li>El eje Y muestra las características más influyentes.</li>
          <li>El eje X muestra el impacto de cada característica (valor SHAP absoluto).</li>
          <li>El color indica si el impacto fue positivo 🟩 (favorece esa predicción) o negativo 🟥 (la penaliza).</li>
          <li>Al pasar el ratón se muestra también el valor concreto de esa característica en el partido.</li>
        </ul>
      </li>
      <br />
      <li>
        <strong>Comparación de características entre equipos:</strong> permite comparar una estadística concreta entre el equipo local y el visitante
        en este partido.
        <ul style={{ paddingLeft: '20px' }}>
          <li>Se muestra un gráfico de sectores con el valor correspondiente a cada equipo.</li>
          <li>Los valores representan directamente la cantidad observada en el partido (por ejemplo, número de tiros totales).</li>
          <li>Sirve para entender qué equipo dominó más en una métrica específica.</li>
        </ul>
      </li>
    </ul>
  </div>
);
