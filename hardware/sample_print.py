#!/usr/bin/env python
#coding=utf-8

import time
import json
import printer_gs, textwrap
import ws
import socket
import sys

cmdargs = str(sys.argv)

mode = str(sys.argv[1])
start_table = int(sys.argv[2])
stop_table = int(sys.argv[3])

p=printer_gs.ThermalPrinter(serialport="/dev/ttyAMA0")

def print_sample():
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
	for i in xrange(128, 136):
		if (i%2 == 0):
			p.print_text("\n")
		p.inverse_on()
		p.print_text(hex(i)[2:].upper())
		p.inverse_off()
		p.print_text(" ")
		p.printer.write(chr(i))
	p.linefeed()
	p.linefeed()
	p.linefeed()
	p.linefeed()
	p.linefeed()

p.reset()
p.double_width(True)
p.set_linespacing(32)

print "mode: "+mode
print "start_table: "+start_table
print "stop_table: "+stop_table

for i in xrange(start_table,stop_table):
        # Select character code table "850" for more special characters - different from how it is specified in the manual
        p.printer.write(p._ESC)
        p.printer.write(chr(116))
        p.printer.write(chr(i))
        p.print_text("CHARACTER CODE\nTABLE "+str(i))
        p.linefeed()
        p.linefeed()
        if (mode=="small"):
          print_sample_wide()
        elif (mode=="wide"):
          print_sample_wide()
        if (mode=="detail"):
          print_sample_wide()
	time.sleep(2)
