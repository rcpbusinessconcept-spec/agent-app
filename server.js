const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const SMARTBILL_API_URL = "https://ws.smartbill.ro/SBORO/api";

app.post('/api/create-invoice', async (req, res) => {
    try {
        const { clientData, products, userCui, userToken } = req.body;

        const smartBillPayload = {
            companyVatCode: userCui,
            client: clientData,
            issueDate: new Date().toISOString().split('T')[0],
            products: products
        };

        const response = await fetch(`${SMARTBILL_API_URL}/invoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${userCui}:${userToken}`).toString('base64')
            },
            body: JSON.stringify(smartBillPayload)
        });

        const data = await response.json();

        if (response.ok) {
            res.status(200).json({ success: true, message: "Trimis cu succes în SmartBill!", data });
        } else {
            res.status(400).json({ success: false, error: data });
        }

    } catch (error) {
        console.error("Eroare server intermediar:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});
