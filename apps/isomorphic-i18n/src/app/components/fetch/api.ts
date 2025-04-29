// utils/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://testapi.ordrat.com',
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // تحقق إذا كان الخطأ بسبب انتهاء صلاحية التوكين (401 Unauthorized)
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // منع تكرار نفس الطلب

      // قم بطلب Refresh Token API لتحديث التوكين
      try {
        const refreshToken = localStorage.getItem('Token'); // الحصول على الريفريش توكين
        const refreshResponse = await axios.post(
          'https://testapi.ordrat.com/api/Auth/RefreshAccessToken', // الرابط الكامل لتحديث التوكين
          {},
          {
            headers: {
              refreshToken: refreshToken,
            },
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // تحديث الهيدر الخاص بالـ Authorization في الطلب الأساسي
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // إعادة محاولة الطلب الأساسي
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // إذا فشل تحديث التوكين، إعادة توجيه المستخدم لتسجيل الدخول
        localStorage.removeItem('accessToken');
        localStorage.removeItem('Token');
        // window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
