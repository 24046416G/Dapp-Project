# Project Front-End Installation Guide

## Prerequisites

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

## MetaMask Configuration Guide

### 1. Add Custom Network
![Add Custom Network](./guide/step1.png)

click "Add a custom network"

![Add Custom Network](./guide/step2.png)

### 2. Configure Network Settings
- Network Name: Ganache Test
- RPC URL: http://127.0.0.1:7545
- Chain ID: 1337
- Currency Symbol: ETH

Note: You can use check the RPC URL in the Ganache, it is usually http://127.0.0.1:7545, and the Chain ID is 1337
![Network Settings](./guide/step3.png)


### 3. Import Accounts
Click your account, and then click "Add account or hardware wallet"

![Add Account](./guide/step5.png)


### 4. Import Account Using Private Key
- Get the private key from Ganache

![Get Private Key](./guide/step7.png)

- Use it to import the account into MetaMask

![Import Account](./guide/step6.png)

### 5. Account Overview
After successful configuration, you should see your account balance and details:

![Account Overview](./guide/step8.png)

## Important Notes
- Make sure Ganache is running on port 7545
- Use the network ID 1337 for local development
- Never share or commit your private keys
- Only use test accounts for development
