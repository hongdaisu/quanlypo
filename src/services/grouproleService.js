
import db from "../models/index";
import role from "../models/role";
import { getGroupWithRoles } from './JWTService';
// import { createJWT } from '../middleware/JWTAction';
import { repairToken } from '../middleware/JWTAction';
import { checkUserJWT } from '../middleware/JWTAction';

require('dotenv').config();

let getAllRole = () => {
    return new Promise(async (resolve, reject) => {
        let role = '';
        try {
            let role = await db.sequelize.query('CALL sp_get_grouprole',
                {
                    // replacements: { id: 2 },
                    raw: false
                }
            );
            // console.log('roles', role)
            resolve(role)
        } catch (e) {
            reject(e)
        }
    })
}


let createNewRoleGroup = (data, req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let success = true;
            // console.log('data', data)
            // const user = { use_groupId: parseInt(data.use_groupId) };
            // delete data.use_groupId;
            // let cookies = req.cookies;
            // console.log('cookies', cookies)
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const groupRole = data[key];
                    // console.log('groupRole', groupRole)
                    try {
                        await db.Group_Roles.create({
                            groupId: groupRole.groupId,
                            roleId: groupRole.roleId
                        })
                    } catch (error) {
                        success = false;
                    }
                }
            }

            let groupId;
            for (const key in data) {
                if (data[key] && data[key].groupId) {
                    groupId = data[key].groupId;
                    break; // Dừng vòng lặp khi đã tìm thấy groupId
                }
            }
            const user = { use_groupId: groupId };

            if (success) {
                // let groupWithRoles = await getGroupWithRoles(user);
                // repairToken(req, res, groupWithRoles);
                resolve({
                    errCode: 0,
                    errMessage: 'Phân quyền thành công'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Có lỗi khi phân quyền'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let deleteRoleGroup = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let success = true;
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const groupRole = data[key];
                    // console.log('xóa', groupRole)
                    try {
                        await db.Group_Roles.destroy({
                            where: {
                                groupId: groupRole.groupId,
                                roleId: groupRole.roleId
                            }
                        });
                    } catch (error) {
                        success = false;
                    }
                }
            }

            if (success) {
                resolve({
                    errCode: 0,
                    errMessage: 'Cập nhập phân quyền thành công'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Có lỗi khi phân quyền'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllRoleGroup = (data) => {
    // console.log(data.id)
    return new Promise(async (resolve, reject) => {
        // let grouprole = '';
        try {
            let grouprole = await db.sequelize.query('CALL sp_get_grouprole_checkbox(:groupId)',
                {
                    replacements: { groupId: data.id },
                    raw: true
                }
            );
            resolve(grouprole)

        } catch (e) {
            reject(e)
        }
    })
}

let checkRoleGroup = (data) => {
    // console.log(data.id)
    return new Promise(async (resolve, reject) => {
        // let grouprole = '';
        try {
            let grouprole = await db.sequelize.query('CALL sp_get_grouprole_check(:groupId)',
                {
                    replacements: { groupId: data.id },
                    raw: true
                }
            );
            resolve(grouprole)

        } catch (e) {
            reject(e)
        }
    })
}

let createNewRole = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log('check data', data)
        try {
            await db.Role.create({
                url: data.url,
                action: data.action,
                MoTa: data.mota,
                Nhom: 'role'
            })
            resolve({
                errCode: 0,
                errMessage: 'Tạo Role thành công'
            })
        } catch (e) {
            reject(e)
        }
    })
}


let editRole = (data) => {
    // console.log('data', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Vui lòng chọn thông tin cần cập nhập'
                })
            }
            let role = await db.Role.findOne({
                where: { id: data.id },
                raw: false
            })
            if (role) {
                role.url = data.url;
                role.action = data.action;
                role.MoTa = data.MoTa;

                await role.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Sửa Role thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy thông tin'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteRole = (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            let checkrole = await db.Group_Roles.findOne({
                where: { roleId: data }
            })
            // let checkgroup = await db.sequelize.query('CALL sp_validate_grouprole(:group_id)',
            //     {
            //         replacements: { group_id: data },
            //         raw: true
            //     }
            // );
            // console.log('checkrole', checkrole)
            if (!checkrole) {
                await db.Role.destroy({
                    where: { id: data }
                })
                resolve({
                    errCode: 0,
                    errMessage: `Đã xóa thông tin thành công`
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Role đang sử dụng không được xóa`
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getAllGroup = () => {
    return new Promise(async (resolve, reject) => {
        let group = '';
        try {
            //group = await db.Group.findAll()
            // console.log('checkgroup', group)
            let group = await db.Group.findAll({
                attributes: ['id', 'Group', 'MoTa', 'MaGroup'],
                raw: true
            });
            //console.log('checkgroup', group)
            resolve(group)
        } catch (e) {
            reject(e)
        }
    })
}

let checkGroup = (Group) => {
    return new Promise(async (resolve, reject) => {
        try {
            let group = await db.Group.findOne({
                where: { Group: Group }
            });
            if (group) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            resolve(e)
        }
    })
}



let createNewGroup = (data) => {
    // console.log('data group', data)
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkGroup(data.group);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Nhóm quyền đã tồn tại'
                })
            } else {
                await db.Group.create({
                    Group: data.group,
                    MoTa: data.mota,
                    MaGroup: data.maGroup,
                    Nhom: 'group'
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Tạo nhóm quyền thành công'
            })
        } catch (e) {
            reject(e)
        }
    })
}
let editGroup = (data) => {
    // console.log('data', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Vui lòng chọn thông tin cần cập nhập'
                })
            }
            let group = await db.Group.findOne({
                where: { id: data.id },
                raw: false
            })
            if (group) {
                group.Group = data.Group;
                group.MoTa = data.MoTa;
                group.MaGroup = data.MaGroup;

                await group.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Sửa thông tin thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy thông tin'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteGroup = (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            let checkgroup = await db.Group_Roles.findOne({
                where: { groupId: data }
            })
            // let checkgroup = await db.sequelize.query('CALL sp_validate_grouprole(:group_id)',
            //     {
            //         replacements: { group_id: data },
            //         raw: true
            //     }
            // );
            if (!checkgroup) {
                await db.Group.destroy({
                    where: { id: data }
                })
                resolve({
                    errCode: 0,
                    errMessage: `Đã xóa thông tin thành công`
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Group đang sử dụng không được xóa`
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllRole: getAllRole,
    getAllGroup: getAllGroup,
    createNewGroup: createNewGroup,
    editGroup: editGroup,
    createNewRole: createNewRole,
    editRole: editRole,
    getAllRoleGroup: getAllRoleGroup,
    checkRoleGroup: checkRoleGroup,
    deleteGroup: deleteGroup,
    deleteRole: deleteRole,
    createNewRoleGroup: createNewRoleGroup,
    deleteRoleGroup: deleteRoleGroup
}
