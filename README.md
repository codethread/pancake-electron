# Pancake 🍅

Github at a glance

## Usage

**🚧 Currently in Beta**

_MacOS only right now_

To use the app, head to the [Releases](https://github.com/AHDesigns/pomo-electron/releases) and grab
the `.dmg` or `arm64.dmg` file, depending on whether you've got an intel or arm chip (`assets` is a
dropdown, see screenshot below, the `version` number may change, but you get the idea).

There are many small features to add and these are tracked on the [Roadmap](https://github.com/codethread/pancake-electron/projects/4)

Please [raise any bugs or request any features here](https://github.com/codethread/pancake-electron/issues/new/choose).

## Contributing

_Pancake is not yet ready for contribution, but once V1 is released, all contributions will be welcome,
and the approach to making changes will be very clear_

Pancake is an [electron](https://www.electronjs.org/) app built using:

- [Typescript](https://www.typescriptlang.org/) throughout (with very strict settings)
- [React](https://reactjs.org/) for the GUI
- [Xstate](https://xstate.js.org/docs/) for state management
- [Playwright](https://playwright.dev/) for electron e2e testing, and visual regression tests
- [Storybook](https://storybook.js.org/docs/react/get-started/introduction) for building components
  and User documentation
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

| command            | description                                                                                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn clean`       | [**aggressive**] remove all files not recognised by git, then install all dependencies                                                                                                                     |
| `yarn dev`         | run the project locally in watch mode, both in browser and electron                                                                                                                                        |
| `yarn lint`        | use eslint to check source code in the repo for errors                                                                                                                                                     |
| `yarn test`        | use [ts-jest](https://kulshekhar.github.io/ts-jest/) to run the project's unit tests. This will also compile via [typescript](https://www.typescriptlang.org/) to check for type errors as part of ts-jest |
| `yarn e2e`         | run playwright tests located in the e2e folder. **run `yarn build` before running**                                                                                                                        |
| `yarn e2e:approve` | update visual regression tests with latest snapshots                                                                                                                                                       |
| `yarn build`       | build the project for production and e2e testing (no the same as the release script)                                                                                                                       |
| `yarn checks`      | runs the full checklist of lint, test, build and e2e                                                                                                                                                       |
| `yarn docker-e2e`  | runs the e2e tests via a Dockerfile in a headless state - this is how CI will run these tests                                                                                                              |
| `yarn release`     | see [releasing wiki](https://github.com/codethread/pancake-electron/wiki/Releasing) for information                                                                                                        |

## License

[MIT](https://choosealicense.com/licenses/mit/)
