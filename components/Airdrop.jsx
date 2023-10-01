import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import ConnectModal from "./Connect/ConnectModal";
import { BigNumber, ethers } from "ethers";
import Web3 from "web3";
import { Modal, Container, Nav, Navbar } from "react-bootstrap";

import toast from "react-hot-toast";

import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

import {
  getAllInfo,
  checkEligibility,
  GetuserTiers,
  claim,
} from "../lib/airdropcontractMethod";
import { useAccount } from "wagmi";
import { airdropAddresses } from "@/environment/config";
import { setLogLevel } from "firebase/app";

function Airdrop() {
  const [isLoading, setLoading] = useState(false);
  const { account, active, library, chainId } = useWeb3React();
  const { address } = useAccount();
  const addresses = airdropAddresses;
  const [eligibility, setEligibiility] = useState(false);

  const [show, setShow] = useState({
    show: false,
    title: "",
    link: "",
    progress: false,
    dismiss: false,
    buttonText: "",
  });

  const [info, setInfo] = useState({
    claimActive: false,
    currentRound: 0,
    Tiers: "",
    owner: "",
  });

  const [balance, setBalance] = useState(0);
  const [claim_status, setClaim_status] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userReward, setUserReward] = useState(0);

  const { width, height } = useWindowSize();
  const [congrats, setCongrats] = useState(false);

  const fetchBalance = async () => {
    const amount = await library.getBalance(account);
    setBalance(Web3.utils.fromWei(amount.toString()));
  };

  const checkFunction = async () => {
    if (!address) {
      return toast.error("Please Connect Your Wallet");
    }
    // const eligibility = await checkEligibility(
    //   account,
    //   info.currentRound.toString(),
    //   library?.getSigner()
    // );
    // if (eligibility.claimed === true) {
    //   return toast.error("Already claimed");
    // }
    // const usertier = await GetuserTiers(account, library?.getSigner());
    if (addresses.length > 0) {
      // setClaim_status(true);
      // let role = [];
      // let reward = 0;
      // for (let i = 0; i < usertier.length; i++) {
      //   role.push(info.Tiers[usertier[i].toString()].name);
      //   console.log(role, reward);
      //   reward = +info.Tiers[usertier[i].toString()].amount;
      // }
      // reward = Web3.utils.fromWei(reward.toString());
      // setUserRole(role);
      // setUserReward(reward);
      const result = addresses.filter(
        (item) => item.toString().toLowerCase() === address.toLowerCase()
      );
      if (result.length) {
        setEligibiility(true);
        return toast.success("Congratulation! you can get airdrop.");
      } else {
        setEligibiility(false);
        return toast.error("Sorry! you are not registered.");
      }
    }
  };

  useEffect(() => {
    if (account && library) {
      fetchBalance();
    }
  }, [account, library, balance]);

  useEffect(() => {
    if (active) {
      setLoading(true);
      let loadingToast = toast.loading("Loading... please wait");
      getEngine();
      setTimeout(() => {
        toast.success("Contract loaded", {
          id: loadingToast,
        });
        setLoading(false);
      }, 500);
    }
  }, [active, account]);

  useEffect(() => {
    if (claim_status) {
      setCongrats(true);
      setTimeout(() => {
        setCongrats(false);
      }, 3000);
    } else {
      setCongrats(false);
    }
  }, [claim_status]);

  const handleClose = () => setShow(false);

  async function getEngine() {
    const data = await getAllInfo(library?.getSigner());
    console.log(data);
    setInfo(data);
  }

  function showMintModal(state, title, link, progress, dismiss, buttonText) {
    setShow({
      show: state,
      title,
      link,
      progress,
      dismiss,
      buttonText,
    });
  }

  async function claimFunction() {
    try {
      if (!address) {
        return toast.error("Please Connect Your Wallet");
      }
      return toast.error("Claim is not Active yet");
      // if (!account) {
      //   return;
      // }
      // if (!info.claimActive) {

      // }
      // toast("Please wait..", {
      //   icon: "👏",
      // });
      // console.log("info-->", info);
      // var tx = await claim(library?.getSigner());
      // showMintModal(
      //   true,
      //   "Claim submitted",
      //   `https://explorer.zksync.io/tx/${tx.hash}`,
      //   true,
      //   false,
      //   ""
      // );
      // await tx.wait(1);
      // showMintModal(
      //   true,
      //   "Claim Success",
      //   `https://explorer.zksync.io/tx/${tx.hash}`,
      //   false,
      //   true,
      //   "Done"
      // );
      // setClaim_status(false);
    } catch (error) {
      // console.log(typeof error);
      // console.log("Error", error.toString());
      // if (error.toString().includes("execution reverted")) {
      //   toast.error("Please contact Admins");
      // } else {
      //   toast.error("Transaction Error");
      // }
      // showMintModal(false, "", "", false, true, "Close");
    }
  }

  return (
    <>
      <div className="mintmodalcontainer">
        <Modal show={show.show} onHide={handleClose} className="mymodal">
          <Modal.Body>
            <div className="mintmodal">
              <img
                src="/success.png"
                className="mintmodalimage"
                alt="Mintmodalimage"
              />

              <h2>{show.title}</h2>
              <h3>
                See the transaction on
                <a href={show.link} target="_blank" rel="noreferrer">
                  {" "}
                  zkSync Explorer
                </a>
              </h3>
              {show.progress && (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only"></span>
                </div>
              )}
              <h3>{show.body}</h3>

              {show.dismiss && (
                <button className="btn herobtn" onClick={handleClose}>
                  {show.buttonText}
                </button>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>

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
                    <Nav.Link href="/">presale</Nav.Link>
                  </div>
                  <div className="links-div">
                    <Nav.Link href="/airdrop">Airdrop</Nav.Link>
                  </div>
                  <ConnectModal />
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
        <div className="gradient">
          <div>
            <h1>AIRDROP</h1>
          </div>
        </div>
        {claim_status == true && (
          <Confetti
            width={width}
            height={height}
            // confettiSource={{x:0, y: 300}}
            initialVelocityX={4}
            initialVelocityY={100}
            run={true}
            recycle={congrats}
            gravity={0.2}
            numberOfPieces={width / 3}
            tweenDuration={100}
          />
        )}
        {isLoading && (
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="swap-container">
              <div className="airdrop-text">
                {claim_status ? (
                  <div className="detailBox">
                    <div
                      style={{ color: "white", fontSize: "20px" }}
                      className="info s-font"
                    >
                      <span>Your roles</span>
                      <div style={{ display: "block", textAlign: "right" }}>
                        {userRole.map((row, idx) => (
                          <>
                            <span key={idx}>{row}</span>
                            <br />
                          </>
                        ))}
                      </div>
                    </div>
                    <div
                      style={{ color: "white", fontSize: "20px" }}
                      className="info s-font"
                    >
                      <span>Your Airdrop Amount</span>
                      <span>{userReward}</span>
                    </div>
                    <div
                      style={{ color: "white", fontSize: "20px" }}
                      className="info s-font"
                    >
                      <span>Claimable</span>
                      <span>{`${info.claimActive}`}</span>
                    </div>
                  </div>
                ) : (
                  <h4
                    style={{
                      color: "white",
                      letterSpacing: 2,
                      lineHeight: 1.8,
                    }}
                  >
                    {!eligibility ? (
                      <>
                        <strong>
                          Users who own the Following Discord roles:
                          <br />
                          @OG ,@IDO PARTICIPANT ,@ANON ,@ZEALY ,@FAM
                          <br />
                          Are eligible for an Airdrop
                          <br />
                          Get your roles on the Discord now
                        </strong>
                      </>
                    ) : (
                      <>
                        <div className="detailBox">
                          <div
                            style={{ color: "white", fontSize: "20px" }}
                            className="info s-font"
                          >
                            <span>Your roles</span>
                            <div
                              style={{ display: "block", textAlign: "right" }}
                            >
                              <span>OG</span>
                              <br />
                              <span>Anon</span>
                              <br />
                            </div>
                          </div>
                          <div
                            style={{ color: "white", fontSize: "20px" }}
                            className="info s-font"
                          >
                            <span>Your Airdrop Amount</span>
                            <span>300</span>
                          </div>
                          <div
                            style={{ color: "white", fontSize: "20px" }}
                            className="info s-font"
                          >
                            <span>Claimable</span>
                            <span>false</span>
                          </div>
                        </div>
                      </>
                    )}
                  </h4>
                )}
              </div>

              <div className="button-section">
                {eligibility ? (
                  <button
                    className="claim-button"
                    onClick={(e) => {
                      e.preventDefault();
                      claimFunction();
                    }}
                  >
                    Claim airdrop
                  </button>
                ) : (
                  <button
                    className="buy-button"
                    onClick={(e) => {
                      e.preventDefault();
                      checkFunction();
                    }}
                  >
                    Check eligibility
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Airdrop;
