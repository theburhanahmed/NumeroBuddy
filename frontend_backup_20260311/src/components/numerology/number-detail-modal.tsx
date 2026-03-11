/**
 * NumberDetailModal component - Display detailed interpretation of a number.
 */
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { NumberInterpretation } from '@/types/numerology';

interface NumberDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interpretation: NumberInterpretation | null;
  numberName: string;
}

export function NumberDetailModal({
  open,
  onOpenChange,
  interpretation,
  numberName,
}: NumberDetailModalProps) {
  if (!interpretation) return null;

  const isMasterNumber = [11, 22, 33].includes(interpretation.number);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="text-5xl font-bold text-purple-600">
              {interpretation.number}
            </div>
            <div>
              <DialogTitle className="text-2xl">{numberName}</DialogTitle>
              <DialogDescription className="text-lg font-semibold">
                {interpretation.title}
                {isMasterNumber && (
                  <Badge variant="secondary" className="ml-2">
                    Master Number
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="relationships">Love</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground mt-2 mb-4">
              <p>Click on tabs to explore different aspects of your {numberName.toLowerCase()}</p>
            </div>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold text-lg mb-2">What This Number Means</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {interpretation.description}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Your Life Purpose</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {interpretation.life_purpose}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This represents the core mission you&apos;re here to fulfill in this lifetime.
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Understanding Your Number</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Each number in numerology carries specific vibrations and energies that influence 
                  different aspects of your personality and life experiences. Your {numberName} is one 
                  of the most significant numbers in your chart, providing insights into your character 
                  and potential.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="strengths" className="mt-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                <h3 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-300">Leveraging Your Natural Gifts</h3>
                <p className="text-muted-foreground">
                  These are your innate talents and abilities that you can use to achieve success 
                  and fulfillment in various areas of your life. Recognizing and developing these 
                  strengths will help you navigate challenges more effectively.
                </p>
              </div>
              <h3 className="font-semibold text-lg mb-3">Your Key Strengths</h3>
              <ul className="space-y-3">
                {interpretation.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                    <span className="text-green-600 mt-1 flex-shrink-0">✓</span>
                    <span className="text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="challenges" className="mt-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
                <h3 className="font-semibold text-lg mb-2 text-amber-700 dark:text-amber-300">Navigating Your Growth Areas</h3>
                <p className="text-muted-foreground">
                  These are areas where you may face obstacles or need to develop greater awareness. 
                  Understanding these challenges helps you prepare for them and turn potential 
                  weaknesses into opportunities for growth.
                </p>
              </div>
              <h3 className="font-semibold text-lg mb-3">Areas for Personal Development</h3>
              <ul className="space-y-3">
                {interpretation.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                    <span className="text-amber-600 mt-1 flex-shrink-0">⚠</span>
                    <span className="text-muted-foreground">{challenge}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="career" className="mt-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Aligning With Your Purpose</h3>
                <p className="text-muted-foreground">
                  These career paths align with your natural talents and life purpose. Consider these 
                  options when making professional decisions or seeking fulfillment in your work. 
                  Remember that you can find success in many fields by leveraging your unique strengths.
                </p>
              </div>
              <h3 className="font-semibold text-lg mb-3">Recommended Career Paths</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interpretation.career.map((career, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary rounded-lg text-center hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">{career}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="relationships" className="mt-4">
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800 mb-4">
                <h3 className="font-semibold text-lg mb-2 text-pink-700 dark:text-pink-300">Building Meaningful Connections</h3>
                <p className="text-muted-foreground">
                  Understanding your relationship patterns can help you build stronger connections 
                  and navigate interpersonal dynamics more effectively. This insight helps you 
                  recognize what you bring to relationships and what you need from others.
                </p>
              </div>
              <h3 className="font-semibold text-lg mb-3">Your Relationship Dynamics</h3>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-muted-foreground leading-relaxed">
                  {interpretation.relationships}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}