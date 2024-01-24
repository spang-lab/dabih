import acruxProvider from './acrux.js';
import azureAdProvider from './azureAd.js';
import dabihProvider from './dabih.js';
import githubProvider from './github.js';
import urProvider from './ur.js';

export default {
  dabih: dabihProvider,
  acrux: acruxProvider,
  'azure-ad': azureAdProvider,
  github: githubProvider,
  ur: urProvider,
};
