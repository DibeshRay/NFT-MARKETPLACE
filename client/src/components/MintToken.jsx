import { useState, useEffect } from "react";
import Web3 from "web3";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import {
  Box,
  Button,
  TextField,
  makeStyles,
} from "@material-ui/core";

import { NFT_Market_Address, NFT_Address } from "../config";
import NFT from "../contracts/NFT.json";
import KBMarket from "../contracts/KBMarket.json";
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });
const str2ab = require("string-to-arraybuffer");

const useStyles = makeStyles({
  login: {
    marginLeft : 500,
    width: 300,
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  image: {
      height: 200
  }
});
const MintToken = () => {
  
  const classes = useStyles();
  const [imageIpfs, setImageIpfs] = useState("");
  const [fileIpfs, setFileIpfs] = useState("");
  const [formInput, setFormInput] = useState({
    name: "",
    price: "",
    description: "",
  });



  const captureFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    let buffer;
    reader.onloadend = () => {
      buffer = Buffer(reader.result);
      console.log("submitting file....");
      ipfs.files.add(buffer, (err, result) => {
        console.log("IPFS RESULT : ", result);

        const memeHash = result[0].hash;
        if (err) {
          console.error(err);
          return;
        }

        setImageIpfs(`https://ipfs.infura.io/ipfs/${memeHash}`);
      });
    };
  };



  const createMarket = async (e) => {
    e.preventDefault();
    const { name, price, description } = formInput;
    if (!name || !price || !description || !imageIpfs) {
      return;
    }
    const data = JSON.stringify({ price, name, description, image: imageIpfs });
    const arrBuff = str2ab(data);
    let buffer = Buffer(arrBuff);

    // console.log(data);

    ipfs.files.add(buffer, (err, result) => {
      //   console.log("IPFS RESULT : ", result);

      const memeHash = result[0].hash;
      if (err) {
        console.error(err);
        return;
      }
      const url = `https://ipfs.infura.io/ipfs/${memeHash}`;
      setFileIpfs(url);
      //   console.log(`https://ipfs.infura.io/ipfs/${memeHash}`);
      createSale(url);
    });
    
  };

  const createSale = async (url) => {

    const web3modal = new Web3Modal();
    const connection = web3modal.connect();

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // // var provider = new ethers.providers.JsonRpcProvider("http://localhost:7545")
    const signer = provider.getSigner();

  
    const tokenContract = new ethers.Contract(NFT_Address ,NFT.abi,signer );
    let transaction = await tokenContract.mintToken(url);
    let tx = await transaction.wait();
    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    const marketContract = new ethers.Contract(NFT_Market_Address,KBMarket.abi, signer );
    let listingPrice = await marketContract.getListingPrice();
    listingPrice = listingPrice.toString();
    
    transaction = await marketContract.mintMarketItem(NFT_Address,price , tokenId, {value: listingPrice });
   
    tx = await transaction.wait();
    
  };
  return (
    <Box style={{ marginTop: 100 }}>
      <Box className={classes.login}>
        <TextField
          id="standard-basic"
          label="Name"
          variant="standard"
          onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />
        <TextField
          id="standard-basic"
          label="Description"
          variant="standard"
          onChange={(e) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        />
        <TextField
          id="standard-basic"
          label="Price"
          variant="standard"
          onChange={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        />
        &nbsp;

        <input type="file" onChange={(e) => captureFile(e)} />

        &nbsp;
        {
            imageIpfs&& <img  className = {classes.image} src = {imageIpfs}/>
        }
        &nbsp;
        <Button variant="contained" onClick = {(e)=>createMarket(e)}> Mint NFT</Button>
      </Box>
    </Box>
  );
};

export default MintToken;
