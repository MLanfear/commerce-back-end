// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: { //Product Name
      type: DataTypes.STRING,
      allowNull: false
    },
    price: { //Price
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        value: '.[0-9]+$',
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: [10],
      //Validate numeric value
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        ket: 'id',
        default: 1
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
)

module.exports = Product;
