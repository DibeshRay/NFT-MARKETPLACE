import { useState, useEffect } from "react";
import { Box, Typography, Button, makeStyles } from "@material-ui/core";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { NFT_Market_Address, NFT_Address } from "../config";
import axios from "axios";
import NFT from "../contracts/NFT.json";
import KBMarket from "../contracts/KBMarket.json";

const useStyles = makeStyles({
  container: {
    marginTop: 90,
    display: "flex",
  },
  component: {
    marginLeft: 150,
    width: 250,
  },
  image: {
    height: 200,
  },
});

const MyNFT = () => {
  const classes = useStyles();

  useEffect(() => {
    loadNFT();
  }, []);

  const [nfts, setNft] = useState([]);
  const [loading, setLoading] = useState("non-loaded");

  const loadNFT = async () => {
    const web3modal = new Web3Modal();
    const connection = web3modal.connect();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(NFT_Address, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      NFT_Market_Address,
      KBMarket.abi,
      signer
    );

    const data = await marketContract.MyNFTS();


    const Items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNft(Items);
    
    setLoading("loaded");
  };

  if (loading === "loaded" && !nfts.length) {
    return (
      <>
        <Box style={{ marginTop: 90 }}>
          {" "}
          <Typography style={{ marginLeft: 550 }}>
            {" "}
            You Do Not Have any NFT yet
          </Typography>{" "}
        </Box>
      </>
    );
  }

  return (
    <>
      <Box className={classes.container}>
        {nfts.map((nft, i) => (
          <Box className={classes.component}>
            <img className={classes.image} src={nft.image} />
            <Box>
              <Typography> {nft.name}</Typography>
              <Typography> {nft.description}</Typography>
            </Box>
            <Box>
              <Typography> Price : {nft.price} ETH </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default MyNFT;
