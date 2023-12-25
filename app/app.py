# Filename: app.py

from flask import Flask, render_template, request, jsonify
from datetime import datetime
import pytz

app = Flask(__name__)

# Timezones for the cities
timezones = {
    "Ufa": "Asia/Yekaterinburg",
    "Sofia": "Europe/Sofia",
    "Los Angeles": "America/Los_Angeles"
}

@app.route('/')
def index():
    # Provide current times for each city in 24-hour format as default values
    current_times = {city: datetime.now(pytz.timezone(tz)).strftime('%H:%M') for city, tz in timezones.items()}
    return render_template('index.html', current_times=current_times)

@app.route('/get-time', methods=['POST'])
def get_time():
    data = request.json
    app.logger.info(f"Received data for /get-time: {data}")

    selected_city = data.get('city')
    selected_time = data.get('time')

    if not selected_city or not selected_time:
        app.logger.error("Missing city or time in the request")
        return jsonify({"error": "City or time not provided"}), 400

    try:
        # Parse the selected time and convert it to a datetime object in 24-hour format
        user_time = datetime.strptime(selected_time, '%H:%M').time()
        city_timezone = pytz.timezone(timezones[selected_city])
        now = datetime.now(city_timezone)
        city_time = now.replace(hour=user_time.hour, minute=user_time.minute, second=0, microsecond=0)
        utc_time = city_time.astimezone(pytz.utc)

        times = {city: utc_time.astimezone(pytz.timezone(tz)).strftime('%H:%M') for city, tz in timezones.items()}
        return jsonify(times)
    except ValueError as e:
        app.logger.error(f"Error parsing time: {e}")
        return jsonify({"error": "Invalid time format"}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

