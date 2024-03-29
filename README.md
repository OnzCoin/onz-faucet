# ONZ Faucet

## Prerequisites

- Node.js + npm (https://github.com/nodesource/distributions)
- Redis (http://redis.io)

- PM2 (https://github.com/Unitech/pm2) -- PM2 manages the node process for Onz Faucet and handles log rotation (Highly Recommended)

  `sudo npm install -g pm2`
  
- PM2-logrotate (https://github.com/pm2-hive/pm2-logrotate) -- Manages PM2 logs

  ```
  pm2 install pm2-logrotate
  pm2 set pm2-logrotate:max_size 100M
  ```

## Installation

1. Install node modules:

  ```
  npm install
  ```

2. Start redis-server:

  ```
  redis-server > /dev/null 2>&1 &
  ```

## Configuration

Open `config.json` and complete the following details.

1. Edit your [reCaptcha](https://www.google.com/recaptcha/) public/private keypair:

  ```js
  "captcha" : {
      "publicKey" : "",     // <-- Your publicKey
      "privateKey" : ""     // <-- Your privateKey
  }
  ```

  **NOTE:** There are two separate keypairs for development and production environments.

2. Edit your ONZ node connection details:

  ```js
  "onz" : {
      "host" : "127.0.0.1", // <-- Server IP/hostname
      "port" : 10998,       // <-- 10998 for testnet, 11000 for mainnet
      "passphrase" : "",    // <-- Passphrase of faucet account
      "address" : ""        // <-- Address of faucet account
      "nethash": "",        // <-- Nethash of the network
      "broadhash": "",      // <-- Broadhash of the network
      "version": "0.0.0a",  // <-- Expected version of onz node end point
      "minVersion": "0.0.0" // <-- Minimal version of onz node that will be accepted
  }
  ```

3. Edit your Redis connection details:

  ```js
  "redis" : {
      "host" : "127.0.0.1", // <-- Redis server host (default: 127.0.0.1)
      "port" : 6379,        // <-- Redis server port (default: 6379)
      "password" : ""       // <-- Redis server password
  }
  ```

4. Edit the faucet amount:

  ```js
  { "amount" : 1 }          // <-- Amount sent by faucet (default: 1)
  ```

## Launch

Development:

```
node app.js
```

Open: [http://localhost:3000](http://localhost:3000)

Production:

```
NODE_ENV=production node app.js
```

Once the process is verified as running correctly, `CTRL+C` and start the process with `PM2`. This will fork the process into the background and automatically recover the process if it fails.

`pm2 start pm2-faucet.json`

After the process is started its runtime status and log location can be found by issuing this statement:

`pm2 list`

To stop ONZ Faucet after it has been started with `PM2`, issue the following command:

`pm2 stop onz-faucet`


Open: [http://localhost:6000](http://localhost:6000)

## Authors
- Mars Yau <mars@onzcoin.com>
- Boris Povod <boris@crypti.me>
- Oliver Beddows <oliver@lisk.io>
- Max Kordek <max@lisk.io>

## License

The MIT License (MIT)

Copyright (c) 2017-2018 ONZ Coin
Copyright (c) 2016-2017 Lisk  
Copyright (c) 2014-2015 Crypti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
