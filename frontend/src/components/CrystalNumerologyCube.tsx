interface CrystalNumerologyCubeProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'blue' | 'pink' | 'green' | 'amber';
  className?: string;
}
export function CrystalNumerologyCube({
  number,
  size = 'md',
  color = 'cyan',
  className = ''
}: CrystalNumerologyCubeProps) {
  const sizeMap = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-24 h-24 text-4xl'
  };
  const colorMap = {
    cyan: {
      gradient: 'from-cyan-400 to-blue-500',
      border: 'border-cyan-400/30',
      shadow: 'shadow-cyan-500/20',
      text: 'text-cyan-400'
    },
    purple: {
      gradient: 'from-purple-400 to-indigo-500',
      border: 'border-purple-400/30',
      shadow: 'shadow-purple-500/20',
      text: 'text-purple-400'
    },
    blue: {
      gradient: 'from-blue-400 to-indigo-500',
      border: 'border-blue-400/30',
      shadow: 'shadow-blue-500/20',
      text: 'text-blue-400'
    },
    pink: {
      gradient: 'from-pink-400 to-rose-500',
      border: 'border-pink-400/30',
      shadow: 'shadow-pink-500/20',
      text: 'text-pink-400'
    },
    green: {
      gradient: 'from-green-400 to-emerald-500',
      border: 'border-green-400/30',
      shadow: 'shadow-green-500/20',
      text: 'text-green-400'
    },
    amber: {
      gradient: 'from-amber-400 to-orange-500',
      border: 'border-amber-400/30',
      shadow: 'shadow-amber-500/20',
      text: 'text-amber-400'
    }
  };
  const colors = colorMap[color];
  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      {/* Simple, clean card with subtle depth */}
      <div
        className={`
          w-full h-full rounded-2xl
          bg-gradient-to-br ${colors.gradient}
          border ${colors.border}
          shadow-xl ${colors.shadow}
          flex items-center justify-center
          relative overflow-hidden
        `}>

        {/* Subtle shine effect (static) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />

        {/* Number */}
        <span className="relative z-10 font-bold font-serif text-white">
          {number}
        </span>
      </div>
    </div>);

}