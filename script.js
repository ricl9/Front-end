document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) {
        alert("Please select a file.");
        return;
    }

    let cityName = document.getElementById('cityNameInput').value;
    
    function uploadFile(city) {
        const formData = new FormData();
        const md5 = calculateMD5(file);
        formData.append('file', fileInput);
        formData.append('city', city);
        formData.append('md5', md5);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
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

async function calculateMD5(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('MD5', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function listFiles() {
    fetch('/files')
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
            files.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file;
                fileList.appendChild(li);
            });
        });
}

document.addEventListener('DOMContentLoaded', listFiles);