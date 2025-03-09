const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Neu hinzufügen
const app = express();

app.use(express.json());
app.use(cors()); // CORS für alle Anfragen aktivieren

app.post('/send-email', (req, res) => {
    const { pdfBase64 } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Neue WOSHUP Bestellung',
        text: 'Eine neue Bestellung wurde eingereicht.',
        attachments: [
            {
                filename: 'WOSHUP_Bestellung.pdf',
                content: pdfBase64,
                encoding: 'base64'
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('E-Mail gesendet: ' + info.response);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
