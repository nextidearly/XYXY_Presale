import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import ConnectModal from './Connect/ConnectModal'
import { BigNumber, ethers } from 'ethers'
import Web3 from 'web3'
import { Modal, Container, Nav, Navbar } from 'react-bootstrap'
import { Button, Stack, Box, Input } from '@mui/material'

import toast from 'react-hot-toast'

const token_addr = '0xE161A60Da0943dAD69aFfe0249b7F623C518337B'
const staking_address = '0xFA50C47fFBF6E6780ad37b929C4A0CA5564C0086'
const token_abi = require('../lib/Contract/token_abi.json')

import {
  getAllInfo,
  earned,
  checkBalance,
  Stake,
  unStake,
  claim,
} from '../lib/stakingcontractMethod'
import Link from 'next/link'

function Staking() {
  const [stake_status, setStake_status] = useState(0)
  const [amount_in, setAmount_in] = useState(0)
  const [token_bal, setToken_bal] = useState(0)
  const [stake_bal, setStake_bal] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [reward, setReward] = useState(0)

  const [isLoading, setLoading] = useState(false)
  const { account, active, library, chainId } = useWeb3React()

  const [show, setShow] = useState({
    show: false,
    title: '',
    link: '',
    progress: false,
    dismiss: false,
    buttonText: '',
  })

  const [info, setInfo] = useState({
    total: 0,
    duration: 0,
    finishdate: 0,
  })

  useEffect(() => {
    if (active) {
      setLoading(true)
      let loadingToast = toast.loading('Loading... please wait')
      getEngine()
      setTimeout(() => {
        toast.success('Contract loaded', {
          id: loadingToast,
        })
        setLoading(false)
      }, 1000)
    }
  }, [active, account])

  useEffect(() => {
    if (account && library) {
      fetchBalance()
    }
  }, [account, library, token_bal, stake_status])

  useEffect(() => {
    if (account && library) {
      checkStake()
    }
  }, [account, library, stake_bal, stake_status])

  useEffect(() => {
    if (account && library) {
      checkReward()
    }
  }, [account, library, reward, stake_status])
  const handleClose = () => setShow(false)

  async function getEngine() {
    try {
      const data = await getAllInfo(library?.getSigner())
      console.log(data)
      setInfo(data)
    } catch (e) {
      console.log(e)
    }
  }

  const fetchBalance = async () => {
    try {
      const token_contract = new ethers.Contract(token_addr, token_abi, library?.getSigner())
      const amount = await token_contract.balanceOf(account)
      setToken_bal(Web3.utils.fromWei(amount.toString()))
      try {
        const allow = await token_contract.allowance(account, staking_address)
        setAllowance(allow.toString())
      } catch (e) {
        setAllowance(0)
      }
    } catch (e) {
      console.log(e)
      setToken_bal(0)
    }
  }

  const checkStake = async () => {
    try {
      const amount = await checkBalance(account, library?.getSigner())
      setStake_bal(Web3.utils.fromWei(amount.toString()))
    } catch (e) {
      console.log(e)
      setStake_bal(0)
    }
  }

  const checkReward = async () => {
    try {
      const amount = await earned(account, library?.getSigner())
      setReward(amount.toString() / 10 ** 6)
    } catch (e) {
      console.log(e)
      setReward(0)
    }
  }

  function showMintModal(state, title, link, progress, dismiss, buttonText) {
    setShow({
      show: state,
      title,
      link,
      progress,
      dismiss,
      buttonText,
    })
  }

  async function approveFunction() {
    try {
      const token_contract = new ethers.Contract(token_addr, token_abi, library?.getSigner())
      toast('Please wait..', {
        icon: '👏',
      })
      var tx = await token_contract.approve(
        staking_address,
        '0xffffffffffffffffffffffffffffffffffffff'
      )
      showMintModal(
        true,
        'Approve submitted',
        `https://explorer.zksync.io/tx/${tx.hash}`,
        true,
        false,
        ''
      )
      await tx.wait(1)
      showMintModal(
        true,
        'Approve Success',
        `https://explorer.zksync.io/tx/${tx.hash}`,
        false,
        true,
        'Done'
      )
      fetchBalance()
    } catch (e) {
      console.log(e)
      showMintModal(false, '', '', false, true, 'Close')
    }
  }

  async function stakeFunction() {
    try {
      if (amount_in < 0.01) {
        return toast.error('Minimum amount is 0.01')
      }
      // if(amount_in > 10){
      //   return toast.error("Maximum amount is 10");
      // }
      if (!active) {
        return toast.error('Please Connect Your Wallet')
      }
      if (!account) {
        return
      }
      if (amount_in <= 0 || !amount_in) {
        return toast.error('Invalid amount')
      }

      toast('Please wait..', {
        icon: '👏',
      })
      const amount = Web3.utils.toWei(amount_in, 'ether')
      var tx = await Stake(amount, library?.getSigner())
      showMintModal(
        true,
        'Stake submitted',
        `https://explorer.zksync.io/tx/${tx.hash}`,
        true,
        false,
        ''
      )
      await tx.wait(1)
      showMintModal(
        true,
        'Stake Success',
        `https://explorer.zksync.io/tx/${tx.hash}`,
        false,
        true,
        'Done'
      )
      setStake_status(0)
      setAmount_in(0)
    } catch (error) {
      console.log(typeof error)
      console.log('Error', error.toString())
      if (error.toString().includes('execution reverted')) {
        toast.error('Please contact Admins')
      } else {
        toast.error('Insufficient funds or Transaction Error')
      }
      showMintModal(false, '', '', false, true, 'Close')
    }
  }

  async function unstakeFunction() {
    try {
      if (!active) {
        return toast.error('Please Connect Your Wallet')
      }
      if (!account) {
        return
      }
      if (amount_in <= 0 || !amount_in) {
        return toast.error('Invalid amount')
      }

      toast('Please wait..', {
        icon: '👏',
      })
      const amount = Web3.utils.toWei(amount_in, 'ether')
      var tx = await unStake(amount, library?.getSigner())
      showMintModal(
        true,
        'Unstake submitted',
        `https://explorer.zksync.io/tx/${tx.hash}`,
        true,
        false,
        ''
      )
      await tx.wait(1)
      showMintModal(
        true,
        'Unstake Success',
        `https://explorer.zksync.io/tx/${tx.hash}`,
        false,
        true,
        'Done'
      )
      setStake_status(0)
      setAmount_in(0)
    } catch (error) {
      console.log(typeof error)
      console.log('Error', error.toString())
      if (error.toString().includes('execution reverted')) {
        toast.error('Please contact Admins')
      } else {
        toast.error('Insufficient funds or Transaction Error')
      }
      showMintModal(false, '', '', false, true, 'Close')
    }
  }

  async function claimFunction() {
    try {
      if (!active) {
        return toast.error('Please Connect Your Wallet')
      }
      if (!account) {
        return
      }
      toast('Please wait..', {
        icon: '👏',
      })
      console.log('info-->', info)
      var tx = await claim(library?.getSigner())
      showMintModal(
        true,
        'Claim submitted',
        `https://explorer.zksync.io/tx/${tx.hash}`,
        true,
        false,
        ''
      )
      await tx.wait(1)
      showMintModal(
        true,
        'Claim Success',
        `https://explorer.zksync.io/tx/${tx.hash}`,
        false,
        true,
        'Done'
      )
      fetchBalance()
    } catch (error) {
      console.log(typeof error)
      console.log('Error', error.toString())
      if (error.toString().includes('execution reverted')) {
        toast.error('Please contact Admins')
      } else {
        toast.error('Transaction Error')
      }
      showMintModal(false, '', '', false, true, 'Close')
    }
  }

  return (
    <>
      <div className='mintmodalcontainer'>
        <Modal show={show.show} onHide={handleClose} className='mymodal'>
          <Modal.Body>
            <div className='mintmodal'>
              <img src='/success.png' className='mintmodalimage' alt='Mintmodalimage' />

              <h2>{show.title}</h2>
              <h3>
                See the transaction on
                <a href={show.link} target='_blank' rel='noreferrer'>
                  {' '}
                  zkSync Explorer
                </a>
              </h3>
              {show.progress && (
                <div className='spinner-border text-primary' role='status'>
                  <span className='sr-only'></span>
                </div>
              )}
              <h3>{show.body}</h3>

              {show.dismiss && (
                <button className='btn herobtn' onClick={handleClose}>
                  {show.buttonText}
                </button>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <div className='hero-container'>
        <div className='nav-bar'>
          <Navbar expand='lg'>
            <Container className='menu-container'>
              <Navbar.Brand href='/'>
                <img src='logo.png' className='logo' alt='XYXY' />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='me-auto'>
                  <div className='links-div highlight'>
                    <Nav.Link href='/buy'>BUY $XYXY</Nav.Link>
                  </div>
                  <div className='links-div'>
                    <Nav.Link href='/presale'>Presale</Nav.Link>
                  </div>
                  <div className='links-div'>
                    <Nav.Link href='/airdrop'>Airdrop</Nav.Link>
                  </div>
                  <div className='links-div'>
                    <Nav.Link href='/vote'>Vote</Nav.Link>
                  </div>
                  <div className='links-div'>
                    <Nav.Link href='https://Mixer.XYXYfi.io'>Go to Mixer</Nav.Link>
                  </div>
                  <div className='header-connect'>
                    <ConnectModal />
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
        <div className='gradient1'></div>
        <div className='noise'></div>
        <div className='gradient'>
          <div>
            <h1>Stake</h1>
          </div>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', height: '100%', marginTop: '8em' }}>
          <div>
            {stake_status !== 0 && (
              <Box
                sx={{
                  justifyContent: 'left',
                  position: 'relative',
                  display: 'flex',
                  ml: 1,
                  zIndex: 999,
                }}
              >
                <Button
                  variant='outlined'
                  sx={{ width: '80px', m: 1, color: 'white', borderRadius: '10px' }}
                  onClick={(e) => {
                    setStake_status(0)
                    setAmount_in(0)
                  }}
                >
                  Back
                </Button>
              </Box>
            )}
            <div className='swap-container'>
              <div className='airdrop-text'>
                <div
                  style={{
                    display: 'flex',
                    color: 'white',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <img src='coin.png' style={{ height: '35px' }}></img>
                  <h3>XYXY STAKING POOl</h3>
                  <img src='usdc.png' style={{ height: '35px' }}></img>
                </div>
                {stake_status === 0 && (
                  <div className='detailBox'>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Earned</span>
                      <span>{reward}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Staked</span>
                      <span>{Math.round(stake_bal * 100000) / 100000}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>APR</span>
                      <span>493 %</span>
                    </div>
                    <div className='info s-font'>
                      <div style={{ display: 'block' }}>
                        <Link
                          target='blank'
                          href={`https://explorer.zksync.io/address/${staking_address}#contract`}
                          style={{ display: 'flex', color: 'white' }}
                        >
                          <strong>
                            <h4 style={{ fontWeight: 900 }}>View Contract</h4>
                          </strong>
                          <svg viewBox='0 0 24 24' width='20px' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z'></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                {stake_status === 1 && (
                  <div className='detailBox'>
                    <Box
                      sx={{
                        background: '#b4c6e455',
                        borderRadius: '10px',
                        alignItems: 'center',
                      }}
                    >
                      <Input
                        fullWidth
                        placeholder='0.0'
                        id='amount'
                        value={amount_in}
                        onChange={(e) => {
                          setAmount_in(e.target.value)
                        }}
                        disableUnderline
                        sx={{
                          padding: '10px 15px',
                          fontFamily: 'BaseNeueMedium',
                          fontSize: '30px',
                          textAlign: 'start',
                          color: 'black',
                          fontWeight: 700,
                        }}
                      />
                      {token_bal > 0 && (
                        <Button
                          variant='outlined'
                          onClick={(e) => {
                            setAmount_in(token_bal)
                          }}
                          sx={{
                            maxHeight: '25px',
                            color: 'black',
                            border: '1px solid rgb(0, 0, 0)',
                            borderRadius: '10px',
                            mr: 1,
                          }}
                        >
                          max
                        </Button>
                      )}
                    </Box>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Balance</span>
                      <span>{Math.round(token_bal * 100000) / 100000}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Staked</span>
                      <span>{Math.round(stake_bal * 100000) / 100000}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Total Staked</span>
                      <span>{Math.round(info.total * 100000) / 100000}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Duration</span>
                      <span>{info.duration.toString() / 86400} days</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>FinishDate</span>
                      <span>{info.finishdate.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                {stake_status === 2 && (
                  <div className='detailBox'>
                    <Box
                      sx={{
                        background: '#b4c6e455',
                        borderRadius: '10px',
                        alignItems: 'center',
                      }}
                    >
                      <Input
                        fullWidth
                        placeholder='0.0'
                        id='amount'
                        value={amount_in}
                        onChange={(e) => {
                          setAmount_in(e.target.value)
                        }}
                        disableUnderline
                        sx={{
                          padding: '10px 15px',
                          fontFamily: 'BaseNeueMedium',
                          fontSize: '30px',
                          textAlign: 'start',
                          color: 'black',
                          fontWeight: 700,
                        }}
                      />
                      {stake_bal > 0 && (
                        <Button
                          variant='outlined'
                          onClick={(e) => {
                            setAmount_in(stake_bal)
                          }}
                          sx={{
                            maxHeight: '25px',
                            color: 'black',
                            border: '1px solid rgb(0, 0, 0)',
                            borderRadius: '10px',
                            mr: 1,
                          }}
                        >
                          max
                        </Button>
                      )}
                    </Box>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Balance</span>
                      <span>{Math.round(token_bal * 100000) / 100000}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Staked</span>
                      <span>{Math.round(stake_bal * 100000) / 100000}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Total Staked</span>
                      <span>{Math.round(info.total * 100000) / 100000}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>Duration</span>
                      <span>{info.duration.toString() / 86400} days</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '20px' }} className='info s-font'>
                      <span>FinishDate</span>
                      <span>{info.finishdate.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className='button-section'>
                {reward > 0 && (
                  <button
                    className='claim-button'
                    onClick={(e) => {
                      e.preventDefault()
                      claimFunction()
                    }}
                  >
                    Claim Reward
                  </button>
                )}
                {stake_status === 0 && (
                  <>
                    <button
                      className='buy-button'
                      onClick={(e) => {
                        e.preventDefault()
                        setStake_status(1)
                      }}
                    >
                      Stake
                    </button>
                    <button
                      className='buy-button'
                      onClick={(e) => {
                        e.preventDefault()
                        setStake_status(2)
                      }}
                    >
                      Unstake
                    </button>
                  </>
                )}
                {stake_status === 1 && (
                  <>
                    {allowance > amount_in ? (
                      <button
                        className='buy-button'
                        onClick={(e) => {
                          e.preventDefault()
                          stakeFunction()
                        }}
                      >
                        Stake
                      </button>
                    ) : (
                      <button
                        className='buy-button'
                        onClick={(e) => {
                          e.preventDefault()
                          approveFunction()
                        }}
                      >
                        Approve
                      </button>
                    )}
                  </>
                )}
                {stake_status === 2 && (
                  <button
                    className='buy-button'
                    onClick={(e) => {
                      e.preventDefault()
                      unstakeFunction()
                    }}
                  >
                    Unstake
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id='background-radial-gradient'
        style={{
          width: '200vw',
          height: '200vh',
          transform: 'translate(-50vw, -100vh)',
          background: 'linear-gradient(rgb(32, 39, 56) 0%, rgb(7, 8, 22) 100%)',
        }}
      ></div>
    </>
  )
}

export default Staking
