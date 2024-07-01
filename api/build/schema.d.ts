export interface paths {
    "/healthy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["healthy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["info"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
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
        post: operations["startUpload"];
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
        post: operations["cancelUpload"];
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
        post: operations["finishUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload/unfinished": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["unfinishedUploads"];
        put?: never;
        post?: never;
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
    "/fs/{mnemonic}/file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["fileInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/{mnemonic}/file/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listFiles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/{mnemonic}/file/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["removeFile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/{mnemonic}/member/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listMembers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/{mnemonic}/member/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["addMembers"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/directory/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["addDirectory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/download/{mnemonic}/decrypt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["decryptDataset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["downloadDataset"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/download/{uid}/chunk/{hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["downloadChunk"];
        put?: never;
        post?: never;
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
        put: operations["chunkUpload"];
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
        DabihInfo: {
            version: string;
            branding: {
                organization: {
                    logo: string;
                    url: string;
                    name: string;
                };
                department: {
                    logo: string;
                    url: string;
                    name: string;
                };
                contact: {
                    phone: string;
                    country: string;
                    state: string;
                    city: string;
                    zip: string;
                    street: string;
                    email: string;
                    name: string;
                };
                admin: {
                    email: string;
                    name: string;
                };
            };
        };
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
        /**
         * @description mnemonics are human readable unique identifiers for datasets
         *     mnemonics have the form <random adjective>_<random first name>
         * @example happy_jane
         */
        Mnemonic: string;
        FileData: {
            uid: string;
            createdBy: string;
            fileName: string;
            filePath: string | null;
            hash: string | null;
            /** Format: double */
            size: number | null;
            keyHash: string;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        File: {
            mnemonic: components["schemas"]["Mnemonic"];
            name: string;
            tag: string | null;
            data: components["schemas"]["FileData"];
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
            /** Format: date-time */
            deletedAt: Date | null;
        };
        UploadStartBody: {
            /** @description The name of the file to upload */
            fileName: string;
            /** @description The mnemonic of the directory to upload the file to */
            directory?: components["schemas"]["Mnemonic"];
            /** @description The original path of the file */
            filePath?: string;
            /**
             * Format: int32
             * @description The size of the file in bytes
             */
            size?: number;
            /** @description A custom serchable tag for the file */
            tag?: string;
        };
        Chunk: {
            /**
             * Format: int32
             * @description The database id of the chunk
             */
            id: number;
            /**
             * Format: double
             * @description The id of the data the chunk belongs to
             */
            dataId: number;
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
            /**
             * Format: date-time
             * @description chunk creation timestamp
             */
            createdAt: Date;
            /**
             * Format: date-time
             * @description chunk last update timestamp
             */
            updatedAt: Date;
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
        Key: {
            /** Format: double */
            id: number;
            /** Format: double */
            dataId: number;
            hash: string;
            key: string;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        KeyData: components["schemas"]["FileData"] & {
            keys: components["schemas"]["Key"][];
        };
        DownloadData: components["schemas"]["KeyData"] & {
            chunks: components["schemas"]["Chunk"][];
        };
        FileDownload: components["schemas"]["File"] & {
            data: components["schemas"]["DownloadData"];
        };
        FileKeys: components["schemas"]["File"] & {
            data: components["schemas"]["KeyData"];
        };
        /** @enum {string} */
        PermissionString: "none" | "read" | "write";
        Member: {
            /** Format: double */
            id: number;
            sub: string;
            /** Format: double */
            inodeId: number;
            mnemonic: components["schemas"]["Mnemonic"];
            /** Format: double */
            permission: number;
            permissionString: components["schemas"]["PermissionString"];
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        /** @description The AES-256 encryption key used to encrypt and decrypt datasets.
         *     base64url encoded */
        AESKey: string;
        FileDecryptionKey: {
            mnemonic: components["schemas"]["Mnemonic"];
            key: components["schemas"]["AESKey"];
        };
        MemberAddBody: {
            /** @description The users to add to the dataset */
            subs: string[];
            /** @description The list of AES-256 keys required to decrypt all child datasets */
            keys: components["schemas"]["FileDecryptionKey"][];
        };
        Directory: {
            mnemonic: components["schemas"]["Mnemonic"];
            name: string;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
            /** Format: date-time */
            deletedAt: Date | null;
        };
        AddDirectoryBody: {
            /** @description The name of the directory */
            name: string;
            /** @description The mnemonic of the parent directory */
            parent?: components["schemas"]["Mnemonic"];
            /** @description A custom serchable tag for the directory */
            tag?: string;
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
    healthy: {
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
                    "application/json": {
                        healthy: boolean;
                    };
                };
            };
        };
    };
    info: {
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
                    "application/json": components["schemas"]["DabihInfo"];
                };
            };
        };
    };
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
    startUpload: {
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
                    "application/json": components["schemas"]["File"];
                };
            };
        };
    };
    cancelUpload: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: components["schemas"]["Mnemonic"];
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
    finishUpload: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: components["schemas"]["Mnemonic"];
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
                    "application/json": components["schemas"]["File"];
                };
            };
        };
    };
    unfinishedUploads: {
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
                    "application/json": components["schemas"]["File"][];
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
    fileInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: components["schemas"]["Mnemonic"];
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
                    "application/json": components["schemas"]["FileDownload"];
                };
            };
        };
    };
    listFiles: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: components["schemas"]["Mnemonic"];
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
                    "application/json": components["schemas"]["FileKeys"][];
                };
            };
        };
    };
    removeFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: components["schemas"]["Mnemonic"];
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
    listMembers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: components["schemas"]["Mnemonic"];
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
                    "application/json": components["schemas"]["Member"][];
                };
            };
        };
    };
    addMembers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: components["schemas"]["Mnemonic"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MemberAddBody"];
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
    addDirectory: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddDirectoryBody"];
            };
        };
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Directory"];
                };
            };
        };
    };
    decryptDataset: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mnemonic: components["schemas"]["Mnemonic"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    key: components["schemas"]["AESKey"];
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
                    "application/json": components["schemas"]["TokenResponse"];
                };
            };
        };
    };
    downloadDataset: {
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
                    "application/json": string;
                };
            };
        };
    };
    downloadChunk: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                uid: string;
                hash: string;
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
                    "application/octet-stream": string;
                };
            };
        };
    };
    chunkUpload: {
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
                mnemonic: components["schemas"]["Mnemonic"];
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
