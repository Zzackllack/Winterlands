# join_invul:load
# This function is called once on /reload or when the world loads.

# Scoreboard to store remaining protection time in ticks (20 ticks = 1 second)
scoreboard objectives add ji_time dummy

# Scoreboard to store remaining protection time converted to seconds
scoreboard objectives add ji_sec dummy

# Scoreboard to store a constant value '20' for tick-to-second conversion
scoreboard objectives add ji_const dummy

# Global tick counter for join detection
scoreboard objectives add ji_global dummy

# Per-player "last seen tick" value for join detection
scoreboard objectives add ji_last dummy

# Helper objective to store per-player difference between global tick and last seen tick
scoreboard objectives add ji_diff dummy

# Initialize a fake player '#second' with the value 20 (ticks per second)
scoreboard players set #second ji_const 20

# Initialize the global tick counter
scoreboard players set #global ji_global 0

# Initialize ji_last for currently online players to a negative value,
# so that they are treated as "just joined" on the first tick after reload.
scoreboard players set @a ji_last -1000
