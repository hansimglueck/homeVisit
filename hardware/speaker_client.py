#!/usr/bin/env python
import time
import os
import ws
import subprocess

def newMessage(msg):
	if msg["type"] != "display":
		return
	if (msg["data"]["type"] == "sound"):
		vol = 100;
		if ("volume" in msg["data"]):
			vol = msg["data"]["volume"]
		playSoundfile(msg["data"]["text"], vol)
	elif (msg["data"]["type"] == "alert"):
		print "Alert State="+str(msg["data"]["param"])
		alert(msg["data"]["param"])

def alert(al_state):
	if (al_state == 1):
		playSoundfile("mpg321 alarm.mp3", 50)
	elif (al_state == 2):
		playSoundfile("mpg321 alarm3x.mp3", 50)
	elif (al_state == 0):
		stopmpg321()

def playSoundfile(filename, volume):
	#print "pkill omx"
	#subprocess.call("pkill omx",shell=True)

	#filename = msg["data"]["text"]
	print(filename)
	if filename == "stop":
		stopSound()
		return
	elif filename == "stopmpg321":
		stopmpg321()
		return
	elif filename.startswith( 'mpg321 ' ):
		filename = filename[7:]
		os.popen('mpg321 -g50 /home/pi/medien/sounds/' + filename + ' &')
	else:
		print "ex-omx file"
		os.popen('mpg321 -g'+volume+' /home/pi/medien/sounds/' + filename + ' &')

def stopSound():
	os.system("sudo pkill mpg321");

def stopmpg321():
	os.system('sudo pkill mpg321')

#der client wird in einem extra-thread gestartet...
client = ws.Client(role="speaker", cb = newMessage)


#damit das programm nicht stoppt
#c = raw_input("Client running.")
while True:
	time.sleep(1)
