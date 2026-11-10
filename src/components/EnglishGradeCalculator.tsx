'use client';

import { useMemo, useState } from 'react';
import styles from './EnglishGradeCalculator.module.css';

const initialPoints = {
  'A1.1': 7, 'A1.2': 8, 'A2.1': 11, 'A2.2': 12,
  'B1.1': 15, 'B1.2': 16, 'B2.1': 19, 'B2.2': 20,
} as const;

const finalPoints = {
  'A1.1': 15, 'A1.2': 17, 'A2.1': 20, 'A2.2': 22,
  'B1.1': 25, 'B1.2': 27, 'B2.1': 30, 'B2.2': 32, 'C1': 35,
} as const;

type InitialLevel = keyof typeof initialPoints;
type FinalLevel = keyof typeof finalPoints;

const finalLevels = Object.keys(finalPoints) as FinalLevel[];
const initialLevels = Object.keys(initialPoints) as InitialLevel[];

const letterThresholds = [
  { grade: 'A', minimum: 94 },
  { grade: 'A-', minimum: 90 },
  { grade: 'B+', minimum: 86 },
  { grade: 'B', minimum: 80 },
  { grade: 'B-', minimum: 76 },
  { grade: 'C+', minimum: 70 },
  { grade: 'C', minimum: 66 },
  { grade: 'C-', minimum: 60 },
  { grade: 'D+', minimum: 57 },
  { grade: 'D', minimum: 55 },
  { grade: 'D-', minimum: 40 },
] as const;

const mainOrder: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };

function mainLevel(level: string) {
  return level.startsWith('C') ? 'C1' : level.slice(0, 2);
}

/** Intentionally preserves the original grading rule: only direct B2 -> C1 earns eight points. */
function progressionBonus(initial: string, final: string): number {
  const from = mainLevel(initial);
  const to = mainLevel(final);
  if (from === 'B2' && to === 'C1') return 8;
  const difference = mainOrder[to] - mainOrder[from];
  return difference > 0 ? difference * 5 : 0;
}

function letterGrade(total: number): string {
  return letterThresholds.find(item => total >= item.minimum)?.grade ?? 'F';
}

function validMark(mark: string): boolean {
  if (mark.trim() === '') return false;
  const number = Number(mark);
  return Number.isFinite(number) && number >= 0 && number <= 100;
}

function format(number: number): string {
  return number.toFixed(2);
}

function StepHeader({ number, title, detail }: { number: string; title: string; detail: string }) {
  return <div className={styles.stepHead}>
    <span className={styles.stepNumber} aria-hidden="true">{number}</span>
    <div><h2>{title}</h2><p>{detail}</p></div>
  </div>;
}

function LevelSelect<T extends string>({ id, label, placeholder, value, levels, scores, onChange }: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  levels: readonly T[];
  scores: Record<T, number>;
  onChange: (value: string) => void;
}) {
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={event => onChange(event.target.value)} required>
      <option value="">{placeholder}</option>
      {levels.map(level => <option value={level} key={level}>{level}</option>)}
    </select>
    {value && <span className={styles.contribution}>مساهمة الامتحان: <b dir="ltr">{format(scores[value as T])} / {id === 'english-initial' ? '20' : '35'}</b> نقطة</span>}
  </div>;
}

