import { Status } from './types/status.enum';
import { createResponse } from './utils/common.utils';

const BASE_URL = process.env.BASE_URL;

export const handler = async (event: any, context: any, callback: any) => {
  try {
    const request = event.Records[0].cf.request;
    return callback(null, createResponse(Status.MovedPermanantly, request));
  } catch (error) {
    return callback(null, createResponse(Status.NotFound, BASE_URL!));
  }
};
