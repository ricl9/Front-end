from flask import Flask, request, jsonify, render_template
import os
import re


app = Flask(__name__)

@app.route('/')
def main_page():
	#print("MAIN PAGE CALLED", flush=True)
	return render_template("index.html")	


@app.route('/upload', methods=["POST"])
def upload():
	#print("UPLOAD CALLED", flush=True)
	file = request.files['file']
	print("file length is {}".format(request.content_length), flush=True)

	#check file 
	if request.content_length == 0:
		return build_return_value(401, "file length is zero")

	#check city name
	city_name = request.form["city"]#request.args.get("city")
	filename = str(file.filename)
	print(city_name)
	if not is_city_name_valid(city_name):
		return build_return_value(402, "City name illegal")

	city_name = city_name.capitalize()

	# save file
	dirpath = os.path.join(os.path.dirname(__file__), "files", city_name)
	os.makedirs(dirpath, exist_ok=True)

	filepath = os.path.join(dirpath, filename)

	print("saving file to {}".format(filepath), flush=True)
	file.save(filepath)

	#TODO: md5 

	return build_return_value(200, "")

@app.route('/files')
def get_files():
	#print("GETFILES CALLED")

	filespath = "./files/"
	result = {}
	for entry in os.scandir(filespath):
		if entry.is_dir():
			files_in_dir = []
			for subentry in os.scandir(entry.path):
				if subentry.is_file():
					files_in_dir.append(subentry.name)
			result[entry.name] = files_in_dir

	#print(result)
	return build_return_value(200, result)

@app.route('/city_check', methods=["POST"])
def check_city_name():
	city_name = request.form["city"]#request.args.get("city")
	if is_city_name_valid(city_name):
		return build_return_value(200, "")
	else:
		return build_return_value(501, "City name illegal")


def is_city_name_valid(city_name):
	if not city_name or len(str(city_name)) > 255 or not is_valid_dir(city_name):
		return False
	return True

def build_return_value(code, msg):
	data = {"code":str(code), "message":msg}
	return jsonify(data)

def is_valid_dir(city):
	return re.match(r'^[a-zA-Z0-9_\-\. ]+$', city) is not None