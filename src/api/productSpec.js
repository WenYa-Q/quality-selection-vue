import request from "@/utils/request";

const api_name = "/product/productSpec";

// 分页列表
export const GetProductSpecPageList = (page, limit) => {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: "get",
  });
};

// 保存信息
export const SaveProductSpec = (productSpec) => {
  return request({
    url: `${api_name}/save`,
    method: "post",
    data: productSpec,
  });
};

// 修改信息
export const UpdateProductSpecById = (productSpec) => {
  return request({
    url: `${api_name}/updateById`,
    method: "put",
    data: productSpec,
  });
};
