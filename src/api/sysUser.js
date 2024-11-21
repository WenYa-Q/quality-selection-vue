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
        data
    })
}