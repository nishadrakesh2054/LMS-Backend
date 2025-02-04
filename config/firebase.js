// backend/config/firebase.js
const admin = require('firebase-admin');
var serviceAccount = require("path/to/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lms-gems-default-rtdb.asia-southeast1.firebasedatabase.app"
  });

module.exports = admin;
