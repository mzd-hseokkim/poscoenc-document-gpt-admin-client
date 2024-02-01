import api from '../../api/Api';

const getBoardList = async () => {
  // api.interceptors.request.use((config) => {
  //   config.headers.Authorization =
  //     'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiY3JlYXRlZEJ5IjoxLCJjcmVhdGVkQXQiOiIyMDI0LTAxLTMwVDEwOjM4OjAyIiwibW9kaWZpZWRCeSI6MCwibW9kaWZpZWRBdCI6IjIwMjQtMDEtMzBUMTU6NDk6MzQiLCJlbWFpbCI6ImFkbWluQG16LmNvLmtyIiwibmFtZSI6ImFkbWluIiwicm9sZXMiOlsiU1VQRVJfVVNFUiJdLCJsYXN0TG9nZ2VkSW5BdCI6IjIwMjQtMDItMDFUMTQ6MDQ6NTEiLCJmYWlsZWRDbnQiOjAsImRlbGV0ZWQiOmZhbHNlLCJhY2NvdW50Tm9uRXhwaXJlZCI6dHJ1ZSwiYWNjb3VudE5vbkxvY2tlZCI6dHJ1ZSwiY3JlZGVudGlhbHNOb25FeHBpcmVkIjp0cnVlLCJlbmFibGVkIjp0cnVlLCJ1c2VybmFtZSI6ImFkbWluQG16LmNvLmtyIiwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlNVUEVSX1VTRVIifV0sInN1YiI6ImFkbWluQG16LmNvLmtyIiwiaWF0IjoxNzA2NzYzODkxLCJleHAiOjE3MDY4NTAyOTF9.BEN-Nq9RRPOZT755r4tVxGvLxG4LOC1fvcEKAeGhOCk';
  //   return config;
  // });

  const response = await api.get('/admin/boards');
  return response.data.content;
};
export default { getBoardList };

/* for search query
     params: {
      id: params.id,
      author: params.createdBy,
      isAdmin: params.isAdmin,
      title: params.title,
      content: params.content,
      registered: params.createdAt,
      //REMIND status or deleted
      deleted: params.status,
    }



    http://localhost:8080/api/v1
 */
