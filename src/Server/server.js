const app = require('../app');
const dotenv = require('dotenv');
dotenv.config({ path: './src/config.env' })
console.log(process.env.NODE_ENV);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening : http://localhost:${PORT}`);
});
