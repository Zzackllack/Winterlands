# Initialize stage if missing: 0 = early, 1 = mid, 2 = late
execute unless data storage winter:data stage run data modify storage winter:data stage set value 0

# Force Early Winter on startup/server boot/first load
season set early_winter

# Kick off the 8-day cycle (match your Serene Seasons sub_season_duration)
schedule function winter:advance 8d replace