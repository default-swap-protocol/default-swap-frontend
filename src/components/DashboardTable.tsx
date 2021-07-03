import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { formatUnits } from "@ethersproject/units";
import { useAccount } from "@contexts/AccountContext";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import moment from "moment";

import { pool } from "@contracts/index"; // TODO: Make dynamic after demo

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
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
  const { getCoverBalance, getPremBalance } = useAccount();
  const [error, setError] = useState("");
  const { web3, enableWeb3, isWeb3Enabled, web3EnableError, isAuthenticated } =
    useMoralis();
  const [inter, setInter] = useState<NodeJS.Timeout>();

  // TODO: Make the following dynamic + into a hook after hackathon
  const [poolAddress, setPoolAddress] = useState(
    process.env.POOL_CONTRACT_ADDRESS_DEV
  );
  const [coverBalance, setCoverBalance] = useState(getCoverBalance());
  const [premBalance, setPremBalance] = useState(getPremBalance());
  const [expiry, setExpiry] = useState("N/A");
  useEffect(() => {
    (async () => {
      setError("");
      updateDashboardTable();
      if (!inter) {
        const id = setInterval(async () => {
          updateDashboardTable();
        }, 13000); // TODO: Update this to subscribing to block + update only when block is updated
        setInter(id);
      }
    })();
  }, [isAuthenticated, isWeb3Enabled]);
  const updateDashboardTable = async () => {
    enableWeb3();
    if (isAuthenticated && isWeb3Enabled && web3?.currentProvider) {
      try {
        const contract = new web3.eth.Contract(pool, poolAddress);
        const expiryInMS = await contract.methods.expirationTimestamp().call();
        setExpiry(makeTimestampReadable(expiryInMS));
        const _coverTokenBalance = await getCoverBalance();
        const _premTokenBalance = await getPremBalance();
        setCoverBalance(`${formatUnits(_coverTokenBalance, 18)} COVER`);
        setPremBalance(`${formatUnits(_premTokenBalance, 18)} PREM`);
      } catch (e) {
        setError(e);
        console.log("Error", e);
      }
    } else {
      setInter(undefined);
    }
  };
  const makeTimestampReadable = (expiryInMS: number): string => {
    const formattedTime = moment.unix(expiryInMS).format("MMMM Do YYYY, h:mm:ss a"); 
    return formattedTime;
  }

  return (
    <Container className={classes.root} maxWidth="lg">
      <MaterialTable
        style={{
          borderRadius: "8px"
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
            coverBalance: coverBalance,
            premBalance: premBalance
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
