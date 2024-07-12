export interface DataItem {
  VATName_GR: string;
  VATName_EN: string;
  BrandName_GR: string | null;
  BrandName_EN: string | null;
  Address_GR: string;
  Address_EN: string;
  ZIPCode: string;
  District_GR: string;
  District_EN: string;
  Region_GR: string;
  Region_EN: string;
  Town_GR: string;
  Town_EN: string;
  IsHerocorp: number;
  AcceptedProducts: string[];
  MCCCategory_GR: string;
  MCCCategory_EN: string;
  Latitude: number;
  Longitude: number;
}
