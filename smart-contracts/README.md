# SMART CONTRACT

### What you need to prepare first?

Metamask: <br> We use it to interactive with chain.<br>
IPFS UI APP: <br> We use IPFS to distributed store Company Certificate.<br>
Ganache: <br> To reduce the cost of developing, we use locally ganache network to replace developing the contract on the sepolia testnet.

### 1. Download Address

| APP        | URL   |  Version |
| :--------  | :-----  | :----:  |
| Ganache | [Ganache](https://archive.trufflesuite.com/ganache/#) |For Mac|
|  | [Ganache](https://github.com/trufflesuite/ganache-ui/releases) |For Others|
| IPFS | [IPFS](https://ipfs.tech/) |For all|
| Metamask | [Metamask](https://metamask.io/zh-CN/) |For all|

### 2. Process

### step1 : Install IPFS, Ganache and Open

### step2 :

```
cd smart-contracts/
npm install
npm run init
```

then it will pop up a tips

```
npm run init

> smart-contracts@1.0.0 init
> node scripts/init-project.js

=== Initializing Project ===

Found Ganache account: JsonRpcSigner {
  provider: JsonRpcProvider {},
  address: '0xbe144C8444AF2766d8170D56877FEd84eE5fE1E7'(depends on your own ganache address)
}
Account balance: 99.998732792201101122 ETH

Please open Ganache UI and copy the private key for this address:
1. Click on the key icon next to the account
2. Copy the private key (including 0x prefix)
Enter the private key:
```

find the accourding private key in your local ganache and type in to `CLI`
then you have finish initialization

then

```
npm start
```

then you can see the smart-contract running on port: 3001