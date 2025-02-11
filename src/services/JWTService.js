import db from '../models/index';

const getGroupWithRoles = async (user) => {
    // console.log('user', user)
    // let roles = await db.Group.findAll({
    //     where: { id: user.use_groupId },
    //     attributes: ['id', 'Group', 'Mota'],
    //     include:
    //     {
    //         model: db.Role,
    //         attributes: ['id', 'url', 'MoTa', 'action'],
    //         through: { attributes: [] }
    //     },

    //     raw: true,
    //     nest: true
    // })
    return new Promise(async (resolve, reject) => {
        try {
            let roles = await db.sequelize.query('CALL sp_get_getGroupWithRoles(:group_id)',
                {
                    replacements: { group_id: user.use_groupId },
                    raw: true,
                    nest: true
                }
            );
            // console.log('check getGroupWithRoles', roles)
            // return roles ? roles : {}
            resolve(roles ? roles : {});
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    getGroupWithRoles
}