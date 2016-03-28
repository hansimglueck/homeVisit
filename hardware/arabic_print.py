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

p.linefeed()
p.linefeed()
p.linefeed()

p.printer.write(p._ESC)
p.printer.write(chr(37))
p.printer.write(chr(1))

p.print_text("testext start ")
p.linefeed()
for i in range(0,10):
	p.printer.write(p._ESC)
	p.printer.write(chr(38))
	p.printer.write(chr(3))
	p.printer.write(chr(51))
	p.printer.write(chr(51))
	p.printer.write(chr(12))
	for j in range(0,6):
        	p.printer.write(chr(255))
        	p.printer.write(chr(i*20))
        	p.printer.write(chr(i*20))
        	p.printer.write(chr(i*20))
        	p.printer.write(chr(i*20))
        	p.printer.write(chr(255))
        	#time.sleep(0.1)

	p.print_text("3")
	print "print"
	p.linefeed()


p.print_text("testext end ")


p.linefeed()
p.linefeed()
p.linefeed()
p.linefeed()
p.linefeed()
p.linefeed()
p.linefeed()

