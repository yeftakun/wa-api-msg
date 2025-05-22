require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(bodyParser.json());

const IMG_HOST = process.env.IMG_HOST; // Host gambar dari .env

// Inisialisasi WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth()
});

// Event: Tampilkan QR code di terminal
client.on('qr', (qr) => {
    console.log('Scan QR ini untuk login WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Event: Client siap digunakan
client.on('ready', () => {
    console.log('Bot sudah terhubung!');
});

// Middleware: Cek API Key
app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    next();
});

// Endpoint: Kirim pesan teks
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    const targetNumber = `${number}@c.us`;

    try {
        const isRegistered = await client.isRegisteredUser(targetNumber);
        if (!isRegistered) {
            return res.status(404).json({ status: 'error', message: `${number} tidak ada di WhatsApp.` });
        }
        await client.sendMessage(targetNumber, message);
        res.status(200).json({ status: 'success', message: `Terkirim ke ${number}` });
    } catch (error) {
        res.status(500).json({ status: 'error', message: `Gagal terkirim ke ${number}` });
    }
});

// Endpoint: Kirim gambar dari URL
app.post('/send-image-url', async (req, res) => {
    const { number, filename, caption } = req.body;
    if (!number || !filename) {
        return res.status(400).json({ status: 'error', message: 'number dan filename wajib diisi' });
    }
    const targetNumber = `${number}@c.us`;
    const imageUrl = `${IMG_HOST}/img/attendance_pic/${filename}`;
    const imageCaption = caption || 'contoh foto dengan caption';

    try {
        const isRegistered = await client.isRegisteredUser(targetNumber);
        if (!isRegistered) {
            return res.status(404).json({ status: 'error', message: `${number} tidak ada di WhatsApp.` });
        }
        const media = await MessageMedia.fromUrl(imageUrl);
        await client.sendMessage(targetNumber, media, { caption: imageCaption });
        res.status(200).json({ status: 'success', message: `Gambar terkirim ke ${number}` });
    } catch (error) {
        res.status(500).json({ status: 'error', message: `Gagal mengirim gambar ke ${number}` });
    }
});

// Inisialisasi WhatsApp client
client.initialize();

// Jalankan server Express
app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
