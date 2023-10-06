import React, { useEffect, useState } from "react";
import ConnectModal from "./Connect/ConnectModal";
import { Container, Nav, Navbar } from "react-bootstrap";
import {
  TREASURY,
  LOGOS,
  TOKEN_PRICE,
  CURRENCYS,
  START_PRESALE,
  END_PRESALE,
} from "../environment/config";
import { useAccount, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import { ref, push, query, onValue, update, get } from "firebase/database";
import { db } from "@/lib/firebase";
import dynamic from "next/dynamic";
const CountDownComponent = dynamic(() => import("./CountDown"), {
  ssr: false,
});
import toast from "react-hot-toast";

function Heros() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { enqueueSnackbar } = useSnackbar();

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
  const [started, setStarted] = useState(false);

  const handleChangeAmount = (amount) => {
    setEth(amount);
    setXyxy(
      (Number(amount) * CURRENCYS[currentChain?.id]) / Number(TOKEN_PRICE) || ""
    );
  };

  const handleChangeXyxy = (amount2) => {
    setEth((Number(amount2) * TOKEN_PRICE) / CURRENCYS[currentChain?.id] || "");
    setAmount(
      (Number(amount2) * TOKEN_PRICE) / CURRENCYS[currentChain?.id] || ""
    );
    setXyxy(amount2);
  };

  const checkSoftCap = () => {
    return Number(amount) * CURRENCYS[chain.id] < 20;
  };

  const handleBuyWithCoin = async () => {
    setLoadingTx(true);

    if (!started) {
      toast.error("Presale is not started yet!");
      setLoadingTx(false);
      return;
    }

    if (checkSoftCap()) {
      toast.error("Sorry, commitment amount should be greater than $20");
      setLoadingTx(false);
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const walletSigner = provider.getSigner(address);
    try {
      const transactionHash = await walletSigner.sendTransaction({
        to: TREASURY,
        value: ethers.utils.parseEther(amount.toString()),
      });

      enqueueSnackbar(
        `Transaction has been submited. Tx hash: ${transactionHash.hash}`,
        {
          variant: "info",
          autoHideDuration: 3000,
          style: {
            backgroundColor: "#202946",
          },
        }
      );
      const receipt = await transactionHash.wait();

      enqueueSnackbar(
        `Transaction has been confirmed. Tx hash: ${receipt.transactionHash}`,
        {
          variant: "info",
          autoHideDuration: 3000,
          style: {
            backgroundColor: "#06ed4f",
          },
        }
      );

      const dbRef = ref(db, "/transactions");
      push(dbRef, {
        address: address,
        amount: amount,
        symbol: balance.symbol,
        withdrow: xyxy,
      })
        .then(() => {
          const dbQuery = query(ref(db, "stats"));

          get(dbQuery).then((snapshot) => {
            const exist = snapshot.val();
            if (exist) {
              const dbRef = ref(db, `/stats/${Object.keys(exist)[0]}`);
              if (balance.symbol === "ETH") {
                update(dbRef, {
                  eth: exist[Object.keys(exist)[0]].eth + Number(amount),
                  bsc: exist[Object.keys(exist)[0]].bsc,
                  matic: exist[Object.keys(exist)[0]].matic,
                });
                return;
              }

              if (balance.symbol === "MATIC") {
                update(dbRef, {
                  matic: exist[Object.keys(exist)[0]].matic + Number(amount),
                  bsc: exist[Object.keys(exist)[0]].bsc,
                  eth: exist[Object.keys(exist)[0]].eth,
                });
                return;
              }

              if (balance.symbol === "BNB") {
                update(dbRef, {
                  bsc: exist[Object.keys(exist)[0]].bsc + Number(amount),
                  matic: exist[Object.keys(exist)[0]].matic,
                  eth: exist[Object.keys(exist)[0]].eth,
                });
                return;
              }
            }
          });

          setLoadingTx(false);
          setAmount("");
          setXyxy("");
          setEth("");
        })
        .catch((error) => {
          console.error("Error saving transaction:", error);
        });
      getBalance();
    } catch (error) {
      if (error?.data?.message) {
        enqueueSnackbar(`${error?.data?.message}`, {
          variant: "info",
          autoHideDuration: 3000,
          style: {
            backgroundColor: "#a31313",
          },
        });
      }

      setLoadingTx(false);
    }
  };

  const getBalance = async () => {
    if (window.ethereum && address) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const value = await provider.getBalance(address);
      const data = ethers.utils.formatUnits(value, 18);
      const currency =
        chain.id === 56 ? "BNB" : chain.id === 137 ? "MATIC" : "ETH";

      setBalance({
        decimals: 18,
        formatted: data,
        symbol: currency,
        value: 0,
      });
    }
  };

  const handleStarted = (data) => {
    setStarted(data);
  };

  const handleMaxAmount = () => {
    if (Number(balance.formatted))
      setAmount(Number(Number(balance.formatted).toFixed(5)));
  };

  useEffect(() => {
    handleChangeAmount(amount);
  }, [amount]);

  useEffect(() => {
    handleChangeXyxy(amount2);
  }, [amount2]);

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
    if (chain?.id && address) {
      setCurrentChain(chain);
      setAmount("");
      setAmount2("");
      getBalance(chain);
      setBalance({ ...balance, formatted: "0.00" });
    }
  }, [chain, address]);

  useEffect(() => {
    const interval = setInterval(() => {
      const dbQuery = query(ref(db, "stats"));
      onValue(dbQuery, async (snapshot) => {
        const exist = snapshot.val();
        if (exist) {
          setTotalRaisedBNB(Number(exist[Object.keys(exist)[0]].bnb || 0));
          setTotalRaisedETH(Number(exist[Object.keys(exist)[0]].eth || 0));
          setTotalRaisedMATIC(Number(exist[Object.keys(exist)[0]].matic || 0));
        }
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
                  <div className="links-div">
                    <Nav.Link href="https://app.xyxy.io/">Home</Nav.Link>
                  </div>
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingTop: "120px",
            paddingBottom: "60px",
          }}
        >
          <div className="swap-container">
            <div className="input-first">
              <div className="input-label" onClick={handleMaxAmount}>
                <div className="info s-font">Enter amount</div>
                <div className="info-2 s-font">
                  Balance :{" "}
                  {Math.round(Number(balance.formatted) * 100000) / 100000}{" "}
                  &nbsp;
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
                  <img src="/assets/XYXY.jpg" className="eth" alt="logo" />
                </span>
              </div>
            </div>

            <div className="detailBox">
              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">Exchange Rate</span>
                <span>~$ 0.07</span>
              </div>

              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">Min Buy</span>
                <span>~$ 20</span>
              </div>
              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">Softcap</span>
                <span>10,000 USDC</span>
              </div>
              <div
                style={{ color: "white", fontSize: "10px" }}
                className={started ? "info s-font" : "info s-font hide-timer"}
              >
                <span className="b-info">Ends in</span>
                <span>
                  {END_PRESALE && (
                    <CountDownComponent targetBlockTime={END_PRESALE} />
                  )}
                </span>
              </div>
              <div
                style={{ color: "white", fontSize: "10px" }}
                className={started ? "info s-font hide-timer" : "info s-font"}
              >
                <span className="b-info">Starts in</span>
                <span>
                  {START_PRESALE && (
                    <CountDownComponent
                      targetBlockTime={START_PRESALE}
                      start
                      started={handleStarted}
                    />
                  )}
                </span>
              </div>

              <hr className="divider" />
              <div
                style={{ color: "white", fontSize: "10px" }}
                className="info s-font"
              >
                <span className="b-info">Total raised</span>
                <span>
                  ~${" "}
                  {Number(
                    totalRaisedETH * 1590 +
                      totalRaisedBNB * 2121 +
                      totalRaisedMATIC * 0.5
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="button-section">
              {loadingTx ? (
                <button className="buy-button" style={{ padding: "14px" }}>
                  <div
                    className="spinner-border text-white loading-confirm"
                    role="status"
                  >
                    <span className="sr-only"></span>
                  </div>
                </button>
              ) : (
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
              )}

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
