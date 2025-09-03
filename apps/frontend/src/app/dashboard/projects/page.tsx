"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
};

export default function ProjectsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const token = session?.accessToken;

  const { data: projects, error, isLoading } = useSWR(
    token ? ["http://localhost:3001/api/projects", token] : null,
    ([url, token]) => fetcher(url, token as string)
  );

  if (isLoading) return <div>Memuat proyek...</div>;
  if (error) return <div>Gagal memuat proyek.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Proyek Anda</h1>
        <Link href="/projects/create">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
            + Buat Proyek Baru
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <div key={project.id} className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <Link href={`/projects/${project.id}`}>
              <button className="mt-4 text-blue-500 hover:underline">
                Lihat Detail
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
