import React from 'react';
import { Link } from './util';

function Contact() {
  return (
    <div className="p-5 text-gray-900">
      <h1 className="py-3 text-3xl font-bold">Contact</h1>
      <h3 className="py-2 text-xl">
        Institute of functional genomics
      </h3>
      Statistical Bioinformatics
      <br />
      Am Biopark 9
      <br />
      93053 Regensburg
      <br />
      Germany
      <br />
      +49 941 943 5053
      <br />
      <Link href="mailto:sekretariat.genomik@ur.de">
        sekretariat.genomik@ur.de
      </Link>
    </div>
  );
}

export default Contact;
