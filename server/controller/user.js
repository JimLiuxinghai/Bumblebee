module.exports = {
    getUser(ctx, svs) {
        let data = {
            a: 1
        };
        ctx.send({data});
        
    },
    getUserInfo(ctx) {
        ctx.body = 'getUserInfo';
    }
};