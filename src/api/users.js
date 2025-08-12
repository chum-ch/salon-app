export default (axios)=>({
    tenantRegister(data){
        return axios.post(`/tenants/register`, data)
    },
    getAvailableCode(data){
        return axios.post(`/avaliable-code`, data)
    },
    userLogin(data){
        return axios.post(`/users/login`, data)
    },
    sendOTP(tenantsId, data){
        return axios.put(`/tenants/${tenantsId}/verify-otp`, data)
    },
    resendOTP(tenantsId, data){
        return axios.put(`/tenants/${tenantsId}/resend-otp`, data)
    }
})
