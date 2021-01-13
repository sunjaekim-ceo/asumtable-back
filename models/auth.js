module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    "Auth",
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      year: {
        type: DataTypes.STRING(4),
        allowNull: true,
      },
      month: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      day: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      age_range: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      kakao: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
      timestamps: "true",
    }
  );
  Auth.associate = (db) => {
    db.Auth.hasOne(db.User, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
    db.Auth.hasOne(db.Host, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
    db.Auth.hasMany(db.Order, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
  };
  return Auth;
};
