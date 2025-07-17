var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Tags, Route, Post, Body, Request, Security, SuccessResponse, Put, Get, OperationId, Path, Header, } from '@tsoa/runtime';
import start from './start';
import cancel from './cancel';
import { default as chunk } from './chunk';
import finish from './finish';
import unfinished from './unfinished';
import { parseDigest, parseContentRange } from './util';
let UploadController = class UploadController extends Controller {
    async start(request, requestBody) {
        const { user } = request;
        const response = await start(user, requestBody);
        this.setStatus(201);
        return response;
    }
    async cancel(request, mnemonic) {
        const { user } = request;
        await cancel(user, mnemonic);
    }
    async chunk(mnemonic, request, contentRange, digest) {
        const result = await chunk({
            mnemonic,
            ...parseContentRange(contentRange),
            hash: parseDigest(digest),
        }, request);
        this.setStatus(201);
        return result;
    }
    async finish(request, mnemonic) {
        const { user } = request;
        return finish(user, mnemonic);
    }
    async unfinished(request) {
        const { user } = request;
        return unfinished(user);
    }
};
__decorate([
    Post('start'),
    OperationId('startUpload'),
    SuccessResponse('201', 'Created'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "start", null);
__decorate([
    Post('{mnemonic}/cancel'),
    OperationId('cancelUpload'),
    __param(0, Request()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "cancel", null);
__decorate([
    Put('{mnemonic}/chunk'),
    OperationId('chunkUpload'),
    SuccessResponse('201', 'Created'),
    __param(0, Path()),
    __param(1, Request()),
    __param(2, Header('content-range')),
    __param(3, Header('digest')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "chunk", null);
__decorate([
    Post('{mnemonic}/finish'),
    OperationId('finishUpload'),
    __param(0, Request()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "finish", null);
__decorate([
    Get('unfinished'),
    OperationId('unfinishedUploads'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "unfinished", null);
UploadController = __decorate([
    Route('upload'),
    Tags('Upload'),
    Security('api_key', ['dabih:upload'])
], UploadController);
export { UploadController };
//# sourceMappingURL=controller.js.map