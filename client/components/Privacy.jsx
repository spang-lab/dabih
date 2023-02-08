import React from 'react';
import { Link } from './util';

function Privacy() {
  return (
    <div className="p-5 text-gray-900">
      <h1 className="py-3 text-3xl font-bold">Privacy</h1>
      <h3 className="py-3 text-xl">Cookies</h3>
      <p>
        This website does not use cookies except a session cookie
        required for user login.

      </p>
      <h3 className="py-3 text-xl">Server Log</h3>
      <p>The web server keeps a log of all requests, with the following data:</p>
      <ul className="list-disc list-inside">
        <li>The request IP address</li>
        <li>Date and Time of the request</li>
        <li>request type and path</li>
        <li>the User-Agent of the web browser</li>
      </ul>
      <p>This data is only used to diagnose technical problems.</p>
      <h3 className="py-3 text-xl">Web Analytics / Other Tracking</h3>
      <p>There are no other tracking methods.</p>
      <h3 className="py-3 text-xl">User Login</h3>
      <p>
        We use the Oauth2 protocol
        and consent for user data has to be granted by
        the user during the sign-in process.
      </p>
      <p>
        If you are activly using dabih we retain the
        name provided by the authentication provider and the user id
        in the dabih database.
      </p>
      <p>
        This data is attached to your public key and can be deleted by
        deleting you public key. Note that a public key is required to use dabih.
      </p>
      <h3 className="py-3 text-xl">Privacy Contact</h3>
      <p>
        Institute of functional genomics
        <br />
        Am Biopark 9
        <br />
        93053 Regensburg
        <br />
        +49 941 943 5053

      </p>
      <p>
        We are part of the University of Regensburg
        <br />
        The contact for the university can be found
        <Link href="https://www.uni-regensburg.de/informationssicherheit/datenschutz/ansprechpartner/index.html">here</Link>
      </p>

    </div>
  );
}

export default Privacy;
