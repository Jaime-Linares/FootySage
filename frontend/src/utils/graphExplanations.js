import React from 'react';


export const getGraphExplanation = () => (
    <div style={{ fontSize: '15px', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '12px', textAlign: 'center' }}>¿Qué significa cada gráfico?</h2>

        <ul style={{ paddingLeft: '20px' }}>
            <li>
                <strong>Influencia global de las características:</strong> muestra cómo cada variable influye en el resultado general del modelo.
                <ul>
                    <li> En los modelos de <strong>La Liga</strong>, <strong>Premier League</strong> y <strong>Serie A</strong>, se representan los <strong>coeficientes</strong> asociados a cada característica para cada clase (victoria local, empate, victoria visitante).</li>
                    <ul style={{ paddingLeft: '20px' }}>
                        <li> Valores positivos 🟩: favorecen la predicción de esa clase.</li>
                        <li> Valores negativos 🟥: penalizan esa clase.</li>
                    </ul>
                    <li> En modelos de <strong>Ligue 1</strong>, <strong>1. Bundesliga</strong> y <strong>Las cinco grandes ligas</strong>, se muestra la <strong>importancia relativa</strong> de cada variable sin dirección 🔵, es decir, sin saber si favorece o penaliza, solo cuánto pesa.</li>
                    <ul style={{ paddingLeft: '20px' }}>
                        <li>Este tipo de gráfico es útil para entender qué variables impactan más en las predicciones de manera general.</li>
                    </ul>
                </ul>
            </li>
            <li>
                <strong>[Futuro] Influencia local con SHAP:</strong> este gráfico mostrará cómo cada variable concreta afecta la predicción en un partido específico.
            </li>
            <li>
                <strong>[Futuro] Comparativa entre ligas:</strong> representará cómo varía una misma característica en importancia según la competición.
            </li>
        </ul>
    </div>
);


