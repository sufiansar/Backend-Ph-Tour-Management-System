import { Types } from "mongoose";

export interface ItourTypes {
  name: string;
}

export interface Itour {
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  location?: string;
  costFrom?: string;
  startDate?: Date;
  endDate?: Date;
  included: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge: number;
  dicvision: Types.ObjectId;
  tourType: Types.ObjectId;
}
