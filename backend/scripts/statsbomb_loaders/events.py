# encoding:utf-8
from statsbombpy import sb
from django.db import transaction
from matches.models import Event, Match, Team

SUPPORTED_EVENT_TYPES = [choice[0] for choice in Event.EVENT_TYPES]


def create_events(match_id, match):
    '''
    Load and save events for a given match.
    params:
        match_id (int): The ID of the match to load events for.
        match (Match): The Match object to associate the events with.
    returns:
        None
    '''
    events_df = sb.events(match_id=match_id)
    events_df = events_df.sort_values(by=["index"])

    with transaction.atomic():
        for _, row in events_df.iterrows():
            event_type = row['type']
            if event_type not in SUPPORTED_EVENT_TYPES:
                continue
            try:
                save_event(row, match)
            except Exception as e:
                raise ValueError(f"Error en evento {row.get('id')} ({event_type}): {str(e)}")
    
    print(f"Eventos guardados para el partido {match_id}")


def save_event(row, match):
    '''
    Save a single event to the database.
    params:
        row (DataFrame): The row of the event to save.
        match (Match): The Match object to associate the event with.
    returns:
        None
    '''
    event_id = row['id']
    team = get_event_team(row)
    details = parse_event_details(row)
    representation = false      #TODO: add representation logic

    Event.objects.create(
        id=event_id,
        index=row['index'],
        minute=row['minute'],
        second=row['second'],
        period=row['period'],
        type=row['type'],
        match=match,
        team=team,
        details=details
    )


def get_event_team(row):
    '''
    Get the team associated with the event.
    params:
        row (DataFrame): The row of the event to get the team for.
    returns:
        Team: The Team object associated with the event.
    '''
    if 'team' in row:
        name = row.get('team')
        try:
            if name != None:
                return Team.objects.get(name=name)
            else:
                return None
        except Team.DoesNotExist:
            raise ValueError(f"Equipo '{name}' no encontrado.")
    return None


# --- PARSERS BY EVENT TYPE ----------------------------------------------------------------------
def parse_event_details(row):
    event_type = row['type']
    parser = EVENT_TYPE_PARSERS.get(event_type, default_event_parser)
    return parser(row)

def default_event_parser(row):
    raise NotImplementedError(f"No se ha implementado parser para el tipo de evento: {row.get('type')}")

def parse_ball_receipt(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "outcome": row.get("ball_receipt_outcome"),
        "under_pressure": row.get("under_pressure")
    }

def parse_ball_recovery(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "recovery_failure": row.get("ball_recovery_recovery_failure")
    }

def parse_dispossessed(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "under_pressure": row.get("under_pressure")
    }

def parse_duel(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "duel_type": row.get("duel_type"),
        "duel_outcome": row.get("duel_outcome"),
        "counterpress": row.get("counterpress")
    }

def parse_block(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "position_name": row.get("position"),
        "deflection": row.get("block_deflection"),
        "offensive": row.get("block_offensive"),
        "save_block": row.get("block_save_block"),
        "counterpress": row.get("counterpress")
    }

def parse_offside(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "play_pattern": row.get("play_pattern")
    }

def parse_clearance(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "play_pattern": row.get("play_pattern"),
        "body_part": row.get("clearance_body_part")
    }

def parse_interception(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "outcome": row.get("interception_outcome")
    }

def parse_dribble(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "outcome": row.get("dribble_outcome"),
        "overrun": row.get("dribble_overrun"),
        "nutmeg": row.get("dribble_nutmeg"),
        "no_touch": row.get("dribble_no_touch")
    }

def parse_shot(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "type_shot": row.get("shot_type"),
        "first_time": row.get("shot_first_time"),
        "statsbomb_xg": row.get("shot_statsbomb_xg"),
        "shot_technique": row.get("shot_technique"),
        "body_part": row.get("shot_body_part"),
        "outcome": row.get("shot_outcome")
    }

def parse_pressure(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "counterpress": row.get("counterpress")
    }

def parse_half_start(row):
    return {
        "possession_team": get_possession_team(row)
    }

def parse_substitution(row):
    return {
        "player_name": row.get("player"),
        "replacement": row.get("substitution_replacement"),
        "outcome": row.get("substitution_outcome")
    }

def parse_own_goal_against(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player")
    }

def parse_foul_won(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "advantage": row.get("foul_won_advantage"),
        "defensive": row.get("foul_won_defensive"),
        "penalty": row.get("foul_won_penalty")
    }

