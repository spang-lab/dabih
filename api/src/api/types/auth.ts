export interface OpenIDProvider {
  id: string;
  url: string;
  name: string;
  logo_uri: string;
  discovery: boolean;
  supportsPKCE?: boolean;
  [key: string]: unknown;
}
