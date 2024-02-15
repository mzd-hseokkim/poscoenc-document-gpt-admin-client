import { useState } from 'react';

import { getSearchedPostListApi } from '../../services/board/BoardService';
import useToast from '../useToast';

const useSearchBoardPosts = () => {
  const [postSearchResults, setPostSearchResults] = useState([]);

  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);

  const addToast = useToast();

  const searchBoardPosts = async (searchFormData) => {
    setSearchResultIsLoading(true);
    try {
      const searchResult = await getSearchedPostListApi(searchFormData);
      setPostSearchResults(searchResult);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setSearchResultIsLoading(false);
    }
  };
  return { postSearchResults, searchResultIsLoading, searchBoardPosts };
};

export default useSearchBoardPosts;