export const getFeatureExplanation = () => (
    <div style={{ fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '12px', textAlign: 'center' }}>¿Qué significa cada característica?</h2>

        <p>Estas son todas las características utilizadas:  (x = home o away)</p>

        <ul>
            <li><strong>total_shots_x:</strong> Número de tiros totales realizados por el equipo.</li>
            <li><strong>shots_on_target_ratio_x:</strong> Ratio de tiros que fueron a puerta respecto al total de ese equipo.</li>
            <li><strong>average_shot_on_target_distance_x:</strong> Distancia media desde donde se ejecutaron los tiros a puerta.</li>
            <li><strong>shots_high_xG_x:</strong> Número de tiros con un valor xG (calculado por StatsBomb) mayor a 0.2.</li>
            <li><strong>shots_inside_area_x:</strong> Número de tiros realizados dentro del área.</li>
            <li><strong>shots_inside_area_ratio_x:</strong> Proporción de tiros que fueron dentro del área por ese equipo.</li>
            <li><strong>shots_foot_x:</strong> Tiros realizados con el pie (cualquier pierna).</li>
            <li><strong>shots_head_x:</strong> Tiros realizados con la cabeza.</li>
            <li><strong>shots_other_x:</strong> Tiros realizados con otra parte del cuerpo (tronco, rodilla...).</li>

            <li><strong>total_passes_x:</strong> Total de pases completados por el equipo.</li>
            <li><strong>pass_success_ratio_x:</strong> Porcentaje de pases completados con éxito.</li>
            <li><strong>key_passes_x:</strong> Pases que generaron una ocasión de gol clara.</li>
            <li><strong>passes_needed_to_make_a_shot_x:</strong> Promedio de pases necesarios para generar un disparo.</li>
            <li><strong>cross_x:</strong> Número de centros al área.</li>
            <li><strong>cross_success_ratio_x:</strong> Porcentaje de centros completados con éxito.</li>
            <li><strong>corners_x:</strong> Número de saques de esquina realizados.</li>

            <li><strong>interceptions_won_x:</strong> Intercepciones exitosas realizadas.</li>
            <li><strong>recoveries_x:</strong> Balones recuperados tras pérdida rival.</li>
            <li><strong>blocks_x:</strong> Disparos o pases bloqueados por el equipo.</li>
            <li><strong>duels_won_x:</strong> Duelos ganados en enfrentamientos uno contra uno.</li>
            <li><strong>tackles_x:</strong> Entradas realizadas.</li>
            <li><strong>tackles_success_ratio_x:</strong> Porcentaje de entradas exitosas.</li>
            <li><strong>fouls_committed_x:</strong> Faltas cometidas por el equipo.</li>
            <li><strong>50_50_won_x:</strong> Duelos por balón dividido ganados.</li>
            <li><strong>clearance_x:</strong> Despejes realizados.</li>
            <li><strong>penaltys_committed_x:</strong> Penaltis cometidos.</li>
            <li><strong>key_errors_x:</strong> Errores que provocaron ocasiones claras o goles.</li>
            <li><strong>miscontrol_x:</strong> Pérdidas de posesión por mal control.</li>
            <li><strong>yellow_cards_x:</strong> Tarjetas amarillas recibidas.</li>
            <li><strong>red_cards_x:</strong> Tarjetas rojas recibidas.</li>

            <li><strong>pressures_x:</strong> Presiones defensivas ejercidas sobre el rival.</li>
            <li><strong>counterpress_x:</strong> Presiones tras pérdida.</li>
            <li><strong>pressures_in_attacking_third_x:</strong> Presiones en el tercio ofensivo del campo.</li>

            <li><strong>offside_x:</strong> Veces que el equipo cayó en fuera de juego.</li>
            <li><strong>dribbles_x:</strong> Regates intentados.</li>
            <li><strong>dribbles_success_ratio_x:</strong> Porcentaje de regates exitosos.</li>
            <li><strong>injuries_substitution_x:</strong> Cambios realizados por lesión.</li>
            <li><strong>players_off_x:</strong> Jugadores retirados del campo sin sustitución.</li>
            <li><strong>dispossessed_x:</strong> Pérdidas de balón por presión rival.</li>
            <li><strong>counterattacks_x:</strong> Contraataques iniciados.</li>
            <li><strong>possession_percentage_x:</strong> Porcentaje de posesión del equipo.</li>

            <li><strong>recoveries_attacking_third_x:</strong> Recuperaciones en el tercio ofensivo.</li>
            <li><strong>recoveries_middle_third_x:</strong> Recuperaciones en el tercio medio.</li>
            <li><strong>recoveries_defensive_third_x:</strong> Recuperaciones en el tercio defensivo.</li>

            <li><strong>shots_under_pressure_x:</strong> Tiros ejecutados bajo presión defensiva.</li>
            <li><strong>shots_without_pressure_inside_area_x:</strong> Tiros en el área sin presión rival.</li>
            <li><strong>passes_under_pressure_x:</strong> Pases realizados bajo presión.</li>
            <li><strong>passes_without_pressure_inside_area_x:</strong> Pases dentro del área sin presión.</li>

            <li><strong>set_piece_shots_x:</strong> Tiros generados desde jugadas a balón parado.</li>
            <li><strong>set_piece_shots_inside_area_x:</strong> Tiros dentro del área tras balón parado.</li>
            <li><strong>set_piece_shots_on_target_ratio_x:</strong> Porcentaje de tiros a puerta desde balón parado.</li>

            <li><strong>substitutions_x:</strong> Sustituciones totales.</li>
            <li><strong>tactical_substitutions_x:</strong> Sustituciones realizadas por decisión táctica.</li>
            <li><strong>tactical_changes_x:</strong> Cambios tácticos realizados durante el partido.</li>
            <li><strong>formation_changes_x:</strong> Cambios de formación durante el encuentro.</li>

            <li><strong>last_3_matches_form_x:</strong> Forma en los últimos 3 partidos (formato 3|1|0).</li>
            <li><strong>is_valid_last_3_matches_form_x:</strong> Si la variable anterior tiene valor válido (booleano).</li>
            <li><strong>win_rate_last_5_matches_x:</strong> Porcentaje de victorias en los últimos 5 partidos.</li>
            <li><strong>is_valid_win_rate_last_5_matches_x:</strong> Indicador de validez para esa métrica.</li>

            <li><strong>win_last_home_match_home_team:</strong> El equipo local ganó su último partido en casa (boolean).</li>
            <li><strong>is_valid_win_last_home_match_home_team:</strong> Indicador de si ese dato es válido.</li>
            <li><strong>win_last_away_match_away_team:</strong> El visitante ganó su último fuera de casa (boolean).</li>
            <li><strong>is_valid_win_last_away_match_away_team:</strong> Validez de la variable anterior.</li>

            <li><strong>goals_conceded_last_match_x:</strong> Goles encajados en el último partido.</li>
            <li><strong>is_valid_goals_conceded_last_match_x:</strong> Validez de ese dato.</li>
            <li><strong>goals_scored_last_match_x:</strong> Goles marcados en el último partido.</li>
            <li><strong>is_valid_goals_scored_last_match_x:</strong> Validez de ese dato.</li>

            <li><strong>std_shots_last_3_matches_x:</strong> Desviación estándar de tiros en los últimos 3 partidos.</li>
            <li><strong>is_valid_std_shots_last_3_matches_x:</strong> Si es válida la desviación anterior.</li>

            <li><strong>percentage_total_shots_home:</strong> Porcentaje de tiros totales realizados por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_shots_high_xG_home:</strong> Porcentaje de tiros con alto xG (mayor a 0.2) del equipo local respecto al total del partido.</li>
            <li><strong>percentage_shots_inside_area_home:</strong> Porcentaje de tiros dentro del área del equipo local respecto al total del partido.</li>
            <li><strong>percentage_shots_foot_home:</strong> Porcentaje de tiros realizados con el pie por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_shots_head_home:</strong> Porcentaje de tiros realizados con la cabeza por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_shots_other_home:</strong> Porcentaje de tiros realizados con otra parte del cuerpo por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_total_passes_home:</strong> Porcentaje de pases realizados por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_key_passes_home:</strong> Porcentaje de pases clave realizados por el equipo local respecto al total del partido.</li>
            <li><strong>difference_passes_needed_to_make_a_shot_home:</strong> Diferencia de pases necesarios para realizar un disparo entre el equipo local y el visitante.</li>
            <li><strong>percentage_corners_home:</strong> Porcentaje de corners sacados por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_blocks_home:</strong> Porcentaje de bloqueos realizados por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_interceptions_won_home:</strong> Porcentaje de intercepciones exitosas del equipo local respecto al total del partido.</li>
            <li><strong>percentage_tackles_home:</strong> Porcentaje de entradas realizadas por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_clearance_home:</strong> Porcentaje de despejes realizados por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_50_50_won_home:</strong> Porcentaje de duelos por balones divididos ganados por el equipo local respecto al total.</li>
            <li><strong>percentage_fouls_committed_home:</strong> Porcentaje de faltas cometidas por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_penaltys_committed_home:</strong> Porcentaje de penaltis cometidos por el equipo local respecto al total.</li>
            <li><strong>percentage_key_errors_home:</strong> Porcentaje de errores clave cometidos por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_miscontrol_home:</strong> Porcentaje de pérdidas por mal control del equipo local respecto al total del partido.</li>
            <li><strong>percentage_duels_won_home:</strong> Porcentaje de duelos ganados por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_yellow_cards_home:</strong> Porcentaje de tarjetas amarillas del equipo local respecto al total del partido.</li>
            <li><strong>percentage_red_cards_home:</strong> Porcentaje de tarjetas rojas del equipo local respecto al total del partido.</li>
            <li><strong>percentage_pressures_home:</strong> Porcentaje de presiones realizadas por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_counterpress_home:</strong> Porcentaje de presiones inmediatas tras pérdida del equipo local respecto al total del partido.</li>
            <li><strong>percentage_pressures_in_attacking_third_home:</strong> Porcentaje de presiones realizadas por el equipo local en el tercio ofensivo respecto al total del partido.</li>
            <li><strong>percentage_offsides_home:</strong> Porcentaje de fueras de juego en los que cayó el equipo local respecto al total del partido.</li>
            <li><strong>percentage_dribbles_home:</strong> Porcentaje de regates intentados por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_injury_substitutions_home:</strong> Porcentaje de sustituciones por lesión del equipo local respecto al total del partido.</li>
            <li><strong>percentage_players_off_home:</strong> Porcentaje de jugadores que abandonaron el campo sin sustitución del equipo local respecto al total del partido.</li>
            <li><strong>percentage_dispossessed_home:</strong> Porcentaje de pérdidas de balón del equipo local respecto al total del partido.</li>
            <li><strong>percentage_counterattacks_home:</strong> Porcentaje de contraataques realizados por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_recoveries_home:</strong> Porcentaje de recuperaciones de balón totales del equipo local.</li>
            <li><strong>percentage_recoveries_attacking_third_home:</strong> Porcentaje de recuperaciones en el tercio ofensivo por parte del equipo local respecto al total del partido.</li>
            <li><strong>percentage_recoveries_middle_third_home:</strong> Porcentaje de recuperaciones en el tercio medio por parte del equipo local respecto al total del partido.</li>
            <li><strong>percentage_recoveries_defensive_third_home:</strong> Porcentaje de recuperaciones en el tercio defensivo por parte del equipo local respecto al total del partido.</li>
            <li><strong>percentage_shots_under_pressure_home:</strong> Porcentaje de tiros realizados bajo presión por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_shots_inside_area_under_pressure_home:</strong> Porcentaje de tiros dentro del área bajo presión por parte del equipo local respecto al total del partido.</li>
            <li><strong>percentage_shots_without_pressure_inside_area_home:</strong> Porcentaje de tiros dentro del área sin presión por parte del equipo local respecto al total del partido.</li>
            <li><strong>percentage_passes_under_pressure_home:</strong> Porcentaje de pases realizados bajo presión por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_passes_inside_area_under_pressure_home:</strong> Porcentaje de pases dentro del área bajo presión por parte del equipo local respecto al total del partido.</li>
            <li><strong>percentage_passes_without_pressure_inside_area_home:</strong> Porcentaje de pases dentro del área sin presión por parte del equipo local respecto al total del partido.</li>
            <li><strong>percentage_set_piece_shots_home:</strong> Porcentaje de tiros generados desde jugadas a balón parado por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_set_piece_shots_inside_area_home:</strong> Porcentaje de tiros dentro del área desde balón parado por parte del equipo local respecto al total del partido.</li>
            <li><strong>percentage_set_piece_shots_on_target_ratio_home:</strong> Porcentaje de tiros a puerta generados desde jugadas a balón parado por el equipo local.</li>
            <li><strong>percentage_substitutions_home:</strong> Porcentaje de sustituciones realizadas por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_tactical_substitutions_home:</strong> Porcentaje de sustituciones por decisión táctica del equipo local respecto al total del partido.</li>
            <li><strong>percentage_tactical_changes_home:</strong> Porcentaje de cambios tácticos realizados por el equipo local respecto al total del partido.</li>
            <li><strong>percentage_formation_changes_home:</strong> Porcentaje de cambios de formación realizados por el equipo local respecto al total del partido.</li>
        </ul>
    </div>
);