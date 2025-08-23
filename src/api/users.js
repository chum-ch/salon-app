// const userApi = "https://95ipr7p9sa.execute-api.ap-southeast-1.amazonaws.com/dev";
const userApi = "http://localhost:3000";
export default (axios)=>({
    tenantRegister(data){
        return axios.post(`${userApi}/tenants/register`, data)
    },
    tenantSendEmail(tenantId, data){
        return axios.put(`${userApi}/tenants/${tenantId}/send-email`, data)
    },
    getAvailableCode(data){
        return axios.post(`${userApi}/avaliable-code`, data)
    },
    userLogin(data){
        return axios.post(`${userApi}/users/login`, data)
    },
    ownerLogin(data){
        return axios.post(`${userApi}/users/owner-login`, data)
    },
    sendOTP(tenantId, data){
        return axios.put(`${userApi}/tenants/${tenantId}/verify-otp`, data)
    },
    resendOTP(tenantId, data){
        return axios.put(`${userApi}/tenants/${tenantId}/resend-otp`, data)
    },
    forgotPassword(tenantId, data){
        return axios.put(`${userApi}/tenants/${tenantId}/forgot-password`, data)
    },
    setPassword(tenantId, data){
        return axios.put(`${userApi}/tenants/${tenantId}/set-password`, data)
    }
})
