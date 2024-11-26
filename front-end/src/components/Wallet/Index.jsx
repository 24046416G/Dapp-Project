import React, { useState, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import '../../css/wallet.css';

const Wallet = () => {
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [provider, setProvider] = useState(null);

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                // 创建 provider
                const ethersProvider = new BrowserProvider(window.ethereum);
                setProvider(ethersProvider);

                // 请求用户授权连接钱包
                const accounts = await ethersProvider.send("eth_requestAccounts", []);
                const account = accounts[0];
                
                // 获取账户余额
                const balance = await ethersProvider.getBalance(account);
                const ethBalance = formatEther(balance);
                
                setAccount(account);
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
            window.ethereum.on('accountsChanged', async (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    if (provider) {
                        const balance = await provider.getBalance(accounts[0]);
                        setBalance(formatEther(balance));
                    }
                } else {
                    setAccount('');
                    setBalance('');
                    setIsConnected(false);
                }
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        };
    }, [provider]);

    return (
        <div className="container">
            <div className="wallet-header">
                <div className="header-content">
                    <div>
                        <h2>My Ethereum Wallet</h2>
                        {isConnected ? (
                            <>
                                <p className="wallet-address">
                                    Address: {`${account.slice(0, 6)}...${account.slice(-4)}`}
                                </p>
                                <p className="wallet-balance">
                                    Balance: {Number(balance).toFixed(4)} ETH
                                </p>
                            </>
                        ) : (
                            <button 
                                className="connect-wallet-button"
                                onClick={connectWallet}
                            >
                                Connect MetaMask
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet; 