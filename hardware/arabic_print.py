#!/usr/bin/env python
#coding=utf-8

import time
import json
import printer_gs, textwrap
import ws
import socket
import sys

p=printer_gs.ThermalPrinter(heatTime=45, serialport="/dev/ttyAMA0")


p.reset()
p.double_width(True)
p.set_linespacing(32)
p.setCodeTable(20)

p.print_text("hallo ")
p.print_text("\50")
p.linefeed()

p.printer.write(p._ESC)
p.printer.write(chr(38))
p.printer.write(chr(3))
p.printer.write(chr(50))
p.printer.write(chr(50))
p.printer.write(chr(12))
p.printer.write(chr(255))
p.printer.write(chr(0))
p.printer.write(chr(255))
p.printer.write(chr(0))
p.printer.write(chr(255))
p.printer.write(chr(0))
p.printer.write(chr(255))
p.printer.write(chr(0))
p.printer.write(chr(255))
p.printer.write(chr(0))
p.printer.write(chr(255))
p.printer.write(chr(0))


p.print_text("hallo ")
p.print_text("\50")
p.linefeed()

