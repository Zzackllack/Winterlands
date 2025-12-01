# join_invul:load
# This function is called once on /reload or when the world loads.

# Scoreboard to store remaining protection time in ticks (20 ticks = 1 second)
scoreboard objectives add ji_time dummy

# Scoreboard to store remaining protection time converted to seconds
scoreboard objectives add ji_sec dummy

# Scoreboard to store a constant value '20' for tick-to-second conversion
scoreboard objectives add ji_const dummy

# Initialize a fake player '#second' with the value 20 (ticks per second)
scoreboard players set #second ji_const 20

# Tag used to detect players that have already been processed at least once
# (new players without this tag will receive spawn protection)
tag @a remove ji_seen
