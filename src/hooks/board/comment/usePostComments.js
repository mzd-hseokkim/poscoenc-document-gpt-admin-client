import { useEffect, useState } from 'react';

import { getPostComments } from '../../../services/board/BoardCommentService';
import useToast from '../../useToast';

export const usePostComments = (postId) => {
  const [postComments, setPostComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const addToast = useToast();

  const fetchPostComments = async () => {
    try {
      const comments = await getPostComments(postId);
      setPostComments(comments);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, []);

  return { postComments, isLoading, fetchPostComments };
};
