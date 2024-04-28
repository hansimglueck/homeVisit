#!/usr/bin/env python
#coding=utf-8

import time
import json
import printer_gs, textwrap
import ws
import socket
import config

p=printer_gs.ThermalPrinter(serialport="/dev/ttyAMA0")
specialChars = {'“':'\x22', '”':'\x22', '„':'\x22', '‟':'\x22', '‹':'\x3C', '›':'\x3E', '–':'-', 'Œ':'OE', 'œ':'oe'}

def setLanguage(lang):
	if lang in ["cs","pl","hu"]:
		p.setCodeTable(18)
		specialCharsLang = {}
		specialCharsTable18 = {
										'«':'\xAE', 
										'»':'\xAF', 
										'á':'\xA0', 
										'Á':'\xB5', 
										'ą':'\xA5', 
										'Ą':'\xA4', 
										'é':'\x82', 
										'É':'\x90', 
										'ě':'\xD8', 
										'Ě':'\xB7', 
										'ę':'\xA9', 
										'Ę':'\xA8', 
										'í':'\x92', 
										'Í':'\xD6', 
										'Ö':'\x99', 
										'ö':'\x94', 
										'ó':'\xA2', 
										'Ó':'\xE0', 
										'ő':'\x8B', 
										'Ő':'\x8A', 
										'Ü':'\x9A', 
										'ü':'\x81', 
										'ú':'\xA3', 
										'Ú':'\xE9', 
										'ú':'\xA3', 
										'ű':'\xFB', 
										'Ű':'\xEB', 
										'ů':'\x85', 
										'Ů':'\xDE', 
										'ć':'\x86', 
										'Ć':'\x8F', 
										'č':'\x9F', 
										'Č':'\xAC', 
										'ď':'\xD4', 
										'Ď':'\xD2', 
										'ł':'\x88', 
										'Ł':'\x9D', 
										'ń':'\xE4', 
										'Ń':'\xE3', 
										'ň':'\xE5', 
										'Ň':'\xD5', 
										'ř':'\xFD', 
										'Ř':'\xFC', 
										'š':'\xE7', 
										'Š':'\xE6', 
										'ś':'\x98', 
										'Ś':'\x97', 
										'ť':'\x9C', 
										'Ť':'\x9B', 
										'ý':'\xEC', 
										'Ý':'\xED', 
										'ž':'\xA7', 
										'Ž':'\xA6', 
										'ź':'\xAB', 
										'Ź':'\x8D', 
										'ż':'\xBE', 
										'Ż':'\xBD'}
		specialChars.update(specialCharsTable18)
	elif lang in ["ru"]:
                p.setCodeTable(6)
                specialCharsLang = {}
                specialCharsTable06 = {'А': '\xc0', 'Б': '\xc1', 'В': '\xc2', 'Г': '\xc3', 'Д': '\xc4', 'Е': '\xc5', 'Ё': '\xa8', 'Ж': '\xc6', 'З': '\xc7', 'И': '\xc8', 'Й': '\xc9', 'К': '\xca', 'Л': '\xcb', 'М': '\xcc', 'Н': '\xcd', 'О': '\xce', 'П': '\xcf', 'Р': '\xd0', 'С': '\xd1', 'Т': '\xd2', 'У': '\xd3', 'Ф': '\xd4', 'Х': '\xd5', 'Ц': '\xd6', 'Ч': '\xd7', 'Ш': '\xd8', 'Щ': '\xd9', 'Ъ': '\xda', 'Ы': '\xdb', 'Ь': '\xdc', 'Э': '\xdd', 'Ю': '\xde', 'Я': '\xdf', 'а': '\xe0', 'б': '\xe1', 'в': '\xe2', 'г': '\xe3', 'д': '\xe4', 'е': '\xe5', 'ё': '\xb8', 'ж': '\xe6', 'з': '\xe7', 'и': '\xe8', 'й': '\xe9', 'к': '\xea', 'л': '\xeb', 'м': '\xec', 'н': '\xed', 'о': '\xee', 'п': '\xef', 'р': '\xf0', 'с': '\xf1', 'т': '\xf2', 'у': '\xf3', 'ф': '\xf4', 'х': '\xf5', 'ц': '\xf6', 'ч': '\xf7', 'ш': '\xf8', 'щ': '\xf9', 'ъ': '\xfa', 'ы': '\xfb', 'ь': '\xfc', 'э': '\xfd', 'ю': '\xfe', 'я': '\xff'}
                specialChars.update(specialCharsTable06)
	elif lang in ["tr_CY"]:
                p.setCodeTable(29)
                specialCharsLang = {}
                specialCharsTable29 = {
                                        'ç': '\x87',
                                        'Ç': '\x80',
                                        'ğ': '\xa7',
                                        'Ğ': '\xa6',
                                        'ö': '\x94',
                                        'Ö': '\x99',
                                        'ş': '\x9f',
                                        'Ş': '\x9e',
                                        'ü': '\x81',
                                        'Ü': '\x9a',
                                        'ı': '\x8d',
                                        'İ': '\xad'
                                        }
                specialChars.update(specialCharsTable29)
	elif lang in ["el_CY"]:
                p.setCodeTable(24)
                specialCharsLang = {}
                specialCharsTable24 = {
                                        'Α': '\x80',
                                        'Β': '\x81',
                                        'Γ': '\x82',
                                        'Δ': '\x83',
                                        'Ε': '\x84',
                                        'Ζ': '\x85',
                                        'Η': '\x86',
                                        'Θ': '\x87',
                                        'Ι': '\x88',
                                        'Κ': '\x89',
                                        'Λ': '\x8a',
                                        'Μ': '\x8b',
                                        'Ν': '\x8c',
                                        'Ξ': '\x8d',
                                        'Ο': '\x8e',
                                        'Π': '\x8f',
                                        'Ρ': '\x90',
                                        'Σ': '\x91',
                                        'Τ': '\x92',
                                        'Υ': '\x93',
                                        'Φ': '\x94',
                                        'Χ': '\x95',
                                        'Ψ': '\x96',
                                        'Ω': '\x97',
                                        'α': '\x98',
                                        'β': '\x99',
                                        'γ': '\x9a',
                                        'δ': '\x9b',
                                        'ε': '\x9c',
                                        'ζ': '\x9d',
                                        'η': '\x9e',
                                        'θ': '\x9f',
                                        'ι': '\xa0',
                                        'κ': '\xa1',
                                        'λ': '\xa2',
                                        'μ': '\xa3',
                                        'ν': '\xa4',
                                        'ξ': '\xa5',
                                        'ο': '\xa6',
                                        'π': '\xa7',
                                        'ρ': '\xa8',
                                        'σ': '\xa9',
                                        'ς': '\xaa',
                                        'τ': '\xab',
                                        'υ': '\xac',
                                        'φ': '\xad',
                                        'χ': '\xae',
                                        'ψ': '\xaf',
                                        'ω': '\xe0',
                                        'Ά': '\xea',
                                        'Έ': '\xeb',
                                        'Ή': '\xec',
                                        'Ί': '\xed',
                                        'Ό': '\xee',
                                        'Ύ': '\xef',
                                        'Ώ': '\xf0',
                                        'Ϊ': '\xf4',
                                        'ά': '\xe1',
                                        'έ': '\xe2',
                                        'ή': '\xe3',
                                        'ί': '\xe5',
                                        'ό': '\xe6',
                                        'ύ': '\xe7',
                                        'ώ': '\xe9',
                                        'ϊ': '\xe4',
                                        '«': '\x22',
                                        '»': '\x22'
                             }
                specialChars.update(specialCharsTable24)
	else:
		p.setCodeTable(2)
		specialCharsTable2 = {			'«':'\xAE', 
										'»':'\xAF', 
										'Ä':'\x8E', 
										'ä':'\x84', 
										'Ö':'\x99', 
										'ö':'\x94', 
										'Ü':'\x9A', 
										'ü':'\x81', 
										'ß':'\xE1', 
										'Ç':'\x80', 
										'ç':'\x87', 
										'É':'\x90', 
										'é':'\x82', 
										'Â':'\xB6', 
										'â':'\x83', 
										'À':'\xB7', 
										'à':'\x85', 
										'Å':'\x8F', 
										'å':'\x86', 
										'Ê':'\xD2', 
										'ê':'\x88', 
										'Ë':'\xD3', 
										'ë':'\x89', 
										'È':'\xD4', 
										'è':'\x8A', 
										'Ï':'\xD8', 
										'ï':'\x8B', 
										'Î':'\xD7', 
										'î':'\x8C', 
										'Ì':'\x8D', 
										'ì':'\x8D', 
										'Æ':'\x92', 
										'æ':'\x91', 
										'Ô':'\xE2', 
										'ô':'\x93', 
										'Ò':'\xE3', 
										'ò':'\x95', 
										'Û':'\xEA', 
										'û':'\x96', 
										'Ù':'\xEB', 
										'ù':'\x97', 
										'Á':'\xB5', 
										'á':'\xA0', 
										'Í':'\xD6', 
										'í':'\xA1', 
										'Ó':'\xE0', 
										'ó':'\xA2', 
										'Ú':'\xE9', 
										'ú':'\xA3', 
										'Ñ':'\xA5', 
										'ñ':'\xA4', 
										'¡':'\xAD', 
										'¿':'\xA8', 
										'Ø':'\x9D', 
										'ø':'\x9B', 
										'Ã':'\xC7', 
										'ã':'\xC6', 
										'Õ':'\xE5', 
										'õ':'\xE4'}
		specialChars.update(specialCharsTable2)

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
				#for x in wrapped:
					#print x, ord(x)
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

	if (config.HARDWARE['bigPan']):
		all_lines = 140
	elif (config.HARDWARE['veryBigPan']):
		all_lines = 153
	else:
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
