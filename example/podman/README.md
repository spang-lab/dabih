# Deploy dabih using Podman

## Install

- Install Podman
- Install podman-compose

## Preparations

- Set up a volume:

```sh
docker volume create --driver local --opt device=./data --opt o=bind dabih-data
```

## Dabih install

Clone the repo

```sh
git clone https://github.com/spang-lab/dabih.git
```
