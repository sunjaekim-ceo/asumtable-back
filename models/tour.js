module.exports = (sequelize, DataTypes) => {
  const Tour = sequelize.define(
    "Tour",
    {
      title: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      about: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      option: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      closedDays: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      refund_type: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //한글과 이모티콘 저장
      timestamps: "true",
    }
  );
  Tour.associate = (db) => {
    db.Tour.belongsTo(db.User); //post.addUser
    db.Tour.hasMany(db.Category, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    }); //post.addCategories
    db.Tour.hasMany(db.Review, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    }); //post.addReviews
    db.Tour.hasMany(db.Comment, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    }); //post.addComments
    db.Tour.hasMany(db.Image, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    }); //post.addImages
    db.Tour.hasMany(db.Option, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    }); //post.addOptions
    db.Tour.hasMany(db.Order, {
      foreignKey: { allowNull: true },
      type: DataTypes.UUID,
    }); //post.addOptions
    db.Tour.belongsToMany(db.Tag, { through: "TourTags" }); //post.addStyles  post.removeStyles
    db.Tour.belongsToMany(db.User, { through: "Love", as: "Lovers" }); //post.addFavorites  post.removeFavorites
  };
  return Tour;
};
