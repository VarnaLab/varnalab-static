
# varnalab-static

## Config

```json
{
  "production": {
    "scheme": "https",
    "host": "varnalab.org",
    "path": "",
    "port": 5050,
    "assets": "/home/varnalab/projects/varnalab-static",
    "html": "/home/varnalab/config/varnalab-static/build",
    "api": "https://box.outofindex.com/varnalab/api"
  }
}
```

## Render

```bash
node varnalab-static/bin/ \
  --config /path/to/config.json \
  --env production \
  --render /path/to/build/location/
```

## Server

```bash
node varnalab-static/bin/ \
  --config /path/to/config.json \
  --env production \
  --server
```

## NginX Router

```nginx
location ~ /(css|js|images)/(.*) {
  root /home/varnalab/projects/varnalab-static;
  try_files /$1/$2 =404;
}

root /home/varnalab/config/varnalab-static;

location ~ /about {
  try_files /build/about.html =404;
}
location ~ /events/(\d+) {
  try_files /build/events/$1.html =404;
}
location ~ /events {
  try_files /build/events.html =404;
}
location ~ /members {
  try_files /build/members.html =404;
}
location ~ /links {
  try_files /build/links.html =404;
}
location ~ /contacts {
  try_files /build/contacts.html =404;
}
location ~ / {
  try_files /build/home.html =404;
}
```
