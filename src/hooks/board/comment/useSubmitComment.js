import { useState } from 'react';

import { postCommentApi } from '../../../services/board/BoardCommentService';
import useToast from '../../useToast';

const useSubmitComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToast();

  const submitComment = async (postId, content) => {
    setIsLoading(true);
    try {
      return await postCommentApi(postId, content);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return { submitComment, isLoading };
};

export default useSubmitComment;
