import listOfAdjectives from './adjectives.js';
import listOfNames from './firstnames.js';

const getRandomElement = (list) => list[Math.floor(Math.random() * list.length)];

const generateMnemonic = () => {
  const adjective = getRandomElement(listOfAdjectives);
  const givenName = getRandomElement(listOfNames);

  const name = `${adjective}_${givenName}`;

  return name;
};

export default generateMnemonic;
