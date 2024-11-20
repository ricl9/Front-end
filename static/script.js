//const fs = require('fs');
//const crypto = require('crypto');

console.log("DEBUG: SCRIPT LOADED");

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) {
        alert("ERROR: Please select a file.");
        return;
    }

    let cityName = document.getElementById('cityNameInput').value;
    
    function uploadFile(city) {
        const formData = new FormData();
        // const md5 = getMD5Hash(file);
        formData.append('file', fileInput);
        formData.append('city', city);
        // formData.append('md5', md5);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.code == 200) {
                alert('File uploaded successfully!');
                document.getElementById('cityNameInput').style.display = 'none';
                listFiles();
            } else {
                alert(data.message || 'File upload failed!');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    if (!cityName) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        cityName = data.address.city || data.address.town || data.address.village || data.address.state;
                        if (cityName) {
                            uploadFile(cityName);
                        } else {
                            document.getElementById('cityNameInput').style.display = 'block';
                        }
                    })
                    .catch(() => {
                        document.getElementById('cityNameInput').style.display = 'block';
                    });
            }, function() {
                document.getElementById('cityNameInput').style.display = 'block';
            });
        } else {
            document.getElementById('cityNameInput').style.display = 'block';
        }
    } else {
        uploadFile(cityName);
    }
});

//function getMD5Hash(file) {
//    return new Promise((resolve, reject) => {
//        const hash = crypto.createHash('md5');
//        const stream = fs.createReadStream(filePath);
//
//        stream.on('data', (data) => {
//            hash.update(data);
//        });
//
//        stream.on('end', () => {
//            resolve(hash.digest('hex'));
//        });
//
//        stream.on('error', (err) => {
//            reject(err);
//        });
//    });
//}

function listFiles() {
    fetch('/files')
        .then(response => response.json())
        .then(responsejson => responsejson.message)
        .then(citiesobj => {
            //console.log(citiesobj);
            //console.log(typeof citiesobj);

            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';

            Object.keys(citiesobj).forEach(city => {
                const newheading = document.createElement('h4');
                newheading.textContent = city;
                fileList.appendChild(newheading);
                //console.log(citiesobj[city])
                citiesobj[city].forEach(file => {
                    const newlistentry = document.createElement('li');
                    newlistentry.textContent = file;
                    fileList.appendChild(newlistentry);
                })
            })
        });
}

document.addEventListener('DOMContentLoaded', listFiles);
