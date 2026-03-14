import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getContent = async (pageKey) => {
  try {
    const { data } = await apiClient.get(`/content/${pageKey}`);
    return data.content || {};
  } catch (error) {
    console.error(`Error fetching content for ${pageKey}:`, error);
    return {};
  }
};

export const getHomeContent = async () => {
  const sections = [
    'hero',
    'newWeHave',
    'asSeenIn', 
    'collections',
    'automotive',
    'tuners',
    'partner',
    'team',
    'community',
    'features'
  ];
  
  const content = {};
  await Promise.all(
    sections.map(async (section) => {
      content[section] = await getContent(`home-${section}`);
    })
  );
  
  return content;
};

export const getPageContent = async (page) => {
  return await getContent(page);
};
