import axios from "axios";
//没有权限直接跳转到登录界面
function fetchGoodsList() {
    return axios.get('http://localhost:3001/rs-server-api/v1/goods/list');
}
export default {
    fetchGoodsList: fetchGoodsList
}