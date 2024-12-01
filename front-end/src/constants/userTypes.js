export const USER_TYPES = {
    CUTTING_COMPANY: 'CUTTING_COMPANY',
    JEWELRY_MAKER: 'JEWELRY_MAKER',
    MINING_COMPANY: 'MINING_COMPANY',
    GRADING_LAB: 'GRADING_LAB',
    CUSTOMER: 'CUSTOMER'
};

// 定义每种用户类型可以访问的路由
export const USER_ROUTES = {
    [USER_TYPES.CUTTING_COMPANY]: [
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
            name: 'Diamond Store',
            icon: 'FaStore'
        }
    ],
    [USER_TYPES.MINING_COMPANY]: [
        {
            path: '/record',
            name: 'Mining Record',
            icon: 'FaGem'
        },
    ],
    [USER_TYPES.JEWELRY_MAKER]: [
        {
            path: '/record',
            name: 'Jewelry Record',
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
            name: 'Customer Center',
            icon: 'FaUser'
        },
        {
            path: '/store',
            name: 'Customer Store',
            icon: 'FaStore'
        },
        {
            path: '/certificate',
            name: 'Verification',
            icon: 'FaGem'
        }
    ],
    [USER_TYPES.GRADING_LAB]: [
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
            name: 'Diamond Store',
            icon: 'FaStore'
        }
    ]
}; 