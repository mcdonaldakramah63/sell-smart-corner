
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Clock, User, Search, Calendar } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import { SocialShareButtons } from '@/components/shared/SocialShareButtons';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { posts, loading, fetchPosts } = useBlog();

  useEffect(() => {
    fetchPosts({ status: 'published', limit: 20 });
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">MarketHub Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Latest news, tips, and insights from the MarketHub community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading articles...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                <CardHeader className="p-0">
                  {post.featured_image_url && (
                    <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex-grow space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.published_at || post.created_at)}
                      </div>
                      {post.reading_time && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.reading_time} min read
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="block group-hover:text-primary transition-colors"
                    >
                      <CardTitle className="text-xl leading-tight line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </Link>
                    
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 mt-4 border-t">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="h-4 w-4 mr-1" />
                      {post.view_count} views
                    </div>
                    
                    <SocialShareButtons
                      url={`${window.location.origin}/blog/${post.slug}`}
                      title={post.title}
                      description={post.excerpt}
                      blogPostId={post.id}
                      variant="compact"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || selectedTag ? 'No articles found matching your criteria.' : 'No articles published yet.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
