const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Erhöhe das Limit für JSON-Payloads (z. B. auf 10 MB)
app.use(express.json({ limit: '10mb' }));
app.use(cors()); // CORS für alle Anfragen aktivieren

app.post('/send-email', (req, res) => {
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
        return res.status(400).send('Kein PDF-Daten enthalten');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'info@woshup.de', // E-Mail an info@woshup.de senden
        cc: 'nico.wipplinger@wiroconsulting.at', // Nico Wipplinger in CC setzen
        subject: 'Neue WOSHUP Bestellung',
        text: 'Eine neue B2B Bestellung wurde eingereicht.',
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
            console.error('E-Mail Fehler:', error);
            return res.status(500).send(error.toString());
        }
        res.status(200).send('E-Mail gesendet: ' + info.response);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
