import React, { useState, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import { FaWallet, FaGem, FaCertificate } from 'react-icons/fa';
import '../../css/wallet.css';

const Wallet = () => {
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [provider, setProvider] = useState(null);

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const ethersProvider = new BrowserProvider(window.ethereum);
                setProvider(ethersProvider);

                const accounts = await ethersProvider.send("eth_requestAccounts", []);
                const account = accounts[0];
                
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
        <>
            <div className="wallet-header">
                <div className="header-content">
                    <div className="wallet-card">
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
                            <div className="wallet-connect-section">
                                <div className="wallet-features">
                                    <h3>通过连接您的 MetaMask 钱包，您可以：</h3>
                                    <div className="feature-list">
                                        <div className="feature-item">
                                            <FaWallet className="feature-icon" />
                                            <span>安全管理您的数字资产</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaGem className="feature-icon" />
                                            <span>更好地管理您的珠宝珍藏</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCertificate className="feature-icon" />
                                            <span>获取珠宝详细的认证数据</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="connect-wallet-button"
                                    onClick={connectWallet}
                                >
                                    Connect MetaMask
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Wallet; 