NPM yang digunakan di proyek ini adalah `npm@6.14.18` yang diinstall secara lokal project, karena saya menemukan kalau menggunakan `npm@10.5.0` library `whatsapp-web.js` tidak bisa terinstall.

Menggunakan npm secara lokal:

```
npx npm ...
```

curl:

```
curl -X POST http://localhost:3000/send-message -H "Content-Type: application/json" -H "x-api-key: abcdXD" -d "{\"number\":\"628xxx\",\"message\":\"Halo dari curl!\"}"
```