# Medical Report Access Management

This project aims to store reports ID's, preferrably encrypted, and strongly secure access to the data stored on the contract.

I used a Diamond Proxy pattern.

There are multiple roles : Owner, Medic and Pacient.

The owner can add medic rights to an address.

The medic can add reports for pacients and read reports they made to a pacient.The reports that the pacient has from other medics are not visible.

The pacient can retrieve all the reports medics uploaded for him.

To deploy the contracts run the following:

    npx hardhat run ./scripts/deploy.ts

To test the contracts :

    npx hardhat test

To compile the contracts:

    npx hardhat compile 

You will need to copy the contracts abi's to blockchain shared in the front-end side( I did this already so they are up and going).

For local deployment you will need hardhat running in the background so use the following command in a different terminal:

    npx hardhat node

Then run : 

    npm run deploy:local

You can find the addresses of deployed contracts on sepolia in blockchain-shared/addresses.

