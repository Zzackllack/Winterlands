# stage = (stage + 1) % 3  (branching without scoreboards)
execute if data storage winter:data {stage:0} run data modify storage winter:data stage set value 1
execute if data storage winter:data {stage:1} run data modify storage winter:data stage set value 2
execute if data storage winter:data {stage:2} run data modify storage winter:data stage set value 0
    
function winter:set_from_stage
schedule function winter:advance 8d replace
