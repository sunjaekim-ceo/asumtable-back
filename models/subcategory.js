module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define(
    "Subcategory",
    {
      title: {
        type: DataTypes.STRING(30),
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
  Subcategory.associate = (db) => {
    db.Subcategory.belongsTo(db.Category);
  };
  return Subcategory;
};
