import { useState } from 'react';

const useModifyComment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const modifyComment = async (commentId, postId, newContent) => {
    setIsLoading(true);

    try {
      return await modifyComment(commentId, postId, newContent);
    } catch (e) {
      //REMIND imple error handing logic
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return { modifyComment, isLoading };
};

export default useModifyComment;
