export interface paths {
    "/user/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["addUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/find": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["findUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listUsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["removeUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/key/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["addKey"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/key/enable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["enableKey"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/key/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["removeKey"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Start"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload/{mnemonic}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Cancel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload/{mnemonic}/finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Finish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/token/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["tokenInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/token/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["addToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/token/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listTokens"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/token/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["removeToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload/{mnemonic}/chunk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["Chunk"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        PublicKey: {
            /** Format: double */
            id: number;
            /** Format: double */
            userId: number;
            hash: string;
            data: string;
            isRootKey: boolean;
            /** Format: date-time */
            enabled: Date | null;
            enabledBy: string | null;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        UserResponse: {
            /**
             * Format: int32
             * @description The database id of the user
             */
            id: number;
            /** @description The unique user sub */
            sub: string;
            /** @description The name of the user */
            name: string;
            /** @description The email of the user */
            email: string;
            /**
             * Format: date-time
             * @description The date the user was created
             */
            createdAt: Date;
            /**
             * Format: date-time
             * @description The date the user was last updated
             */
            updatedAt: Date;
            /** @description The public keys of the user */
            keys: components["schemas"]["PublicKey"][];
        };
        "crypto.JsonWebKey": {
            crv?: string;
            d?: string;
            dp?: string;
            dq?: string;
            e?: string;
            k?: string;
            kty?: string;
            n?: string;
            p?: string;
            q?: string;
            qi?: string;
            x?: string;
            y?: string;
            [key: string]: unknown;
        };
        UserAddBody: {
            /** @description The unique user sub
             *     if undefined the sub from the auth token will be used */
            sub?: string;
            /** @description The name of the user */
            name: string;
            /** @description The email of the user */
            email: string;
            /** @description The public key of the user as a JWK */
            key: components["schemas"]["crypto.JsonWebKey"];
            /** @description If true the key is a root key, used to decrypt all datasets */
            isRootKey?: boolean;
        };
        KeyAddBody: {
            /** @description The user the key should belong to */
            sub: string;
            /** @description The public key as a JWK */
            data: components["schemas"]["crypto.JsonWebKey"];
            /** @description If true the key is a root key, used to decrypt all datasets */
            isRootKey: boolean;
        };
        KeyEnableBody: {
            /** @description The user the key belongs to */
            sub: string;
            /** @description The hash of the key */
            hash: string;
            /** @description The key status to set */
            enabled: boolean;
        };
        KeyRemoveBody: {
            /** @description The user the key belongs to */
            sub: string;
            /** @description The hash of the key */
            hash: string;
        };
        /** @description From T, pick a set of properties whose keys are in the union K */
        "Pick_Dataset.Exclude_keyofDataset.chunks__": {
            /**
             * Format: int32
             * @description The database id of the dataset
             */
            id: number;
            /** @description The mnemonic of the dataset */
            mnemonic: string;
            /** @description The name of the file the dataset was created from */
            fileName: string;
            /** @description The user that uploaded the dataset */
            createdBy: string;
            /** @description The hash of the AES-256 encryption key */
            keyHash: string;
            /** @description A custom non unique name of the dataset */
            name: string;
            /** @description The original path of the dataset */
            path: string;
            /** @description The hash of the entire dataset */
            hash: string;
            /**
             * Format: int32
             * @description The size of the dataset in bytes
             */
            size: number;
        };
        /** @description Construct a type with the properties of T except for those in type K. */
        "Omit_Dataset.chunks_": components["schemas"]["Pick_Dataset.Exclude_keyofDataset.chunks__"];
        UploadStartResponse: components["schemas"]["Omit_Dataset.chunks_"] & {
            /** @description The hash of the duplicate dataset or null if there is no duplicate */
            duplicate: string | null;
        };
        UploadStartBody: {
            /** @description The name of the file to upload */
            fileName: string;
            /**
             * Format: int32
             * @description The total size of the file in bytes, if known
             */
            size?: number;
            /** @description A custom name for the dataset */
            name?: string;
            /** @description The original path of the file */
            path?: string;
            /** @description The hash of the first 2MiB chunk of the file */
            chunkHash?: string;
        };
        Chunk: {
            /**
             * Format: int32
             * @description The database id of the chunk
             */
            id: number;
            /** @description The SHA-256 hash of the unencrypted chunk data base64url encoded */
            hash: string;
            /** @description The AES-256 initialization vector base64url encoded */
            iv: string;
            /**
             * Format: int32
             * @description The start of the chunk as a byte position in the file
             */
            start: number;
            /**
             * Format: int32
             * @description The end of the chunk as a byte position in the file
             */
            end: number;
            /** @description The CRC32 checksum of the encrypted chunk data base64url encoded */
            crc: string | null;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
            /** Format: date-time */
            deletedAt: Date | null;
        };
        /**
         * @description mnemonics are human readable unique identifiers for datasets
         *     mnemonics have the form <random adjective>_<random first name>
         * @example happy_jane
         */
        Mnemonic: string;
        /** @description A dataset is a file uploaded to dabih.
         *     It is a collection of chunks that are encrypted with the same keyHash */
        Dataset: {
            /**
             * Format: int32
             * @description The database id of the dataset
             */
            id: number;
            /** @description The mnemonic of the dataset */
            mnemonic: components["schemas"]["Mnemonic"];
            /** @description The name of the file the dataset was created from */
            fileName: string;
            /** @description The user that uploaded the dataset */
            createdBy: string;
            /** @description The hash of the AES-256 encryption key */
            keyHash: string;
            /** @description A custom non unique name of the dataset */
            name: string | null;
            /** @description The original path of the dataset */
            path: string | null;
            /** @description The hash of the entire dataset */
            hash: string | null;
            /**
             * Format: int32
             * @description The size of the dataset in bytes
             */
            size: number | null;
            chunks?: components["schemas"]["Chunk"][];
        };
        User: {
            sub: string;
            scopes: string[];
            isAdmin: boolean;
        };
        Token: {
            /** Format: double */
            id: number;
            value: string;
            sub: string;
            scope: string;
            /** Format: date-time */
            exp: Date | null;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        TokenResponse: components["schemas"]["Token"] & {
            /** @description false if the token has not expired,
             *     otherwise a string describing how long ago the token expired */
            expired: string | false;
            /** @description The array of scopes the token has */
            scopes: string[];
        };
        TokenAddBody: {
            /** @description The array of scopes the token should have */
            scopes: string[];
            /**
             * Format: int32
             * @description The time in seconds the token should be valid for
             *     If null the token will never expire
             */
            lifetime: number | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    addUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserAddBody"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
        };
    };
    me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"] | null;
                };
            };
        };
    };
    findUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    sub: string;
                };
            };
        };
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"] | null;
                };
            };
        };
    };
    listUsers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"][];
                };
            };
        };
    };
    removeUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    sub: string;
                };
            };
        };
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    addKey: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["KeyAddBody"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicKey"];
                };
            };
        };
    };
    enableKey: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["KeyEnableBody"];
            };
        };
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicKey"];
                };
            };
        };
    };
    removeKey: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["KeyRemoveBody"];
            };
        };
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Start: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UploadStartBody"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UploadStartResponse"];
                };
            };
        };
    };
    Cancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Finish: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dataset"];
                };
            };
        };
    };
    tokenInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
        };
    };
    addToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TokenAddBody"];
            };
        };
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenResponse"];
                };
            };
        };
    };
    listTokens: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenResponse"][];
                };
            };
        };
    };
    removeToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: double */
                    tokenId: number;
                };
            };
        };
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    Chunk: {
        parameters: {
            query?: never;
            header: {
                /** @description The range of bytes in the chunk
                 *     It should be in the format `bytes {start}-{end}/{size}` */
                "content-range": string;
                /** @description The SHA-256 hash of the chunk data encoded in base64url
                 *     It should be in the format `sha-256={hash}` */
                digest: string;
            };
            path: {
                mnemonic: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    chunk?: Blob;
                };
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Chunk"];
                };
            };
        };
    };
}