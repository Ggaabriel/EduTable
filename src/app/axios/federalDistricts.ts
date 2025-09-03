import request from "./index.ts";

interface FederalDistrict {
  id: number;
  name: string;
  short_name: string;
  code: string;
}
export type FederalDistricts = FederalDistrict[];

export async function fetchFederalDistricts() {
  const res = await request<FederalDistricts>({
    url: "/federalDistricts",
    method: "GET",
  });
  return res.data;
}
