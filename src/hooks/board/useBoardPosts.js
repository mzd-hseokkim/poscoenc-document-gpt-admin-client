import { useEffect, useState } from 'react';
import { getBoardList } from '../../services/board/BoardService';

export const useBoardPosts = () => {
  const [boardPosts, setBoardPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoardPosts = async () => {
    try {
      const data = await getBoardList();
      setBoardPosts(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardPosts();
  }, []);

  return { boardPosts, isLoading, fetchBoardData: fetchBoardPosts };
};
