'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles, Ship, Flame, Waves, Moon, HeartPulse, BookOpen,
  Star, Wind, Cloud, Droplets, Mountain, Crown, Wheat,
  Sun, Feather, Leaf, ChevronLeft, Eye, Scale, Fish, Shield, Wand2,
} from 'lucide-react';
import treeData from '@/data/prophets-tree.json';
import { Reveal } from './reveal';
import { arabic } from './ui';
import { FavoriteButton } from './favorite-button';

// ============================================================
// خريطة الأيقونات
// ============================================================
const ICON_MAP: Record<string, any> = {
  sparkles: Sparkles,
  ship: Ship,
  flame: Flame,
  waves: Waves,
  moon: Moon,
  'heart-pulse': HeartPulse,
  'book-open': BookOpen,
  star: Star,
  wind: Wind,
  cloud: Cloud,
  droplets: Droplets,
  mountain: Mountain,
  crown: Crown,
  wheat: Wheat,
  sun: Sun,
  feather: Feather,
  leaf: Leaf,
  eye: Eye,
  scale: Scale,
  fish: Fish,
  shield: Shield,
  wand: Wand2,
};

type Prophet = (typeof treeData.prophets)[number];

type Particle = {
  x: string;
  y: string;
  delay: string;
  duration: string;
  size: string;
};

