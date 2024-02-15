import { useState } from 'react';

import { postCommentApi } from '../../../services/board/BoardCommentService';

const useSubmitComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  // REMIND hook 의 에러 핸들링 추가

  const submitComment = async (postId, content) => {
    setIsLoading(true);
    try {
      return await postCommentApi(postId, content);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { submitComment, isLoading };
};

export default useSubmitComment;
