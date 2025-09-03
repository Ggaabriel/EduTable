import request from "./index.ts";

export interface Region {
  id: number;
  name: string;
}
export type Regions = Region[];

export async function fetchRegions() {
  const res = await request<Regions>({ url: "/regions", method: "GET" });
  return res.data;
}
