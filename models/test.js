module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define(
      "Test",
      {
        src: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //한글과 이모티콘 저장
        timestamps: "true",
      }
    );
    Test.associate = (db) => {
    };
    return Test;
  };