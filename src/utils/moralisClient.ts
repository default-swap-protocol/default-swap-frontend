import Moralis from 'moralis';

Moralis.initialize(process.env.MORALIS_APP_ID);
Moralis.serverURL = process.env.MORALIS_SERVER_URL;

export default Moralis;