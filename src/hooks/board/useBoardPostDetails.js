import { useCallback, useEffect, useState } from 'react';

import { getPostDetails } from '../../services/board/BoardService';

const useBoardPostDetails = (postId) => {
  const [postDetails, setPostDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostDetails = useCallback(async () => {
    try {
      const postDetails = await getPostDetails(postId);
      setPostDetails(postDetails);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  return { postDetails, isLoading, fetchPostDetails };
};

export default useBoardPostDetails;
