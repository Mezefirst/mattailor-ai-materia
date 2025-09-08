import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Globe } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' }
];

export function LanguageSettings() {
  const { language, setLanguage, t } = useTranslation();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    toast.success(t('settings.saved'));
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {t('settings.language')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language-select">
            {t('settings.language')}
          </Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger id="language-select">
              <SelectValue>
                {currentLanguage?.nativeName} ({currentLanguage?.name})
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-sm text-muted-foreground">{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>
            Language changes apply immediately to the interface. 
            Some technical terms may remain in English for clarity.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}