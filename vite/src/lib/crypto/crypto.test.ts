/* global BigInt */
import test from "ava";

import privateKey from "./privateKey";
import publicKey from "./publicKey";
import base64url from "./base64url";
import jwt from "./jwt";

const pemKey = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJX4p0Q6Y4hN1kEi
Poy5AnNl7F2IZPn9svhkIClY8p/aGbgTAGLzc7fY2RuUpFmh9GvCCowrwWfpaItj
OmDEh9FfTFxUce0gzb0m3d0cqaAoB5Yeh8YFb7M9w/A+Mcgg6DzLy71KBxYenPf/
dn4aZh5fw1U7TzsR8KTG6PQYtG9LAgMBAAECgYBg4uIUxu/0Z+zJ6XilawS1Tpx0
FKC/jHHp3K2WaLteIAXLkKMISiVxGWuxUMcYjPOeBh7QTZhGLFl462MUjwL6eD2l
Ez3gfM4C0ap7q+RDgJkZZPVHjRQ8x+VWKUm14KgGyteNQ7DjthtwybLB6ZY1iCGA
bfkGN+pK+vBy6M3OMQJBAMQ4AUtkHlX5fOLBoRPVsCN007hVVkfVt84G1lxPc0Nm
KfqoHnpZzfIr5jGdziTiqWWfMUx6/Y+EH4DppgLsFPMCQQDDqZkMXJOKBsVyYDNQ
McBtXc+P2+J+Zj5hvY9u8TFQ6TLjVjp2kEfiJfF3h8CK1eSwYWla78MyTjj42SWa
STJJAkEAhYDNcKwn77sV+3pezA4CD723J534XFvO+UCxrJDqDZt/SGoGgpyDgRfZ
QTzrOzF0rA3KDw1HY9QzUxSlvSs/fQJBAJ5vmqrT2/SMfx2aoHJzlun4aLaIyuKn
UCQ9JwQi8lgePUKw9C5Frq+FIf40QskpYkEg3/ru4xS9Go0G6NgCJWECQFZvd1uk
KRXql27fM5cSigHkfNzbQNIDRZkOC+idZpg7lHE8KAa2yWiufj4OvKI7bT7yC5KI
Zjs+OBCCyNlkQak
-----END PRIVATE KEY-----`;

const pemKeyV = {
  n: BigInt(
    "105313429899678910954244412377667300234742162661631185984232412341791845602572433084450441871725611649812118692613041953392439563383571019956337384857525864661306089923896367438553025959504505254867324603521069029621835152119177458437773475202053279184646404732396279488811330955369804082801745761264563679051",
  ),
  p: BigInt(
    "10276810848009585603394145623765203138739025488375319137624144086556986283585924666475292559586646875402899775721905315059448710108520119257981289283458291",
  ),
  q: BigInt(
    "10247676196168973294556088510802688982847948104061206343571750858100009867254454946892394325149604594318125232252398135844254185513241461300030694872396361",
  ),
};
const sshPubKey =
  "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAgQCV+KdEOmOITdZBIj6MuQJzZexdiGT5/bL4ZCApWPKf2hm4EwBi83O32NkblKRZofRrwgqMK8Fn6WiLYzpgxIfRX0xcVHHtIM29Jt3dHKmgKAeWHofGBW+zPcPwPjHIIOg8y8u9SgcWHpz3/3Z+GmYeX8NVO087EfCkxuj0GLRvSw== testkey";

test("RSA encrypt decrypt", async (t) => {
  const key = await privateKey.generate();
  const pKey = await privateKey.toPublicKey(key);

  const payload = base64url.fromString("TEST PAYLOAD");
  const buffer = base64url.toUint8(payload);

  const encrypted = await publicKey.encrypt(pKey, buffer);
  const decrypted = await privateKey.decrypt(key, encrypted);
  const result = base64url.fromUint8(decrypted);
  t.is(result, payload);
});

test("Key hash", async (t) => {
  const key = await privateKey.generate();
  const pKey = await privateKey.toPublicKey(key);
  const hash = await publicKey.toHash(pKey);
  t.truthy(hash);
});

test("Load PEM Key", async (t) => {
  const key = await privateKey.fromPEM(pemKey);
  const pem = await privateKey.toPEM(key);
  t.is(pem, pemKey);
});

test("Private key conversion", async (t) => {
  const key = await privateKey.generate();
  const hash = await privateKey.toHash(key);

  const base64 = await privateKey.toBase64(key);
  const key2 = await privateKey.fromBase64(base64);
  const hash2 = await privateKey.toHash(key2);
  t.is(hash, hash2);
});

test("base64url conversion", (t) => {
  const data = "Hello, 你好!";
  const encoded = base64url.fromString(data);

  const buffer = base64url.toUint8(encoded);
  const encoded2 = base64url.fromUint8(buffer);

  const decoded = base64url.toString(encoded2);
  t.is(data, decoded);
});
test("BigInt conversion", async (t) => {
  const key = await privateKey.fromPEM(pemKey);
  const jwk = await privateKey.toJWK(key);

  const p = base64url.toBigInt(jwk.p!);
  t.is(p, pemKeyV.p);
  const q = base64url.toBigInt(jwk.q!);
  t.is(q, pemKeyV.q);
  const n = base64url.toBigInt(jwk.n!);
  const n2 = p * q;
  t.is(n, n2);
  t.is(n, pemKeyV.n);
});

test("BigInt consistency", (t) => {
  const e = base64url.toBigInt("AQAB");
  const e2 = BigInt(65537);
  t.is(e, e2);
  const es = base64url.fromBigInt(e2);
  t.is(es, "AQAB");

  const ps = base64url.fromBigInt(pemKeyV.p);
  const p2 = base64url.toBigInt(ps);
  t.is(p2, pemKeyV.p);
});

test("Key compression 1024", async (t) => {
  const key = await privateKey.fromPEM(pemKey);
  const jwk = await privateKey.toJWK(key);
  const json = await privateKey.toJSON(key);

  const key2 = await privateKey.fromJSON(json);
  const jwk2 = await privateKey.toJWK(key2);

  const pi = base64url.toBigInt(jwk.p!);
  const qi = base64url.toBigInt(jwk.q!);
  t.is(pi, pemKeyV.p);
  t.is(qi, pemKeyV.q);

  const n1 = base64url.toBigInt(jwk.n!);
  const n2 = base64url.toBigInt(jwk2.n!);
  t.is(n1, n2);

  const dp1 = base64url.toBigInt(jwk.dp!);
  const dp2 = base64url.toBigInt(jwk2.dp!);
  t.is(dp1, dp2);
  t.deepEqual(jwk, jwk2);
});

test("Key compression 4096", async (t) => {
  const key = await privateKey.generate();
  const jwk = await privateKey.toJWK(key);
  const json = await privateKey.toJSON(key);
  const key2 = await privateKey.fromJSON(json);
  const jwk2 = await privateKey.toJWK(key2);
  t.deepEqual(jwk, jwk2);
});

test("OpenSSH public key", async (t) => {
  const pubKey = await publicKey.fromOpenSSH(sshPubKey);
  const hash = await publicKey.toHash(pubKey);

  const privKey = await privateKey.fromPEM(pemKey);
  const hash2 = await privateKey.toHash(privKey);
  t.is(hash, hash2);
});

test("Sign JWT with private key", async (t) => {
  const key = await privateKey.generate();
  const sKey = await privateKey.toSigningKey(key);
  const payload = { data: "test" };
  const token = await jwt.signWithRSA(payload, sKey);
  t.truthy(token);
});
