import request from "@/utils/request";

const api_name = "/product/productSpec";

// 分页列表
export const GetProductSpecPageList = (page, limit) => {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: "get",
  });
};
