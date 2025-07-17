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
import { Controller, Tags, Route, Post, Get, Body, Request, OperationId, Response, Security, } from '@tsoa/runtime';
import { rateLimit } from '#lib/redis/rateLimit';
import signIn from './signIn';
import refresh from './refresh';
import { parseRequest } from 'src/auth';
import verifyEmail from './verifyEmail';
let AuthController = class AuthController extends Controller {
    info(request) {
        const { user } = request;
        return user;
    }
    async signIn(request, requestBody) {
        await rateLimit(request.ip);
        const { email } = requestBody;
        return signIn(email);
    }
    async verify(requestBody) {
        const { token } = requestBody;
        return verifyEmail(token);
    }
    async token(request) {
        const tokenStr = parseRequest(request);
        return refresh(tokenStr);
    }
};
__decorate([
    Get('info'),
    Security('api_key', []),
    OperationId('authInfo'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "info", null);
__decorate([
    Post('signIn'),
    OperationId('signIn'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    Post('verify'),
    Response(500, 'Unknown error'),
    OperationId('verifyEmail'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    Post('refresh'),
    OperationId('refreshToken'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "token", null);
AuthController = __decorate([
    Route('auth'),
    Tags('Auth')
], AuthController);
export { AuthController };
//# sourceMappingURL=controller.js.map