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
                
                // 获取当前登录用户信息
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    alert('Please login first!');
                    return;
                }
                const user = JSON.parse(userStr);

                // 获取公钥（这里使用简化方式，实际应该使用更安全的方法）
                const publicKey = await window.ethereum.request({
                    method: 'eth_getEncryptionPublicKey',
                    params: [account],
                }).catch((error) => {
                    if (error.code === 4001) {
                        // 用户拒绝了请求
                        console.log('User denied account encryption');
                        return null;
                    }
                });

                // 发送钱包信息到后端
                const response = await fetch(`http://localhost:3000/users/${user.id}/connect`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        walletAddress: account,
                        publicKey: publicKey || account, // 如果获取公钥失败，使用地址作为备选
                        balance: ethBalance
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    setAccount(account);
                    setBalance(ethBalance);
                    setIsConnected(true);

                    // 更新本地存储中的用户信息
                    const updatedUser = {
                        ...user,
                        walletAddress: account,
                        balance: ethBalance
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));

                    alert('Wallet connected successfully!');
                } else {
                    alert(data.message || 'Failed to connect wallet');
                }
            } else {
                alert('Please install MetaMask!');
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Failed to connect wallet: ' + error.message);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    if (provider) {
                        const balance = await provider.getBalance(accounts[0]);
                        const ethBalance = formatEther(balance);
                        setBalance(ethBalance);

                        // 更新后端的钱包信息
                        const userStr = localStorage.getItem('user');
                        if (userStr) {
                            const user = JSON.parse(userStr);
                            try {
                                await fetch(`http://localhost:3000/users/${user.id}/connect`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        walletAddress: accounts[0],
                                        publicKey: accounts[0],
                                        balance: ethBalance
                                    })
                                });
                            } catch (error) {
                                console.error('Error updating wallet info:', error);
                            }
                        }
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
                        <h2>Connect Your Wallet</h2>
                        {isConnected ? (
                            <div className="wallet-info">
                                <div className="wallet-status">
                                    <FaWallet className="wallet-icon" />
                                    <span className="status-badge">Connected</span>
                                </div>
                                <p className="wallet-address">
                                    <span className="label">Address:</span>
                                    <span className="value">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                                </p>
                                <p className="wallet-balance">
                                    <span className="label">Balance:</span>
                                    <span className="value">{Number(balance).toFixed(4)} ETH</span>
                                </p>
                            </div>
                        ) : (
                            <div className="wallet-connect-section">
                                <div className="wallet-features">
                                    <h3>Connect MetaMask to Access Features</h3>
                                    <div className="feature-list">
                                        <div className="feature-item">
                                            <FaWallet className="feature-icon" />
                                            <div className="feature-text">
                                                <span className="feature-title">Digital Asset Management</span>
                                                <span className="feature-desc">Securely manage your digital assets</span>
                                            </div>
                                        </div>
                                        <div className="feature-item">
                                            <FaGem className="feature-icon" />
                                            <div className="feature-text">
                                                <span className="feature-title">Jewelry Collection</span>
                                                <span className="feature-desc">Better manage your jewelry collection</span>
                                            </div>
                                        </div>
                                        <div className="feature-item">
                                            <FaCertificate className="feature-icon" />
                                            <div className="feature-text">
                                                <span className="feature-title">Certification Data</span>
                                                <span className="feature-desc">Access detailed jewelry certification data</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="connect-wallet-button"
                                    onClick={connectWallet}
                                >
                                    <FaWallet className="button-icon" />
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