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
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../src/api/auth/controller';
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
            "email": {"dataType":"string","required":true},
            "scope": {"dataType":"string","required":true},
            "lastAuthAt": {"dataType":"datetime","required":true},
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
            "email": {"dataType":"string","required":true},
            "key": {"ref":"crypto.JsonWebKey","required":true},
            "isRootKey": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserSub": {
        "dataType": "refObject",
        "properties": {
            "sub": {"dataType":"string","required":true},
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
            "type": {"dataType":"double","required":true},
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
    "Member": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"any","required":true},
            "sub": {"dataType":"string","required":true},
            "inodeId": {"dataType":"any","required":true},
            "permission": {"dataType":"double","required":true},
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
    "InodeSearchResults": {
        "dataType": "refObject",
        "properties": {
            "isComplete": {"dataType":"boolean","required":true},
            "inodes": {"dataType":"array","array":{"dataType":"refObject","ref":"Inode"},"required":true},
        },
        "additionalProperties": false,
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
    "SignInResponse": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["email_sent"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "token": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
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


        const argsUtilController_healthy: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/healthy',
            ...(fetchMiddlewares<Middleware>(UtilController)),
            ...(fetchMiddlewares<Middleware>(UtilController.prototype.healthy)),

            async function UtilController_healthy(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUtilController_healthy, context, next });
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
        const argsUtilController_info: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/info',
            ...(fetchMiddlewares<Middleware>(UtilController)),
            ...(fetchMiddlewares<Middleware>(UtilController.prototype.info)),

            async function UtilController_info(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUtilController_info, context, next });
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
        const argsUserController_add: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserAddBody"},
        };
        router.post('/user/add',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.add)),

            async function UserController_add(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUserController_add, context, next });
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
        const argsUserController_me: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/user/me',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.me)),

            async function UserController_me(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUserController_me, context, next });
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
        const argsUserController_get: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"UserSub"},
        };
        router.post('/user/find',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.get)),

            async function UserController_get(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUserController_get, context, next });
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
        const argsUserController_list: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/user/list',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.list)),

            async function UserController_list(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUserController_list, context, next });
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
        const argsUserController_remove: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"UserSub"},
        };
        router.post('/user/remove',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.remove)),

            async function UserController_remove(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUserController_remove, context, next });
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
        const argsUserController_addKey: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"KeyAddBody"},
        };
        router.post('/user/key/add',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.addKey)),

            async function UserController_addKey(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUserController_addKey, context, next });
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
        const argsUserController_enableKey: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"KeyEnableBody"},
        };
        router.post('/user/key/enable',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.enableKey)),

            async function UserController_enableKey(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUserController_enableKey, context, next });
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
        const argsUserController_removeKey: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"KeyRemoveBody"},
        };
        router.post('/user/key/remove',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.removeKey)),

            async function UserController_removeKey(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUserController_removeKey, context, next });
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
        const argsUploadController_start: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UploadStartBody"},
        };
        router.post('/upload/start',
            authenticateMiddleware([{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.start)),

            async function UploadController_start(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_start, context, next });
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
        const argsUploadController_cancel: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
        };
        router.post('/upload/:mnemonic/cancel',
            authenticateMiddleware([{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.cancel)),

            async function UploadController_cancel(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_cancel, context, next });
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
        const argsUploadController_chunk: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                contentRange: {"in":"header","name":"content-range","required":true,"dataType":"string"},
                digest: {"in":"header","name":"digest","required":true,"dataType":"string"},
        };
        router.put('/upload/:mnemonic/chunk',
            authenticateMiddleware([{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.chunk)),

            async function UploadController_chunk(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_chunk, context, next });
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
        const argsUploadController_finish: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
        };
        router.post('/upload/:mnemonic/finish',
            authenticateMiddleware([{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.finish)),

            async function UploadController_finish(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_finish, context, next });
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
        const argsUploadController_unfinished: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/upload/unfinished',
            authenticateMiddleware([{"api_key":["dabih:upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.unfinished)),

            async function UploadController_unfinished(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_unfinished, context, next });
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
        const argsTokenController_add: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"TokenAddBody"},
        };
        router.post('/token/add',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(TokenController)),
            ...(fetchMiddlewares<Middleware>(TokenController.prototype.add)),

            async function TokenController_add(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsTokenController_add, context, next });
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
        const argsTokenController_list: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/token/list',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(TokenController)),
            ...(fetchMiddlewares<Middleware>(TokenController.prototype.list)),

            async function TokenController_list(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsTokenController_list, context, next });
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
        const argsTokenController_remove: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"tokenId":{"dataType":"string","required":true}}},
        };
        router.post('/token/remove',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(TokenController)),
            ...(fetchMiddlewares<Middleware>(TokenController.prototype.remove)),

            async function TokenController_remove(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsTokenController_remove, context, next });
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
        const argsJobController_listJobs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        router.get('/job/list',
            authenticateMiddleware([{"api_key":["dabih:admin"]}]),
            ...(fetchMiddlewares<Middleware>(JobController)),
            ...(fetchMiddlewares<Middleware>(JobController.prototype.listJobs)),

            async function JobController_listJobs(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsJobController_listJobs, context, next });
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
        const argsFilesystemController_file: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/fs/:mnemonic/file',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.file)),

            async function FilesystemController_file(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_file, context, next });
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
        const argsFilesystemController_listFiles: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/fs/:mnemonic/file/list',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.listFiles)),

            async function FilesystemController_listFiles(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_listFiles, context, next });
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
        const argsFilesystemController_listParents: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/fs/:mnemonic/parent/list',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.listParents)),

            async function FilesystemController_listParents(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_listParents, context, next });
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
        const argsFilesystemController_addMembers: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                body: {"in":"body","name":"body","required":true,"ref":"MemberAddBody"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/fs/:mnemonic/member/add',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.addMembers)),

            async function FilesystemController_addMembers(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_addMembers, context, next });
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
        const argsFilesystemController_duplicate: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/fs/:mnemonic/duplicate',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.duplicate)),

            async function FilesystemController_duplicate(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_duplicate, context, next });
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
        const argsFilesystemController_remove: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/fs/:mnemonic/remove',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.remove)),

            async function FilesystemController_remove(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_remove, context, next });
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
        const argsFilesystemController_destroy: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/fs/:mnemonic/destroy',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.destroy)),

            async function FilesystemController_destroy(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_destroy, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new FilesystemController();

            return templateService.apiHandler({
              methodName: 'destroy',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFilesystemController_tree: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/fs/:mnemonic/tree',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.tree)),

            async function FilesystemController_tree(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_tree, context, next });
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
        const argsFilesystemController_move: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"MoveInodeBody"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/fs/move',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.move)),

            async function FilesystemController_move(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_move, context, next });
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
        const argsFilesystemController_listHome: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/fs/list',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.listHome)),

            async function FilesystemController_listHome(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_listHome, context, next });
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
        const argsFilesystemController_listInodes: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
        };
        router.get('/fs/:mnemonic/list',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.listInodes)),

            async function FilesystemController_listInodes(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_listInodes, context, next });
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
        const argsFilesystemController_addDirectory: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"AddDirectoryBody"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/fs/directory/add',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.addDirectory)),

            async function FilesystemController_addDirectory(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_addDirectory, context, next });
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
        const argsFilesystemController_search: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"InodeSearchBody"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/fs/search',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.search)),

            async function FilesystemController_search(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_search, context, next });
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
        const argsFilesystemController_searchResults: Record<string, TsoaRoute.ParameterSchema> = {
                jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/fs/search/:jobId',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.searchResults)),

            async function FilesystemController_searchResults(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_searchResults, context, next });
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
        const argsFilesystemController_searchCancel: Record<string, TsoaRoute.ParameterSchema> = {
                jobId: {"in":"path","name":"jobId","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/fs/search/:jobId/cancel',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(FilesystemController)),
            ...(fetchMiddlewares<Middleware>(FilesystemController.prototype.searchCancel)),

            async function FilesystemController_searchCancel(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsFilesystemController_searchCancel, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDownloadController_decrypt: Record<string, TsoaRoute.ParameterSchema> = {
                mnemonic: {"in":"path","name":"mnemonic","required":true,"ref":"Mnemonic"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"key":{"ref":"AESKey","required":true}}},
        };
        router.post('/download/:mnemonic/decrypt',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(DownloadController)),
            ...(fetchMiddlewares<Middleware>(DownloadController.prototype.decrypt)),

            async function DownloadController_decrypt(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsDownloadController_decrypt, context, next });
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
        const argsDownloadController_download: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/download',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<Middleware>(DownloadController)),
            ...(fetchMiddlewares<Middleware>(DownloadController.prototype.download)),

            async function DownloadController_download(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsDownloadController_download, context, next });
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
        const argsDownloadController_chunk: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"path","name":"uid","required":true,"dataType":"string"},
                hash: {"in":"path","name":"hash","required":true,"dataType":"string"},
        };
        router.get('/download/:uid/chunk/:hash',
            authenticateMiddleware([{"api_key":["dabih:api"]}]),
            ...(fetchMiddlewares<Middleware>(DownloadController)),
            ...(fetchMiddlewares<Middleware>(DownloadController.prototype.chunk)),

            async function DownloadController_chunk(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsDownloadController_chunk, context, next });
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
        const argsAuthController_info: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.get('/auth/info',
            authenticateMiddleware([{"api_key":[]}]),
            ...(fetchMiddlewares<Middleware>(AuthController)),
            ...(fetchMiddlewares<Middleware>(AuthController.prototype.info)),

            async function AuthController_info(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_info, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_signIn: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true}}},
        };
        router.post('/auth/signIn',
            ...(fetchMiddlewares<Middleware>(AuthController)),
            ...(fetchMiddlewares<Middleware>(AuthController.prototype.signIn)),

            async function AuthController_signIn(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_signIn, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_verify: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"dataType":"string","required":true}}},
        };
        router.post('/auth/verify',
            ...(fetchMiddlewares<Middleware>(AuthController)),
            ...(fetchMiddlewares<Middleware>(AuthController.prototype.verify)),

            async function AuthController_verify(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_verify, context, next });
            } catch (err) {
              const error = err as any;
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
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_token: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        router.post('/auth/refresh',
            ...(fetchMiddlewares<Middleware>(AuthController)),
            ...(fetchMiddlewares<Middleware>(AuthController.prototype.token)),

            async function AuthController_token(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_token, context, next });
            } catch (err) {
              const error = err as any;
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
