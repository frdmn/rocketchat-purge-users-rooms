# rocketchat-purge-users-rooms

Simple Node CLI tool to purge either all users and/or all groups (private and public)of a [Rocket.Chat](https://rocket.chat/) server.

## Installation

1. Make sure you've installed all requirements
2. Clone this repository:

    ```shell
    git clone https://github.com/frdmn/rocketchat-purge-users-rooms
    ```

3. Install the project dependencies:

    ```shell
    npm install
    ```

## Usage

1. Copy and adjust configuration file from sample:

    ```shell
    cp config.sample.json config.json
    vi config.json
    ```

    Make sure it contains proper user (with administration access) credentials

#### Show man/help page:

```shell
$ node purge.js
Usage: purge [options]

CLI tool to purge Rocket.Chat users/rooms

Options:
-V, --version   output the version number
-c, --channels  Purge all (public) channels, except default ones
-g, --groups    Purge all (private) groups
-u, --users     Purge all users, except users of roles "admin" and "bot"
-h, --help      output usage information
error:  No option passed. Aborting...
```

#### Purge channels, groups and users

```shell
$ node purge.js -c -g -u
[channels] Starting to search for possible channels to purge...
[channels] Added 2 to the queue...
[channels] Queue contains 2 elements in total.
[channels] Deleted #zDykSmzvRuekbS4oG
[channels] Deleted #zagMn5D7mLWxu3XbB
[channels] purge completed
[groups] Starting to search for possible groups to purge...
[groups] Added 3 to the queue...
[groups] Queue contains 3 elements in total.
[groups] Deleted #96koEnrof74XEDcFA
[groups] Deleted #fokfsYpFHs4TD2eTs
[groups] Deleted #9gygaNdNNfo7bJR2C
[groups] purge completed
[users] Starting to search for possible users to purge...
[users] Added 2 to the queue...
[users] Queue contains 2 elements in total.
[users] Deleted #ZdpW2JKHSPmwunkkx
[users] Deleted #b5xbYSCzbrLa5z2X7
[users] purge completed
[general] purge process completed
```

#### Purge public channels

```shell
$ node purge.js -c
[channels] Starting to search for possible channels to purge...
[channels] Added 2 to the queue...
[channels] Queue contains 2 elements in total.
[channels] Deleted #zDykSmzvRuekbS4oG
[channels] Deleted #zagMn5D7mLWxu3XbB
[channels] purge completed
[general] purge process completed
```

#### Purge private groups

```shell
$ node purge.js -g
[groups] Starting to search for possible groups to purge...
[groups] Added 3 to the queue...
[groups] Queue contains 3 elements in total.
[groups] Deleted #96koEnrof74XEDcFA
[groups] Deleted #fokfsYpFHs4TD2eTs
[groups] Deleted #9gygaNdNNfo7bJR2C
[groups] purge completed
```

#### Purge users

```shell
$ node purge.js -u
[users] Starting to search for possible users to purge...
[users] Added 2 to the queue...
[users] Queue contains 2 elements in total.
[users] Deleted #ZdpW2JKHSPmwunkkx
[users] Deleted #b5xbYSCzbrLa5z2X7
[users] purge completed
[general] purge process completed
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

0.1.0

## License

[MIT](LICENSE)
