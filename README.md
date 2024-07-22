# Drizzle ORM connector for SingleStore

## Usage

1. [Sign up](https://www.singlestore.com/try-free/) for a free SingleStore license. This allows you
   to run up to 4 nodes up to 32 gigs each for free. Grab your license key from
   [SingleStore portal](https://portal.singlestore.com/?utm_medium=osm&utm_source=github) and set it as an environment
   variable.

   ```bash
   export SINGLESTORE_LICENSE="singlestore license"
   ```

## Developing

We have two main folders:

- `test`: Unit tests.
- `app`: A small test app with a simple API.
- `src`: The source code of the package we're developing.

### `npm` commands

- `npm test`: Runs the unit tests
- `npm start`: Starts the test app
- `npm generate`: Creates migrations as needed for the test app
- `npm migrate`: Apply migrations as needed for the test app

## Resources

- [Documentation](https://docs.singlestore.com)
- [Twitter](https://twitter.com/SingleStoreDevs)
- [SingleStore forums](https://www.singlestore.com/forum)
