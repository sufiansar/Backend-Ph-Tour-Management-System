import { IGenericError } from "../interfaces/error.typs";

export const handelDuplicateError = (err: any): IGenericError => {
  const matchArray = err.message.match(/"([^"]*)"/);
  return {
    StatusCodes: 400,
    message: `Duplicate Key Error: ${matchArray[-1]}`,
  };
};
