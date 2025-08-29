use std::{fs::File, io::Read, path::PathBuf};

use base64ct::{Base64Url, Encoding};
use rsa::{
    RsaPrivateKey,
    pkcs1::{DecodeRsaPrivateKey, EncodeRsaPrivateKey},
    pkcs8::{DecodePrivateKey, SecretDocument},
};
use sha2::Digest;

use crate::error::Result;

#[derive(Debug)]
pub struct PrivateKey {
    key: RsaPrivateKey,
}
impl PrivateKey {
    pub fn from(path: PathBuf) -> Result<Self> {
        let mut file = File::open(path)?;
        let mut content = String::new();
        file.read_to_string(&mut content)?;
        let key = RsaPrivateKey::from_pkcs8_pem(&content)?;
        Ok(Self { key: key })
    }
    pub fn hash(&self) -> Result<String> {
        let data = self.key.to_pkcs1_der()?;
        let bytes = data.to_bytes();
        let digest = sha2::Sha256::digest(&bytes);
        let base64 = Base64Url::encode_string(&digest);
        return Ok(base64);
    }
}

#[tokio::test]
async fn parse_key() -> Result<()> {
    let key_str = "-----BEGIN PRIVATE KEY-----
MIIJQgIBADANBgkqhkiG9w0BAQEFAASCCSwwggkoAgEAAoICAQC6o48p39me497x
C4/0AOxYgAWmD2aFufXzkoEsOhdYpr6zMcsTd/JS4GgB4w98I1XjC6CZcdqN14TA
MaaEaE+Rd2BOZX4RYPt7vs5mA+Qq7yPU/HMU4QNjAVp5KN1VYLDjNqNpe6zDAOjo
VXtnnVEBhcbnmMRx912O0Le7vyyoVeEd2+jdD1LysstO5LQiPMfYRgyuecVfrh89
N5Ba/CTPfr129/PITMPKsDAxBLJRbFg5C0Ox/oKyIb4s/SEDTuqxBtBPuqzfpcY1
C8Wc1MN3d+ct9KzgwsVofuCWKGIAHEDgLTzZGd9FXDefAEAzhLHZUDa0CYtyIGWK
/ftKAX2YkRUjYZ/SLIIVuLuqVJA8cjapy56D0iEfHygHmSojQDcQjCbXJZmmURd5
uTxZLdJmThRNDbNgfY/jkOnrw+rf8p8GoHP4TksaYZ2ZstW5jmXgTAiOxEPDLX57
X1tKa04kH1xTuGK0McmtAw9qI2JNp0LvbKzEdi1AWGbzdPFxxaeKR+o2zQ3TWQPu
NI6XPzQrBqxQDmEBL69hEeVUjdujtlTvi5tIFG+SGb0+tXENK59w81o+mtm67CD0
2wGuVJYkcFI/gOfWQGL9PfCF3x5zSlQ6aOrr1/iqdlP8ddRUzHdnTKbMZ4s/K5Xk
5aJeNKLrnAPGK0n+lkyf2ufMw8LXfQIDAQABAoICAA0XEKDyuswqlkXYtkF6WRlB
7WN+vAWQC+CH+3hTILUOiNx/lwsoA/5tD85mEv11av4wIBTzB82f+ocSVGf/+uis
czw8YRGt+CVvNgGwry2VtTEofZfOylKE00ghJhjpXa6p898flffdVfiJmkyjm31c
WR2AOPL3UwADwocv+t1ZnJ7gAB6VBw/Pm3POlZW7JpcUHqqUDtRNnZJJFd5Txe8p
p/cyn84CGE9ceRzPBASy8SMbF6XhwF/m/vQf0tNtEwfUfwLAiIRtF5A74aHEyGrW
JYgzG3buIjNYhr7xWSJB2QkAEz700hSGyb3kohwa5/BicFvDOZ0JCaYsdxXzMdBF
RDJMqhJ9MMjB3Gm9kCKsC7XMFfmN12uWWgT18DKP5olrIgkDIbF94J/lGG+xtN0l
QJGpYax9bVlR5g5812jEnrCh/wrd+kur7UTKytWQuyaCo9V7sPUfu52jpHAjEMss
grDjlazOPftJVd6148CsbeMiWyaO0XgoSlfK3QkenQErvJuTtZNw1U0S/+CpTiwC
4s7dgaBwOhcou4wMeH84Upaesr8PyNYFjkdb3CJKcqefD6XFwVJxlLm/4CUoVDKY
Phq9MblExe6NvWtHfEQPmn6kSnw90DFDB+FfYSwNzoUnmH2dho0bCTI9yjua9py6
EHY9ZZN9ktLD+XB9519PAoIBAQDtgeaquvZFx1KQpCjIJRAHMTHvf6s+RHeeR62g
gorsTdwioXIhkQ4wAN7bn0LXFlinrYIH15YHI1Jcy7vc1yWTHiiJtLnxvP1/FL+Z
v3G1nyF62XuyYF9VO6Aho/jKJOBK5YUbkhrAJV3/mbv+4At7bIlDLzUM9Dp4G35B
Ll5RYAs3wdyDn5AWUm/WYQGgH+liNHB5bdMTFXB4oryXQO2nNQqLJZBnOt4OI+MW
VdJxT27Z3ssK9Q4yHNbHtMZe8Z8fLsjVAFisfWJwMhj+WW6qYQC7EzDRBFsV8HVu
9WMkA6nqnuic6vlXZkdqYAW2MBnOe9bwCJwgGBBL8wMpYBdTAoIBAQDJK7mlInLY
w0lYM9IyD6d+L9Uo2jj3nL+wBA/mYMeGALCoQ3jVbwJ5W5FGIkO/8DgxtaIsdsvE
Cx2mxaOdHtU+epZ7rwQo3IzfzxIRT4PFPk7h/AYJNASm9UfxRWFOrnH0uADOS78D
tm+Ff2yaf/GSM2CpoLVQGl1NWDwv9N4skM1pcsVeq29R6Y4rG91Yhf6xwu+FU/r2
5P6dnuRDizerm+3z4VxO1k/UONDvMg5Hau7C8h4wEMYSs0Io6m+wSH1iQOYu5mDz
bgKi+NHpyiOuifoPW1XCAhcc0shest2Nr8752JfoIoj2ukd2RqPWdi2wZGmLaP1e
J9fx27oSsYvvAoIBAFWnWlvKL1S87I7TVQ3RJ/WgDUU1QrmjEYyYhwpy6c0My04F
8VYfrQEs3zJPPli5a2GVVmajniyW1XY311lukdN7tdzru39ty/IPtoWpIEYCzJ00
X8LVtKvVZAudyfSE1grMuXNW/qS7FSo/9CeX/ywU2W/MT5KLZaa5K5AwO72XKJSE
KpWhbuJN+p1SwLZRq+ZJySJRtCSWv8gR0Hev58U8gL/r3ScNeNWapaQBcXKB1hVm
ns0l0WfLNL4y+LN26g7h3XXLuS8DzQNvXcok0J9Lemr9IcbPjlXcMU3B2246kAXY
J0WoDCIz9Z9sX8Lzl+r6iGpqgHumkgIB8uryB5cCggEBALbH7cNmy2a7+TYUz5UA
uDRlDY4yyLPiTiCFcFTn9iGBGwGnXHDAjkTpt9M7asdIYiZ4W8N+pKGZX/WZeZFW
5HYCOBxk5qihy7XGlSn5T0a12EJoFKvkAZ4ZGqbTXRh6U7wAO2s1U3byGd336xtt
yHYIDHnTNSp06fVOiFEicYOYhaqbx0y/A0QvqybsCG9YQBQPhEVmCo6tfdKE/e2I
3qoj4U5HovFWs+2lOeE7X9HwDMQ/7MHLW8y95wz6BUTseE//m6VdWRWVDPw6i6+a
JFV/tB6j5AWElK9xrPCuH7OO28YSz+LxDfTvR+LlSBOiCN1OPr+WQy97kC+Gb0hw
3S0CggEAK48b9oQEHTvoVVTAKFYky0dRMgnVty9aWedxF4dacqTGm598HUISOTpt
Og6kGbkH1NPP1iIEkiIEkL/N+PfL55Pu35EVPLVavu8KANHJ2chI5g/s/QUH28MI
55TVlnye9h9gtdlIqnxRQSY9gy+w47dwD2NhMbHN84gTkRBsTjQ9RZcTIAOBTYjg
4g31H+QUKwXP82cHBNO4M+uJ2t5ypbHUMRWCHIOKOcu+kFs8rYtU6AZRjZE18i3r
t/DQ+563B/e+0ww10hYLdbQ05UWy/4i/ACXOCbzFXPhM7cPyvsuIl+o+aHWKuV63
JioXQDfr73pz7z/4itI6seJA4izKEA
-----END PRIVATE KEY-----";
    let key2 = RsaPrivateKey::from_pkcs1_pem(key_str)?;
    println!("Key2: {:?}", key2);
    let (label, doc) = SecretDocument::from_pem(key_str).unwrap();

    println!("Label: {}", label);
    println!("Doc: {:?}", doc);

    let key = RsaPrivateKey::from_pkcs8_pem(key_str)?;
    let data = key.to_pkcs1_der()?;
    let bytes = data.to_bytes();
    let digest = sha2::Sha256::digest(&bytes);
    let base64 = Base64Url::encode_string(&digest);
    println!("Hash: {}", base64);
    Ok(())
}
