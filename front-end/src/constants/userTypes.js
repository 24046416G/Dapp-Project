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
            path: '/mining',
            name: 'Mining',
            icon: 'FaGem'
        },
        {
            path: '/inventory',
            name: 'My Diamonds',
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
            path: '/marketplace',
            name: 'Marketplace',
            icon: 'FaStore'
        },
        {
            path: '/my-collection',
            name: 'My Collection',
            icon: 'FaGem'
        },
        {
            path: '/orders',
            name: 'Orders',
            icon: 'FaShoppingBag'
        },
        {
            path: '/profile',
            name: 'Profile',
            icon: 'FaUser'
        }
    ]
}; 