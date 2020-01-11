module.exports = {
    getUser(ctx, svs) {
        //throw new Error();
        let data = {
            a: 1
        };
        ctx.send({data});
        
    },
    getUserInfo(ctx) {
        ctx.body = 'getUserInfo';
    }
};