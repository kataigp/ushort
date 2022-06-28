const MAP_STRING = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const getRandomInt = (min, max): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
};

export const createShortUrl = (): string =>  {
  
  let shortUrl = '';
  for (let i = 1; i <= 6;i++) {
    const index = getRandomInt(0, MAP_STRING.length);
    shortUrl += MAP_STRING.substring(index, index + 1);
  }
  return `${process.env.BASE_URL}/${shortUrl}`;
};

