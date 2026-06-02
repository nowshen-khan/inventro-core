import api from "@/shared/api/client.api";

export const searchPosProducts = (search: string) =>
  api
    .get("/products/pos-search", {
      params: {
        search,
      },
    })
    .then((res) => res.data);
