## Development

### Prerequisite

1. Make sure you have Node.js version >= 10.

- Using [nvm](https://github.com/creationix/nvm): `nvm use`.

### Environment variables

This project requires an access to the API. You have two options:

- `cp .env-staging .env` to connect to the staging API
- `cp .env-local .env` to connect to the API running locally

### Start

```
npm run dev
```

## Contributing

Code style? Commit convention? Please check our [Contributing guidelines](CONTRIBUTING.md).

TL;DR: we use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/), we do like great commit messages and clean Git history.

## Styleguide

We use [React-Styleguidist](https://react-styleguidist.js.org/) to develop and document our React components in isolation with [styled-components](https://www.styled-components.com/) and [styled-system](https://jxnblk.com/styled-system/).

### Start

```
npm run styleguide:dev
```
