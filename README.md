# Gozem Node Express API

This is an API to return, the country and timezone info, distance (in km or miles) and the time difference in hours, between two
geo locations.

Modify the index.js file and set your API key from Google platform.

Then run the app and send a request as follow:

```
POST http://localhost:8080/api/get_distance_and_time
{
    "start": { 
        "lat": 33.5731104, 
        "lng": -7.5898434
    },
    "end": { 
        "lat": 3.844119, 
        "lng": 11.501346
    },
    "units": "metric"
}
```


