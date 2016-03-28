#!/usr/bin/env python
#coding=utf-8

import time
import json
import printer_gs, textwrap
import ws
import socket

p=printer_gs.ThermalPrinter(serialport="/dev/ttyAMA0")

txt = txt = "Hi Isabelle, me brain feels very updated now. Hmmm, thanks for all the love you invest in my well being!"

def replaceSpecialChars(txt):
	### The "Ø" and "ø" only work with Norwegian character set, setup in printer_gs.py
        specialChars = {'“':'\x22', '”':'\x22', '„':'\x22', '‟':'\x22', '«':'\xAE', '»':'\xAF', 'Ä':'\x8E', 'ä':'\x84', 'Ö':'\x99', 'ö':'\x94', 'Ü':'\x9A', 'ü':'\x81', 'ß':'\xE1', 'Ç':'\x80', 'ç':'\x87', 'É':'\x90', 'é':'\x82', 'Â':'\x83', 'â':'\x83', 'À':'\x85', 'à':'\x85', 'Å':'\x8F', 'å':'\x86', 'Ê':'\x88', 'ê':'\x88', 'Ë':'\x89', 'ë':'\x89', 'È':'\x8A', 'è':'\x8A', 'Ï':'\x8B', 'ï':'\x8B', 'Î':'\x8C', 'î':'\x8C', 'Ì':'\x8D', 'ì':'\x8D', 'Æ':'\x92', 'æ':'\x91', 'Ô':'\x93', 'ô':'\x93', 'Ò':'\x95', 'ò':'\x95', 'Û':'\x96', 'û':'\x96', 'Ù':'\x97', 'ù':'\x97', 'Á':'\xA0', 'á':'\xA0', 'Í':'\xA1', 'í':'\xA1', 'Ó':'\xA2', 'ó':'\xA2', 'Ú':'\xA3', 'ú':'\xA3', 'Ñ':'\xA5', 'ñ':'\xA4', '¡':'\xAD', '¿':'\xA8', '‹':'\x3C', '›':'\x3E', 'Ø':'\x5C', 'ø':'\x7c', '–':'-', 'Ą':'A', 'ą':'a', 'Ć':'C', 'ć':'c', 'Ę':'E', 'ę':'e', 'Ł':'L', 'ł':'l', 'Ń':'N', 'ń':'n', 'Ś':'S', 'ś':'s', 'Ź':'Z', 'ź':'z', 'Ż':'Z', 'ż':'z', 'Č':'C', 'č':'c', 'Ď':'D', 'ď':'d\'', 'ě':'e', 'Ň':'N', 'ň':'n', 'Ř':'R', 'ř':'r', 'Š':'S', 'š':'s', 'Ť':'T', 'ť':'t\'', 'Ů':'U', 'ů':'u', 'Ý':'Y', 'ý':'y', 'Ž':'Z', 'ž':'z', 'Ã':'A', 'ã':'a', 'Õ':'O', 'õ':'o', 'Œ':'OE', 'œ':'oe', 'Ÿ':'Y', 'ÿ':'y'}
        #specialChars = {'“':'\x22', '”':'\x22', '„':'\x22', '‟':'\x22', '«':'\xAE', '»':'\xAF', 'Ä':'\x8E', 'ä':'\x84', 'Ö':'\x99', 'ö':'\x94', 'Ü':'\x9A', 'ü':'\x81', 'ß':'\xE1', 'Ç':'\x80', 'ç':'\x87', 'É':'\x90', 'é':'\x82', 'Â':'\x83', 'â':'\x83', 'À':'\x85', 'à':'\x85', 'Å':'\x8F', 'å':'\x86', 'Ê':'\x88', 'ê':'\x88', 'Ë':'\x89', 'ë':'\x89', 'È':'\x8A', 'è':'\x8A', 'Ï':'\x8B', 'ï':'\x8B', 'Î':'\x8C', 'î':'\x8C', 'Ì':'\x8D', 'ì':'\x8D', 'Æ':'\x92', 'æ':'\x91', 'Ô':'\x93', 'ô':'\x93', 'Ò':'\x95', 'ò':'\x95', 'Û':'\x96', 'û':'\x96', 'Ù':'\x97', 'ù':'\x97', 'Á':'\xA0', 'á':'\xA0', 'Í':'\xA1', 'í':'\xA1', 'Ó':'\xA2', 'ó':'\xA2', 'Ú':'\xA3', 'ú':'\xA3', 'Ñ':'\xA5', 'ñ':'\xA4', '¡':'\xAD', '¿':'\xA8', '‹':'\x3C', '›':'\x3E', 'Ø':'\x5C', 'ø':'\x7c', '–':'-', 'Ą':'A', 'ą':'a', 'Ć':'C', 'ć':'c', 'Ę':'E', 'ę':'e', 'Ł':'L', 'ł':'l', 'Ń':'N', 'ń':'n', 'Ś':'S', 'ś':'s', 'Ź':'Z', 'ź':'z', 'Ż':'Z', 'ż':'z', 'Č':'C', 'č':'c', 'Ď':'D', 'ď':'d\'', 'ě':'e', 'Ň':'N', 'ň':'n', 'Ř':'R', 'ř':'r', 'Š':'S', 'š':'s', 'Ť':'T', 'ť':'t\'', 'Ů':'U', 'ů':'u', 'Ý':'Y', 'ý':'y', 'Ž':'Z', 'ž':'z', 'Ã':'A', 'ã':'a', 'Õ':'O', 'õ':'o', 'Œ':'OE', 'œ':'oe', 'Ÿ':'Y', 'ÿ':'y'}
	for i, j in specialChars.iteritems():
                txt = txt.replace(i, j)
        return txt



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


