#!/usr/bin/python

import time
import ws
from Adafruit_7Segment import SevenSegment

# ===========================================================================
# ===========================================================================

segment = SevenSegment(address=0x74)
time_whole = 10
now = time_whole
mode = ""

digit_0 = 0
digit_1 = 0
digit_3 = 0
digit_4 = 0
colon = 0

blink_freq = 0
blink_toggle = 0
blink_toggle_timer = 0
fies = 0
leise = 0

#print "Press CTRL+Z to exit"

def turnOff():
	global mode
	lightOff()
	mode = "off"

def lightOff():
	global segment
	segment.writeDigitRaw(0, 0)
	segment.writeDigitRaw(1, 0)
	segment.writeDigitRaw(3, 0)
	segment.writeDigitRaw(4, 0)
	segment.setColon(0)

def turnOn():
	global mode
	lightOn()
	mode = "on"

def lightOn():
	global segment
	segment.writeDigit(0, 8)
	segment.writeDigit(1, 8)
	segment.writeDigit(3, 8)
	segment.writeDigit(4, 8)
	segment.setColon(1)

def blink(freq):
	global mode
	global blink_toggle
	global blink_freq
	global blink_toggle_timer
	#print(led_state)
	blink_freq = freq
	if (blink_freq == 0):
		blink_freq = 0.3
	lightOn()
	blink_toggle = 1
	blink_toggle_timer = time.time()
	mode = "alert_blink"

def cb(msg):
	global mode
	global fies
	global leise
	print "digits cb got message"
	#print("DIGITS GETS MSG TYPE: " + msg["type"])
	if (msg["type"] == "display"):
		if (msg["data"]["type"] == "cmd"):
			### Dies ist ein Command-Item aus dem Strang
			print "type="+msg["type"]+" - command="+msg["data"]["command"]
			cmd = msg["data"]["command"]
			#print("DIGITS GETS CMD: " + cmd)
			if (cmd == "countdown" or cmd == "countdown_fies" or cmd == "countdown_leise"):
				sendSound("stopmpg321")
				if (cmd == "countdown_fies"):
					fies = 1
					leise = 0
				elif (cmd == "countdown_leise"):
					leise = 1
					fies = 0
					print("LEISE!")
				else:
					fies = 0
					leise = 0
				countdown(int(msg["data"]["param"]))
		elif (msg["data"]["type"] == "alert"):
			### Dies ist die Alert-State-Nachricht vom Game: 0=aus, 1=an, 2=blink
			#print "type="+msg["type"]+" - param="+msg["data"]["param"]
			al_state = msg["data"]["param"]
			if (al_state == 1):
				sendSound("mpg321 alarm.mp3")
				if (mode != "countdown"):
					turnOn()
					#blink(msg["data"]["param"])
			elif (al_state == 2):
				if (mode != "countdown"):
					blink(0.3)
				else:
					sendSound("mpg321 alarm.mp3")
			elif (al_state == 0):
				if (mode != "countdown"):
					turnOff()



def countdown(secs):
	global mode
	global now
	global time_whole
	print "Set digits to countdown: " + str(secs)
	if (leise != 1):
		sendSound("mpg321 uhr_ticken.mp3 --loop 0")
	mode = "countdown"
	time_whole = secs
	now = time_whole

def sendSound(filepath):
	client.send(type="forward", data={"type":"display","content":{"text":filepath}}, param={"role":"speaker","name":"NN"})

#der client wird in einem extra-thread gestartet...
client = ws.Client(role="digits", cb = cb)

turnOff()

while(True):
	#print(mode)
	if (mode == "countdown"):
		if (now > 0):
			now = now - 0.1
			rnd_now = int(now)
			# Minutes
			minutes = int(rnd_now / 60)
			digit_0 = int(minutes / 10)
			digit_1 = minutes % 10
			# Seconds
			seconds = rnd_now % 60
			digit_3 = int(seconds / 10)
			digit_4 = seconds % 10
			# Toggle colon at 1Hz
			colon = rnd_now % 2

			#print digit_0
			#print digit_1
			#print digit_3
			#print digit_4
			#print ":::::::"
		else:
			# countdown complete
			mode = ""
			sendSound("stopmpg321")
			if (leise != 1):
				if (fies == 1):
					sendSound("alarm-fies-lauter.mp3")
				else:
					sendSound("mpg321 time_up.mp3")
	if (mode == ""):
		turnOff()
	elif (mode == "countdown"):
		# Set digits
		segment.writeDigit(0, digit_0)
		segment.writeDigit(1, digit_1)
		segment.writeDigit(3, digit_3)
		segment.writeDigit(4, digit_4)
		# Set colon
		segment.setColon(colon)
	elif mode == "alert_blink" and ((time.time() - blink_toggle_timer > blink_freq)):
		if (blink_toggle == 1):
			lightOff()
			blink_toggle = 0
			blink_toggle_timer = time.time()
		else:
			lightOn()
			blink_toggle = 1
			blink_toggle_timer = time.time()
			sendSound("mpg321 alarm.mp3")


	# Wait one second
	time.sleep(0.1)
