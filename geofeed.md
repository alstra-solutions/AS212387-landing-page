# Alstra geofeed

The public geofeed is available at [geofeed.csv](https://alstra.org/geofeed.csv).
It is a read only CSV file in the RFC 8805 format. Each row has five fields:

`ip_prefix,country_code,region_code,city_name,postal_code`

There is no authentication, update endpoint, or service level status endpoint.
The file can be fetched with a normal HTTP GET request.
