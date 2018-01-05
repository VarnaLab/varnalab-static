
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
> Note: "git" settings is not used in development environment

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

