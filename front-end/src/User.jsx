import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import abiAccessControl from "./abi/AccessControlFaucet.json";
import { PacientRegistrationForm } from "./PacientRegistrationForm";
import { PacientPage } from "./PacientPage";

const providerUrl = "http://127.0.0.1:8545/";
const address = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

export const User = (props) => {
    const account = props.account;
    const [isPacient, setIsPacient] = useState(false);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        const checkIsPacient = async (account) => {
            const provider = new ethers.providers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(address, abiAccessControl, provider);
            const isMedic = (await contract.connect(provider).isUser(account));

            if( isMedic !== isPacient ) {
                setIsPacient(isMedic);
            }
        }
        if( account !== "0x0" ) {
            checkIsPacient(account).then();
        }

    }, [account], registered);

    return (
        <div>
            {
                !isPacient
                    ? <PacientRegistrationForm account={account} setRegistered={setRegistered} />
                    : <PacientPage account={account} />
            }
        </div>
    );
}