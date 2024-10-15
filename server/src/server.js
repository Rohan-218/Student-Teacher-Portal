const app = require('./app.js');
require('dotenv').config();
// Set the port
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});