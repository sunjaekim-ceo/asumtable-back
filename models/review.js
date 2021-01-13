module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rating: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //한글과 이모티콘 저장
      timestamps: "true",
    }
  );
  Review.associate = (db) => {
    db.Review.belongsTo(db.User);
    db.Review.belongsTo(db.Tour);
    db.Review.hasMany(db.Comment, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
  };
  return Review;
};
