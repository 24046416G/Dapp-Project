import React, { useState, useEffect } from 'react';
import RecordCard from '../Common/RecordCard/Index.jsx';
import RecordDetailModal from '../Common/RecordDetailModal/Index.jsx';
import Button from '../Common/Button/Index.jsx';
import AddRecordModal from '../Common/AddRecordModal/Index.jsx';
import { USER_TYPES } from '../../constants/userTypes';
import '../../css/recordCard.css';
import '../../css/record.css';

const Record = ({ userType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch('http://localhost:3000/diamonds/all/diamonds');
                if (!response.ok) {
                    throw new Error('Failed to fetch records');
                }
                const data = await response.json();

                setRecords(data);
                console.log('records',records);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching records:', error);
                setError('Failed to load records');
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    const renderHeader = () => {
        console.log('userType', userType);
        switch(userType) {
            case USER_TYPES.JEWELRY_MAKER:
                return {
                    title: "Jewelry Making Records",
                    description: "Track your jewelry making history"
                };
            case USER_TYPES.GRADING_LAB:
                return {
                    title: "Diamond Grading Records",
                    description: "View all diamond grading history"
                };
            case USER_TYPES.CUTTING_COMPANY:
                return {
                    title: "Diamond Cutting Records",
                    description: "Track your diamond cutting history"
                };
            case USER_TYPES.CUSTOMER:
                return {
                    title: "Purchase Records",
                    description: "View your jewelry purchase history"
                };
            case USER_TYPES.MINING_COMPANY:
                return {
                    title: "Mining Records",
                    description: "View your mining history"
                };
            default:
                return {
                    title: "Transaction Records",
                    description: "View all transaction history"
                };
        }
    };

    const headerContent = renderHeader();

    const handleRecordClick = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleAddRecord = () => {
        setIsAddModalOpen(true);
    };

    const handleAddSubmit = async (formData) => {
        try {
            // 获取当前用户信息
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('User not found');
            }
            const user = JSON.parse(userStr);

            // 发送请求到后端
            const response = await fetch('http://localhost:3000/diamonds/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add record');
            }

            // 刷新记录列表
            fetchRecords();
            alert('Record added successfully!');
        } catch (error) {
            console.error('Error adding record:', error);
            alert('Failed to add record: ' + error.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container">
            <div className="record-header">
                <div className="header-content">
                    <div>
                        <h2>{headerContent.title}</h2>
                        <p>{headerContent.description}</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Total Records</span>
                            <span className="stat-value">{records.length}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="data-grid">
                {records.map((record) => (
                    <div className="data-grid-item">
                        <RecordCard 
                            key={record.id}
                            userType={userType}
                            record={record}
                            onClick={handleRecordClick}
                        />
                    </div>
                ))}
            </div>

            {userType === USER_TYPES.MINING_COMPANY && (
                <div className="add-record-button-container">
                    <Button 
                        onClick={handleAddRecord}
                        type="primary"
                    >
                        Add New Mining Record
                    </Button>
                </div>
            )}

            {selectedRecord && (
                <RecordDetailModal
                    record={selectedRecord}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <AddRecordModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddSubmit}
            />
        </div>
    );
};

export default Record; 