// ============================================================
// المكوّن الرئيسي
// ============================================================
export function ProphetsTree() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { prophets } = treeData;

  // ============================================================
  // 1. تجميع الأنبياء حسب الجيل
  // ============================================================
  const byGeneration = prophets.reduce((acc, p) => {
    (acc[p.generation] ||= []).push(p);
    return acc;
  }, {} as Record<number, Prophet[]>);

  // ============================================================
  // 2. ترتيب الأجيال: آدم (0) أولًا ← محمد (13) أخيرًا
  // ============================================================
  const generations = Object.keys(byGeneration)
    .map(Number)
    .sort((a, b) => b - a)
    .reverse();

  // ============================================================
  // 3. توليد الجزيئات بعد mount فقط
  // ============================================================
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${8 + Math.random() * 6}s`,
        size: `${2 + Math.random() * 4}px`,
      }))
    );
  }, []);

  // ============================================================
  // 4. ظهور تدريجي حسب الجيل
  // ============================================================
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const sorted = [...prophets].sort(
            (a, b) => a.generation - b.generation
          );
          sorted.forEach((p, i) => {
            setTimeout(() => {
              setVisibleIds((prev) => new Set(prev).add(p.id));
            }, i * 120);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [prophets]);

  // ============================================================
  // العرض
  // ============================================================
  return (
    <div className="prophets-tree-section" ref={containerRef}>

      {/* ============ خلفية متحركة متعددة الطبقات ============ */}
      <div className="tree-bg" aria-hidden="true">
        <div className="tree-grid-move" />

        <div className="tree-rays">
          <span className="ray ray-1" />
          <span className="ray ray-2" />
          <span className="ray ray-3" />
          <span className="ray ray-4" />
          <span className="ray ray-5" />
        </div>

        <div className="tree-glow tree-glow-1" />
        <div className="tree-glow tree-glow-2" />
        <div className="tree-stars" />

        <div className="tree-shooting-stars">
          <span
            className="shooting-star"
            style={{ '--delay': '0s', '--x': '10%', '--y': '20%' } as React.CSSProperties}
          />
          <span
            className="shooting-star"
            style={{ '--delay': '1.5s', '--x': '30%', '--y': '40%' } as React.CSSProperties}
          />
          <span
            className="shooting-star"
            style={{ '--delay': '3s', '--x': '70%', '--y': '15%' } as React.CSSProperties}
          />
          <span
            className="shooting-star"
            style={{ '--delay': '4.5s', '--x': '85%', '--y': '60%' } as React.CSSProperties}
          />
          <span
            className="shooting-star"
            style={{ '--delay': '6s', '--x': '20%', '--y': '75%' } as React.CSSProperties}
          />
          <span
            className="shooting-star"
            style={{ '--delay': '7.5s', '--x': '50%', '--y': '30%' } as React.CSSProperties}
          />
        </div>

        <div className="tree-particles">
          {particles.map((p, i) => (
            <span
              key={i}
              className="particle"
              style={{
                '--x': p.x,
                '--y': p.y,
                '--delay': p.delay,
                '--duration': p.duration,
                '--size': p.size,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="tree-ornaments">
          <span className="ornament ornament-1">۞</span>
          <span className="ornament ornament-2">✦</span>
          <span className="ornament ornament-3">✧</span>
          <span className="ornament ornament-4">۞</span>
          <span className="ornament ornament-5">✦</span>
        </div>
      </div>

      {/* ============ الرأس ============ */}
      <Reveal className="tree-header" animation="fade-up">
        <span className="tree-eyebrow">
          <Leaf size={14} />
          سلسلة النبوّة · ٢٥ نبيًّا
        </span>
        <h1 className="tree-title">شجرة الأنبياء</h1>
        <p className="tree-subtitle">
          من آدم عليه السلام... نزولًا إلى خاتم النبيين محمد ﷺ
        </p>
      </Reveal>

      {/* ============ الشجرة ============ */}
      <div className="tree-canvas">
        <div className="tree-trunk" aria-hidden="true">
          <div className="tree-trunk-line" />
        </div>

        <div className="tree-generations">
          {generations.map((gen, genIndex) => (
            <div
              key={gen}
              className="tree-generation"
              data-gen={arabic(genIndex + 1)}
            >
              <div className="tree-generation-row">
                {byGeneration[gen].map((prophet) => {
                  const Icon = ICON_MAP[prophet.miracleIcon] || Sparkles;
                  const isVisible = visibleIds.has(prophet.id);
                  const isActive = activeId === prophet.id;
                  const isFinal = (prophet as any).isFinal;

                  return (
                    <div
                      key={prophet.id}
                      className={
                        'prophet-node' +
                        (isVisible ? ' is-visible' : '') +
                        (isActive ? ' is-active' : '') +
                        (isFinal ? ' is-final' : '')
                      }
                      onMouseEnter={() => setActiveId(prophet.id)}
                      onMouseLeave={() => setActiveId(null)}
                    >
                      <span className="node-branch" aria-hidden="true" />

                      <span className="node-card">
                        <span className="node-visual">
                          <span className="node-visual-bg" />
                          <Image
                            src={`/images/prophets/${prophet.slug}.png`}
                            alt={`معجزة ${prophet.name}: ${prophet.miracle}`}
                            fill
                            sizes="(max-width: 768px) 160px, 220px"
                            className="node-image"
                          />
                          {isFinal && (
                            <span className="node-crown" aria-hidden="true">
                              ✦
                            </span>
                          )}

                          {/* ← زر المفضلة */}
                          <FavoriteButton
                            itemType="story"
                            itemId={prophet.slug}
                            itemLabel={`قصة ${prophet.name}`}
                            itemPreview={prophet.miracle}
                            itemMeta={{
                              title: prophet.title,
                              generation: prophet.generation,
                            }}
                            size="sm"
                            variant="overlay"
                          />
                        </span>

                        <span className="node-body">
                          <span className="node-name">{prophet.name}</span>
                          <span className="node-title">{prophet.title}</span>
                          <span className="node-miracle">
                            <Icon size={12} />
                            {prophet.miracle}
                          </span>
                        </span>
                      </span>

                      <Link
                        href={`/stories/${prophet.slug}/`}
                        className="node-link"
                        aria-label={`اقرأ قصة ${prophet.name}`}
                      >
                        القصة
                        <ChevronLeft size={13} />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {genIndex < generations.length - 1 && (
                <div className="tree-connector" aria-hidden="true">
                  <span className="connector-line" />
                  <span className="connector-dot">
                    <span className="connector-number">
                      {arabic(genIndex + 2)}
                    </span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============ الخاتمة ============ */}
      <Reveal className="tree-footer" animation="fade-up" delay={600}>
        <p className="tree-verse">
          ﴿ إِنَّ اللَّهَ اصْطَفَى آدَمَ وَنُوحًا وَآلَ إِبْرَاهِيمَ وَآلَ عِمْرَانَ عَلَى الْعَالَمِينَ ﴾
        </p>
        <small>سورة آل عمران · الآية ٣٣</small>
      </Reveal>
    </div>
  );
}