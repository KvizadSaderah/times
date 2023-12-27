document.addEventListener('DOMContentLoaded', function() {
    function setCurrentTimeForInput() {
        var now = new Date();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('time-input').value = hours + ':' + minutes;
    }

    setCurrentTimeForInput(); 

    document.getElementById('show-times-btn').addEventListener('click', function() {
        var city = document.getElementById('city-selector').value;
        var time = document.getElementById('time-input').value;

        fetch('/get-time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: city, time: time })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                for (var key in data) {
                    var elementId = 'time-' + key.replace(/\s+/g, '-').toLowerCase();
                    var element = document.getElementById(elementId);
                    if (element) {
                        element.textContent = key + ': ' + data[key];
                    }
                }
                document.getElementById('time-display').style.display = 'block';
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch(error => {
            console.error('Network Error:', error);
        });
    });
});

