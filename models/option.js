module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define(
    "Option",
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //한글과 이모티콘 저장
      timestamps: "true",
    }
  );
  Option.associate = (db) => {
    db.Option.belongsTo(db.Tour);
  };
  return Option;
};
