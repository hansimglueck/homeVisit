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

def replaceSpecialChars(txt):
	### The "Ø" and "ø" only work with Norwegian character set, setup in printer_gs.py
        specialChars = {'“':'\x22', '”':'\x22', '„':'\x22', '‟':'\x22', '«':'\xAE', '»':'\xAF', 'Ä':'\x8E', 'ä':'\x84', 'Ö':'\x99', 'ö':'\x94', 'Ü':'\x9A', 'ü':'\x81', 'ß':'\xE1', 'Ç':'\x80', 'ç':'\x87', 'É':'\x90', 'é':'\x82', 'Â':'\x83', 'â':'\x83', 'À':'\x85', 'à':'\x85', 'Å':'\x8F', 'å':'\x86', 'Ê':'\x88', 'ê':'\x88', 'Ë':'\x89', 'ë':'\x89', 'È':'\x8A', 'è':'\x8A', 'Ï':'\x8B', 'ï':'\x8B', 'Î':'\x8C', 'î':'\x8C', 'Ì':'\x8D', 'ì':'\x8D', 'Æ':'\x92', 'æ':'\x91', 'Ô':'\x93', 'ô':'\x93', 'Ò':'\x95', 'ò':'\x95', 'Û':'\x96', 'û':'\x96', 'Ù':'\x97', 'ù':'\x97', 'Á':'\xA0', 'á':'\xA0', 'Í':'\xA1', 'í':'\xA1', 'Ó':'\xA2', 'ó':'\xA2', 'Ú':'\xA3', 'ú':'\xA3', 'Ñ':'\xA5', 'ñ':'\xA4', '¡':'\xAD', '¿':'\xA8', '‹':'\x3C', '›':'\x3E', 'Ø':'\x5C', 'ø':'\x7c', '–':'-', 'Ą':'A', 'ą':'a', 'Ć':'C', 'ć':'c', 'Ę':'E', 'ę':'e', 'Ł':'L', 'ł':'l', 'Ń':'N', 'ń':'n', 'Ś':'S', 'ś':'s', 'Ź':'Z', 'ź':'z', 'Ż':'Z', 'ż':'z'}
        #specialChars = {'“':'\x22', '”':'\x22', '„':'\x22', '‟':'\x22', '«':'\xAE', '»':'\xAF', 'Ä':'\x8E', 'ä':'\x84', 'Ö':'\x99', 'ö':'\x94', 'Ü':'\x9A', 'ü':'\x81', 'ß':'\xE1', 'Ç':'\x80', 'ç':'\x87', 'É':'\x90', 'é':'\x82', 'Â':'\xB6', 'â':'\x83', 'À':'\xB7', 'à':'\x85', 'Å':'\x8F', 'å':'\x86', 'Ê':'\xD2', 'ê':'\x88', 'Ë':'\xD3', 'ë':'\x89', 'È':'\xD4', 'è':'\x8A', 'Ï':'\xD8', 'ï':'\x8B', 'Î':'\xD7', 'î':'\x8C', 'Ì':'\xDE', 'ì':'\x8D', 'Æ':'\x92', 'æ':'\x91', 'Ô':'\xE2', 'ô':'\x93', 'Ò':'\x95', 'ò':'\xE3', 'Û':'\xEA', 'û':'\x96', 'Ù':'\xEB', 'ù':'\x97', 'Á':'\xB5', 'á':'\xA0', 'Í':'\xD6', 'í':'\xA1', 'Ó':'\xE0', 'ó':'\xA2', 'Ú':'\xE9', 'ú':'\xA3', 'Ñ':'\xA5', 'ñ':'\xA4', '¡':'\xAD', '¿':'\xA8', '‹':'\x3C', '›':'\x3E', 'Ø':'\x9D', 'ø':'\x9B'}
	for i, j in specialChars.iteritems():
                txt = txt.replace(i, j)
        return txt

def printPiePartition(data):
	### In Arbeit
	### In diesem Test wird eine Textzeile der Form:
	### 50 20 10 10 5 5
	### ausgewertet --- jede Zahl ist ein prozentualer Anteil
	### Kuchenumfang 1 Gugelhupf ca. 59 cm --- 1 Zeile = 0.44 cm ---> ca. 134 Zeilen
	### Kuchenumfang 2 rund gross ca. 76 cm --- 1 Zeile = 0.44 cm ---> ca. 173 Zeilen
	### Kuchenumfang 3 rund klein ca. 57 cm --- 1 Zeile = 0.44 cm ---> ca. 130 Zeilen

	all_lines = 130

	###parts = txt.split()

	parts = data["voteOptions"]
	print(parts)

	#sum = 0.0
	#for part in data:
	#	sum = sum + float(part)
	#
	##print(parts)
	##print(sum)

	#cutline = "||||||||||||||||"
	cutline = "\xFE\xFE\xFE\xFE\xFE\xFE\xFE\xFE\xFE\xFE\xFE\xFE\xFE\xFE\xFE\xFE\n"

	p.print_text("\n\n\n\n\n\n\n\n\n")
	p.linefeed()
	p.linefeed()

	p.double_width(True)
	p.set_linespacing(35)

	p.print_text(cutline)
	p.print_text("** MATCH HERE **\n")
	p.print_text(cutline)

	for part in parts:
	#	percentage = float(part) / sum
		percentage = float(part["percent"]) / 100
		playercolor = part["playercolor"]
		playercolor_uni = playercolor.encode('utf-8')
		playercolor_uni = replaceSpecialChars(playercolor_uni)
		lines = int(all_lines * percentage)
		if (lines <= 2):
			p.print_text(part["percent"] + " %")
			p.print_text("\n")
			p.print_text(playercolor_uni)
			p.print_text("\n")
			p.print_text(cutline)
		else:
			p.print_text(part["percent"] + " %")
			p.print_text("\n")
			p.print_text(playercolor_uni)
			p.print_text("\n")
			for x in range(0, lines-2):
				p.print_text("\n")
			p.print_text(cutline)

	#p.print_text(cutline)
	p.print_text("** MATCH HERE **\n")
	p.print_text(cutline)

	p.double_width(False)
	p.reset_linespacing()
	p.print_text("\n\n\n\n\n\n\n\n\n")
	p.linefeed()
	p.linefeed()

def test(x):
	print x

#der client wird in einem extra-thread gestartet...
client = ws.Client(role="printer", cb = cb)




#damit das programm nicht stoppt
#c = raw_input("Client running.")
while True:
	time.sleep(1)
