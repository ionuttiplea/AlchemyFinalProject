import { ethers } from "ethers";
import React, { useState } from "react";
import abiMedicOperationsFaucet from "./abi/MedicOperationsFaucet.json";
import { create } from "ipfs-http-client";

const providerUrl = "http://127.0.0.1:8545/";
const address = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

const ipfs = create({
    port: "5001", headers: {
        "Access-Control-Request-Headers": "*",
        "Access-Control-Request-Method": "*"
    },
});// by default url will be localhost:5001

export const MedicPage = (props) => {
    const account = props.account;
    const [pacientName, setPacientName] = useState('');
    const [reportCID, setReportCID] = useState('');
    const [reports, setReports] = useState([]);
    const [pdfData, setPdfData] = useState({});

    const onFileLoad = (event) => {
        setPdfData(event.target.files[0]);
    }

    const fieldChanged = event => {
        switch (event.target.name) {
            case "pacientName":
                setPacientName(event.target.value);
                break;
            case "reportCID":
                setReportCID(event.target.value);
                break;
            default:
                console.log("An error has occured");
        }
    }

    const getReports = async () => {

        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        let contract = new ethers.Contract(address, abiMedicOperationsFaucet, provider);
        const signer = await (new ethers.providers.Web3Provider(window.ethereum)).getSigner();

        const response = await contract.connect(signer).medicGetReportsForPacient(
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes(pacientName))
        );

        setReports(response);
    }

    const handleSubmit = async event => {
        event.preventDefault();

        if (!pacientName) {
            return;
        }

        if (!pdfData || pdfData.length === 0) {
            return alert("No files selected");
        }
        try {
            const result = await ipfs.add(pdfData);
            const provider = new ethers.providers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(address, abiMedicOperationsFaucet, provider);
            const signer = await (new ethers.providers.Web3Provider(window.ethereum)).getSigner();
            const tx = await contract.connect(signer).medicAddReport(
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes(pacientName)),
                result.path
            );
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <h1>Hello Medic !!!!</h1>
            <h2> Complete This Form</h2>
            <div className="box">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="pacientName" placeholder="Pacient Name" onChange={fieldChanged} />
                    <input type="file" accept=".pdf" onChange={onFileLoad} />
                    <input type="submit" value={"Upload Report"} />
                </form>
                <button className="inFormButton" onClick={getReports}> Get Reports for Pacient mentioned above</button>
            </div>
            <div className="secondContainer" >
                {reports.length > 0 && (
                    <>
                    <h2>These are the reports CIDs you made for the pacient mentioned above:</h2>
                    <ol type="1">
                    {
                    reports.map((item, index) => (
                        <li > { ++index + '. ' + item[0]} </li>
                    ))}
                </ol>
                    </>)
                }
            </div>
        </div>
    );
}