export const USER_TYPES = {
    ADMIN: 'ADMIN',
    MINER: 'MINER',
    JEWELER: 'JEWELER',
    CUSTOMER: 'CUSTOMER'
};

// 定义每种用户类型可以访问的路由
export const USER_ROUTES = {
    [USER_TYPES.ADMIN]: [
        {
            path: '/dashboard',
            name: 'Dashboard',
            icon: 'FaChartLine'
        },
        {
            path: '/inventory',
            name: 'Inventory',
            icon: 'FaBoxes'
        },
        {
            path: '/users',
            name: 'Users',
            icon: 'FaUsers'
        },
        {
            path: '/settings',
            name: 'Settings',
            icon: 'FaCog'
        }
    ],
    [USER_TYPES.MINER]: [
        {
            path: '/mining_record',
            name: 'Mining Record',
            icon: 'FaGem'
        },
        {
            path: '/inventory',
            name: 'Inventory',
            icon: 'FaBoxes'
        },
        {
            path: '/profile',
            name: 'Profile',
            icon: 'FaUser'
        }
    ],
    [USER_TYPES.JEWELER]: [
        {
            path: '/workshop',
            name: 'Workshop',
            icon: 'FaHammer'
        },
        {
            path: '/inventory',
            name: 'Inventory',
            icon: 'FaBoxes'
        },
        {
            path: '/orders',
            name: 'Orders',
            icon: 'FaShoppingCart'
        },
        {
            path: '/profile',
            name: 'Profile',
            icon: 'FaUser'
        }
    ],
    [USER_TYPES.CUSTOMER]: [
        {
            path: '/store',
            name: 'Store',
            icon: 'FaStore'
        },
        {
            path: '/my_collection',
            name: 'My Collection',
            icon: 'FaGem'
        },
    ]
}; 