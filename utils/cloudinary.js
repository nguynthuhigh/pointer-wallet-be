const cloudinary = require('cloudinary')

cloudinary.config({ 
    cloud_name: 'ds0cz9t6b', 
    api_key: '343174643682814', 
    api_secret: process.env.CLOUD_API_SECRET // Click 'View Credentials' below to copy your API secret
});

module.exports = cloudinary