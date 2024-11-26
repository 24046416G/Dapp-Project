import React, { useState, useEffect } from 'react';
import '../../css/wallet.css';
import { BrowserProvider, formatEther } from 'ethers';

const Wallet = () => {
    const [balance, setBalance] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                // 请求用户授权
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                
                const provider = new BrowserProvider(window.ethereum);
                const balance = await provider.getBalance(accounts[0]);
                const ethBalance = formatEther(balance);
                
                setAccount(accounts[0]);
                setBalance(ethBalance);
                setIsConnected(true);
            } else {
                alert('Please install MetaMask!');
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    };

    // 监听账户变化
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    updateBalance(accounts[0]);
                } else {
                    setAccount(null);
                    setBalance(null);
                    setIsConnected(false);
                }
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        };
    }, []);

    const updateBalance = async (address) => {
        if (window.ethereum) {
            const provider = new BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(address);
            setBalance(formatEther(balance));
        }
    };

    return (
        <div className="container">
            <div className="wallet-header">
                <div className="header-content">
                    <div>
                        <h2>My Ethereum Wallet</h2>
                        {isConnected ? (
                            <>
                                <p className="wallet-address">Address: {account}</p>
                                <p className="wallet-balance">Balance: {balance ? `${Number(balance).toFixed(4)} ETH` : 'Loading...'}</p>
                            </>
                        ) : (
                            <button className="connect-wallet-button" onClick={connectWallet}>
                                Connect MetaMask
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isConnected && (
                <div className="transaction-section">
                    <h3>Recent Transactions</h3>
                    <div className="transaction-list">
                        {/* 这里可以添加交易历史记录 */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet; 