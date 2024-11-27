import React, { useState, useEffect } from 'react';
import RecordCard from '../Common/RecordCard/Index.jsx';
import RecordDetailModal from '../Common/RecordDetailModal/Index.jsx';
import { USER_TYPES } from '../../constants/userTypes';
import '../../css/recordCard.css';

const Record = ({ userType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch('http://localhost:3000/diamonds/all/diamonds');
                if (!response.ok) {
                    throw new Error('Failed to fetch records');
                }
                const data = await response.json();
                
                // 从钻石数据中提取历史记录
                const allRecords = data.flatMap(diamond => 
                    diamond.history.map(record => ({
                        ...record,
                        diamondId: diamond.diamondId,
                        id: `${diamond._id}-${record.date}`,  // 创建唯一ID
                        metadata: diamond.metadata
                    }))
                );

                setRecords(allRecords);
                console.log('allRecords',allRecords);
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
                    <div key={record.index} className="data-grid-item">
                        <RecordCard 
                            record={record}
                            onClick={handleRecordClick}
                        />
                    </div>
                ))}
            </div>

            {selectedRecord && (
                <RecordDetailModal
                    record={selectedRecord}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Record; 