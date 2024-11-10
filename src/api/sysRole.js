import request from "@/utils/request";

// 分页查询角色数据
export const GetSysRoleListByPage = (pageNum , pageSize , queryDto) => {
    return request({
        url: '/sys/role/findByPage/' + pageNum + "/" + pageSize,
        method: 'get',
        params: queryDto
    })
}
