const express = require('express');
const router = express.Router();
const Clover = require("clover-ecomm-sdk");
const axios = require('axios');

require('dotenv').config();
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_KEY = process.env.API_KEY;
const ENVIRONMENT = process.env.ENVIRONMENT;

const cloverInst = new Clover(ACCESS_TOKEN, {
    environment: ENVIRONMENT,
});

// define the routes
router.post("/createToken", (req, res) => {
    try {
        cloverInst.tokens.create({
            card: req.body.card,
            'apiKey': API_KEY,
        }).then((tokenObj) => {
            res.send(tokenObj);
        }).catch(err => {
            console.log('Getting error type in Token Test - ', err);
        });
    } catch (err) {
        res.send(err);
    }
});

router.post("/createCharge", (req, res) => {
    try {
        cloverInst.charges.create({
            source: req.body.source,
            amount: 2500,
            currency: 'usd',
            capture: 'true',
        }).then((chargeResponse) => {
            res.send(chargeResponse);
        }).catch(err => {
            console.log('Getting error in Charge API - ', err);
        });
    } catch (err) {
        res.send(err);
    }
});

router.post("/createCustomer", (req, res) => {
    try {
        cloverInst.customers.create({
            source: req.body.source,
            email: req.body.email,
        }).then((customerObj) => {
            res.send(customerObj);
        }).catch(err => {
            console.log('Getting error in Customer Creation - ', err);
        });
    } catch (err) {
        res.send(err);
    }
});

router.post("/createCheckout", (req, res) => {
    try {
        const testMode = req.body.testMode || {};
        let url = "";
        switch (testMode.environment) {
            case "dev":
                url = 'https://dev1.dev.clover.com/invoicingcheckoutservice/v1/checkouts';
                break;
            case "stage":
                url = 'https://stg1.dev.clover.com/invoicingcheckoutservice/v1/checkouts';
                break;
            case "sandbox":
                url = 'https://sandbox.dev.clover.com/invoicingcheckoutservice/v1/checkouts';
                break;
            default:
                // Default URL - now added as Dev, but it could be production url.
                url = 'https://sandbox.dev.clover.com/invoicingcheckoutservice/v1/checkouts';
        }
        axios.post(url, {
            customer: req.body.customer,
            shoppingCart: req.body.shoppingCart,
        }, {
            headers: {
                'content-type': 'application/json',
                'X-Clover-Merchant-Id': testMode.merchantId || 'CX2208775P7C1',
                'Authorization': `Bearer ${testMode.apiToken || '741a18ba-8fef-27ac-79bf-c24fb7ba17e4'}`,
            }
        })
        .then(checkoutObj => {
            console.log(checkoutObj);
            res.send(checkoutObj.data);
        })
        .catch(error => {
            console.log('Getting error in Checkout Creation - ', error);
        });
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;
