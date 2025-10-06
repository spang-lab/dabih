export interface OpenIDProvider {
  id: string;
  name: string;
  logo_uri: string;
  issuer: string;
  discovery: boolean;
  [key: string]: unknown;
}
