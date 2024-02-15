import { useCallback, useEffect, useState } from 'react';

import { getPostDetailsApi } from '../../services/board/BoardService';
import useToast from '../useToast';

const useBoardPostDetails = (postId) => {
  const [postDetails, setPostDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const addToast = useToast();

  const fetchPostDetails = useCallback(async () => {
    try {
      const postDetails = await getPostDetailsApi(postId);
      setPostDetails(postDetails);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, postId]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  return { postDetails, isLoading, fetchPostDetails };
};

export default useBoardPostDetails;
