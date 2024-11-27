import request from "@/utils/request";

// 分页查询
export const GetSysUserListByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: "/system/sysUser/findByPage/" + pageNum + "/" + pageSize,
    method: "get",
    params: queryDto,
  });
};

// 新增用户的方法
export const SaveSysUser = (data) => {
  return request({
    url: "/system/sysUser/saveSysUser",
    method: "post",
    data,
  });
};

// 修改用户数据的方法
export const UpdateSysUser = (sysUser) => {
  return request({
    url: "/system/sysUser/updateSysUser",
    method: "put",
    data: sysUser,
  });
};

// 根据id删除用户
export const DeleteSysUserById = (userId) => {
  return request({
    url: "/system/sysUser/deleteById/" + userId,
    method: "delete",
  });
};

// 给用户分配角色请求
export const DoAssignRoleToUser = (assginRoleVo) => {
  return request({
    url: "/system/sysUserRole/doAssign",
    method: "post",
    data: assginRoleVo,
  });
};
