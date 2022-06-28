import { Status } from '../types/status.enum';

export const getRequestURL = (eventBody: string): string => {
  try {
    var body = JSON.parse(eventBody);
    if (!body && !body.url) {
      throw new Error("Can't parse request!");
    }
    return body.url;
  } catch (error) {
    throw error;
  }
};

export const createResponse = (status: Status, shortUrl: string, originalUrl: string) => {
  return {
    status,
    statusDescription: Status[status],
    headers: { },
    body: JSON.stringify({ shortUrl, originalUrl }),
  };
};

export const ok200 = (shortUrl: string, originalUrl: string): any => {
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({ shortUrl, originalUrl }),
  };
};