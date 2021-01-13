module.exports = (sequelize, DataTypes) => {
  const Host = sequelize.define(
    "Host",
    {
      host_name: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      host_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      host_phone: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      business_type: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      business_license: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bank_account: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contract: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      personal_information: {
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
  Host.associate = (db) => {
    db.Host.belongsTo(db.User);
  };
  return Host;
};
