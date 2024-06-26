module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define("Quiz", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Represents the creator (teacher) of the quiz
    },
  });

  Quiz.associate = (models) => {
    Quiz.hasMany(models.UserQuiz, {
      foreignKey: "quizId",
      onDelete: "CASCADE",
    });
    Quiz.belongsTo(models.User, {
      as: "Creator",
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Quiz.belongsTo(models.Category, {
      as: "categoryAlias",
      foreignKey: "categoryId",
      onDelete: "CASCADE",
    });
    Quiz.hasMany(models.Question, {
      foreignKey: "quizId",
      onDelete: "CASCADE",
    });
  };

  return Quiz;
};
