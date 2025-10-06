export default async function callback(
  url: string,
  state: string,
  code: string,
) {
  console.log('Callback called with:', { url, state, code });
  throw new Error('Not implemented');
}
