import hash from 'object-hash';

import { Status } from './types/status.enum';
import { getItem, putItem } from './utils/aws.utils';
import { createResponse, getRequestURL, ok200 } from './utils/common.utils';
import { createShortUrl } from './utils/url.utils';

export const handler = async (event: any, context: any, callback: any) => {
  let requestUrl: string = '';
  try {
    requestUrl = getRequestURL(event.body);
    if (requestUrl === '') {
      throw new Error('Empty request url!');
    }
    const shortUrl = createShortUrl();
    const item = await getItem(shortUrl);
    if (item && item.OriginalUrlHash === hash(requestUrl)) {
      const visits = item.Visits++;
      putItem(item.ShortUrl, item.OriginalUrlHash, visits);
    } else {
      putItem(shortUrl, requestUrl, 0);
    }
    callback(null, createResponse(Status.Ok, shortUrl, requestUrl));
    return ok200(shortUrl, requestUrl);
  } catch (error) {
    return callback(null, createResponse(Status.NotFound, '', requestUrl));
  }
};
