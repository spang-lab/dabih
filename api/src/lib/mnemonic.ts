
import adjectives from "./data/adjectives";
import firstNames from "./data/firstNames";

const sample = (list: string[]) => list[Math.floor(Math.random() * list.length)];

const generate = () => `${sample(adjectives)}_${sample(firstNames)}`;

const count = () => adjectives.length * firstNames.length;

export default {
  generate,
  count,
};
