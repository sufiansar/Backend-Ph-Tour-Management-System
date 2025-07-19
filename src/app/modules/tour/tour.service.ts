import { Query } from "mongoose";
import { excludeField } from "../../utility/globalConstant";
import { tourSearchableFields } from "./tour.constant";
import { Itour, ItourTypes } from "./tour.interface";
import { Tour, TourTypesModel } from "./tour.model";
import { QueryBuilder } from "../../utility/queryBuilder";

const createTour = async (payload: Itour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }

  const baseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${baseSlug}`;

  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`; // dhaka-division-2
  }

  payload.slug = slug;

  const tour = await Tour.create(payload);

  return tour;
};

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .filter()
    .search(tourSearchableFields)
    .fields()
    .sort()
    .paginate();
  const [data, meta] = await Promise.all([tours.build(), tours.getMeta()]);

  return {
    data,
    meta,
  };
};

const updateTour = async (id: string, payload: Partial<Itour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  return updatedTour;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ItourTypes) => {
  const existingTourType = await TourTypesModel.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourTypesModel.create({ name });
};
const getAllTourTypes = async () => {
  return await TourTypesModel.find();
};
const updateTourType = async (id: string, payload: ItourTypes) => {
  const existingTourType = await TourTypesModel.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourTypesModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};
const deleteTourType = async (id: string) => {
  const existingTourType = await TourTypesModel.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourTypesModel.findByIdAndDelete(id);
};

export const TourService = {
  createTour,
  createTourType,
  deleteTourType,
  updateTourType,
  getAllTourTypes,
  getAllTours,
  updateTour,
  deleteTour,
};
