import React, { useState, useEffect, useMemo } from "react";

const Articles = () => {
  const [articles, setArticles] = useState<any>([]);

  // Fetching data from the API using useEffect
  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch(
        "https://newsapi.org/v2/everything?q=tesla&from=2024-12-09&sortBy=publishedAt&apiKey=02367abafbe54e7b8ab8be1c34392aea"
      );
      const data = await response.json();
      setArticles(data.articles);
    };

    fetchArticles();
  }, []);

  // Using useMemo to optimize performance when processing articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article:any) => article.title && article.description); // Filtering articles that have both title and description
  }, [articles]); // Filtered articles are updated only when the original articles change

  return (
    <div>
      <h1>Articles</h1>
      {filteredArticles.length > 0 ? (
        <ul>
          {filteredArticles.map((article:any, index:any) => (
            <li key={index}>
              <h2>{article.title}</h2>
              <p>{article.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles to display</p>
      )}
    </div>
  );
};

export default Articles;
