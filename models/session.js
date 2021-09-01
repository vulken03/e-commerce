module.exports = (sequelize, Sequelize) => {
    const session = sequelize.define("session", {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      login_time: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      time_to_leave: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      is_loggedout: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });
    return session;
  };
  