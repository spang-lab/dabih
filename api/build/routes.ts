/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, KoaTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../src/api/user/controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UploadController } from './../src/api/upload/controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TokenController } from './../src/api/token/controller';
import { koaAuthentication } from './../src/auth';
// @ts-ignore - no great way to install types from subpackage
import type { Context, Next, Middleware, Request as KRequest, Response as KResponse } from 'koa';
import type * as KoaRouter from '@koa/router';
const koaAuthenticationRecasted = koaAuthentication as (req: KRequest, securityName: string, scopes?: string[], res?: KResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "PublicKey": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "userId": {"dataType":"double","required":true},
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
            "id": {"dataType":"integer","required":true},
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
    "Pick_Dataset.Exclude_keyofDataset.chunks__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"integer","required":true},"mnemonic":{"dataType":"string","required":true},"fileName":{"dataType":"string","required":true},"createdBy":{"dataType":"string","required":true},"keyHash":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"path":{"dataType":"string","required":true},"hash":{"dataType":"string","required":true},"size":{"dataType":"integer","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Dataset.chunks_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Dataset.Exclude_keyofDataset.chunks__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UploadStartResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_Dataset.chunks_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"duplicate":{"dataType":"string"}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Dataset.fileName-or-size-or-name-or-path_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"fileName":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"path":{"dataType":"string","required":true},"size":{"dataType":"integer","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UploadStartBody": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Pick_Dataset.fileName-or-size-or-name-or-path_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"chunkHash":{"dataType":"string","required":true}}}],"validators":{}},
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
            "id": {"dataType":"double","required":true},
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
};
const templateService = new KoaTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(router: KoaRouter) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        router.post('/user/add',
            authenticateMiddleware([{"api_key":["user"]},{"jwt":["user"]}]),
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
            authenticateMiddleware([{"api_key":["user"]},{"jwt":["user"]}]),
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
            authenticateMiddleware([{"api_key":["user"]},{"jwt":["user"]}]),
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
            authenticateMiddleware([{"api_key":["user"]},{"jwt":["user"]}]),
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
            authenticateMiddleware([{"api_key":["user"]},{"jwt":["user"]}]),
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
            authenticateMiddleware([{"api_key":["user"]},{"jwt":["user"]}]),
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
            authenticateMiddleware([{"api_key":["user"]},{"jwt":["user"]}]),
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
            authenticateMiddleware([{"api_key":["user"]},{"jwt":["user"]}]),
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
            authenticateMiddleware([{"jwt":["upload"]}]),
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
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.put('/upload/chunk',
            authenticateMiddleware([{"jwt":["upload"]}]),
            ...(fetchMiddlewares<Middleware>(UploadController)),
            ...(fetchMiddlewares<Middleware>(UploadController.prototype.chunk)),

            async function UploadController_chunk(context: Context, next: Next) {
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
              methodName: 'chunk',
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
            authenticateMiddleware([{"jwt":["token"]},{"api_key":["token"]}]),
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
            authenticateMiddleware([{"jwt":["token"]},{"api_key":["token"]}]),
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
            authenticateMiddleware([{"jwt":["token"]},{"api_key":["token"]}]),
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
