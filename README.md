# File Upload Server

This repository contains a simple file upload server built using Flask. The server provides an HTML interface and two API endpoints for file uploading and listing uploaded files.

## Features

1. **Flask Backend**: The server is implemented with Flask. When `index.html` is requested, it serves an HTML page for file uploads.
2. **APIs**:
   - `upload`: Parses the `city` field from the form as the folder name and saves the uploaded file under the corresponding folder. *(TODO: Add `md5` field for integrity check.)*
   - `list`: *(TODO:)* Returns a list of files already uploaded to the server. The structure is `[(filename, city), ...]`.
3. **File Storage**: Uploaded files are saved in the directory structure `./files/{city}/`.
4. *(TODO:)* Handle conflicts for files with the same name in the same city.

## Project Structure

```
.
├── app.py           # Backend server Python code
├── statics/
│   ├── script.js    # JavaScript code for sending requests
│   └── styles.css   # CSS for styling the index page
├── templates/
│   └── index.html   # HTML for the upload page
```

## How to Run

1. Ensure you have Python 3.x installed.
2. Install Flask using pip:
   ```bash
   pip install Flask
   ```
3. Clone the repository from Github
4. Start the Flask server in debug mode:
   ```bash
   flask run --debug
   ```
5. Open a browser and navigate to `127.0.0.1:5000` to see the upload page. *(For debugging, you could use Chrome's Inspect tool.)*
6. Changes take effect immediately upon saving.



## Todos

1. Show uploaded files (both frontend and backend)
2. Md5 checksum
3. Test cases