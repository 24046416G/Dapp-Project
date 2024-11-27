import React from 'react';
import '../../../css/recordCard.css';

const RecordCard = ({ record, onClick }) => {
    return (
        <div className="record-card" onClick={() => onClick(record)}>
            <div className="record-header">
                <h3>{record.type} Record</h3>
                <span className="record-date">{new Date(record.date).toLocaleDateString()}</span>
            </div>
            <div className="record-body">
                <div className="record-detail">
                    <span>Diamond ID:</span>
                    <span>{record.diamondId}</span>
                </div>
                <div className="record-detail">
                    <span>Status:</span>
                    <span>{record.status}</span>
                </div>
                <div className="record-detail">
                    <span>From:</span>
                    <span>{record.from}</span>
                </div>
                <div className="record-detail">
                    <span>To:</span>
                    <span>{record.to}</span>
                </div>
                {record.price && (
                    <div className="record-detail">
                        <span>Price:</span>
                        <span>${record.price}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecordCard; 