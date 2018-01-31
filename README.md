
# varnalab-static

Using http://mustache.github.io/ logic-less templates.

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
npm install

# create config.json
cp config.json.example config.json

# make changes to config.json with your favorite editor
$EDITOR config.json

# render in the current folder
node bin/ --config config.json --env development --render ./build/

# serve the static files using NodeJS
node bin/ --config config.json --env development --server

# navigate to http://localhost:3000 in your favorite browser
```

## Config

```json
{
  "production": {
    "url": {
      "scheme": "https",
      "host": "varnalab.org",
      "path": "",
      "api": "https://box.outofindex.com/varnalab/api"
    },
    "server": {
      "assets": "/home/varnalab/projects/varnalab-static",
      "port": 5050
    },
    "fs": {
      "articles": "/path/to/articles.json",
      "events": "/path/to/events.json",
      "members": "/path/to/users.json",
      "cashbox": "/path/to/invbg.json"
    },
    "git": {
      "repo": "/home/s/projects/varnalab-static",
      "remote": "varnalab",
      "branch": "master",
      "secret": "..."
    }
  }
}
```

- `url` ___(required)___
  - used to generate relative paths for the templates
  - used to generate absolute paths for server-side meta tag rendering
  - the api endpoint is used for rendering when the `fs` key is not present, and inside the whois widget
- `server` _(optional)_
  - used by the built-in static nodejs server
  - otherwise use the nginx config below to serve the static content
- `fs` _(optional)_
  - used to load the dynamic data locally. Renders only when any of the files is modified in the last 10mins. Use the `--force` flag to force the render.
  - otherwise falls back to making HTTP requests to the varnalab-api
- `git` _(optional)_
  - githook configuration for the varnalab-static repo
  - used only in production

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
  --server /path/to/build/location/
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
location ~ /blogs/(\d+)/(\d+)/(\d+)/(.+) {
  try_files /build/articles/$4.html =404;
}
location ~ /blogs {
  try_files /build/articles.html =404;
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
location ~ /finance {
  try_files /build/finance.html =404;
}
location ~ / {
  try_files /build/home.html =404;
}
```

