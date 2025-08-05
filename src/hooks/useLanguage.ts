
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface ContentTranslation {
  id: string;
  content_type: 'category' | 'location' | 'cms_page' | 'product';
  content_id: string;
  language_code: string;
  field_name: string;
  translated_content: string;
  is_approved: boolean;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'tw', name: 'Twi', nativeName: 'Twi', flag: '🇬🇭' }
];

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const changeLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('preferred-language', languageCode);
    
    toast({
      title: 'Language changed',
      description: `Language changed to ${SUPPORTED_LANGUAGES.find(l => l.code === languageCode)?.name}`,
    });
  };

  const getTranslation = async (
    contentType: ContentTranslation['content_type'],
    contentId: string,
    fieldName: string,
    languageCode: string = currentLanguage
  ): Promise<string | null> => {
    if (languageCode === 'en') return null; // Return null for English (original content)

    try {
      const { data, error } = await supabase
        .from('content_translations')
        .select('translated_content')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .eq('field_name', fieldName)
        .eq('language_code', languageCode)
        .eq('is_approved', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.translated_content || null;
    } catch (error) {
      console.error('Error fetching translation:', error);
      return null;
    }
  };

  const submitTranslation = async (
    contentType: ContentTranslation['content_type'],
    contentId: string,
    fieldName: string,
    translatedContent: string,
    languageCode: string = currentLanguage
  ) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('content_translations')
        .upsert({
          content_type: contentType,
          content_id: contentId,
          field_name: fieldName,
          language_code: languageCode,
          translated_content: translatedContent,
          translator_id: user.user.id
        });

      if (error) throw error;

      toast({
        title: 'Translation submitted',
        description: 'Your translation has been submitted for review',
      });
    } catch (error) {
      console.error('Error submitting translation:', error);
      toast({
        title: 'Translation failed',
        description: 'Failed to submit translation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    currentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
    getTranslation,
    submitTranslation,
    loading
  };
};
