"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/services/api";
import { ethers } from "ethers";

interface Project {
  id: string;
  name: string;
  description: string;
}

interface DeployedContract {
  id: string;
  name: string;
  address: string;
  abi: string;
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const projectId = params.id;
  const token = session?.accessToken;

  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedContract, setSelectedContract] = useState<DeployedContract | null>(null);

  const { data: project, error: projectError, isLoading: projectLoading } = useSWR(
    token ? [`http://localhost:3001/api/projects/${projectId}`, token] : null,
    ([url, token]) => fetcher(url, token as string)
  );

  const { data: contracts, error: contractsError, isLoading: contractsLoading } = useSWR(
    token ? [`http://localhost:3001/api/projects/${projectId}/contracts`, token] : null,
    ([url, token]) => fetcher(url, token as string)
  );

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setWalletAddress(await signer.getAddress());
        setWalletConnected(true);
        alert("Dompet berhasil terhubung!");
      } catch (error) {
        alert("Gagal menghubungkan dompet.");
      }
    } else {
      alert("Silakan instal MetaMask!");
    }
  };

  const handleGetBalance = async () => {
    if (!selectedContract) return;
    if (!walletConnected) {
        alert("Silakan hubungkan dompet Anda terlebih dahulu.");
        return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(selectedContract.address, JSON.parse(selectedContract.abi), provider);
        const balance = await contract.balanceOf(walletAddress);
        alert(`Saldo saat ini: ${ethers.formatEther(balance)}`);
    } catch (error) {
        alert("Gagal mendapatkan saldo.");
    }
  };

  if (projectLoading) return <div>Memuat detail proyek...</div>;
  if (projectError) return <div>Gagal memuat proyek. Pastikan Anda memiliki akses.</div>;
  if (!project) return <div>Proyek tidak ditemukan.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Hubungkan Dompet Anda</h2>
        {!walletConnected ? (
          <button onClick={connectWallet} className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Hubungkan MetaMask
          </button>
        ) : (
          <div className="text-green-600 font-medium">Dompet terhubung: {walletAddress}</div>
        )}
      </div>

      <div className="mt-8">
        <label className="block text-gray-700 font-bold mb-2">Pilih Jaringan</label>
        <select
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
        </select>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Kontrak yang di-Deploy</h2>
        {contractsLoading && <div>Memuat kontrak...</div>}
        {contractsError && <div>Gagal memuat kontrak.</div>}
        <div className="space-y-4">
          {contracts?.map((contract: DeployedContract) => (
            <div 
              key={contract.id} 
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedContract(contract)}
            >
              <h3 className="font-bold">{contract.name}</h3>
              <p className="text-sm text-gray-500">Alamat: {contract.address}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedContract && (
        <div className="mt-8 p-6 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Interaksi Kontrak: {selectedContract.name}</h2>
          <div className="p-4 border rounded-lg bg-white">
            <p className="mb-2"><strong>Alamat:</strong> {selectedContract.address}</p>
            <button
              onClick={handleGetBalance}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Dapatkan Saldo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
