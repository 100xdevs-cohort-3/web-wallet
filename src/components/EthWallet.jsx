import { useState } from 'react';
import { mnemonicToSeed } from 'bip39';
import { Wallet, HDNodeWallet } from 'ethers';
import axios from 'axios';
import PropTypes from 'prop-types';

const EthWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [currentBalance, setCurrentBalance] = useState({});

    const addEthWallet = async () => {
        // eslint-disable-next-line no-unused-vars
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        setCurrentIndex(currentIndex + 1);
        setAddresses([...addresses, wallet.address]);
    };

    const checkBalance = async (address) => {
        try {
            const alchemyUrl = 'https://eth-mainnet.g.alchemy.com/v2/fwB2uvS6ehmDVwz6CDPZ7EBK5mR9dcK1';
            const body = {
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBalance',
                params: [address, 'latest'],
            };

            const response = await axios.post(alchemyUrl, body);

            if (response.data.error) {
                console.error('Error fetching balance:', response.data.error);
                alert("ERROR OCCURED: " + response.data.error)
            } else {
                const hexBalance = response.data.result;
                const balance = parseInt(hexBalance.toString(), 16).toString();
                console.log(`Balance for address ${address}:`, balance);
                setCurrentBalance((prevBalances) => ({
                    ...prevBalances,
                    [address]: balance,
                }));
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    return (
        <div>
            <button onClick={addEthWallet}>Add ETH wallet</button>

            {addresses.map((address, index) => (
                <div key={index} className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-900 hover:from-slate-200 hover:to-slate-500 transition-all duration-300 flex items-center">
                    Eth - {address}
                    <span className="ml-4 mt-4">
                        <button
                            className="bg-transparent hover:bg-blue-500 text-blue-700 text-base hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                            onClick={() => checkBalance(address)}
                        >
                            Check Balance
                        </button>
                        <span className="ml-4 mt-4" id="currentBalance">
                            Current Balance = {currentBalance[address] || ''}
                        </span>
                    </span>
                </div>
            ))}
        </div>
    );
};

EthWallet.propTypes = {
    mnemonic: PropTypes.string.isRequired,
};

export default EthWallet;