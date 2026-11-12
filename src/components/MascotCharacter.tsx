import React, { useState } from 'react';
import { Eye, Shield, Sparkles, X, Laptop, ThumbsUp, CheckCircle2 } from 'lucide-react';

interface MascotCharacterProps {
  variant?: 'hero' | 'welcome' | 'dashboard' | 'avatar' | 'login' | 'empty' | 'success' | 'executive';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showInspectionPrompt?: boolean;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  variant = 'hero',
  className = '',
  size = 'lg',
  showInspectionPrompt = false
}) => {
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);
  const [activePose, setActivePose] = useState<'executive' | 'formal'>('executive');

  // Character Assets:
  // 1. Confident Lion Executive with Laptop (Primary character uploaded by user)
  const executiveSrc = '/assets/aistudio/Confident_Lion_Executive_with_Laptop_2cf6151e.png';
  // 2. 360 Model Sheet (Ambassador turnaround reference)
  const modelSheetSrc = '/assets/mascot/lion_360_model_sheet.png';

  // AVATAR VARIANT
  if (variant === 'avatar') {
    return (
      <div 
        className={`relative rounded-full overflow-hidden border-2 border-[#D6B878] bg-[#F8F3EE] shadow-sm shrink-0 ${
          size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-14 h-14'
        } ${className}`}
        title="RM Heaven Executive Tech Mentor"
      >
        <img
          src={executiveSrc}
          alt="RM Heaven Lion Executive"
          className="w-full h-full object-cover"
          style={{
            objectPosition: '50% 8%',
            transform: 'scale(1.8)'
          }}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('lion_executive')) {
              target.src = '/assets/mascot/lion_executive_laptop.png';
            }
          }}
        />
      </div>
    );
  }

  // DASHBOARD VARIANT
  if (variant === 'dashboard') {
    return (
      <div className={`flex items-center gap-4 p-4 bg-gradient-to-r from-[#F8F3EE] via-white to-[#FCFAF8] border border-[#EAE1DD] rounded-2xl shadow-sm ${className}`}>
        <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-[#D6B878] bg-white shrink-0 shadow-sm flex items-center justify-center group cursor-pointer"
          onClick={() => setIs360ModalOpen(true)}
          title="Click to view full character model sheet"
        >
          <img
            src={executiveSrc}
            alt="RM Heaven Executive Lion Mentor with Laptop"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{
              objectPosition: '50% 12%'
            }}
          />
          <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-[#D6B878] px-1 py-0.2 rounded font-mono">
            Mentor
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#800020] bg-[#EAD5D8]/50 px-2 py-0.5 rounded flex items-center gap-1">
              <Laptop className="w-3 h-3 text-[#800020]" />
              <span>Technical Executive Mentor</span>
            </span>
            <button
              onClick={() => setIs360ModalOpen(true)}
              className="text-[11px] text-[#702D3D] hover:underline flex items-center gap-1 font-medium"
            >
              <Eye className="w-3 h-3 text-[#D6B878]" />
              <span>360° Specs</span>
            </button>
          </div>
          <p className="text-xs text-[#393333] leading-relaxed">
            Hands-on code execution, verified project capstones, and uncompromising industry professionalism.
          </p>
        </div>

        {/* 360 Inspection Modal */}
        {is360ModalOpen && (
          <Mascot360Modal 
            onClose={() => setIs360ModalOpen(false)} 
            modelSheetSrc={modelSheetSrc} 
            executiveSrc={executiveSrc} 
          />
        )}
      </div>
    );
  }

  // LOGIN VARIANT
  if (variant === 'login') {
    return (
      <div className={`relative flex flex-col items-center text-center p-6 bg-gradient-to-b from-[#F8F3EE] to-white border border-[#EAE1DD] rounded-3xl shadow-sm ${className}`}>
        <div className="relative w-40 h-56 rounded-2xl overflow-hidden border-2 border-[#D6B878] bg-white shadow-md mb-4 group cursor-pointer"
          onClick={() => setIs360ModalOpen(true)}
          title="Click to inspect character details"
        >
          <img
            src={executiveSrc}
            alt="Confident Lion Executive with Laptop"
            className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-[#702D3D] text-white p-1 rounded-full shadow-xs">
            <ThumbsUp className="w-3 h-3 text-[#D6B878]" />
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#800020] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D6B878]" />
          <span>Executive Tech Mentor</span>
        </span>
        <h4 className="text-base font-bold text-[#393333] mt-1 font-heading">
          Ready to Level Up?
        </h4>
        <p className="text-xs text-[#817779] mt-1 max-w-xs leading-relaxed">
          Log in with your institutional credentials to continue your hands-on coding modules and marketing analytics.
        </p>
        <button
          onClick={() => setIs360ModalOpen(true)}
          className="mt-3 text-[11px] font-medium text-[#702D3D] hover:text-[#800020] flex items-center gap-1.5 underline underline-offset-2"
        >
          <Eye className="w-3.5 h-3.5 text-[#D6B878]" />
          <span>Inspect 360° Mascot Sheet</span>
        </button>

        {is360ModalOpen && (
          <Mascot360Modal 
            onClose={() => setIs360ModalOpen(false)} 
            modelSheetSrc={modelSheetSrc} 
            executiveSrc={executiveSrc} 
          />
        )}
      </div>
    );
  }

  // SUCCESS VARIANT (Thumbs-up celebration)
  if (variant === 'success') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
        <div className="relative w-32 h-44 rounded-2xl overflow-hidden border-2 border-[#D6B878] bg-white shadow-md mb-3">
          <img
            src={executiveSrc}
            alt="Confident Lion Executive with Laptop giving Thumbs Up"
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8F3EE] border border-[#EAE1DD] rounded-full text-xs font-semibold text-[#800020]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B878]" />
          <span>Approved & Ready</span>
        </div>
      </div>
    );
  }

  // EXECUTIVE VARIANT (Full length standalone)
  if (variant === 'executive') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <div className="relative max-w-xs w-full bg-white/95 backdrop-blur-xs border-2 border-[#D6B878]/60 rounded-3xl p-5 shadow-lg text-center">
          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#F8F3EE] to-white mb-3">
            <img
              src={executiveSrc}
              alt="Confident Lion Executive with Laptop"
              className="w-full h-full object-contain object-bottom hover:scale-105 transition-transform duration-500"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#800020]">
            RM Heaven Executive Mentor
          </span>
          <p className="text-xs text-[#817779] mt-1">
            Industry projects · Laptop in hand · Real-world ready
          </p>
        </div>
      </div>
    );
  }

  // DEFAULT / HERO VARIANT: Prominently featured on Homepage Hero
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Gentle Luxury Halo Ring */}
      <div className="absolute w-80 h-96 sm:w-[420px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#D6B878]/25 via-[#F8F3EE] to-[#EAD5D8]/35 blur-3xl -z-10 pointer-events-none" />

      {/* Main Mascot Display Card */}
      <div className="relative bg-white/95 backdrop-blur-md border-2 border-[#EAE1DD] rounded-3xl p-5 sm:p-7 shadow-xl text-center max-w-sm sm:max-w-md w-full transition-all duration-500 hover:shadow-2xl hover:border-[#D6B878]">
        
        {/* Character Pose Switcher Tabs */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-[#F8F3EE] rounded-xl border border-[#EAE1DD] mb-4 text-xs font-semibold">
          <button
            onClick={() => setActivePose('executive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activePose === 'executive'
                ? 'bg-white text-[#800020] shadow-xs font-bold'
                : 'text-[#817779] hover:text-[#393333]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-[#800020]" />
            <span>Executive Mentor</span>
          </button>
          <button
            onClick={() => setActivePose('formal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activePose === 'formal'
                ? 'bg-white text-[#800020] shadow-xs font-bold'
                : 'text-[#817779] hover:text-[#393333]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#D6B878]" />
            <span>Formal Ambassador</span>
          </button>
        </div>

        {/* Character Viewport */}
        {activePose === 'executive' ? (
          <div 
            className="relative h-80 sm:h-96 w-full mx-auto rounded-2xl overflow-hidden border-2 border-[#D6B878]/60 bg-gradient-to-b from-[#F8F3EE] via-white to-[#F8F3EE]/50 shadow-inner mb-4 group cursor-pointer"
            onClick={() => setIs360ModalOpen(true)}
            title="Click to inspect full character details & model sheet"
          >
            <img
              src={executiveSrc}
              alt="Confident Lion Executive with Laptop: Tailored Suit, White Shirt, Laptop, Thumbs Up & Sneakers"
              className="w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
            />
            {/* Floating Badges */}
            <div className="absolute top-3 left-3 bg-[#800020] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1 uppercase tracking-wider">
              <Laptop className="w-3 h-3 text-[#D6B878]" />
              <span>Tech Mentor</span>
            </div>
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#393333] border border-[#EAE1DD] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <ThumbsUp className="w-3 h-3 text-[#800020]" />
              <span>Career Ready</span>
            </div>
            <div className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-black text-white text-[10px] px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5 shadow transition-colors">
              <Eye className="w-3.5 h-3.5 text-[#D6B878]" />
              <span>Inspect Character</span>
            </div>
          </div>
        ) : (
          <div 
            className="relative h-80 sm:h-96 w-full mx-auto rounded-2xl overflow-hidden border-2 border-[#D6B878]/60 bg-gradient-to-b from-[#F8F3EE] to-white shadow-inner mb-4 group cursor-pointer"
            onClick={() => setIs360ModalOpen(true)}
            title="Click to view 360° Character Turnaround Sheet"
          >
            <img
              src={modelSheetSrc}
              alt="Official Lion Mascot: Golden-Orange Mane, Sunglasses, Formal Black Suit, White Shirt, Red Tie"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{
                objectPosition: '16% 82%',
                transform: 'scale(1.9)'
              }}
            />
            <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[10px] px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5 shadow">
              <Eye className="w-3.5 h-3.5 text-[#D6B878]" />
              <span>360° Sheet</span>
            </div>
          </div>
        )}

        {/* Mascot Attribution & Role */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#800020] block">
            {activePose === 'executive' ? 'Technical Executive Mentor' : 'Official Academic Ambassador'}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-[#393333] font-heading">
            {activePose === 'executive' ? 'Practical Coding & Career Confidence' : 'Dignity · Discipline · Academic Excellence'}
          </h3>
          <p className="text-xs text-[#817779] leading-relaxed pt-0.5">
            {activePose === 'executive'
              ? 'Guiding students through real-world software engineering, practical marketing attribution, and verified corporate internships.'
              : 'Representing academic seriousness, institutional decorum, and high-impact technical mastery.'}
          </p>
        </div>

        {/* Action Button: Inspect Full Character Dossier */}
        <div className="mt-4 pt-3 border-t border-[#EAE1DD] flex items-center justify-between text-xs text-[#817779]">
          <span className="font-mono text-[11px] text-[#702D3D]">
            {activePose === 'executive' ? 'Equipped: Tech Laptop' : 'Attire: Tailored Suit & Tie'}
          </span>
          <button
            onClick={() => setIs360ModalOpen(true)}
            className="inline-flex items-center gap-1.5 font-semibold text-[#800020] hover:text-[#702D3D] hover:underline"
          >
            <Eye className="w-3.5 h-3.5 text-[#D6B878]" />
            <span>Character Details & 360°</span>
          </button>
        </div>
      </div>

      {/* 360 Inspection Modal */}
      {is360ModalOpen && (
        <Mascot360Modal 
          onClose={() => setIs360ModalOpen(false)} 
          modelSheetSrc={modelSheetSrc} 
          executiveSrc={executiveSrc} 
        />
      )}
    </div>
  );
};

// Sub-component: Character Inspection Modal (includes both Laptop Executive and 360 Model Sheet)
export const Mascot360Modal: React.FC<{ 
  onClose: () => void; 
  modelSheetSrc: string; 
  executiveSrc: string;
}> = ({ onClose, modelSheetSrc, executiveSrc }) => {
  const [modalTab, setModalTab] = useState<'executive' | 'modelSheet'>('executive');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#EAE1DD] overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#702D3D] text-white flex items-center justify-between border-b border-[#800020]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#D6B878]" />
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase font-heading text-white">
                RM Heaven Character & Mascot Specification
              </h3>
              <p className="text-[11px] text-white/80">
                Confident Lion Executive with Laptop · Turnaround Model Sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal View Switcher */}
        <div className="px-6 py-2.5 bg-[#F8F3EE] border-b border-[#EAE1DD] flex items-center gap-3">
          <button
            onClick={() => setModalTab('executive')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              modalTab === 'executive'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-white text-[#393333] border border-[#EAE1DD] hover:bg-[#F1E8DC]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-[#D6B878]" />
            <span>Lion Executive with Laptop (Full Character)</span>
          </button>
          <button
            onClick={() => setModalTab('modelSheet')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              modalTab === 'modelSheet'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-white text-[#393333] border border-[#EAE1DD] hover:bg-[#F1E8DC]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#D6B878]" />
            <span>360° Turnaround Model Sheet</span>
          </button>
        </div>

        {/* Image Container with high detail */}
        <div className="p-6 bg-[#FCFAF8] overflow-y-auto text-center space-y-4">
          {modalTab === 'executive' ? (
            <div className="space-y-4">
              <div className="border border-[#EAE1DD] rounded-2xl bg-white p-3 shadow-inner inline-block max-w-full">
                <img
                  src={executiveSrc}
                  alt="Confident Lion Executive with Laptop"
                  className="max-h-[62vh] w-auto mx-auto object-contain rounded-xl"
                />
              </div>
              <div className="max-w-2xl mx-auto text-xs text-[#817779] space-y-1">
                <p className="font-bold text-[#393333] text-sm">
                  Character Attributes & Equipment
                </p>
                <p>
                  Tailored Black Blazer · Crisp White Shirt · Leather Belt with Silver Buckle · Executive Wristwatch · Silver Ultrabook Laptop · Casual High-Top Striped Sneakers · Confident Thumbs-Up Gesture
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-[#EAE1DD] rounded-2xl bg-white p-3 shadow-inner inline-block max-w-full">
                <img
                  src={modelSheetSrc}
                  alt="Lion 360° Model Sheet showing complete turnaround poses"
                  className="max-h-[62vh] w-auto mx-auto object-contain rounded-xl"
                />
              </div>
              <div className="max-w-2xl mx-auto text-xs text-[#817779] space-y-1">
                <p className="font-bold text-[#393333] text-sm">
                  Turnaround Model Sheet Specifications
                </p>
                <p>
                  Front, 3/4 Perspective, Side Profiles, and Back Coat Turnaround Angles with Royal Lion Emblem.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F8F3EE] border-t border-[#EAE1DD] flex items-center justify-between">
          <span className="text-[11px] text-[#817779]">
            RM Heaven Official Mascot Identity
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-[#702D3D] hover:bg-[#800020] text-white rounded-xl transition-colors shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
