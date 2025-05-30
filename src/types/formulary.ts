
export interface Salt {
  id: string;
  salt_name: string;
  created_at: Date;
}

export interface Medication {
  id: string;
  generic_name: string;
  salt_id: string | null;
  created_at: Date;
  salt?: Salt;
}

export interface Brand {
  id: string;
  brand_name: string;
  medication_id: string;
  created_at: Date;
  medication?: Medication;
}

export interface FormularyMedication extends Medication {
  brands: Brand[];
}
