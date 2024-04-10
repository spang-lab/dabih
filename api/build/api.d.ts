export interface paths {
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
    "/token/{tokenId}/remove": {
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
    "/key/add": {
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
    "/key/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listKeys"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/key/{keyId}/remove": {
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
    "/upload/chunk": {
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
            duplicate?: string;
        };
        /** @description From T, pick a set of properties whose keys are in the union K */
        "Pick_Dataset.fileName-or-size-or-name-or-path_": {
            /** @description The name of the file the dataset was created from */
            fileName: string;
            /** @description A custom non unique name of the dataset */
            name: string;
            /** @description The original path of the dataset */
            path: string;
            /**
             * Format: int32
             * @description The size of the dataset in bytes
             */
            size: number;
        };
        UploadStartBody: components["schemas"]["Pick_Dataset.fileName-or-size-or-name-or-path_"] & {
            /** @description The hash of the first 2MiB chunk of the file */
            chunkHash: string;
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
            /** Format: date-time */
            deletedAt: Date | null;
        };
        /** @description From T, pick a set of properties whose keys are in the union K */
        "Pick_PublicKey.data-or-isRootKey_": {
            data: string;
            isRootKey: boolean;
        };
        KeyAddBody: components["schemas"]["Pick_PublicKey.data-or-isRootKey_"];
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
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
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UploadStartResponse"];
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
            path: {
                tokenId: number;
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
    listKeys: {
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
                    "application/json": components["schemas"]["PublicKey"][];
                };
            };
        };
    };
    removeKey: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                keyId: number;
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
    Chunk: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
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
}
