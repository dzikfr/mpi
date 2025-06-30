# Event Organizer 🎉

Proyek MPI ini merupakan aplikasi untuk mengelola sebuah event yang menggunakan:
- **Backend**: NodeJs + Express.js + TypeScript
- **Frontend**: React + Vite + TypeScript
- **Database**: PostgreSQL

---

## 📁 Struktur Direktori

```

project-root/
│
├── backend/             # Express + TS + 
│   ├── src/
│   └── ...
│
├── frontend/            # React + Vite + TypeScript
│   ├── src/
│   └── ...
|
├── diagram/            # Diagram Menggunakan Draw.IO
│   ├── ui/
│   └── ...


````

---

## 🧰 Prasyarat

Pastikan sudah terpasang:

- Node.js (v22 LTS)
- PostgreSQL (v17)
- npm

---

## ⚙️ Setup Backend

Masuk ke folder backend:

```bash
cd backend
````

1. Install dependensi:

```bash
npm install
```

2. Copy file `.env.example` menjadi file `.env`:
isikan data untuk environment:
```env
PORT=3000
DATABASE_URL=postgres://<user>:<password>@localhost:5432/<db_name>
```

3. Jalankan seed database:

```bash
node utils/seed.js
```

Jika ingin, pakai file backup sql dan jalankan query ke database yang dibuat

4. Jalankan server:

```bash
npm run dev
```

API akan berjalan secara default di `http://localhost:3000`. tergangu `PORT` di file `.env`

---

## ⚛️ Setup Frontend

Masuk ke folder frontend:

```bash
cd frontend
```

1. Install dependensi:

```bash
npm install
```

2. Jalankan dev server:

```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173` (default Vite port).

---

## 🐘 Setup PostgreSQL (jika belum)

```bash
createdb event_organizer
psql event_organizer
```

Pilih file sql yang disediakan, `query.sql` hanya akan generate table saja, sedangkan `backup_mpi_sql.sql` akan generate table dan data yang sudah ada.

```warning
Jika menjalankan `query.sql`, pastikan menjalankan seed nya terlebih dahulu
```

---

## 🛠 Build & Deploy (Opsional)

* **Frontend**: `npm run build` → hasil ada di `dist/`
* **Backend**: pastikan build TS ke `dist/` lalu jalankan `node dist/index.js`

---

## 🧪 Testing

> Belum tersedia.

---