########### HARDWARE CONFIGURATION ###########

# To use special code for Anker-speaker
# or the larger Kuchenform
# create file config_local.py:
#HARDWARE = {
#    'speaker': 'anker',
#    'bigPan': True
#}


##########################################


HARDWARE = {
    'speaker': 'default',
    'bigPan': False,
    'veryBigPan': False
}

try:
    import config_local
    HARDWARE = config_local.HARDWARE
except ImportError:
    pass
