from django.contrib import admin
from .models import Team, Competition, Match, Event, UserFavoriteTeam, UserFavoriteMatch, UserTimesAnalyzedMatch



admin.site.register(Team)
admin.site.register(Competition)
admin.site.register(Match)
admin.site.register(Event)
admin.site.register(UserFavoriteTeam)
admin.site.register(UserFavoriteMatch)
admin.site.register(UserTimesAnalyzedMatch)
