import websocket
import thread
import time
import json

class Client(object):

	def __init__(self, role, cb, name=None):
		print "Client:init"
		self.connected = False
		self.cb = cb
		self.role = role
		if name is None:
			self.name = "NN"
		else:
			self.name = name
		websocket.enableTrace(True)
		self.open_websocket()

	def on_message(self, ws, message):
		print "WS-message:"
		print message
		msg = json.loads(message)
		#print msg["type"]
		if msg["type"] == "registerConfirm": print "registered at the game"
		self.cb(msg)
		#if msg["type"] == "display":
			#print msg["data"]["text"]
			#self.cb(msg)

	def on_error(self, ws, error):
	    print error

	def on_close(self, ws):
		print "Socket closed"
		self.connected = False
		print "### closed ###"
		time.sleep(1)
		self.open_websocket()

	def on_open(self, ws):
		print "Socket opened"
		self.connected = True
		self.ws.send(json.dumps({'type':"register", 'data':{'role': self.role, 'name':self.name}}))

	def open_websocket(self):
		def run(* args):
			self.ws = websocket.WebSocketApp("ws://localhost:80",
		                          on_message = self.on_message,
		                          on_error = self.on_error,
		                          on_close = self.on_close)
			self.ws.on_open = self.on_open
			self.ws.run_forever()
			print "konnte keine verbindung aufbauen"
		thread.start_new_thread(run, ())

	def send(self, type, data=None, param=None):
		print "send type:" + type
		#print "send type: " + type + " data: " + data + " param: " + param
		self.ws.send(json.dumps({'type':type, 'data':data, 'param':param}))

	def conn(self):
		return self.connected
