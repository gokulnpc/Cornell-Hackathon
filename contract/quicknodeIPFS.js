const axios = require("axios");

const QUICKNODE_IPFS_URL = process.env.QUICKNODE_IPFS_URL; // Your QuickNode IPFS URL
const QUICKNODE_API_USERNAME = process.env.QUICKNODE_API_USERNAME; // QuickNode IPFS username
const QUICKNODE_API_PASSWORD = process.env.QUICKNODE_API_PASSWORD; // QuickNode IPFS password

async function uploadToIPFS(metadata) {
  const response = await axios.post(QUICKNODE_IPFS_URL, metadata, {
    auth: {
      username: QUICKNODE_API_USERNAME,
      password: QUICKNODE_API_PASSWORD,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.Hash; // IPFS hash from QuickNode's response
}

module.exports = { uploadToIPFS };
