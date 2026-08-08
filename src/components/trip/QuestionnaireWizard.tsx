'use client';
import { useState } from 'react';

export interface QuestionnaireAnswers {
  tripType: 'family' | 'couple' | 'friends' | 'solo' | 'business';
  travelers: number;
  budget: 'low' | 'mid' | 'high';
  interests: string[];
  pace: 'relaxed' | 'balanced' | 'packed';
  hasKids?: boolean;
  kidAges?: string;      // "4,7,12" — inspirado Mindtrip pattern
  accessibility?: boolean;
}

const INTERESTS_EN = [
  { key: 'nature', label: 'Nature & parks', emoji: '🏞️' },
  { key: 'food', label: 'Food & wine', emoji: '🍷' },
  { key: 'culture', label: 'History & culture', emoji: '🏛️' },
  { key: 'art', label: 'Art & museums', emoji: '🎨' },
  { key: 'beach', label: 'Beach & coast', emoji: '🏖️' },
  { key: 'adventure', label: 'Adventure & outdoors', emoji: '🥾' },
  { key: 'nightlife', label: 'Nightlife & music', emoji: '🎶' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { key: 'photography', label: 'Photography', emoji: '📸' },
  { key: 'wellness', label: 'Wellness & spa', emoji: '🧖' }
];

const INTERESTS_ES = [
  { key: 'nature', label: 'Naturaleza y parques', emoji: '🏞️' },
  { key: 'food', label: 'Comida y vino', emoji: '🍷' },
  { key: 'culture', label: 'Historia y cultura', emoji: '🏛️' },
  { key: 'art', label: 'Arte y museos', emoji: '🎨' },
  { key: 'beach', label: 'Playa y costa', emoji: '🏖️' },
  { key: 'adventure', label: 'Aventura y aire libre', emoji: '🥾' },
  { key: 'nightlife', label: 'Vida nocturna y música', emoji: '🎶' },
  { key: 'shopping', label: 'Compras', emoji: '🛍️' },
  { key: 'photography', label: 'Fotografía', emoji: '📸' },
  { key: 'wellness', label: 'Bienestar y spa', emoji: '🧖' }
];

const TRIP_TYPES_EN = [
  { key: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { key: 'couple', label: 'Couple', emoji: '💑' },
  { key: 'friends', label: 'Friends', emoji: '👯' },
  { key: 'solo', label: 'Solo', emoji: '🧳' },
  { key: 'business', label: 'Business', emoji: '💼' }
];
const TRIP_TYPES_ES = [
  { key: 'family', label: 'Familia', emoji: '👨‍👩‍👧‍👦' },
  { key: 'couple', label: 'Pareja', emoji: '💑' },
  { key: 'friends', label: 'Amigos', emoji: '👯' },
  { key: 'solo', label: 'Solo', emoji: '🧳' },
  { key: 'business', label: 'Trabajo', emoji: '💼' }
];

interface Props {
  locale: 'en' | 'es';
  onComplete: (answers: QuestionnaireAnswers, promptSuffix: string) => void;
  onSkip: () => void;
}

export function QuestionnaireWizard({ locale, onComplete, onSkip }: Props){
  const isEs = locale === 'es';
  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState<QuestionnaireAnswers['tripType']>('couple');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState<QuestionnaireAnswers['budget']>('mid');
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState<QuestionnaireAnswers['pace']>('balanced');
  const [hasKids, setHasKids] = useState(false);
  const [kidAges, setKidAges] = useState('');
  const [accessibility, setAccessibility] = useState(false);

  const types = isEs ? TRIP_TYPES_ES : TRIP_TYPES_EN;
  const ints = isEs ? INTERESTS_ES : INTERESTS_EN;

  const toggleInterest = (key: string) => {
    setInterests(prev => prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]);
  };

  const buildPromptSuffix = (): string => {
    const parts: string[] = [];
    const typeLabel = types.find(t => t.key === tripType)?.label || tripType;
    parts.push(isEs ? `Viaje en ${typeLabel.toLowerCase()}` : `${typeLabel} trip`);
    parts.push(isEs ? `${travelers} viajero(s)` : `${travelers} traveler(s)`);
    if(tripType === 'family' && hasKids){
      const agesTxt = kidAges.trim() ? ` (${isEs ? 'edades' : 'ages'} ${kidAges.trim()})` : '';
      parts.push(isEs ? `con niños${agesTxt} — prioriza paradas kid-friendly, tiempos de manejo cortos, hoteles con alberca` : `with kids${agesTxt} — prioritize kid-friendly stops, short drives, hotels with pool`);
    }
    if(accessibility) parts.push(isEs ? 'requiere accesibilidad (silla de ruedas / movilidad reducida)' : 'accessibility required (wheelchair / reduced mobility)');

    const budgetLabels = isEs
      ? { low: 'presupuesto económico', mid: 'presupuesto medio', high: 'presupuesto alto' }
      : { low: 'budget-friendly', mid: 'mid budget', high: 'high budget' };
    parts.push(budgetLabels[budget]);

    if(interests.length > 0){
      const intLabels = interests.map(k => ints.find(i => i.key === k)?.label || k).join(', ');
      parts.push(isEs ? `intereses: ${intLabels}` : `interests: ${intLabels}`);
    }

    const paceLabels = isEs
      ? { relaxed: 'ritmo relajado', balanced: 'ritmo balanceado', packed: 'agenda intensa' }
      : { relaxed: 'relaxed pace', balanced: 'balanced pace', packed: 'packed schedule' };
    parts.push(paceLabels[pace]);

    return `. ${parts.join(', ')}.`;
  };

  const handleComplete = () => {
    onComplete({ tripType, travelers, budget, interests, pace, hasKids, kidAges, accessibility }, buildPromptSuffix());
  };

  const totalSteps = 4;
  const progressPct = (step / totalSteps) * 100;

  return (
    <div className="rounded-card border border-ocean-200 bg-gradient-to-br from-ocean-400/5 via-white to-coral-50 p-6 shadow-card md:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-ocean-700">
            {isEs ? `Paso ${step} de ${totalSteps}` : `Step ${step} of ${totalSteps}`}
          </span>
          <button type="button" onClick={onSkip} className="text-xs font-medium text-ink-500 hover:text-ink-800">
            {isEs ? 'Saltar cuestionario →' : 'Skip questionnaire →'}
          </button>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div className="h-full bg-gradient-to-r from-ocean-500 to-coral-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {step === 1 && (
        <div>
          <h3 className="mb-1 font-display text-xl font-semibold text-ink-900">
            {isEs ? '¿Con quién viajas?' : 'Who are you traveling with?'}
          </h3>
          <p className="mb-5 text-sm text-ink-500">
            {isEs ? 'Ayuda a la IA a recomendar paradas apropiadas.' : 'Helps AI recommend appropriate stops.'}
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {types.map(t => (
              <button
                key={t.key} type="button"
                onClick={() => setTripType(t.key as QuestionnaireAnswers['tripType'])}
                className={`flex flex-col items-center gap-2 rounded-card border-2 px-3 py-4 transition ${
                  tripType === t.key
                    ? 'border-ocean-500 bg-ocean-50 shadow-glow'
                    : 'border-ink-100 bg-white hover:border-ocean-200 hover:bg-ocean-50/30'
                }`}
              >
                <span className="text-2xl" aria-hidden>{t.emoji}</span>
                <span className="text-sm font-semibold text-ink-800">{t.label}</span>
              </button>
            ))}
          </div>
          {tripType === 'family' && (
            <div className="mt-4 space-y-3 rounded-card border border-ocean-100 bg-ocean-50/30 p-4">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" checked={hasKids} onChange={(e) => setHasKids(e.target.checked)} className="h-4 w-4" />
                {isEs ? 'Con niños pequeños' : 'Traveling with kids'}
              </label>
              {hasKids && (
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                    {isEs ? 'Edades de los niños (separadas por coma)' : 'Kid ages (comma-separated)'}
                  </label>
                  <input
                    type="text" value={kidAges}
                    onChange={(e) => setKidAges(e.target.value.slice(0, 30))}
                    placeholder={isEs ? 'Ej. 4, 7, 12' : 'e.g. 4, 7, 12'}
                    className="w-full rounded-pill border border-ink-200 bg-white px-4 py-2 text-sm text-ink-800 outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100"
                  />
                  <p className="mt-1 text-[11px] text-ink-500">
                    {isEs ? 'IA sugerirá paradas apropiadas por edad (parques, aquarios, museos interactivos)' : 'AI will suggest age-appropriate stops (parks, aquariums, interactive museums)'}
                  </p>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" checked={accessibility} onChange={(e) => setAccessibility(e.target.checked)} className="h-4 w-4" />
                {isEs ? 'Necesito accesibilidad (silla de ruedas / movilidad reducida)' : 'Accessibility needed (wheelchair / reduced mobility)'}
              </label>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button onClick={() => setStep(2)} className="rounded-pill bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
              {isEs ? 'Siguiente →' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="mb-1 font-display text-xl font-semibold text-ink-900">
            {isEs ? '¿Cuántos viajeros?' : 'How many travelers?'}
          </h3>
          <p className="mb-5 text-sm text-ink-500">
            {isEs ? 'Afecta hoteles, restaurantes y presupuesto estimado.' : 'Affects hotels, restaurants and budget estimate.'}
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="grid h-14 w-14 place-items-center rounded-full border-2 border-ink-200 text-2xl font-semibold text-ink-700 hover:border-coral-500 hover:text-coral-600" aria-label="Menos">−</button>
            <div className="min-w-[8ch] text-center">
              <div className="font-display text-6xl font-semibold tabular-nums text-ink-900">{travelers}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-500">{isEs ? 'personas' : 'people'}</div>
            </div>
            <button onClick={() => setTravelers(Math.min(20, travelers + 1))} className="grid h-14 w-14 place-items-center rounded-full border-2 border-ink-200 text-2xl font-semibold text-ink-700 hover:border-coral-500 hover:text-coral-600" aria-label="Más">+</button>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setStep(1)} className="text-sm font-medium text-ink-500 hover:text-ink-800">← {isEs ? 'Atrás' : 'Back'}</button>
            <button onClick={() => setStep(3)} className="rounded-pill bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
              {isEs ? 'Siguiente →' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="mb-1 font-display text-xl font-semibold text-ink-900">
            {isEs ? '¿Qué te gusta hacer?' : 'What do you like to do?'}
          </h3>
          <p className="mb-5 text-sm text-ink-500">
            {isEs ? 'Elige 2-5 intereses. La IA prioriza paradas alineadas.' : 'Pick 2-5 interests. AI prioritizes aligned stops.'}
          </p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {ints.map(i => (
              <button
                key={i.key} type="button"
                onClick={() => toggleInterest(i.key)}
                className={`flex items-center gap-2.5 rounded-pill border-2 px-4 py-2.5 text-sm font-semibold transition ${
                  interests.includes(i.key)
                    ? 'border-coral-500 bg-coral-50 text-coral-700 shadow-glow'
                    : 'border-ink-100 bg-white text-ink-700 hover:border-coral-200'
                }`}
              >
                <span aria-hidden>{i.emoji}</span>
                <span>{i.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-2 text-right text-xs text-ink-400">
            {interests.length} {isEs ? 'seleccionados' : 'selected'}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setStep(2)} className="text-sm font-medium text-ink-500 hover:text-ink-800">← {isEs ? 'Atrás' : 'Back'}</button>
            <button onClick={() => setStep(4)} className="rounded-pill bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
              {isEs ? 'Siguiente →' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="mb-1 font-display text-xl font-semibold text-ink-900">
            {isEs ? 'Presupuesto y ritmo' : 'Budget and pace'}
          </h3>
          <p className="mb-5 text-sm text-ink-500">
            {isEs ? 'Últimos ajustes antes de generar tu viaje.' : 'Final touches before generating your trip.'}
          </p>

          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
              {isEs ? 'Presupuesto por persona' : 'Budget per person'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: 'low', emoji: '💵', label: isEs ? 'Económico' : 'Budget', sub: isEs ? '$50-100/día' : '$50-100/day' },
                { k: 'mid', emoji: '💰', label: isEs ? 'Medio' : 'Mid', sub: isEs ? '$100-250/día' : '$100-250/day' },
                { k: 'high', emoji: '💎', label: isEs ? 'Alto' : 'High', sub: isEs ? '$250+/día' : '$250+/day' }
              ].map(b => (
                <button
                  key={b.k} type="button"
                  onClick={() => setBudget(b.k as QuestionnaireAnswers['budget'])}
                  className={`flex flex-col items-center gap-1 rounded-card border-2 px-3 py-3 transition ${
                    budget === b.k ? 'border-emerald-500 bg-emerald-50' : 'border-ink-100 bg-white hover:border-emerald-200'
                  }`}
                >
                  <span className="text-2xl" aria-hidden>{b.emoji}</span>
                  <span className="text-sm font-semibold text-ink-800">{b.label}</span>
                  <span className="text-[10px] font-medium text-ink-500">{b.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
              {isEs ? 'Ritmo del viaje' : 'Trip pace'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: 'relaxed', label: isEs ? '🛋️ Relajado' : '🛋️ Relaxed' },
                { k: 'balanced', label: isEs ? '⚖️ Balanceado' : '⚖️ Balanced' },
                { k: 'packed', label: isEs ? '⚡ Intenso' : '⚡ Packed' }
              ].map(p => (
                <button
                  key={p.k} type="button"
                  onClick={() => setPace(p.k as QuestionnaireAnswers['pace'])}
                  className={`rounded-pill border-2 py-2 text-xs font-semibold transition ${
                    pace === p.k ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-ink-100 bg-white text-ink-700 hover:border-amber-200'
                  }`}
                >{p.label}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(3)} className="text-sm font-medium text-ink-500 hover:text-ink-800">← {isEs ? 'Atrás' : 'Back'}</button>
            <button onClick={handleComplete} className="rounded-pill bg-gradient-to-r from-ocean-500 to-coral-500 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:shadow-lg">
              {isEs ? '✨ Generar mi viaje' : '✨ Generate my trip'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
