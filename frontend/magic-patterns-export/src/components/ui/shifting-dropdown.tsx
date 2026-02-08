import React, { useEffect, useState, Component } from 'react';
import {
  ArrowRight,
  SparklesIcon,
  TrendingUpIcon,
  HeartIcon,
  CalendarIcon,
  MessageSquareIcon,
  BookOpenIcon,
  ChevronDown } from
'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
export function ShiftingDropDown() {
  return (
    <div className="flex min-h-screen w-full justify-start bg-[#0a1628] px-8 py-5 text-white md:justify-center">
      <Tabs />
    </div>);

}
const Tabs = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [dir, setDir] = useState<null | 'l' | 'r'>(null);
  const handleSetSelected = (val: number | null) => {
    if (typeof selected === 'number' && typeof val === 'number') {
      setDir(selected > val ? 'r' : 'l');
    } else if (val === null) {
      setDir(null);
    }
    setSelected(val);
  };
  return (
    <div
      onMouseLeave={() => handleSetSelected(null)}
      className="relative flex h-fit gap-2">

      {TABS.map((t) => {
        return (
          <Tab
            key={t.id}
            selected={selected}
            handleSetSelected={handleSetSelected}
            tab={t.id}>

            {t.title}
          </Tab>);

      })}
      <AnimatePresence>
        {selected && <Content dir={dir} selected={selected} />}
      </AnimatePresence>
    </div>);

};
const Tab = ({
  children,
  tab,
  handleSetSelected,
  selected





}: {children: ReactNode;tab: number;handleSetSelected: (val: number | null) => void;selected: number | null;}) => {
  return (
    <button
      id={`shift-tab-${tab}`}
      onMouseEnter={() => handleSetSelected(tab)}
      onClick={() => handleSetSelected(tab)}
      className={`
        flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
        ${selected === tab ? 'bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30 text-white shadow-lg shadow-cyan-500/20' : 'text-white/70 hover:bg-[#1a2942]/40 hover:text-white border border-transparent'}
      `}>

      <span>{children}</span>
      <ChevronDown
        size={16}
        className={`text-white/60 transition-transform duration-200 ${selected === tab ? 'rotate-180 text-cyan-400' : ''}`} />

    </button>);

};
const Content = ({
  selected,
  dir



}: {selected: number | null;dir: null | 'l' | 'r';}) => {
  return (
    <motion.div
      id="overlay-content"
      initial={{
        opacity: 0,
        y: 8
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: 8
      }}
      className="absolute left-0 top-[calc(100%_+_24px)] w-96 rounded-3xl border border-cyan-500/30 bg-[#1a2942]/95 backdrop-blur-xl text-white shadow-xl shadow-cyan-500/10 p-6">

      <Bridge />
      <Nub selected={selected} />
      {TABS.map((t) => {
        return (
          <div className="overflow-hidden" key={t.id}>
            {selected === t.id &&
            <motion.div
              initial={{
                opacity: 0,
                x: dir === 'l' ? 100 : dir === 'r' ? -100 : 0
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.25,
                ease: 'easeInOut'
              }}>

                <t.Component />
              </motion.div>
            }
          </div>);

      })}
    </motion.div>);

};
const Bridge = () =>
<div className="absolute -top-[24px] left-0 right-0 h-[24px]" />;

