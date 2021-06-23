import { Web3Provider } from "@ethersproject/providers";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

export default function Body() {
  const { library } = useWeb3React<Web3Provider>();

  if (library !== undefined) {
    try {
      (async () => {
        if (undefined !== typeof window["ethereum"]) {
        }
      })();
    } catch (error) {
      console.error(error);
    }
  }

  return <BodyWrapper></BodyWrapper>;
}

const BodyWrapper = styled.section`
  margin: 0 auto;
  text-align: center;
  width: 95%;
`;
