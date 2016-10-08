#!/usr/bin/env python
#coding=utf-8

import time
import json
import printer_gs, textwrap
import ws
import socket
import sys

if (len(sys.argv) < 3 or sys.argv[1] not in ["small","wide","detail"]):
	print "usage: python sample_print.py small/wide/detail start_table [stop_table]"
	quit()

mode = str(sys.argv[1])
start_table = int(sys.argv[2])
if (len(sys.argv) == 3):
	stop_table = int(sys.argv[2])+1
else:
	stop_table = int(sys.argv[3])

p=printer_gs.ThermalPrinter(heatTime=45, serialport="/dev/ttyAMA0")

def print_sample():
        p.double_width(False);
	for i in xrange(16):
                p.print_text(" ")
                p.inverse_on()
                p.print_text(hex(i)[2:].upper())
                p.inverse_off()
        for i in xrange(32, 255):
                if (i%16 == 0):
                        p.print_text("\n")
                        p.inverse_on()
                        #p.print_text(hex(i/16)[2:].upper())
                        p.inverse_off()
                p.print_text(" ")
                p.printer.write(chr(i))
        p.linefeed()
        p.linefeed()
        p.linefeed()
        p.linefeed()
        p.linefeed()

def print_sample_wide():
	for i in xrange(8):
		p.print_text(" ")
		p.inverse_on()
		p.print_text(hex(i)[2:].upper())
		p.inverse_off()
	for i in xrange(128, 255):
		if (i%8 == 0):
			p.print_text("\n")
			p.inverse_on()
			#p.print_text(hex(i/16)[2:].upper())
			p.inverse_off()
		p.print_text(" ")
		p.printer.write(chr(i))
	p.linefeed()
	p.linefeed()
	p.linefeed()
	p.linefeed()
	p.linefeed()

def print_sample_detail():
	for i in xrange(128, 255):
		if (i == 175):
			time.sleep(4)
		if (i not in range(1760,2240)):
			if (i%2 == 0):
				p.print_text("\n")
			p.inverse_on()
			p.bold_on()
			p.print_text(hex(i)[2:].upper())
			p.inverse_off()
			p.bold_off()
			p.print_text(" ")
			p.printer.write(chr(i))
			p.print_text(" ")
	p.linefeed()
	p.linefeed()
	p.linefeed()
	p.linefeed()
	p.linefeed()

p.reset()
p.double_width(True)
p.set_linespacing(32)

print "mode: "+mode
print "start_table: "+str(start_table)
print "stop_table: "+str(stop_table)

for i in xrange(start_table,stop_table):
        # Select character code table "850" for more special characters - different from how it is specified in the manual
        p.printer.write(p._ESC)
        p.printer.write(chr(116))
        p.printer.write(chr(i))
        p.print_text("CHARACTER CODE\nTABLE "+str(i))
        p.linefeed()
        p.linefeed()
        if (mode=="small"):
          print_sample()
        elif (mode=="wide"):
          print_sample_wide()
        if (mode=="detail"):
          print_sample_detail()
	time.sleep(2)
