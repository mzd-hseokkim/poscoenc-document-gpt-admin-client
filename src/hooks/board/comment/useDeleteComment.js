import { useState } from 'react';

import { patchDeleteCommentApi } from '../../../services/board/BoardCommentService';

const useDeleteComment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteComment = async (postId, deletionOption) => {
    setIsLoading(true);
    try {
      return await patchDeleteCommentApi(postId, deletionOption);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteComment, isLoading };
};

export default useDeleteComment;
