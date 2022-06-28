import { handler } from '../src/index';
import { Status } from '../src/types/status.enum';
import * as urlUtils from '../src/utils/url.utils';

describe('index\'s', () => {
  describe('handler', () => {
    beforeEach(() =>{
      jest.clearAllMocks();
    });
    it('provide result when invalid body request', async () => {
      const event = { body: '{invalid_JSON' };

      const response = await handler(event, {}, (first: any, second: any) => { return { first, second }; });

      expect.assertions(2);

      expect(response.first).toBe(null);
      expect(response.second).toStrictEqual({ 
        headers: {},
        status: Status.NotFound,
        statusDescription: Status[Status.NotFound],
        body: JSON.stringify({ shortUrl: '', originalUrl: '' }),
      });
    });

    it('provide result when invalid body url', async () => {
      const event = { body: JSON.stringify({ url: '' }) };

      jest.spyOn(urlUtils, 'createShortUrl');

      const response = await handler(event, {}, (first: any, second: any) => { return { first, second }; });

      expect.assertions(3);

      expect(response.first).toBe(null);
      expect(response.second).toStrictEqual({ 
        headers: {},
        status: Status.NotFound,
        statusDescription: Status[Status.NotFound],
        body: JSON.stringify({ shortUrl: '', originalUrl: '' }),
      });
      expect(urlUtils.createShortUrl).not.toHaveBeenCalled();
    });

    it('provide result when valid request', async () => {

      const baseUrl = 'my.base.url';
      process.env.BASE_URL = baseUrl;
      const myRequestUrl = 'http://myrequest.com';
      const event = { body: JSON.stringify({ url: myRequestUrl }) };

      jest.spyOn(urlUtils, 'createShortUrl');

      const callbackResponse = await handler(event, {}, (first: any, second: any) => { return { first, second }; });

      expect.assertions(8);

      expect(callbackResponse.first).toBe(null);
      expect(urlUtils.createShortUrl).toHaveBeenCalledTimes(1);
      const response = callbackResponse.second;
      const responseBody = JSON.parse(response.body);
      expect(responseBody.shortUrl).toContain(baseUrl);
      expect(responseBody.shortUrl.length).toBe(baseUrl.length + 7);
      expect(responseBody.originalUrl).toBe(myRequestUrl);
      expect(response.status).toBe(Status.Ok);
      expect(response.statusDescription).toBe(Status[Status.Ok]);
      expect(response.headers).toStrictEqual({});
    });
  });
});