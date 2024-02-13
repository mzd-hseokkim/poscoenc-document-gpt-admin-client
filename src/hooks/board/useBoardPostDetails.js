import { useEffect, useState } from 'react';

import { getPostDetails } from '../../services/board/BoardService';

export const useBoardPostDetails = (postId) => {
  const [postDetails, setPostDetails] = useState(null);
  const [loadingFlag, setLoadingFlag] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postDetails = await getPostDetails(postId);
        setPostDetails(postDetails);
        setLoadingFlag(false);
      } catch (err) {
        console.error(err);
        setLoadingFlag(false);
      }
    };
    fetchPostDetails(postId);
  }, [postId]);

  return { postDetails, loadingFlag };
};
