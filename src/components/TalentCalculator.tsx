import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trophy, Users, Gavel } from 'lucide-react';

interface Judge {
  id: number;
  creativity: number;
  quality: number;
  specialCriteria: number[];
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
    { id: 1, creativity: 0, quality: 0, specialCriteria: [0] }
  ]);
  const [audienceVoters, setAudienceVoters] = useState<number>(0);
  const [audiencePoints, setAudiencePoints] = useState<number>(0);
  const [controlConstant, setControlConstant] = useState<number>(20);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const addJudge = () => {
    const newJudge: Judge = {
      id: Date.now(),
      creativity: 0,
      quality: 0,
      specialCriteria: [0]
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
      return (judge.creativity + judge.quality + specialCriteriaAverages[index]) / 3;
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
    <div className="min-h-screen bg-gradient-kingdom py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/2b78c987-4b6c-4e70-80d6-994ab851d407.png" 
              alt="Rustic Got Talent Logo" 
              className="h-24 w-auto drop-shadow-glow"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-royal bg-clip-text text-transparent mb-2">
            Rustic Got Talent Calculator
          </h1>
          <p className="text-muted-foreground text-lg">
            Calculate contestant scores with precision and transparency
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
                  Judges ({judges.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {judges.map((judge, judgeIndex) => (
                  <div key={judge.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-royal-gold-light">Judge {judgeIndex + 1}</h4>
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
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`creativity-${judge.id}`}>Creativity (0-10)</Label>
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
                        <Label htmlFor={`quality-${judge.id}`}>Quality (0-10)</Label>
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
                        <Label>Special Criteria</Label>
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
                  Add Judge
                </Button>
              </CardContent>
            </Card>

            {/* Audience Section */}
            <Card className="border-kingdom-light bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-royal-gold">
                  <Users className="h-5 w-5" />
                  Audience Voting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="voters">Number of Voters</Label>
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
                  <Label htmlFor="points">Total Audience Points</Label>
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
                  <Label htmlFor="constant">Control Constant (M)</Label>
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
              Calculate Result
            </Button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              <Card className="border-royal-gold/30 bg-gradient-to-br from-card/80 to-royal-gold/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center text-royal-gold text-2xl">
                    Final Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-6xl font-bold bg-gradient-royal bg-clip-text text-transparent">
                    {result.finalScore.toFixed(2)}
                  </div>
                  <p className="text-muted-foreground">Final Score</p>
                  
                  <Separator className="bg-royal-gold/20" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-royal-gold-light">
                        {result.judgesAverage.toFixed(2)}
                      </div>
                      <p className="text-muted-foreground">Judges Average</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-royal-gold-light">
                        {result.audienceAverage.toFixed(2)}
                      </div>
                      <p className="text-muted-foreground">Audience Average</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-accent">
                      {result.audienceEffective.toFixed(2)}
                    </div>
                    <p className="text-muted-foreground text-sm">Audience Effective</p>
                  </div>
                </CardContent>
              </Card>

              {showBreakdown && (
                <Card className="border-kingdom-light bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-royal-gold">Calculation Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold text-royal-gold-light mb-2">Judge Averages:</h4>
                      {result.judgeAverages.map((avg, index) => (
                        <div key={index} className="flex justify-between">
                          <span>Judge {index + 1}:</span>
                          <span className="font-mono">{avg.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="bg-royal-gold/20" />
                    
                    <div>
                      <h4 className="font-semibold text-royal-gold-light mb-2">Formula Results:</h4>
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
      </div>
    </div>
  );
};

export default TalentCalculator;