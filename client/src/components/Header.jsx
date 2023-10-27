import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import {useState, useEffect} from 'react';

//COMPONENT

const useStyles = makeStyles({
  header: {
    background: "#2874f0",
    height: 70,
  },

  container: {
    display: "flex",
    marginLeft: 450,
  },

  upperHeader: {
    display: "flex",
    marginTop: 10,
  },
});

const Header = () => {
  const classes = useStyles();
  const [account , setAccount] = useState('Not Connected');



  return (
    <AppBar className={classes.header}>
      <Toolbar>
        <Box>
          {" "}
          <Box className={classes.upperHeader}>
            <Typography>NFT MarketPlace</Typography>
            <Typography style={{ marginLeft: 700 }}> {account} </Typography>
          </Box>
          <Box className={classes.container}>
            <Link to ='/' >  <Typography style={{ marginRight: 20 , color : '#fff' }}> Market</Typography></Link>
            <Link  to = '/minttoken'> <Typography style={{ marginRight: 20 , color : '#fff'}}> MintToken </Typography></Link>
            <Link to = '/mynft'>  <Typography style={{ marginRight: 20  , color : '#fff' }}> MyNFT</Typography></Link>
            <Link to = '/dashboard'>  <Typography style={{ marginRight: 20  , color : '#fff' }}> DashBoard</Typography></Link>
            
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
