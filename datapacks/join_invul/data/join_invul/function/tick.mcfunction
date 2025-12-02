# join_invul:tick
# This function runs every game tick (20 times per second).

# --------------------------------------------------------------------------------------
# 1) Global tick counter
# --------------------------------------------------------------------------------------

# Increase the global tick counter every tick.
scoreboard players add #global ji_global 1

# --------------------------------------------------------------------------------------
# 2) Join detection using "last seen tick"
#    - ji_diff = current_global_tick - last_seen_tick
#    - If ji_diff >= 2, the player has just joined (or rejoined after being offline).
# --------------------------------------------------------------------------------------

# Compute ji_diff for each online player: ji_diff = ji_global(#global) - ji_last(player)
execute as @a run scoreboard players operation @s ji_diff = #global ji_global
execute as @a run scoreboard players operation @s ji_diff -= @s ji_last

# For players whose ji_diff is 2 or more, treat this as a "join event"
# and give them 60 seconds of protection.
execute as @a[scores={ji_diff=2..}] run function join_invul:on_first_seen

# Update ji_last for all players to the current global tick,
# so that ji_diff will be small (usually 1) while they stay online.
execute as @a run scoreboard players operation @s ji_last = #global ji_global

# --------------------------------------------------------------------------------------
# 3) Apply protection effects while ji_time > 0
# --------------------------------------------------------------------------------------

# For players that still have remaining protection time (ji_time >= 1):
# - give Resistance V (amplifier 4 -> level 5) to reduce incoming damage by 100%
# - give Fire Resistance to prevent fire and lava damage
# - give Water Breathing to prevent drowning
# Effects are given with a short duration (2 seconds) and refreshed each tick
# as long as ji_time > 0.
execute as @a[scores={ji_time=1..}] run effect give @s resistance 2 4 true
execute as @a[scores={ji_time=1..}] run effect give @s fire_resistance 2 0 true
execute as @a[scores={ji_time=1..}] run effect give @s water_breathing 2 0 true

# Decrease the remaining protection time by 1 tick
execute as @a[scores={ji_time=1..}] run scoreboard players remove @s ji_time 1

# --------------------------------------------------------------------------------------
# 4) Update the actionbar with remaining time in seconds
# --------------------------------------------------------------------------------------

# Copy remaining ticks (ji_time) into ji_sec for this player
execute as @a[scores={ji_time=1..}] run scoreboard players operation @s ji_sec = @s ji_time

# Convert ticks to seconds: ji_sec = ji_sec / 20
execute as @a[scores={ji_time=1..}] run scoreboard players operation @s ji_sec /= #second ji_const

# Show the remaining seconds in the actionbar (JSON must be on a single line!)
# Example output: "Spawn Protection: 42 seconds remaining"
execute as @a[scores={ji_time=1..}] run title @s actionbar {"text":"","extra":[{"text":"Spawn Protection: ","color":"aqua"},{"score":{"name":"@s","objective":"ji_sec"},"color":"yellow"},{"text":" Sekunden verbleibend","color":"white"}]}

# --------------------------------------------------------------------------------------
# 5) When the timer reaches 0, clear effects and actionbar
# --------------------------------------------------------------------------------------

# For players whose protection has ended (ji_time == 0),
# clear the protection effects so they behave normally again.
execute as @a[scores={ji_time=0}] run effect clear @s resistance
execute as @a[scores={ji_time=0}] run effect clear @s fire_resistance
execute as @a[scores={ji_time=0}] run effect clear @s water_breathing

# Clear the actionbar for players whose protection just ended
execute as @a[scores={ji_time=0}] run title @s actionbar {"text":""}
