#!/usr/bin/env python
#coding=utf-8

import time
import json
import printer_gs, textwrap
import ws
import socket

p=printer_gs.ThermalPrinter(serialport="/dev/ttyAMA0")

def cb(msg):
	if msg["type"] == "registerConfirm":
		#erstmal hallo sagen
		#print_sample()
		welcome_text = "HOWDY \n I AM ALIVE \n MY NAME IS "+socket.gethostname()+"\n you can now start MC-APP"
		msg = {"type":"display", "data":{"type":"card","text":welcome_text}}
	if msg["type"] != "display":
		return
	if (msg["data"]["type"] == "card"):
		txt = msg["data"]["text"]
		unicode = txt.encode('utf-8')
		lines = unicode.splitlines(txt.count('\n'))

		p.double_width(True)
		p.set_linespacing(35)
		char_count = 0
	        for item in lines:
        		#print item
        		item = replaceSpecialChars(item)
        		unwrapped = item
        		wrapped = textwrap.fill(unwrapped, 16)
        		char_count = char_count + len(wrapped)
        		#print "printing: "+wrapped
        		p.print_text(wrapped)
        		p.print_text("\n")
        		wait = 0.008 * char_count
        		#print(char_count)
        		#print"->"
        		#print(wait)
        		time.sleep(wait)
        		char_count = 0
		#unwrapped = txt
		#wrapped = textwrap.fill(unwrapped, 16)
		#p.print_text(wrapped)
		#p.print_text("\n")
		p.double_width(False)
		p.reset_linespacing()
		p.print_text("\n\n\n\n\n\n\n")
		p.print_text("--------------------------------\n")
		p.print_text("\n\n")
		p.linefeed()
		p.linefeed()
	elif (msg["data"]["type"] == "results"):
		print(msg)
		printPiePartition(msg["data"]["data"])
	elif (msg["data"]["type"] == "info"):
		txt = msg["data"]["text"]
		unicode = txt.encode('utf-8')
		lines = unicode.splitlines(txt.count('\n'))

		p.double_width(False)
		p.set_linespacing(32)
		char_count = 0
	        for item in lines:
        		item = replaceSpecialChars(item)
        		unwrapped = item
        		wrapped = textwrap.fill(unwrapped, 32)
        		char_count = char_count + len(wrapped)
        		p.print_text(wrapped)
        		p.print_text("\n")
        		wait = 0.008 * char_count
        		time.sleep(wait)
        		char_count = 0
		p.double_width(False)
		p.reset_linespacing()
		p.print_text("\n\n\n\n")
		p.print_text("--------------------------------\n")
		p.print_text("\n\n")
		p.linefeed()
		p.linefeed()

def print_sample():
	p.print_text("  ");
	for i in xrange(16):
		p.print_text(hex(i)[2:].upper());
		p.print_text(" ");
	for i in xrange(256):
		if (i%16 == 0):
			p.print_text("\n");
			p.print_text(hex(i/16)[2:].upper());
		p.print_text " \\x"+hex(i)[2:].zfill(2).upper()


p.double_width(False)
p.set_linespacing(32)

for i in xrange(20):
	print_sample()

p.reset_linespacing()
