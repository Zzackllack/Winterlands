# stage = (stage + 1) % 3
data modify storage winter:data stage set value  ((0))
execute store result storage winter:data stage int 1 run data get storage winter:data stage
# increment
execute store result storage winter:data stage int 1 run scoreboard players add #tmp winter.tmp 1
# the scoreboard trick above is optional; simpler:
# data modify storage winter:data stage set from storage winter:data stage
# data modify storage winter:data stage set value 1  <-- not valid arithmetic directly in data
# So we'll do arithmetic by branching:

# --- Branch arithmetic without scoreboard (clean & reliable) ---
# Read current value and branch:
execute if data storage winter:data {stage:0} run data modify storage winter:data stage set value 1
execute if data storage winter:data {stage:1} run data modify storage winter:data stage set value 2
execute if data storage winter:data {stage:2} run data modify storage winter:data stage set value 0

function winter:_set_from_stage
schedule function winter:advance 8d replace
