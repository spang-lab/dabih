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
import { Controller, Tags, Route, Post, Get, Body, Request, Security, OperationId, } from '@tsoa/runtime';
import add from './add';
import list from './list';
import remove from './remove';
let TokenController = class TokenController extends Controller {
    async add(request, requestBody) {
        const { user } = request;
        return add(user, requestBody);
    }
    async list(request) {
        return list(request.user);
    }
    async remove(request, body) {
        const { user } = request;
        const { tokenId } = body;
        const id = parseInt(tokenId, 10);
        await remove(user, id);
    }
};
__decorate([
    Post('add'),
    OperationId('addToken'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "add", null);
__decorate([
    Get('list'),
    OperationId('listTokens'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "list", null);
__decorate([
    Post('remove'),
    OperationId('removeToken'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "remove", null);
TokenController = __decorate([
    Route('token'),
    Tags('Token'),
    Security('api_key', ['dabih:api'])
], TokenController);
export { TokenController };
//# sourceMappingURL=controller.js.map