const userApi = "https://fqrwyo8bae.execute-api.ap-southeast-1.amazonaws.com/dev";
// const userApi = "http://localhost:3001";
export default (axios)=>({

  // Service api
  createService(tenantId, userId, data){
    return axios.post(`${userApi}/tenants/${tenantId}/users/${userId}/services`, data)
  },
  listServices(tenantId, userId){
    return axios.get(`${userApi}/tenants/${tenantId}/users/${userId}/services`)
  },
  getService(tenantId, userId, serviceId){
    return axios.get(`${userApi}/tenants/${tenantId}/users/${userId}/services/${serviceId}`)
  },
  updateService(tenantId, userId, serviceId, data){
    return axios.put(`${userApi}/tenants/${tenantId}/users/${userId}/services/${serviceId}`, data)
  },
  deleteService(tenantId, userId, serviceId){
    return axios.delete(`${userApi}/tenants/${tenantId}/users/${userId}/services/${serviceId}`)
  },

  // Booking api
  createBooking(tenantId, userId, data){
    return axios.post(`${userApi}/tenants/${tenantId}/users/${userId}/bookings`, data)
  },
  listBookings(tenantId, userId){
    return axios.get(`${userApi}/tenants/${tenantId}/users/${userId}/bookings`)
  },
  getBooking(tenantId, userId, bookingId){
    return axios.get(`${userApi}/tenants/${tenantId}/users/${userId}/bookings/${bookingId}`)
  },
  updateBooking(tenantId, userId, bookingId, data){
    return axios.put(`${userApi}/tenants/${tenantId}/users/${userId}/bookings/${bookingId}`, data)
  },
  deleteBooking(tenantId, userId, bookingId){
    return axios.delete(`${userApi}/tenants/${tenantId}/users/${userId}/bookings/${bookingId}`)
  },
})
