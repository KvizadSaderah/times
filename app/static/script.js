// Filename: static/script.js

document.addEventListener('DOMContentLoaded', function() {
    function setCurrentTimeForInput() {
        var now = new Date();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('time-input').value = hours + ':' + minutes; // Set in 24-hour format
    }

    setCurrentTimeForInput(); // Set the current time as default when the page loads

    document.getElementById('show-times-btn').addEventListener('click', function() {
        var city = document.getElementById('city-selector').value;
        var time = document.getElementById('time-input').value;

        // Convert 24-hour format time to a format that can be parsed by backend
        var formattedTime = convertTo24HourFormat(time);

        console.log('Sending Request:', { city: city, time: formattedTime }); // Debug log

        fetch('/get-time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: city, time: formattedTime })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Received Response:', data); // Debug log

            if (!data.error) {
                for (var key in data) {
                    var elementId = 'time-' + key.replace(/\s+/g, '-').toLowerCase();
                    if (document.getElementById(elementId)) {
                        document.getElementById(elementId).textContent = key + ': ' + data[key];
                    }
                }
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch(error => {
            console.error('Network Error:', error);
        });
    });
});

function convertTo24HourFormat(timeStr) {
    // Convert AM/PM time to 24-hour format if needed
    if (timeStr.match(/(AM|PM)$/i)) {
        var d = new Date("1/1/2013 " + timeStr);
        var hours = d.getHours().toString().padStart(2, '0');
        var minutes = d.getMinutes().toString().padStart(2, '0');
        return hours + ':' + minutes;
    } else {
        return timeStr; // Already in 24-hour format
    }
}

