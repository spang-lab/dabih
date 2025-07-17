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
import { Controller, Tags, Route, Post, Get, Body, Request, Security, OperationId, Path, Produces, } from '@tsoa/runtime';
import chunk from './chunk';
import decrypt from './decrypt';
import download from './mnemonic';
let DownloadController = class DownloadController extends Controller {
    decrypt(mnemonic, request, body) {
        const { user } = request;
        const { key } = body;
        return decrypt(user, mnemonic, key);
    }
    async download(request) {
        const { user } = request;
        const { stream, fileName, size } = await download(user);
        this.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        this.setHeader('Content-Length', size.toString());
        return stream;
    }
    chunk(uid, hash) {
        this.setHeader('Content-Type', 'application/octet-stream');
        return chunk(uid, hash);
    }
};
__decorate([
    Post('{mnemonic}/decrypt'),
    Security('api_key', ['dabih:api']),
    OperationId('decryptDataset'),
    __param(0, Path()),
    __param(1, Request()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DownloadController.prototype, "decrypt", null);
__decorate([
    Get('/'),
    Security('api_key'),
    OperationId('downloadDataset'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DownloadController.prototype, "download", null);
__decorate([
    Get('{uid}/chunk/{hash}'),
    Security('api_key', ['dabih:api']),
    OperationId('downloadChunk'),
    Produces('application/octet-stream'),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DownloadController.prototype, "chunk", null);
DownloadController = __decorate([
    Route('download'),
    Tags('Download')
], DownloadController);
export { DownloadController };
//# sourceMappingURL=controller.js.map