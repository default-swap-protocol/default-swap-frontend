import { useState } from "react";
import Image from 'next/image'
import { Card, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";

import usePoolInfo from '@hooks/usePoolInfo'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    '&:nth-child(1) .Component-horizontalScrollContainer-26': {
      borderRadius: theme.spacing(1)
    }
  },
  card: {
    padding: theme.spacing(3),
    margin: theme.spacing(2, 0),
    maxWidth: theme.spacing(20),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: theme.spacing(1)
  },
  containerItem: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: `repeat(2, 1fr)`
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: `repeat(3, 1fr)`
    }
  },
  table: {
    minWidth: 700
  },
  cell: {
    "&:hover": {
      color: `${theme.palette.primary} !important`,
      cursor: "pointer"
    }
  },
  button: {
    display: "inline",
    width: "100%"
  }
}));

const DashboardTable = () => {
  const classes = useStyles();

  // TODO: Make the following dynamic + into a hook after hackathon
  const [poolAddress, setPoolAddress] = useState(
    process.env.POOL_CONTRACT_ADDRESS_DEV
  );
  const { daiBalance, coverBalance, premBalance, expiry} = usePoolInfo(poolAddress);

  return (
    <Container className={classes.root} maxWidth="md">
      <Typography gutterBottom variant='h6'>
        My Balance
      </Typography>
      <Card className={classes.card} elevation={2}>
        <Image src='/dai.svg' width='35px' height='22px' unoptimized />
        <Typography gutterBottom variant='body2'>
          {`${daiBalance} DAI`}
        </Typography>
      </Card>
      <Typography gutterBottom variant='h6'>
        My Pools
      </Typography>
      <MaterialTable
        title={'My Balance'}
        style={{
          borderRadius: "10px"
        }}
        columns={[
          {
            title: "Pool",
            field: "pool",
            cellStyle: { fontWeight: 500, width: "25%" },
            disableClick: true
          },
          { title: "Expiry", field: "expiry", cellStyle: { width: "25%" } },
          {
            title: "Cover Token Balance",
            field: "coverBalance",
            cellStyle: { width: "25%" }
          },
          {
            title: "Premium Token Balance",
            field: "premBalance",
            cellStyle: { width: "25%" }
          }
        ]}
        data={[
          {
            pool: "Maple",
            expiry: expiry,
            coverBalance: `${coverBalance} COVER`,
            premBalance: `${premBalance} PREM`
          }
        ]}
        options={{
          toolbar: false,
          paging: false,
          headerStyle: {
            backgroundColor: "#3531a2",
            color: "#FFF"
          }
        }}
      />
    </Container>
  );
};

export default DashboardTable;
