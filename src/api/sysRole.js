import request from "@/utils/request";

// 分页查询角色数据
export const GetSysRoleListByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: "/sys/role/findByPage/" + pageNum + "/" + pageSize,
    method: "get",
    params: queryDto,
  });
};

// 添加角色请求方法
export const SaveSysRole = (data) => {
  return request({
    url: "/sys/role/saveSysRole",
    method: "post",
    data,
  });
};

// 保存修改
export const UpdateSysRole = (data) => {
  return request({
    url: "/sys/role/updateSysRole",
    method: "put",
    data,
  });
};

// 删除角色
export const DeleteSysRoleById = (roleId) => {
  return request({
    url: "/sys/role/deleteById/" + roleId,
    method: "delete",
  });
};
