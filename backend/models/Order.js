const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    customerInfo: {
        type: DataTypes.JSON,
        allowNull: false
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    shippingCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.ENUM('card', 'paypal', 'paygate', 'eft'),
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    orderStatus: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    paygateId: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    transactionId: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    trackingNumber: {
        type: DataTypes.STRING(100),
        defaultValue: ''
    }
}, {
    tableName: 'orders',
    timestamps: true,
    hooks: {
        beforeCreate: (order) => {
            if (!order.orderNumber) {
                const date = new Date();
                const randomNum = Math.floor(Math.random() * 10000);
                order.orderNumber = `MF${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${randomNum}`;
            }
        }
    }
});

module.exports = Order;
