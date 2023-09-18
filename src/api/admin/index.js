import listKeys from './listKeys.js';
import confirmKey from './confirmKey.js';
import destroyDataset from './destroyDataset.js';
import recoverDataset from './recoverDataset.js';
import removeDataset from './removeDataset.js';
import listEvents from './events.js';
import listEventDates from './eventDates.js';
import listOrphans from './listOrphans.js';

export default {
  listKeys,
  listOrphans,
  confirmKey,
  destroyDataset,
  recoverDataset,
  removeDataset,
  listEvents,
  listEventDates,
};
