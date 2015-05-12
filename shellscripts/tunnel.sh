#!/bin/bash

if [ -e ~/homeVisit/DIZZICONF ]; then
    source ~/homeVisit/DIZZICONF
    /usr/bin/autossh -fN -o "ServerAliveInterval=30" -o "ServerAliveCountMax=99999" -R ${DIZZIPORT}:localhost:22 ${DIZZIHOST}
else
    echo "DIZZICONF not found!"
fi
