export interface merchantsResponse {
  vat_name_gr: string;
  vat_name_en: string;
  brand_name_gr: string | null;
  brand_name_en: string | null;
  address_gr: string;
  address_en: string;
  zip_code: string;
  district_gr: string;
  district_en: string;
  region_gr: string;
  region_en: string;
  town_gr: string;
  town_en: string;
  is_hero_corp: boolean;
  accepted_products: string[];
  mcc_category_gr: string;
  mcc_category_en: string;
  latitude: string | null;
  longitude: string | null;
}
