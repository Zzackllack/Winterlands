# join_invul:on_first_seen
# This function is used as "on join" handler.
# It gives the player 60 seconds (1200 ticks) of spawn protection.

# 60 seconds * 20 ticks per second = 1200 ticks of protection
scoreboard players set @s ji_time 1200