def parse_foul_committed(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "type": row.get("foul_committed_type"),
        "card": row.get("foul_committed_card"),
        "penalty": row.get("foul_committed_penalty"),
        "advantage": row.get("foul_committed_advantage"),
        "offensive": row.get("foul_committed_offensive"),
        "counterpress": row.get("counterpress")
    }

def parse_goal_keeper(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "position": row.get("goalkeeper_position"),
        "technique": row.get("goalkeeper_technique"),
        "body_part": row.get("goalkeeper_body_part"),
        "type": row.get("goalkeeper_type"),
        "outcome": row.get("goalkeeper_outcome")
    }

def parse_bad_behaviour(row):
    return {
        "player_name": row.get("player"),
        "card": row.get("bad_behaviour_card")
    }

def parse_own_goal_for(row):
    return parse_own_goal_against(row)

def parse_player_on(row):
    return {"player_name": row.get("player")}

def parse_player_off(row):
    return {
        "player_name": row.get("player"),
        "permanent": row.get("player_off_permanent")
    }

def parse_shield(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player")
    }

def parse_pass(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "player_recipient": row.get("pass_recipient"),
        "length_in_yards": row.get("pass_length"),
        "height": row.get("pass_height"),
        "body_part": row.get("pass_body_part"),
        "type": row.get("pass_type"),
        "outcome": row.get("pass_outcome"),
        "technique": row.get("pass_technique"),
        "cross": row.get("pass_cross"),
        "backheel": row.get("pass_backheel"),
        "deflected": row.get("pass_deflected"),
        "miscommunication": row.get("pass_miscommunication"),
        "cut_back": row.get("pass_cut_back"),
        "switch": row.get("pass_switch"),
        "goal_assist": row.get("pass_goal_assist"),
        "shot_assist": row.get("pass_shot_assist")
    }

def parse_50_50(row):
    outcome = None
    if isinstance(row.get("50_50"), dict):
        outcome = row["50_50"].get("outcome", {}).get("name")
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "outcome": outcome,
        "counterpress": row.get("counterpress")
    }

def parse_half_end(row):
    return {
        "possession_team": get_possession_team(row)
    }

def parse_error(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player")
    }

def parse_miscontrol(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "aerial_won": row.get("miscontrol_aerial_won")
    }

def parse_dribbled_past(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "counterpress": row.get("counterpress")
    }

def parse_injury_stoppage(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player"),
        "in_chain": row.get("injury_stoppage_in_chain")
    }

def parse_ref_ball_drop(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row)
    }

def parse_carry(row):
    return {
        **extract_location(row),
        "possession_team": get_possession_team(row),
        "player_name": row.get("player")
    }

def get_possession_team(row):
    if 'possession_team' in row:
        return row.get('possession_team')
    return None

def extract_location(row):
    loc = row.get("location")
    if isinstance(loc, (list, tuple)) and len(loc) == 2:
        return {"location_x": loc[0], "location_y": loc[1]}
    return {"location_x": None, "location_y": None}


# --- Mapping type -> parser -----------------------------------------------------
EVENT_TYPE_PARSERS = {
    "Ball Receipt*": parse_ball_receipt,
    "Ball Recovery": parse_ball_recovery,
    "Dispossessed": parse_dispossessed,
    "Duel": parse_duel,
    "Block": parse_block,
    "Offside": parse_offside,
    "Clearance": parse_clearance,
    "Interception": parse_interception,
    "Dribble": parse_dribble,
    "Shot": parse_shot,
    "Pressure": parse_pressure,
    "Half Start": parse_half_start,
    "Substitution": parse_substitution,
    "Own Goal Against": parse_own_goal_against,
    "Foul Won": parse_foul_won,
    "Foul Committed": parse_foul_committed,
    "Goal Keeper": parse_goal_keeper,
    "Bad Behaviour": parse_bad_behaviour,
    "Own Goal For": parse_own_goal_for,
    "Player On": parse_player_on,
    "Player Off": parse_player_off,
    "Shield": parse_shield,
    "Pass": parse_pass,
    "50/50": parse_50_50,
    "Half End": parse_half_end,
    "Error": parse_error,
    "Miscontrol": parse_miscontrol,
    "Dribbled Past": parse_dribbled_past,
    "Injury Stoppage": parse_injury_stoppage,
    "Referee Ball-Drop": parse_ref_ball_drop,
    "Carry": parse_carry
}

