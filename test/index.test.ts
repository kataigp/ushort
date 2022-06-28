import { handler } from '../src/index';
import { Status } from '../src/types/status.enum';

describe('index\'s', () => {
  describe('handler', () => {
    it('provide result when invalid request', async () => {
      const event = { body: '{invalid_JSON' };

      const response = await handler(event, {}, (first: any, second: any) => { return { first, second }; });

      expect.assertions(2);

      expect(response.first).toBe(null);
      expect(response.second).toStrictEqual({ 
        headers: expect.any(Object),
        status: Status.NotFound,
        statusDescription: Status[Status.NotFound],
      });
    });

    it('provide result when valid request', async () => {
      const myRequest = 'http://myrequest.com';
      const event = { Records: [{ cf: { request: myRequest } }] };

      const response = await handler(event, {}, (first: any, second: any) => { return { first, second }; });

      expect.assertions(2);

      expect(response.first).toBe(null);
      expect(response.second).toStrictEqual({ 
        headers: {
          location: [{ key: 'Location', value: myRequest }],
        },
        status: Status.MovedPermanantly,
        statusDescription: Status[Status.MovedPermanantly],
      });
    });
  });
});