const Nub = ({ selected }: {selected: number | null;}) => {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    moveNub();
  }, [selected]);
  const moveNub = () => {
    if (selected) {
      const hoveredTab = document.getElementById(`shift-tab-${selected}`);
      const overlayContent = document.getElementById('overlay-content');
      if (!hoveredTab || !overlayContent) return;
      const tabRect = hoveredTab.getBoundingClientRect();
      const { left: contentLeft } = overlayContent.getBoundingClientRect();
      const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;
      setLeft(tabCenter);
    }
  };
  return (
    <motion.span
      style={{
        clipPath: 'polygon(0 0, 100% 0, 50% 50%, 0% 100%)'
      }}
      animate={{
        left
      }}
      transition={{
        duration: 0.25,
        ease: 'easeInOut'
      }}
      className="absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#1a2942]/95 border border-cyan-500/30 shadow-sm" />);


};
const Features = () => {
  return (
    <div>
      <div className="flex gap-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-cyan-400">
            Core Tools
          </h3>
          <a
            href="/life-path"
            className="mb-2 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">

            <TrendingUpIcon className="w-4 h-4" />
            Life Path Analysis
          </a>
          <a
            href="/compatibility"
            className="mb-2 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">

            <HeartIcon className="w-4 h-4" />
            Compatibility
          </a>
          <a
            href="/birth-chart"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">

            <BookOpenIcon className="w-4 h-4" />
            Birth Chart
          </a>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-cyan-400">
            Daily Insights
          </h3>
          <a
            href="/daily-readings"
            className="mb-2 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">

            <CalendarIcon className="w-4 h-4" />
            Daily Readings
          </a>
          <a
            href="/forecasts"
            className="mb-2 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">

            <SparklesIcon className="w-4 h-4" />
            Forecasts
          </a>
          <a
            href="/chat"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">

            <MessageSquareIcon className="w-4 h-4" />
            AI Numerologist
          </a>
        </div>
      </div>
      <button className="ml-auto mt-4 flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
        <span>Explore All Features</span>
        <ArrowRight size={16} />
      </button>
    </div>);

};
const Pricing = () => {
  return (
    <div className="grid grid-cols-3 gap-4 divide-x divide-cyan-500/20">
      <a
        href="/pricing"
        className="flex w-full flex-col items-center justify-center py-3 text-white/70 transition-colors hover:text-white group">

        <div className="w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center group-hover:from-cyan-400/30 group-hover:to-blue-600/30 transition-all">
          <SparklesIcon className="h-6 w-6 text-cyan-400" />
        </div>
        <span className="text-xs font-semibold">Free</span>
        <span className="text-xs text-white/50 mt-1">$0/mo</span>
      </a>
      <a
        href="/pricing"
        className="flex w-full flex-col items-center justify-center py-3 text-white/70 transition-colors hover:text-white group">

        <div className="w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-purple-400/20 to-indigo-600/20 flex items-center justify-center group-hover:from-purple-400/30 group-hover:to-indigo-600/30 transition-all">
          <TrendingUpIcon className="h-6 w-6 text-purple-400" />
        </div>
        <span className="text-xs font-semibold">Premium</span>
        <span className="text-xs text-white/50 mt-1">$9.99/mo</span>
      </a>
      <a
        href="/pricing"
        className="flex w-full flex-col items-center justify-center py-3 text-white/70 transition-colors hover:text-white group">

        <div className="w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-600/20 flex items-center justify-center group-hover:from-amber-400/30 group-hover:to-orange-600/30 transition-all">
          <SparklesIcon className="h-6 w-6 text-amber-400" />
        </div>
        <span className="text-xs font-semibold">Enterprise</span>
        <span className="text-xs text-white/50 mt-1">$29.99/mo</span>
      </a>
    </div>);

};
const Resources = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <a
          href="/blog"
          className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 overflow-hidden">

          <img
            className="mb-2 h-20 w-full rounded-xl object-cover"
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop"
            alt="Numerology insights" />

          <h4 className="mb-1 text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
            Understanding Life Paths
          </h4>
          <p className="text-xs text-white/60">
            Discover the meaning behind your core numbers and life journey.
          </p>
        </a>
        <a
          href="/blog"
          className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 overflow-hidden">

          <img
            className="mb-2 h-20 w-full rounded-xl object-cover"
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop"
            alt="Cosmic guidance" />

          <h4 className="mb-1 text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
            Cosmic Compatibility
          </h4>
          <p className="text-xs text-white/60">
            Learn how numerology reveals relationship harmony and connections.
          </p>
        </a>
      </div>
      <button className="ml-auto mt-4 flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
        <span>Read More Articles</span>
        <ArrowRight size={16} />
      </button>
    </div>);

};
const TABS = [
{
  title: 'Features',
  Component: Features
},
{
  title: 'Pricing',
  Component: Pricing
},
{
  title: 'Resources',
  Component: Resources
}].
map((n, idx) => ({
  ...n,
  id: idx + 1
}));