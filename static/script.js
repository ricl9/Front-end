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
    
    function uploadFile(city, hash) {
        console.log(hash);
        const formData = new FormData();
        formData.append('file', fileInput);
        formData.append('city', city);
        formData.append('hash', hash);

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

    gethash(fileInput)
    .then(hash => {
        if (!cityName) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                        .then(response => response.json())
                        .then(data => {
                            cityName = data.address.city || data.address.town || data.address.village || data.address.state;
                            if (cityName) {
                                uploadFile(cityName, hash);
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
            uploadFile(cityName, hash);
        }
    })
});

document.addEventListener('DOMContentLoaded', listFiles);

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
};

function gethash(in_file) {
    var hashprom = new Promise(resolve => {
        var reader = new FileReader();
        reader.onload = e => {
            var data = e.target.result;
            window.crypto.subtle.digest("SHA-256", data).then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join('');
                resolve(hashHex);
            })
        }
        reader.readAsArrayBuffer(in_file);
    });
    return hashprom;
};