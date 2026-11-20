import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  AlertCircle,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { BRAND_IMAGES } from '../constants/legal';

export function BrandImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-linear-to-br from-[#761D2D] via-[#8F2638] to-[#292323] p-6 text-center text-[#F8F4ED] ${className}`}
        aria-label={alt}
      >
        <BookOpen className="h-8 w-8 text-[#D5B77A]" />
        {fallbackTitle && (
          <span className="mt-2 font-display text-lg font-semibold tracking-tight text-[#F8F4ED]">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function RmCrestMark({ size = 40 }: { size?: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-lg bg-[#761D2D] text-[#D5B77A] font-display font-bold"
      >
        RM
      </div>
    );
  }
  return (
    <img
      src={BRAND_IMAGES.lionCrest}
      alt="RM HEAVEN Lion Crest Logo"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className="rounded-lg bg-white object-contain p-0.5 border border-[#D5B77A]/50 shrink-0 shadow-xs"
    />
  );
}

export function RmHeavenWordmark({
  variant = 'light',
  className = '',
  prefix = '',
  suffix = '',
}: {
  variant?: 'light' | 'dark';
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const rColor = variant === 'dark' ? 'text-[#F87171]' : 'text-[#DC2626]';
  const mColor = variant === 'dark' ? 'text-[#60A5FA]' : 'text-[#1D4ED8]';
  const heavenColor = variant === 'dark' ? 'text-[#F8F4ED]' : 'text-[#292323]';

  return (
    <span className={className}>
      {prefix ? <span className={heavenColor}>{prefix} </span> : null}
      <span className={rColor}>R</span>
      <span className={mColor}>M</span>{' '}
      <span className={heavenColor}>HEAVEN</span>
      {suffix ? <span className={heavenColor}> {suffix}</span> : null}
    </span>
  );
}

export function StatusLabel({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  let Icon = Clock;
  let colorClass = 'text-amber-800';

  if (
    ['approved', 'active', 'published', 'accepted', 'completed', 'evaluated', 'valid', 'open', 'resolved'].includes(
      normalized,
    )
  ) {
    Icon = CheckCircle2;
    colorClass = 'text-emerald-800';
  } else if (['rejected', 'suspended', 'revoked', 'closed', 'archived'].includes(normalized)) {
    Icon = XCircle;
    colorClass = 'text-[#B4434D]';
  } else if (['cancelled'].includes(normalized)) {
    Icon = Ban;
    colorClass = 'text-[#292323]/65';
  } else if (['under review', 'submitted', 'in progress', 'pending', 'applied'].includes(normalized)) {
    Icon = Clock;
    colorClass = 'text-amber-800';
  } else {
    Icon = AlertCircle;
    colorClass = 'text-[#761D2D]';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap ${colorClass}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{status}</span>
    </span>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#292323]/10 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F4ED] text-[#761D2D]">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold text-[#292323]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#292323]/70">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#761D2D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8F2638] transition-colors whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading records...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#292323]/10 bg-white px-6 py-14 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D5B77A] border-t-[#761D2D]" />
      <p className="mt-3 text-sm font-medium text-[#292323]/70">{message}</p>
    </div>
  );
}
