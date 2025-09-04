import type { School } from "../App.vue";
import request from "./index.ts";

interface FederalDistrict {
  id: number;
  name: string;
  short_name: string;
  code: string;
}
// ответ API
export interface ApiSchoolsResponse {
  status: boolean;
  message: string;
  data: {
    pages_count: number;
    page: number;
    total_count: number;
    list: ApiSchool[];
  };
}

export interface ApiSchool {
  uuid: string;
  is_federal: boolean;
  reg_number: string;
  serial_number: string | null;
  issue_date: string;
  end_date: string;
  regulatory: string;
  status: { name: string | null; code: string | null };
  type: { name: string | null; code: string | null };
  created_at: string;
  updated_at: string;
  edu_org: {
    uuid: string;
    full_name: string;
    short_name: string;
    contact_info: {
      post_address: string;
      phone: string | null;
      fax: string | null;
      email: string | null;
      website: string | null;
    };
    region: { name: string; code: number };
    federal_district: { name: string; short_name: string; code: string };
  };
  supplements: Array<{
    uuid: string;
    number: string;
    status: { name: string; code: string | null };
    educational_programs: Array<{
      uuid: string;
      edu_level: {
        name: string;
        short_name: string | null;
        code: string | null;
      };
    }>;
  }>;
}

export type FederalDistricts = FederalDistrict[];

export function mapApiSchool(api: ApiSchool): School {
  const educationLevels = Array.from(
    new Set(
      api.supplements.flatMap((s) =>
        (s.educational_programs ?? [])
          .map((p) => p.edu_level?.name)
          .filter((name): name is string => Boolean(name)),
      ),
    ),
  );

  return {
    id: api.uuid,
    name: api.edu_org.full_name,
    region: api.edu_org.region.name,
    address: api.edu_org.contact_info.post_address,
    educationLevels,
    type: api.type?.name ?? "Неизвестно",
    status: api.supplements[0]?.status?.name ?? "Неизвестно",
    federalDistrict: api.edu_org.federal_district.name,
  };
}

interface SchoolResponse {
  schools: School[];
  totalCount: number;
  page: number;
  pages: number;
}
export async function fetchSchools(
  count: number,
  page: number,
  params: { federal_district_id?: number; region_id?: number },
): Promise<SchoolResponse> {
  const res: ApiSchoolsResponse = await request({
    url: `/schools?count=${count}&page=${page}${params.federal_district_id ? "&federal_district_id=" + params.federal_district_id : ""}${params.region_id ? "&region_id=" + params.region_id : ""}`,
    method: "GET",
  });

  // маппим список

  return {
    schools: res.data.list.map(mapApiSchool),
    totalCount: res.data.total_count,
    page: res.data.page,
    pages: res.data.pages_count,
  };
}
