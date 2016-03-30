#!/usr/bin/env python
#coding=utf-8

import time
import json
import printer_gs, textwrap
import ws
import socket

p=printer_gs.ThermalPrinter(serialport="/dev/ttyAMA0")
specialChars = {'“':'\x22', '”':'\x22', '„':'\x22', '‟':'\x22', '‹':'\x3C', '›':'\x3E', '–':'-', 'Œ':'OE', 'œ':'oe'}

doubleWidth = False
aTable = {
1575:{'glyphs':[0xA8,0xA8,0xC7,0xC7],'connectionType':1},
1573:{'glyphs':[0xA8,0xA8,0xC7,0xC7],'connectionType':1},
1576:{'glyphs':[0xA9,0xC8,0xC8,0xA9],'connectionType':3},
1578:{'glyphs':[0xAA,0xCA,0xCA,0xAA],'connectionType':3},
1579:{'glyphs':[0xAB,0xCB,0xCB,0xAB],'connectionType':3},
1580:{'glyphs':[0xAD,0xCC,0xCC,0xAD],'connectionType':3},
1581:{'glyphs':[0xAE,0xCD,0xCD,0xAE],'connectionType':3},
1582:{'glyphs':[0xAF,0xCE,0xCE,0xAF],'connectionType':3},
1583:{'glyphs':[0xCF,0xCF,0xCF,0xCF],'connectionType':1},
1584:{'glyphs':[0xD0,0xD0,0xD0,0xD0],'connectionType':1},
1585:{'glyphs':[0xD1,0xD1,0xD1,0xD1],'connectionType':1},
1586:{'glyphs':[0xD2,0xD2,0xD2,0xD2],'connectionType':1},
1587:{'glyphs':[0xBC,0xD3,0xD3,0xBC],'connectionType':3},
1588:{'glyphs':[0xBD,0xD4,0xD4,0xBD],'connectionType':3},
1589:{'glyphs':[0xBE,0xD5,0xD5,0xBE],'connectionType':3},
1590:{'glyphs':[0xEB,0xD6,0xD6,0xEB],'connectionType':3},
1591:{'glyphs':[0xD7,0xD7,0xD7,0xD7],'connectionType':3},
1592:{'glyphs':[0xD8,0xD8,0xD8,0xD8],'connectionType':3},
1593:{'glyphs':[0xC5,0xEC,0xD9,0xDF],'connectionType':3},
1594:{'glyphs':[0xED,0xF7,0xDA,0xEE],'connectionType':3},
1601:{'glyphs':[0xBA,0xE1,0xE1,0xBA],'connectionType':3},
1602:{'glyphs':[0xF8,0xE2,0xE2,0xF8],'connectionType':3},
1603:{'glyphs':[0xFC,0xE3,0xE3,0xFC],'connectionType':3},
1604:{'glyphs':[0xFB,0xE4,0xE4,0xFB],'connectionType':3},
1605:{'glyphs':[0xEF,0xE5,0xE5,0xEF],'connectionType':3},
1606:{'glyphs':[0xF2,0xE6,0xE6,0xF2],'connectionType':3},
1607:{'glyphs':[0xF3,0xF4,0xE7,0xF3],'connectionType':3},
1608:{'glyphs':[0xE8,0xE8,0xE8,0xE8],'connectionType':1},
1610:{'glyphs':[0xF6,0xEA,0xEA,0xFD],'connectionType':3},
1577:{'glyphs':[0xC9,0xC9,0xC9,0xC9],'connectionType':1},
32	:{'glyphs':[0x20,0x20,0x20,0x20],'connectionType':0},
1570:{'glyphs':[0xA2,0xA2,0xC2,0xC2],'connectionType':1},
1571:{'glyphs':[0xA5,0xA5,0xC3,0xC3],'connectionType':1},
1548:{'glyphs':[0xAC,0xAC,0xAC,0xAC],'connectionType':0},
46:{'glyphs':[0x2E,0x2E,0x2E,0x2E],'connectionType':0},
58:{'glyphs':[0x3A,0x3A,0x3A,0x3A],'connectionType':0},
1609:{'glyphs':[0xF5,0xC6,0xC6,0xE9],'connectionType':1},
8211:{'glyphs':[0x2D,0x2D,0x2D,0x2D],'connectionType':0},
1574:{'glyphs':[0x23,0xC6,0xC6,0x23],'connectionType':3},
0xFEFB:{'glyphs':[0x9E,0x9E,0x9D,0x9D],'connectionType':1},
0xFEF8:{'glyphs':[0x9A,0x9A,0x99,0x99],'connectionType':1},
0xFEF5:{'glyphs':[0xFA,0xFA,0xF9,0xF9],'connectionType':1},
1569:{'glyphs':[0xC1,0xC1,0xC1,0xC1],'connectionType':0},
1563:{'glyphs':[0xBB,0xBB,0xBB,0xBB],'connectionType':0},
1567:{'glyphs':[0xBF,0xBF,0xBF,0xBF],'connectionType':0}
}
language = "en"

