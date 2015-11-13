#!/usr/bin/env python
#coding=utf-8

import time
import json
import printer_gs, textwrap
import ws
import socket

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

p.reset()
p.double_width(True)
p.set_linespacing(32)

for i in xrange(20,21):
        # Select character code table "850" for more special characters - different from how it is specified in the manual
        p.printer.write(p._ESC)
        p.printer.write(chr(116))
        p.printer.write(chr(i))
        p.print_text("CHARACTER CODE TABLE "+str(i))
        p.linefeed()
        p.linefeed()
        print_sample_wide()
	time.sleep(2)
