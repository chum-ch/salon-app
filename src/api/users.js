export default (axios)=>({
    getAvailableCode(data){
        return axios.post(`/avaliable-code`, data)
    },
    listUsers(){
        return axios.get(`/users`)
    },
    signIn(data){
        return axios.post(`/users/sign-in`, data)
    },
    singUp(data){
        return axios.post(`/users/sign-up`, data)
    },
    getUser(ID){
        return axios.get(`/users/${ID}`)
    },
    deleteUser(ID){
        return axios.delete(`/users/${ID}`)
    }
})
