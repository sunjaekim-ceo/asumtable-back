module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      title: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", //한글과 이모티콘 저장
      timestamps: "false",
    }
  );
  Category.associate = (db) => {
    db.Category.belongsTo(db.Tour);
    db.Category.hasMany(db.Subcategory, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
  };
  return Category;
};
