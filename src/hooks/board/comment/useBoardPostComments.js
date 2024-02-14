import { useCallback, useEffect, useState } from 'react';

import { getPostComments } from '../../../services/board/BoardCommentService';

export const useBoardPostComments = (postId) => {
  const [postComments, setPostComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostComments = useCallback(async () => {
    try {
      const comments = await getPostComments(postId);
      setPostComments(comments);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostComments();
  }, [fetchPostComments]);

  return { postComments, isLoading, fetchPostComments };
};
