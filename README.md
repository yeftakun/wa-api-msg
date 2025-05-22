# WhatsApp API Message Sender

Proyek ini adalah API sederhana berbasis Node.js untuk mengirim pesan dan gambar ke WhatsApp menggunakan [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js). API ini dibuat untuk integrasi sistem [absensi](https://github.com/yeftakun/absensi.git) dan dapat digunakan untuk kebutuhan pengiriman pesan WhatsApp otomatis lainnya.

## Fitur

- Kirim pesan teks ke nomor WhatsApp.
- Kirim gambar dari URL dengan caption ke nomor WhatsApp.
- Proteksi API Key untuk keamanan endpoint.

## Instalasi

1. **Clone repositori ini**
   ```bash
   git clone https://github.com/yeftakun/wa-api-msg.git
   cd wa-api-msg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Rename file [.env-template](.env-template) menjadi `.env`**
   ```
   API_KEY=your_api_key
   IMG_HOST=http://localhost:3001
   ```

   - `API_KEY`: Kunci API untuk mengakses endpoint.
   - `IMG_HOST`: Host URL tempat gambar disimpan.

## Menjalankan Server

```bash
node index.js
```

Saat pertama kali dijalankan, Anda akan diminta untuk scan QR code di terminal menggunakan WhatsApp. Ini akan menghubungkan dengan akun WhatsApp anda.

## Endpoint API

### 1. Kirim Pesan Teks

- **POST** `/send-message`
- **Headers:** `x-api-key: your_api_key`
- **Body:**
  ```json
  {
    "number": "6281234567890",
    "message": "Halo, ini pesan otomatis!"
  }
  ```

### 2. Kirim Gambar dari URL

- **POST** `/send-image-url`
- **Headers:** `x-api-key: your_api_key`
- **Body:**
  ```json
  {
    "number": "6281234567890",
    "filename": "namafile.jpg",
    "caption": "Ini caption opsional"
  }
  ```

  Gambar akan diambil dari `${IMG_HOST}/img/attendance_pic/namafile.jpg`.

## Catatan

- Nomor WhatsApp harus menggunakan format internasional tanpa tanda `+`, contoh: `6281234567890`.
- Pastikan server gambar (`IMG_HOST`) dapat diakses dari server ini.
