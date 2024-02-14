import { useEffect, useState } from 'react';

import { getPostList } from '../../services/board/BoardService';

export const useBoardPosts = () => {
  const [boardPosts, setBoardPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoardTableData = async () => {
    try {
      const data = await getPostList();
      setBoardPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardTableData();
  }, []);

  return { boardPosts, isLoading, fetchBoardTableData };
};
