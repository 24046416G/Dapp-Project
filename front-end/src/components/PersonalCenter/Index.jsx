import React, { useState, useEffect } from 'react';
import Wallet from '../Wallet/Index.jsx';
import Collection from '../Collection/Index.jsx';
import { BrowserProvider } from 'ethers';
import '../../css/personalCenter.css';

const PersonalCenter = () => {
    const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);

    // 检查 MetaMask 连接状态
    const checkMetaMaskConnection = async () => {
        try {
            if (window.ethereum) {
                const provider = new BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                setIsMetaMaskConnected(accounts.length > 0);
            } else {
                setIsMetaMaskConnected(false);
            }
        } catch (error) {
            console.error('Error checking MetaMask connection:', error);
            setIsMetaMaskConnected(false);
        }
    };

    // 初始检查和监听账户变化
    useEffect(() => {
        checkMetaMaskConnection();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                setIsMetaMaskConnected(accounts.length > 0);
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        };
    }, []);

    // 如果未连接 MetaMask，只显示 Wallet 组件
    if (!isMetaMaskConnected) {
        return (
            <Wallet />
        );
    }

    // 如果已连接 MetaMask，直接显示 Collection 组件
    return <Collection />;
};

export default PersonalCenter; 