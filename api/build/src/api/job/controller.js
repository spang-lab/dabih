var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Tags, Route, Get, Security, OperationId, } from '@tsoa/runtime';
import list from './list';
let JobController = class JobController extends Controller {
    listJobs() {
        return list();
    }
};
__decorate([
    Get('list'),
    OperationId('listJobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobController.prototype, "listJobs", null);
JobController = __decorate([
    Route('job'),
    Tags('Job'),
    Security('api_key', ['dabih:admin'])
], JobController);
export { JobController };
//# sourceMappingURL=controller.js.map