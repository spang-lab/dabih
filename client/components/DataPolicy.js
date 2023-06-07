import React from 'react';
import {
  Color, Subtitle1, Title1, Title2,
} from './util';

function DataPolicy() {
  return (
    <div className="p-5 text-gray-900">
      <Title1>
        <Color>Dabih</Color>
        Data Policy
      </Title1>
      <Subtitle1>
        The data you use with dabih may be sensitve.
        This data policy is here to inform you about how dabih keeps your data safe.
      </Subtitle1>

      <Title2 className="pt-5">
        Data uploaded to
        <Color>dabih</Color>
      </Title2>
      <Title2 className="pt-5">
        Data storage
      </Title2>
      <Title2 className="pt-5">
        Granting access to other users
      </Title2>
      <Title2 className="pt-5">
        Downloading data
      </Title2>

    </div>
  );
}

export default DataPolicy;
