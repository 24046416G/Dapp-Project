export const USER_TYPES = {
    CUTTING: 'CUTTING_COMPANY',
    GRADING: 'GRADING_LAB',
    MINER: 'MINER_COMPANY',
    JEWELER: 'JEWELERY_MAKER',
    CUSTOMER: 'CUSTOMER'
};

// 定义每种用户类型可以访问的路由
export const USER_ROUTES = {
    [USER_TYPES.CUTTING]: [
        {
            path: '/record',
            name: 'Cut Record',
            icon: 'FaGem'
        },
        {
            path: '/available-stones',
            name: 'Available Stones',
            icon: 'FaRocketchat'
        },
        {
            path: '/store',
            name: 'Cutting Store',
            icon: 'FaStore'
        }
    ],
    [USER_TYPES.MINER]: [
        {
            path: '/record',
            name: 'Mining Record',
            icon: 'FaGem'
        },
        {
            path: '/mining-history',
            name: 'Mining History',
            icon: 'FaHistory'
        },
        {
            path: '/store',
            name: 'Miner Store',
            icon: 'FaStore'
        }

    ],
    [USER_TYPES.JEWELER]: [
        {
            path: '/jewelry-inventory',
            name: 'Jewelry',
            icon: 'FaGem'
        },
        {
            path: '/inventory',
            name: 'Diamond',
            icon: 'FaBoxes'
        },
        {
            path: '/store',
            name: 'Diamond Store',
            icon: 'FaStore'
        }
    ],
    [USER_TYPES.CUSTOMER]: [
        {
            path: '/personal',
            name: 'Personal Center',
            icon: 'FaUser'
        },
        {
            path: '/store',
            name: 'Customer Store',
            icon: 'FaStore'
        }
    ],
    [USER_TYPES.GRADING]: [
        {
            path: '/record',
            name: 'Grading Record',
            icon: 'FaGem'
        },
        {
            path: '/wait-to-grade',
            name: 'Wait to Grade',
            icon: 'FaHourglassHalf'
        },
        {
            path: '/store',
            name: 'Grading Store',
            icon: 'FaStore'
        }
    ]
}; 