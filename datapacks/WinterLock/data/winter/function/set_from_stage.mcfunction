# Map stage -> season set command
execute if data storage winter:data {stage:0} run season set early_winter
execute if data storage winter:data {stage:1} run season set mid_winter
execute if data storage winter:data {stage:2} run season set late_winter
