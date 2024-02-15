import { useState } from 'react';

import { patchDeleteCommentApi } from '../../../services/board/BoardCommentService';
import useToast from '../../useToast';

const useDeleteComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToast();

  const deleteComment = async (postId, deletionOption) => {
    setIsLoading(true);
    try {
      return await patchDeleteCommentApi(postId, deletionOption);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteComment, isLoading };
};

export default useDeleteComment;
