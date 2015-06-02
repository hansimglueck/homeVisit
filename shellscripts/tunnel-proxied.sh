#!/bin/bash

if [ -e ~/homeVisit/DIZZICONF ]; then
    source ~/homeVisit/DIZZICONF

    # calculate port number from hostname
    if [[ ${HOSTNAME} =~ ^homevisitpi([0-9]+)$ ]]; then
        num=${BASH_REMATCH[1]}
        port=$((DIZZIPORT + num + 1000))
    else
        echo "HOSTNAME is not homevisitpiN!"
        exit -1
    fi

    # get hostname from DIZZIHOST
    if [[ ${DIZZIHOST} =~ @([a-z\.]+)$ ]]; then
        dizzihostname=${BASH_REMATCH[1]}
    else
        echo "Could not extract hostname from DIZZIHOST!"
        exit -1
    fi

    # start tunnel
    echo Starting tunnel to ${DIZZIHOST} ${port}
    /usr/bin/autossh -fN -o "ServerAliveInterval=30" -o "ServerAliveCountMax=99999" -o ProxyCommand\ /usr/bin/corkscrew\ ${dizzihostname}\ 80\ 127.0.0.1\ 22 -R ${port}:localhost:22 ${DIZZIHOST}
else
    echo "DIZZICONF not found!"
fi
