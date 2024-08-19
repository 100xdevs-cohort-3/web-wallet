import { useState } from "react";
import PropTypes from "prop-types";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import axios from 'axios';


export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [currentBalance, setCurrentBalance] = useState({});


    const checkBalance = async (address) => {
        try {
            const alchemyUrl = 'https://solana-mainnet.g.alchemy.com/v2/fwB2uvS6ehmDVwz6CDPZ7EBK5mR9dcK1';
            const body = {
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [address]
            }

            const response = await axios.post(alchemyUrl, body);

            if (response.data.error) {
                console.error('Error fetching balance:', response.data.error);
                alert("ERROR OCCURED: " + response.data.error)
            } else {
                const balance = response.data.result.value;
                // console.log(response)
                console.log(`Balance for address ${address}:`, balance);
                setCurrentBalance((prevBalances) => ({
                    ...prevBalances,
                    [address]: balance.toString(),
                }));
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }
    return <div>
        <button onClick={async function () {
            const seed = await mnemonicToSeed(mnemonic);
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            setCurrentIndex(currentIndex + 1);
            setAddresses([...addresses, keypair.publicKey]);
        }}>
            Add SOL wallet
        </button>
        {addresses.map((address, index) => <div key={index} className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-900 hover:from-slate-200 hover:to-slate-500 transition-all duration-300 flex items-center">
            {address.toBase58()}
            <span className="ml-4 mt-4">
                <button onClick={() => checkBalance(address)} className="bg-transparent hover:bg-blue-500 text-blue-700 text-base hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Check Balance</button>
                <span className="ml-2 mt-2" id="currentBalance">
                    Current Balance = {currentBalance[address] || ''}
                </span>
            </span>
        </div>)}
    </div>
}

SolanaWallet.propTypes = {
    mnemonic: PropTypes.string.isRequired,
};