import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import abiPatientOperationsFaucet from "./abi/PacientOperationsFaucet.json";

const providerUrl = process.env.REACT_APP_RPC_URL;
const address = process.env.REACT_APP_DIAMOND_ADDRESS;

export const PacientPage = (props) => {
    const account = props.account;
    const [pacientName, setPacientName] = useState('');
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState('');

    useEffect( () => {

    }, [account] );

    const getPacientReports = async event => {
        event.preventDefault();

        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        let contract = new ethers.Contract(address, abiPatientOperationsFaucet, provider);

        const signer = await provider.getSigner(account);

        const response = await contract.connect(signer).getMedics(
            ethers.utils.keccak256( ethers.utils.toUtf8Bytes( pacientName ) )
        );

        let pacientReports = [];
        for( let i = 0; i < response.length; i ++) {
            const reportsFromMedic = await contract.connect(signer).getReportsFromMedic( response[i], ethers.utils.keccak256( ethers.utils.toUtf8Bytes( pacientName ) ));

            pacientReports = [].concat(pacientReports, reportsFromMedic);
        }
        
        setReports(pacientReports);
    }

    const getPacientReport = async event => {
        event.preventDefault();
        if( selectedReport ) {
            window.open("https://ipfs.io/ipfs/" + selectedReport);
            
        } else {
            alert("No report selected");
        }
    }

    return (
        <div>
            <h1>Hello Pacient !!!</h1>
             <form className = {"box"} onSubmit={getPacientReports}>
                <input type="text" name="pacientName" placeholder="Username" onChange={ event => {
                    event.preventDefault();
                    setPacientName(event.target.value);
                }} />
                <input type="submit" value={"Get Your Reports"}/>
            </form>
            <div className="secondContainer" >
                {reports.length > 0 && (
                    <>
                    <h2>These are your reports CIDs :</h2>
                    <ol type="1">
                    {
                    reports.map((item, index) => (
                        <li > { ++index + '. ' + item[0]} </li>
                    ))}
                </ol>
                    </>)
                }
            </div>

            <form className={"box"} onSubmit={getPacientReport}>
                <input type="text" name="CID" placeholder="Report CID" onChange={ event => {
                    event.preventDefault();
                    setSelectedReport(event.target.value);
                }} />
                <input type="submit" value={"Download Selected Report"}/>
            </form>
        </div>
    );
}