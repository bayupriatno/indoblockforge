import { getSession } from "next-auth/react";

/**
 * Fetcher untuk SWR yang menyertakan token otorisasi.
 * @param url URL endpoint API
 * @param token Token JWT dari sesi NextAuth
 */
export const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // Tangani error, misalnya jika token kedaluwarsa atau tidak valid
    const error = new Error('Terjadi kesalahan saat mengambil data.');
    // @ts-ignore
    error.info = await res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.json();
};

/**
 * Fungsi untuk melakukan request POST ke backend dengan otorisasi.
 * @param url URL endpoint API
 * @param data Data yang akan dikirim dalam body request
 */
export const postData = async (url: string, data: any) => {
  const session = await getSession();

  if (!session || !session.accessToken) {
    throw new Error("Tidak terotentikasi. Silakan login kembali.");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = new Error('Gagal mengirim data.');
    // @ts-ignore
    error.info = await res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.json();
};
