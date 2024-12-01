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
    console.log('userType in record page',userType);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    throw new Error('User not found');
                }
                const user = JSON.parse(userStr);

                let response;
                // 根据用户类型调用不同的接口
                switch(userType) {
                    case USER_TYPES.JEWELRY_MAKER:
                        response = await fetch('http://localhost:3000/jewelries/all');
                        break;
                    case USER_TYPES.MINING_COMPANY:
                    case USER_TYPES.CUTTING_COMPANY:
                    case USER_TYPES.GRADING_LAB:
                    case USER_TYPES.CUSTOMER:
                    default:
                        response = await fetch('http://localhost:3000/diamonds/all/diamonds');
                        break;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch records');
                }

                const data = await response.json();
                console.log('Raw data:', data);

                // 根据用户类型筛选数据
                let filteredData;
                switch(userType) {
                    case USER_TYPES.JEWELRY_MAKER:
                        // 珠宝制造商看到所有珠宝记录
                        filteredData = data.jewelries || [];
                        break;
                    case USER_TYPES.CUTTING_COMPANY:
                        filteredData = data.filter(record => 
                            record.status === 'CUT' && 
                            (record.currentOwner?._id === user.id || 
                            record.history.some(h => h.owner?._id === user.id))
                        );
                        break;
                    case USER_TYPES.GRADING_LAB:
                        filteredData = data.filter(record => 
                            record.status === 'GRADED' && 
                            (record.currentOwner?._id === user.id || 
                            record.history.some(h => h.owner?._id === user.id))
                        );
                        break;
                    case USER_TYPES.MINING_COMPANY:
                        filteredData = data.filter(record => 
                            record.status === 'MINED' && 
                            (record.currentOwner?._id === user.id || 
                            record.history.some(h => h.owner?._id === user.id))
                        );
                        break;
                    case USER_TYPES.CUSTOMER:
                        filteredData = data.filter(record => 
                            record.status === 'SOLD' && 
                            (record.currentOwner?._id === user.id || 
                            record.history.some(h => h.owner?._id === user.id))
                        );
                        break;
                    default:
                        filteredData = data;
                }

                console.log('Filtered records:', filteredData);
                setRecords(filteredData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching records:', error);
                setError('Failed to load records');
                setLoading(false);
            }
        };

        fetchRecords();
    }, [userType]);

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
                    <div key={record._id} className="data-grid-item">
                        <RecordCard        
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
                    userType={userType}
                    record={selectedRecord}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <AddRecordModal
                userType={userType}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default Record; 