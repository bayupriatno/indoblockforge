Panduan Deployment indoblockforge

Dokumen ini menjelaskan proses deployment end-to-end untuk proyek IndoBlockforge ke lingkungan produksi. Kami menggunakan alur kerja CI/CD yang terotomatisasi dengan GitHub Actions, Docker untuk containerisasi, dan Kubernetes untuk orkestrasi.
1. Build & Containerisasi
Langkah pertama adalah membangun image Docker untuk frontend dan backend. Image ini akan berisi semua kode aplikasi dan dependensi yang diperlukan agar dapat berjalan secara konsisten di mana pun.
Dockerfile
Proyek ini memiliki Dockerfile terpisah untuk frontend dan backend.
 * infra/docker/Dockerfile.frontend: Menggunakan build multi-stage untuk membuat image Next.js yang optimal.
 * infra/docker/Dockerfile.backend: Membuat image untuk API NestJS.
Perintah Lokal:
Anda dapat membangun image ini secara lokal untuk pengujian:
# Build image backend
docker build -t indoblockforge-backend -f infra/docker/Dockerfile.backend .

# Build image frontend
docker build -t indoblockforge-frontend -f infra/docker/Dockerfile.frontend .

2. Otomasi CI/CD dengan GitHub Actions
Kami menggunakan GitHub Actions untuk mengotomatisasi proses Build dan Deploy.
Alur Kerja (Workflow)
File .github/workflows/build-test.yml memastikan bahwa setiap perubahan kode yang didorong ke cabang main akan:
 * Checkout kode dari repositori.
 * Instal dependensi yang diperlukan.
 * Jalankan build untuk seluruh monorepo dengan Turborepo.
 * Jalankan test unit untuk semua aplikasi dan kontrak pintar.
Setelah semua tes lolos, Anda bisa menambahkan langkah deployment otomatis ke Docker Registry atau Kubernetes.
Contoh Langkah Deploy:
# Tambahkan di .github/workflows/build-test.yml

- name: Docker Login
  uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Build and push backend image
  uses: docker/build-push-action@v4
  with:
    context: .
    file: infra/docker/Dockerfile.backend
    push: true
    tags: your-docker-registry/indoblockforge-backend:latest

- name: Build and push frontend image
  uses: docker/build-push-action@v4
  with:
    context: .
    file: infra/docker/Dockerfile.frontend
    push: true
    tags: your-docker-registry/indoblockforge-frontend:latest

3. Orkestrasi dengan Kubernetes
Kubernetes mengelola container yang sudah kita buat. Konfigurasi Kubernetes ditempatkan di folder infra/k8s/.
Struktur Kubernetes YAML
 * indoblockforge-secrets.yaml: Menyimpan variabel lingkungan sensitif seperti kunci API dan kredensial database. Ini harus di-base64-encoded.
 * indoblockforge-backend-deployment.yaml: Mendefinisikan Deployment untuk backend, memastikan sejumlah replika (instance) selalu berjalan.
 * indoblockforge-backend-service.yaml: Membuat Service yang mengekspos Deployment backend di dalam cluster.
 * indoblockforge-frontend-deployment.yaml: Mendefinisikan Deployment untuk frontend.
 * indoblockforge-frontend-service.yaml: Membuat Service yang mengekspos Deployment frontend.
Langkah Deployment ke Kubernetes:
 * Pastikan Anda telah menginstal kubectl dan terhubung ke cluster Kubernetes Anda.
 * Terapkan file secrets terlebih dahulu.
   kubectl apply -f infra/k8s/indoblockforge-secrets.yaml

 * Kemudian, terapkan semua file Deployment dan Service.
   kubectl apply -f infra/k8s/

Kubernetes akan mengambil image Docker terbaru dari Docker Registry, membuat Pod, dan memastikan aplikasi Anda berjalan dengan tangguh dan dapat diskalakan.
