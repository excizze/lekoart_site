import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";

interface SearchResult {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onClose: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, query, onClose }) => {
  return (
    <div className="absolute top-full right-0 mt-1 z-50 search-results-container bg-white rounded-md shadow-lg overflow-hidden border border-white-300" style={{ width: '100%', maxWidth: '400px', left: 'auto', minWidth: 'auto' }}>
      <div className="p-3 border-b border-white-200 bg-white">
        <p className="text-xs text-gray-500">Результаты поиска для "{query}"</p>
      </div>
      
      {results.length > 0 ? (
        <div className="max-h-[400px] overflow-y-auto bg-white">
          {results.map(result => (
            <Link 
              key={result.id} 
              to={`/products/${result.id}`} 
              className="flex items-center gap-3 p-3 hover:bg-white-100 transition-colors border-b border-white-200"
              onClick={onClose}
            >
              <img 
                src={result.image} 
                alt={result.title} 
                className="w-16 h-16 object-cover rounded-sm"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-darkGreen font-medium line-clamp-2">{result.title}</h4>
                <p className="text-sm text-brown mt-1">{result.price.toLocaleString()} ₽</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center bg-white">
          <p className="text-sm text-gray-500">Ничего не найдено</p>
        </div>
      )}
      
      <div className="p-2 border-t border-white-200 flex justify-center bg-white">
        <Button 
          as={Link} 
          to={`/products?search=${encodeURIComponent(query)}`}
          size="sm" 
          color="primary" 
          className="w-full bg-brown-light hover:bg-brown border-none"
          onClick={onClose}
          style={{ color: "#FFFFFF" }}
        >
          <span className="text-white">Показать все результаты</span>
        </Button>
      </div>
    </div>
  );
};