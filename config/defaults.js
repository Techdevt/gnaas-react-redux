'use strict';

export default {
    app: {
        title: 'GNAAS',
        description: 'GNAAS Web Application',
        head: {
          titleTemplate: 'GNAAS: %s',
          meta: [
            {name: 'description', content: 'GNAAS Web Application'},
            {charset: 'utf-8'},
            {property: 'og:site_name', content: 'GNAAS'},
            {property: 'og:image', content: ''},
            {property: 'og:locale', content: 'en_US'},
            {property: 'og:title', content: 'GNAAS'},
            {property: 'og:description', content: 'GNAAS Web Application'}
          ]
        }
    }, 
    env: { 
        development: true,
        host: '',
        devHost: 'http://127.0.0.1:3000'
    },
    apiHost: 'http://127.0.0.1',
    apiPort: (process.env.NODE_ENV === 'production') ? 8080: 3001,
    host: 'http://127.0.0.1',
    port: (process.env.NODE_ENV === 'production') ? 8080: 3001,
    braintreeMerchantID: 'whpwbqn34cwmr6vh',
    braintreePublicKey: '47zw2r7cbtbt4ycb',
    braintreePrivateKey: '40ee6b943195c762e672c4357c62e0f4',
    superAdmin: {
        password: 'fanky5g2010'
    },
    smtp: {
        from: {
            name: process.env.SMTP_FROM_NAME || 'GNAAS',
            address: process.env.SMTP_FROM_ADDRESS || 'gnaasgh@gmail.com'
        },
        credentials: {
            user: process.env.SMTP_USERNAME || 'gnaasgh@gmail.com',
            password: process.env.SMTP_PASSWORD || 'fanky2010',
           	host: process.env.SMTP_HOST || 'smtp.gmail.com',
            ssl: true
        }
    },
    requireAccountVerification: true,
    secret: 'fanky5g2010'
};
