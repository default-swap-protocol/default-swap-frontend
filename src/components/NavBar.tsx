import { useState } from 'react'
import { useMoralis } from "react-moralis";
import { useAccount } from '@contexts/AccountContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { AppBar, Button, Card, CardHeader, CardContent, Chip, Container, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import ConnectWalletPopup from '@components/ConnectWalletPopup'

const useStyles = makeStyles((theme) => ({
  appBar: {
    flexGrow: 1,
    width: '100%',
    height: theme.spacing(8),
    borderRadius: '0 !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  textButton: {
    padding: theme.spacing(0, 3),
    cursor: 'pointer',
    opacity: 0.7,
    '&:hover': {
      opacity: 1
    }
  },
  menu: {
    width: '100vw'
  },
  logo: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    margin: theme.spacing(0, 1)
  }
}));

const NavBar = () => {
  const classes = useStyles();
  const { user, isAuthenticated, logout } = useMoralis();
  const { getDaiBalance, getCoverBalance, getPremBalance } = useAccount();
  const router = useRouter();
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    router.push('/');
    handleMenuClose();
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      disableScrollLock
      getContentAnchorEl={null}
      open={isMenuOpen}
      onClose={handleMenuClose}
      elevation={2}
      className={classes.menu}
    >
      { user &&
        <>
          <Card>
            <CardContent>
              <Typography gutterBottom variant='body1'>
                Balance
              </Typography>
              <Typography color='textSecondary' variant='body2'>
                {getDaiBalance()} DAI
              </Typography>
              <Typography color='textSecondary' variant='body2'>
                {getCoverBalance()} Cover
              </Typography>
              <Typography color='textSecondary' variant='body2'>
                {getPremBalance()} Prem
              </Typography>
            </CardContent>
          </Card>
          <MenuItem onClick={handleLogout}>Disconnect</MenuItem>
        </>
      }
    </Menu>
  );

  return (
    <AppBar 
      className={classes.appBar}
      elevation={0} 
      position="static"
      color="transparent"
      >
      <Container maxWidth='lg'>
        <Toolbar disableGutters variant="dense" className={classes.toolBar}>
          <Link href="/" passHref>
            <Image unoptimized src="/logo-dark.png" alt="" className={classes.logo} height="50px" width="100px" objectFit="contain" />
          </Link>
          {/* <div className={classes.options}>
            <Link href="/buy" passHref>
              <Typography 
                className={classes.textButton} 
                style={{ 
                  fontWeight: router.asPath === "/buy" ? 800 : 400,
                  opacity: router.asPath === "/buy" && 1
                }} 
                variant="body1"
              >
                Buy Cover
              </Typography>
            </Link>
            <Link href="/sell" passHref>
              <Typography 
                className={classes.textButton} 
                style={{ 
                  fontWeight: router.asPath === "/sell" ? 800 : 400,
                  opacity: router.asPath === "/sell" && 1
                }} 
                variant="body1"
              >
                Sell Swaps
              </Typography>
            </Link>
          </div> */}
          <div className={classes.options}>
            { isAuthenticated && (
              <>
                <Link href="/dashboard" passHref>
                  <Typography 
                    className={classes.textButton} 
                    style={{ 
                      fontWeight: router.asPath === "/dashboard" ? 500 : 400,
                      opacity: router.asPath === "/dashboard" && 1
                    }} 
                    variant="body1"
                  >
                    My Dashboard
                  </Typography>
                </Link>
                <Typography color='textSecondary' variant='body2'>
                  {getDaiBalance()} DAI
                </Typography>
                <Chip
                  color="default"
                  onClick={handleProfileMenuOpen}
                  icon={
                    <Image
                      unoptimized
                      src='/icon.png'
                      width="30px" 
                      height="30px"
                      objectFit="contain"
                      alt="Account photo"
                    />
                  }
                  label={
                    `${user.get('ethAddress').slice(0, 4)}...${user.get('ethAddress').slice(38)}`
                  }
                  className={classes.chip}
                />
              </>
            )}
            { !isAuthenticated && (
              <Button
                color="primary"
                onClick={() => setConnectWalletOpen(true)}
                variant="outlined"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </Toolbar>
      </Container>
      {renderMenu}
      <ConnectWalletPopup 
        open={connectWalletOpen} 
        onClose={() => setConnectWalletOpen(false)} 
      />
    </AppBar>
  )
}

export default NavBar