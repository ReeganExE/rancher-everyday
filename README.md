# Rancher Everyday

<center>
  <img src="https://ninhnongnoi.com/img/rancher-logo-square.png" width="200px" />
</center>

Rancher is an open source software platform that enables organizations to run and manage Docker and Kubernetes in production. Rancher gives us UI to manage containers, hosts, statuses and much more.

But the problem is when you have a lot microservices, navitating between them require too much steps. you need something like <kbd>Ctrl + P</kbd> in **Sublime Text**, **VS Code** that helps you navigate to any services easily?


Yes, this extension is for you. Once you add the extension to your browser on the specified domain, you're able to <kbd>Ctrl + Space</kbd> anytime in your Rancher UI.

## Build your own one

```sh
export RANCHER_ADDR=https://rancher.your-company.com
npm run build
```

It will build and extract bundle to `./dist` directory.

## Add to browser
### Google Chrome
- Go to `chrome://extensions/`
- Enable `Developer Mode`
- Click `Load Unpack`
- Navigate to `./dist` and select any file

### Firefox
- Go to `about:debugging`
- Click `Load Temporary Add-on`
- Navigate to `./dist` and select any file

## Run Test

```sh
npm test
```
## Lint

```sh
npm run lint
```


## Technology

- Latest Webpack 4
- Latest Babel 7
- React 16.5
- CSS Module
- Latest ESLint Airbnb

## LICENSE

MIT @ Ninh Pham