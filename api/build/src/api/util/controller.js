var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Tags, Route, Get, OperationId, } from "@tsoa/runtime";
import info from "./info";
let UtilController = class UtilController extends Controller {
    healthy() {
        return {
            healthy: true,
        };
    }
    async info() {
        return info();
    }
};
__decorate([
    Get("healthy"),
    OperationId("healthy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], UtilController.prototype, "healthy", null);
__decorate([
    Get("info"),
    OperationId("info"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UtilController.prototype, "info", null);
UtilController = __decorate([
    Route("/"),
    Tags("Util")
], UtilController);
export { UtilController };
//# sourceMappingURL=controller.js.map