def setLanguage(lang):
	global language
	language = lang
	if lang in ["cs","pl"]:
		p.setCodeTable(18)
		specialCharsLang = {}
		specialCharsTable18 = {'«':'\xAE', '»':'\xAF', 'á':'\xA0', 'č':'\x9F', 'ď':'\xD4', 'é':'\x82', 'ě':'\xD8', 'í':'\x92', 'ň':'\xE5', 'ó':'\xA2', 'ř':'\xFD', 'š':'\xE7', 'ť':'\x9C', 'ú':'\xA3', 'ů':'\x85', 'ý':'\xEC', 'ž':'\xA7', 'Á':'\xB5', 'Č':'\xAC', 'Ď':'\xD2', 'É':'\x90', 'Ě':'\xB7', 'Í':'\xD6', 'Ň':'\xD5', 'Ó':'\xE0', 'Ř':'\xFC', 'Š':'\xE6', 'Ť':'\x9B', 'Ú':'\xE9', 'Ů':'\xDE', 'Ý':'\xED', 'Ž':'\xA6', 'ą':'\xA5', 'ć':'\x86', 'ę':'\xA9', 'ł':'\x88', 'ń':'\xE4', 'ó':'\xA2', 'ś':'\x98', 'ź':'\xAB', 'ż':'\xBE', 'Ą':'\xA4', 'Ć':'\x8F', 'Ę':'\xA8', 'Ł':'\x9D', 'Ń':'\xE3', 'Ó':'\xE0', 'Ś':'\x97', 'Ź':'\x8D', 'Ż':'\xBD'}
		specialChars.update(specialCharsTable18)
	elif lang=="ar":
		p.setCodeTable(22)
	else:
		p.setCodeTable(2)
		specialCharsTable2 = {'«':'\xAE', '»':'\xAF', 'Ä':'\x8E', 'ä':'\x84', 'Ö':'\x99', 'ö':'\x94', 'Ü':'\x9A', 'ü':'\x81', 'ß':'\xE1', 'Ç':'\x80', 'ç':'\x87', 'É':'\x90', 'é':'\x82', 'Â':'\xB6', 'â':'\x83', 'À':'\xB7', 'à':'\x85', 'Å':'\x8F', 'å':'\x86', 'Ê':'\xD2', 'ê':'\x88', 'Ë':'\xD3', 'ë':'\x89', 'È':'\xD4', 'è':'\x8A', 'Ï':'\xD8', 'ï':'\x8B', 'Î':'\xD7', 'î':'\x8C', 'Ì':'\x8D', 'ì':'\x8D', 'Æ':'\x92', 'æ':'\x91', 'Ô':'\xE2', 'ô':'\x93', 'Ò':'\xE3', 'ò':'\x95', 'Û':'\xEA', 'û':'\x96', 'Ù':'\xEB', 'ù':'\x97', 'Á':'\xB5', 'á':'\xA0', 'Í':'\xD6', 'í':'\xA1', 'Ó':'\xE0', 'ó':'\xA2', 'Ú':'\xE9', 'ú':'\xA3', 'Ñ':'\xA5', 'ñ':'\xA4', '¡':'\xAD', '¿':'\xA8', 'Ø':'\x9D', 'ø':'\x9B', 'Ã':'\xC7', 'ã':'\xC6', 'Õ':'\xE5', 'õ':'\xE4'}
		specialChars.update(specialCharsTable2)
	print "language now", lang, language

