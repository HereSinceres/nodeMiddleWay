
import axios from "axios";
export default async (data, options) => {
    return await
        axios.get('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=await&oq=koa2&rsv_pq=cc725b1a000425d9&rsv_t=a6e0AZNHNRR1sVThxIwT8aihCL9aXftiREGRUq0d%http://localhost:3000/&rqlang=cn&rsv_enter=1&rsv_sug3=4&rsv_sug1=4&rsv_sug7=100&bs=koa2')
            .then(function (response) {
                return response.data;
            }).then((data) => {
                //统一的错误依据
                if (data['status'] == -1) {
                    global.throw(data['msg'], 400);
                } else {
                    return "远程的数据";
                }
            }).catch((err) => {
                //mock环境 并且提供数据
                if (process.env['NODE_MOCK'] == 'mock' && mock) {
                    return transDataFn(mock)
                }
                //统一的错误返回
                return Promise.resolve({
                    err: err.message
                });
            })
}