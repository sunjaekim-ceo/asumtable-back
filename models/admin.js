module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      host_name: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      host_image: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      host_phone: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      business_type: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      business_license: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      bank_account: {
        type: DataTypes.BLOB,
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
      approval: {
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
  Admin.associate = (db) => {
    db.Admin.hasMany(db.Tour, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
    db.Admin.belongsTo(db.Auth);
  };
  return Admin;
};
