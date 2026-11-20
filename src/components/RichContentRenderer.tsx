import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import type { StudyNote } from '../types';

function renderInlineFormatting(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-semibold text-[#292323]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={`c-${keyIdx++}`}
          className="rounded bg-[#F8F4ED] border border-[#D5B77A]/35 px-1.5 py-0.5 text-[0.88em] font-mono text-[#761D2D]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-[#292323]/15 bg-[#292323] text-[#F8F4ED] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#211B1B] px-3.5 py-1.5 text-[11px] font-medium tracking-wider uppercase text-[#D5B77A]">
        <span>{lang || 'CODE'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-normal normal-case tracking-normal text-[#F8F4ED]/80 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3 w-3 text-[#D5B77A]" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 text-xs leading-relaxed font-mono text-[#F8F4ED]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function RichContentRenderer({
  content,
  className = '',
}: {
  content: string;
  className?: string;
}) {
  if (!content) return null;

  const segments: Array<{ type: 'text' | 'code'; content: string; lang?: string }> = [];
  const fenceRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'code', lang: match[1] || 'code', content: match[2].trimEnd() });
    lastIndex = fenceRegex.lastIndex;
  }
  if (lastIndex < content.length) {
    segments.push({ type: 'text', content: content.slice(lastIndex) });
  }

  return (
    <div className={`space-y-2.5 text-sm leading-relaxed text-[#292323]/90 ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === 'code') {
          return <CodeBlock key={`code-${idx}`} lang={seg.lang || 'code'} code={seg.content} />;
        }

        const lines = seg.content.split('\n');
        const elements: React.ReactNode[] = [];
        let bulletList: string[] = [];
        let orderedList: string[] = [];
        let tableLines: string[] = [];

        const flushBullets = (keyPrefix: string) => {
          if (bulletList.length === 0) return;
          elements.push(
            <ul key={`${keyPrefix}-ul`} className="ml-4 list-disc space-y-1.5 text-[#292323]/90 marker:text-[#761D2D]">
              {bulletList.map((item, bIdx) => (
                <li key={`${keyPrefix}-li-${bIdx}`} className="pl-1">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ul>,
          );
          bulletList = [];
        };

        const flushOrdered = (keyPrefix: string) => {
          if (orderedList.length === 0) return;
          elements.push(
            <ol key={`${keyPrefix}-ol`} className="ml-4 list-decimal space-y-2 text-[#292323]/90 marker:font-semibold marker:text-[#761D2D]">
              {orderedList.map((item, oIdx) => (
                <li key={`${keyPrefix}-oli-${oIdx}`} className="pl-1">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ol>,
          );
          orderedList = [];
        };

        const flushTable = (keyPrefix: string) => {
          if (tableLines.length === 0) return;
          const rows = tableLines
            .filter((row) => !/^\|[\s:-]+\|$/.test(row.replace(/\s+/g, '')))
            .map((row) =>
              row
                .split('|')
                .slice(1, -1)
                .map((cell) => cell.trim()),
            )
            .filter((cells) => cells.length > 0);

          if (rows.length > 0) {
            const [header, ...body] = rows;
            elements.push(
              <div key={`${keyPrefix}-tbl`} className="my-2 overflow-x-auto rounded-lg border border-[#D5B77A]/35">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F4ED] text-[#761D2D]">
                    <tr>
                      {header.map((col, cIdx) => (
                        <th key={cIdx} className="border-b border-[#D5B77A]/30 px-3 py-2 font-semibold">
                          {renderInlineFormatting(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292323]/10 bg-white">
                    {body.map((r, rIdx) => (
                      <tr key={rIdx}>
                        {r.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 text-[#292323]/85">
                            {renderInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>,
            );
          }
          tableLines = [];
        };

        const flushAll = (keyPrefix: string) => {
          flushBullets(keyPrefix);
          flushOrdered(keyPrefix);
          flushTable(keyPrefix);
        };

        lines.forEach((rawLine, lineIdx) => {
          const line = rawLine.trimEnd();
          const trimmed = line.trim();
          const prefix = `seg-${idx}-${lineIdx}`;

          if (!trimmed) {
            flushAll(prefix);
            return;
          }

          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            flushBullets(prefix);
            flushOrdered(prefix);
            tableLines.push(trimmed);
            return;
          }
          flushTable(prefix);

          if (trimmed.startsWith('### ')) {
            flushAll(prefix);
            elements.push(
              <h4 key={`h4-${idx}-${lineIdx}`} className="pt-2 text-sm font-semibold tracking-tight text-[#761D2D]">
                {renderInlineFormatting(trimmed.slice(4))}
              </h4>,
            );
            return;
          }

          if (trimmed.startsWith('## ')) {
            flushAll(prefix);
            elements.push(
              <h3 key={`h3-${idx}-${lineIdx}`} className="pt-2.5 text-base font-semibold tracking-tight text-[#292323]">
                {renderInlineFormatting(trimmed.slice(3))}
              </h3>,
            );
            return;
          }

          if (trimmed.startsWith('# ')) {
            flushAll(prefix);
            elements.push(
              <h2 key={`h2-${idx}-${lineIdx}`} className="pt-3 text-lg font-serif font-semibold text-[#761D2D]">
                {renderInlineFormatting(trimmed.slice(2))}
              </h2>,
            );
            return;
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            flushOrdered(prefix);
            bulletList.push(trimmed.slice(2));
            return;
          }

          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            flushBullets(prefix);
            orderedList.push(numMatch[2]);
            return;
          }

          flushAll(prefix);
          elements.push(
            <p key={`p-${idx}-${lineIdx}`} className="leading-relaxed">
              {renderInlineFormatting(trimmed)}
            </p>,
          );
        });

        flushAll(`seg-${idx}-end`);
        return <React.Fragment key={`seg-${idx}`}>{elements}</React.Fragment>;
      })}
    </div>
  );
}

export function StudyNoteViewer({
  note,
  moduleTitle,
  lessonTitle,
  isCompleted = false,
  onToggleComplete,
  onAskAiAboutNote,
  defaultShowQuestions = true,
}: {
  note: StudyNote;
  moduleTitle?: string;
  lessonTitle?: string;
  isCompleted?: boolean;
  onToggleComplete?: (note: StudyNote) => void;
  onAskAiAboutNote?: (note: StudyNote) => void;
  defaultShowQuestions?: boolean;
}) {
  const [showAnswers, setShowAnswers] = useState(defaultShowQuestions);

  useEffect(() => {
    setShowAnswers(defaultShowQuestions);
  }, [note.id, defaultShowQuestions]);

  const sections: Array<{
    number: string;
    label: string;
    body: string;
    accent?: 'ivory' | 'gold' | 'maroon' | 'warn';
  }> = [
    { number: '01', label: 'Introduction & Learning Objectives', body: note.topicIntroduction },
    { number: '02', label: 'Simple Explanation', body: note.simpleExplanation, accent: 'ivory' },
    { number: '03', label: 'Detailed Explanation', body: note.detailedExplanation },
    { number: '04', label: 'Important Definitions & Terminology', body: note.keyConcepts },
    { number: '05', label: 'Step-by-Step Explanation', body: note.stepByStepExplanation, accent: 'ivory' },
    { number: '06', label: 'Practical Examples & Code Walkthroughs', body: note.practicalExamples },
    { number: '07', label: 'Real-World Applications', body: note.realWorldApplications },
    { number: '08', label: 'Important Points to Remember', body: note.importantPoints, accent: 'gold' },
    { number: '09', label: 'Common Mistakes & How to Avoid Them', body: note.commonMistakes, accent: 'warn' },
    { number: '10', label: 'Summary & Revision Notes', body: note.summary, accent: 'maroon' },
  ];

  return (
    <article className="rounded-2xl border border-[#D5B77A]/35 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-[#D5B77A]/25 bg-[#F8F4ED] px-6 py-5 rounded-t-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#761D2D]">
              {note.sourceType === 'ai_assisted_admin'
                ? 'Official Study Note · Instructor Verified Draft'
                : 'Official Curriculum Study Note'}
              {moduleTitle ? ` · ${moduleTitle}` : ''}
              {lessonTitle ? ` · ${lessonTitle}` : ''}
            </p>
            <h3 className="mt-1 font-serif text-xl font-semibold text-[#292323] sm:text-2xl">{note.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onToggleComplete && (
              <button
                type="button"
                onClick={() => onToggleComplete(note)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                  isCompleted
                    ? 'border-[#761D2D] bg-[#761D2D] text-white hover:bg-[#8F2638]'
                    : 'border-[#D5B77A] bg-white text-[#292323] hover:bg-[#F8F4ED]'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5 text-[#D5B77A]" /> : <Circle className="h-3.5 w-3.5 text-[#761D2D]" />}
                {isCompleted ? 'Note Completed' : 'Mark Note Completed'}
              </button>
            )}
            {onAskAiAboutNote && (
              <button
                type="button"
                onClick={() => onAskAiAboutNote(note)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#761D2D]/25 bg-white px-3.5 py-2 text-xs font-semibold text-[#761D2D] transition hover:bg-[#761D2D] hover:text-white"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Explain with AI Tutor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 11 Structured Sections + Practice Lab */}
      <div className="divide-y divide-[#292323]/8 px-6 py-2">
        {sections.map((sec) => {
          const boxStyle =
            sec.accent === 'ivory'
              ? 'bg-[#F8F4ED]/65 rounded-xl p-4 my-3 border border-[#D5B77A]/20'
              : sec.accent === 'gold'
                ? 'bg-[#D5B77A]/10 rounded-xl p-4 my-3 border border-[#D5B77A]/35'
                : sec.accent === 'warn'
                  ? 'bg-[#B4434D]/5 rounded-xl p-4 my-3 border border-[#B4434D]/25'
                  : sec.accent === 'maroon'
                    ? 'bg-[#761D2D]/5 rounded-xl p-4 my-3 border border-[#761D2D]/20'
                    : 'py-5';

          return (
            <section key={sec.number} className={boxStyle}>
              <div className="mb-2 flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#761D2D]">{sec.number}</span>
                {sec.accent === 'gold' && <Lightbulb className="h-4 w-4 text-[#761D2D]" />}
                {sec.accent === 'warn' && <AlertTriangle className="h-4 w-4 text-[#B4434D]" />}
                {sec.accent === 'maroon' && <CheckCircle2 className="h-4 w-4 text-[#761D2D]" />}
                {!sec.accent && <BookOpen className="h-4 w-4 text-[#761D2D]/70" />}
                <h4 className="font-serif text-base font-semibold text-[#292323]">{sec.label}</h4>
              </div>
              <RichContentRenderer content={sec.body} />
            </section>
          );
        })}

        {/* Applied Practice Exercises / Studio Lab */}
        {note.domainSupplement && (
          <section className="my-4 rounded-xl border border-[#D5B77A]/40 bg-[#F8F4ED] p-5">
            <div className="mb-2.5 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#761D2D]" />
              <h4 className="font-serif text-base font-semibold text-[#761D2D]">
                Practice Exercises &amp; Applied Lab
              </h4>
            </div>
            <RichContentRenderer content={note.domainSupplement} />
          </section>
        )}

        {/* Section 11: Five Knowledge-Check Questions & Full Practice Bank */}
        <section className="py-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-[#761D2D]">11</span>
              <HelpCircle className="h-4 w-4 text-[#761D2D]" />
              <h4 className="font-serif text-base font-semibold text-[#292323]">
                Knowledge-Check Questions &amp; Practice Bank
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowAnswers((v) => !v)}
              className="rounded-lg border border-[#761D2D]/25 bg-[#F8F4ED] px-3 py-1 text-xs font-medium text-[#761D2D] transition hover:bg-[#761D2D] hover:text-white"
            >
              {showAnswers ? 'Hide Answers to Self-Test' : 'Show Questions & Answers'}
            </button>
          </div>
          {showAnswers ? (
            <div className="rounded-xl border border-[#D5B77A]/30 bg-[#F8F4ED]/50 p-4">
              <RichContentRenderer content={note.practiceQuestions} />
            </div>
          ) : (
            <p className="text-xs italic text-[#292323]/65">
              Self-test paused — click &ldquo;Show Questions &amp; Answers&rdquo; anytime to review all 5 Knowledge-Check Q&amp;As and additional exam practice questions.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
