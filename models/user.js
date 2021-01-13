module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
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
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      driver_license: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      social_number: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      bank_account: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      about: {
        type: DataTypes.TEXT,
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
      host_approval: {
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
  User.associate = (db) => {
    db.User.hasMany(db.Review, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
    db.User.belongsToMany(db.Tag, { through: "Prefers" });
    db.User.hasMany(db.Comment, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
    db.User.hasMany(db.Order, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
    db.User.hasOne(db.Host, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
    db.User.belongsToMany(db.Tour, { through: "Love", as: "Loved" });
    db.User.hasMany(db.Tour, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    });
  };
  return User;
};
