import { ethers } from "ethers";
import React, {useEffect, useState } from "react";
import abiPacientOperationsFaucet from "./abi/PacientOperationsFaucet.json";

const providerUrl = process.env.REACT_APP_RPC_URL;
const address = process.env.REACT_APP_DIAMOND_ADDRESS;

export const PacientRegistrationForm = (props) => {
    const account = props.account;
    const [username, setUserName] = useState("");
    const setRegistered = props.setRegistered;
    useEffect(() => {
    }, [account, username]);

    const fieldChanged = (event) => {
        if (event.target.name === "Username") {
            setUserName(event.target.value);
        }
    }

    const registerPacient = async (event) => {
        event.preventDefault();

        if (username && window.ethereum) {
            console.log( account );
            const provider = new ethers.providers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(address, abiPacientOperationsFaucet, provider);
            const signer = await (new ethers.providers.Web3Provider(window.ethereum)).getSigner();
            const tx = await contract.connect(signer).register(
                ethers.utils.keccak256( ethers.utils.toUtf8Bytes( username ) )
            );
            await tx.wait();
            setRegistered(true);
        }
    }

    return (
        <div className="myForm">
            <h1>Welcome !!</h1>
            <h2>Here you can register to our platform</h2>
            <h3> This step will only be done once, make sure you are connected with the right wallet address</h3>
            <h3> Also, keep your username private and share it only with the medics you trust</h3>
            <h4> Writting on the blockchain will come with a very small transaction fee, if you don't want or can't afford it ask the medic you are going to to register your account</h4>
            <form className="box" onSubmit={registerPacient}>
                <input type="text" placeholder="Username" onChange={fieldChanged} name="Username" />
                <input type="text" style={{ width: account.length * 6.5 + 'px' }} readOnly name="account" value={account} />
                <input type="submit" value={"Register Account"}/>
            </form>
        </div>
    );
}