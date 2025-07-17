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
import { Controller, Tags, Route, Post, Get, Body, Request, Security, OperationId, Path, } from '@tsoa/runtime';
import file from './file';
import listParents from './listParents';
import listFiles from './listFiles';
import remove from './remove';
import addMembers from './addMembers';
import addDirectory from './addDirectory';
import move from './move';
import duplicate from './duplicate';
import tree from './tree';
import list from './list';
import searchStart from './searchStart';
import searchResults from './searchResults';
import searchCancel from './searchCancel';
let FilesystemController = class FilesystemController extends Controller {
    file(mnemonic, request) {
        const { user } = request;
        return file(user, mnemonic);
    }
    async listFiles(mnemonic, request) {
        const { user } = request;
        return listFiles(user, mnemonic);
    }
    async listParents(mnemonic, request) {
        const { user } = request;
        return listParents(user, mnemonic);
    }
    async addMembers(mnemonic, body, request) {
        const { user } = request;
        return addMembers(user, mnemonic, body);
    }
    async duplicate(mnemonic, request) {
        const { user } = request;
        return duplicate(user, mnemonic);
    }
    async remove(mnemonic, request) {
        const { user } = request;
        return remove(user, mnemonic);
    }
    async tree(mnemonic, request) {
        const { user } = request;
        return tree(user, mnemonic);
    }
    async move(body, request) {
        const { user } = request;
        return move(user, body);
    }
    async listHome(request) {
        const { user } = request;
        return list(user);
    }
    async listInodes(request, mnemonic) {
        const { user } = request;
        return list(user, mnemonic);
    }
    async addDirectory(body, request) {
        const { user } = request;
        return addDirectory(user, body);
    }
    async search(body, request) {
        const { user } = request;
        return searchStart(user, body);
    }
    async searchResults(jobId, request) {
        const { user } = request;
        return searchResults(user, jobId);
    }
    async searchCancel(jobId, request) {
        const { user } = request;
        return searchCancel(user, jobId);
    }
};
__decorate([
    Get('{mnemonic}/file'),
    OperationId('fileInfo'),
    __param(0, Path()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "file", null);
__decorate([
    Get('{mnemonic}/file/list'),
    OperationId('listFiles'),
    __param(0, Path()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "listFiles", null);
__decorate([
    Get('{mnemonic}/parent/list'),
    OperationId('listParents'),
    __param(0, Path()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "listParents", null);
__decorate([
    Post('{mnemonic}/member/add'),
    OperationId('addMembers'),
    __param(0, Path()),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "addMembers", null);
__decorate([
    Post('{mnemonic}/duplicate'),
    OperationId('duplicateInode'),
    __param(0, Path()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "duplicate", null);
__decorate([
    Post('{mnemonic}/remove'),
    OperationId('removeInode'),
    __param(0, Path()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "remove", null);
__decorate([
    Get('{mnemonic}/tree'),
    OperationId('inodeTree'),
    __param(0, Path()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "tree", null);
__decorate([
    Post('move'),
    OperationId('moveInode'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "move", null);
__decorate([
    Get('list'),
    OperationId('listHome'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "listHome", null);
__decorate([
    Get('{mnemonic}/list'),
    OperationId('listInodes'),
    __param(0, Request()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "listInodes", null);
__decorate([
    Post('directory/add'),
    OperationId('addDirectory'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "addDirectory", null);
__decorate([
    Post('search'),
    OperationId('searchFs'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "search", null);
__decorate([
    Post('search/{jobId}'),
    OperationId('searchResults'),
    __param(0, Path()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "searchResults", null);
__decorate([
    Post('search/{jobId}/cancel'),
    OperationId('searchCancel'),
    __param(0, Path()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesystemController.prototype, "searchCancel", null);
FilesystemController = __decorate([
    Route('fs'),
    Tags('Filesystem'),
    Security('api_key', ['dabih:api'])
], FilesystemController);
export { FilesystemController };
//# sourceMappingURL=controller.js.map