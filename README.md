# rocketchat-purge-users-rooms

Simple Node CLI tool to purge either all users and/or all groups (private and public)of a [Rocket.Chat](https://rocket.chat/) server.

## Installation

1. Make sure you've installed all requirements
2. Clone this repository:

    ```shell
    git clone https://github.com/frdmn/rocketchat-purge-users-rooms
    ```

3. Copy and adjust configuration file from sample:

    ```shell
    cp config.sample.json config.json
    vi config.json
    ```

    Make sure it contains proper user (with administration access) credentials

4. Install the project dependencies:

    ```shell
    npm install
    ```

## Usage

Here's a short explanation how to use `rocketchat-purge-users-rooms`:

* Run `purge.js`:

    ```shell
    node purge.js
    ```

## Contributing

1. Fork it
2. Create your feature branch:

    ```shell
    git checkout -b feature/my-new-feature
    ```

3. Commit your changes:

    ```shell
    git commit -am 'Add some feature'
    ```

4. Push to the branch:

    ```shell
    git push origin feature/my-new-feature
    ```

5. Submit a pull request

## Requirements / Dependencies

* NodeJS

## Version

1.0.0

## License

[MIT](LICENSE)
