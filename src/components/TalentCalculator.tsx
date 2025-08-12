import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Plus, Minus, Trophy, Users, Gavel, Sun, Moon, Languages } from 'lucide-react';

interface Judge {
  id: number;
  name: string;
  creativity: number;
  quality: number;
  specialCriteria: number[];
  isHalfWeight: boolean;
}

interface CalculationResult {
  finalScore: number;
  judgesAverage: number;
  audienceAverage: number;
  audienceEffective: number;
  judgeAverages: number[];
  specialCriteriaAverages: number[];
}

const TalentCalculator = () => {
  const [judges, setJudges] = useState<Judge[]>([
    { id: 1, name: 'Judge 1', creativity: 0, quality: 0, specialCriteria: [0], isHalfWeight: false }
  ]);
  const [isArabic, setIsArabic] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [audienceVoters, setAudienceVoters] = useState<number>(0);
  const [audiencePoints, setAudiencePoints] = useState<number>(0);
  const [controlConstant, setControlConstant] = useState<number>(20);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  // Translations
  const translations = {
    en: {
      title: "Rustic Got Talent Calculator",
      subtitle: "Calculate contestant scores with precision and transparency",
      withRegards: "With regards of COT",
      judges: "Judges",
      judgeLabel: "Judge",
      creativity: "Creativity (0-10)",
      quality: "Quality (0-10)",
      specialCriteria: "Special Criteria",
      addJudge: "Add Judge",
      addCriteria: "Add Criteria",
      removeCriteria: "Remove Criteria",
      halfWeight: "Half Weight",
      fullWeight: "Full Weight",
      audienceVoting: "Audience Voting",
      numberOfVoters: "Number of Voters",
      totalAudiencePoints: "Total Audience Points",
      controlConstant: "Control Constant (M)",
      calculateResult: "Calculate Result",
      finalResults: "Final Results",
      finalScore: "Final Score",
      judgesAverage: "Judges Average",
      audienceAverage: "Audience Average",
      audienceEffective: "Audience Effective",
      calculationBreakdown: "Calculation Breakdown",
      judgeAverages: "Judge Averages:",
      formulaResults: "Formula Results:",
      copyright: "© for Rustic Kingdom 🗝️ | developer: Adham"
    },
    ar: {
      title: "حاسبة مواهب الريفية",
      subtitle: "احسب نقاط المتسابقين بدقة وشفافية",
      withRegards: "مع خالص التقدير من COT",
      judges: "القضاة",
      judgeLabel: "القاضي",
      creativity: "الإبداع (0-10)",
      quality: "الجودة (0-10)",
      specialCriteria: "المعايير الخاصة",
      addJudge: "إضافة قاضي",
      addCriteria: "إضافة معيار",
      removeCriteria: "إزالة معيار",
      halfWeight: "نصف الوزن",
      fullWeight: "الوزن الكامل",
      audienceVoting: "تصويت الجمهور",
      numberOfVoters: "عدد المصوتين",
      totalAudiencePoints: "إجمالي نقاط الجمهور",
      controlConstant: "ثابت التحكم (M)",
      calculateResult: "احسب النتيجة",
      finalResults: "النتائج النهائية",
      finalScore: "النتيجة النهائية",
      judgesAverage: "متوسط القضاة",
      audienceAverage: "متوسط الجمهور",
      audienceEffective: "الجمهور الفعال",
      calculationBreakdown: "تفصيل الحساب",
      judgeAverages: "متوسط القضاة:",
      formulaResults: "نتائج الصيغة:",
      copyright: "© لمملكة الريفية 🗝️ | المطور: أدهم"
    }
  };

  const t = translations[isArabic ? 'ar' : 'en'];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addJudge = () => {
    const newJudge: Judge = {
      id: Date.now(),
      name: `${t.judgeLabel} ${judges.length + 1}`,
      creativity: 0,
      quality: 0,
      specialCriteria: [0],
      isHalfWeight: false
    };
    setJudges([...judges, newJudge]);
  };

  const removeJudge = (id: number) => {
    if (judges.length > 1) {
      setJudges(judges.filter(judge => judge.id !== id));
    }
  };

  const updateJudge = (id: number, field: keyof Judge, value: any) => {
    setJudges(judges.map(judge => 
      judge.id === id ? { ...judge, [field]: value } : judge
    ));
  };

  const addSpecialCriteria = (judgeId: number) => {
    setJudges(judges.map(judge => 
      judge.id === judgeId 
        ? { ...judge, specialCriteria: [...judge.specialCriteria, 0] }
        : judge
    ));
  };

  const removeSpecialCriteria = (judgeId: number, index: number) => {
    setJudges(judges.map(judge => 
      judge.id === judgeId 
        ? { ...judge, specialCriteria: judge.specialCriteria.filter((_, i) => i !== index) }
        : judge
    ));
  };

  const updateSpecialCriteria = (judgeId: number, index: number, value: number) => {
    setJudges(judges.map(judge => 
      judge.id === judgeId 
        ? { 
            ...judge, 
            specialCriteria: judge.specialCriteria.map((criteria, i) => 
              i === index ? value : criteria
            )
          }
        : judge
    ));
  };

  const calculateResult = () => {
    // Calculate special criteria averages for each judge
    const specialCriteriaAverages = judges.map(judge => {
      const sum = judge.specialCriteria.reduce((acc, criteria) => acc + criteria, 0);
      return sum / judge.specialCriteria.length;
    });

    // Calculate judge averages
    const judgeAverages = judges.map((judge, index) => {
      const average = (judge.creativity + judge.quality + specialCriteriaAverages[index]) / 3;
      return judge.isHalfWeight ? average / 2 : average;
    });

    // Calculate overall judges average
    const judgesAverage = judgeAverages.reduce((acc, avg) => acc + avg, 0) / judges.length;

    // Calculate audience average
    const audienceAverage = audienceVoters > 0 ? audiencePoints / audienceVoters : 0;

    // Calculate effective M value
    const M = Math.max(judges.length * 10, controlConstant);

    // Calculate audience effective
    const audienceEffective = audienceVoters > 0 
      ? (audienceVoters * audienceAverage + M * judgesAverage) / (audienceVoters + M)
      : judgesAverage;

    // Calculate final score
    const finalScore = (judgesAverage * 0.75) + (audienceEffective * 0.25);

    setResult({
      finalScore,
      judgesAverage,
      audienceAverage,
      audienceEffective,
      judgeAverages,
      specialCriteriaAverages
    });
    setShowBreakdown(true);
  };

  return (
    <div className={`min-h-screen bg-gradient-kingdom py-8 px-4 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        {/* Header with Controls */}
        <div className="text-center mb-8">
          {/* Language and Theme Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsArabic(!isArabic)}
                className="border-royal-gold/30 hover:border-royal-gold"
              >
                <Languages className="h-4 w-4 mr-2" />
                {isArabic ? 'EN' : 'عربي'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="border-royal-gold/30 hover:border-royal-gold"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/2b78c987-4b6c-4e70-80d6-994ab851d407.png" 
              alt="Rustic Got Talent Logo" 
              className="h-24 w-auto drop-shadow-glow"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-royal bg-clip-text text-transparent mb-2">
            {t.title}
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            {t.subtitle}
          </p>
          <p className="text-royal-gold-light text-base italic">
            {t.withRegards}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Judges Section */}
            <Card className="border-kingdom-light bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-royal-gold">
                  <Gavel className="h-5 w-5" />
                  {t.judges} ({judges.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {judges.map((judge, judgeIndex) => (
                  <div key={judge.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Input
                          value={judge.name}
                          onChange={(e) => updateJudge(judge.id, 'name', e.target.value)}
                          className="bg-background/80 font-semibold text-royal-gold-light"
                          placeholder={`${t.judgeLabel} ${judgeIndex + 1}`}
                        />
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">
                            {judge.isHalfWeight ? t.halfWeight : t.fullWeight}
                          </Label>
                          <Switch
                            checked={judge.isHalfWeight}
                            onCheckedChange={(checked) => updateJudge(judge.id, 'isHalfWeight', checked)}
                          />
                        </div>
                        {judges.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeJudge(judge.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`creativity-${judge.id}`}>{t.creativity}</Label>
                        <Input
                          id={`creativity-${judge.id}`}
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={judge.creativity}
                          onChange={(e) => updateJudge(judge.id, 'creativity', parseFloat(e.target.value) || 0)}
                          className="bg-background/80"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`quality-${judge.id}`}>{t.quality}</Label>
                        <Input
                          id={`quality-${judge.id}`}
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={judge.quality}
                          onChange={(e) => updateJudge(judge.id, 'quality', parseFloat(e.target.value) || 0)}
                          className="bg-background/80"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>{t.specialCriteria}</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addSpecialCriteria(judge.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          {judge.specialCriteria.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSpecialCriteria(judge.id, judge.specialCriteria.length - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {judge.specialCriteria.map((criteria, index) => (
                          <Input
                            key={index}
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={criteria}
                            onChange={(e) => updateSpecialCriteria(judge.id, index, parseFloat(e.target.value) || 0)}
                            placeholder={`Criteria ${index + 1}`}
                            className="bg-background/80"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={addJudge}
                  variant="outline"
                  className="w-full border-royal-gold/30 hover:border-royal-gold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addJudge}
                </Button>
              </CardContent>
            </Card>

            {/* Audience Section */}
            <Card className="border-kingdom-light bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-royal-gold">
                  <Users className="h-5 w-5" />
                  {t.audienceVoting}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="voters">{t.numberOfVoters}</Label>
                  <Input
                    id="voters"
                    type="number"
                    min="0"
                    value={audienceVoters}
                    onChange={(e) => setAudienceVoters(parseInt(e.target.value) || 0)}
                    className="bg-background/80"
                  />
                </div>
                <div>
                  <Label htmlFor="points">{t.totalAudiencePoints}</Label>
                  <Input
                    id="points"
                    type="number"
                    min="0"
                    value={audiencePoints}
                    onChange={(e) => setAudiencePoints(parseInt(e.target.value) || 0)}
                    className="bg-background/80"
                  />
                </div>
                <div>
                  <Label htmlFor="constant">{t.controlConstant}</Label>
                  <Input
                    id="constant"
                    type="number"
                    min="1"
                    value={controlConstant}
                    onChange={(e) => setControlConstant(parseInt(e.target.value) || 20)}
                    className="bg-background/80"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={calculateResult}
              className="w-full bg-gradient-royal hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg shadow-royal"
            >
              <Trophy className="h-5 w-5 mr-2" />
              {t.calculateResult}
            </Button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              <Card className="border-royal-gold/30 bg-gradient-to-br from-card/80 to-royal-gold/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center text-royal-gold text-2xl">
                    {t.finalResults}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-6xl font-bold bg-gradient-royal bg-clip-text text-transparent">
                    {result.finalScore.toFixed(2)}
                  </div>
                  <p className="text-muted-foreground">{t.finalScore}</p>
                  
                  <Separator className="bg-royal-gold/20" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-royal-gold-light">
                        {result.judgesAverage.toFixed(2)}
                      </div>
                      <p className="text-muted-foreground">{t.judgesAverage}</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-royal-gold-light">
                        {result.audienceAverage.toFixed(2)}
                      </div>
                      <p className="text-muted-foreground">{t.audienceAverage}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-accent">
                      {result.audienceEffective.toFixed(2)}
                    </div>
                    <p className="text-muted-foreground text-sm">{t.audienceEffective}</p>
                  </div>
                </CardContent>
              </Card>

              {showBreakdown && (
                <Card className="border-kingdom-light bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-royal-gold">{t.calculationBreakdown}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold text-royal-gold-light mb-2">{t.judgeAverages}</h4>
                      {result.judgeAverages.map((avg, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{judges[index]?.name || `${t.judgeLabel} ${index + 1}`}:</span>
                          <span className="font-mono">{avg.toFixed(2)} {judges[index]?.isHalfWeight ? '(Half)' : ''}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="bg-royal-gold/20" />
                    
                    <div>
                      <h4 className="font-semibold text-royal-gold-light mb-2">{t.formulaResults}</h4>
                      <div className="space-y-1 font-mono text-xs">
                        <div>Judges Avg = {result.judgesAverage.toFixed(2)}</div>
                        <div>Audience Avg = {result.audienceAverage.toFixed(2)}</div>
                        <div>M = {Math.max(judges.length * 10, controlConstant)}</div>
                        <div>Audience Effective = {result.audienceEffective.toFixed(2)}</div>
                        <div className="text-royal-gold">
                          Final = ({result.judgesAverage.toFixed(2)} × 0.75) + ({result.audienceEffective.toFixed(2)} × 0.25) = {result.finalScore.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <footer className="text-center mt-12 py-6 border-t border-royal-gold/20">
          <p className="text-muted-foreground text-sm">
            {t.copyright}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TalentCalculator;