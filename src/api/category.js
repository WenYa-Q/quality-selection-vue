import request from "@/utils/request";

const api_name = "/product/category";

// 根据parentId获取下级节点
export const FindCategoryByParentId = (parentId) => {
  return request({
    url: `${api_name}/findByParentId/${parentId}`,
    method: "get",
  });
};
