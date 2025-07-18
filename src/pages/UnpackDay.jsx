import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Sun, Moon } from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';

const questions = [
    { key: 'went_well', prompt: "What went well today?" },
    { key: 'went_better', prompt: "What could have gone better?" },
    { key: 'learned', prompt: "What did I learn today?" },
    { key: 'felt', prompt: "How did I feel overall?" }
];

export default function UnpackDay() {
    const { state, dispatch } = useApp();
    const [currentReflection, setCurrentReflection] = useState({ answers: {} });
    const [viewingDate, setViewingDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const reflections = state.dailyReflections;
    const hasTodayReflection = reflections.some(r => r.date === format(new Date(), 'yyyy-MM-dd'));

    const handleAnswerChange = (key, value) => {
        setCurrentReflection(prev => ({
            ...prev,
            answers: { ...prev.answers, [key]: value }
        }));
    };

    const handleSave = () => {
        const reflectionToSave = {
            date: format(new Date(), 'yyyy-MM-dd'),
            answers: currentReflection.answers,
            user_id: state.user.id
        };
        dispatch({ type: 'ADD_DAILY_REFLECTION', payload: reflectionToSave });
        setCurrentReflection({ answers: {} });
    };

    const displayedReflection = reflections.find(r => r.date === viewingDate);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-3xl font-bold">Unpack Your Day</h1></div>
                <Input type="date" value={viewingDate} onChange={e => setViewingDate(e.target.value)} className="w-48"/>
            </div>

            {isToday(parseISO(viewingDate)) && !hasTodayReflection ? (
                <Card>
                    <CardHeader><CardTitle>Today's Reflection</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {questions.map(q => (
                            <div key={q.key}>
                                <Label className="text-lg">{q.prompt}</Label>
                                <Textarea 
                                    value={currentReflection.answers[q.key] || ''}
                                    onChange={e => handleAnswerChange(q.key, e.target.value)}
                                    className="mt-2"
                                />
                            </div>
                        ))}
                        <div className="text-right">
                            <Button onClick={handleSave}>Save Reflection</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : displayedReflection ? (
                <Card>
                    <CardHeader><CardTitle>Reflection for {format(parseISO(displayedReflection.date), 'MMMM d, yyyy')}</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {questions.map(q => (
                           <div key={q.key}>
                                <h3 className="font-semibold text-lg">{q.prompt}</h3>
                                <p className="text-gray-700 mt-1 p-4 bg-gray-50 rounded-md">{displayedReflection.answers[q.key] || 'No answer.'}</p>
                           </div>
                        ))}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <Sun className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No reflection for this day</h3>
                        <p className="text-gray-600">Select today's date to create a new reflection.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}