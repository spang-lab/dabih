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
import { Controller, Tags, Route, Post, Get, Body, Request, Security, OperationId, SuccessResponse, } from '@tsoa/runtime';
import get from './get';
import add from './add';
import list from './list';
import remove from './remove';
import addKey from './addKey';
import enableKey from './enableKey';
import removeKey from './removeKey';
let UserController = class UserController extends Controller {
    async add(request, requestBody) {
        const { user } = request;
        const response = await add(user, requestBody);
        this.setStatus(201);
        return response;
    }
    async me(request) {
        const { user } = request;
        return get(user.sub);
    }
    async get(body) {
        const { sub } = body;
        return get(sub);
    }
    async list() {
        return list();
    }
    async remove(request, body) {
        const { sub } = body;
        const { user } = request;
        await remove(user, sub);
    }
    async addKey(request, body) {
        const { user } = request;
        const key = await addKey(user, body);
        this.setStatus(201);
        return key;
    }
    async enableKey(request, body) {
        const { user } = request;
        return enableKey(user, body);
    }
    async removeKey(request, body) {
        const { user } = request;
        await removeKey(user, body);
    }
};
__decorate([
    Post('add'),
    OperationId('addUser'),
    SuccessResponse('201', 'Created'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "add", null);
__decorate([
    Get('me'),
    OperationId('me'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
__decorate([
    Post('find'),
    OperationId('findUser'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "get", null);
__decorate([
    Get('list'),
    OperationId('listUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
__decorate([
    Post('remove'),
    OperationId('removeUser'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    Post('key/add'),
    OperationId('addKey'),
    SuccessResponse('201', 'Created'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addKey", null);
__decorate([
    Post('key/enable'),
    OperationId('enableKey'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "enableKey", null);
__decorate([
    Post('key/remove'),
    OperationId('removeKey'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeKey", null);
UserController = __decorate([
    Route('user'),
    Tags('User'),
    Security('api_key', ['dabih:api'])
], UserController);
export { UserController };
//# sourceMappingURL=controller.js.map