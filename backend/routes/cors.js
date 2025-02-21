const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://chem-academy.vercel.app'];

const corsOptionsDelegate = (req, callback) => {
  const corsOptions = {
    origin: whitelist.includes(req.header('Origin')),
    credentials: true,  // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  callback(null, corsOptions);
};

exports.cors = cors(); // Use for routes that don't need credentials
exports.corsWithOptions = cors(corsOptionsDelegate); // Use for secured routes
