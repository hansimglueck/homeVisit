#!/usr/bin/env python
#coding=utf-8

import time
import json
import printer_gs, textwrap
import ws
import socket

p=printer_gs.ThermalPrinter(serialport="/dev/ttyAMA0")
specialChars = {'“':'\x22', '”':'\x22', '„':'\x22', '‟':'\x22', '‹':'\x3C', '›':'\x3E', '–':'-', 'Œ':'OE', 'œ':'oe'}

def setLanguage(lang):
	if lang in ["en","de","da","fr","nl","no","pt"]:
		p.setCodeTable(2)
		specialCharsTable2 = {'«':'\xAE', '»':'\xAF', 'Ä':'\x8E', 'ä':'\x84', 'Ö':'\x99', 'ö':'\x94', 'Ü':'\x9A', 'ü':'\x81', 'ß':'\xE1', 'Ç':'\x80', 'ç':'\x87', 'É':'\x90', 'é':'\x82', 'Â':'\xB6', 'â':'\x83', 'À':'\xB7', 'à':'\x85', 'Å':'\x8F', 'å':'\x86', 'Ê':'\xD2', 'ê':'\x88', 'Ë':'\xD3', 'ë':'\x89', 'È':'\xD4', 'è':'\x8A', 'Ï':'\xD8', 'ï':'\x8B', 'Î':'\xD7', 'î':'\x8C', 'Ì':'\x8D', 'ì':'\x8D', 'Æ':'\x92', 'æ':'\x91', 'Ô':'\xE2', 'ô':'\x93', 'Ò':'\xE3', 'ò':'\x95', 'Û':'\xEA', 'û':'\x96', 'Ù':'\xEB', 'ù':'\x97', 'Á':'\xB5', 'á':'\xA0', 'Í':'\xD6', 'í':'\xA1', 'Ó':'\xE0', 'ó':'\xA2', 'Ú':'\xE9', 'ú':'\xA3', 'Ñ':'\xA5', 'ñ':'\xA4', '¡':'\xAD', '¿':'\xA8', 'Ø':'\x9D', 'ø':'\x9B', 'Ã':'\xC7', 'ã':'\xC6', 'Õ':'\xE5', 'õ':'\xE4'}
		specialChars.update(specialCharsTable2)
	elif lang in ["cs","pl"]:
		p.setCodeTable(18)
		specialCharsLang = {}
		specialCharsTable18 = {'«':'\xAE', '»':'\xAF', 'á':'\xA0', 'č':'\x9F', 'ď':'\xD4', 'é':'\x82', 'ě':'\xD8', 'í':'\x92', 'ň':'\xE5', 'ó':'\xA2', 'ř':'\xFD', 'š':'\xE7', 'ť':'\x9C', 'ú':'\xA3', 'ů':'\x85', 'ý':'\xEC', 'ž':'\xA7', 'Á':'\xB5', 'Č':'\xAC', 'Ď':'\xD2', 'É':'\x90', 'Ě':'\xB7', 'Í':'\xD6', 'Ň':'\xD5', 'Ó':'\xE0', 'Ř':'\xFC', 'Š':'\xE6', 'Ť':'\x9B', 'Ú':'\xE9', 'Ů':'\xDE', 'Ý':'\xED', 'Ž':'\xA6', 'ą':'\xA5', 'ć':'\x86', 'ę':'\xA9', 'ł':'\x88', 'ń':'\xE4', 'ó':'\xA2', 'ś':'\x98', 'ź':'\xAB', 'ż':'\xBE', 'Ą':'\xA4', 'Ć':'\x8F', 'Ę':'\xA8', 'Ł':'\x9D', 'Ń':'\xE3', 'Ó':'\xE0', 'Ś':'\x97', 'Ź':'\x8D', 'Ż':'\xBD'}
		specialChars.update(specialCharsTable18)
	
def cb(msg):
	if msg["type"] == "registerConfirm":
		client.send(type="getLanguage")
		#erstmal hallo sagen
		#print_sample()
		welcome_text = "HOWDY \n I AM ALIVE \n MY NAME IS "+socket.gethostname()+"\n you can now start MC-APP"
		msg = {"type":"display", "data":{"type":"card","text":welcome_text}}
	if msg["type"] == "languageChange":
		if "language" not in msg["data"]:
			print "got no language-string"
			return
		setLanguage(msg["data"]["language"])
	if msg["type"] != "display":
		return
	if (msg["data"]["type"] == "card"):
		txt = msg["data"]["text"]
		unicode = txt.encode('utf-8')
		lines = unicode.splitlines(txt.count('\n'))
		p.double_width(True)
		p.set_linespacing(35)
		char_count = 0
		
		### QUICK'N'DIRTY PICTURE PRINT
		### USAGE: CARD ITEM WITH:
		### ***PIC***
		### DATA FILE NAME
		### FILES SHALL BE LOCATED IN FOLDER "medien/pics"
		
		if (lines[0].startswith("***PIC***")):
			#p.print_from_file("/home/pi/medien/pics/test1_data")
			p.print_from_file("/home/pi/medien/pics/" + str(lines[1]))
			#p.print_text("PRINT THE PIC DATA:  "+"../../medien/pics/"+str(lines[1])+"\n")
		else:
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
	p.print_text(" \x90 \x91 \x92 \x93 \x94 \x95 \x96 \x97 \x98 \x99 \x9A \x9B \x9C \x9D \x9E \x9F")
	p.print_text("\n")
	p.print_text(" \xA0 \xA1 \xA2 \xA3 \xA4 \xA5 \xA6 \xA7 \xA8 \xA9 \xAA \xAB \xAC \xAD \xAE \xAF")
	p.print_text("\n")
	p.print_text(" \xB0 \xB1 \xB2 \xB3 \xB4 \xB5 \xB6 \xB7 \xB8 \xB9 \xBA \xBB \xBC \xBD \xBE \xBF")
	p.print_text("\n")
	p.print_text(" \xC0 \xC1 \xC2 \xC3 \xC4 \xC5 \xC6 \xC7 \xC8 \xC9 \xCA \xCB \xCC \xCD \xCE \xCF")
	p.print_text("\n")
	p.print_text(" \xD0 \xD1 \xD2 \xD3 \xD4 \xD5 \xD6 \xD7 \xD8 \xD9 \xDA \xDB \xDC \xDD \xDE \xDF")
	p.print_text("\n")
	p.print_text(" \xE0 \xE1 \xE2 \xE3 \xE4 \xE5 \xE6 \xE7 \xE8 \xE9 \xEA \xEB \xEC \xED \xEE \xEF")
	p.print_text("\n")
	p.print_text(" \xF0 \xF1 \xF2 \xF3 \xF4 \xF5 \xF6 \xF7 \xF8 \xF9 \xFA \xFB \xFC \xFD \xFE \xFF")
	p.print_text("\n")

def replaceSpecialChars(txt):
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
