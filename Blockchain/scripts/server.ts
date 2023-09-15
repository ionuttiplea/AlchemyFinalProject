const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
import NodeRSA from 'node-rsa';
import crypto from 'crypto';
import {Buffer} from 'buffer';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

const encodeCID = (CID: string, publicKey: string) => {

    // Convert the hexadecimal string to a Buffer
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');

    // Create a new NodeRSA instance
    const nodeRSA = new NodeRSA();
    nodeRSA.importKey(publicKeyBuffer, 'public');

    const encrypted = nodeRSA.encrypt(Buffer.from(CID), 'base64');
    const encryptedBuffer =  crypto.publicEncrypt( publicKey, Buffer.from(CID) );

    return encrypted;
}

app.post('/message', async (req, res) => {
    try {
        res.json(encodeCID(req.body.CID, req.body.publicKey));
    } catch (e) {
        console.log(e);

        res.json(e);
    }
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});