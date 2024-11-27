import request from "@/utils/request";

// 分页查询角色数据
export const GetSysRoleListByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: "/system/sysRole/findByPage/" + pageNum + "/" + pageSize,
    method: "get",
    params: queryDto,
  });
};

// 添加角色请求方法
export const SaveSysRole = (data) => {
  return request({
    url: "/system/sysRole/saveSysRole",
    method: "post",
    data,
  });
};

// 保存修改
export const UpdateSysRole = (data) => {
  return request({
    url: "/system/sysRole/updateSysRole",
    method: "put",
    data,
  });
};

// 删除角色
export const DeleteSysRoleById = (roleId) => {
  return request({
    url: "/system/sysRole/deleteById/" + roleId,
    method: "delete",
  });
};

// 查询所有的角色数据
export const GetAllRoleList = (userId) => {
  return request({
    url: "/system/sysRole/findAllRoles/" + userId,
    method: "get",
  });
};
