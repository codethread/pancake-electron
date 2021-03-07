# Pancake
The Github Pull Request Dashboard

## Usage

pending...

## Contributing

Pancake is an [electron](https://www.electronjs.org/) app built using:
- [Typescript](https://www.typescriptlang.org/) throughout (with very strict settings)
- [React](https://reactjs.org/) for the GUI
- [Storybook](https://storybook.js.org/docs/react/get-started/introduction) for building components and User documentation
- [Backstop.js](https://garris.github.io/BackstopJS/) for visual regression tests
- [Spectron](https://www.electronjs.org/spectron) for e2e tests running against the production electron app (it's a wrapper around [webdriver.io](https://v6.webdriver.io/docs/api.html) which in turn wraps selenium)
- Github actions for CI (not yet supporting publishing)

Install a node manager of your choice (volta is supported and recommended)

Install Dependencies
```bash
yarn install
```

Run the electron app and client locally
```bash
yarn dev
```

Run storybook for developing UI components
```bash
yarn storybook
```

Some other useful commands

| command | description |
| --- | --- |
| `yarn clean` | [**aggresive**] remove all files not recognised by git, then install all dependencies |
| `yarn lint` | use eslint to check source code in the repo for errors |
| `yarn test` | use [ts-jest](https://kulshekhar.github.io/ts-jest/) to run the project's unit tests. This will also compile via [typescript](https://www.typescriptlang.org/) to check for type errors as part of ts-jest|
| `yarn visual` | use backstop.js to run visual regression tests against a running storybook (`yarn storybook`). **Does not yet run on CI, so please run locally before opening Pull Requests.** |
| `yarn e2e` | run spectron tests located in the e2e folder. **run `yarn build` before running**|
| `yarn build` | build the project for production and e2e testing (no the same as the release script) |
| `yarn checks` | runs the full checklist of lint, test, build and e2e ||
| `yarn docker-e2e` | runs the e2e tests via a Dockerfile in a headless state - this is how CI will run these tests |
| `yarn release` | see [releasing wiki](https://github.com/AHDesigns/pancake-electron/wiki/Releasing) for information


## License

[MIT](https://choosealicense.com/licenses/mit/)
