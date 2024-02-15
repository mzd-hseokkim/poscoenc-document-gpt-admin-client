import { useEffect, useState } from 'react';

import { getPostDetailsApi } from '../../services/board/BoardService';
import useToast from '../useToast';

const useGetBoardPostDetails = (postId) => {
  const [postDetails, setPostDetails] = useState(null);
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(true);

  const addToast = useToast();

  const fetchPostDetails = async () => {
    try {
      const postDetails = await getPostDetailsApi(postId);
      setPostDetails(postDetails);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setGetDetailIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  return { postDetails, getDetailIsLoading, fetchPostDetails };
};

export default useGetBoardPostDetails;
