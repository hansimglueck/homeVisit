#!/bin/bash

if [ -e ~/homeVisit/DIZZICONF ]; then
    source ~/homeVisit/DIZZICONF

    # calculate port number from hostname
    if [[ ${HOSTNAME} =~ ^homevisitpi([0-9]+)$ ]]; then
        num=${BASH_REMATCH[1]}
        port=$((DIZZIPORT + num - 1))
    else
        echo "HOSTNAME is not homevisitpiN!"
        exit -1
    fi

    # start tunnel
    echo Starting tunnel to ${DIZZIHOST} ${port}
    /usr/bin/autossh -fN -o "ServerAliveInterval=30" -o "ServerAliveCountMax=99999" -R ${port}:localhost:22 ${DIZZIHOST}
else
    echo "DIZZICONF not found!"
fi
