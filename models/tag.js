module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      title: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", //한글과 이모티콘 저장
      timestamps: "false",
    }
  );
  Tag.associate = (db) => {
    db.Tag.belongsToMany(db.User, { through: "Prefers" });
    db.Tag.belongsToMany(db.Tour, { through: "TourTags" });
  };
  return Tag;
};
