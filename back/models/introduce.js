module.exports = (sequelize, DataTypes) => {
    const Introduce = sequelize.define('Introduce', {
        content : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
    } , {
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci'
    });
    Introduce.associate = (db) => {
        db.Introduce.belongsTo(db.User);
    }
    return Introduce;
}