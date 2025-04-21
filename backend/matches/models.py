from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator



class Team(models.Model):
    api_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(unique=True, max_length=255)
    football_crest_url = models.URLField()

    def __str__(self):
        return self.name


class Competition(models.Model):
    statsbomb_id = models.IntegerField(null=True, blank=True)
    api_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(unique=True, max_length=255)
    competition_logo_url = models.URLField()

    def __str__(self):
        return self.name


class Match(models.Model):
    STATUS_SCHEDULED = 'Scheduled'
    STATUS_IN_PROGRESS = 'In progress'
    STATUS_FINISHED = 'Finished'
    STATUS_CHOICES = [
        (STATUS_SCHEDULED, 'Scheduled'),
        (STATUS_IN_PROGRESS, 'In progress'),
        (STATUS_FINISHED, 'Finished'),
    ]
    
    statsbomb_id = models.IntegerField(null=True, blank=True)
    api_id = models.IntegerField(null=True, blank=True)
    api_creation_day = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_FINISHED)
    season_name = models.CharField(max_length=100)
    genre = models.CharField(max_length=20)
    date = models.DateTimeField()
    match_week = models.IntegerField(null=True, validators=[MinValueValidator(0)])
    match_round = models.CharField(max_length=100, null=True, blank=True)
    stadium = models.CharField(max_length=255)
    home_team_coach_name = models.CharField(max_length=255, blank=True, null=True)
    away_team_coach_name = models.CharField(max_length=255, blank=True, null=True)
    goals_scored_home_team = models.IntegerField(default=0, null=True, blank=True, validators=[MinValueValidator(0)])
    goals_scored_away_team = models.IntegerField(default=0, null=True, blank=True, validators=[MinValueValidator(0)])

    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='matches')
    home_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_matches')
    away_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_matches')

    def __str__(self):
        return f"{self.home_team} vs {self.away_team} ({self.date.date()})"


class Event(models.Model):
    EVENT_TYPES = [
        ('Teams won prediction', 'Teams won prediction'),
        ('Lineup', 'Lineup'),
        ('Ball Receipt*', 'Ball Receipt*'),
        ('Ball Recovery', 'Ball Recovery'),
        ('Dispossessed', 'Dispossessed'),
        ('Duel', 'Duel'),
        ('Block', 'Block'),
        ('Offside', 'Offside'),
        ('Clearance', 'Clearance'),
        ('Interception', 'Interception'),
        ('Dribble', 'Dribble'),
        ('Shot', 'Shot'),
        ('Pressure', 'Pressure'),
        ('Half Start', 'Half Start'),
        ('Substitution', 'Substitution'),
        ('Own Goal Against', 'Own Goal Against'),
        ('Foul Won', 'Foul Won'),
        ('Foul Committed', 'Foul Committed'),
        ('Goal Keeper', 'Goal Keeper'),
        ('Bad Behaviour', 'Bad Behaviour'),
        ('Own Goal For', 'Own Goal For'),
        ('Player On', 'Player On'),
        ('Player Off', 'Player Off'),
        ('Shield', 'Shield'),
        ('Pass', 'Pass'),
        ('50/50', '50/50'),
        ('Half End', 'Half End'),
        ('Error', 'Error'),
        ('Miscontrol', 'Miscontrol'),
        ('Dribbled Past', 'Dribbled Past'),
        ('Injury Stoppage', 'Injury Stoppage'),
        ('Referee Ball-Drop', 'Referee Ball-Drop'),
        ('Carry', 'Carry'),
    ]

    id = models.CharField(primary_key=True, max_length=100)
    index = models.IntegerField(null=True)
    minute = models.IntegerField()
    second = models.IntegerField()
    period = models.IntegerField()
    type = models.CharField(max_length=50, choices=EVENT_TYPES)
    representation = models.BooleanField(default=False)
    details = models.JSONField()

    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='events')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.type} (index={self.index}) at {self.minute}' ({self.match})"


class UserFavoriteTeam(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_teams')
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.team.name}"


class UserFavoriteMatch(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_matches')
    match = models.ForeignKey(Match, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.match}"


class UserTimesAnalyzedMatch(models.Model):
    times_analyzed = models.IntegerField(default=0)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='analyzed_matches')
    match = models.ForeignKey(Match, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} analyzed {self.match} ({self.times_analyzed} times)"

