import { useState, useEffect, useMemo } from 'react';
import { Paste, RelatedPaste } from '../types';
import { useAppStore } from '../store/appStore';

interface UseRelatedContentReturn {
  relatedPastes: RelatedPaste[];
  isLoading: boolean;
  error: string | null;
}

export const useRelatedContent = (currentPaste: Paste): UseRelatedContentReturn => {
  const { pastes } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const relatedPastes = useMemo(() => {
    if (!currentPaste) return [];

    try {
      const related: RelatedPaste[] = [];
      
      // Filter out current paste and non-public pastes
      const candidatePastes = pastes.filter(
        p => p.id !== currentPaste.id && p.isPublic
      );

      // Find pastes by same author
      const sameAuthorPastes = candidatePastes
        .filter(p => p.author.id === currentPaste.author.id)
        .slice(0, 2)
        .map(paste => ({
          paste,
          relevanceScore: 0.9,
          reason: 'user' as const
        }));

      // Find pastes with same language
      const sameLanguagePastes = candidatePastes
        .filter(p => 
          p.language === currentPaste.language && 
          p.author.id !== currentPaste.author.id
        )
        .slice(0, 3)
        .map(paste => ({
          paste,
          relevanceScore: 0.7 + Math.random() * 0.2,
          reason: 'language' as const
        }));

      // Find pastes with similar tags
      const currentTags = new Set(currentPaste.tags.map(tag => tag.toLowerCase()));
      const similarTagPastes = candidatePastes
        .filter(p => {
          const pasteTags = new Set(p.tags.map(tag => tag.toLowerCase()));
          const intersection = new Set([...currentTags].filter(tag => pasteTags.has(tag)));
          return intersection.size > 0 && p.author.id !== currentPaste.author.id;
        })
        .sort((a, b) => {
          const aIntersection = new Set([...currentTags].filter(tag => 
            new Set(a.tags.map(t => t.toLowerCase())).has(tag)
          ));
          const bIntersection = new Set([...currentTags].filter(tag => 
            new Set(b.tags.map(t => t.toLowerCase())).has(tag)
          ));
          return bIntersection.size - aIntersection.size;
        })
        .slice(0, 2)
        .map(paste => {
          const pasteTags = new Set(paste.tags.map(tag => tag.toLowerCase()));
          const intersection = new Set([...currentTags].filter(tag => pasteTags.has(tag)));
          const relevanceScore = 0.5 + (intersection.size / Math.max(currentTags.size, pasteTags.size)) * 0.3;
          
          return {
            paste,
            relevanceScore: Math.round(relevanceScore * 100) / 100,
            reason: 'tags' as const
          };
        });

      // Find pastes with similar content (basic keyword matching)
      const currentWords = new Set(
        currentPaste.content
          .toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 3)
      );

      const similarContentPastes = candidatePastes
        .filter(p => 
          p.language === currentPaste.language && 
          p.author.id !== currentPaste.author.id
        )
        .map(paste => {
          const pasteWords = new Set(
            paste.content
              .toLowerCase()
              .replace(/[^\w\s]/g, ' ')
              .split(/\s+/)
              .filter(word => word.length > 3)
          );
          
          const intersection = new Set([...currentWords].filter(word => pasteWords.has(word)));
          const similarity = intersection.size / Math.max(currentWords.size, pasteWords.size);
          
          return {
            paste,
            similarity,
            relevanceScore: Math.round(similarity * 100) / 100,
            reason: 'content' as const
          };
        })
        .filter(item => item.similarity > 0.1)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 2);

      // Combine all related pastes and remove duplicates
      const allRelated = [
        ...sameAuthorPastes,
        ...sameLanguagePastes,
        ...similarTagPastes,
        ...similarContentPastes
      ];

      // Remove duplicates based on paste ID
      const uniqueRelated = allRelated.filter((item, index, self) => 
        index === self.findIndex(other => other.paste.id === item.paste.id)
      );

      // Sort by relevance score and limit to top 6
      return uniqueRelated
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 6);

    } catch (err) {
      setError('Failed to find related content');
      return [];
    }
  }, [currentPaste, pastes]);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentPaste]);

  return {
    relatedPastes,
    isLoading,
    error
  };
};