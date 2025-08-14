export default (axios)=>({
    tenantRegister(data){
        return axios.post(`/tenants/register`, data)
    },
    tenantSendEmail(tenantId, data){
        return axios.put(`/tenants/${tenantId}/send-email`, data)
    },
    getAvailableCode(data){
        return axios.post(`/avaliable-code`, data)
    },
    userLogin(data){
        return axios.post(`/users/login`, data)
    },
    ownerLogin(data){
        return axios.post(`/users/owner-login`, data)
    },
    sendOTP(tenantId, data){
        return axios.put(`/tenants/${tenantId}/verify-otp`, data)
    },
    resendOTP(tenantId, data){
        return axios.put(`/tenants/${tenantId}/resend-otp`, data)
    },
    forgotPassword(tenantId, data){
        return axios.put(`/tenants/${tenantId}/forgot-password`, data)
    },
    setPassword(tenantId, data){
        return axios.put(`/tenants/${tenantId}/set-password`, data)
    }
})