export function EnglishGradeCalculator() {
  const [initial, setInitial] = useState('');
  const [marks, setMarks] = useState(['', '', '']);
  const [final, setFinal] = useState('');
  const [target, setTarget] = useState('');

  const marksValid = marks.every(validMark);
  const allReady = Boolean(initial && final && marksValid);
  const courses = useMemo(() => marks.map(mark => validMark(mark) ? Number(mark) * 0.15 : 0), [marks]);
  const coursesTotal = courses.reduce((sum, value) => sum + value, 0);

  const result = useMemo(() => {
    if (!allReady) return null;
    const initialScore = initialPoints[initial as InitialLevel];
    const finalScore = finalPoints[final as FinalLevel];
    const bonus = progressionBonus(initial, final);
    const total = initialScore + coursesTotal + finalScore + bonus;
    return { initialScore, finalScore, bonus, total, grade: letterGrade(total), accepted: total >= 55 || bonus > 0 };
  }, [allReady, initial, final, coursesTotal]);

  const targetResult = useMemo(() => {
    if (!target) return null;
    if (!initial || !marksValid) return { status: 'incomplete' as const };
    const required = Number(target);
    const initialScore = initialPoints[initial as InitialLevel];
    const options = finalLevels.map(level => ({
      level,
      total: initialScore + coursesTotal + finalPoints[level] + progressionBonus(initial, level),
    }));
    const first = options.find(option => option.total >= required);
    if (!first) return { status: 'unreachable' as const, total: Math.max(...options.map(option => option.total)) };
    if (options[0].total >= required) return { status: 'already' as const, total: options[0].total };
    return { status: 'found' as const, level: first.level, total: first.total };
  }, [target, initial, marksValid, coursesTotal]);

  function reset() {
    setInitial('');
    setMarks(['', '', '']);
    setFinal('');
    setTarget('');
  }

  const breakdown = result ? [
    { title: 'التصنيفي الأول', value: result.initialScore, maximum: 20 },
    ...courses.map((value, index) => ({ title: 'علامة المستوى ' + ['الأول', 'الثاني', 'الثالث'][index], value, maximum: 15 })),
    { title: 'التصنيفي النهائي', value: result.finalScore, maximum: 35 },
    { title: 'مكافأة الانتقال', value: result.bonus, maximum: result.bonus },
  ] : [];

  return <div className={styles.shell} dir="rtl">
    <header className={styles.intro}>
      <div className={styles.introTop}><span className={styles.eyebrow}>أدوات النخبة الأكاديمية</span><span className={styles.courseTag}>الجامعة الأردنية</span></div>
      <h1 className="sr-only">حاسبة علامة اللغة الإنجليزية</h1>
      <div className={styles.weights} aria-label="أوزان العلامات">
        <span>التصنيفي الأول <b>20%</b></span>
        <span>المستويات الثلاثة <b>45%</b></span>
        <span>التصنيفي النهائي <b>35%</b></span>
      </div>
    </header>

    <div className={styles.columns}>
      <div className={styles.formColumn}>
        <section className={styles.panel} aria-label="نتيجة الامتحان التصنيفي الأول">
          <StepHeader number="01" title="الامتحان التصنيفي الأول" detail="اختر المستوى الذي حصلت عليه في بداية الدراسة — وزنه 20 نقطة." />
          <LevelSelect id="english-initial" label="نتيجة الامتحان الأول" placeholder="اختر المستوى" value={initial} onChange={setInitial} levels={initialLevels} scores={initialPoints} />
        </section>

        <section className={styles.panel} aria-label="علامات مستويات اللغة">
          <StepHeader number="02" title="علامات المستويات الثلاثة" detail="أدخل العلامات من 100. جميع المستويات مطلوبة، وكل مستوى يساوي 15 نقطة." />
          <div className={styles.marksGrid}>
            {['الأول', 'الثاني', 'الثالث'].map((name, index) => <div className={styles.field} key={name}>
              <label htmlFor={'english-mark-' + index}>المستوى {name} <span className={styles.required}>*</span></label>
              <input
                id={'english-mark-' + index}
                type="number" inputMode="decimal" min="0" max="100" step="any"
                placeholder="0 – 100"
                required
                value={marks[index]}
                aria-invalid={marks[index] !== '' && !validMark(marks[index])}
                onChange={event => {
                  const value = event.target.value;
                  setMarks(previous => previous.map((old, i) => i === index ? value : old));
                }}
              />
              {marks[index] !== '' && (validMark(marks[index])
                ? <span className={styles.contribution}><b dir="ltr">{format(courses[index])} / 15</b> نقطة</span>
                : <span className={styles.fieldError} role="alert">أدخل علامة من 0 إلى 100.</span>)}
            </div>)}
          </div>
          <div className={styles.courseSummary}>مجموع نقاط المستويات <b dir="ltr">{format(coursesTotal)} / 45</b></div>
        </section>

        <section className={styles.panel} aria-label="نتيجة الامتحان النهائي">
          <StepHeader number="03" title="الامتحان التصنيفي النهائي" detail="اختر المستوى النهائي — وزنه 35 نقطة." />
          <LevelSelect id="english-final" label="نتيجة الامتحان النهائي" placeholder="اختر المستوى" value={final} onChange={setFinal} levels={finalLevels} scores={finalPoints} />
        </section>
        <button type="button" className={styles.reset} onClick={reset}>إعادة تعيين الحاسبة</button>
      </div>

      <div className={styles.resultColumn}>
        <section className={styles.results} aria-label="نتيجتك المتوقعة" aria-live="polite">
          <div className={styles.resultHead}><span>النتيجة المتوقعة</span><span className={styles.resultPill}>مجموع العلامات</span></div>
          <div className={styles.heroNumber}><strong dir="ltr">{result ? format(result.total) : '—'}</strong><span>نقطة</span>{result && <b>{result.grade}</b>}</div>
          {result ? <>
            <div className={styles.breakdown}>
              {breakdown.map(item => <div className={styles.breakdownRow} key={item.title}><span>{item.title}</span><b dir="ltr">{format(item.value)} / {item.maximum}</b></div>)}
            </div>
            {!result.accepted && <p className={styles.statusWarning}>
              المجموع أقل من 55% ولم يتحقق شرط الانتقال بين المستويات الرئيسية؛ راجع مركز اللغات لتأكيد طريقة احتساب العلامة.
            </p>}
          </> : <p className={styles.emptyResult}>أدخل مستوى التصنيفي الأول والنهائي وعلامات المستويات الثلاثة لعرض النتيجة والتقدير.</p>}
        </section>

        <section className={styles.targetPanel} aria-label="حساب المستوى المطلوب">
          <div className={styles.targetTitle}><span className={styles.targetIcon} aria-hidden="true">?</span><div><h2>كم تحتاج في النهائي؟</h2><p>اعرف أقل مستوى تصنيفي نهائي يحقق التقدير الذي تريده.</p></div></div>
          <div className={styles.field}>
            <label htmlFor="english-target">التقدير المستهدف</label>
            <select id="english-target" value={target} onChange={event => setTarget(event.target.value)}>
              <option value="">اختر التقدير</option>
              {letterThresholds.map(item => <option key={item.grade} value={item.minimum}>{item.grade} — {item.minimum} نقطة فأكثر</option>)}
            </select>
          </div>
          {targetResult && <div className={styles.targetResult} role="status" aria-live="polite">
            {targetResult.status === 'incomplete' && <p>أدخل التصنيفي الأول وعلامات المستويات الثلاثة أولًا.</p>}
            {targetResult.status === 'already' && <p>أنت ضمن التقدير المطلوب حتى لو حققت أدنى نتيجة ممكنة في الامتحان النهائي.</p>}
            {targetResult.status === 'found' && <p>أقل مستوى تحتاجه هو <strong dir="ltr">{targetResult.level}</strong> أو أعلى. <small>المجموع المتوقع: {format(targetResult.total)} نقطة</small></p>}
            {targetResult.status === 'unreachable' && <p>لا يمكن تحقيق هذا التقدير بالامتحان النهائي وحده. <small>أعلى مجموع ممكن: {format(targetResult.total)} نقطة</small></p>}
          </div>}
        </section>

      </div>
    </div>
  </div>;
}
