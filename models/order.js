module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      qty: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      tour_date: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      option: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      total_price: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      terms: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //한글과 이모티콘 저장
      timestamps: "true",
    }
  );
  Order.associate = (db) => {
    db.Order.belongsTo(db.Tour);
    db.Order.belongsTo(db.User);
  };
  return Order;
};
