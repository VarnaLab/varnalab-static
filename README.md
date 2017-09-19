
# varnalab-static

## Install

```bash
# install Node Version Manager
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
# install Node 8
nvm install 8
# clone this repo
git clone https://github.com/VarnaLab/varnalab-static.git
# enter project's folder
cd varnalab-static
# install deps
npm i
# create config.json
{
  "development": {
    "scheme": "http",
    "host": "localhost:3000",
    "path": "",
    "port": 3000,
    "assets": "/path/to/varnalab-static",
    "html": "/path/to/varnalab-static/build",
    "api": "https://box.outofindex.com/varnalab/api",
    "git": {
      "repo": "/path/to/varnalab-static",
      "remote": "origin",
      "branch": "master",
      "secret": ""
    }
  }
}
# render in the current folder (notice the `.` at the end)
node bin/ --config config.json --env development --render .
# serve the static files using NodeJS
node bin/ --config config.json --env development --server
# navigate to http://localhost:3000 in your favorite browser
```

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
    "api": "https://box.outofindex.com/varnalab/api",
    "git": {
      "repo": "/home/s/projects/varnalab-static",
      "remote": "varnalab",
      "branch": "master",
      "secret": "..."
    }
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
location ~ /api/?(.*)/? {
  set $endpoint $1;
  proxy_pass http://127.0.0.1:5050/api/$endpoint;
}

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
