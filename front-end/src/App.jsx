import { Stack, Typography } from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import abiAccessControl from "./abi/AccessControlFaucet.json";
import { MedicPage } from "./MedicPage";
import { User } from "./User";
import { OwnerPage } from "./OwnerPage";

const providerUrl = "http://127.0.0.1:8545/";
const address = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isMedic, setIsMedic] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }
  });

  useEffect(() => {
    if (account !== null) {
      checkIsMedic(account).then(
        res => {
          setIsMedic(res);
        }
      );
      checkIsOwner(account).then(
        res => {
          setIsOwner(res);
        }
      );
    }

  }, [account]);

  const connectHandler = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await accountsChanged(res[0]);
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
      }
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const checkIsOwner = async (account) => {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(address, abiAccessControl, provider);

    const isMedic = await contract.hasRole(
      ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("OWNER")
      ),
      account
    );

    return isMedic;
  }

  const checkIsMedic = async (account) => {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(address, abiAccessControl, provider);

    const isMedic = await contract.hasRole(
      ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("MEDIC")
      ),
      account
    );

    return isMedic;
  }

  const accountsChanged = async (newAccount) => {
    try {
      if (newAccount) {
        if (typeof newAccount !== 'string') {
          newAccount = newAccount[0];
        }

        setAccount(newAccount);
        const myBalance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [
            newAccount
          ]
        });
        setBalance(ethers.utils.formatEther(myBalance));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  const chainChanged = () => {
    setErrorMessage(null);
    setAccount(null);
    setBalance(null);
  };

  return (
    <div>
      <Stack spacing={2}>
        {!account ? (
          <button className={"btn btn-gradient-border btn-glow"} onClick={connectHandler}>Connect With Metamask </button>
        ) :
          isMedic ? <MedicPage props={account} /> :
            isOwner ? <OwnerPage props = {account}/> :
            <User account={account} />
        }
        {errorMessage ? (
          <Typography variant="body1" color="red">
            Error: {errorMessage}
          </Typography>
        ) : null}
      </Stack>
    </div>

  );
};

export default App;