def cb(msg):
	if msg["type"] == "registerConfirm":
		client.send(type="getLanguage")
		#erstmal hallo sagen
		#print_sample()
		welcome_text = "HOWDY \n I AM ALIVE \n MY NAME IS "+socket.gethostname()+"\n you can now start MC-APP"
		welcome_text = ""
		msg = {"type":"display", "data":{"type":"card","text":welcome_text}}
	if msg["type"] == "languageChange":
		if "language" not in msg["data"]:
			print "got no language-string"
			return
		setLanguage(msg["data"]["language"])
	if msg["type"] != "display":
		return
	if (msg["data"]["type"] == "card"):
		p.double_width(doubleWidth)
		p.set_linespacing(35)

		txt = msg["data"]["text"]
		print "language", language
		if language == "ar":
			print "arabic now pls"
			printArabic(txt)

	  	else:
			### QUICK'N'DIRTY PICTURE PRINT
			### USAGE: CARD ITEM WITH:
			### ***PIC***	
			### DATA FILE NAME
			### FILES SHALL BE LOCATED IN FOLDER "medien/pics"

			#if (lines[0].startswith("***PIC***")):
			#	#p.print_from_file("/home/pi/medien/pics/test1_data")
			#	p.print_from_file("/home/pi/medien/pics/" + str(lines[1]))
			#	#p.print_text("PRINT THE PIC DATA:  "+"../../medien/pics/"+str(lines[1])+"\n")
			#else:
			unicode = txt.encode('utf-8')
			lines = unicode.splitlines(txt.count('\n'))
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


def printArabic(txt):
		if doubleWidth:
			lineLength = 16
		else:
			lineLength = 32

		# replace lam-aleef
		lamalef = unichr(1604)+unichr(1575)
		lamalefhamzah = unichr(1604)+unichr(1571)
		lamalefmadda = unichr(1604)+unichr(1570)
		txt = txt.replace(lamalef,unichr(0xfefb))
		txt = txt.replace(lamalefhamzah,unichr(0xfef8))
		txt = txt.replace(lamalefmadda,unichr(0xfef5))
		lines = textwrap.wrap(txt, lineLength)

		for line in lines:
			connStatus = 0
			lineBuffer = []
			for i in range(len(line)):
				x = line[i]
				next = 32
				if i < len(line)-1:
					next = ord(line[i+1])
				#print x, ord(x)
				glyph = 0x84
				if ord(x) <= 80:
					lineBuffer.append(ord(x))
					connStatus = 0	
				elif ord(x) in aTable:
					nextConnType = 0
					if next in aTable:
						nextConnType = aTable[next]['connectionType'] & 1
						#print "next ",next, " in Table with connType ", aTable[next]['connectionType'], "->", nextConnType

					if connStatus == 0:
						glyphType = 3
						if nextConnType == 1:
							glyphType = 2
					else:
        	  				glyphType = 0
						if nextConnType == 1:
              						glyphType = 1

					char = aTable[ord(x)]
					glyph = char['glyphs'][glyphType]
					connStatus = char['connectionType']&2
					lineBuffer.append(glyph)
				else:
					print "NOT FOUND!!!", ord(x)
				#print connStatus, nextConnType,glyphType, hex(glyph)[2:].upper()

			#fill with spaces
			glyphcount = len(lineBuffer)
			for i in range(glyphcount, lineLength):
				lineBuffer.append(0x20)
			lineBuffer.reverse();

			for y in lineBuffer:
				p.printer.write(chr(y))

			time.sleep(0.008)


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
