import React from 'react';
import { USER_TYPES } from '../../../constants/userTypes';
import '../../../css/recordCard.css';

const RecordCard = ({ record, onClick, userType }) => {
    const renderContent = () => {
        console.log('record in record card',record);
        switch(userType) {
            case USER_TYPES.MINING_COMPANY:
                return (
                    <div className="record-body">
                        <div className="record-detail">
                            <span>Diamond ID:</span>
                            <span>{record.diamondId}</span>
                        </div>
                        <div className="record-detail">
                            <span>Weight:</span>
                            <span>{record.metadata?.carat} carats</span>
                        </div>
                        <div className="record-detail">
                            <span>Origin:</span>
                            <span>{record.metadata?.origin}</span>
                        </div>
                        <div className="record-detail">
                            <span>Status:</span>
                            <span>{record.status}</span>
                        </div>
                    </div>
                );

            case USER_TYPES.CUTTING_COMPANY:
                return (
                    <div className="record-body">
                        <div className="record-detail">
                            <span>Diamond ID:</span>
                            <span>{record.diamondId}</span>
                        </div>
                        <div className="record-detail">
                            <span>Cut:</span>
                            <span>{record.metadata?.cut}</span>
                        </div>
                        <div className="record-detail">
                            <span>Polish:</span>
                            <span>{record.metadata?.polish}</span>
                        </div>
                        <div className="record-detail">
                            <span>Status:</span>
                            <span>{record.status}</span>
                        </div>
                    </div>
                );

            case USER_TYPES.GRADING_LAB:
                return (
                    <div className="record-body">
                        <div className="record-detail">
                            <span>Diamond ID:</span>
                            <span>{record.diamondId}</span>
                        </div>
                        <div className="record-detail">
                            <span>Grading:</span>
                            <span>{record.metadata?.grading}</span>
                        </div>
                        <div className="record-detail">
                            <span>Color:</span>
                            <span>{record.metadata?.color}</span>
                        </div>
                        <div className="record-detail">
                            <span>Status:</span>
                            <span>{record.status}</span>
                        </div>
                    </div>
                );

            case USER_TYPES.JEWELRY_MAKER:
                return (
                    <div className="record-body">
                        <div className="record-detail">
                            <span>Jewelry ID:</span>
                            <span>{record.jewelryId}</span>
                        </div>
                        <div className="record-detail">
                            <span>Jewelry Name</span>
                            <span>{record.name}</span>
                        </div>
                        <div className="record-detail">
                            <span>Price:</span>
                            <span>${record.price}</span>
                        </div>
                    </div>
                );

            default:
                return (
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
                );
        }
    };

    return (
        <div className="record-card" onClick={() => onClick(record)}>
            <div className="card-header">
                <h3>{userType} Record</h3>
            </div>
            {renderContent()}
        </div>
    );
};

export default RecordCard; 