#!/bin/bash

sudo iwlist wlan1 scan | grep -Po '".*?"'
