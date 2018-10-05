# pariswebapp

## Demo apps for React/Redux performance workshop at Paris Web 2018

Workshop page: [Petits trucs pour rendre vos applications React plus performantes](https://www.paris-web.fr/2018/ateliers/petits-trucs-pour-rendre-vos-applications-react-plus-performantes.php)

- [Voir les slides (FR)](https://julienw.github.io/presentation-react-perf-parisweb-2018/index.html)
- [Voir le dépot des slides (FR)](https://github.com/julienw/presentation-react-perf-parisweb-2018)

## Installation for local app development

Prerequisites:
- nvm (or Node.js 10 recommended)

```
git clone git@github.com:ziir/pariswebapp.git
cd pariswebapp
nvm install
npm install -g yarn
./install-all.sh
```

## Run an app for local app development

```
cd react-1
yarn start
```

## Run the webserver serving all the apps

```
./build-all.sh
yarn dev
```

## Live

The apps are deployed on https://parisweb.app.
Domain is registered via [GANDI](https://www.gandi.net).

[Register a domain name via GANDI](https://shop.gandi.net/domain/suggest)

The [Paris Web App homepage](https://parisweb.app) lists the available apps.

Note: the apps are deployed in a semi-production mode to allow (react) profiling.

Each app is accessible using the following pattern:
- https://parisweb.app/react-1
- https://parisweb.app/react-2
- https://parisweb.app/react-3
- etc...

## Deployment

Apps are deployed to [GANDI Simple Hosting Node.js S+](https://www.gandi.net/en/simple-hosting).

[More information on how to deploy a similar setup of React apps to GANDI Simple Hosting.](https://github.com/ziir/pariswebapp/pull/17)

## Contributors

### Timothée Pillard

- Twitter: [@tpillard](https://twitter.com/tpillard)
- GitHub: [@ziir](https://github.com/ziir)

### Julien Wajsberg

- Twitter: [@jwajsberg](https://twitter.com/jwajsberg)
- GitHub: [@julienw](https://github.com/julienw)
