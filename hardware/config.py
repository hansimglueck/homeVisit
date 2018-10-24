########### HARDWARE CONFIGURATION ###########

# To use special code for Anker-speaker
# create file config_local.py:
#HARDWARE = {
#    'speaker': 'anker'
#}

##########################################


HARDWARE = {
    'speaker': 'default'
}

try:
    import config_local
    HARDWARE = config_local.HARDWARE
except ImportError:
    pass
