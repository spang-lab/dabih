/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, KoaTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UtilController } from './../src/api/util/controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../src/api/user/controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UploadController } from './../src/api/upload/controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TokenController } from './../src/api/token/controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { JobController } from './../src/api/job/controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FilesystemController } from './../src/api/fs/controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DownloadController } from './../src/api/download/controller';
import { koaAuthentication } from './../src/auth';
// @ts-ignore - no great way to install types from subpackage
import type { Context, Next, Middleware, Request as KRequest, Response as KResponse } from 'koa';
import type * as KoaRouter from '@koa/router';
const koaAuthenticationRecasted = koaAuthentication as (req: KRequest, securityName: string, scopes?: string[], res?: KResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "DabihInfo": {
        "dataType": "refObject",
        "properties": {
            "version": {"dataType":"string","required":true},
            "branding": {"dataType":"nestedObjectLiteral","nestedProperties":{"organization":{"dataType":"nestedObjectLiteral","nestedProperties":{"logo":{"dataType":"string","required":true},"url":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true},"department":{"dataType":"nestedObjectLiteral","nestedProperties":{"logo":{"dataType":"string","required":true},"url":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true},"contact":{"dataType":"nestedObjectLiteral","nestedProperties":{"phone":{"dataType":"string","required":true},"country":{"dataType":"string","required":true},"state":{"dataType":"string","required":true},"city":{"dataType":"string","required":true},"zip":{"dataType":"string","required":true},"street":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true},"admin":{"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PublicKey": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"any","required":true},
            "userId": {"dataType":"any","required":true},
            "hash": {"dataType":"string","required":true},
            "data": {"dataType":"string","required":true},
            "isRootKey": {"dataType":"boolean","required":true},
            "enabled": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "enabledBy": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"any","required":true},
            "sub": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "keys": {"dataType":"array","array":{"dataType":"refObject","ref":"PublicKey"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "crypto.JsonWebKey": {
        "dataType": "refObject",
        "properties": {
            "crv": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "d": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "dp": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "dq": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "e": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "k": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "kty": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "n": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "p": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "q": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "qi": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "x": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "y": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": {"dataType":"any"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserAddBody": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string"},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "key": {"ref":"crypto.JsonWebKey","required":true},
            "isRootKey": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "KeyAddBody": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string","required":true},
            "data": {"ref":"crypto.JsonWebKey","required":true},
            "isRootKey": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "KeyEnableBody": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string","required":true},
            "hash": {"dataType":"string","required":true},
            "enabled": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "KeyRemoveBody": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string","required":true},
            "hash": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InodeType": {
        "dataType": "refEnum",
        "enums": [0,1,2,10,11,12],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileData": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"any","required":true},
            "uid": {"dataType":"string","required":true},
            "createdBy": {"dataType":"string","required":true},
            "fileName": {"dataType":"string","required":true},
            "filePath": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "hash": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "size": {"dataType":"any","required":true},
            "keyHash": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Inode": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"any","required":true},
            "mnemonic": {"dataType":"string","required":true},
            "type": {"ref":"InodeType","required":true},
            "name": {"dataType":"string","required":true},
            "tag": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"FileData"},{"dataType":"enum","enums":[null]}]},
            "parentId": {"dataType":"any","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "File": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Inode"},{"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"ref":"FileData","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Mnemonic": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{"pattern":{"value":"^[a-z_]+$"}}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UploadStartBody": {
        "dataType": "refObject",
        "properties": {
            "fileName": {"dataType":"string","required":true},
            "directory": {"ref":"Mnemonic"},
            "filePath": {"dataType":"string"},
            "size": {"dataType":"integer"},
            "tag": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Chunk": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"any","required":true},
            "dataId": {"dataType":"any","required":true},
            "hash": {"dataType":"string","required":true},
            "iv": {"dataType":"string","required":true},
            "start": {"dataType":"any","required":true},
            "end": {"dataType":"any","required":true},
            "crc": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChunkData": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"FileData"},{"dataType":"nestedObjectLiteral","nestedProperties":{"chunks":{"dataType":"array","array":{"dataType":"refObject","ref":"Chunk"},"required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileUpload": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"File"},{"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"ref":"ChunkData","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string","required":true},
            "scopes": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "isAdmin": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Token": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"any","required":true},
            "value": {"dataType":"string","required":true},
            "sub": {"dataType":"string","required":true},
            "scope": {"dataType":"string","required":true},
            "exp": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Token"},{"dataType":"nestedObjectLiteral","nestedProperties":{"expired":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[false]}],"required":true},"scopes":{"dataType":"array","array":{"dataType":"string"},"required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenAddBody": {
        "dataType": "refObject",
        "properties": {
            "scopes": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "lifetime": {"dataType":"union","subSchemas":[{"dataType":"integer"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JobStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["running"]},{"dataType":"enum","enums":["complete"]},{"dataType":"enum","enums":["failed"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Job": {
        "dataType": "refObject",
        "properties": {
            "jobId": {"dataType":"string","required":true},
            "status": {"ref":"JobStatus","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Key": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"any","required":true},
            "inodeId": {"dataType":"any","required":true},
            "hash": {"dataType":"string","required":true},
            "key": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileDownload": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"File"},{"dataType":"nestedObjectLiteral","nestedProperties":{"keys":{"dataType":"array","array":{"dataType":"refObject","ref":"Key"},"required":true},"data":{"ref":"ChunkData","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileKeys": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"File"},{"dataType":"nestedObjectLiteral","nestedProperties":{"keys":{"dataType":"array","array":{"dataType":"refObject","ref":"Key"},"required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Permission": {
        "dataType": "refEnum",
        "enums": [0,1,2],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Member": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"any","required":true},
            "sub": {"dataType":"string","required":true},
            "inodeId": {"dataType":"any","required":true},
            "permission": {"ref":"Permission","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InodeMembers": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Inode"},{"dataType":"nestedObjectLiteral","nestedProperties":{"members":{"dataType":"array","array":{"dataType":"refObject","ref":"Member"},"required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AESKey": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileDecryptionKey": {
        "dataType": "refObject",
        "properties": {
            "mnemonic": {"ref":"Mnemonic","required":true},
            "key": {"ref":"AESKey","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemberAddBody": {
        "dataType": "refObject",
        "properties": {
            "subs": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "keys": {"dataType":"array","array":{"dataType":"refObject","ref":"FileDecryptionKey"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InodeTree": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"InodeMembers"},{"dataType":"nestedObjectLiteral","nestedProperties":{"keys":{"dataType":"array","array":{"dataType":"refObject","ref":"Key"},"required":true},"children":{"dataType":"array","array":{"dataType":"refAlias","ref":"InodeTree"}}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MoveInodeBody": {
        "dataType": "refObject",
        "properties": {
            "mnemonic": {"ref":"Mnemonic","required":true},
            "parent": {"dataType":"union","subSchemas":[{"ref":"Mnemonic"},{"dataType":"enum","enums":[null]}]},
            "keys": {"dataType":"array","array":{"dataType":"refObject","ref":"FileDecryptionKey"}},
            "name": {"dataType":"string"},
            "tag": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse": {
        "dataType": "refObject",
        "properties": {
            "parents": {"dataType":"array","array":{"dataType":"refAlias","ref":"InodeMembers"},"required":true},
            "children": {"dataType":"array","array":{"dataType":"refAlias","ref":"InodeMembers"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Directory": {
        "dataType": "refObject",
        "properties": {
            "mnemonic": {"ref":"Mnemonic","required":true},
            "name": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddDirectoryBody": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "parent": {"ref":"Mnemonic"},
            "tag": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InodeSearchBody": {
        "dataType": "refObject",
        "properties": {
            "query": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new KoaTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


export function RegisterRoutes(router: KoaRouter) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


        router.get('/healthy',
            ...(fetchMiddlewares<Middleware>(UtilController)),
            ...(fetchMiddlewares<Middleware>(UtilController.prototype.healthy)),

            async function UtilController_healthy(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/info',
            ...(fetchMiddlewares<Middleware>(UtilController)),
            ...(fetchMiddlewares<Middleware>(UtilController.prototype.info)),

            async function UtilController_info(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/user/add',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.add)),

            async function UserController_add(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserAddBody"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/user/me',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.me)),

            async function UserController_me(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/user/find',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.get)),

            async function UserController_get(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    undefined: {"in":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"sub":{"dataType":"string","required":true}}},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/user/list',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.list)),

            async function UserController_list(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/user/remove',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.remove)),

            async function UserController_remove(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    undefined: {"in":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"sub":{"dataType":"string","required":true}}},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/user/key/add',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.addKey)),

            async function UserController_addKey(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"KeyAddBody"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/user/key/enable',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.enableKey)),

            async function UserController_enableKey(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"KeyEnableBody"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/user/key/remove',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.removeKey)),

            async function UserController_removeKey(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"KeyRemoveBody"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/upload/start',
            authenticateMiddleware([{"jwt":["dabih:upload"]},{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.start)),

            async function UploadController_start(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UploadStartBody"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/upload/:mnemonic/cancel',
            authenticateMiddleware([{"jwt":["dabih:upload"]},{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.cancel)),

            async function UploadController_cancel(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.put('/upload/:mnemonic/chunk',
            authenticateMiddleware([{"jwt":["dabih:upload"]},{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.chunk)),

            async function UploadController_chunk(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    contentRange: {"in":"header","name":"content-range","required":true,"dataType":"string"},
                    digest: {"in":"header","name":"digest","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/upload/:mnemonic/finish',
            authenticateMiddleware([{"jwt":["dabih:upload"]},{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.finish)),

            async function UploadController_finish(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/upload/unfinished',
            authenticateMiddleware([{"jwt":["dabih:upload"]},{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.unfinished)),

            async function UploadController_unfinished(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/token/info',
            authenticateMiddleware([{"api_key":[]},{"jwt":[]}]),
            ...(fetchMiddlewares<Middleware>(TokenController)),
            ...(fetchMiddlewares<Middleware>(TokenController.prototype.info)),

            async function TokenController_info(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new TokenController();

            return templateService.apiHandler({
              methodName: 'info',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/token/add',
            authenticateMiddleware([{"jwt":["dabih:api"]},{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(TokenController)),
            ...(fetchMiddlewares<Middleware>(TokenController.prototype.add)),

            async function TokenController_add(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"TokenAddBody"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/token/list',
            authenticateMiddleware([{"jwt":["dabih:api"]},{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(TokenController)),
            ...(fetchMiddlewares<Middleware>(TokenController.prototype.list)),

            async function TokenController_list(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/token/remove',
            authenticateMiddleware([{"jwt":["dabih:api"]},{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(TokenController)),
            ...(fetchMiddlewares<Middleware>(TokenController.prototype.remove)),

            async function TokenController_remove(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"tokenId":{"dataType":"double","required":true}}},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/job/list',
            authenticateMiddleware([{"api_key":["dabih:admin"]},{"jwt":["dabih:admin"]}]),
            ...(fetchMiddlewares<Middleware>(JobController)),
            ...(fetchMiddlewares<Middleware>(JobController.prototype.listJobs)),

            async function JobController_listJobs(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/fs/:mnemonic/file',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.file)),

            async function FilesystemController_file(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/fs/:mnemonic/file/list',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.listFiles)),

            async function FilesystemController_listFiles(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/fs/:mnemonic/parent/list',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.listParents)),

            async function FilesystemController_listParents(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/fs/:mnemonic/member/add',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.addMembers)),

            async function FilesystemController_addMembers(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                    body: {"in":"body","name":"body","required":true,"ref":"MemberAddBody"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/fs/:mnemonic/duplicate',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.duplicate)),

            async function FilesystemController_duplicate(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/fs/:mnemonic/remove',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.remove)),

            async function FilesystemController_remove(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/fs/:mnemonic/tree',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.tree)),

            async function FilesystemController_tree(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/fs/move',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.move)),

            async function FilesystemController_move(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"MoveInodeBody"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/fs/list',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.listHome)),

            async function FilesystemController_listHome(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/fs/:mnemonic/list',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.listInodes)),

            async function FilesystemController_listInodes(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/fs/directory/add',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.addDirectory)),

            async function FilesystemController_addDirectory(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"AddDirectoryBody"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/fs/search',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.search)),

            async function FilesystemController_search(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"InodeSearchBody"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/fs/search/:jobId',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.searchResults)),

            async function FilesystemController_searchResults(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/download/:mnemonic/decrypt',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(DownloadController)),
            ...(fetchMiddlewares<Middleware>(DownloadController.prototype.decrypt)),

            async function DownloadController_decrypt(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"key":{"ref":"AESKey","required":true}}},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/download',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<Middleware>(DownloadController)),
            ...(fetchMiddlewares<Middleware>(DownloadController.prototype.download)),

            async function DownloadController_download(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/download/:uid/chunk/:hash',
            authenticateMiddleware([{"api_key":["dabih:api"]},{"jwt":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(DownloadController)),
            ...(fetchMiddlewares<Middleware>(DownloadController.prototype.chunk)),

            async function DownloadController_chunk(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    uid: {"in":"path","name":"uid","required":true,"dataType":"string"},
                    hash: {"in":"path","name":"hash","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(context: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            koaAuthenticationRecasted(context.request, name, secMethod[name], context.response)
                                .catch(pushAndRethrow)
                        );
                    }

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            koaAuthenticationRecasted(context.request, name, secMethod[name], context.response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let success;
            try {
                const user = await Promise.any(secMethodOrPromises);
                success = true;
                context.request['user'] = user;
            }
            catch(err) {
                // Response was sent in middleware, abort
                if(context.response.body) {
                    return;
                }

                // Show most recent error as response
                const error = failedAttempts.pop();
                context.status = error.status || 401;
                context.throw(context.status, error.message, error);
            }

            // Response was sent in middleware, abort
            if(context.response.body) {
                return;
            }

            if (success) {
                await next();
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
