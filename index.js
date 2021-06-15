const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Put your API key here
const key = "";

app.post('/api/get_distance_and_time', (request, response) => {
    let origins = request.body.start.lat + ',' + request.body.start.lng;
    let destinations = request.body.end.lat + ',' + request.body.end.lng;
    let timestamp = (new Date().getTime() / 1000).toFixed(0);

    let request1 = axios.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + origins
        + "&destinations=" + destinations + "&key=" + key);
    let request2 = axios.get("https://maps.googleapis.com/maps/api/timezone/json?location=" + origins
        + "&timestamp=" + timestamp + "&key=" + key);
    let request3 = axios.get("https://maps.googleapis.com/maps/api/timezone/json?location=" + destinations
        + "&timestamp=" + timestamp + "&key=" + key);

    axios.all([request1, request2, request3]).then(axios.spread((...res) => {
        let distance = {
            value: 0,
            units: 'km'
        };

        let timeDiff = {
            value: 0,
            units: 'hours'
        };

        let start = {
            country: '',
            timezone: '',
            location: request.body.start
        };

        let end = {
            country: '',
            timezone: '',
            location: request.body.end
        };


        if (res[0].data && res[0].data['status'] === 'OK') {
            const rows = res[0].data['rows'];
            if (rows.length > 0) {
                const elements = rows[0]['elements'];
                if (elements.length > 0) {
                    const element = elements[0];
                    if (element['distance']) {
                        distance.value = (element.distance['value'] / 1000).toFixed(0);
                    }
                }
            }
        }

        if (res[1].data && res[2].data && res[1].data['status'] === 'OK' && res[2].data['status'] === 'OK') {
            start.country = res[1].data['timeZoneId'];
            end.country = res[2].data['timeZoneId'];

            start.timezone = (Math.abs(res[1].data['rawOffset']) / 3600) + Math.abs(res[1].data['dstOffset'] / 3600);
            end.timezone = (Math.abs(res[2].data['rawOffset']) / 3600) + Math.abs(res[2].data['dstOffset'] / 3600);

            timeDiff.value = Math.abs(start.timezone - end.timezone);

            start.timezone = "GMT" + (res[1].data['rawOffset'] < 0 ? "-" : "+") + start.timezone;
            end.timezone = "GMT" + (res[1].data['rawOffset'] < 0 ? "-" : "+") + end.timezone;
        }

        let body = {
            start: start,
            end: end,
            distance: distance,
            time_diff: timeDiff
        };

        response.send(body);
    }));
});

app.listen(8080, () => {
    console.log("The server is listening to port 8080");
});

