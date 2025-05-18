require('dotenv').config(); // Tambahkan ini paling atas

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const readline = require('readline');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Scan QR ini untuk login WhatsApp:');
    require('qrcode-terminal').generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Bot sudah terhubung!');
});

const IMG_HOST = process.env.IMG_HOST; // Ambil host dari .env

// Middleware cek API Key
app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    next();
});

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    const targetNumber = `${number}@c.us`;

    const isRegistered = await client.isRegisteredUser(targetNumber);
    if (isRegistered) {
        try {
            await client.sendMessage(targetNumber, message);
            res.status(200).json({ status: 'success', message: `Terkirim ke ${number}` });
        } catch (error) {
            res.status(500).json({ status: 'error', message: `Gagal terkirim ke ${number}` });
        }
    } else {
        res.status(404).json({ status: 'error', message: `${number} tidak ada di WhatsApp.` });
    }
});

// app.post('/send-image', async (req, res) => {
//     const { number } = req.body;
//     const targetNumber = `${number}@c.us`;
//     const imageUrl = 'http://localhost:3001/img/attendance_pic/1747573811240_55.jpg';
//     const caption = 'contoh foto dengan caption';

//     try {
//         const isRegistered = await client.isRegisteredUser(targetNumber);
//         if (!isRegistered) {
//             return res.status(404).json({ status: 'error', message: `${number} tidak ada di WhatsApp.` });
//         }

//         const media = await MessageMedia.fromUrl(imageUrl);
//         await client.sendMessage(targetNumber, media, { caption });
//         res.status(200).json({ status: 'success', message: `Gambar terkirim ke ${number}` });
//     } catch (error) {
//         res.status(500).json({ status: 'error', message: `Gagal mengirim gambar ke ${number}` });
//     }
// });

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

client.initialize();

app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
