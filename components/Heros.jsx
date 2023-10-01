import React, { useEffect, useState } from "react";
import ConnectModal from "./Connect/ConnectModal";
import { Container, Nav, Navbar } from "react-bootstrap";
import { TREASURY, LOGOS, TOKEN_PRICE, CURRENCYS } from "../environment/config";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
// import dynamic from "next/dynamic";
// const CountDownComponent = dynamic(() => import("../components/CountDown"), {
//   ssr: false,
// });

function Heros() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const data = useBalance({ address: address, chainId: chain?.id, });
  const { enqueueSnackbar } = useSnackbar();
  const [type, setType] = useState("ETH");
  const [totalRaisedETH, setTotalRaisedETH] = useState(0);
  const [totalRaisedBNB, setTotalRaisedBNB] = useState(0);
  const [totalRaisedMATIC, setTotalRaisedMATIC] = useState(0);
  const [amount, setAmount] = useState("");
  const [amount2, setAmount2] = useState("");
  const [insufficient, setInsufficient] = useState(false);
  const [eth, setEth] = useState("");
  const [xyxy, setXyxy] = useState("");
  const [loadingTx, setLoadingTx] = useState(false);
  const [currentChain, setCurrentChain] = useState();
  const [balance, setBalance] = useState({
    decimals: 18,
    formatted: "0.00",
    symbol: "ETH",
    value: 0,
  });

  const handleChangeAmount = (amount) => {
    setEth(amount);
    setXyxy((Number(amount) * CURRENCYS[currentChain?.id]) / TOKEN_PRICE || "");
  };

  const handleChangeXyxy = (amount2) => {
    setEth((Number(amount2) * TOKEN_PRICE) / CURRENCYS[currentChain?.id] || "");
    setAmount(
      (Number(amount2) * TOKEN_PRICE) / CURRENCYS[currentChain?.id] || ""
    );
    setXyxy(amount2);
  };

  const handleBuyWithCoin = async () => {
    setLoadingTx(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const walletSigner = provider.getSigner(address);
    try {
      const transactionHash = await walletSigner.sendTransaction({
        to: TREASURY,
        value: ethers.utils.parseEther("0.05"),
      });

      enqueueSnackbar(
        `Transaction has been submited. Tx hash: ${transactionHash.hash}`,
        {
          variant: "info",
          autoHideDuration: 5000,
          style: {
            backgroundColor: "#202946",
          },
        }
      );
      const receipt = await transactionHash.wait();
      setLoadingTx(false);
      enqueueSnackbar(
        `Transaction has been confirmed. Tx hash: ${receipt.transactionHash}`,
        {
          variant: "info",
          autoHideDuration: 5000,
          style: {
            backgroundColor: "#202946",
          },
        }
      );
      getTokenBalance(address);
    } catch (error) {
      enqueueSnackbar(`${error?.data?.message}`, {
        variant: "info",
        autoHideDuration: 3000,
        style: {
          backgroundColor: "#a31313",
        },
      });
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    handleChangeAmount(amount);
  }, [amount]);

  useEffect(() => {
    handleChangeXyxy(amount2);
  }, [amount2]);

  useEffect(() => {
    if (data) {
      setBalance(data);
    } else {
      setBalance({
        decimals: 18,
        formatted: "0",
        symbol: "ETH",
        value: 0,
      });
    }
  }, [data]);

  useEffect(() => {
    if (balance?.decimals) {
      if (Number(eth) > Number(balance.formatted)) {
        setInsufficient(true);
      }
      if (Number(eth) < Number(balance.formatted)) {
        setInsufficient(false);
      }
    }
  }, [eth]);

  useEffect(() => {
    setAmount("");
    setAmount2("");
    setCurrentChain(chain);
  }, [chain]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance2 = await provider?.getBalance(TREASURY);
      const value2 = ethers.utils.formatUnits(balance2, 18);
      setTotalRaisedETH(value2);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  console.log(data)

  return (
    <>
      <div className="hero-container">
        <div className="nav-bar">
          <Navbar expand="lg">
            <Container className="menu-container">
              <Navbar.Brand href="/">
                <img src="logo.png" className="logo" alt="XYXY" />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <ConnectModal />
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
        <div className="gradient">
          <div>
            <h1>PRESALE</h1>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", paddingTop: '120px', paddingBottom: '60px' }}>
          <div className="swap-container">
            <div className="input-first">
              <div className="input-label">
                <div className="info s-font">Enter amount</div>
                <div
                  style={{ color: "white", fontSize: "10px" }}
                  className="info s-font"
                >
                  Balance :{" "}
                  {Math.round(Number(balance.formatted) * 100000) / 100000}
                  {balance.symbol}
                </div>
              </div>
              <div className="input-group-inline">
                <input
                  className="input-text"
                  type="number"
                  value={amount}
                  onKeyPress={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  min={0}
                />
                <span>
                  <img
                    src={LOGOS[currentChain?.id] || "/assets/eth.png"}
                    className="eth"
                    alt="logo"
                  />
                </span>
              </div>
            </div>

            <div className="input-first">
              <div className="input-label">
                <div className="info s-font">Recieve</div>
                <div
                  style={{ color: "white", fontSize: "10px" }}
                  className="info s-font"
                >
                  Balance : 0 XYXY
                </div>
              </div>
              <div className="input-group-inline">
                <input
                  className="input-text"
                  type="number"
                  value={xyxy}
                  onKeyPress={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => setAmount2(e.target.value)}
                  placeholder="0.0"
                  min={0}
                />
                <span>
                  <img src="/assets/XYXY.png" className="eth" alt="logo" />
                </span>
              </div>
            </div>

            <div className="detailBox">
              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">Exchange Rate</span>
                <span>
                  1 {balance?.symbol} to{" "}
                  {CURRENCYS[currentChain?.id] / TOKEN_PRICE} XYXY TOKEN
                </span>
              </div>

              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">Max Supply</span>
                <span>100,000,000 XYXY TOKEN</span>
              </div>
              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">Softcap</span>
                <span>50 ETH</span>
              </div>
              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">ETH Total raised</span>
                <span>{totalRaisedETH} ETH</span>
              </div>
              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">BNB Total raised</span>
                <span>{totalRaisedBNB} BNB</span>
              </div>
              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">MATIC Total raised</span>
                <span>{totalRaisedMATIC} MATIC</span>
              </div>
              <hr className="divider" />
              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">Total raised</span>
                <span>
                  ~${" "}
                  {totalRaisedETH * 1590 +
                    totalRaisedBNB * 2121 +
                    totalRaisedMATIC * 0.5}
                </span>
              </div>
            </div>
            {/* <CountDownComponent  targetBlockTime={"2023-11-29T07:00:00-08:00"}/> */}
            <div className="button-section">
              <button
                className="buy-button"
                disabled={
                  balance?.formatted === "0" ||
                  !isConnected ||
                  insufficient ||
                  amount === ""
                }
                onClick={handleBuyWithCoin}
              >
                {!insufficient ? "Buy" : "Insufficient Balance"}
              </button>
              <button
                disabled
                className="buy-button"
                onClick={(e) => {
                  e.preventDefault();
                  claimFunction();
                }}
              >
                Claim
              </button>
              <button disabled className="buy-button">
                refund
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Heros;
