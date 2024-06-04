# Mesh Examples

This repository contains examples of how to use the `meshsdk` package.

### System Requirements

- Nodejs
- NPM

### Installation

```bash
npm install
```

### Run

```bash
npx tsx folder-name/file-name.ts # e.g. npx tsx send-lovelace.ts
```

# Yaci Examples

### System Requirements

- Nodejs
- NPM
- Docker

### Start Yaci and run demo

Install the dependencies

```
npm install
```

Start the DevKit containers and yaci-cli

```
npm run yaci:start
```

After the containers are up, you can access the yaci-cli by running the following command to start a node

```
yaci-cli:> create-node -o --start
```

After the node has started, you can topup this address with some ADA

```
yaci-cli:> topup addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr 2000
```

Open a new terminal and run the following command to execute a demo script

```
npx tsx mesh/filename.ts # npx tsx mesh/yaci-send-lovelace.ts
```

### Useful links

- Yaci Viewer - to view the blockchain: http://localhost:5173
- Swagger UI - to view the API documentation: http://localhost:8080/swagger-ui/index.html
- Mesh SDK - to interact with the blockchain: https://meshjs.dev/
