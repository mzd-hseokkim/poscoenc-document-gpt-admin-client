import api from 'api/Api';

const signIn = async (payload) => {
  const response = await api.post('/admin/public/auth/sign-in', payload);
  return response.data;
};

export default { signIn };
