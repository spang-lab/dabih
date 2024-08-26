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
        /** @description Get all the file information required to download a single file */
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
        /** @description Recursively list all files in a directory */
        get: operations["listFiles"];
        put?: never;
        post?: never;
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
    "/fs/{mnemonic}/duplicate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["duplicateInode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/{mnemonic}/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["removeInode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/{mnemonic}/tree": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["inodeTree"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["moveInode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listRoot"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fs/{mnemonic}/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listInodes"];
        put?: never;
        post?: never;
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
            /**
             * Format: bigint
             * @description The database id of the public key
             */
            id: string;
            /**
             * Format: bigint
             * @description The user id the key belongs to
             */
            userId: string;
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
             * Format: bigint
             * @description The database id of the user
             */
            id: string;
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
        } & {
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
         * @description InodeType is used to represent the type of an Inode.
         *     FILE: a file
         *     DIRECTORY: a directory
         *     UPLOAD: a file that is being uploaded
         *     TRASH: the special directory that holds deleted files
         * @enum {number}
         */
        InodeType: 0 | 1 | 2 | 10 | 11;
        FileData: {
            /**
             * Format: bigint
             * @description The database id of the file data
             */
            id: string;
            uid: string;
            createdBy: string;
            fileName: string;
            filePath: string | null;
            hash: string | null;
            /**
             * Format: bigint
             * @description The size of the file in bytes
             */
            size: string;
            keyHash: string;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        Inode: {
            /**
             * Format: bigint
             * @description The database id of the inode
             */
            id: string;
            mnemonic: string;
            type: components["schemas"]["InodeType"];
            name: string;
            tag: string | null;
            data: components["schemas"]["FileData"] | null;
            parentId: unknown;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        File: components["schemas"]["Inode"] & {
            data: components["schemas"]["FileData"];
        };
        /**
         * @description mnemonics are human readable unique identifiers for datasets
         *     mnemonics have the form <random adjective>_<random first name>
         * @example happy_jane
         */
        Mnemonic: string;
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
            /** @description A custom searchable tag for the file */
            tag?: string;
        };
        Chunk: {
            /**
             * Format: bigint
             * @description The database id of the chunk
             */
            id: string;
            /**
             * Format: bigint
             * @description The id of the data the chunk belongs to
             */
            dataId: string;
            /** @description The SHA-256 hash of the unencrypted chunk data base64url encoded */
            hash: string;
            /** @description The AES-256 initialization vector base64url encoded */
            iv: string;
            /**
             * Format: bigint
             * @description The start of the chunk as a byte position in the file
             */
            start: string;
            /**
             * Format: bigint
             * @description The end of the chunk as a byte position in the file
             */
            end: string;
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
        ChunkData: components["schemas"]["FileData"] & {
            chunks: components["schemas"]["Chunk"][];
        };
        FileUpload: components["schemas"]["File"] & {
            data: components["schemas"]["ChunkData"];
        };
        /** @description User is the type that represents a user in the system. */
        User: {
            /**
             * @description The subject of the user, a unique identifier
             * @example mhuttner
             */
            sub: string;
            /**
             * @description The scopes the user has
             * @example [
             *       "dabih:api"
             *     ]
             */
            scopes: string[];
            /** @description Does the user have the dabih:admin scope */
            isAdmin: boolean;
        };
        Token: {
            /**
             * Format: bigint
             * @description The id of the token
             */
            id: string;
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
            /**
             * Format: bigint
             * @description The database id of the key
             */
            id: string;
            /**
             * Format: bigint
             * @description The inode id the key belongs to
             */
            inodeId: string;
            hash: string;
            key: string;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        FileDownload: components["schemas"]["File"] & {
            keys: components["schemas"]["Key"][];
            data: components["schemas"]["ChunkData"];
        };
        FileKeys: components["schemas"]["File"] & {
            keys: components["schemas"]["Key"][];
        };
        Member: {
            /**
             * Format: bigint
             * @description The database id of the member
             */
            id: string;
            sub: string;
            /**
             * Format: bigint
             * @description The database id of the inode
             */
            inodeId: string;
            /** Format: double */
            permission: number;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        /**
         * @description PermissionString is a string representation of the Permission enum.
         * @enum {string}
         */
        PermissionString: "none" | "read" | "write";
        ApiMember: components["schemas"]["Member"] & {
            permissionString: components["schemas"]["PermissionString"];
            mnemonic: components["schemas"]["Mnemonic"];
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
        InodeMembers: components["schemas"]["Inode"] & {
            members: components["schemas"]["Member"][];
        };
        InodeTree: components["schemas"]["InodeMembers"] & {
            keys: components["schemas"]["Key"][];
            children?: components["schemas"]["InodeTree"][];
        };
        MoveInodeBody: {
            /** @description The mnemonic of the inode to move */
            mnemonic: components["schemas"]["Mnemonic"];
            /** @description Optional: The mnemonic of the new parent directory */
            parent?: components["schemas"]["Mnemonic"];
            /** @description The list of AES-256 keys required to decrypt all child datasets */
            keys?: components["schemas"]["FileDecryptionKey"][];
            /** @description Optional: The new name of the inode */
            name?: string;
            /** @description Optional: The new tag of the inode */
            tag?: string;
        };
        Directory: {
            mnemonic: components["schemas"]["Mnemonic"];
            name: string;
            /** Format: date-time */
            createdAt: Date;
            /** Format: date-time */
            updatedAt: Date;
        };
        AddDirectoryBody: {
            /** @description The name of the directory */
            name: string;
            /** @description The mnemonic of the parent directory */
            parent?: components["schemas"]["Mnemonic"];
            /** @description A custom searchable tag for the directory */
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
                    "application/json": components["schemas"]["FileUpload"][];
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
                    "application/json": components["schemas"]["ApiMember"][];
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
    duplicateInode: {
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
                    "application/json": components["schemas"]["Inode"];
                };
            };
        };
    };
    removeInode: {
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
    inodeTree: {
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
                    "application/json": components["schemas"]["InodeTree"];
                };
            };
        };
    };
    moveInode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MoveInodeBody"];
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
    listRoot: {
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
                    "application/json": components["schemas"]["InodeMembers"][];
                };
            };
        };
    };
    listInodes: {
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
                    "application/json": components["schemas"]["InodeMembers"][];
                };
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
                 *     It should be in the format `bytes {start}-{end}/{size?}` */
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
