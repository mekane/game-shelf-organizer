"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockAuthUser = mockAuthUser;
function mockAuthUser({ userId = 1, username = 'test@example.com', bggUserName = 'bgg', isAdmin = false, } = {}) {
    return {
        id: userId,
        sub: userId,
        username,
        isAdmin,
        bggUserName,
    };
}
//# sourceMappingURL=utils.js.map