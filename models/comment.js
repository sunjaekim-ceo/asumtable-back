module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      // 댓글 내용
      content: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      // 부모 댓글 idx
      ref_comment: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //한글과 이모티콘 저장
      timestamps: "true",
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.Review);
    db.Comment.belongsTo(db.Tour);
    db.Comment.belongsTo(db.User);
  };
  return Comment;
};
