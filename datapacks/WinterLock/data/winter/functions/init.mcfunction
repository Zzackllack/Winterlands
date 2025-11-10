# Initialize stage if missing: 0 = early, 1 = mid, 2 = late
execute unless data storage winter:data stage run data modify storage winter:data stage set value 0
function winter:_set_from_stage
# Kick off the 8-day cycle
schedule function winter:advance 8d replace
