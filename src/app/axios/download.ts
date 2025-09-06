import request from "./index.ts";

export async function fetchDownload(
  count: number,
  page: number,
  params: { federal_district_id?: number; region_id?: number },
): Promise<string> {
  const res = await request<string>({
    url: `/schools?count=${count}&page=${page}${params.federal_district_id ? "&federal_district_id=" + params.federal_district_id : ""}${params.region_id ? "&region_id=" + params.region_id : ""}&download=true`,
    method: "GET",
  });
  return res.data;
}
