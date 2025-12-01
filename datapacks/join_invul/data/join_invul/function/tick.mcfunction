# join_invul:tick
# This function runs every game tick (20 times per second).

# 1) Detect new players (without the 'ji_seen' tag) and give them initial protection time.
execute as @a[tag=!ji_seen] run function join_invul:on_first_seen

# 2) For players that still have remaining protection time (ji_time >= 1):
#    - Make them invulnerable (for survival/adventure)
#    - Decrease their timer by 1 tick
execute as @a[gamemode=!creative,gamemode=!spectator,scores={ji_time=1..}] run data modify entity @s Invulnerable set value 1b
execute as @a[scores={ji_time=1..}] run scoreboard players remove @s ji_time 1

# 3) Update the actionbar to show remaining protection time in seconds.
#    We do this only for players that still have protection time left (ji_time >= 1).

# Copy remaining ticks (ji_time) into ji_sec for this player
execute as @a[scores={ji_time=1..}] run scoreboard players operation @s ji_sec = @s ji_time

# Convert ticks to seconds: ji_sec = ji_sec / 20
execute as @a[scores={ji_time=1..}] run scoreboard players operation @s ji_sec /= #second ji_const

# Show the remaining seconds in the actionbar (JSON must be on a single line!)
# Example output: "Spawn Protection: 42 seconds remaining"
execute as @a[scores={ji_time=1..}] run title @s actionbar {"text":"","extra":[{"text":"Spawn Protection: ","color":"aqua"},{"score":{"name":"@s","objective":"ji_sec"},"color":"yellow"},{"text":" Sekunden verbleibend","color":"white"}]}

# 4) When the timer reaches 0, remove invulnerability and clear the actionbar.
#    We also restrict this to non-creative, non-spectator players.

execute as @a[gamemode=!creative,gamemode=!spectator,scores={ji_time=0}] run data modify entity @s Invulnerable set value 0b

# Clear the actionbar for players whose protection just ended
execute as @a[scores={ji_time=0}] run title @s actionbar {"text":""}
