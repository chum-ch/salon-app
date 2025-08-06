export default (axios)=>({
    tenantRegister(data){
        return axios.post(`/tenants/register`, data)
    },
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
    },
    guestLogin(data){
        return axios.post(`/users/guest-login`, data)
    },
    sendOTP(tenantsId, data){
        return axios.put(`/tenants/${tenantsId}/verify-otp`, data)
    },
    resendOTP(tenantsId, data){
        return axios.put(`/tenants/${tenantsId}/resend-otp`, data)
    }
})
