import { fetchMiddlewares, KoaTemplateService } from '@tsoa/runtime';
import { UtilController } from './../src/api/util/controller';
import { UserController } from './../src/api/user/controller';
import { UploadController } from './../src/api/upload/controller';
import { TokenController } from './../src/api/token/controller';
import { JobController } from './../src/api/job/controller';
import { FilesystemController } from './../src/api/fs/controller';
import { DownloadController } from './../src/api/download/controller';
import { AuthController } from './../src/api/auth/controller';
import { koaAuthentication } from './../src/auth';
const koaAuthenticationRecasted = koaAuthentication;
const models = {
    "DabihInfo": {
        "dataType": "refObject",
        "properties": {
            "version": { "dataType": "string", "required": true },
            "branding": { "dataType": "nestedObjectLiteral", "nestedProperties": { "organization": { "dataType": "nestedObjectLiteral", "nestedProperties": { "logo": { "dataType": "string", "required": true }, "url": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } }, "required": true }, "department": { "dataType": "nestedObjectLiteral", "nestedProperties": { "logo": { "dataType": "string", "required": true }, "url": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } }, "required": true }, "contact": { "dataType": "nestedObjectLiteral", "nestedProperties": { "phone": { "dataType": "string", "required": true }, "country": { "dataType": "string", "required": true }, "state": { "dataType": "string", "required": true }, "city": { "dataType": "string", "required": true }, "zip": { "dataType": "string", "required": true }, "street": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } }, "required": true }, "admin": { "dataType": "nestedObjectLiteral", "nestedProperties": { "email": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } }, "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    "PublicKey": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "any", "required": true },
            "userId": { "dataType": "any", "required": true },
            "hash": { "dataType": "string", "required": true },
            "data": { "dataType": "string", "required": true },
            "isRootKey": { "dataType": "boolean", "required": true },
            "enabled": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "enabledBy": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "UserResponse": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "any", "required": true },
            "sub": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "scope": { "dataType": "string", "required": true },
            "lastAuthAt": { "dataType": "datetime", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
            "keys": { "dataType": "array", "array": { "dataType": "refObject", "ref": "PublicKey" }, "required": true },
        },
        "additionalProperties": false,
    },
    "crypto.JsonWebKey": {
        "dataType": "refObject",
        "properties": {
            "crv": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "d": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "dp": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "dq": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "e": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "k": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "kty": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "n": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "p": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "q": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "qi": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "x": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
            "y": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "undefined" }] },
        },
        "additionalProperties": { "dataType": "any" },
    },
    "UserAddBody": {
        "dataType": "refObject",
        "properties": {
            "sub": { "dataType": "string" },
            "email": { "dataType": "string", "required": true },
            "key": { "ref": "crypto.JsonWebKey", "required": true },
            "isRootKey": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    "UserSub": {
        "dataType": "refObject",
        "properties": {
            "sub": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "KeyAddBody": {
        "dataType": "refObject",
        "properties": {
            "sub": { "dataType": "string", "required": true },
            "data": { "ref": "crypto.JsonWebKey", "required": true },
            "isRootKey": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "KeyEnableBody": {
        "dataType": "refObject",
        "properties": {
            "sub": { "dataType": "string", "required": true },
            "hash": { "dataType": "string", "required": true },
            "enabled": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "KeyRemoveBody": {
        "dataType": "refObject",
        "properties": {
            "sub": { "dataType": "string", "required": true },
            "hash": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "FileData": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "any", "required": true },
            "uid": { "dataType": "string", "required": true },
            "createdBy": { "dataType": "string", "required": true },
            "fileName": { "dataType": "string", "required": true },
            "filePath": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "hash": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "size": { "dataType": "any", "required": true },
            "keyHash": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "Inode": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "any", "required": true },
            "mnemonic": { "dataType": "string", "required": true },
            "type": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
            "tag": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "data": { "dataType": "union", "subSchemas": [{ "ref": "FileData" }, { "dataType": "enum", "enums": [null] }] },
            "parentId": { "dataType": "any", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "File": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "Inode" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "data": { "ref": "FileData", "required": true } } }], "validators": {} },
    },
    "Mnemonic": {
        "dataType": "refAlias",
        "type": { "dataType": "string", "validators": { "pattern": { "value": "^[a-z_]+$" } } },
    },
    "UploadStartBody": {
        "dataType": "refObject",
        "properties": {
            "fileName": { "dataType": "string", "required": true },
            "directory": { "ref": "Mnemonic" },
            "filePath": { "dataType": "string" },
            "size": { "dataType": "integer" },
            "tag": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    "Chunk": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "any", "required": true },
            "dataId": { "dataType": "any", "required": true },
            "hash": { "dataType": "string", "required": true },
            "iv": { "dataType": "string", "required": true },
            "start": { "dataType": "any", "required": true },
            "end": { "dataType": "any", "required": true },
            "crc": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "ChunkData": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "FileData" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "chunks": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Chunk" }, "required": true } } }], "validators": {} },
    },
    "FileUpload": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "File" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "data": { "ref": "ChunkData", "required": true } } }], "validators": {} },
    },
    "Token": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "any", "required": true },
            "value": { "dataType": "string", "required": true },
            "sub": { "dataType": "string", "required": true },
            "scope": { "dataType": "string", "required": true },
            "exp": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "TokenResponse": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "Token" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "expired": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [false] }], "required": true }, "scopes": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } }], "validators": {} },
    },
    "TokenAddBody": {
        "dataType": "refObject",
        "properties": {
            "scopes": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "lifetime": { "dataType": "union", "subSchemas": [{ "dataType": "integer" }, { "dataType": "enum", "enums": [null] }], "required": true },
        },
        "additionalProperties": false,
    },
    "JobStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["running"] }, { "dataType": "enum", "enums": ["complete"] }, { "dataType": "enum", "enums": ["failed"] }], "validators": {} },
    },
    "Job": {
        "dataType": "refObject",
        "properties": {
            "jobId": { "dataType": "string", "required": true },
            "status": { "ref": "JobStatus", "required": true },
        },
        "additionalProperties": false,
    },
    "Key": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "any", "required": true },
            "inodeId": { "dataType": "any", "required": true },
            "hash": { "dataType": "string", "required": true },
            "key": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "FileDownload": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "File" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "keys": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Key" }, "required": true }, "data": { "ref": "ChunkData", "required": true } } }], "validators": {} },
    },
    "FileKeys": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "File" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "keys": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Key" }, "required": true } } }], "validators": {} },
    },
    "Member": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "any", "required": true },
            "sub": { "dataType": "string", "required": true },
            "inodeId": { "dataType": "any", "required": true },
            "permission": { "dataType": "double", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "InodeMembers": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "Inode" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "members": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Member" }, "required": true } } }], "validators": {} },
    },
    "AESKey": {
        "dataType": "refAlias",
        "type": { "dataType": "string", "validators": {} },
    },
    "FileDecryptionKey": {
        "dataType": "refObject",
        "properties": {
            "mnemonic": { "ref": "Mnemonic", "required": true },
            "key": { "ref": "AESKey", "required": true },
        },
        "additionalProperties": false,
    },
    "MemberAddBody": {
        "dataType": "refObject",
        "properties": {
            "subs": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "keys": { "dataType": "array", "array": { "dataType": "refObject", "ref": "FileDecryptionKey" }, "required": true },
        },
        "additionalProperties": false,
    },
    "InodeTree": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "InodeMembers" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "keys": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Key" }, "required": true }, "children": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "InodeTree" } } } }], "validators": {} },
    },
    "MoveInodeBody": {
        "dataType": "refObject",
        "properties": {
            "mnemonic": { "ref": "Mnemonic", "required": true },
            "parent": { "dataType": "union", "subSchemas": [{ "ref": "Mnemonic" }, { "dataType": "enum", "enums": [null] }] },
            "keys": { "dataType": "array", "array": { "dataType": "refObject", "ref": "FileDecryptionKey" } },
            "name": { "dataType": "string" },
            "tag": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    "ListResponse": {
        "dataType": "refObject",
        "properties": {
            "parents": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "InodeMembers" }, "required": true },
            "children": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "InodeMembers" }, "required": true },
        },
        "additionalProperties": false,
    },
    "Directory": {
        "dataType": "refObject",
        "properties": {
            "mnemonic": { "ref": "Mnemonic", "required": true },
            "name": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    "AddDirectoryBody": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "parent": { "ref": "Mnemonic" },
            "tag": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    "InodeSearchBody": {
        "dataType": "refObject",
        "properties": {
            "query": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "InodeSearchResults": {
        "dataType": "refObject",
        "properties": {
            "isComplete": { "dataType": "boolean", "required": true },
            "inodes": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Inode" }, "required": true },
        },
        "additionalProperties": false,
    },
    "User": {
        "dataType": "refObject",
        "properties": {
            "sub": { "dataType": "string", "required": true },
            "scopes": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "isAdmin": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "SignInResponse": {
        "dataType": "refObject",
        "properties": {
            "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["success"] }, { "dataType": "enum", "enums": ["email_sent"] }, { "dataType": "enum", "enums": ["error"] }], "required": true },
            "token": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
};
const templateService = new KoaTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
export function RegisterRoutes(router) {
    const argsUtilController_healthy = {};
    router.get('/healthy', ...(fetchMiddlewares(UtilController)), ...(fetchMiddlewares(UtilController.prototype.healthy)), async function UtilController_healthy(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUtilController_healthy, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UtilController();
        return templateService.apiHandler({
            methodName: 'healthy',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUtilController_info = {};
    router.get('/info', ...(fetchMiddlewares(UtilController)), ...(fetchMiddlewares(UtilController.prototype.info)), async function UtilController_info(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUtilController_info, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UtilController();
        return templateService.apiHandler({
            methodName: 'info',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUserController_add = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UserAddBody" },
    };
    router.post('/user/add', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.add)), async function UserController_add(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_add, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UserController();
        return templateService.apiHandler({
            methodName: 'add',
            controller,
            context,
            validatedArgs,
            successStatus: 201,
        });
    });
    const argsUserController_me = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/user/me', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.me)), async function UserController_me(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_me, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UserController();
        return templateService.apiHandler({
            methodName: 'me',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUserController_get = {
        body: { "in": "body", "name": "body", "required": true, "ref": "UserSub" },
    };
    router.post('/user/find', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.get)), async function UserController_get(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_get, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UserController();
        return templateService.apiHandler({
            methodName: 'get',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUserController_list = {};
    router.get('/user/list', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.list)), async function UserController_list(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_list, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UserController();
        return templateService.apiHandler({
            methodName: 'list',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUserController_remove = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UserSub" },
    };
    router.post('/user/remove', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.remove)), async function UserController_remove(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_remove, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UserController();
        return templateService.apiHandler({
            methodName: 'remove',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUserController_addKey = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        body: { "in": "body", "name": "body", "required": true, "ref": "KeyAddBody" },
    };
    router.post('/user/key/add', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.addKey)), async function UserController_addKey(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_addKey, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UserController();
        return templateService.apiHandler({
            methodName: 'addKey',
            controller,
            context,
            validatedArgs,
            successStatus: 201,
        });
    });
    const argsUserController_enableKey = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        body: { "in": "body", "name": "body", "required": true, "ref": "KeyEnableBody" },
    };
    router.post('/user/key/enable', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.enableKey)), async function UserController_enableKey(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_enableKey, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UserController();
        return templateService.apiHandler({
            methodName: 'enableKey',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUserController_removeKey = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        body: { "in": "body", "name": "body", "required": true, "ref": "KeyRemoveBody" },
    };
    router.post('/user/key/remove', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.removeKey)), async function UserController_removeKey(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_removeKey, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UserController();
        return templateService.apiHandler({
            methodName: 'removeKey',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUploadController_start = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UploadStartBody" },
    };
    router.post('/upload/start', authenticateMiddleware([{ "api_key": ["dabih:upload"] }]), ...(fetchMiddlewares(UploadController)), ...(fetchMiddlewares(UploadController.prototype.start)), async function UploadController_start(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_start, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UploadController();
        return templateService.apiHandler({
            methodName: 'start',
            controller,
            context,
            validatedArgs,
            successStatus: 201,
        });
    });
    const argsUploadController_cancel = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
    };
    router.post('/upload/:mnemonic/cancel', authenticateMiddleware([{ "api_key": ["dabih:upload"] }]), ...(fetchMiddlewares(UploadController)), ...(fetchMiddlewares(UploadController.prototype.cancel)), async function UploadController_cancel(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_cancel, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UploadController();
        return templateService.apiHandler({
            methodName: 'cancel',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUploadController_chunk = {
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        contentRange: { "in": "header", "name": "content-range", "required": true, "dataType": "string" },
        digest: { "in": "header", "name": "digest", "required": true, "dataType": "string" },
    };
    router.put('/upload/:mnemonic/chunk', authenticateMiddleware([{ "api_key": ["dabih:upload"] }]), ...(fetchMiddlewares(UploadController)), ...(fetchMiddlewares(UploadController.prototype.chunk)), async function UploadController_chunk(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_chunk, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UploadController();
        return templateService.apiHandler({
            methodName: 'chunk',
            controller,
            context,
            validatedArgs,
            successStatus: 201,
        });
    });
    const argsUploadController_finish = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
    };
    router.post('/upload/:mnemonic/finish', authenticateMiddleware([{ "api_key": ["dabih:upload"] }]), ...(fetchMiddlewares(UploadController)), ...(fetchMiddlewares(UploadController.prototype.finish)), async function UploadController_finish(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_finish, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UploadController();
        return templateService.apiHandler({
            methodName: 'finish',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsUploadController_unfinished = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/upload/unfinished', authenticateMiddleware([{ "api_key": ["dabih:upload"] }]), ...(fetchMiddlewares(UploadController)), ...(fetchMiddlewares(UploadController.prototype.unfinished)), async function UploadController_unfinished(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_unfinished, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new UploadController();
        return templateService.apiHandler({
            methodName: 'unfinished',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsTokenController_add = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "TokenAddBody" },
    };
    router.post('/token/add', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(TokenController)), ...(fetchMiddlewares(TokenController.prototype.add)), async function TokenController_add(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTokenController_add, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new TokenController();
        return templateService.apiHandler({
            methodName: 'add',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsTokenController_list = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/token/list', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(TokenController)), ...(fetchMiddlewares(TokenController.prototype.list)), async function TokenController_list(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTokenController_list, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new TokenController();
        return templateService.apiHandler({
            methodName: 'list',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsTokenController_remove = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "tokenId": { "dataType": "string", "required": true } } },
    };
    router.post('/token/remove', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(TokenController)), ...(fetchMiddlewares(TokenController.prototype.remove)), async function TokenController_remove(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTokenController_remove, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new TokenController();
        return templateService.apiHandler({
            methodName: 'remove',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsJobController_listJobs = {};
    router.get('/job/list', authenticateMiddleware([{ "api_key": ["dabih:admin"] }]), ...(fetchMiddlewares(JobController)), ...(fetchMiddlewares(JobController.prototype.listJobs)), async function JobController_listJobs(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsJobController_listJobs, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new JobController();
        return templateService.apiHandler({
            methodName: 'listJobs',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_file = {
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/fs/:mnemonic/file', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.file)), async function FilesystemController_file(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_file, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'file',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_listFiles = {
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/fs/:mnemonic/file/list', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.listFiles)), async function FilesystemController_listFiles(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_listFiles, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'listFiles',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_listParents = {
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/fs/:mnemonic/parent/list', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.listParents)), async function FilesystemController_listParents(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_listParents, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'listParents',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_addMembers = {
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
        body: { "in": "body", "name": "body", "required": true, "ref": "MemberAddBody" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.post('/fs/:mnemonic/member/add', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.addMembers)), async function FilesystemController_addMembers(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_addMembers, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'addMembers',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_duplicate = {
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.post('/fs/:mnemonic/duplicate', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.duplicate)), async function FilesystemController_duplicate(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_duplicate, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'duplicate',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_remove = {
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.post('/fs/:mnemonic/remove', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.remove)), async function FilesystemController_remove(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_remove, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'remove',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_tree = {
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/fs/:mnemonic/tree', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.tree)), async function FilesystemController_tree(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_tree, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'tree',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_move = {
        body: { "in": "body", "name": "body", "required": true, "ref": "MoveInodeBody" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.post('/fs/move', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.move)), async function FilesystemController_move(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_move, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'move',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_listHome = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/fs/list', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.listHome)), async function FilesystemController_listHome(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_listHome, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'listHome',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_listInodes = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
    };
    router.get('/fs/:mnemonic/list', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.listInodes)), async function FilesystemController_listInodes(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_listInodes, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'listInodes',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_addDirectory = {
        body: { "in": "body", "name": "body", "required": true, "ref": "AddDirectoryBody" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.post('/fs/directory/add', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.addDirectory)), async function FilesystemController_addDirectory(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_addDirectory, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'addDirectory',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_search = {
        body: { "in": "body", "name": "body", "required": true, "ref": "InodeSearchBody" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.post('/fs/search', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.search)), async function FilesystemController_search(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_search, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'search',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_searchResults = {
        jobId: { "in": "path", "name": "jobId", "required": true, "dataType": "string" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.post('/fs/search/:jobId', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.searchResults)), async function FilesystemController_searchResults(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_searchResults, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'searchResults',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsFilesystemController_searchCancel = {
        jobId: { "in": "path", "name": "jobId", "required": true, "dataType": "string" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.post('/fs/search/:jobId/cancel', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(FilesystemController)), ...(fetchMiddlewares(FilesystemController.prototype.searchCancel)), async function FilesystemController_searchCancel(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_searchCancel, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new FilesystemController();
        return templateService.apiHandler({
            methodName: 'searchCancel',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsDownloadController_decrypt = {
        mnemonic: { "in": "path", "name": "mnemonic", "required": true, "ref": "Mnemonic" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "key": { "ref": "AESKey", "required": true } } },
    };
    router.post('/download/:mnemonic/decrypt', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(DownloadController)), ...(fetchMiddlewares(DownloadController.prototype.decrypt)), async function DownloadController_decrypt(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDownloadController_decrypt, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new DownloadController();
        return templateService.apiHandler({
            methodName: 'decrypt',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsDownloadController_download = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/download', authenticateMiddleware([{ "api_key": [] }]), ...(fetchMiddlewares(DownloadController)), ...(fetchMiddlewares(DownloadController.prototype.download)), async function DownloadController_download(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDownloadController_download, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new DownloadController();
        return templateService.apiHandler({
            methodName: 'download',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsDownloadController_chunk = {
        uid: { "in": "path", "name": "uid", "required": true, "dataType": "string" },
        hash: { "in": "path", "name": "hash", "required": true, "dataType": "string" },
    };
    router.get('/download/:uid/chunk/:hash', authenticateMiddleware([{ "api_key": ["dabih:api"] }]), ...(fetchMiddlewares(DownloadController)), ...(fetchMiddlewares(DownloadController.prototype.chunk)), async function DownloadController_chunk(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsDownloadController_chunk, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new DownloadController();
        return templateService.apiHandler({
            methodName: 'chunk',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsAuthController_info = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.get('/auth/info', authenticateMiddleware([{ "api_key": [] }]), ...(fetchMiddlewares(AuthController)), ...(fetchMiddlewares(AuthController.prototype.info)), async function AuthController_info(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_info, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new AuthController();
        return templateService.apiHandler({
            methodName: 'info',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsAuthController_signIn = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "email": { "dataType": "string", "required": true } } },
    };
    router.post('/auth/signIn', ...(fetchMiddlewares(AuthController)), ...(fetchMiddlewares(AuthController.prototype.signIn)), async function AuthController_signIn(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_signIn, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new AuthController();
        return templateService.apiHandler({
            methodName: 'signIn',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsAuthController_verify = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "token": { "dataType": "string", "required": true } } },
    };
    router.post('/auth/verify', ...(fetchMiddlewares(AuthController)), ...(fetchMiddlewares(AuthController.prototype.verify)), async function AuthController_verify(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_verify, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new AuthController();
        return templateService.apiHandler({
            methodName: 'verify',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    const argsAuthController_token = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    router.post('/auth/refresh', ...(fetchMiddlewares(AuthController)), ...(fetchMiddlewares(AuthController.prototype.token)), async function AuthController_token(context, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_token, context, next });
        }
        catch (err) {
            const error = err;
            error.message ||= JSON.stringify({ fields: error.fields });
            context.status = error.status;
            context.throw(context.status, error.message, error);
        }
        const controller = new AuthController();
        return templateService.apiHandler({
            methodName: 'token',
            controller,
            context,
            validatedArgs,
            successStatus: undefined,
        });
    });
    function authenticateMiddleware(security = []) {
        return async function runAuthenticationMiddleware(context, next) {
            const failedAttempts = [];
            const pushAndRethrow = (error) => {
                failedAttempts.push(error);
                throw error;
            };
            const secMethodOrPromises = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises = [];
                    for (const name in secMethod) {
                        secMethodAndPromises.push(koaAuthenticationRecasted(context.request, name, secMethod[name], context.response)
                            .catch(pushAndRethrow));
                    }
                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                }
                else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(koaAuthenticationRecasted(context.request, name, secMethod[name], context.response)
                            .catch(pushAndRethrow));
                    }
                }
            }
            let success;
            try {
                const user = await Promise.any(secMethodOrPromises);
                success = true;
                context.request['user'] = user;
            }
            catch (err) {
                if (context.response.body) {
                    return;
                }
                const error = failedAttempts.pop();
                context.status = error.status || 401;
                context.throw(context.status, error.message, error);
            }
            if (context.response.body) {
                return;
            }
            if (success) {
                await next();
            }
        };
    }
}
//# sourceMappingURL=routes.js.map