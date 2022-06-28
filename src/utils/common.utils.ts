import { Status } from '../types/status.enum';

export const createResponse = (status: Status, value: string) => {
  return {
    status,
    statusDescription: Status[status],
    headers: {
      'location': [{
        key: 'Location',
        value,
      }],
    },
  };
};