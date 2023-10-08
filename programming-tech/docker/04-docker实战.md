


```bash
➜  web git:(main) ✗ docker ps
CONTAINER ID   IMAGE                COMMAND                   CREATED              STATUS              PORTS      NAMES
e4edc18a2b87   node-client:latest   "docker-entrypoint.s…"   About a minute ago   Up About a minute   3008/tcp   competent_elion


docker cp ./package.json competent_elion:/usr/share

docker cp ./project.tt.json competent_elion:/usr/share
```