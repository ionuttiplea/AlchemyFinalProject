import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import abiOwnerOperationsFaucet from "./abi/OwnerOperationsFaucet.json";

const providerUrl = process.env.REACT_APP_RPC_URL;
const address = process.env.REACT_APP_DIAMOND_ADDRESS;

export const OwnerPage = (props) => {
    const account = props.account;
    const [medicAddress, setMedicAddress] = useState('');

    const addMedic = async event => {
        event.preventDefault();

        if( ! medicAddress ) {
            alert( "Address is empty");
            return;
        }
        try {
            const provider = new ethers.providers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(address, abiOwnerOperationsFaucet, provider);
            const signer = await (new ethers.providers.Web3Provider(window.ethereum)).getSigner();
            const tx = await contract.connect(signer).addMedic(
                medicAddress
            );
        } catch (e) {
            console.log(e);
        }
    }

    const removeMedic = async event => {
        event.preventDefault();

        if( ! medicAddress ) {
            alert( "Address is empty");
            return;
        }
        try {
            const provider = new ethers.providers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(address, abiOwnerOperationsFaucet, provider);
            const signer = await (new ethers.providers.Web3Provider(window.ethereum)).getSigner();
            const tx = await contract.connect(signer).removeMedic(
                medicAddress
            );
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <h1>
                Hello Owner !!
            </h1>
            <form className="box" onSubmit={addMedic}>
                <input type="text" placeholder="Medic Address" onChange = { event => {
                    setMedicAddress(event.target.value);
                }} />
                <input type="submit" value="Add Medic" />
                <button className="inFormButton" onClick={removeMedic}>Remove Medic</button>
            </form>
        </div>
    );
}