import hash from 'object-hash';
import AWS from 'aws-sdk';
import { DbItem } from '../types/types';
AWS.config.update({ region: process.env.REGION });

const docClient = new AWS.DynamoDB.DocumentClient();

export const getItem = async (shortUrl: string): Promise<DbItem | undefined> => {
  const params = {
    TableName: 'ShortUrlData',
    Key:{
      ShortUrl: shortUrl,
    },
  };

  try {
    const item = await docClient.get(params).promise();
    return item as any;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const putItem = async (shortUrl: string, originalUrl: string, visited: number): Promise<void> => {
  const params = {
    TableName: 'ShortUrlData',
    Item: {
      ShortUrl: shortUrl,
      OriginalUrlHash:hash(originalUrl),
      Visits: `${visited}`,
    },
  };
  await docClient.put(params).promise();
};
