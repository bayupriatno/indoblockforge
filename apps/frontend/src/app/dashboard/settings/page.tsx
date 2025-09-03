"use client";

import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Memuat...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Pengaturan Akun</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Informasi Profil</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600">Nama Pengguna</label>
            <p className="text-gray-800 font-medium">
              {session?.user?.name || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-gray-600">Email</label>
            <p className="text-gray-800 font-medium">
              {session?.user?.email || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Keamanan</h2>
        <p className="text-gray-600">
          Di sini Anda dapat mengelola pengaturan keamanan, seperti mengubah kata sandi atau mengaktifkan otentikasi dua faktor (2FA).
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => alert("Fitur ubah kata sandi sedang dalam pengembangan.")}
        >
          Ubah Kata Sandi
        </button>
      </div>
    </div>
  );
}
