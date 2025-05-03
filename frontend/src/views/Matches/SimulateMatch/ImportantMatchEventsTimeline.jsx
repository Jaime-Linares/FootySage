import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import goalImage from '../../../assets/images/important_events/goal.png';
import highXGImage from '../../../assets/images/important_events/high_xG.png';
import substitutionImage from '../../../assets/images/important_events/substitution.png';
import ownGoalImage from '../../../assets/images/important_events/own_goal.png';
import penaltyImage from '../../../assets/images/important_events/penalty.png';
import redCardImage from '../../../assets/images/important_events/red_card.png';
import yellowCardImage from '../../../assets/images/important_events/yellow_card.png';
import secondYellowCardImage from '../../../assets/images/important_events/second_yellow_card.png';
import goalkeeperImage from '../../../assets/images/important_events/goalkeeper.png';
import badBehaviourImage from '../../../assets/images/important_events/bad_behaviour.png';
import goalAssistImage from '../../../assets/images/important_events/goal_assist.png';
import defaultImage from '../../../assets/images/important_events/default.png';
import './styles/ImportantMatchEventsTimeline.css';


const getEventImageName = (event) => {
    const { type, outcome, card, penalty } = event;
    if (type === 'Shot' && outcome === 'Goal') return goalImage;
    if (type === 'Shot' && outcome !== 'Goal') return highXGImage;
    if (type === 'Substitution') return substitutionImage;
    if (type === 'Own Goal Against') return ownGoalImage;
    if (type === 'Foul Won' && penalty === true) return penaltyImage;
    if (type === 'Foul Committed') {
        if (card === 'Red Card') return redCardImage;
        if (card === 'Yellow Card') return yellowCardImage;
        if (card === 'Second Yellow Card') return secondYellowCardImage;
    }
    if (type === 'Goal Keeper') return goalkeeperImage;
    if (type === 'Bad Behaviour') return badBehaviourImage;
    if (type === 'Pass') return goalAssistImage;
    return defaultImage;
};

const ImportantMatchEventsTimeline = ({ homeTeam }) => {
    const { accessToken } = useAuth();
    const { match_id } = useParams();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchImportantEvents = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/match/important_events/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { statsbomb_id: match_id },
                });
                console.log('Important events:', res.data);
                setEvents(res.data);
            } catch (error) {
                console.error('Error fetching important events:', error);
            }
        };
        if (accessToken) fetchImportantEvents();
    }, [accessToken, match_id]);

    return (
        <div className="important-events-container">
            <div className="timeline-scroll">
                <div className="timeline-line" />
                {events.map((event, index) => (
                    <div
                        className={`timeline-event ${event.team === homeTeam ? 'above' : 'below'}`}
                        key={index}
                    >
                        <div className={`event-minute ${event.team === homeTeam ? 'above' : 'below'}`}>{event.minute}'</div>
                        <div className="event-box">
                            <img
                                className="event-icon"
                                src={getEventImageName(event)}
                                alt={event.type}
                            />
                            {event.type === 'Bad Behaviour' && event.card && (
                                <img
                                    className="event-icon"
                                    src={
                                        event.card === 'Red Card'
                                            ? redCardImage
                                            : event.card === 'Yellow Card'
                                                ? yellowCardImage
                                                : event.card === 'Second Yellow Card'
                                                    ? secondYellowCardImage
                                                    : defaultImage
                                    }
                                    alt={event.card}
                                />
                            )}
                            {!event.replacement &&
                                <div className="event-text">
                                    <strong>{event.player_name || event.team}</strong>
                                </div>
                            }
                            {event.replacement &&
                                <div className="event-text">
                                    {event.replacement && <strong>{event.replacement}</strong>}<br />
                                    <span>{event.player_name}</span>
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default ImportantMatchEventsTimeline;
