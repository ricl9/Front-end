from flask import Flask, request, jsonify, render_template
import os
import re


app = Flask(__name__)

@app.route('/')
def hello():
	return render_template("index.html")	


@app.route('/upload', methods=["POST"])
def upload():
	file = request.files['file']
	print(type(file), flush=True)
	print(request.args, flush=True)
	print("file length is {}".format(request.content_length), flush=True)

	#check file 
	if request.content_length == 0:
		return "Fail, file length is zero"

	#check dirname
	dirname = request.args.get("city")
	filename = str(file.filename)
	print(dirname)
	if not dirname or len(str(dirname)) > 255 or not is_valid_city(dirname):
		return "Fail, city name illegal"

	dirname = dirname.capitalize()


	# save file
	dirpath = os.path.join(os.path.dirname(__file__), dirname)
	os.makedirs(dirpath, exist_ok=True)

	filepath = os.path.join(dirpath, filename)

	print("saving to {}".format(filepath))
	file.save(filepath)

	return "success"

	#md5 


def is_valid_city(city):
	return re.match(r'^[a-zA-Z0-9_\-\.]+$', city) is not None