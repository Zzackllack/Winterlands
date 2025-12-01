# join_invul:on_first_seen
# This function runs exactly once for each player the first time they are seen by the datapack.
# Here we give them 60 seconds (1200 ticks) of spawn protection.

# Mark the player as processed, so we don't re-trigger this every tick
tag @s add ji_seen

# 60 seconds * 20 ticks per second = 1200 ticks of protection
scoreboard players set @s ji_time 1200
