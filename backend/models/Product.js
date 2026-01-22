const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('dress', 'top', 'bottom', 'set'),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    sizes: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    sizeGuide: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        get() {
            const rawValue = this.getDataValue('sizeGuide');
            if (!rawValue) return null;
            if (typeof rawValue === 'string') {
                try {
                    return JSON.parse(rawValue);
                } catch (e) {
                    return rawValue; // Return as string if not valid JSON
                }
            }
            return rawValue;
        },
        set(value) {
            if (value === null || value === undefined || value === '') {
                this.setDataValue('sizeGuide', null);
            } else if (typeof value === 'object') {
                this.setDataValue('sizeGuide', JSON.stringify(value));
            } else {
                this.setDataValue('sizeGuide', value);
            }
        }
    },
    colors: {
        type: DataTypes.JSON,
        defaultValue: ['Nude', 'Beige', 'Cream', 'Sand']
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isNewArrival: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isBestSeller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'products',
    timestamps: true
});

module.exports = Product;
