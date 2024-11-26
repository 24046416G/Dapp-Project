export const USER_TYPES = {
    CUTTING: 'CUTTING',
    GRADING: 'GRADING',
    MINER: 'MINER',
    JEWELER: 'JEWELER',
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
            path: '/buy-raw-stones',
            name: 'Buy Raw Stones',
            icon: 'FaShoppingCart'
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
        }
    ],
    [USER_TYPES.JEWELER]: [
        {
            path: '/store',
            name: 'Diamond Store',
            icon: 'FaHammer'
        },
        {
            path: '/inventory',
            name: 'Inventory',
            icon: 'FaBoxes'
        },
    ],
    [USER_TYPES.CUSTOMER]: [
        {
            path: '/personal',
            name: 'Personal Center',
            icon: 'FaUser'
        },
        {
            path: '/store',
            name: 'Store',
            icon: 'FaStore'
        },
        {
            path: '/collections',
            name: 'My Collections',
            icon: 'FaGem'
        }
    ],
    [USER_TYPES.GRADING]: [
        {
            path: '/record',
            name: 'Grading Record',
            icon: 'FaGem'
        },
    ]
}; 