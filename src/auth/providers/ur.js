import ldap from 'ldapjs';
import { getConfig } from '../../util/index.js';

function urClient() {
  const url = 'ldaps://ldapclient.uni-regensburg.de:636';
  const caCert = `
-----BEGIN CERTIFICATE-----
MIIFPDCCBCSgAwIBAgIkAhwR6YFlF5i6vWuka+z6WfC6a4nUyIhzeLOpOYbGAgIc
yRUZMA0GCSqGSIb3DQEBBQUAMDUxFzAVBgNVBAoTDlVOSS1SZWdlbnNidXJnMRow
GAYDVQQLExFPcmdhbml6YXRpb25hbCBDQTAeFw0xMDAxMjIwOTU4MDBaFw0zNDA5
MzAwODU4MDBaMDUxFzAVBgNVBAoTDlVOSS1SZWdlbnNidXJnMRowGAYDVQQLExFP
cmdhbml6YXRpb25hbCBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
AL+U0rOtzgl9KTIUwNbQZUG6jRH4tM0G7M/uATHJiDv2fB7smVEy5CDSxo7cgnZM
l7AfBXbVXM5djago+vI0S3Js5APYdj1a/qGKGiCAnuGbXGakGDjUulEDmwKJL8fe
y/gA3Mu2/0TxNmSBzyv3hw7KfQI9Hcel5b0RxFEWyMyrWJlspf+1LWQIZADk52JR
iD/QJajnxiagvCnRPvvtkPi08rK1W3/Ofe/Uk3ciYMSpKR6RPysg3ffVkB8oJjZn
0RCWyvygPMVhZnCFNyfU41ilkyg0+5qr0tytcmcqhlT26xraaN507NEmYmwsOqtp
+3lNua4kOAkmx/I4rbsKzo8CAwEAAaOCAjIwggIuMB0GA1UdDgQWBBQUWXap5x5f
chIRvQWK5aHRgevztDAfBgNVHSMEGDAWgBQUWXap5x5fchIRvQWK5aHRgevztDAP
BgNVHRMBAf8EBTADAQH/MAsGA1UdDwQEAwIBBjCCAcwGC2CGSAGG+DcBCQQBBIIB
uzCCAbcEAgEAAQH/Ex1Ob3ZlbGwgU2VjdXJpdHkgQXR0cmlidXRlKHRtKRZDaHR0
cDovL2RldmVsb3Blci5ub3ZlbGwuY29tL3JlcG9zaXRvcnkvYXR0cmlidXRlcy9j
ZXJ0YXR0cnNfdjEwLmh0bTCCAUigGgEBADAIMAYCAQECAUYwCDAGAgEBAgEKAgFp
oRoBAQAwCDAGAgEBAgEAMAgwBgIBAQIBAAIBAKIGAgEYAQH/o4IBBKBYAgECAgIA
/wIBAAMNAIAAAAAAAAAAAAAAAAMJAIAAAAAAAAAAMBgwEAIBAAIIf/////////8B
AQACBAbw30gwGDAQAgEAAgh//////////wEBAAIEBvDfSKFYAgECAgIA/wIBAAMN
AEAAAAAAAAAAAAAAAAMJAEAAAAAAAAAAMBgwEAIBAAIIf/////////8BAQACBBHp
gWUwGDAQAgEAAgh//////////wEBAAIEEemBZaJOMEwCAQICAgD/AgEAAw0AgP//
////////////AwkAgP////////8wEjAQAgEAAgh//////////wEB/zASMBACAQAC
CH//////////AQH/MA0GCSqGSIb3DQEBBQUAA4IBAQCOboCHkpu+h/Wt+k/QeHx9
m+NGa/1RZkw0mf6Ms3Axkwb7a5HR8rfwfwVmVzNkMc42zBAEvOV2ku5qgk48YMBw
UHxWMddKZ7knw+HRCPeFU7Op6Th3HuBBfdmqYcoCVHEH2YiBn/CtIj5Yy47HX7Qv
IEVnLRnib+Osa53U8dBVS8C1ZWg3idas/QBYGoVcGXUF837RAoadak+qxfqRtC29
8M1XFIHYB3p5l2p11QUcxRCycrId5VSpVn5frymP70Xq7bIASe3fzqOaQ/pbVIXD
T1TPeacy0cS641pS4TFBK+vRFJzKIgl0LA/aAcNj33lw5xudUZGof4GNTfludGxP
-----END CERTIFICATE-----
`;

  const tlsOptions = {
    ca: caCert,
    host: 'ldapclient.uni-regensburg.de',
    reconnect: true,
    rejectUnauthorized: false,
  };

  const client = ldap.createClient({
    url,
    tlsOptions,
  });
  return client;
}

const bind = async (client, dn, password) => new Promise((resolve, reject) => {
  client.bind(dn, password, (error) => {
    if (error) {
      reject(new Error('LDAP bind failed'));
    } else {
      resolve();
    }
  });
});

const attributesToObj = (attributes) => {
  const data = {};
  attributes.forEach((attribute) => {
    const { type, values } = attribute;
    const [value] = values;
    data[type] = value;
  });
  return data;
};

const userinfo = async (client, dn) => new Promise((resolve, reject) => {
  client.search(
    dn,
    {
      scope: 'base',
      attributes: ['dn', 'cn', 'fullName', 'mail'],
    },
    (error, emitter) => {
      let result = null;
      if (error) {
        reject(error);
        return;
      }
      emitter.on('error', (err) => {
        reject(err);
      });
      emitter.on('searchEntry', (entry) => {
        result = entry.pojo;
      });
      emitter.on('end', () => resolve(result));
    },
  );
});

const parseToken = (token) => {
  const string = Buffer.from(token, 'base64').toString();
  return JSON.parse(string);
};

export default async function urProvider(ctx, accessToken) {
  const { admins } = getConfig();
  const { subs } = admins;
  const { dn, password } = parseToken(accessToken);
  const client = urClient();
  await bind(client, dn, password);
  const { attributes } = await userinfo(client, dn);
  const { cn, fullName, mail } = attributesToObj(attributes);

  const scopes = ['api'];
  if (subs.includes(cn)) {
    scopes.push('admin');
  }

  return {
    sub: cn,
    name: fullName,
    email: mail,
    scopes,
  };
}
