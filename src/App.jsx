import { useState } from 'react';
import './App.css';
import { generateMnemonic } from "bip39";
import { SolanaWallet } from './components/SolanaWallet';
import EthWallet from './components/EthWallet';

function App() {
  const [mnemonic, setMnemonic] = useState("");

  const generateSeedPhrase = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Create Seed Phrase</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={generateSeedPhrase}>
        Generate Seed Phrase
      </button>
      {mnemonic && (
        <div className="mt-8">
          <p className="text-lg font-semibold">Your Seed Phrase:</p>
          <pre className="bg-gray-900 p-4 rounded-lg">{mnemonic}</pre>
        </div>
      )}
      {mnemonic && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Choose a Wallet:</h2>
          <div className="flex flex-col space-y-4 mt-4">
            <SolanaWallet mnemonic={mnemonic} />
            <EthWallet mnemonic={mnemonic} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;