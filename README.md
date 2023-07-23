# Vouch

![vouch-banner](./images/banner.png)

## The future of lending is here with undercollateralised loans

Introducing Vouch, a new lending platform set to bring undercollateralised loans to millions around the world. We believe that trust is the cornerstone of any society, and with Vouch, we're unlocking the power of social networks to provide undercollateralized loans to millions worldwide. Leverage your connections, reputation, and community support to gain quick and easy access to funds when you need them most, one Vouch loan at a time.

## Prerequisities

```shell
npm or yarn
node v18 >=
```

### Installing dependencies

```
$ npm i
$ cd app
$ npm i
```

### Populating Enviroment Variables

```
$ cp .env.template .env
```

Populate your `.env` file with your RPCs, private key and etherscan api key.

```
$ cd app
$ touch .env && touch .env.local
```

Follow the template of the `.env.template` file.

## Deploying Contract

To setup different chains or providers, check the `hardhat.config.ts` and `.env` file 

```
$ hh run scripts/deploy.ts --network [network]
```

## Running the Frontend

### Populating the contract information

Check the `constants` directory and ensure that the ABI and deployed contract address match.

Run the development server:

```
$ yarn dev
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.