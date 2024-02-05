import { useEffect, useState } from 'react';
import { getBoardList } from '../../services/board/BoardService';

export const useBoardData = () => {
  const [boardPosts, setBoardPosts] = useState([]);
  const [loadingFlag, setLoadingFlag] = useState(true);

  const fetchBoardData = async () => {
    try {
      const data = await getBoardList();
      setBoardPosts(data);
      setLoadingFlag(false);
    } catch (err) {
      console.error(err);
      setLoadingFlag(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  return { boardPosts, loadingFlag, fetchBoardData };
};
