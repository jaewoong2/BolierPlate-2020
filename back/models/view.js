module.exports = (sequelize, DataTypes) => {
    const View = sequelize.define('View', { //users로 mySQL 로 저장됨(테이블)
       //id가 기본적으로 들어있다.
        name : {
            type : DataTypes.STRING(150),
            allowNull : false,
        },
    }, 
    {
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci'
    });
    View.associate = (db) => {
        db.View.belongsTo(db.Post);
    };
    return View;
}