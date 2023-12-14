from flask import Flask, request, jsonify
from datetime import datetime
import pytz

app = Flask(__name__)

time_zones = {
    'Los_Angeles': 'America/Los_Angeles',
    'Ufa': 'Europe/Ufa',
    'Sofia': 'Europe/Sofia'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-current-time', methods=['GET'])
def get_current_time():
    times = {}
    for city, tz in time_zones.items():
        local_time = datetime.now(pytz.timezone(tz)).strftime('%H:%M')
        times[city] = local_time
    return jsonify(times)

@app.route('/get-time', methods=['POST'])
def get_time():
    try:
        data = request.json
        city = data['city']
        time_input = data['time']

        city_time_zone = time_zones.get(city.replace(' ', '_'))
        if not city_time_zone:
            raise ValueError("Invalid city name")

        naive_time = datetime.strptime(time_input, '%H:%M')
        local_time = pytz.timezone(city_time_zone).localize(naive_time)

        times = {city: local_time.astimezone(pytz.timezone(tz)).strftime('%H:%M') for city, tz in time_zones.items()}
        return jsonify(times)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
