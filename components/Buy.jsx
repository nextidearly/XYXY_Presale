import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import ConnectModal from './Connect/ConnectModal'
import { BigNumber, ethers } from 'ethers'
import Web3 from 'web3'
import { Modal, Container, Nav, Navbar } from 'react-bootstrap'

import toast from 'react-hot-toast'

function Buy() {
  return (
    <>
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
                  <div className='links-div'>
                    <Nav.Link href='/presale'>Presale</Nav.Link>
                  </div>
                  <div className='links-div'>
                    <Nav.Link href='/airdrop'>Airdrop</Nav.Link>
                  </div>
                  <div className='links-div'>
                    <Nav.Link href='/stake'>Stake</Nav.Link>
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
            <h1>Buy</h1>
          </div>
        </div>
        <div className='swap-container'>
          <h3 style={{ color: 'white' }}>Coming soon</h3>
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

export default Buy
